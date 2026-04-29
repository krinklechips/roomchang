import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("getSeoPageMeta", () => {
  it("maps a CMS row into the server SEO shape", async () => {
    vi.doMock("@/lib/supabase-server", () => ({
      supabaseServer: {
        from: () => ({
          select: () => ({
            eq: () => ({
              single: async () => ({
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
            }),
          }),
        }),
      },
    }));

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
    vi.doMock("@/lib/supabase-server", () => ({
      supabaseServer: {
        from: () => ({
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: null,
                error: { message: "boom" },
              }),
            }),
          }),
        }),
      },
    }));

    const { getSeoPageMeta } = await import("./data");

    await expect(getSeoPageMeta("/services/missing")).resolves.toBeNull();
  });
});
