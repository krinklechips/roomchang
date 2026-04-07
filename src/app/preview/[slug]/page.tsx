/**
 * CMS Preview Route — /preview/[slug]
 *
 * Stub for future CMS integration. When the CMS platform is connected,
 * this route will:
 *  1. Verify a shared preview token (x-preview-token header or ?token= param)
 *  2. Fetch the page's block data from the CMS API
 *  3. Render each block using the same components as the live site
 *
 * Until integration is live, this returns a clearly visible placeholder so the
 * editor's "Preview" button has a real destination to link to.
 */

import { notFound } from "next/navigation";

// Preview is disabled until the CMS is connected.
// Set to true once the CMS API integration is wired up.
const CMS_PREVIEW_ENABLED = false;

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!CMS_PREVIEW_ENABLED) {
    notFound();
  }

  // TODO: fetch page blocks from CMS API
  // const cmsApiUrl = process.env.CMS_API_URL
  // const previewToken = process.env.CMS_PREVIEW_TOKEN
  // const res = await fetch(`${cmsApiUrl}/api/tenant/pages/by-slug/${slug}`, {
  //   headers: { Authorization: `Bearer ${previewToken}` },
  //   cache: "no-store",
  // })
  // if (!res.ok) notFound()
  // const page = await res.json()

  // Render blocks
  // return <PageRenderer page={page} />

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
      <p className="text-sm text-gray-400">Preview not yet enabled for {slug}</p>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: `Preview — ${slug}`,
    robots: { index: false, follow: false },
  };
}
