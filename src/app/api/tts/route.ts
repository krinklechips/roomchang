import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createHash } from "crypto";

// ─── In-memory audio cache ───────────────────────────────────────────────────
// The greeting (and many canned replies) are identical every time. Caching the
// generated mp3 by text hash lets a warm instance replay them instantly instead
// of paying the full OpenAI generation round-trip on each voice-mode entry.
// Note: serverless cold starts drop this cache; for a guaranteed-instant
// greeting we'd pre-generate static audio per locale (follow-up).
const TTS_VOICE = "shimmer";
const TTS_MODEL = "tts-1";
const audioCache = new Map<string, ArrayBuffer>();
const CACHE_MAX = 50;

function cacheKey(text: string): string {
  return createHash("sha256").update(`${TTS_MODEL}:${TTS_VOICE}:${text}`).digest("hex");
}

function cacheGet(key: string): ArrayBuffer | undefined {
  const hit = audioCache.get(key);
  if (hit) {
    // refresh LRU position
    audioCache.delete(key);
    audioCache.set(key, hit);
  }
  return hit;
}

function cacheSet(key: string, buf: ArrayBuffer): void {
  audioCache.set(key, buf);
  while (audioCache.size > CACHE_MAX) {
    const oldest = audioCache.keys().next().value;
    if (oldest === undefined) break;
    audioCache.delete(oldest);
  }
}

function mp3Response(audio: ArrayBuffer, cache: "hit" | "miss"): NextResponse {
  return new NextResponse(new Uint8Array(audio), {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "private, max-age=86400",
      "x-tts-cache": cache,
    },
  });
}

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

    const key = cacheKey(clean);
    const cached = cacheGet(key);
    if (cached) {
      return mp3Response(cached, "hit");
    }

    const speech = await openai.audio.speech.create({
      model: TTS_MODEL,
      voice: TTS_VOICE, // warm, friendly receptionist voice
      input: clean,
      response_format: "mp3",
    });

    const audio = await speech.arrayBuffer();
    cacheSet(key, audio);
    return mp3Response(audio, "miss");
  } catch (err) {
    console.error("[tts] error:", err);
    return NextResponse.json({ error: "Speech generation failed" }, { status: 500 });
  }
}
