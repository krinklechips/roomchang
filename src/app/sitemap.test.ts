import { describe, expect, it, vi } from "vitest";

const supabaseServerMock = vi.hoisted(() => ({
  from: vi.fn((table: string) => {
    const rowsByTable: Record<string, Array<Record<string, unknown>>> = {
      services: [
        { slug: "dental-implants", published: true },
        { slug: "veneers", published: true },
        { slug: "draft-service", published: false },
      ],
      technology: [
        { slug: "cbct", published: true },
        { slug: null, published: true },
        { slug: "draft-tech", published: false },
      ],
      clinical_cases: [
        { slug: "all-on-4", published: true },
        { slug: null, published: true },
        { slug: "draft-case", published: false },
      ],
    };

    let rows = [...(rowsByTable[table] ?? [])];

    const query = {
      eq(column: string, value: unknown) {
        rows = rows.filter((row) => row[column] === value);
        return query;
      },
      not(column: string, operator: string, value: unknown) {
        if (operator === "is" && value === null) {
          rows = rows.filter((row) => row[column] !== null);
        }
        return query;
      },
      async order() {
        return { data: rows, error: null };
      },
    };

    return {
      select() {
        return query;
      },
    };
  }),
}));

vi.mock("@/lib/supabase-server", () => ({
  supabaseServer: supabaseServerMock,
}));

import sitemap from "./sitemap";

describe("sitemap", () => {
  it("includes static, CMS-backed, and branch detail routes", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    // URLs are locale-prefixed (default locale = en), on www, no trailing slash
    expect(urls).toContain("https://www.roomchang.com/en");
    expect(urls).toContain("https://www.roomchang.com/en/services");
    expect(urls).toContain("https://www.roomchang.com/en/about/vision-mission-values");
    expect(urls).toContain("https://www.roomchang.com/en/services/dental-implants");
    expect(urls).toContain("https://www.roomchang.com/en/services/veneers");
    expect(urls).toContain("https://www.roomchang.com/en/technology/cbct");
    expect(urls).toContain("https://www.roomchang.com/en/clinical-results/all-on-4");
    expect(urls).toContain("https://www.roomchang.com/en/about/branches/sisowath-high-school");
    expect(urls).toContain("https://www.roomchang.com/en/privacy-policy");
    expect(urls).not.toContain("https://www.roomchang.com/en/services/draft-service");
    expect(urls).not.toContain("https://www.roomchang.com/en/technology/draft-tech");
    expect(urls).not.toContain("https://www.roomchang.com/en/clinical-results/draft-case");

    expect(entries.find((entry) => entry.url === "https://www.roomchang.com/en")?.priority).toBe(1);

    const services = entries.find((entry) => entry.url === "https://www.roomchang.com/en/services");
    expect(services?.changeFrequency).toBe("weekly");
    // hreflang alternates: listed locales only + x-default. Khmer (/kh) is
    // UNLISTED while its content is under review — it must NOT appear here.
    expect(services?.alternates?.languages).toMatchObject({
      en: "https://www.roomchang.com/en/services",
      zh: "https://www.roomchang.com/cn/services",
      "x-default": "https://www.roomchang.com/en/services",
    });
    expect(services?.alternates?.languages).not.toHaveProperty("km");
    expect(JSON.stringify(entries)).not.toContain("roomchang.com/kh");
  });
});
