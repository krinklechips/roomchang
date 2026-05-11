import { notFound } from "next/navigation";
import { getSeoPageMeta, getServiceBySlug, getServices } from "@/lib/data";
import { buildSeoMetadata } from "@/lib/seo";
import { ServiceDetailContent } from "@/components/pages/ServiceDetailContent";
import type { Metadata } from "next";

// Re-fetch service content from Supabase at most every 60s so CMS edits
// (new services, content tweaks) go live without a full redeploy.
export const revalidate = 60;

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [service, seo] = await Promise.all([
    getServiceBySlug(slug),
    getSeoPageMeta(`/services/${slug}`),
  ]);

  if (!service) return {};

  return buildSeoMetadata(
    {
      path: `/services/${slug}`,
      title: `${service.name} | Roomchang Dental Hospital`,
      description: service.description ?? null,
    },
    seo,
  );
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return <ServiceDetailContent service={service} />;
}
