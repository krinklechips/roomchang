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
  // Enquiries received in the last 24h — a "the form is getting leads" signal.
  // (The `read` flag is never set by the live flow, so an unread count would
  // just grow forever; a rolling 24h count is the meaningful number.)
  enquiriesLast24h: number | null;
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
  let enquiriesLast24h: number | null = null;
  try {
    const since = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    // head:true → count only, no rows fetched. Doubles as the DB reachability probe.
    const { error, count } = await supabaseAdmin
      .from("enquiries")
      .select("id", { count: "exact", head: true })
      .gte("createdAt", since);
    if (error) {
      db = { ok: false, error: error.message };
    } else {
      enquiriesLast24h = count ?? 0;
    }
  } catch (e) {
    db = { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return {
    ok: smtp.ok && db.ok,
    checkedAt: new Date(now).toISOString(),
    smtp,
    db,
    enquiriesLast24h,
  };
}

/** One page/proxy reachability result for the twice-daily checklist. */
export type PageCheck = { label: string; url: string; ok: boolean; status: number | string };

// The user-visible pages + the two Anabasis-proxied zones. Fetched against the
// canonical production host so the check exercises the real path (CDN + proxy),
// not localhost. Only run by the twice-daily cron, NOT by /api/health (which
// stays lightweight for high-frequency external monitors).
const MONITORED_PAGES: { label: string; url: string }[] = [
  { label: "Homepage /en", url: "https://www.roomchang.com/en" },
  { label: "Khmer /kh", url: "https://www.roomchang.com/kh" },
  { label: "Chinese /cn", url: "https://www.roomchang.com/cn" },
  { label: "Contact page", url: "https://www.roomchang.com/en/contact" },
  { label: "Services", url: "https://www.roomchang.com/en/services" },
  { label: "Team", url: "https://www.roomchang.com/en/team" },
  { label: "/intl proxy", url: "https://www.roomchang.com/intl/au" },
  { label: "/admin proxy", url: "https://www.roomchang.com/admin" },
];

export async function checkPages(): Promise<PageCheck[]> {
  return Promise.all(
    MONITORED_PAGES.map(async ({ label, url }) => {
      try {
        const res = await fetch(url, {
          headers: { Accept: "text/html" },
          redirect: "follow",
          signal: AbortSignal.timeout(10_000),
        });
        return { label, url, ok: res.ok, status: res.status };
      } catch (e) {
        return { label, url, ok: false, status: e instanceof Error ? e.name : "error" };
      }
    }),
  );
}
