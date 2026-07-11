import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, ArrowRight, Check, MapPin, Clock, Phone as PhoneIcon } from "lucide-react";
import { supabaseServer } from "@/lib/supabase-server";
import { cdnUrl } from "@/lib/supabase";
import { BRANCHES } from "@/lib/branches";
import { getTranslatedFieldsBatch, mergeTranslation } from "@/lib/i18n-content";
import { getPayloadSiteStats, isPayloadSource } from "@/lib/payload-source";
import { HashScroll } from "@/components/sections/hash-scroll";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "facilities" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

type DisplayStat = { display_value: string; label: string };

const FALLBACK_STAT_VALUES: Record<string, string> = {
  building_storeys: "10",
  dental_chairs: "46",
  surgical_theatres: "4",
  specialist_dentists: "37",
};

const FACILITY_SECTIONS = [
  {
    id: "digital_lab",
    items: ["scanners", "cad_cam", "printers", "aligner"],
  },
  {
    id: "imaging",
    items: ["cbct", "opg", "ceph", "periapical"],
  },
  {
    id: "sterilisation",
    items: ["autoclave", "steam", "all_instruments", "daily_cleaning", "cross_infection"],
  },
  {
    id: "comfort",
    items: ["children", "whitening", "emr", "parking", "wheelchair", "multilingual"],
  },
];

// Images live on R2 (same CDN as the rest of the site) via cdnUrl().
const GALLERY_INTERIOR = [
  { id: "abroad", src: cdnUrl("roomchang/about/facilities/facility-treatment-abroad.jpg") },
  { id: "room_a", src: cdnUrl("roomchang/about/facilities/facility-room-a.jpg") },
  { id: "room_b", src: cdnUrl("roomchang/about/facilities/facility-room-b.jpg") },
  { id: "room_c", src: cdnUrl("roomchang/about/facilities/facility-room-c.jpg") },
];

export default async function FacilitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("facilities");

  // Overlay active-locale branch descriptions (content_translations).
  const branchTr = await getTranslatedFieldsBatch("branch", BRANCHES.map((b) => b.slug));
  const branches = BRANCHES.map((b) => mergeTranslation(b, branchTr.get(b.slug) ?? {}));

  const { data: statsData, error } = isPayloadSource()
    ? { data: await getPayloadSiteStats(), error: null }
    : await supabaseServer
        .from("site_stats")
        .select("key, display_value, label")
        .order("sort_order");

  if (error) {
    console.error("[FacilitiesPage] site_stats fetch failed:", error.message);
  }

  const stat = (key: string): DisplayStat =>
    statsData?.find((s) => s.key === key) ??
    (FALLBACK_STAT_VALUES[key]
      ? { display_value: FALLBACK_STAT_VALUES[key], label: t(`stats.${key}`) }
      : { display_value: "—", label: key });

  return (
    <SiteShell>
      <HashScroll />
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> {t("hero.backLink")}
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            {t("hero.intro")}
          </p>
        </div>
      </div>

      {/* Building stats — fix: use [color:var(--brand)] not [--brand] */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--brand)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              stat("building_storeys"),
              stat("dental_chairs"),
              stat("surgical_theatres"),
              stat("specialist_dentists"),
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-5xl font-bold text-white">{stat.display_value}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Building hero — full-bleed tall portrait */}
      <div className="border-b border-[color:var(--border-strong)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[340px_1fr] lg:items-stretch">
            {/* Tall building portrait */}
            <div className="relative h-[420px] overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(57,28,45,0.12)] sm:h-[480px] lg:h-full">
              <Image
                src={cdnUrl("roomchang/about/facilities/EDJI_0381.jpg")}
                alt={t("buildingHero.imageAlt")}
                width={3000}
                height={1999}
                // Renders in a 340px column on desktop / full width on mobile.
                // Without sizes, next/image preloaded the w=3840 variant
                // (~584KB) for every visitor.
                sizes="(min-width: 1024px) 340px, 100vw"
                className="h-full w-full object-cover object-center"
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(44,26,40,0.7)] to-transparent px-6 pb-6 pt-16">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">{t("buildingHero.eyebrow")}</p>
                <p className="mt-1 font-display text-2xl text-white">{t("buildingHero.title")}</p>
                <p className="mt-0.5 text-xs text-white/60">{t("buildingHero.address")}</p>
              </div>
            </div>

            {/* Interior photo grid — unique facility photos with uniform aspect ratio */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              {GALLERY_INTERIOR.map(({ id, src }) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={src}
                    alt={t(`gallery.${id}.alt`)}
                    fill
                    className="object-cover transition duration-500 hover:scale-[1.04]"
                    sizes="(min-width: 1280px) 220px, (min-width: 1024px) 180px, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {FACILITY_SECTIONS.map((section) => (
            <div
              key={section.id}
              className="rounded-3xl border border-[color:var(--border-strong)] bg-white p-8 shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
            >
              <h2 className="font-display text-2xl text-[color:var(--text-main)]">{t(`sections.${section.id}.title`)}</h2>
              <ul className="mt-5 space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[color:var(--text-soft)]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                      <Check size={11} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {t(`sections.${section.id}.items.${item}`)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Our Locations */}
        <div id="locations" className="mt-16 scroll-mt-24 sm:scroll-mt-32">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
            {t("locations.eyebrow")}
          </p>
          <h2 className="mt-3 font-display text-4xl text-[color:var(--text-main)] sm:text-5xl">
            {t("locations.title")}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--text-soft)]">
            {t("locations.intro")}
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <div
                key={branch.slug}
                className="flex flex-col rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_12px_40px_rgba(57,28,45,0.05)] overflow-hidden"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={branch.imageSrc}
                    alt={branch.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-deep)] backdrop-blur-sm">
                      {branch.badge}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg text-[color:var(--text-main)]">{branch.name}</h3>
                  <p className="mt-2 text-xs leading-5 text-[color:var(--text-soft)]">{branch.description}</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-start gap-2 text-xs text-[color:var(--text-soft)]">
                      <MapPin size={13} strokeWidth={2} className="mt-0.5 shrink-0 text-[color:var(--brand)]" aria-hidden="true" />
                      <span>{branch.address}{branch.addressLine2 ? `, ${branch.addressLine2}` : ""}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[color:var(--text-soft)]">
                      <Clock size={13} strokeWidth={2} className="shrink-0 text-[color:var(--brand)]" aria-hidden="true" />
                      <span>{branch.hours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[color:var(--text-soft)]">
                      <PhoneIcon size={13} strokeWidth={2} className="shrink-0 text-[color:var(--brand)]" aria-hidden="true" />
                      <span>{branch.phone}</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-5">
                    <Link
                      href={`/about/branches/${branch.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--brand-deep)] transition hover:text-[color:var(--brand)]"
                    >
                      {t("locations.discoverCta")} <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality callout */}
        <div className="mt-16 rounded-3xl bg-[color:var(--brand-soft)] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand-deep)]">
                {t("quality.eyebrow")}
              </p>
              <h2 className="mt-2 font-display text-3xl text-[color:var(--text-main)]">
                {t("quality.title")}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-[color:var(--text-soft)]">
                {t("quality.body")}
              </p>
            </div>
            <Link href="/contact#enquiry-form" className="btn-primary shrink-0">
              {t("quality.cta")}
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
