import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "rc_ref";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const PREVIEW_COOKIE = "rc_preview_session";
const PREVIEW_COOKIE_MAX_AGE = 60 * 60 * 2; // 2 hours

// ─── Admin Basic Auth ──────────────────────────────────────────────────────

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

  let decoded: string;
  try {
    decoded = atob(auth.slice(6));
  } catch {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Roomchang Admin"' },
    });
  }
  const colon = decoded.indexOf(":");
  if (colon < 0) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Roomchang Admin"' },
    });
  }
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

// ─── Preview Auth ──────────────────────────────────────────────────────────

/** Create an HMAC signature from the preview token (never stores raw secret in cookie) */
async function signPayload(payload: string, token: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(token),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

async function signPreviewCookie(token: string): Promise<string> {
  const expiry = Math.floor(Date.now() / 1000) + PREVIEW_COOKIE_MAX_AGE;
  const payload = `preview:${expiry}`;
  const sig = await signPayload(payload, token);
  return `${payload}:${sig}`;
}

/** Verify an HMAC-signed preview cookie */
async function verifyPreviewCookie(cookie: string, token: string): Promise<boolean> {
  const parts = cookie.split(":");
  if (parts.length !== 3) return false;

  const [prefix, expiryStr, sig] = parts;
  const payload = `${prefix}:${expiryStr}`;
  const expected = await signPayload(payload, token);

  // Timing-safe comparison
  if (sig.length !== expected.length) return false;
  let match = 0;
  for (let i = 0; i < sig.length; i++) {
    match |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  if (match !== 0) return false;

  // Check expiry
  const expiry = parseInt(expiryStr, 10);
  if (isNaN(expiry) || expiry < Math.floor(Date.now() / 1000)) return false;

  return true;
}

async function previewAuth(request: NextRequest): Promise<NextResponse | null> {
  const previewToken = process.env.CMS_PREVIEW_TOKEN;

  // No token configured → fall back to Basic Auth
  if (!previewToken) {
    return adminAuth(request);
  }

  // Check ?token= query param — if valid, set signed cookie and redirect without token
  const tokenParam = request.nextUrl.searchParams.get("token");
  if (tokenParam === previewToken) {
    // Redirect to the same URL without the token param (prevents leaking in browser history/Referer)
    const cleanUrl = new URL(request.nextUrl.toString());
    cleanUrl.searchParams.delete("token");

    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set(PREVIEW_COOKIE, await signPreviewCookie(previewToken), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: PREVIEW_COOKIE_MAX_AGE,
    });
    return response;
  }

  // Check signed cookie
  const cookieValue = request.cookies.get(PREVIEW_COOKIE)?.value;
  if (cookieValue && await verifyPreviewCookie(cookieValue, previewToken)) {
    return null; // authenticated via cookie
  }

  // Fall back to Basic Auth (same as admin)
  return adminAuth(request);
}

// ─── Main middleware ───────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/* pages and /api/admin/* routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const deny = adminAuth(request);
    if (deny) return deny;
  }

  // Protect /preview/* routes with token OR Basic Auth
  if (pathname.startsWith("/preview")) {
    const deny = await previewAuth(request);
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
