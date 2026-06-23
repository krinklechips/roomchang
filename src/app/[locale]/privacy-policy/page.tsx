import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Privacy Policy | Roomchang Dental Hospital",
  description:
    "Learn how Roomchang Dental Hospital collects, uses, stores, and protects information submitted through its website forms and appointment enquiries.",
};

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("privacyPolicy");

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> {t("backToHome")}
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
              {t("whoWeAre.heading")}
            </h2>
            <p>
              {t("whoWeAre.intro")}
            </p>
            <p>
              {t("whoWeAre.contact", {
                address: "No. 4, Street 184, Phnom Penh, Cambodia",
                email: "contact@roomchang.com",
                phone1: "+855 69 811 338",
                phone2: "+855 11 811 338",
              })}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("informationWeCollect.heading")}
            </h2>
            <p>
              {t("informationWeCollect.intro")}
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>{t("informationWeCollect.items.contactDetails")}</li>
              <li>{t("informationWeCollect.items.preferences")}</li>
              <li>{t("informationWeCollect.items.message")}</li>
            </ul>
            <p>
              {t("informationWeCollect.referral")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("howWeUse.heading")}
            </h2>
            <p>
              {t("howWeUse.purpose")}
            </p>
            <p>
              {t("howWeUse.storage")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("clinicalRecords.heading")}
            </h2>
            <p>
              {t("clinicalRecords.body")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("yourRights.heading")}
            </h2>
            <p>
              {t("yourRights.body", { email: "contact@roomchang.com" })}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("contact.heading")}
            </h2>
            <p>
              {t("contact.body", {
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
