import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Terms of Service | Roomchang Dental Hospital",
  description:
    "Read the terms that apply when using the Roomchang Dental Hospital website, including informational content, intellectual property, and liability limits.",
};

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale: "en", namespace: "termsOfService" });

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> {t("backLink")}
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            {t("pageTitle")}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
        <div className="space-y-8 text-base leading-8 text-[color:var(--text-soft)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--brand)]">
            {t("lastUpdated")}
          </p>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("agreement.heading")}
            </h2>
            <p>
              {t("agreement.body1")}
            </p>
            <p>
              {t("agreement.body2")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("content.heading")}
            </h2>
            <p>
              {t("content.body1")}
            </p>
            <p>
              {t("content.body2")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("appointments.heading")}
            </h2>
            <p>
              {t("appointments.body")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("intellectualProperty.heading")}
            </h2>
            <p>
              {t("intellectualProperty.body")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("liability.heading")}
            </h2>
            <p>
              {t("liability.body")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("governingLaw.heading")}
            </h2>
            <p>
              {t("governingLaw.body")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("contact.heading")}
            </h2>
            <p>
              {t("contact.body")}
            </p>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}