import { NextResponse } from "next/server";
import { verifySmtp } from "@/lib/mailer";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Site health for external monitors (scheduled checkers, uptime robots).
 *
 * Returns 200 only when every dependency that can fail SILENTLY is healthy:
 *   - smtp: real AUTH login to the SiteGround mailbox (no email sent). A bad
 *     password here means enquiry notifications are black-holing while
 *     patients still see the success screen.
 *   - db:   Supabase reachable (cheap select).
 *   - unreadEnquiries / oldestUnreadHours: backlog signal — a large or old
 *     backlog means the clinic isn't seeing its leads even if smtp is ok now.
 *
 * 503 + {ok:false} whenever smtp or db fails, so any dumb monitor alerts.
 */
export const dynamic = "force-dynamic";

// SMTP verify performs a real login — cache the result briefly so an
// aggressive uptime monitor can't hammer SiteGround into rate-limiting us.
const SMTP_CACHE_MS = 10 * 60 * 1000;
let smtpCache: { at: number; result: { ok: boolean; error?: string } } | null = null;

export async function GET() {
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

  const ok = smtp.ok && db.ok;
  return NextResponse.json(
    {
      ok,
      checkedAt: new Date(now).toISOString(),
      smtp: smtp.ok ? { ok: true } : { ok: false, error: smtp.error },
      db: db.ok ? { ok: true } : { ok: false, error: db.error },
      unreadEnquiries,
      oldestUnreadHours,
    },
    { status: ok ? 200 : 503 },
  );
}
