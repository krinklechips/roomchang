import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/site/site-shell";
import { RenderSection } from "@/components/pages/ServiceDetailContent";
import type { PayloadCmsPage } from "@/lib/payload-source";
import type { ServiceSection } from "@/lib/data";

/**
 * Renderer for CMS-authored Custom Pages (the Payload `pages` collection).
 *
 * A page is a title + the same section blocks Services/Technology use, so the
 * body reuses RenderSection 1:1 — anything an editor can build in the CMS
 * renders here with the site's existing look.
 */
export async function PayloadPageContent({ page }: { page: PayloadCmsPage }) {
  const t = await getTranslations("services.detail");
  const sections = (page.sections?.sections ?? []) as unknown as ServiceSection[];

  return (
    <SiteShell>
      {/* Title band */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
          <h1 className="font-display text-4xl leading-tight text-[color:var(--text-main)] sm:text-5xl">
            {page.title ?? page.slug}
          </h1>
        </div>
      </div>

      {/* Sections */}
      {sections.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8 space-y-8 sm:space-y-16">
          {sections.map((s, i) => (
            <RenderSection
              key={i}
              s={s}
              pricingCtaLabel={t("pricingCtaLabel")}
              pricingCtaNote={t("pricingCtaNote")}
              pricingHref="/pricing"
            />
          ))}
        </div>
      )}
    </SiteShell>
  );
}
