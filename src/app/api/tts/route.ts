import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 40;
const RATE_WINDOW = 60_000;

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

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.error("[tts] OPENAI_API_KEY is not configured");
    return null;
  }
  return new OpenAI({ apiKey: key });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const openai = getOpenAI();
  if (!openai) {
    return NextResponse.json({ error: "Voice playback is unavailable." }, { status: 500 });
  }

  try {
    const { text } = (await request.json()) as { text?: string };
    const clean = (text ?? "").trim().slice(0, 4000);
    if (!clean) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const speech = await openai.audio.speech.create({
      model: "tts-1",
      voice: "shimmer", // warm, friendly receptionist voice
      input: clean,
      response_format: "mp3",
    });

    const buffer = Buffer.from(await speech.arrayBuffer());
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[tts] error:", err);
    return NextResponse.json({ error: "Speech generation failed" }, { status: 500 });
  }
}
