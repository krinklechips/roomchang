import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const COOKIE_NAME = "rc_ref";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const PREVIEW_COOKIE = "rc_preview_session";
const PREVIEW_COOKIE_MAX_AGE = 60 * 60 * 2; // 2 hours

const intlMiddleware = createIntlMiddleware(routing);

const AUTODISCOVER_XML = `<?xml version="1.0" encoding="utf-8"?>
<Autodiscover xmlns="http://schemas.microsoft.com/exchange/autodiscover/responseschema/2006">
  <Response xmlns="http://schemas.microsoft.com/exchange/autodiscover/outlook/responseschema/2006a">
    <Account>
      <AccountType>email</AccountType>
      <Action>settings</Action>
      <Protocol>
        <Type>IMAP</Type>
        <Server>mail.roomchang.com</Server>
        <Port>993</Port>
        <DomainRequired>off</DomainRequired>
        <LoginName></LoginName>
        <SPA>off</SPA>
        <SSL>on</SSL>
        <AuthRequired>on</AuthRequired>
      </Protocol>
      <Protocol>
        <Type>SMTP</Type>
        <Server>mail.roomchang.com</Server>
        <Port>465</Port>
        <DomainRequired>off</DomainRequired>
        <LoginName></LoginName>
        <SPA>off</SPA>
        <SSL>on</SSL>
        <AuthRequired>on</AuthRequired>
        <UsePOPAuth>on</UsePOPAuth>
        <SMTPLast>off</SMTPLast>
      </Protocol>
    </Account>
  </Response>
</Autodiscover>`;

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
    match |= (sig.codePointAt(i) ?? 0) ^ (expected.codePointAt(i) ?? 0);
  }
  if (match !== 0) return false;

  // Check expiry
  const expiry = Number.parseInt(expiryStr, 10);
  if (Number.isNaN(expiry) || expiry < Math.floor(Date.now() / 1000)) return false;

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

  if (pathname.toLowerCase() === "/autodiscover/autodiscover.xml") {
    return new NextResponse(AUTODISCOVER_XML, {
      status: 200,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }

  // Locale URLs moved from the ISO language codes to country-style codes
  // (km → kh, zh → cn). Permanently redirect the old paths so any existing
  // links keep working.
  const oldLocale = pathname.match(/^\/(km|zh)(\/|$)/);
  if (oldLocale) {
    const renamed: Record<string, string> = { km: "kh", zh: "cn" };
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/(km|zh)/, `/${renamed[oldLocale[1]]}`);
    return NextResponse.redirect(url, 308);
  }

  // Webmail shortcut → SiteGround webmail. The old SiteGround "/webmail" domain
  // redirect stopped firing once the apex moved to Vercel, so recreate it here.
  // Handle it before locale routing so it isn't rewritten to /en/webmail (500).
  const noLocale = pathname.replace(/^\/(en|kh|cn)(?=\/|$)/, "");
  if (noLocale === "/webmail" || noLocale.startsWith("/webmail/")) {
    return NextResponse.redirect("https://sm12.siteground.biz/webmail/mail/", 307);
  }

  // Skip locale routing for API routes (auth checks below use cleanPath)
  const isApi = pathname.startsWith("/api");

  // Strip locale prefix for auth checks
  const cleanPath = pathname.replace(/^\/(en|kh|cn)/, "") || "/";

  // Protect all /admin/* pages and /api/admin/* routes
  if (cleanPath.startsWith("/admin") || cleanPath.startsWith("/api/admin")) {
    const deny = adminAuth(request);
    if (deny) return deny;
  }

  // Protect /preview/* routes with token OR Basic Auth
  if (cleanPath.startsWith("/preview")) {
    const deny = await previewAuth(request);
    if (deny) return deny;
  }

  // Run next-intl middleware for locale routing (skip for API routes)
  const response = isApi
    ? NextResponse.next()
    : intlMiddleware(request);

  // SEO: fix hreflang + add canonical (as HTTP Link headers — Google-supported).
  // next-intl emits the URL segment as the hreflang value (kh/cn), but those are
  // COUNTRY codes; hreflang needs ISO language codes, so Khmer→km, Chinese→zh.
  // Also add a self-referencing canonical (seo_page_meta is empty, so no conflict).
  if (!isApi) {
    const linkHeader = (response.headers.get("link") ?? "")
      .replaceAll('hreflang="kh"', 'hreflang="km"')
      .replaceAll('hreflang="cn"', 'hreflang="zh"');
    const canonical = `<https://www.roomchang.com${pathname}>; rel="canonical"`;
    response.headers.set("link", linkHeader ? `${linkHeader}, ${canonical}` : canonical);
  }

  // Handle referral cookies
  const { searchParams } = request.nextUrl;
  const ref = searchParams.get("ref");

  if (ref && /^[a-zA-Z0-9_-]{2,40}$/.test(ref)) {
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
        page: cleanPath,
      }),
    }).catch(() => {
      // Non-critical — ignore errors
    });
  }

  return response;
}

export const config = {
  // Run on all pages except Next.js internals, static files, and the root
  // metadata routes (robots.txt / sitemap.xml must NOT be locale-prefixed).
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|llms.txt|llms-full.txt|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|css|js|woff2?|otf|ttf|eot|mp4|webm)).*)",
  ],
};
