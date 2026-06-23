import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Disclaimer | Roomchang Dental Hospital",
  description:
    "Understand the medical and informational limits of the Roomchang Dental Hospital website, including dental advice, treatment outcomes, and illustrative cases.",
};

export default async function DisclaimerPage() {
  const t = await getTranslations("disclaimer");

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
            {t("title")}
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
              {t("generalInfo.heading")}
            </h2>
            <p>
              {t("generalInfo.body")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("consultation.heading")}
            </h2>
            <p>
              {t("consultation.body")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("treatmentResults.heading")}
            </h2>
            <p>
              {t("treatmentResults.body1")}
            </p>
            <p>
              {t("treatmentResults.body2")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("websiteAccuracy.heading")}
            </h2>
            <p>
              {t("websiteAccuracy.body")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("contact.heading")}
            </h2>
            <p>
              {t("contact.body", {
                address: "No. 4, Street 184, Phnom Penh, Cambodia",
                email: "contact@roomchang.com",
                phone1: "+855 69 811 338",
                phone2: "+855 11 811 338",
              })}
            </p>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
