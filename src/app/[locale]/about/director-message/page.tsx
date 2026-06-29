import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
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
  const t = await getTranslations({ locale, namespace: "directorMessage" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function DirectorMessagePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("directorMessage");

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> {t("backLink")}
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            {t("heading")}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
        <div className="lg:grid lg:grid-cols-[360px_1fr] lg:gap-16 xl:gap-20">

          {/* Director portrait — sticky on desktop */}
          <div className="mb-12 lg:mb-0">
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-3xl shadow-[0_24px_64px_rgba(57,28,45,0.12)] mx-auto lg:mx-0">
                <Image
                  src="/doctors/dr-tith-hong-yoeu.jpg"
                  alt={t("portrait.alt")}
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 320px, 90vw"
                  priority
                />
              </div>
              <div className="mt-6 text-center lg:text-left">
                <h2 className="font-display text-2xl text-[color:var(--text-main)]">{t("portrait.name")}</h2>
                <p className="mt-0.5 text-sm font-semibold text-[color:var(--text-soft)]">{t("portrait.credentials")}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand)]">
                  {t("portrait.role")}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[color:var(--text-soft)]">
                  {t("portrait.degree")}<br />{t("portrait.institution")}
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
          <div className="space-y-6 text-base leading-8 text-[color:var(--text-soft)]">
            <p>{t("letter.salutation")}</p>
            <p>
              {t("letter.paragraph1")}
            </p>
            <p>
              {t("letter.paragraph2")}
            </p>
            <p>
              {t("letter.paragraph3")}
            </p>
            <p>
              {t("letter.paragraph4")}
            </p>
            <p>
              {t("letter.paragraph5")}
            </p>
            <p className="font-display text-xl text-[color:var(--text-main)]">
              {t("letter.signatureName")}
            </p>
            <p className="text-sm text-[color:var(--text-soft)]">
              {t("letter.signatureTitle")}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-14 rounded-3xl bg-[color:var(--brand-soft)] p-8 text-center">
            <h3 className="font-display text-2xl text-[color:var(--text-main)]">
              {t("cta.title")}
            </h3>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              {t("cta.description")}
            </p>
            <Link href="/team" className="btn-primary mt-5 inline-flex">
              {t("cta.button")}
            </Link>
          </div>
          </div>{/* end message col */}
        </div>{/* end grid */}
      </div>
    </SiteShell>
  );
}
