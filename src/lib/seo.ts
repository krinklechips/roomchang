import type { Metadata } from "next";
import type { SeoPageMeta } from "./data";

type SeoMetadataDefaults = {
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

  return {
    title: seo?.title ?? defaults.title,
    description,
    alternates: seo?.canonicalUrl
      ? {
          canonical: seo.canonicalUrl,
        }
      : undefined,
    robots: seo
      ? {
          index: !seo.noIndex,
          follow: true,
        }
      : undefined,
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
