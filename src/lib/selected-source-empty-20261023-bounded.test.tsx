import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import en from "../../messages/en.json";
import km from "../../messages/km.json";
import zh from "../../messages/zh.json";

const state = vi.hoisted(() => ({
  locale: "en",
  docs: {} as Record<string, Record<string, unknown>[]>,
  tables: {} as Record<string, unknown>,
  failedCollection: "",
}));
const messages = () => state.locale === "kh" ? km : state.locale === "cn" ? zh : en;
const translate = (namespace: string) => (key: string, values?: Record<string, unknown>) => {
  let value: unknown = messages();
  for (const part of `${namespace}.${key}`.split(".")) value = (value as Record<string, unknown>)?.[part];
  let result = typeof value === "string" ? value : `${namespace}.${key}`;
  for (const [name, replacement] of Object.entries(values ?? {})) result = result.replace(`{${name}}`, String(replacement));
  return result;
};
vi.mock("next-intl/server", () => ({
  getLocale: async () => state.locale,
  setRequestLocale: () => {},
  getTranslations: async (namespace: string) => translate(namespace),
}));
vi.mock("next-intl", () => ({ useTranslations: (namespace: string) => translate(namespace) }));
vi.mock("next/headers", () => ({ draftMode: async () => ({ isEnabled: false }) }));
vi.mock("next/navigation", async (original) => ({ ...await original<object>(), useSearchParams: () => new URLSearchParams() }));
// eslint-disable-next-line @next/next/no-img-element
vi.mock("next/image", () => ({ default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} /> }));
vi.mock("@/i18n/navigation", () => ({ Link: ({ children, ...props }: React.ComponentProps<"a">) => <a {...props}>{children}</a> }));
vi.mock("@/components/site/site-shell", () => ({ SiteShell: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));
vi.mock("@/components/sections/hash-scroll", () => ({ HashScroll: () => null }));

const query = (table: string) => {
  const result = () => {
    if (process.env.CONTENT_SOURCE === "payload") throw new Error(`Payload consumer queried Supabase: ${table}`);
    return { data: state.tables[table] ?? [], error: null };
  };
  const chain = {
    select: () => chain, eq: () => chain, in: () => chain, order: () => chain,
    maybeSingle: async () => ({ ...result(), data: state.tables[table] ?? null }),
    then: (resolve: (value: unknown) => unknown) => Promise.resolve(result()).then(resolve),
  };
  return chain;
};
vi.mock("@/lib/supabase-server", () => ({ supabaseServer: { from: (table: string) => query(table) } }));
vi.mock("@/lib/supabase", () => ({ supabase: { from: (table: string) => query(table) }, cdnUrl: (src: string) => src }));

import * as payload from "./payload-source";
import { getHomepageStats } from "@/components/sections/home-stats-data";
import { HomeFeatured } from "@/components/sections/home-featured";
import { AboutTimeline } from "@/components/sections/about-timeline";
import { ComparisonUpdatedAt } from "@/components/sections/comparison-updated-at";
import { HomeStatsServer } from "@/components/sections/home-stats-server";
import AboutPage from "@/app/[locale]/about/page";
import FacilitiesPage from "@/app/[locale]/about/facilities/page";
import ClinicalResultsPage from "@/app/[locale]/clinical-results/page";
import TeamPage from "@/app/[locale]/team/page";
import PartnershipsPage from "@/app/[locale]/about/partnerships/page";
import ImplantsComparisonPage from "@/app/[locale]/pricing/implants-comparison/page";
import PriceComparisonPage from "@/app/[locale]/international/price-comparison/page";

const params = () => ({ params: Promise.resolve({ locale: state.locale }) });
const html = (node: React.ReactNode) => {
  const root = document.createElement("div");
  root.innerHTML = renderToStaticMarkup(node);
  return root;
};
const statPages = [
  ["about", AboutPage, () => messages().about.stat.specialistDentists],
  ["facilities", FacilitiesPage, () => messages().facilities.stats.specialist_dentists],
  ["clinical", ClinicalResultsPage, () => messages().clinicalResults.stat.specialistDentists],
  ["team", TeamPage, () => messages().team.stat.doctors],
] as const;
const comparisons = [
  ["implants-comparison", ImplantsComparisonPage, 4],
  ["full-comparison", PriceComparisonPage, 28],
] as const;

beforeEach(() => {
  vi.stubEnv("CONTENT_SOURCE", "payload");
  state.locale = "en";
  state.docs = {};
  state.tables = {};
  state.failedCollection = "";
  vi.stubGlobal("fetch", vi.fn(async (input: string) => {
    const url = new URL(input);
    const collection = url.pathname.split("/").at(-1)!;
    if (collection === state.failedCollection) return { ok: false, status: 503 };
    const docs = (state.docs[collection] ?? []).filter((doc) => {
      const slug = url.searchParams.get("where[slug][equals]");
      return !slug || doc.slug === slug;
    });
    return { ok: true, status: 200, json: async () => ({ docs }) };
  }));
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe.each(["en", "kh", "cn"])("bounded selected-source consumers (%s)", (locale) => {
  beforeEach(() => { state.locale = locale; });

  it("does not resurrect featured cards from an empty published list", async () => {
    expect(html(await HomeFeatured()).querySelectorAll("article")).toHaveLength(0);
  });

  it("distinguishes an explicitly empty timeline from the omitted legacy timeline", () => {
    expect(html(<AboutTimeline events={[]} />).querySelectorAll("h3")).toHaveLength(0);
    expect(html(<AboutTimeline />).querySelectorAll("h3")).toHaveLength(9);
  });

  it("retains localized per-field timeline fallback for an existing CMS event", async () => {
    state.docs["timeline-events"] = [{ id: 1, sourceId: "1", year: "1996", heading: "", caption: null, body: "", imageUrl: "" }];
    const root = html(await AboutPage(params()));
    expect(root.textContent).toContain(messages().aboutTimeline["1996"].heading);
    expect(root.textContent).toContain(messages().aboutTimeline["1996"].body);
    expect(root.querySelectorAll("h3")).toHaveLength(10);
  });

  it("does not resurrect partner categories or partners from an empty published list", async () => {
    const root = html(await PartnershipsPage(params()));
    expect(root.querySelector('img[alt="Vattanac Bank"]')).toBeNull();
    expect(root.textContent).not.toContain(messages().partnerships.categories.banks);
  });

  it("renders only the published feature cards and partners without mutating reader data", async () => {
    state.docs["feature-cards"] = [{ id: 1, slug: "cms-feature", title: "CMS feature", description: "CMS description", imageUrl: "/cms-feature.jpg", imageAlt: "CMS image", href: "/team", cta: "CMS CTA" }];
    state.docs["partner-categories"] = [{ id: 1, name: "Banks & Financial Institutions" }];
    state.docs.partners = [{ id: 2, name: "CMS partner", category: 1 }];
    const before = structuredClone(state.docs);
    Object.values(state.docs).forEach((docs) => { docs.forEach(Object.freeze); Object.freeze(docs); });
    const featured = html(await HomeFeatured());
    expect(featured.querySelectorAll("article")).toHaveLength(1);
    expect(featured.textContent).toContain("CMS feature");
    const partners = html(await PartnershipsPage(params()));
    expect(partners.textContent).toContain("CMS partner");
    expect(partners.textContent).toContain(messages().partnerships.categories.banks);
    expect(partners.querySelector('img[alt="Vattanac Bank"]')).toBeNull();
    expect(state.docs).toEqual(before);
  });

  it("hides all homepage stat tiles for an empty published list", async () => {
    expect(html(await HomeStatsServer()).querySelectorAll(".home-stat-label")).toHaveLength(0);
  });

  it("keeps only present homepage keys, including numeric zero and localized optional-label fallback", async () => {
    state.docs["site-stats"] = [{ id: 1, key: "specialist_dentists", numericValue: 0, label: " " }];
    const view = await HomeStatsServer();
    expect(view?.props.stats).toEqual([{ numeric_value: 0, suffix: "", label: messages().homeStats.specialistDentists }]);
  });

  it.each(statPages)("hides missing CMS stat keys on %s", async (_name, Page, label) => {
    const empty = html(await Page(params()));
    expect([...empty.querySelectorAll("p")].some((p) => p.textContent === label())).toBe(false);
    state.docs["site-stats"] = [{ id: 1, key: "specialist_dentists", displayValue: "42 CMS", label: " " }];
    const partial = html(await Page(params()));
    expect(partial.textContent).toContain("42 CMS");
    expect(partial.textContent).toContain(label());
    expect(partial.querySelectorAll("p").length).toBeGreaterThan(0);
    expect([...partial.querySelectorAll("p")].some((p) => ["37", "100,000+", "30 yrs", "1996", "74", "46"].includes(p.textContent ?? ""))).toBe(false);
  });

  it("keeps derived doctor language coverage without substituting it for a missing CMS doctor-count key", async () => {
    state.docs.doctors = [{ id: 1, name: "Published doctor", languages: [{ value: "English" }, { value: "Khmer" }] }];
    const root = html(await TeamPage(params()));
    expect([...root.querySelectorAll("p")].some((p) => p.textContent === messages().team.stat.doctors)).toBe(false);
    expect([...root.querySelectorAll("p")].some((p) => p.textContent === messages().team.stat.languages)).toBe(true);
    expect([...root.querySelectorAll("p")].some((p) => p.textContent === "2")).toBe(true);
  });

  it.each(comparisons)("keeps missing and empty %s rows empty without bundled metadata", async (slug, Page) => {
    for (const docs of [[], [{ id: 1, slug }]]) {
      state.docs["pricing-comparison-sets"] = docs;
      const root = html(await Page(params()));
      expect(root.querySelectorAll("tbody tr")).toHaveLength(0);
      expect(root.textContent).not.toContain(messages().pricing.comparison.fallbackExchangeRate);
      expect(root.textContent).not.toContain(messages().pricing.comparison.sourceNote);
      expect(root.querySelector("time")).toBeNull();
    }
  });

  it.each(comparisons)("renders only the %s set's source, exchange rate, and locale-aware date without mutation", async (slug, Page) => {
    const set = {
      exchange_rate: 1.43, source_note: `CMS source for ${slug}`, last_updated: "2026-10-22T23:30:00.000Z",
      pricing_comparison_rows: [
        { ada: "2", treatment: "Later CMS row", roomchang_price: "$20", australia_price: "AUD $40", singapore_price: null, sort_order: 2 },
        { ada: "1", treatment: "First CMS row", roomchang_price: "$10", australia_price: "AUD $30", singapore_price: null, sort_order: 1 },
      ],
    };
    const before = structuredClone(set);
    set.pricing_comparison_rows.forEach(Object.freeze);
    Object.freeze(set.pricing_comparison_rows);
    Object.freeze(set);
    const read = vi.spyOn(payload, "getPayloadPricingComparisonSet").mockImplementation(async (requestedSlug) => {
      if (requestedSlug !== slug) throw new Error(`Wrong comparison metadata: ${requestedSlug}`);
      return set;
    });
    const root = html(await Page(params()));
    expect(root.querySelectorAll("tbody tr")).toHaveLength(2);
    expect(root.querySelector("tbody tr")?.textContent).toContain("First CMS row");
    expect(root.textContent).toContain(`CMS source for ${slug}`);
    expect(root.textContent).toContain("1.43");
    const time = root.querySelector("time");
    expect(time?.getAttribute("datetime")).toBe("2026-10-22T23:30:00.000Z");
    expect(time?.textContent).toBe(new Intl.DateTimeFormat(locale === "kh" ? "km-KH" : locale === "cn" ? "zh-CN" : "en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date("2026-10-22T23:30:00.000Z")));
    expect(root.textContent).toContain(locale === "kh" ? "បានធ្វើបច្ចុប្បន្នភាពចុងក្រោយ" : locale === "cn" ? "最后更新" : "Last updated");
    expect(set).toEqual(before);
    read.mockRestore();
  });

  it.each(comparisons)("connects %s metadata through the real reader", async (slug, Page) => {
    state.docs["pricing-comparison-sets"] = [{ id: 1, slug, sourceNote: `Reader source ${slug}`, lastUpdated: "2026-10-22", exchangeRate: 1.5 }];
    const root = html(await Page(params()));
    expect(root.textContent).toContain(`Reader source ${slug}`);
    expect(root.querySelector("time")?.getAttribute("datetime")).toBe("2026-10-22");
    expect(root.querySelectorAll("tbody tr")).toHaveLength(0);
  });

  it("preserves the existing non-Payload bundled fallbacks", async () => {
    vi.stubEnv("CONTENT_SOURCE", "supabase");
    expect(html(await HomeFeatured()).querySelectorAll("article")).toHaveLength(3);
    expect(html(await HomeStatsServer()).querySelectorAll(".home-stat-label")).toHaveLength(4);
    expect(html(await PartnershipsPage(params())).querySelector('img[alt="Vattanac Bank"]')).not.toBeNull();
    for (const [, Page, label] of statPages) expect(html(await Page(params())).textContent).toContain(label());
    for (const [, Page, count] of comparisons) expect(html(await Page(params())).querySelectorAll("tbody tr")).toHaveLength(count);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("keeps populated non-Payload rows and metadata ahead of bundled fallback", async () => {
    vi.stubEnv("CONTENT_SOURCE", "supabase");
    state.tables.homepage_feature_cards = [{ slug: "legacy-feature", title: "Legacy feature", description: "Legacy description", image_src: "/legacy.jpg", image_alt: "Legacy image", href: "/team", cta: "Legacy CTA" }];
    state.tables.partners = [{ name: "Legacy partner", partner_categories: { name: "Banks & Financial Institutions", sort_order: 0 } }];
    state.tables.pricing_comparison_sets = {
      exchange_rate: 1.6, source_note: "Legacy Australia source. Singapore legacy source.",
      pricing_comparison_rows: [{ ada: "1", treatment: "Legacy treatment", roomchang_price: "$19", australia_price: "AUD $39", singapore_price: "SGD $49", sort_order: 0 }],
    };
    expect(html(await HomeFeatured()).querySelectorAll("article")).toHaveLength(1);
    expect(html(await HomeFeatured()).textContent).toContain("Legacy feature");
    expect(html(await PartnershipsPage(params())).textContent).toContain("Legacy partner");
    for (const [, Page] of comparisons) {
      const root = html(await Page(params()));
      expect(root.querySelectorAll("tbody tr")).toHaveLength(1);
      expect(root.textContent).toContain("Legacy treatment");
      expect(root.querySelector("time")).toBeNull();
    }
    const full = html(await PriceComparisonPage(params()));
    expect(full.textContent).toContain("Legacy Australia source.");
    expect(full.textContent).toContain("Singapore legacy source.");
    expect(full.textContent).toContain("1.6");
    expect(fetch).not.toHaveBeenCalled();
  });
});

it.each([null, undefined, "", " ", "not-a-date"])("omits missing or invalid comparison dates (%j)", (lastUpdated) => {
  expect(html(<ComparisonUpdatedAt lastUpdated={lastUpdated} locale="kh" />).textContent).toBe("");
});

it("uses a supplied localized date label instead of its built-in optional-label fallback", () => {
  const root = html(<ComparisonUpdatedAt lastUpdated="2026-10-22" locale="cn" label="CMS date label:" />);
  expect(root.textContent).toContain("CMS date label:");
  expect(root.querySelector("time")?.textContent).toBe("2026年10月22日");
});

it("does not mutate published or pending stat content while selecting present keys", () => {
  const published = [{ key: "patients_treated", numeric_value: 0, suffix: "+", display_value: "Published count", label: "" }];
  const draft = [{ ...published[0], display_value: "Pending count" }];
  const before = structuredClone({ published, draft });
  published.forEach(Object.freeze);
  draft.forEach(Object.freeze);
  expect(getHomepageStats(published, { patients_treated: "Localized label" }, true)).toEqual([
    { numeric_value: 0, suffix: "+", display_value: "Published count", label: "Localized label" },
  ]);
  expect({ published, draft }).toEqual(before);
});

it.each([
  ["featured", "feature-cards", () => HomeFeatured()],
  ["home stats", "site-stats", () => HomeStatsServer()],
  ["about stats", "site-stats", () => AboutPage(params())],
  ["facilities stats", "site-stats", () => FacilitiesPage(params())],
  ["clinical stats", "site-stats", () => ClinicalResultsPage(params())],
  ["team stats", "site-stats", () => TeamPage(params())],
  ["partners", "partners", () => PartnershipsPage(params())],
  ["implants", "pricing-comparison-sets", () => ImplantsComparisonPage(params())],
  ["full comparison", "pricing-comparison-sets", () => PriceComparisonPage(params())],
] as const)("still fails loud on a CMS error in %s", async (_name, collection, renderPage) => {
  state.failedCollection = collection;
  await expect(renderPage()).rejects.toThrow(/CMS|content|unavailable/i);
});
