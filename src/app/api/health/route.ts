import { NextResponse } from "next/server";
import { checkSiteHealth } from "@/lib/health";

/**
 * Site health for external monitors (uptime robots, scheduled checkers).
 * Checks the dependencies that fail SILENTLY — SMTP mailbox login (real AUTH,
 * no email sent), Supabase, unread-enquiry backlog. 503 + {ok:false} whenever
 * smtp or db fails, so any dumb monitor alerts. See src/lib/health.ts.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const health = await checkSiteHealth();
  return NextResponse.json(
    {
      ...health,
      smtp: health.smtp.ok ? { ok: true } : health.smtp,
      db: health.db.ok ? { ok: true } : health.db,
    },
    { status: health.ok ? 200 : 503 },
  );
}
