import { verifySmtp } from "@/lib/mailer";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Shared site-health checks, used by:
 *  - GET /api/health            (external monitors poll it; 503 when broken)
 *  - GET /api/cron/health-check (Vercel Cron, twice daily; Telegram alert)
 *
 * These cover the dependencies that fail SILENTLY — most importantly the
 * SMTP mailbox login: in July 2026 a changed SiteGround password black-holed
 * enquiry notifications for 2 days while patients saw the success screen.
 */

export type HealthReport = {
  ok: boolean;
  checkedAt: string;
  smtp: { ok: boolean; error?: string };
  db: { ok: boolean; error?: string };
  unreadEnquiries: number | null;
  oldestUnreadHours: number | null;
};

// SMTP verify performs a real login — cache the result briefly so an
// aggressive uptime monitor can't hammer SiteGround into rate-limiting us.
const SMTP_CACHE_MS = 10 * 60 * 1000;
let smtpCache: { at: number; result: { ok: boolean; error?: string } } | null = null;

export async function checkSiteHealth(): Promise<HealthReport> {
  const now = Date.now();

  if (!smtpCache || now - smtpCache.at > SMTP_CACHE_MS) {
    smtpCache = { at: now, result: await verifySmtp() };
  }
  const smtp = smtpCache.result;

  let db: { ok: boolean; error?: string } = { ok: true };
  let unreadEnquiries: number | null = null;
  let oldestUnreadHours: number | null = null;
  try {
    const { data, error, count } = await supabaseAdmin
      .from("enquiries")
      .select("createdAt", { count: "exact" })
      .eq("read", false)
      .order("createdAt", { ascending: true })
      .limit(1);
    if (error) {
      db = { ok: false, error: error.message };
    } else {
      unreadEnquiries = count ?? 0;
      const oldest = data?.[0]?.createdAt;
      if (oldest) {
        oldestUnreadHours = Math.round((now - new Date(oldest).getTime()) / 3_600_000);
      }
    }
  } catch (e) {
    db = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return {
    ok: smtp.ok && db.ok,
    checkedAt: new Date(now).toISOString(),
    smtp,
    db,
    unreadEnquiries,
    oldestUnreadHours,
  };
}

/**
 * Alert channel for broken-site notifications. Telegram, deliberately NOT
 * email: when the thing that's broken IS email (the usual case), an email
 * alert would never arrive. Configure with:
 *   TELEGRAM_BOT_TOKEN      from @BotFather
 *   TELEGRAM_ALERT_CHAT_ID  the chat/group to notify
 * No-op (returns ok:false with reason) when unconfigured.
 */
export async function sendTelegramAlert(text: string): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ALERT_CHAT_ID;
  if (!token || !chatId) return { ok: false, error: "Telegram alerting not configured" };
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    });
    if (!res.ok) return { ok: false, error: `Telegram API ${res.status}: ${await res.text()}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
