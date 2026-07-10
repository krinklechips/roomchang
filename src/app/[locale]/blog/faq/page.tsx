import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { getFaqItems, type FaqItem } from "@/lib/data";
import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faqPage" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("faqPage");

  const STATIC_FAQS: FaqItem[] = [
    {
      id: "static-overall-health-xray-pregnancy-preparation",
      category: t("staticFaqs.xrayPregnancy.category"),
      question: t("staticFaqs.xrayPregnancy.question"),
      answer: t("staticFaqs.xrayPregnancy.answer"),
      sort_order: 999,
    },
  ];

  const fetchedFaqs = await getFaqItems();
  const faqs = [
    ...fetchedFaqs,
    ...STATIC_FAQS.filter(
      (staticFaq) => !fetchedFaqs.some((faq) => faq.question === staticFaq.question),
    ),
  ];

  // Group by category
  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    const cat = faq.category ?? t("defaultCategory");
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> {t("backLink")}
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            {t("heading")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            {t("intro")}
          </p>
        </div>
      </div>

      {/* FAQ content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
        {faqs.length === 0 ? (
          <p className="text-center text-sm text-[color:var(--text-soft)]">
            {t("emptyState")}
          </p>
        ) : (
          <div className="space-y-14">
            {categories.map((cat) => (
              <div key={cat}>
                <h2 className="font-display text-3xl text-[color:var(--text-main)] sm:text-4xl">{cat}</h2>
                <div className="mt-8 divide-y divide-[color:var(--border-strong)]">
                  {grouped[cat].map((faq) => (
                    <details key={faq.id} className="group">
                      <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-base font-semibold leading-snug text-[color:var(--text-main)] transition hover:text-[color:var(--brand-deep)] sm:py-7 sm:text-lg [&::-webkit-details-marker]:hidden">
                        <span className="flex-1">{faq.question}</span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          aria-hidden="true"
                          className="shrink-0 text-[color:var(--text-soft)] transition-transform duration-200 group-open:rotate-180"
                        >
                          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </summary>
                      <div className="pb-7 pr-12">
                        <p className="text-base leading-8 text-[color:var(--text-soft)]">
                          {faq.answer}
                        </p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-[color:var(--brand-soft)] px-8 py-8 text-center">
          <h3 className="font-display text-2xl text-[color:var(--brand-deep)]">
            {t("cta.heading")}
          </h3>
          <p className="mt-2 text-sm text-[color:var(--text-soft)]">
            {t("cta.body")}
          </p>
          <Link href="/contact#enquiry-form" className="btn-primary mt-5 inline-block">{t("cta.button")}</Link>
        </div>
      </div>
    </SiteShell>
  );
}
