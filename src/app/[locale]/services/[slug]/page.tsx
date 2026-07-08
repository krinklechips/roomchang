import { notFound } from "next/navigation";
import { getSeoPageMeta, getServiceBySlug, getServices } from "@/lib/data";
import { buildSeoMetadata } from "@/lib/seo";
import { setRequestLocale } from "next-intl/server";
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
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
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
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  // Dummy-site mode: refresh this page when the doc is saved in the Payload
  // admin (Live Preview). Never rendered on the live deployment.
  if (process.env.CONTENT_SOURCE === "payload") {
    const { PayloadLiveRefresh } = await import("@/components/site/payload-live-refresh");
    return (
      <>
        <PayloadLiveRefresh serverURL={process.env.PAYLOAD_API_URL || "http://localhost:3100"} />
        <ServiceDetailContent service={service} />
      </>
    );
  }

  return <ServiceDetailContent service={service} />;
}
