import { HomeHero } from "@/components/sections/home-hero";
import { HomeBrands } from "@/components/sections/home-brands";
import { HomeStats } from "@/components/sections/home-stats";
import { HomeServices } from "@/components/sections/home-services";
import { HomeFeatured } from "@/components/sections/home-featured";
import { HomeTestimonials } from "@/components/sections/home-testimonials";
import { SiteShell } from "@/components/site/site-shell";

export default function Home() {
  return (
    <SiteShell>
      <HomeHero />
      <HomeBrands />
      <HomeStats />
      <HomeServices />
      <HomeFeatured />
      <HomeTestimonials />
    </SiteShell>
  );
}
