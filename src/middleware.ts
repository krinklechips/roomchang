import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "rc_ref";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function adminAuth(request: NextRequest): NextResponse | null {
  const adminUser = process.env.ADMIN_USER;
  const adminPass = process.env.ADMIN_PASS;

  // No credentials configured → block in production, allow in dev
  if (!adminUser || !adminPass) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse("Admin access is disabled.", { status: 403 });
    }
    return null; // dev: allow through
  }

  const auth = request.headers.get("authorization") ?? "";
  if (!auth.startsWith("Basic ")) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Roomchang Admin"' },
    });
  }

  const decoded = Buffer.from(auth.slice(6), "base64").toString("utf-8");
  const colon = decoded.indexOf(":");
  const user = decoded.slice(0, colon);
  const pass = decoded.slice(colon + 1);

  if (user !== adminUser || pass !== adminPass) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Roomchang Admin"' },
    });
  }

  return null; // authenticated
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/* pages and /api/admin/* routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const deny = adminAuth(request);
    if (deny) return deny;
  }

  const { searchParams } = request.nextUrl;
  const ref = searchParams.get("ref");

  const response = NextResponse.next();

  if (ref && /^[a-zA-Z0-9_-]{2,40}$/.test(ref)) {
    // Valid ref code found — set or refresh the cookie
    response.cookies.set(COOKIE_NAME, ref.toUpperCase(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    // Log the visit via an internal API route (fire-and-forget)
    const logUrl = new URL("/api/referral/visit", request.url);
    const internalHeaders: Record<string, string> = { "Content-Type": "application/json" };
    if (process.env.INTERNAL_SECRET) {
      internalHeaders["x-internal-secret"] = process.env.INTERNAL_SECRET;
    }
    fetch(logUrl.toString(), {
      method: "POST",
      headers: internalHeaders,
      body: JSON.stringify({
        agent_code: ref.toUpperCase(),
        page: request.nextUrl.pathname,
      }),
    }).catch(() => {
      // Non-critical — ignore errors
    });
  }

  return response;
}

export const config = {
  // Run on all pages except Next.js internals and static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js|woff2?)).*)",
  ],
};
