/**
 * OPT-IN live eval of the booking assistant (Roomy). NOT run in CI.
 *
 * ⚠️  This calls the real OpenAI-backed /api/chat on a RUNNING dev server, so it:
 *      - COSTS API credits, and
 *      - is NON-DETERMINISTIC — the model can respond differently each run, so a
 *        borderline case may occasionally flap. Re-run before trusting a failure.
 *
 * ✅  It ONLY inspects what the model OUTPUTS (dates / BOOKING_DATA). It NEVER
 *     calls /api/book, so it creates NO real bookings and sends NO emails.
 *
 * The deterministic regression net is src/lib/booking-validation.test.ts (runs
 * in CI, free, instant). This script is the periodic "is the model itself still
 * behaving?" smoke check — run it after prompt/model changes.
 *
 *   1) start the dev server (npm run dev)
 *   2) node scripts/eval-booking.mjs          (or BASE_URL=... node scripts/eval-booking.mjs)
 */

const BASE = process.env.BASE_URL || "http://localhost:3000";
const VISITING = ["nentwig", "yue weng", "cheu"]; // must never be booked

function futureWindow() {
  const now = new Date();
  const iso = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const min = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  min.setDate(min.getDate() + 1);
  const max = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  max.setFullYear(max.getFullYear() + 1);
  return { min: iso(min), max: iso(max) };
}

async function chat(messages) {
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok || !res.body) throw new Error(`/api/chat HTTP ${res.status}`);
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let full = "", buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") break;
      try { const p = JSON.parse(data); if (p.content) full += p.content; } catch { /* skip */ }
    }
  }
  return full;
}

const extractIso = (t) => t.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0] ?? null;
function extractBooking(t) {
  const m = t.match(/<<<BOOKING_DATA>>>([\s\S]*?)<<<END_BOOKING>>>/);
  if (!m) return null;
  try { return JSON.parse(m[1].trim()); } catch { return null; }
}

// Each scenario probes a way the model historically produced a bad date, or an
// attempt to book a visiting consultant.
const SCENARIOS = [
  { name: "partial date ('the 18th')", turns: [
    "I'd like to book a teeth cleaning for the 18th at 10am. My name is Test User, email test@example.com.",
    "Yes please confirm.",
  ] },
  { name: "relative date ('next Monday')", turns: [
    "Book me a checkup next Monday at 2pm. Name Test User, phone 012345678.",
    "Yes, confirm.",
  ] },
  { name: "requests a visiting consultant", turns: [
    "I want to book with Prof. Nentwig for implants next month. Name Test, email t@e.com.",
    "Ok, whoever is available then — please confirm.",
  ] },
];

async function main() {
  const { min, max } = futureWindow();
  let pass = 0, fail = 0;
  for (const sc of SCENARIOS) {
    const history = [];
    let full = "";
    for (const turn of sc.turns) {
      history.push({ role: "user", content: turn });
      full = await chat(history);
      history.push({ role: "assistant", content: full });
    }
    const booking = extractBooking(full);
    const bookingDate = booking?.date ?? extractIso(full);
    const bookingDoctor = String(booking?.doctor ?? "").toLowerCase();

    const problems = [];
    if (bookingDate && (bookingDate < min || bookingDate > max)) {
      problems.push(`date outside future window: ${bookingDate}`);
    }
    if (VISITING.some((v) => bookingDoctor.includes(v))) {
      problems.push(`tried to book a visiting consultant: ${booking?.doctor}`);
    }

    if (problems.length) {
      fail++;
      console.log(`✗ ${sc.name}\n    ${problems.join("\n    ")}\n    (model date: ${bookingDate ?? "none"})`);
    } else {
      pass++;
      console.log(`✓ ${sc.name} (model date: ${bookingDate ?? "none"})`);
    }
  }
  console.log(
    `\n${pass}/${pass + fail} passed · future window ${min}..${max}` +
    `\nNote: live model output is non-deterministic — re-run if a borderline case flaps. No bookings were created.`,
  );
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error("eval failed:", e.message); process.exit(1); });
