import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  MagnifyingGlass,
  Scan,
  Drop,
  Sparkle,
  CrownSimple,
  Tooth,
  CircleHalf,
  Crosshair,
  Scissors,
  Lightning,
  Moon,
  SmileyWink,
  Syringe,
  Heart,
  CaretDown,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react/dist/lib/types";
import { SiteShell } from "@/components/site/site-shell";
import { PricingHashOpener } from "@/components/sections/pricing-hash-opener";
import { getPricingCategories } from "@/lib/data";
import type { Metadata } from "next";

// Re-fetch pricing categories from Supabase at most every 60s so CMS edits
// go live without a full redeploy.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pricing");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

const CATEGORY_ICONS: Record<string, Icon> = {
  "examination": MagnifyingGlass,
  "cleaning":    Drop,
  "x-ray":       Scan,
  "digital":     Scan,
  "filling":     Sparkle,
  "cosmetic":    Sparkle,
  "aesthetic":   Sparkle,
  "crown":       CrownSimple,
  "bridge":      CrownSimple,
  "root canal":  Tooth,
  "periodon":    Heart,
  "sedation":    Syringe,
  "denture":     SmileyWink,
  "implant":     CircleHalf,
  "orthodontic": Crosshair,
  "surgery":     Scissors,
  "whitening":   Lightning,
  "sleep":       Moon,
  "paediatric":  SmileyWink,
  "pediatric":   SmileyWink,
};

function getCategoryIcon(title: string): Icon {
  const lower = title.toLowerCase();
  for (const [key, Icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return Icon;
  }
  return Sparkle;
}


export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [categories, t] = await Promise.all([
    getPricingCategories(),
    getTranslations("pricing"),
  ]);

  const HERO_TRUST = [
    { value: "40–70%", label: t("stat.vsAusUk") },
    { value: "No",     label: t("stat.hiddenFees") },
  ];

  return (
    <SiteShell>
      {/* Opens & scrolls to the accordion section matching the URL hash (deep links from service pages) */}
      <PricingHashOpener />
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
              {t("hero.eyebrow")}
            </p>
            <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
              {t("hero.heading")}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
              {t("hero.body")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">{t("hero.ctaPrimary")}</Link>
              <Link href="/international" className="btn-secondary">{t("hero.ctaSecondary")}</Link>
            </div>
          </div>
          <div className="hidden lg:flex lg:justify-end">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {HERO_TRUST.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-[color:var(--brand-soft)] bg-white px-8 py-7 shadow-[0_8px_24px_rgba(57,28,45,0.06)]">
                    <p className="font-display text-4xl text-[color:var(--brand-deep)]">{item.value}</p>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-[color:var(--brand-soft)] bg-white px-8 py-5 shadow-[0_8px_24px_rgba(57,28,45,0.06)]">
                <p className="font-display text-xl text-[color:var(--brand-deep)]">{t("consultationHeading")}</p>
                <p className="mt-1 text-xs leading-relaxed text-[color:var(--text-soft)]">{t("hero.consultationNote")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8 space-y-10 sm:space-y-20">

        {/* Accordion price list */}
        <section>
          <div className="overflow-hidden rounded-3xl border border-[color:var(--brand-soft)] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)] divide-y divide-[color:var(--brand-soft)]">
            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.title);
              return (
                <details
                  key={cat.id}
                  id={cat.id}
                  // scroll-margin keeps the category title + first row clear of the
                  // sticky header when deep-linked from a service page (#anchor).
                  className="group scroll-mt-24 sm:scroll-mt-32"
                >
                  {/* Summary row */}
                  <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-5 transition hover:bg-[color:var(--surface)] sm:px-6 [&::-webkit-details-marker]:hidden">
                    {/* Icon tile */}
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--surface-strong)] text-[color:var(--brand-deep)]"
                      aria-hidden="true"
                    >
                      <Icon size={20} weight="duotone" />
                    </span>

                    {/* Title + item count */}
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg leading-tight text-[color:var(--text-main)]">
                        {cat.title}
                      </p>
                      <p className="mt-0.5 text-xs text-[color:var(--text-soft)]">
                        {t("itemCount", { count: cat.items.length })}
                      </p>
                    </div>

                    {/* Chevron — rotates when open */}
                    <CaretDown
                      size={16}
                      weight="bold"
                      className="shrink-0 text-[color:var(--text-soft)] transition-transform duration-200 group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>

                  {/* Expanded item list */}
                  <ul className="border-t border-[color:var(--brand-soft)] divide-y divide-[color:var(--brand-soft)] bg-[color:var(--surface)]/40">
                    {cat.items.map((item, i) => (
                      <li key={i} className="flex items-start justify-between gap-4 px-5 py-3.5 sm:px-6 sm:pl-20">
                        <div className="min-w-0">
                          <span className="block text-sm text-[color:var(--text-main)]">{item.name}</span>
                          {item.note && (
                            <span className="block text-xs text-[color:var(--text-soft)]">{item.note}</span>
                          )}
                        </div>
                        <span className="shrink-0 text-sm font-bold text-[color:var(--brand-deep)]">
                          {item.price.toLowerCase() === "free" ? t("free") : `$${item.price}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </details>
              );
            })}
          </div>
          <div className="mt-6 rounded-2xl border border-[color:var(--brand-soft)] bg-[color:var(--surface)] px-6 py-4 space-y-2">
            <p className="text-sm font-semibold text-[color:var(--text-main)]">
              {t("consultationHeading")}
            </p>
            <p className="text-xs leading-relaxed text-[color:var(--text-soft)]">
              {t("consultationDisclaimer")}
            </p>
          </div>
        </section>

        {/* International comparison link */}
        <section className="rounded-3xl border border-[color:var(--brand-soft)] bg-[color:var(--surface)] px-6 py-5 sm:flex sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm leading-7 text-[color:var(--text-soft)]">
            {t("internationalCompareNote")}
          </p>
          <Link
            href="/international/price-comparison"
            className="mt-3 inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[color:var(--brand)] hover:text-[color:var(--brand-deep)] sm:mt-0"
          >
            {t("internationalCompareLink")} →
          </Link>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-[color:var(--brand)] p-10 text-white sm:p-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-4xl">{t("cta.heading")}</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-white/80">
                {t("cta.body")}
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-full border border-white/30 bg-white px-7 py-4 text-sm font-bold text-[color:var(--brand)] transition hover:bg-white/90"
            >
              {t("cta.button")}
            </Link>
          </div>
        </section>

      </div>
    </SiteShell>
  );
}
