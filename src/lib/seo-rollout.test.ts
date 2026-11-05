import { afterEach, describe, expect, it, vi } from "vitest";
import { buildSeoMetadata } from "./seo";
import type { SeoPageMeta } from "./data";

afterEach(() => vi.unstubAllEnvs());

const seo: SeoPageMeta = {
  path: "/services/teeth-whitening", title: null, description: null, ogTitle: null,
  ogDescription: null, ogImage: null, twitterTitle: null, twitterDescription: null,
  twitterImage: null, canonicalUrl: null, noIndex: false,
};

describe("rollout metadata preserves language review policy", () => {
  it("keeps Khmer noindexed even without a CMS SEO override", () => {
    const result = buildSeoMetadata({ locale: "kh", path: seo.path, title: "Existing title", description: "Existing text" }, null);
    expect(result.robots).toEqual({ index: false, follow: false });
    expect(result.title).toBe("Existing title");
    expect(result.description).toBe("Existing text");
  });

  it("does not let an explicit positive SEO override index a language under review", () => {
    expect(buildSeoMetadata({ locale: "kh", path: seo.path, title: "Title", description: null }, seo).robots)
      .toEqual({ index: false, follow: false });
  });

  it("omits an absent English robots override rather than erasing inherited policy with undefined", () => {
    expect(buildSeoMetadata({ locale: "en", path: seo.path, title: "Title", description: null }, null))
      .not.toHaveProperty("robots");
  });

  it("preserves a normal public English SEO override", () => {
    expect(buildSeoMetadata({ locale: "en", path: seo.path, title: "Title", description: null }, seo).robots)
      .toEqual({ index: true, follow: true });
  });

  it("keeps staging noindexed independently of source mode and positive SEO overrides", () => {
    vi.stubEnv("SITE_VISIBILITY", "staging");
    vi.stubEnv("CONTENT_SOURCE", "pilot");
    expect(buildSeoMetadata({ locale: "en", path: seo.path, title: "Title", description: null }, seo).robots)
      .toEqual({ index: false, follow: false });
  });
});
