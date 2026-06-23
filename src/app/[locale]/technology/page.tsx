import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { SiteShell } from "@/components/site/site-shell";
import { CheckCircle, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { getTechnology } from "@/lib/data";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("technology.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  "Orthodontics":      "bg-[color:var(--brand)]",
  "Lab & Restoration": "bg-[color:var(--brand-deep)]",
  "Cosmetic":          "bg-[linear-gradient(135deg,var(--brand),var(--brand-deep))]",
  "Infection Control": "bg-[color:var(--brand-deep)]",
  "Diagnostics":       "bg-[color:var(--brand)]",
};

export default async function TechnologyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const technologies = await getTechnology();
  const t = await getTranslations("technology");

  const HERO_TRUST = [
    { value: "CAD/CAM", label: t("stat.inhouseLab") },
    { value: "3D",      label: t("stat.cbctImaging") },
    { value: "In-House", label: t("stat.clearAligners") },
  ];

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
              {t("hero.eyebrow")}
            </p>
            <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
              {t("hero.heading")}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
              {t("hero.body")}
            </p>
          </div>
          <div className="hidden lg:flex lg:justify-end">
            <div className="grid grid-cols-2 gap-3">
              {HERO_TRUST.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[color:var(--border-strong)] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(57,28,45,0.06)]">
                  <p className="font-display text-2xl text-[color:var(--brand-deep)]">{item.value}</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Technology list */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
        <div className="space-y-10">
          {technologies.map((tech, i) => (
            <article
              key={tech.id}
              className={`grid gap-0 overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)] lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>:first-child]:order-2" : ""
              }`}
            >
              {/* Image or gradient placeholder */}
              {tech.imageSrc ? (
                <div className="flex items-center justify-center overflow-hidden bg-[color:var(--surface)] p-6 lg:p-8">
                  <Image
                    src={tech.imageSrc}
                    alt={tech.name}
                    width={700}
                    height={500}
                    className="w-full h-auto max-h-[22rem] rounded-xl object-contain"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
              ) : (
                <div className={`min-h-[18rem] lg:min-h-[24rem] flex items-center justify-center ${CATEGORY_COLORS[tech.category] ?? "bg-[color:var(--surface-strong)]"}`}>
                  <span className="font-display text-[4rem] font-bold text-white/30 select-none">
                    {tech.name.charAt(0)}
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col justify-center gap-5 p-8 sm:p-10">
                <div>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-white ${CATEGORY_COLORS[tech.category] ?? "bg-[color:var(--brand)]"}`}
                  >
                    {tech.category}
                  </span>
                </div>
                <h2 className="font-display text-3xl leading-tight text-[color:var(--text-main)] sm:text-4xl">
                  {tech.name}
                </h2>
                <p className="text-sm leading-7 text-[color:var(--text-soft)]">{tech.description}</p>
                <ul className="space-y-2">
                  {tech.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2.5 text-sm text-[color:var(--text-main)]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                        <CheckCircle size={14} weight="duotone" aria-hidden="true" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
                {tech.slug ? (
                  <Link
                    href={`/technology/${tech.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-deep)] transition hover:text-[color:var(--brand)]"
                  >
                    {t("card.learnMore")} <ArrowRight size={14} weight="bold" aria-hidden="true" />
                  </Link>
                ) : (
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-deep)] transition hover:text-[color:var(--brand)]"
                  >
                    {t("card.askAbout")} <ArrowRight size={14} weight="bold" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-start gap-6 rounded-3xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] p-10 sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div>
            <h2 className="font-display text-3xl text-[color:var(--text-main)]">{t("cta.heading")}</h2>
            <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
              {t("cta.body")}
            </p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">
            {t("cta.button")}
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
