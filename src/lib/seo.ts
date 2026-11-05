import type { Metadata } from "next";
import type { SeoPageMeta } from "./data";
import { UNLISTED_LOCALES } from "@/i18n/routing";
import { isStagingDeployment } from "./content-rollout";

type SeoMetadataDefaults = {
  locale: string;
  path: string;
  title: string;
  description: string | null;
};

export function buildSeoMetadata(
  defaults: SeoMetadataDefaults,
  seo: SeoPageMeta | null,
): Metadata {
  const description = seo?.description ?? defaults.description ?? undefined;
  const openGraphTitle = seo?.ogTitle ?? seo?.title ?? defaults.title;
  const openGraphDescription =
    seo?.ogDescription ?? seo?.description ?? defaults.description ?? undefined;
  const twitterTitle = seo?.twitterTitle ?? openGraphTitle;
  const twitterDescription = seo?.twitterDescription ?? openGraphDescription;
  const image = seo?.ogImage ?? undefined;
  const twitterImage = seo?.twitterImage ?? image;
  const restricted = isStagingDeployment() || UNLISTED_LOCALES.includes(defaults.locale);

  return {
    title: seo?.title ?? defaults.title,
    description,
    alternates: seo?.canonicalUrl
      ? {
          canonical: seo.canonicalUrl,
        }
      : undefined,
    ...(restricted ? { robots: { index: false, follow: false } }
      : seo ? { robots: { index: !seo.noIndex, follow: true } } : {}),
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      url: defaults.path,
      images: image
        ? [
            {
              url: image,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
}
