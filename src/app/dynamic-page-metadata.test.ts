import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

describe("dynamic page generateMetadata", () => {
  it("lets CMS SEO overrides win for services pages", async () => {
    vi.doMock("@/lib/data", () => ({
      getServiceBySlug: vi.fn().mockResolvedValue({
        name: "Dental Implants",
        description: "Static service description",
      }),
      getServices: vi.fn().mockResolvedValue([]),
      getSeoPageMeta: vi.fn().mockResolvedValue({
        path: "/services/dental-implants",
        title: "CMS Service Title",
        description: "CMS Service Description",
        ogTitle: "CMS Service OG Title",
        ogDescription: "CMS Service OG Description",
        ogImage: "https://roomchang.com/service-og.jpg",
        twitterTitle: "CMS Service Twitter Title",
        twitterDescription: "CMS Service Twitter Description",
        twitterImage: "https://roomchang.com/service-twitter.jpg",
        canonicalUrl: "https://roomchang.com/services/dental-implants",
        noIndex: true,
      }),
    }));

    const { generateMetadata } = await import("./services/[slug]/page");
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "dental-implants" }),
    });

    expect(metadata.title).toBe("CMS Service Title");
    expect(metadata.description).toBe("CMS Service Description");
    expect(metadata.openGraph).toMatchObject({
      title: "CMS Service OG Title",
      description: "CMS Service OG Description",
      url: "/services/dental-implants",
      images: [{ url: "https://roomchang.com/service-og.jpg" }],
    });
    expect(metadata.twitter).toMatchObject({
      title: "CMS Service Twitter Title",
      description: "CMS Service Twitter Description",
      images: ["https://roomchang.com/service-twitter.jpg"],
    });
    expect(metadata.alternates).toMatchObject({
      canonical: "https://roomchang.com/services/dental-implants",
    });
    expect(metadata.robots).toMatchObject({
      index: false,
      follow: true,
    });
  });

  it("falls back to default technology metadata when CMS SEO is missing", async () => {
    vi.doMock("@/lib/data", () => ({
      getTechnologyBySlug: vi.fn().mockResolvedValue({
        name: "CBCT Scanner",
        description: "Static technology description",
      }),
      getTechnology: vi.fn().mockResolvedValue([]),
      getSeoPageMeta: vi.fn().mockResolvedValue(null),
    }));

    const { generateMetadata } = await import("./technology/[slug]/page");
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "cbct-scanner" }),
    });

    expect(metadata.title).toBe("CBCT Scanner | Roomchang Dental Hospital");
    expect(metadata.description).toBe("Static technology description");
  });

  it("lets CMS SEO overrides win for clinical result pages", async () => {
    vi.doMock("@/lib/data", () => ({
      getClinicalCaseBySlug: vi.fn().mockResolvedValue({
        title: "All-on-4 Case",
        description: "Static case description",
      }),
      getClinicalCases: vi.fn().mockResolvedValue([]),
      getSeoPageMeta: vi.fn().mockResolvedValue({
        path: "/clinical-results/all-on-4",
        title: "CMS Case Title",
        description: "CMS Case Description",
        ogTitle: "CMS Case OG Title",
        ogDescription: "CMS Case OG Description",
        ogImage: "https://roomchang.com/case-og.jpg",
        twitterTitle: null,
        twitterDescription: null,
        twitterImage: null,
        canonicalUrl: null,
        noIndex: false,
      }),
    }));

    const { generateMetadata } = await import("./clinical-results/[slug]/page");
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "all-on-4" }),
    });

    expect(metadata.title).toBe("CMS Case Title");
    expect(metadata.description).toBe("CMS Case Description");
    expect(metadata.openGraph).toMatchObject({
      title: "CMS Case OG Title",
      description: "CMS Case OG Description",
      url: "/clinical-results/all-on-4",
      images: [{ url: "https://roomchang.com/case-og.jpg" }],
    });
  });
});
