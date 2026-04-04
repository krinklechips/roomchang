import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "rc_ref";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function middleware(request: NextRequest) {
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
    fetch(logUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
