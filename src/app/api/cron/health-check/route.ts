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
