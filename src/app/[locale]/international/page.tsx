import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteShell } from "@/components/site/site-shell";
import { InteractiveSteps } from "@/components/sections/interactive-steps";
import { ChecklistForm } from "@/components/sections/checklist-form";
import { getInternationalSteps, getInternationalWhyItems, getInternationalPopularTreatments } from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("international");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

function renderWhyCard(
  item: { title: string; description: string },
  testimonialsCta: string,
  priceComparisonCta: string,
) {
  const keyword = "Read their stories in our testimonials.";
  const hasTestimonials = item.description.includes(keyword);
  const cleanDesc = hasTestimonials ? item.description.replace(keyword, "").trim() : item.description;
  // The cost-savings card links straight to the international price comparison.
  const isCostSavings = /cost savings/i.test(item.title);

  return (
    <div
      key={item.title}
      className="rounded-2xl border border-[color:var(--border-strong)] bg-white p-6 shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
    >
      <h3 className="font-display text-xl text-[color:var(--brand-deep)]">{item.title}</h3>
      <p className="mt-3 text-sm leading-6 text-[color:var(--text-soft)]">{cleanDesc}</p>
      {hasTestimonials && (
        <Link
          href="/about/testimonials"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-soft)] px-4 py-2 text-xs font-bold text-[color:var(--brand-deep)] transition hover:bg-[color:var(--brand-light)] hover:text-white"
        >
          {testimonialsCta} <ArrowRight size={13} weight="bold" aria-hidden="true" />
        </Link>
      )}
      {isCostSavings && (
        <Link
          href="/international/price-comparison"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-soft)] px-4 py-2 text-xs font-bold text-[color:var(--brand-deep)] transition hover:bg-[color:var(--brand-light)] hover:text-white"
        >
          {priceComparisonCta} <ArrowRight size={13} weight="bold" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export default async function InternationalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [steps, whyItems, popularTreatments, t] = await Promise.all([
    getInternationalSteps(),
    getInternationalWhyItems(),
    getInternationalPopularTreatments(),
    getTranslations("international"),
  ]);

  const HERO_TRUST = [
    { value: "35–60%", label: t("stat.savings") },
    { value: "30 yrs", label: t("stat.experience") },
  ];

  return (
    <SiteShell>
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
              <Link href="/contact" className="btn-primary">
                {t("hero.ctaPrimary")}
              </Link>
              <Link href="/services" className="btn-secondary">
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex lg:justify-end">
            <div className="grid grid-cols-2 gap-4">
              {HERO_TRUST.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[color:var(--brand-soft)] bg-white px-8 py-7 shadow-[0_8px_24px_rgba(57,28,45,0.06)]">
                  <p className="font-display text-4xl text-[color:var(--brand-deep)]">{item.value}</p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div className="border-b border-[color:var(--border-strong)]">
        <div className="relative aspect-[2500/1050] overflow-hidden sm:aspect-[21/8]">
          <Image
            src="/hero/hero-customer-service.jpg"
            alt={t("hero.imageAlt")}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8 space-y-10 sm:space-y-20">

        {/* Why Roomchang */}
        <section>
          <h2 className="font-display text-4xl text-[color:var(--text-main)]">{t("why.heading")}</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)] max-w-xl">
            {t("why.body")}
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyItems.map((item) => renderWhyCard(item, t("why.testimonialsCta"), t("why.priceComparisonCta")))}
          </div>
        </section>

        {/* Cost comparison */}
        <section className="rounded-3xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] overflow-hidden">
          <div className="px-8 py-8 border-b border-[color:var(--border-strong)]">
            <h2 className="font-display text-3xl text-[color:var(--text-main)]">{t("cost.heading")}</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--text-soft)]">
              {t("cost.body")}
            </p>
          </div>
          <div className="divide-y divide-[--border-strong]">
            {popularTreatments.map((tx) => (
              <div
                key={tx.name}
                className="flex items-center justify-between px-8 py-4"
              >
                <p className="text-sm font-semibold text-[color:var(--text-main)]">{tx.name}</p>
                <span className="rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-xs font-bold text-[color:var(--brand-deep)]">
                  {tx.saving}
                </span>
              </div>
            ))}
          </div>
          <div className="px-8 py-5 bg-[color:var(--brand-soft)] flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[color:var(--text-soft)]">
              {t("cost.disclaimer")}
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 shrink-0 text-sm font-semibold text-[color:var(--brand-deep)] hover:text-[color:var(--brand)] transition"
            >
              {t("cost.viewPricing")} <ArrowRight size={14} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works">
          <h2 className="font-display text-4xl text-[color:var(--text-main)]">{t("howItWorks.heading")}</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)] max-w-xl">
            {t("howItWorks.body")}
          </p>
          <InteractiveSteps steps={steps} />
          <ChecklistForm />
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-[color:var(--brand)] p-10 sm:p-14 text-white">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-4xl">{t("cta.heading")}</h2>
              <p className="mt-2 text-sm leading-7 text-white/80 max-w-md">
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
