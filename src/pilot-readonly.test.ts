import { NextRequest, NextResponse } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { middleware } from "./middleware";

vi.mock("next-intl/middleware", () => ({ default: () => () => NextResponse.next() }));
afterEach(() => vi.unstubAllEnvs());

describe("staging pilot cannot submit to operational services", () => {
  it.each(["/api/enquiry", "/api/book", "/api/chat", "/api/admin/pricing", "/en/blog/publications"])
    ("rejects a staging POST before dispatching %s", async path => {
      vi.stubEnv("SITE_VISIBILITY", "staging");
      const result = await middleware(new NextRequest(`https://pilot.example${path}`, { method: "POST" }));
      expect(result.status).toBe(403);
      expect(result.headers.get("x-middleware-next")).toBeNull();
    });

  it.each(["/api/slots?date=2026-12-01", "/api/cron/health-check", "/api/preview?secret=unused"])
    ("rejects staging GET endpoints that can cause operational side effects: %s", async path => {
      vi.stubEnv("SITE_VISIBILITY", "staging");
      const result = await middleware(new NextRequest(`https://pilot.example${path}`));
      expect(result.status).toBe(403);
      expect(result.headers.get("x-middleware-next")).toBeNull();
    });

  it("does not record referral visits when reviewing a staging page", async () => {
    vi.stubEnv("SITE_VISIBILITY", "staging");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://roomchang.example");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "public-test-value");
    const fetcher = vi.fn(() => { throw new Error("A staging review must not log a referral visit."); });
    vi.stubGlobal("fetch", fetcher);
    const result = await middleware(new NextRequest("https://pilot.example/en?ref=TESTAGENT"));
    expect(result.status).toBe(200);
    expect(fetcher).not.toHaveBeenCalled();
    expect(result.cookies.get("rc_ref")).toBeUndefined();
  });

  it("does not change public production dispatch for an operational POST", async () => {
    vi.stubEnv("SITE_VISIBILITY", "public");
    const result = await middleware(new NextRequest("https://roomchang.example/api/enquiry", { method: "POST" }));
    expect(result.headers.get("x-middleware-next")).toBe("1");
  });
});
