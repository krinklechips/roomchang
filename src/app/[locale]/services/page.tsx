import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { SiteShell } from "@/components/site/site-shell";
import { getServices } from "@/lib/data";
import { cdnUrl } from "@/lib/supabase";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  ShieldCheck,
  Tooth,
  Crown,
  Sparkle,
  ArrowsClockwise,
  Scissors,
  SmileyWink,
  Moon,
  Lightning,
  ArrowRight,
  Target,
  FirstAidKit,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react/dist/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("services");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

// Hero trust stats — labels are resolved from translations inside the component
const HERO_TRUST_KEYS = [
  { value: "11", key: "specialties" },
  { value: "37", key: "specialists" },
  { value: "5",  key: "locations" },
] as const;

// Maps service slug → Phosphor icon component (duotone)
const SERVICE_ICONS: Record<string, PhosphorIcon> = {
  "preventive-dentistry":     ShieldCheck,
  "dental-implants":          Target,
  "dental-crowns":            Crown,
  "orthodontics":             FirstAidKit,
  "cosmetic-dentistry":       Sparkle,
  "full-mouth-reconstruction":ArrowsClockwise,
  "oral-surgery":             Scissors,
  "pediatric-dentistry":      SmileyWink,
  "sleep-apnea":              Moon,
  "teeth-whitening":          Lightning,
  "endodontics":              Tooth,
  "dentures":                 SmileyWink,
};

const SERVICE_IMAGES: Record<string, { src: string; altKey: string }> = {
  "preventive-dentistry": { src: "/services/Preventive Dentistry.jpg", altKey: "preventive" },
  "dental-implants":      { src: "/services/Implants.jpg",            altKey: "implants" },
  "dental-crowns":        { src: "/services/Dental Crowns.jpg",       altKey: "crowns" },
  "orthodontics":         { src: "/services/Orthodontics 2.jpg",      altKey: "orthodontics" },
  "cosmetic-dentistry":   { src: "/services/Cosmetic Dentistry.jpg",  altKey: "cosmetic" },
  "oral-surgery":         { src: "/services/Oral Surgery.jpg",        altKey: "oralSurgery" },
  "pediatric-dentistry":  { src: "/services/Pediatric Dentistry.jpg", altKey: "pediatric" },
  "sleep-apnea":          { src: "/services/Sleep Apnea.jpg",         altKey: "sleepApnea" },
  "teeth-whitening":      { src: "/services/Whitening 1.jpg",         altKey: "whitening" },
  "endodontics":          { src: "/services/Endodontics.JPG",         altKey: "endodontics" },
};

function resolveServiceImage(src: string | null | undefined): string | null {
  if (!src) return null;
  if (src.startsWith("/") || src.startsWith("http")) return src;
  return cdnUrl(src);
}

// Sub-services shown as links inside their parent card rather than as top-level cards
const HIDDEN_FROM_GRID = new Set(["all-on-4", "implant-bridges"]);

const SUB_SERVICES: Record<string, { key: string; href: string }[]> = {
  // All-on-4 retired — its content now lives on the Dentures page.
  "dental-implants": [
    { key: "implantBridges", href: "/services/implant-bridges" },
  ],
};

export default async function ServicesPage() {
  const [services, t] = await Promise.all([
    getServices(),
    getTranslations("services"),
  ]);
  return (
    <SiteShell>
      {/* Page header */}
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
              {HERO_TRUST_KEYS.map((item) => (
                <div key={item.key} className="rounded-2xl border border-[color:var(--border-strong)] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(57,28,45,0.06)]">
                  <p className="font-display text-2xl text-[color:var(--brand-deep)]">{item.value}</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">{t(`stat.${item.key}`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.filter((s) => !HIDDEN_FROM_GRID.has(s.slug)).map((service) => {
            const Icon = SERVICE_ICONS[service.slug] ?? Tooth;
            const serviceImage = SERVICE_IMAGES[service.slug];
            const imageSrc = resolveServiceImage(service.imageSrc ?? serviceImage?.src);
            const imageAlt = serviceImage?.altKey
              ? t(`alt.${serviceImage.altKey}`)
              : t("alt.generic", { name: service.name });
            const subServices = SUB_SERVICES[service.slug] ?? [];
            return (
              <article
                key={service.id}
                id={service.slug}
                className="group flex scroll-mt-24 flex-col overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(57,28,45,0.1)] sm:scroll-mt-32"
              >
                {imageSrc && (
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex items-center gap-4 border-b border-[color:var(--border-strong)] px-6 py-5">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--surface-strong)] text-[color:var(--brand-deep)]"
                    aria-hidden="true"
                  >
                    <Icon size={22} weight="duotone" />
                  </span>
                  <h2 className="font-display text-[1.5rem] leading-tight text-[color:var(--text-main)]">
                    {service.name}
                  </h2>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <p className="flex-1 text-sm leading-7 text-[color:var(--text-soft)]">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(service.features ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-[0.7rem] font-semibold text-[color:var(--brand-deep)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {subServices.length > 0 && (
                    <div className="flex flex-wrap gap-2 border-t border-[color:var(--border-strong)] pt-3">
                      {subServices.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="rounded-full border border-[color:var(--border-strong)] px-3 py-1 text-[0.7rem] font-semibold text-[color:var(--brand-deep)] transition hover:border-[color:var(--brand)] hover:bg-[color:var(--brand-soft)]"
                        >
                          {t(`sub.${sub.key}`)}
                        </Link>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-deep)] transition hover:text-[color:var(--brand)]"
                  >
                    {t("card.learnMore")}
                    <ArrowRight size={14} weight="bold" aria-hidden="true" className="transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* CTA band */}
      <div className="border-t border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
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
      </div>
    </SiteShell>
  );
}
