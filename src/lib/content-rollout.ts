import type { MetadataRoute } from "next";

type RolloutEnvironment = {
  [key: string]: string | undefined;
  CONTENT_SOURCE?: string;
  CMS_PILOT_PAGES?: string;
  SITE_VISIBILITY?: string;
};

type PageAddress = { locale: string; path: string };
export type ContentSource = "legacy" | "payload";

const REGISTERED_PILOT_PAGE = "/en/blog/publications";

function selectedPages(env: RolloutEnvironment): string[] {
  const pages = (env.CMS_PILOT_PAGES || "").split(",").map(value => value.trim()).filter(Boolean);
  if (pages.length && env.CONTENT_SOURCE !== "pilot") {
    throw new Error("CMS pilot pages require explicit pilot mode.");
  }
  if (pages.length && env.VERCEL_ENV === "production") {
    throw new Error("The CMS pilot is blocked on production until its content differences are approved.");
  }
  if (pages.some(page => page !== REGISTERED_PILOT_PAGE)) {
    throw new Error("The CMS pilot allowlist contains an unregistered page.");
  }
  return [...new Set(pages)];
}

export function resolveContentSource(page: PageAddress, env: RolloutEnvironment = process.env): ContentSource {
  const pages = selectedPages(env);
  if (env.CONTENT_SOURCE === "pilot") {
    return page.locale === "en" && page.path === "/blog/publications" && pages.includes(REGISTERED_PILOT_PAGE) ? "payload" : "legacy";
  }
  return "legacy";
}

export function pilotSitemapEntries(env: RolloutEnvironment = process.env): MetadataRoute.Sitemap {
  return selectedPages(env).map(page => {
    const url = `https://www.roomchang.com${page}`;
    return { url, changeFrequency: "monthly", priority: 0.5,
      alternates: { languages: { en: url, "x-default": url } } };
  });
}

export const isStagingDeployment = (env: RolloutEnvironment = process.env): boolean => env.SITE_VISIBILITY === "staging";
