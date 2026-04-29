import type { MetadataRoute } from "next";
import { BRANCHES } from "@/lib/branches";
import { supabaseServer } from "@/lib/supabase-server";

const BASE_URL = "https://roomchang.com";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/`, changeFrequency: "weekly", priority: 1 },
  { url: `${BASE_URL}/services`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${BASE_URL}/team`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/technology`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/pricing`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/clinical-results`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/international`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE_URL}/about/facilities`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/about/community`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/about/partnerships`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/about/director-message`, changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/about/vision-mission-values`, changeFrequency: "monthly", priority: 0.6 },
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
    ...STATIC_ROUTES,
    ...serviceSlugs.map((slug) => ({
      url: `${BASE_URL}/services/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...technologySlugs.map((slug) => ({
      url: `${BASE_URL}/technology/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...clinicalCaseSlugs.map((slug) => ({
      url: `${BASE_URL}/clinical-results/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...BRANCHES.map((branch) => ({
      url: `${BASE_URL}/about/branches/${branch.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
