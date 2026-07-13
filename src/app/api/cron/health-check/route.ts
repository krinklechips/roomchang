import { NextRequest, NextResponse } from "next/server";
import { checkSiteHealth, checkPages, type PageCheck } from "@/lib/health";
import { sendTelegramAlert } from "@/lib/alert";

/**
 * Vercel Cron target (see vercel.json "crons") — runs twice a day (08:00 &
 * 18:00 Phnom Penh). Every run posts a full checklist to Telegram:
 *   - healthy → a "✅ all clear" checklist so the clinic sees it's being watched
 *   - broken  → a "🚨 ALERT" with the failed items called out + fix hint,
 *               and a 500 so the run also shows FAILED in Vercel's dashboard.
 *
 * Checks: SMTP mailbox login, Supabase, key pages (en/kh/cn/contact/services/
 * team), the /intl + /admin proxies, and the unread-enquiry backlog. Instant
 * (not twice-daily) alerts for the email-outage case come separately from the
 * mailer itself (src/lib/mailer.ts fires an alert the moment a send fails).
 *
 * Auth: when CRON_SECRET is set, Vercel sends it as a Bearer token; the manual
 * test link uses ?key=<CRON_SECRET>. Anything else is rejected so outsiders
 * can't spam the clinic's Telegram group.
 */
export const dynamic = "force-dynamic";

function ppStamp(): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Phnom_Penh",
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(new Date());
}

type Item = { label: string; ok: boolean; detail: string };

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const url = new URL(request.url);

  // Test mode: ?test=1&key=<CRON_SECRET> fires a test alert to verify the
  // channel without waiting for a scheduled run. Requires CRON_SECRET.
  if (url.searchParams.get("test") === "1") {
    if (!secret) {
      return NextResponse.json(
        { error: "Set CRON_SECRET in Vercel env to enable test mode" },
        { status: 403 },
      );
    }
    if (url.searchParams.get("key") !== secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const test = await sendTelegramAlert(
      "✅ Roomchang monitoring test — Telegram alerts are wired correctly. " +
        "You'll get a checklist twice a day, and an instant alert the moment email, the database, or a key page breaks.",
    );
    return NextResponse.json(
      test.ok ? { ok: true, sent: true } : { ok: false, error: test.error },
      { status: test.ok ? 200 : 500 },
    );
  }

  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [health, pages] = await Promise.all([checkSiteHealth(), checkPages()]);

  const items: Item[] = [
    { label: "Email (SMTP login)", ok: health.smtp.ok, detail: health.smtp.ok ? "OK" : (health.smtp.error ?? "failed") },
    { label: "Database", ok: health.db.ok, detail: health.db.ok ? "OK" : (health.db.error ?? "failed") },
    ...pages.map((p: PageCheck): Item => ({ label: p.label, ok: p.ok, detail: String(p.status) })),
  ];

  const backlog =
    health.enquiriesLast24h == null
      ? "New enquiries (24h): (unknown)"
      : `New enquiries (24h): ${health.enquiriesLast24h}`;

  const allOk = items.every((i) => i.ok);
  const checklist = items.map((i) => `${i.ok ? "✓" : "✗"} ${i.label} — ${i.detail}`).join("\n");
  const stamp = ppStamp();

  if (allOk) {
    await sendTelegramAlert(`✅ Roomchang health check — all clear · ${stamp}\n\n${checklist}\n• ${backlog}`);
    return NextResponse.json({ ok: true, checkedAt: health.checkedAt });
  }

  const failed = items.filter((i) => !i.ok);
  const emailBroke = !health.smtp.ok;
  const fixHint = emailBroke
    ? "\n\nEMAIL is down — enquiry notifications are NOT reaching the clinic (enquiries are still saved). Fix: SiteGround → reset the mailbox password, update SMTP_PASS in Vercel, redeploy."
    : "";
  await sendTelegramAlert(
    `🚨 ROOMCHANG ALERT · ${stamp}\n\nFAILED:\n${failed.map((i) => `✗ ${i.label} — ${i.detail}`).join("\n")}` +
      `\n\nFull check:\n${checklist}\n• ${backlog}${fixHint}\n\nHealth: https://www.roomchang.com/api/health`,
  );
  return NextResponse.json(
    { ok: false, failed: failed.map((i) => i.label), checkedAt: health.checkedAt },
    { status: 500 },
  );
}
