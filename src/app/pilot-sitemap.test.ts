import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import sitemap from "./sitemap";

vi.mock("@/lib/supabase-server", () => ({ supabaseServer: {
  from: (table: string) => {
    const chain = {
      select: () => chain, eq: () => chain, not: () => chain,
      order: async () => ({ data: [{ slug: ({ services: "existing-service", technology: "existing-device", clinical_cases: "existing-case" } as Record<string, string>)[table] }], error: null }),
    };
    return chain;
  },
} }));

beforeEach(() => {
  vi.stubEnv("CONTENT_SOURCE", "pilot");
  vi.stubGlobal("fetch", () => { throw new Error("The pilot sitemap must not query CMS discovery."); });
});
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("pilot discovery isolation", () => {
  it("advertises only the selected existing page and preserves every legacy discovery result", async () => {
    vi.stubEnv("CMS_PILOT_PAGES", "");
    const legacy = await sitemap();
    vi.stubEnv("CMS_PILOT_PAGES", "/en/blog/publications");
    const selected = await sitemap();
    const pilot = selected.filter(row => row.url.endsWith("/en/blog/publications"));
    expect(pilot).toEqual([{
      url: "https://www.roomchang.com/en/blog/publications", changeFrequency: "monthly", priority: 0.5,
      alternates: { languages: { en: "https://www.roomchang.com/en/blog/publications", "x-default": "https://www.roomchang.com/en/blog/publications" } },
    }]);
    expect(selected.filter(row => !row.url.endsWith("/en/blog/publications"))).toEqual(legacy);
    expect(selected.some(row => row.url.endsWith("/en/services/existing-service"))).toBe(true);
    expect(selected.some(row => row.url.endsWith("/en/technology/existing-device"))).toBe(true);
  });
});
