import { NextRequest, NextResponse } from "next/server";
import { checkSiteHealth, sendTelegramAlert } from "@/lib/health";

/**
 * Vercel Cron target (see vercel.json "crons") — runs twice a day.
 *
 * Healthy  → 200, no notification (quiet).
 * Broken   → sends a Telegram alert (independent of the site's SMTP, which is
 *            the most likely thing to be broken) and returns 500 so the run
 *            also shows as FAILED in Vercel's cron dashboard.
 *
 * Auth: when CRON_SECRET is set, Vercel sends it as a Bearer token — reject
 * anything else so outsiders can't trigger alert spam.
 */
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const url = new URL(request.url);

  // Test mode: ?test=1&key=<CRON_SECRET> fires a test Telegram alert so the
  // channel can be verified without waiting for a real outage. Requires
  // CRON_SECRET (403 otherwise) so strangers can't spam the clinic's chat.
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
        "You'll get a message like this whenever the site's email login, database, or key pages break.",
    );
    return NextResponse.json(
      test.ok ? { ok: true, sent: true } : { ok: false, error: test.error },
      { status: test.ok ? 200 : 500 },
    );
  }

  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const health = await checkSiteHealth();

  if (health.ok) {
    return NextResponse.json({ ok: true, checkedAt: health.checkedAt });
  }

  const problems: string[] = [];
  if (!health.smtp.ok) {
    problems.push(
      `EMAIL BROKEN: SMTP login failing (${health.smtp.error ?? "unknown error"}). ` +
        `Enquiry notifications are NOT reaching the clinic — patients still see the success screen. ` +
        `Fix: SiteGround Site Tools → Email → reset mailbox password, then update SMTP_PASS in Vercel and redeploy. ` +
        `Enquiries are still being saved to Supabase (${health.unreadEnquiries ?? "?"} unread).`,
    );
  }
  if (!health.db.ok) {
    problems.push(`DATABASE UNREACHABLE: ${health.db.error ?? "unknown error"} — site content and enquiry storage at risk.`);
  }

  const message = `🚨 ROOMCHANG SITE ALERT (${health.checkedAt})\n\n${problems.join("\n\n")}\n\nHealth: https://www.roomchang.com/api/health`;
  const alert = await sendTelegramAlert(message);
  if (!alert.ok) {
    // Fail loud in logs — the 500 below still marks the cron run as failed in
    // Vercel even when no Telegram channel is configured.
    console.error("[health-cron] alert delivery failed:", alert.error, "| problems:", problems.join(" | "));
  }

  return NextResponse.json(
    { ok: false, problems, alertDelivered: alert.ok, checkedAt: health.checkedAt },
    { status: 500 },
  );
}
