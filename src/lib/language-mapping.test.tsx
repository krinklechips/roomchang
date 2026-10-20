// @vitest-environment node
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import en from "../../messages/en.json";
import km from "../../messages/km.json";
import zh from "../../messages/zh.json";

const state = vi.hoisted(() => ({ locale: "en", docs: {} as Record<string, unknown[]> }));
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ draftMode: async () => ({ isEnabled: false }) }));
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(), notFound: () => { throw new Error("Not found"); } }));
const translate = (namespace: string) => (key: string, values?: Record<string, string>) => {
  const messages = state.locale === "kh" ? km : state.locale === "cn" ? zh : en;
  let value: unknown = messages;
  for (const part of `${namespace}.${key}`.split(".")) value = (value as Record<string, unknown>)?.[part];
  let result = typeof value === "string" ? value : `${namespace}.${key}`;
  for (const [key, value] of Object.entries(values ?? {})) result = result.replace(`{${key}}`, value);
  return result;
};
vi.mock("next-intl/server", () => ({
  getLocale: async () => state.locale,
  setRequestLocale: () => {},
  getTranslations: async (namespace: string) => translate(namespace),
}));
vi.mock("next-intl", () => ({ useTranslations: (namespace: string) => translate(namespace) }));
vi.mock("next/image", () => ({ default: ({ fill: _fill, priority: _priority, ...props }: Record<string, unknown>) => <img {...props} /> }));
vi.mock("@/i18n/navigation", () => ({ Link: ({ children, ...props }: React.ComponentProps<"a">) => <a {...props}>{children}</a> }));
vi.mock("@/components/site/site-shell", () => ({ SiteShell: ({ children }: { children: React.ReactNode }) => <main>{children}</main> }));
const emptyQuery = () => {
  const query = { select: () => query, eq: () => query, in: () => query, maybeSingle: async () => ({ data: null, error: null }), then: (resolve: (value: unknown) => unknown) => Promise.resolve({ data: [], error: null }).then(resolve) };
  return query;
};
vi.mock("@/lib/supabase", () => ({ supabase: { from: () => emptyQuery() }, cdnUrl: (s: string) => s }));
vi.mock("@/lib/supabase-server", () => ({ supabaseServer: { from: () => emptyQuery() } }));
vi.mock("@/components/sections/hash-scroll", () => ({ HashScroll: () => null }));

import * as payload from "./payload-source";
import { BRANCHES, matchStaticBranch } from "./branches";
import { ClinicalResultsGrid } from "@/components/sections/clinical-results-grid";
import { AboutTimeline } from "@/components/sections/about-timeline";
import AboutPage from "@/app/[locale]/about/page";
import FacilitiesPage from "@/app/[locale]/about/facilities/page";
import ClinicalPage from "@/app/[locale]/clinical-results/page";
import PublicationsPage from "@/app/[locale]/blog/publications/page";
import BranchPage, { generateMetadata as branchMetadata } from "@/app/[locale]/about/branches/[slug]/page";
import CategoryPage, { generateMetadata as categoryMetadata } from "@/app/[locale]/clinical-results/category/[category]/page";
import { HomeStatsServer } from "@/components/sections/home-stats-server";
import { getBranchDetails } from "./branch-content";
import { categoryKeyFromHash } from "./clinical-categories";
import { ContactForm } from "@/app/[locale]/contact/contact-form";

beforeEach(() => {
  vi.stubEnv("CONTENT_SOURCE", "payload");
  state.locale = "en";
  state.docs = {};
  vi.stubGlobal("fetch", vi.fn(async (input: string) => {
    const url = new URL(input);
    const collection = url.pathname.split("/").at(-1)!;
    return { ok: true, json: async () => ({ docs: state.docs[collection] ?? [] }) };
  }));
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

describe("locale-stable clinical case navigation", () => {
  it.each(["en", "kh", "cn"])("keeps the same case ID in the %s gallery and category page", async (locale) => {
    state.locale = locale;
    state.docs["clinical-cases"] = [
      { id: 1, sourceId: "case-a", slug: "case-a", title: "Selected case", category: locale === "en" ? "Full Mouth" : "Localized category", categoryKey: "full-mouth-reconstruction" },
      { id: 2, sourceId: "case-b", slug: "case-b", title: "Other case", category: "Other localized category", categoryKey: "orthodontics" },
    ];
    const cases = await payload.getPayloadClinicalCases();
    expect(cases[0]).toMatchObject({ id: "case-a", categoryKey: "full-mouth-reconstruction" });
    const gallery = renderToStaticMarkup(<ClinicalResultsGrid cases={cases} initialCategory="full-mouth-reconstruction" />);
    expect(gallery).toContain('/clinical-results/case-a');
    expect(gallery).not.toContain('/clinical-results/case-b');
    const page = renderToStaticMarkup(await CategoryPage({ params: Promise.resolve({ locale, category: "full-mouth-reconstruction" }) }));
    expect(page).toContain('/clinical-results/case-a');
    expect(page).not.toContain('/clinical-results/case-b');
    if (locale !== "en") {
      const label = (locale === "kh" ? km : zh).clinicalResultsGrid.cat.fullMouth;
      expect(page).toContain(label);
      const meta = await categoryMetadata({ params: Promise.resolve({ locale, category: "full-mouth-reconstruction" }) });
      expect(meta.title).toContain(label);
      expect(meta.description).not.toContain("Real full-mouth");
    }
  });
});

describe("Payload branches", () => {
  it.each([
    ["74b77631-3bd3-4bf4-bc0d-400bc4dab254", "fun-mall"],
    ["fa9eb854-e2e5-4086-b879-47d80d26200c", "aeon-mall"],
    ["fbc48bfa-9807-402f-aa7f-e0cf45d15272", "sisowath-high-school"],
    ["6da5da97-aec4-400b-a045-0df6311f78e3", "ph-euro-park"],
    ["7fcf8912-ccff-4add-8910-7c637e312473", "rose-condo"],
  ])("keeps source UUID %s attached to %s despite name edits and reorder", async (sourceId, slug) => {
    expect(matchStaticBranch({ id: sourceId, name: "Edited official name" })?.slug).toBe(slug);
    state.docs.branches = [{ id: 999, sourceId, slug: null, name: "Edited official name" }];
    const [branch] = await getBranchDetails();
    const original = BRANCHES.find((branch) => branch.slug === slug)!;
    expect(branch).toMatchObject({ slug, name: "Edited official name", mapPlaceUrl: original.mapPlaceUrl, mapEmbedSrc: original.mapEmbedSrc });
  });
  it("lets the frozen source UUID win over a conflicting branch name", () => {
    expect(matchStaticBranch({ id: "74b77631-3bd3-4bf4-bc0d-400bc4dab254", name: "AEON Mall Sen Sok" })?.slug).toBe("fun-mall");
  });
  it("keeps the CMS mapUrl and lossless photos JSON, including non-array legacy JSON", async () => {
    const photos = { exterior: { src: "exterior.jpg", caption: "CMS caption" } };
    state.docs.branches = [{ id: 1, name: "New branch", mapUrl: "https://maps.test/cms", photos }];
    expect((await payload.getPayloadBranches())[0]).toMatchObject({ map_place_url: "https://maps.test/cms", photos });
  });
  it("shows localized names in Contact while keeping the official booking value", async () => {
    state.docs.branches = [{ id: 1, name: "Official booking name", displayName: "Localized visitor name" }];
    const html = renderToStaticMarkup(<ContactForm branches={await payload.getPayloadBranches()} doctors={[]} />);
    expect(html.includes('value="Official booking name">Localized visitor name</option>')).toBe(true);
    expect(html.includes('>Localized visitor name</p>')).toBe(true);
  });
  it("uses CMS visitor fields on facilities/detail and preserves exact maps across legacy slug differences", async () => {
    state.docs.branches = [{
      id: 9, sourceId: "fa9eb854-e2e5-4086-b879-47d80d26200c", name: "Roomchang Dental Clinic - Aeon Mall Sen Sok City Branch", slug: "roomchang-dental-clinic-aeon-mall-sen-sok-city-branch",
      shortName: "AEON official", displayName: "Localized AEON", shortDisplayName: "Localized short",
      address: "CMS address", hours: "CMS hours", phone: "12345", description: "CMS description",
      imageUrl: "https://example.test/branch.jpg", imageAlt: "CMS image alt",
    }];
    const page = renderToStaticMarkup(await BranchPage({ params: Promise.resolve({ locale: "en", slug: "aeon-mall" }) }));
    for (const value of ["Localized short", "CMS address", "CMS hours", "12345", "CMS description", "CMS image alt", BRANCHES[2].mapPlaceUrl!, BRANCHES[2].mapEmbedSrc!]) expect(page).toContain(value.replaceAll("&", "&amp;"));
    const facilities = renderToStaticMarkup(await FacilitiesPage({ params: Promise.resolve({ locale: "en" }) }));
    expect(facilities).toContain("Localized AEON");
    expect(facilities).toContain("CMS description");
    expect(facilities).toContain('/about/branches/aeon-mall');
    expect((await branchMetadata({ params: Promise.resolve({ locale: "en", slug: "aeon-mall" }) })).title).toContain("Localized short");
    expect((await payload.getPayloadBranches())[0].name).toBe("Roomchang Dental Clinic - Aeon Mall Sen Sok City Branch");
  });
  it("keeps CMS maps/media/photos and never assigns another branch's fallback by array order", async () => {
    state.docs.branches = [
      { id: 1, slug: "new-location", name: "New official location", mapPlaceUrl: "https://maps.test/new", mapEmbedSrc: "https://maps.test/embed", image: { id: 10, url: "https://media.test/branch.jpg", alt: "Upload alt" }, imageUrl: "legacy.jpg", photos: [{ url: "https://media.test/photo.jpg", alt: "Photo alt" }] },
      { id: 2, slug: "rose-condo", name: "Rose Condo", shortName: "Official short", displayName: " ", shortDisplayName: "", description: "", mapPlaceUrl: " " },
    ];
    const [unknown, rose] = await getBranchDetails();
    expect(unknown).toMatchObject({ slug: "new-location", name: "New official location", mapPlaceUrl: "https://maps.test/new", mapEmbedSrc: "https://maps.test/embed", imageSrc: "https://media.test/branch.jpg", imageAlt: "Upload alt", photos: [{ url: "https://media.test/photo.jpg", alt: "Photo alt" }], address: "", phone: "" });
    expect(rose).toMatchObject({ slug: "rose-condo", shortName: "Official short", mapPlaceUrl: "https://maps.app.goo.gl/vJaeFEA8ShY5LVeQ9", description: BRANCHES[1].description });
  });
  it("keeps canonical branch fallbacks and unknown CMS routes independent of conflicting names", async () => {
    state.docs.branches = [
      { id: "fresh-row", slug: "rose-condo", name: "AEON Mall Sen Sok", displayName: "Localized Rose" },
      { id: "new-row", slug: "new-location", name: "AEON Mall Sen Sok", displayName: "Localized new location" },
    ];
    const [rose, unknown] = await getBranchDetails();
    expect(rose).toMatchObject({ slug: "rose-condo", name: "Localized Rose", address: BRANCHES[1].address, phone: BRANCHES[1].phone, imageSrc: BRANCHES[1].imageSrc, mapPlaceUrl: BRANCHES[1].mapPlaceUrl });
    expect(unknown).toMatchObject({ slug: "new-location", name: "Localized new location", address: "", phone: "", imageSrc: "" });
    expect(unknown.mapPlaceUrl).toBeUndefined();
  });
});

describe("CMS timeline and stat copy", () => {
  it("keeps distinct 2022 milestone fallbacks by source ID before image or year", async () => {
    state.locale = "kh";
    state.docs["timeline-events"] = [
      { id: 70, sourceId: "7", year: "2022", heading: "CMS PH heading", imageUrl: "/about/facilities/RCD_9243Fun Mall.jpg" },
      { id: 80, sourceId: "8", year: "2022", heading: "CMS Fun heading" },
    ];
    const html = renderToStaticMarkup(<AboutTimeline events={await payload.getPayloadTimelineEvents()} />);
    expect(html.includes(km.aboutTimeline["2022a"].body)).toBe(true);
    expect(html.includes(km.aboutTimeline["2022b"].body)).toBe(true);
    expect(html.includes(km.aboutTimeline["2022a"].alt)).toBe(true);
    expect(html.includes(km.aboutTimeline["2022b"].alt)).toBe(true);
    expect(html.includes("CMS PH heading")).toBe(true);
    expect(html.includes("CMS Fun heading")).toBe(true);
  });
  it("matches timeline image before a conflicting year and never guesses an ambiguous year", async () => {
    state.locale = "cn";
    state.docs["timeline-events"] = [{ id: 50, year: "1996", heading: "CMS heading", imageUrl: "/about/facilities/RCD_9243Fun Mall.jpg" }];
    const html = renderToStaticMarkup(<AboutTimeline events={await payload.getPayloadTimelineEvents()} />);
    expect(html.includes(zh.aboutTimeline["2022b"].body)).toBe(true);
    expect(html.includes(zh.aboutTimeline["1996"].body)).toBe(false);
  });
  it("renders CMS timeline copy and uses bundled images/copy only for missing fields", async () => {
    state.docs["timeline-events"] = [{ id: 1, year: "1996", heading: "CMS milestone", caption: "CMS caption", body: "CMS body", imageAlt: "CMS alt" }];
    const page = renderToStaticMarkup(await AboutPage({ params: Promise.resolve({ locale: "en" }) }));
    expect(page).toContain("CMS milestone");
    expect(page).toContain("CMS body");
    expect(page).toContain("CMS alt");
    expect(page).toContain("/about/history-clinic-1996.jpg");
  });
  it.each([["About", AboutPage], ["Facilities", FacilitiesPage], ["Clinical", ClinicalPage]] as const)("prioritizes CMS labels and falls back locally on %s", async (_name, Page) => {
    state.locale = "cn";
    state.docs["site-stats"] = [{ id: 1, key: "specialist_dentists", displayValue: "42", label: "CMS label" }, { id: 2, key: "dental_chairs", displayValue: "88", label: "" }];
    const html = renderToStaticMarkup(await Page({ params: Promise.resolve({ locale: "cn" }) }));
    expect(html).toContain("CMS label");
    expect(html).toContain("42");
    if (_name === "About") expect(html).toContain(zh.about.stat.dentalChairs);
    if (_name === "Facilities") expect(html).toContain(zh.facilities.stats.dental_chairs);
  });
  it.each(["en", "kh", "cn"].flatMap((locale) => [null, "", " "].map((displayValue) => ({ locale, displayValue }))))("uses the current numeric stat across Home/About/Facilities/Clinical for $locale with displayValue=$displayValue", async ({ locale, displayValue }) => {
    state.locale = locale;
    state.docs["site-stats"] = ["years_experience", "specialist_dentists", "branches_count", "patients_treated"].map((key, id) => ({
      id, key, numericValue: key === "specialist_dentists" ? 42 : 1, suffix: "+",
      displayValue, originalDisplayValue: "37", label: "CMS specialist label",
    }));
    const home = await HomeStatsServer();
    expect(home.props.stats[1]).toMatchObject({ numeric_value: 42, suffix: "+", label: "CMS specialist label" });
    expect(home.props.stats[1]).not.toHaveProperty("display_value");
    for (const Page of [AboutPage, FacilitiesPage, ClinicalPage]) {
      const html = renderToStaticMarkup(await Page({ params: Promise.resolve({ locale }) }));
      expect(html).toContain(">42+<");
      expect(html).toContain("CMS specialist label");
    }
  });
  it("does not hide missing stat translations behind API English fallback", async () => {
    state.locale = "kh";
    await payload.getPayloadSiteStats();
    const url = new URL(vi.mocked(fetch).mock.calls[0][0] as string);
    expect(url.searchParams.get("fallback-locale")).toBe("none");
  });
  it("leaves missing timeline translations available for bundled locale fallback", async () => {
    state.locale = "kh";
    await payload.getPayloadTimelineEvents();
    const url = new URL(vi.mocked(fetch).mock.calls[0][0] as string);
    expect(url.searchParams.get("fallback-locale")).toBe("none");
  });
  it("keeps CMS homepage labels even when they match a bundled English label", async () => {
    state.locale = "cn";
    state.docs["site-stats"] = ["years_experience", "specialist_dentists", "branches_count", "patients_treated"].map((key, id) => ({ id, key, numericValue: 1, label: key === "years_experience" ? "Years of Experience" : "CMS label" }));
    expect(renderToStaticMarkup(await HomeStatsServer())).toContain("Years of Experience");
  });
  it("retains the bundled timeline for non-Payload callers", () => {
    expect(renderToStaticMarkup(<AboutTimeline />)).toContain(en.aboutTimeline["1996"].heading);
  });
});

it.each([
  ["full-mouth", "full-mouth-reconstruction"], ["implants", "implants-and-crowns"],
  ["bridges", "implant-bridges"], ["orthodontics", "orthodontics"], ["cosmetic", "cosmetic-and-emax"],
])("resolves legacy hash %s and canonical hash to the same gallery cases", async (hash, key) => {
  state.docs["clinical-cases"] = [{ id: 1, slug: "selected", title: "Selected", category: "Localized text", categoryKey: key }, { id: 2, slug: "other", title: "Other", category: "Different", categoryKey: "not-selected" }];
  const cases = await payload.getPayloadClinicalCases();
  for (const input of [hash, key]) {
    const html = renderToStaticMarkup(<ClinicalResultsGrid cases={cases} initialCategory={categoryKeyFromHash(input)} />);
    expect(html.includes('/clinical-results/selected')).toBe(true);
    expect(html.includes('/clinical-results/other')).toBe(false);
  }
});

it("preserves localized visitor fields without rewriting CMS values", async () => {
  state.locale = "kh";
  state.docs["faq-items"] = [{ id: 1, question: "Question", answer: "Answer", category: "CMS category" }];
  state.docs["career-positions"] = [{ id: 1, title: "Career", slug: "career", department: "CMS department", type: "CMS type", location: "CMS location" }];
  state.docs.videos = [{ id: 1, title: "Video", url: "https://video.test", topic: "CMS topic", treatment: "CMS treatment" }];
  state.docs["international-steps"] = [{ id: 1, title: "Step", stepLabel: "CMS step" }];
  state.docs["partner-categories"] = [{ id: 1, sourceId: "group", name: "CMS partner category" }];
  state.docs.partners = [{ id: 2, name: "Partner", sourceCategoryId: "group" }];
  state.docs["pricing-comparison-sets"] = [{ id: 1, sourceId: "set", slug: "set", sourceNote: "CMS source note" }];
  state.docs["pricing-comparison-rows"] = [{ id: 2, sourceSetId: "set", treatment: "CMS comparison treatment" }];
  state.docs["news-articles"] = [{ id: 1, slug: "article", title: "Article", imageAlt: "CMS article alt" }];
  expect(await payload.getPayloadFaqItems()).toMatchObject([{ category: "CMS category" }]);
  expect(await payload.getPayloadCareerPositions()).toMatchObject([{ department: "CMS department", type: "CMS type", location: "CMS location" }]);
  expect(await payload.getPayloadVideos()).toMatchObject([{ topic: "CMS topic", treatment: "CMS treatment" }]);
  expect(await payload.getPayloadInternationalSteps()).toMatchObject([{ step_label: "CMS step" }]);
  expect(await payload.getPayloadPartnerGroups()).toMatchObject([{ title: "CMS partner category", partners: [{ name: "Partner" }] }]);
  expect(await payload.getPayloadPricingComparisonSet("set")).toMatchObject({ source_note: "CMS source note", pricing_comparison_rows: [{ treatment: "CMS comparison treatment" }] });
  expect(await payload.getPayloadNewsArticles()).toMatchObject([{ imageAlt: "CMS article alt" }]);
});

it("uses localized publication displayTitle without changing citation metadata or losing abstract", async () => {
  state.docs.publications = [{ id: 1, title: "Citation title", displayTitle: "Localized title", abstract: "Localized abstract", authors: "Authors", doi: "doi" }, { id: 2, title: "Citation fallback", displayTitle: " " }];
  expect(await payload.getPayloadPublications()).toMatchObject([{ title: "Localized title", abstract: "Localized abstract", authors: "Authors", doi: "doi" }, { title: "Citation fallback" }]);
});

describe("publication page content source", () => {
  it.each(["en", "kh", "cn"])("renders %s CMS display titles, original citations, and title fallbacks in the existing layout", async (locale) => {
    state.locale = locale;
    state.docs.publications = [
      { id: 1, sourceId: "cms-publication", title: "Original citation title", displayTitle: `CMS visitor title ${locale}`, authors: "CMS Authors", journal: "CMS Journal", year: 2026, doi: "10.1234/cms-study" },
      { id: 2, title: "Original fallback title", displayTitle: " ", year: 2024, url: "https://example.test/paper" },
      { id: 3, title: "Citation without a link", year: 2023 },
    ];
    const html = renderToStaticMarkup(await PublicationsPage({ params: Promise.resolve({ locale }) }));
    for (const value of [`CMS visitor title ${locale}`, "Original citation title", "Original fallback title", "Citation without a link", "CMS Authors", "CMS Journal", 'href="https://doi.org/10.1234/cms-study"', 'href="https://example.test/paper"']) expect(html).toContain(value);
    expect(html.match(/<article/g)).toHaveLength(3);
    expect(html).not.toContain("1714360");
    const url = new URL(vi.mocked(fetch).mock.calls[0][0] as string);
    expect(url.pathname).toBe("/api/publications");
    expect(url.searchParams.get("locale")).toBe(locale);
    expect(url.searchParams.get("fallback-locale")).toBe("none");
  });
  it("keeps the bundled production publications without fetching CMS or Supabase", async () => {
    vi.stubEnv("CONTENT_SOURCE", "supabase");
    state.docs.publications = [{ id: 1, title: "CMS-only title", year: 2026 }];
    const html = renderToStaticMarkup(await PublicationsPage({ params: Promise.resolve({ locale: "en" }) }));
    expect(html.match(/<article/g)).toHaveLength(8);
    for (const item of Object.values(en.publications.items)) expect(html).toContain(item.title.replaceAll("&", "&amp;"));
    expect(html).toContain("1714360");
    expect(html).not.toContain("CMS-only title");
    expect(fetch).not.toHaveBeenCalled();
  });
});
