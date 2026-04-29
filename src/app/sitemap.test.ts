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

    expect(urls).toContain("https://roomchang.com/");
    expect(urls).toContain("https://roomchang.com/services");
    expect(urls).toContain("https://roomchang.com/about/vision-mission-values");
    expect(urls).toContain("https://roomchang.com/services/dental-implants");
    expect(urls).toContain("https://roomchang.com/services/veneers");
    expect(urls).toContain("https://roomchang.com/technology/cbct");
    expect(urls).toContain("https://roomchang.com/clinical-results/all-on-4");
    expect(urls).toContain("https://roomchang.com/about/branches/monivong");
    expect(urls).not.toContain("https://roomchang.com/services/draft-service");
    expect(urls).not.toContain("https://roomchang.com/technology/draft-tech");
    expect(urls).not.toContain("https://roomchang.com/clinical-results/draft-case");

    expect(entries.find((entry) => entry.url === "https://roomchang.com/")?.priority).toBe(1);
    expect(entries.find((entry) => entry.url === "https://roomchang.com/services")?.changeFrequency).toBe("weekly");
  });
});
