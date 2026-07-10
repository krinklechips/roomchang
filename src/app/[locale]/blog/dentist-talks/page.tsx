import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dentistTalks" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

const YOUTUBE_PLAYLIST_ID = "PL2Dq5LzBKy4wi9hCaXPEoFhY1xY-LoN46";

export const DENTIST_TALKS = [
  { id: "Sj212poMjQQ" },
  { id: "zajv8AuutfE" },
  { id: "cilwCM3Iguc" },
  { id: "H-57t06LuqE" },
  { id: "xQrmC7xfpis" },
  { id: "p7Elqx5UUo4" },
  { id: "aseJoChyLM8" },
  { id: "X8GvbpfjMAU" },
  { id: "vTLQyPsjEvo" },
  { id: "8I06e8cQzAo" },
  { id: "TjCpgw7GDYQ" },
  { id: "WsaRFqhtULQ" },
  { id: "3IeYTNI9hR8" },
  { id: "7GFKeh5GlSA" },
  { id: "FDTUTfFDESI" },
  { id: "ZpQZqMHN4us" },
  { id: "sUghKx1CrnA" },
  { id: "0dxBq4qkGDY" },
  { id: "cWWiy-CxvJI" },
  { id: "lOlr2xdYjlM" },
  { id: "GKftQhBRz4U" },
  { id: "vesEO_2BoOI" },
  { id: "LnhaRxo0JRs" },
  { id: "98xjrKSG2Tg" },
];

export default async function DentistTalksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("dentistTalks");

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
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            {t("hero.intro")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8 space-y-10 sm:space-y-20">
        {/* Intro */}
        <section>
          <h2 className="font-display text-3xl text-[color:var(--text-main)]">
            {t("intro.heading")}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--text-soft)]">
            {t("intro.paragraph1")}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-soft)]">
            {t("intro.paragraph2")}
          </p>
        </section>

        {/* Why These Talks Matter */}
        <section className="rounded-3xl bg-[color:var(--brand-soft)] px-8 py-8 sm:px-10 sm:py-10">
          <h3 className="font-display text-2xl text-[color:var(--brand-deep)]">
            {t("whyMatter.heading")}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-soft)]">
            {t("whyMatter.paragraph")}
          </p>
        </section>

        {/* Video grid */}
        <section>
          <h2 className="font-display text-3xl text-[color:var(--text-main)]">
            {t("videos.heading")}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--text-soft)]">
            {t("videos.intro")}
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {DENTIST_TALKS.map((video) => (
              <div
                key={video.id}
                className="overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_12px_40px_rgba(57,28,45,0.06)]"
              >
                {/* Video embed */}
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}?list=${YOUTUBE_PLAYLIST_ID}&rel=0`}
                    title={t(`items.${video.id}.title`)}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Card content */}
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-display text-lg leading-snug text-[color:var(--text-main)]">
                        {t(`items.${video.id}.title`)}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[color:var(--brand)]">
                        {t("videos.cardSource")}
                      </p>
                    </div>
                    <span className="mt-0.5 shrink-0 rounded-full bg-[color:var(--brand-soft)] px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-deep)]">
                      {t(`items.${video.id}.topic`)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--text-soft)]">
                    {t("videos.cardDescription")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Playlist link */}
          <div className="mt-10 text-center">
            <a
              href="https://www.youtube.com/playlist?list=PL2Dq5LzBKy4wi9hCaXPEoFhY1xY-LoN46"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              {t("videos.playlistLink")}
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814Z" />
                <path d="m9.545 15.568 6.272-3.568-6.272-3.568v7.136Z" fill="white" />
              </svg>
            </a>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-[color:var(--brand)] p-10 text-white sm:p-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-4xl">{t("cta.heading")}</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-white/80">
                {t("cta.body")}
              </p>
            </div>
            <Link
              href="/contact#enquiry-form"
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
