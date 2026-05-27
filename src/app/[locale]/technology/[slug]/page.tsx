import { notFound } from "next/navigation";
import { getSeoPageMeta, getTechnologyBySlug, getTechnology } from "@/lib/data";
import { buildSeoMetadata } from "@/lib/seo";
import { TechnologyDetailContent } from "@/components/pages/TechnologyDetailContent";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const items = await getTechnology();
  return items.filter((t) => t.slug).map((t) => ({ slug: t.slug! }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [tech, seo] = await Promise.all([
    getTechnologyBySlug(slug),
    getSeoPageMeta(`/technology/${slug}`),
  ]);

  if (!tech) return {};

  return buildSeoMetadata(
    {
      path: `/technology/${slug}`,
      title: `${tech.name} | Roomchang Dental Hospital`,
      description: tech.description ?? null,
    },
    seo,
  );
}

export default async function TechnologyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tech = await getTechnologyBySlug(slug);
  if (!tech) notFound();

  const t = await getTranslations("technologyDetail");
  const translations = {
    backLink: t("backLink"),
    bookConsultation: t("bookConsultation"),
    allTechnology: t("allTechnology"),
    ctaHeading: t("ctaHeading"),
    ctaBody: t("ctaBody"),
  };

  return <TechnologyDetailContent tech={tech} translations={translations} />;
}
