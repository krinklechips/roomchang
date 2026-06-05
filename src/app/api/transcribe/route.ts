import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Per-IP rate limit so the Whisper endpoint can't be abused.
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
    console.error("[transcribe] OPENAI_API_KEY is not configured");
    return null;
  }
  return new OpenAI({ apiKey: key });
}

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB cap

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const openai = getOpenAI();
  if (!openai) {
    return NextResponse.json({ error: "Voice transcription is unavailable." }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const audio = formData.get("audio");
    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json({ error: "No audio provided" }, { status: 400 });
    }
    if (audio.size > MAX_BYTES) {
      return NextResponse.json({ error: "Audio too large" }, { status: 413 });
    }

    const transcription = await openai.audio.transcriptions.create({
      file: audio,
      model: "whisper-1",
      language: "en", // English only for now
    });

    return NextResponse.json({ text: (transcription.text ?? "").trim() });
  } catch (err) {
    console.error("[transcribe] error:", err);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
