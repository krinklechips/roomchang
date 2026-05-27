import { Suspense } from "react";
import { SiteShell } from "@/components/site/site-shell";
import { getBranches } from "@/lib/data";
import { ContactForm } from "./contact-form";
import { Phone, Smartphone, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage() {
  const [branches, t] = await Promise.all([
    getBranches(),
    getTranslations("contact"),
  ]);

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
            {t("hero.eyebrow")}
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            {t("hero.heading")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[color:var(--text-soft)]">
            {t("hero.body")}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <a
              href="tel:+85569811338"
              className="inline-flex items-center gap-2 font-semibold text-[color:var(--brand-deep)] hover:text-[color:var(--brand)]"
            >
              <Phone size={15} strokeWidth={2} aria-hidden="true" /> +855 69 811 338
            </a>
            <a
              href="tel:+85511811338"
              className="inline-flex items-center gap-2 font-semibold text-[color:var(--brand-deep)] hover:text-[color:var(--brand)]"
            >
              <Smartphone size={15} strokeWidth={2} aria-hidden="true" /> +855 11 811 338 {t("hero.twentyFourSeven")}
            </a>
            <a
              href="mailto:contact@roomchang.com"
              className="inline-flex items-center gap-2 font-semibold text-[color:var(--brand-deep)] hover:text-[color:var(--brand)]"
            >
              <Mail size={15} strokeWidth={2} aria-hidden="true" /> contact@roomchang.com
            </a>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 animate-pulse h-96" />}>
        <ContactForm branches={branches} />
      </Suspense>
    </SiteShell>
  );
}
