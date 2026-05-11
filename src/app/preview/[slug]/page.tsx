/**
 * CMS Preview Route — /preview/[slug]
 *
 * Fetches unpublished page data directly from the CMS tenant API using a
 * shared preview token. Bypasses the published-only filter so editors can
 * preview draft content before publishing.
 *
 * Required environment variables:
 *   CMS_API_URL          - Base URL of the cms-platform server
 *   CMS_PREVIEW_TOKEN    - Shared secret checked against ?token= query param
 *   CMS_TENANT_SLUG      - Tenant identifier (default "roomchang")
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteShell } from "@/components/site/site-shell";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { CmsPage } from "@/lib/cms";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}

const CMS_API_URL = process.env.CMS_API_URL?.replace(/\/$/, "") ?? "";
const CMS_PREVIEW_TOKEN = process.env.CMS_PREVIEW_TOKEN ?? "";
const CMS_TENANT_SLUG = process.env.CMS_TENANT_SLUG ?? "roomchang";

async function getPreviewPage(slug: string): Promise<CmsPage | null> {
  if (!CMS_API_URL) return null;

  const url = `${CMS_API_URL}/api/public/pages/${encodeURIComponent(slug)}?tenantSlug=${CMS_TENANT_SLUG}&preview=1`;
  const res = await fetch(url, { cache: "no-store" });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`CMS preview API error ${res.status} for "${slug}"`);
  }

  const json = await res.json();
  return (json?.item as CmsPage) ?? null;
}

export default async function PreviewPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { token } = await searchParams;

  // Gate: require matching token unless CMS_PREVIEW_TOKEN is not configured
  if (CMS_PREVIEW_TOKEN && token !== CMS_PREVIEW_TOKEN) {
    notFound();
  }

  if (!CMS_API_URL) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-6 py-4 text-sm font-medium text-amber-700">
          Preview not available — <code className="font-mono">CMS_API_URL</code> is not set.
        </p>
      </div>
    );
  }

  let page: CmsPage | null;
  try {
    page = await getPreviewPage(slug);
  } catch (err) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
        <p className="rounded-lg border border-red-300 bg-red-50 px-6 py-4 text-sm font-medium text-red-700">
          CMS preview error: {String(err)}
        </p>
      </div>
    );
  }

  if (!page) notFound();

  return (
    <SiteShell>
      <main>
        <BlockRenderer blocks={page.blocks} />
      </main>
    </SiteShell>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Preview — ${slug}`,
    robots: { index: false, follow: false },
  };
}

export const dynamic = "force-dynamic";
