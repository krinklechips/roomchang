// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next-intl/server", () => ({ getLocale: async () => "kh" }));
const fixture = vi.hoisted(() => ({ id: "case", slug: "case", category: "Implants & Crowns", title: "English title", imageUrl: null, images: [] }));
vi.mock("./supabase", () => ({ supabase: { from: () => {
  const query = { select: () => query, eq: () => query, order: async () => ({ data: [fixture], error: null }), single: async () => ({ data: fixture, error: null }) };
  return query;
} } }));
vi.mock("./supabase-server", () => ({ supabaseServer: {} }));
vi.mock("./i18n-content", () => ({
  getTranslatedFields: async () => ({ category: "Localized category", title: "Localized title" }),
  getTranslatedFieldsBatch: async () => new Map([["case", { category: "Localized category", title: "Localized title" }]]),
  mergeTranslation: (base: object, overlay: object) => ({ ...base, ...overlay }),
}));
import { getClinicalCases, getClinicalCaseBySlug } from "./data";
afterEach(() => vi.unstubAllEnvs());

it("derives the key from English before applying the legacy localized category overlay", async () => {
  vi.stubEnv("CONTENT_SOURCE", "supabase");
  expect(await getClinicalCases()).toMatchObject([{ id: "case", categoryKey: "implants-and-crowns", category: "Localized category", title: "Localized title" }]);
  expect(await getClinicalCaseBySlug("case")).toMatchObject({ id: "case", categoryKey: "implants-and-crowns", category: "Localized category" });
});
