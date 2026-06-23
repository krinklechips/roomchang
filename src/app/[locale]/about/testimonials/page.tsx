import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteShell } from "@/components/site/site-shell";
import { getTestimonials } from "@/lib/data";
import { abbreviateName } from "@/lib/format-name";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Patient Testimonials | Roomchang Dental Hospital",
  description:
    "Real patient stories from around the world — hear what our patients say about their experience at Roomchang Dental Hospital in Phnom Penh, Cambodia.",
};

function parseOriginAndTreatment(authorTitle: string | null): { origin: string; treatment: string } {
  if (!authorTitle) return { origin: "", treatment: "" };
  const parts = authorTitle.split("—").map((s) => s.trim());
  return { origin: parts[0] ?? "", treatment: parts[1] ?? "" };
}

function getInitials(name: string): string {
  return name.split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

const VIDEO_TESTIMONIALS = [
  { id: "ryxcCSeH4ZE" },
  { id: "RdWGGl0U_p4" },
  { id: "7ydJxsMTw4k" },
  { id: "bzfVyEb0Qak" },
  { id: "jEnBISKgthw" },
  { id: "GPI31xSd2TU" },
  { id: "c33gA9XwUgA" },
  { id: "TXsRqtNesVs" },
  { id: "VaveFPmQSVA" },
  { id: "917hvs8COHI" },
  { id: "UVptrgYbvfk" },
  { id: "3sWMhXCD5GA" },
  { id: "TT1bcfDV4k8" },
  { id: "4u1t_jnGM9k" },
  { id: "H6oW3rgIkXg" },
];

export default async function TestimonialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("testimonialsPage");
  const testimonials = await getTestimonials();

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
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            {t("hero.description")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8 space-y-10 sm:space-y-20">

        {/* Written testimonials grid */}
        {testimonials.length > 0 && (
          <section>
            <h2 className="font-display text-4xl text-[color:var(--text-main)]">{t("written.title")}</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--text-soft)]">
              {t("written.description")}
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {testimonials.map((t2) => {
                const { origin, treatment } = parseOriginAndTreatment(t2.authorTitle);
                const initials = getInitials(t2.authorName);
                return (
                  <div
                    key={t2.id}
                    className="flex flex-col gap-4 rounded-3xl border border-[color:var(--brand-soft)] bg-white p-8 shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
                  >
                    <blockquote className="flex-1 text-sm leading-7 text-[color:var(--text-main)]">
                      &ldquo;{t2.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3 border-t border-[color:var(--brand-soft)] pt-4">
                      {t2.authorPhotoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={t2.authorPhotoUrl}
                          alt={t2.authorName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-sm font-semibold text-[color:var(--brand-deep)]">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[color:var(--text-main)]">{abbreviateName(t2.authorName)}</p>
                        {origin && <p className="text-xs text-[color:var(--text-soft)]">{origin}</p>}
                        {treatment && (
                          <span className="mt-0.5 inline-block rounded-full bg-[color:var(--brand-soft)] px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-deep)]">
                            {treatment}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Video testimonials */}
        <section>
          <h2 className="font-display text-4xl text-[color:var(--text-main)]">{t("video.title")}</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--text-soft)]">
            {t("video.description")}
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {VIDEO_TESTIMONIALS.map((video) => (
              <div
                key={video.id}
                className="overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_12px_40px_rgba(57,28,45,0.06)]"
              >
                {/* Video embed */}
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                    title={t(`video.items.${video.id}.title`)}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Card content */}
                <div className="flex items-start justify-between gap-4 px-6 py-5">
                  <div className="min-w-0">
                    <p className="font-display text-lg leading-snug text-[color:var(--text-main)]">
                      {t(`video.items.${video.id}.title`)}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-[color:var(--text-soft)]">
                      {t(`video.items.${video.id}.description`)}
                    </p>
                  </div>
                  <span className="mt-0.5 shrink-0 rounded-full bg-[color:var(--brand-soft)] px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-deep)]">
                    {t(`video.items.${video.id}.treatment`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-[color:var(--brand)] p-10 text-white sm:p-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-4xl">{t("cta.title")}</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-white/80">
                {t("cta.description")}
              </p>
            </div>
            <Link
              href="/contact"
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