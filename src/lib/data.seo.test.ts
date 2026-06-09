import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Flat chainable mock of supabaseServer: from()/select()/eq() all return the
 * same chain, and single()/maybeSingle() resolve to `result`. Avoids deeply
 * nested factory arrows in each test.
 */
function mockSupabaseSingle(result: { data: unknown; error: unknown }) {
  const chain: Record<string, unknown> = {
    from: () => chain,
    select: () => chain,
    eq: () => chain,
    single: async () => result,
    maybeSingle: async () => result,
  };
  return { supabaseServer: chain };
}

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("getSeoPageMeta", () => {
  it("maps a CMS row into the server SEO shape", async () => {
    vi.doMock("@/lib/supabase-server", () =>
      mockSupabaseSingle({
        data: {
          page_path: "/services/dental-implants",
          title: "Dental Implants in Phnom Penh",
          description: "CMS description",
          og_title: "CMS OG Title",
          og_description: "CMS OG Description",
          og_image: "https://roomchang.com/og-implants.jpg",
          twitter_title: "CMS Twitter Title",
          twitter_description: "CMS Twitter Description",
          twitter_image: "https://roomchang.com/twitter-implants.jpg",
          canonical_url: "https://roomchang.com/services/dental-implants",
          noindex: true,
        },
        error: null,
      }),
    );

    const { getSeoPageMeta } = await import("./data");

    await expect(getSeoPageMeta("/services/dental-implants")).resolves.toEqual({
      path: "/services/dental-implants",
      title: "Dental Implants in Phnom Penh",
      description: "CMS description",
      ogTitle: "CMS OG Title",
      ogDescription: "CMS OG Description",
      ogImage: "https://roomchang.com/og-implants.jpg",
      twitterTitle: "CMS Twitter Title",
      twitterDescription: "CMS Twitter Description",
      twitterImage: "https://roomchang.com/twitter-implants.jpg",
      canonicalUrl: "https://roomchang.com/services/dental-implants",
      noIndex: true,
    });
  });

  it("returns null when the CMS lookup fails", async () => {
    vi.doMock("@/lib/supabase-server", () =>
      mockSupabaseSingle({ data: null, error: { message: "boom" } }),
    );

    const { getSeoPageMeta } = await import("./data");

    await expect(getSeoPageMeta("/services/missing")).resolves.toBeNull();
  });
});
