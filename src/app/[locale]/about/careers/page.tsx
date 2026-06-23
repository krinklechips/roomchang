import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, ArrowRight, Briefcase, Mail, Phone } from "lucide-react";
import { POSITIONS } from "@/lib/careers";
import { getTranslatedFieldsBatch, mergeTranslation } from "@/lib/i18n-content";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Employment Opportunities | Roomchang Dental Hospital",
  description:
    "Join Cambodia’s leading dental group. View current job openings at Roomchang Dental Hospital — clinical fellowships, dentists, dental assistants, and customer service positions.",
};

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("careers");

  // Overlay active-locale job translations (content_translations).
  const posTr = await getTranslatedFieldsBatch("career_position", POSITIONS.map((p) => p.slug));
  const positions = POSITIONS.map((p) => mergeTranslation(p, posTr.get(p.slug) ?? {}));
  return (
    <SiteShell>
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> {t("backLink")}
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            {t("intro")}
          </p>
        </div>
      </div>

      {/* Contact banner */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--brand)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Mail size={15} strokeWidth={2} aria-hidden="true" />
            <span>hr@roomchang.com</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <Phone size={15} strokeWidth={2} aria-hidden="true" />
            <span>+855 98 843 322</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
        <p className="mb-10 text-sm leading-7 text-[color:var(--text-soft)]">
          {t("applyInstructions.before")}{" "}
          <strong className="text-[color:var(--text-main)]">hr@roomchang.com</strong>
          {t("applyInstructions.middle")}{" "}
          <strong className="text-[color:var(--text-main)]">+855 98 843 322</strong>
          {t("applyInstructions.after")}
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {positions.map((pos) => (
            <Link
              key={pos.slug}
              href={`/about/careers/${pos.slug}`}
              className="group flex flex-col rounded-3xl border border-[color:var(--border-strong)] bg-white p-8 shadow-[0_12px_40px_rgba(57,28,45,0.05)] transition hover:border-[color:var(--brand-light)] hover:shadow-[0_16px_48px_rgba(57,28,45,0.10)]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                  <Briefcase size={18} strokeWidth={2} aria-hidden="true" />
                </span>
                <span className="rounded-full bg-[color:var(--surface)] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                  {pos.category}
                </span>
              </div>

              <h2 className="mt-4 font-display text-2xl text-[color:var(--text-main)] group-hover:text-[color:var(--brand-deep)]">
                {pos.title}
              </h2>

              <p className="mt-3 flex-1 text-sm leading-7 text-[color:var(--text-soft)]">
                {pos.shortDescription}
              </p>

              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--brand-deep)] transition group-hover:text-[color:var(--brand)]">
                {t("viewDetails")} <ArrowRight size={14} strokeWidth={2} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Apply CTA */}
        <div className="mt-12 rounded-3xl bg-[color:var(--brand-soft)] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[color:var(--text-main)]">
                {t("cta.heading")}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
                {t("cta.description")}
              </p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0">
              {t("cta.button")}
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
