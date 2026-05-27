import { notFound } from "next/navigation";
import { getPreviewService } from "@/lib/preview";
import { ServiceDetailContent } from "@/components/pages/ServiceDetailContent";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Preview route for service detail pages.
 *
 * Renders the SAME component as the live page, but reads from
 * content_drafts (merged over live data). Authentication is
 * handled by middleware (token or Basic Auth).
 *
 * URL: /preview/service/[slug]?token=SECRET
 */
export default async function PreviewServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getPreviewService(slug);
  if (!service) notFound();

  return <ServiceDetailContent service={service} />;
}
