import { notFound } from "next/navigation";
import { getPreviewTechnology } from "@/lib/preview";
import { TechnologyDetailContent } from "@/components/pages/TechnologyDetailContent";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Preview route for technology detail pages.
 *
 * Renders the SAME component as the live page, but reads from
 * content_drafts (merged over live data). Authentication is
 * handled by middleware (token or Basic Auth).
 *
 * URL: /preview/technology/[slug]?token=SECRET
 */
export default async function PreviewTechnologyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tech = await getPreviewTechnology(slug);
  if (!tech) notFound();

  return <TechnologyDetailContent tech={tech} />;
}
