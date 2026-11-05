import { afterEach, describe, expect, it, vi } from "vitest";
import { resolveContentSource, pilotSitemapEntries } from "./content-rollout";

afterEach(() => vi.unstubAllEnvs());

describe("page-scoped CMS pilot", () => {
  const page = { locale: "en", path: "/blog/publications" };

  it("keeps the original source when deployment configuration is absent", () => {
    expect(resolveContentSource(page, {})).toBe("legacy");
  });

  it("keeps the original source when pilot mode has an empty allowlist", () => {
    expect(resolveContentSource(page, { CONTENT_SOURCE: "pilot" })).toBe("legacy");
  });

  it("does not opt this page into the pilot through the old deployment-wide flag", () => {
    expect(resolveContentSource(page, { CONTENT_SOURCE: "payload" })).toBe("legacy");
  });

  it("selects only the registered English Publications page", () => {
    const env = { CONTENT_SOURCE: "pilot", CMS_PILOT_PAGES: "/en/blog/publications" };
    expect(resolveContentSource(page, env)).toBe("payload");
    for (const other of [
      { locale: "kh", path: "/blog/publications" },
      { locale: "cn", path: "/blog/publications" },
      { locale: "en", path: "/" },
      { locale: "en", path: "/team" },
      { locale: "en", path: "/contact" },
      { locale: "en", path: "/services/teeth-whitening" },
      { locale: "en", path: "/blog/publications/extra" },
      { locale: "en/blog", path: "/publications" },
    ]) expect(resolveContentSource(other, env)).toBe("legacy");
  });

  it.each([
    "*", "/en/*", "/en/blog/*", "/cn/blog/publications", "/kh/blog/publications",
    "/en/contact", "https://roomchang.com/en/blog/publications", "/en/blog/publications?draft=true",
    "/en/blog/publications/", "/%65n/blog/publications", "/en/blog/publications,/en/contact",
  ])("rejects an unregistered or ambiguous allowlist entry: %s", entry => {
    expect(() => resolveContentSource(page, { CONTENT_SOURCE: "pilot", CMS_PILOT_PAGES: entry })).toThrow(/pilot/i);
  });

  it("rejects an allowlist without explicit pilot mode", () => {
    expect(() => resolveContentSource(page, { CMS_PILOT_PAGES: "/en/blog/publications" })).toThrow(/pilot/i);
    expect(() => resolveContentSource(page, { CONTENT_SOURCE: "payload", CMS_PILOT_PAGES: "/en/blog/publications" })).toThrow(/pilot/i);
  });

  it("blocks a selected pilot on a production target even if staging visibility is accidentally carried over", () => {
    const env = { CONTENT_SOURCE: "pilot", CMS_PILOT_PAGES: "/en/blog/publications", SITE_VISIBILITY: "staging", VERCEL_ENV: "production" };
    expect(() => resolveContentSource(page, env)).toThrow(/production/i);
    expect(() => pilotSitemapEntries(env)).toThrow(/production/i);
  });

  it("restores the legacy page and discovery when the allowlist is cleared", () => {
    const env = { CONTENT_SOURCE: "pilot", CMS_PILOT_PAGES: "" };
    expect(resolveContentSource(page, env)).toBe("legacy");
    expect(pilotSitemapEntries(env)).toEqual([]);
  });

  it("advertises only the selected existing English route, not unrelated CMS slugs or languages", () => {
    expect(pilotSitemapEntries({ CONTENT_SOURCE: "pilot", CMS_PILOT_PAGES: "/en/blog/publications" })).toEqual([{
      url: "https://www.roomchang.com/en/blog/publications",
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: { languages: {
        en: "https://www.roomchang.com/en/blog/publications",
        "x-default": "https://www.roomchang.com/en/blog/publications",
      } },
    }]);
  });
});
