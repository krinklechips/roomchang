import { setRequestLocale } from "next-intl/server";
import { HomeHero } from "@/components/sections/home-hero";
import { HomeBrands } from "@/components/sections/home-brands";
import { HomeStatsServer } from "@/components/sections/home-stats-server";
import { HomeServices } from "@/components/sections/home-services";
import { HomeFeatured } from "@/components/sections/home-featured";
import { HomeTestimonials } from "@/components/sections/home-testimonials";
import { SiteShell } from "@/components/site/site-shell";
import { getTestimonials } from "@/lib/data";

export const revalidate = 60;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const testimonials = await getTestimonials();

  return (
    <SiteShell>
      <HomeHero />
      <HomeBrands />
      <HomeStatsServer />
      <HomeServices />
      <HomeFeatured />
      <HomeTestimonials testimonials={testimonials} />
    </SiteShell>
  );
}
