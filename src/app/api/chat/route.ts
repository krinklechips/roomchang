import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getChatbotContext } from "@/lib/chatbot-context";
import { buildSystemPrompt } from "@/lib/chatbot-system-prompt";

// ─── Rate limiter (in-memory, per-IP) ────────────────────────────────────────

const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // messages per window
const RATE_WINDOW = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// ─── OpenAI client ───────────────────────────────────────────────────────────

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.error("[chat] OPENAI_API_KEY is not configured");
    return null;
  }
  return new OpenAI({ apiKey: key });
}

// ─── Route handler ───────────────────────────────────────────────────────────

type ChatMsg = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 20;
const MAX_MSG_LENGTH = 1000;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a moment." },
        { status: 429 },
      );
    }

    // Parse + validate
    const body = await request.json();
    const messages: ChatMsg[] = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 },
      );
    }

    // Truncate conversation to last N messages
    const trimmed = messages.slice(-MAX_MESSAGES).map((m) => ({
      role: m.role as "user" | "assistant",
      content:
        typeof m.content === "string"
          ? m.content.slice(0, MAX_MSG_LENGTH)
          : "",
    }));

    // Build system prompt with live context
    const ctx = await getChatbotContext();
    const systemPrompt = buildSystemPrompt(ctx);

    const openai = getOpenAI();
    if (!openai) {
      return NextResponse.json(
        { error: "Chat service unavailable" },
        { status: 503 },
      );
    }

    // Call OpenAI with streaming
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...trimmed,
      ],
      stream: true,
      max_tokens: 800,
      temperature: 0.7,
    });

    // Convert to SSE ReadableStream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          console.error("[chat] Stream error:", err);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream interrupted" })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[chat] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
