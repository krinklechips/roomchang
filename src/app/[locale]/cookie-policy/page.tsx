import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cookie Policy | Roomchang Dental Hospital",
  description:
    "Review the cookies, anonymous analytics, and browser storage used by the Roomchang Dental Hospital website, including referral and preview cookies.",
};

export default async function CookiePolicyPage() {
  const t = await getTranslations("cookiePolicy");

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
              {t("usage.heading")}
            </h2>
            <p>
              {t("usage.body")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("essential.heading")}
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <span className="font-semibold text-[color:var(--text-main)]">rc_ref:</span>{" "}
                {t("essential.rcRef")}
              </li>
              <li>
                <span className="font-semibold text-[color:var(--text-main)]">rc_preview_session:</span>{" "}
                {t("essential.rcPreviewSession")}
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("analytics.heading")}
            </h2>
            <p>
              {t("analytics.body")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("browserStorage.heading")}
            </h2>
            <p>
              {t("browserStorage.intro")}
              <span className="font-semibold text-[color:var(--text-main)]"> rc-bubble-seen</span>{" "}
              {t("browserStorage.bubbleSeen")}
              <span className="font-semibold text-[color:var(--text-main)]"> rc-chatbot-session</span>{" "}
              {t("browserStorage.chatbotSession")}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)]">
              {t("managing.heading")}
            </h2>
            <p>
              {t("managing.body")}
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