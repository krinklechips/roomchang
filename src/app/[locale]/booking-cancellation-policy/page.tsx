import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Booking & Cancellation Policy | Roomchang Dental Hospital",
  description:
    "Learn how appointment requests, confirmations, rescheduling, and cancellations work at Roomchang Dental Hospital in Phnom Penh.",
};

export default async function BookingCancellationPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale: "en", namespace: "bookingPolicy" });

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
              {t("appointmentRequests.heading")}
            </h2>
            <p>
              {t("appointmentRequests.body1")}
            </p>
            <p>
              {t("appointmentRequests.body2")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("informationNeeded.heading")}
            </h2>
            <p>
              {t("informationNeeded.body")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("rescheduling.heading")}
            </h2>
            <p>
              {t("rescheduling.body")}
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>{t("rescheduling.contactEmail")}</li>
              <li>{t("rescheduling.contactPhone1")}</li>
              <li>{t("rescheduling.contactPhone2")}</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("clinicHours.heading")}
            </h2>
            <p>
              {t("clinicHours.body")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("location.heading")}
            </h2>
            <p>
              {t("location.body")}
            </p>
          </section>
        </div>
      </div>
    </SiteShell>
  );
}
