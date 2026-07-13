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
