// Pure, server-dependency-free booking validators + sanitizers.
// Extracted from /api/book so they can be unit-tested and reused. The rule:
// every value the chat model emits is validated/sanitized here against ground
// truth before it can reach a real booking (see project_chatbot_ai_guardrails).
import { BRANCHES } from "./branches";

export const CLINIC_TZ = "Asia/Phnom_Penh";

// ─── Date / time ─────────────────────────────────────────────────────────────

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && value === date.toISOString().slice(0, 10);
}

export function isSunday(value: string): boolean {
  return new Date(`${value}T00:00:00.000Z`).getUTCDay() === 0;
}

/** Today's date (YYYY-MM-DD) in the clinic's timezone. */
export function clinicToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CLINIC_TZ, year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
}

// The bookable window: tomorrow through ~1 year out (clinic-local). YYYY-MM-DD
// strings compare correctly with lexicographic ordering. `todayIso` is injectable
// so tests are deterministic.
export function bookableWindow(todayIso: string = clinicToday()): { min: string; max: string } {
  const [y, m, d] = todayIso.split("-").map(Number);
  const base = Date.UTC(y, m - 1, d);
  const min = new Date(base + 86_400_000).toISOString().slice(0, 10); // tomorrow
  const maxDate = new Date(base);
  maxDate.setUTCFullYear(maxDate.getUTCFullYear() + 1);
  return { min, max: maxDate.toISOString().slice(0, 10) };
}

/** Reject the past (or > ~1yr out) even when the string is otherwise a valid date. */
export function isBookableDate(value: string, todayIso: string = clinicToday()): boolean {
  if (!isValidDate(value)) return false;
  const { min, max } = bookableWindow(todayIso);
  return value >= min && value <= max;
}

export function buildSlotTimes(): Set<string> {
  const slots = new Set<string>();
  for (let hour = 8; hour <= 17; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 17 && minute === 30) continue;
      slots.add(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    }
  }
  return slots;
}

export const SLOT_TIMES = buildSlotTimes();

export function normalizeTime(value: string): string {
  const match = value.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
  if (!match) return "";
  return `${match[1]}:${match[2]}`;
}

export function isBookableTime(value: string): boolean {
  return SLOT_TIMES.has(normalizeTime(value));
}

// ─── Optional fields: sanitize (don't block the patient), never record junk ──

const normName = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Map an optional preferred branch to a canonical Roomchang branch name, or ""
 * if it doesn't match one — so a hallucinated/unknown branch is dropped rather
 * than recorded. Matches on slug or a name substring (survives short/partial
 * names like "Sisowath High School").
 */
export function sanitizeBranch(raw: string): string {
  const q = normName(raw);
  if (!q) return "";
  const hit = BRANCHES.find((b) => {
    const slug = normName(b.slug);
    const name = normName(b.name);
    return q === slug || name.includes(q) || q.includes(slug);
  });
  return hit ? hit.name : "";
}

// Distinctive name tokens (≥4 chars), dropping titles like "Dr"/"Prof".
function nameTokens(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((t) => t.length >= 4 && t !== "prof" && t !== "doctor");
}

/**
 * Keep an optional preferred doctor only if it shares a distinctive name token
 * with one of the given resident dentists — so a visiting consultant or an
 * unknown/invented name is dropped (""), never recorded. Pass ONLY resident
 * names (exclude visiting consultants, i.e. department === "SENIOR_CONSULTANT").
 * Token matching survives "Dr." prefixes and partial names like "Dr. Aliza".
 * Returns the canonical resident name on a match.
 */
export function sanitizeDoctor(raw: string, residentNames: string[]): string {
  const qTokens = nameTokens(raw);
  if (qTokens.length === 0) return "";
  const hit = residentNames.find((n) => {
    const nTokens = nameTokens(n);
    return qTokens.some((qt) => nTokens.includes(qt));
  });
  return hit ?? "";
}
