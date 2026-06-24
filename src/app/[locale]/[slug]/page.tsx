/**
 * CMS catch-all page route — /[slug]
 *
 * Resolves after all specific static routes (/, /about, /services, /team, etc.)
 * because Next.js always prefers explicit routes over dynamic segments.
 *
 * Fetches page content from the CMS platform API and renders it using the
 * BlockRenderer. Returns 404 when the CMS is not configured, the page does not
 * exist, or the page is not published.
 */

import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getCmsPage } from "@/lib/cms";
import { resolveLegacyPath } from "@/lib/legacy-redirects";
import { CmsPageContent } from "@/components/pages/CmsPageContent";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const page = await getCmsPage(slug).catch(() => null);

  if (!page) {
    return { title: "Page not found" };
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
    openGraph: page.seoImage
      ? { images: [{ url: page.seoImage }] }
      : undefined,
  };
}

export default async function CmsPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let page;
  try {
    page = await getCmsPage(slug);
  } catch (err) {
    // Surface config/network errors loudly in development
    if (process.env.NODE_ENV !== "production") {
      throw err;
    }
    notFound();
  }

  if (!page) {
    // Not a CMS page — maybe an old WordPress postname URL. 301/308 it to the
    // new article if the slug matches; otherwise 404.
    const target = await resolveLegacyPath([slug]);
    if (target) permanentRedirect(`/${locale}${target}`);
    notFound();
  }

  return <CmsPageContent page={page} />;
}

// Static params are not pre-generated because CMS pages are dynamic by
// nature. ISR (revalidate: 60 in getCmsPage) handles caching.
export const dynamic = "force-dynamic";
