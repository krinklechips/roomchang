import "server-only";

import { cookies } from "next/headers";

const PREVIEW_COOKIE = "rc_preview_token";
const COOKIE_MAX_AGE = 60 * 60 * 2; // 2 hours

/**
 * Validate preview access.
 *
 * Checks (in order):
 * 1. `?token=` query parameter matches CMS_PREVIEW_TOKEN
 * 2. `rc_preview_token` cookie (set after a successful token check)
 *
 * Returns `true` if access is granted.
 */
export async function validatePreviewAccess(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<boolean> {
  const secret = process.env.CMS_PREVIEW_TOKEN;

  // If no secret is configured, block in production, allow in dev
  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  // Check query param first
  const tokenParam =
    typeof searchParams.token === "string" ? searchParams.token : undefined;
  if (tokenParam && timingSafeEqual(tokenParam, secret)) {
    return true;
  }

  // Check cookie
  const jar = await cookies();
  const cookieToken = jar.get(PREVIEW_COOKIE)?.value;
  if (cookieToken && timingSafeEqual(cookieToken, secret)) {
    return true;
  }

  return false;
}

/**
 * Set the preview cookie after successful token validation.
 * Call this from a server action or API route.
 */
export async function setPreviewCookie(): Promise<void> {
  const secret = process.env.CMS_PREVIEW_TOKEN;
  if (!secret) return;

  const jar = await cookies();
  jar.set(PREVIEW_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

/**
 * Clear the preview cookie (exit preview mode).
 */
export async function clearPreviewCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(PREVIEW_COOKIE);
}

// ─── Constant-time comparison ──────────────────────────────────────────────

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  try {
    const { timingSafeEqual: tse } = require("crypto");
    return tse(bufA, bufB);
  } catch {
    // Fallback: still constant-time-ish via reduce
    let result = 0;
    for (let i = 0; i < bufA.length; i++) {
      result |= bufA[i] ^ bufB[i];
    }
    return result === 0;
  }
}
