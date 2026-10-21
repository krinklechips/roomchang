// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  getPayloadPartnerGroups,
  getPayloadPricingCategories,
  getPayloadPricingComparisonSet,
} from "./payload-source";

vi.mock("next-intl/server", () => ({ getLocale: async () => "en" }));
vi.mock("next/headers", () => ({ draftMode: async () => ({ isEnabled: false }) }));

type Doc = Record<string, unknown>;
type Fixture = {
  name: string;
  relation: number | string | { id: number | string; sourceId?: string | null } | null | undefined;
  legacy?: string;
  expected: "original" | "edited" | "cms-only" | "zero" | null;
};
let collections: Record<string, Doc[]>;

const parents = [
  { id: 10, sourceId: "imported-original", slug: "original", title: "Original" },
  { id: 20, sourceId: "imported-edited", slug: "edited", title: "Edited" },
  { id: 30, slug: "cms-only", title: "CMS only" },
  { id: 0, sourceId: "imported-zero", slug: "zero", title: "Zero" },
  { id: 40, sourceId: "999", slug: "source-id-collision", title: "Source ID collision" },
];

const cases: Fixture[] = [
  { name: "populated imported relation overrides the stale source ID", relation: { id: 20, sourceId: "imported-edited" }, expected: "edited" },
  { name: "numeric imported relation resolves through the target's Payload ID", relation: 20, expected: "edited" },
  { name: "string numeric relation resolves through the target's Payload ID", relation: "20", expected: "edited" },
  { name: "zero is a real relation ID, not a missing relationship", relation: 0, expected: "zero" },
  { name: "populated CMS-only relation uses its stringified ID", relation: { id: 30 }, expected: "cms-only" },
  { name: "populated string ID works without an imported source ID", relation: { id: "30" }, expected: "cms-only" },
  { name: "populated null source ID falls back to the document ID", relation: { id: 30, sourceId: null }, expected: "cms-only" },
  { name: "numeric CMS-only relation uses its stringified ID", relation: 30, expected: "cms-only" },
  { name: "explicit null unassigns instead of restoring the stale source ID", relation: null, expected: null },
  { name: "absent relation preserves legacy fixture membership", relation: undefined, expected: "original" },
  { name: "absent relation without a legacy ID stays unassigned", relation: undefined, legacy: undefined, expected: null },
  { name: "unknown numeric relation cannot match another parent's source ID", relation: 999, expected: null },
  { name: "unknown string numeric relation cannot match another parent's source ID", relation: "999", expected: null },
  { name: "unknown relation does not fall back to stale membership", relation: "missing", expected: null },
  { name: "empty relation does not fall back to stale membership", relation: "", expected: null },
];

beforeEach(() => {
  collections = {};
  vi.stubEnv("PAYLOAD_API_URL", "https://cms.test");
  vi.stubGlobal("fetch", vi.fn(async (input: string) => {
    const url = new URL(input);
    if (url.origin !== "https://cms.test") throw new Error(`Unexpected URL: ${input}`);
    const collection = url.pathname.split("/").at(-1)!;
    if (!(collection in collections)) throw new Error(`Unexpected collection: ${collection}`);
    const slug = url.searchParams.get("where[slug][equals]");
    const docs = collections[collection].filter((doc) => slug === null || doc.slug === slug);
    return Response.json({ docs, totalDocs: docs.length, hasNextPage: false });
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

function membership(fixture: typeof cases[number], field: "category" | "set", legacyField: "sourceCategoryId" | "sourceSetId") {
  return {
    ...(fixture.relation === undefined ? {} : { [field]: fixture.relation }),
    [legacyField]: "legacy" in fixture ? fixture.legacy : "imported-original",
  };
}

describe("pricing item relationship precedence", () => {
  it.each(cases)("$name", async (fixture) => {
    collections["pricing-categories"] = parents;
    collections["pricing-items"] = [{
      id: 100,
      sourceId: "imported-price-row",
      name: "Edited treatment",
      price: "125.00",
      ...membership(fixture, "category", "sourceCategoryId"),
    }];

    const categories = await getPayloadPricingCategories();
    expect(categories.map((category) => ({ title: category.title, items: category.items.map((item) => item.name) }))).toEqual(
      parents.map((parent) => ({ title: parent.title, items: parent.slug === fixture.expected ? ["Edited treatment"] : [] })),
    );
    if (fixture.expected !== null) {
      const item = categories.flatMap((category) => category.items)[0];
      expect(item).toMatchObject({ id: "imported-price-row", price: "125.00" });
      expect(item.categoryId).toBe({ original: "imported-original", edited: "imported-edited", "cms-only": "30", zero: "imported-zero" }[fixture.expected]);
    }
  });
});

describe("partner relationship precedence", () => {
  it.each(cases)("$name", async (fixture) => {
    collections["partner-categories"] = parents.map((parent) => ({ ...parent, name: parent.title }));
    collections.partners = [{ id: 100, name: "Edited partner", ...membership(fixture, "category", "sourceCategoryId") }];

    const groups = await getPayloadPartnerGroups();
    expect(groups.map((group) => ({ title: group.title, partners: group.partners }))).toEqual(
      parents.map((parent) => ({ title: parent.title, partners: parent.slug === fixture.expected ? [{ name: "Edited partner" }] : [] })),
    );
  });
});

describe("pricing comparison relationship precedence", () => {
  it.each(cases)("$name", async (fixture) => {
    collections["pricing-comparison-sets"] = parents;
    collections["pricing-comparison-rows"] = [{ id: 100, treatment: "Edited comparison", ...membership(fixture, "set", "sourceSetId") }];

    for (const parent of parents) {
      const set = await getPayloadPricingComparisonSet(parent.slug);
      expect(set?.pricing_comparison_rows.map((row) => row.treatment)).toEqual(
        parent.slug === fixture.expected ? ["Edited comparison"] : [],
      );
    }
  });
});
