import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ locale: "en", draft: false }));
vi.mock("next-intl/server", () => ({ getLocale: async () => state.locale }));
vi.mock("next/headers", () => ({ draftMode: async () => ({ isEnabled: state.draft }) }));
beforeEach(() => { vi.stubEnv("PAYLOAD_API_URL", "https://cms.example.test"); });
afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); state.draft = false; });
const response = (value: unknown) => ({ ok: true, status: 200, json: async () => value });

describe.each(["en", "kh", "cn"])("published reader contract in %s", locale => {
  beforeEach(() => { state.locale = locale; });
  it("reads every published page without losing the selected language or filters", async () => {
    const first = Array.from({ length: 200 }, (_, i) => ({ id: i + 1, name: `${locale} doctor ${i + 1}` }));
    const second = [{ id: 201, name: `${locale} last doctor` }];
    const fetcher = vi.fn(async (input: string, init: RequestInit) => {
      const url = new URL(input);
      expect(url.pathname).toBe("/api/doctors");
      expect(url.searchParams.get("locale")).toBe(locale);
      expect(url.searchParams.get("sort")).toBe("order,id");
      expect(url.searchParams.get("draft")).not.toBe("true");
      expect(init.cache).toBe("no-store");
      return url.searchParams.get("page") === "2"
        ? response({ docs: second, hasNextPage: false, page: 2, nextPage: null })
        : response({ docs: first, hasNextPage: true, page: 1, nextPage: 2 });
    });
    vi.stubGlobal("fetch", fetcher);
    const { getPayloadDoctors } = await import("./payload-source");
    const docs = await getPayloadDoctors();
    expect(docs).toHaveLength(201);
    expect(docs.at(-1)?.name).toBe(`${locale} last doctor`);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
  it("fails loudly if a later content page cannot be read", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: string) => new URL(input).searchParams.get("page") === "2"
      ? { ok: false, status: 503 }
      : response({ docs: [{ id: 1, name: "First" }], hasNextPage: true, nextPage: 2 })));
    const { getPayloadDoctors } = await import("./payload-source");
    await expect(getPayloadDoctors()).rejects.toThrow(/CMS|content|unavailable/i);
  });
  it("rejects repeated IDs rather than silently duplicating or dropping records", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: string) => response({ docs: [{ id: 1, name: "Duplicate" }],
      hasNextPage: new URL(input).searchParams.get("page") !== "2", nextPage: 2 })));
    const { getPayloadDoctors } = await import("./payload-source");
    await expect(getPayloadDoctors()).rejects.toThrow(/CMS|content|invalid/i);
  });
  it("keeps deliberate one-record reads bounded", async () => {
    const fetcher = vi.fn(async () => response({ docs: [{ id: 1, slug: "fixture", name: "Selected" }], hasNextPage: true, nextPage: 2 }));
    vi.stubGlobal("fetch", fetcher);
    const { getPayloadServiceBySlug } = await import("./payload-source");
    expect((await getPayloadServiceBySlug("fixture"))?.name).toBe("Selected");
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it.each([undefined, false, true])("maps caption opt-in %s without changing the published document", async showCaptions => {
    const doc = { id: 1, heroPill: `${locale} pill`, showCaptions, slides: [{ id: "slide", title: `${locale} title`, subtitle: `${locale} subtitle`, ctaText: `${locale} action`, ctaUrl: "/contact", imageUrl: "/hero.jpg" }] };
    const before = structuredClone(doc);
    vi.stubGlobal("fetch", vi.fn(async () => response({ docs: [doc] })));
    const { getPayloadHomepageSettings, getPayloadHeroSlides } = await import("./payload-source");
    expect(await getPayloadHomepageSettings()).toMatchObject({ showCaptions: showCaptions === true });
    expect((await getPayloadHeroSlides())[0]).toMatchObject({ subtitle: `${locale} subtitle`, ctaText: `${locale} action`, ctaUrl: "/contact" });
    expect(doc).toEqual(before);
  });
  it("includes comparison update metadata from the same selected set", async () => {
    vi.stubGlobal("fetch", vi.fn(async (input: string) => response({ docs: new URL(input).pathname.endsWith("pricing-comparison-sets")
      ? [{ id: 4, slug: "full-comparison", sourceNote: `${locale} source`, lastUpdated: "2026-10-23T00:00:00.000Z" }] : [] })));
    const { getPayloadPricingComparisonSet } = await import("./payload-source");
    expect(await getPayloadPricingComparisonSet("full-comparison")).toMatchObject({ last_updated: "2026-10-23T00:00:00.000Z", source_note: `${locale} source` });
  });
});
