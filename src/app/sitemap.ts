import type { MetadataRoute } from "next";
import { BRANCHES } from "@/lib/branches";
import { CLINICAL_CATEGORIES } from "@/lib/clinical-categories";
import { supabaseServer } from "@/lib/supabase-server";
import { routing, LOCALE_TO_LANG, UNLISTED_LOCALES } from "@/i18n/routing";

const BASE_URL = "https://www.roomchang.com";
// Unlisted locales (under content review, e.g. /kh) are excluded from the
// sitemap's hreflang alternates — their pages are noindexed and reachable
// only by direct link until re-launched.
const LOCALES = routing.locales.filter((l) => !UNLISTED_LOCALES.includes(l)); // e.g. ["en", "cn"]
const DEFAULT_LOCALE = routing.defaultLocale; // "en"

type ChangeFreq = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
type RouteEntry = { path: string; changeFrequency: ChangeFreq; priority: number };

/**
 * One sitemap entry per page, with hreflang alternates for every locale so
 * Google/Baidu serve the right language version. The canonical `url` is the
 * default-locale (en) URL; `x-default` also points there.
 */
function localized(path: string, changeFrequency: ChangeFreq, priority: number): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  // The site serves locale roots without a trailing slash (/en, not /en/), so
  // normalise the home path ("/") to "" — otherwise the entry 308-redirects.
  const seg = path === "/" ? "" : path;
  // hreflang key = ISO language code (en/km/zh); URL = country-style segment (/en, /kh, /cn).
  for (const locale of LOCALES) languages[LOCALE_TO_LANG[locale] ?? locale] = `${BASE_URL}/${locale}${seg}`;
  const canonical = `${BASE_URL}/${DEFAULT_LOCALE}${seg}`;
  return {
    url: canonical,
    changeFrequency,
    priority,
    alternates: { languages: { ...languages, "x-default": canonical } },
  };
}

const STATIC_ROUTES: RouteEntry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  { path: "/team", changeFrequency: "monthly", priority: 0.8 },
  { path: "/technology", changeFrequency: "monthly", priority: 0.8 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.8 },
  { path: "/pricing/warranty", changeFrequency: "yearly", priority: 0.4 },
  { path: "/clinical-results", changeFrequency: "weekly", priority: 0.8 },
  { path: "/international", changeFrequency: "weekly", priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about/facilities", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about/community", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about/partnerships", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about/director-message", changeFrequency: "monthly", priority: 0.6 },
  { path: "/about/vision-mission-values", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.3 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookie-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/booking-cancellation-policy", changeFrequency: "yearly", priority: 0.3 },
];

async function getPublishedSlugs(
  table: "services" | "technology" | "clinical_cases",
  options?: { requireSlug?: boolean },
): Promise<string[]> {
  let query = supabaseServer
    .from(table)
    .select("slug")
    .eq("published", true);

  if (options?.requireSlug) {
    query = query.not("slug", "is", null);
  }

  const { data, error } = await query.order("slug");

  if (error) {
    console.error(`Failed to fetch sitemap slugs from ${table}:`, error.message);
    return [];
  }

  return (data ?? [])
    .map((row) => row.slug)
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceSlugs, technologySlugs, clinicalCaseSlugs] = await Promise.all([
    getPublishedSlugs("services"),
    getPublishedSlugs("technology", { requireSlug: true }),
    getPublishedSlugs("clinical_cases", { requireSlug: true }),
  ]);

  return [
    ...STATIC_ROUTES.map((r) => localized(r.path, r.changeFrequency, r.priority)),
    ...serviceSlugs.map((slug) => localized(`/services/${slug}`, "weekly", 0.8)),
    ...technologySlugs.map((slug) => localized(`/technology/${slug}`, "monthly", 0.7)),
    ...clinicalCaseSlugs.map((slug) => localized(`/clinical-results/${slug}`, "weekly", 0.7)),
    ...CLINICAL_CATEGORIES.map((c) => localized(`/clinical-results/category/${c.slug}`, "weekly", 0.7)),
    ...BRANCHES.map((branch) => localized(`/about/branches/${branch.slug}`, "monthly", 0.6)),
  ];
}
