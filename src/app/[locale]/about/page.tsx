import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/site/site-shell";
import { AboutTimeline } from "@/components/sections/about-timeline";
import { Building2, Star, Mail, Stethoscope, Heart, Handshake, ImagePlay, Cpu, Briefcase, ArrowRight, type LucideIcon } from "lucide-react";
import { supabaseServer } from "@/lib/supabase-server";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

/** Section-card definitions — keyed to `about.section.*` translations */
const SECTION_DEFS: { key: string; href: string; icon: LucideIcon }[] = [
  { key: "facilities",      href: "/about/facilities",            icon: Building2 },
  { key: "visionMission",   href: "/about/vision-mission-values", icon: Star },
  { key: "directorMessage", href: "/about/director-message",      icon: Mail },
  { key: "doctors",         href: "/team",                        icon: Stethoscope },
  { key: "community",       href: "/about/community",             icon: Heart },
  { key: "partnerships",    href: "/about/partnerships",          icon: Handshake },
  { key: "clinicalResults", href: "/clinical-results",            icon: ImagePlay },
  { key: "technology",      href: "/technology",                  icon: Cpu },
  { key: "careers",         href: "/about/careers",               icon: Briefcase },
];

/** Stat-key → translation key inside `about.stat.*` */
const STAT_KEYS: Record<string, string> = {
  year_established:   "yearEstablished",
  branches_count:     "branches",
  specialist_dentists: "specialistDentists",
  dental_chairs:      "dentalChairs",
};

const FALLBACK_VALUES: Record<string, string> = {
  year_established:    "1996",
  branches_count:      "5",
  specialist_dentists: "37",
  dental_chairs:       "74",
};

export default async function AboutPage() {
  const t = await getTranslations("about");

  const { data: statsData, error } = await supabaseServer
    .from("site_stats")
    .select("key, display_value, label")
    .order("sort_order");

  if (error) {
    console.error("[AboutPage] site_stats fetch failed:", error.message);
  }

  const STAT_ORDER = ["year_established", "branches_count", "specialist_dentists", "dental_chairs"] as const;

  const stats = STAT_ORDER.map((key) => {
    const row = statsData?.find((s) => s.key === key);
    return {
      display_value: row?.display_value ?? FALLBACK_VALUES[key] ?? "—",
      label: t(`stat.${STAT_KEYS[key]}`),
    };
  });

  return (
    <SiteShell>
      {/* Hero */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
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
              {stats.map((item, i) => (
                <div key={`${item.label}-${i}`} className="rounded-2xl border border-[color:var(--border-strong)] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(57,28,45,0.06)]">
                  <p className="font-display text-2xl text-[color:var(--brand-deep)]">{item.display_value}</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--brand)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-display text-5xl font-bold text-white">{item.display_value}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-14 pb-14 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8">
        {/* History */}
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-4xl text-[color:var(--text-main)]">{t("history.heading")}</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-[color:var(--text-soft)]">
            <p>{t("history.paragraph1")}</p>
            <p>{t("history.paragraph2")}</p>
            <p>{t("history.paragraph3")}</p>
          </div>
        </div>
      </div>

      {/* History — full-bleed timeline */}
      <AboutTimeline />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {/* Discover facilities CTA — sits between the timeline and the section cards */}
        <div className="flex justify-center">
          <Link
            href="/about/facilities"
            className="btn-primary inline-flex items-center gap-2"
          >
            {t("facilitiesCta")} <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>

        {/* Section cards grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SECTION_DEFS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group flex flex-col rounded-3xl border border-[color:var(--border-strong)] bg-white p-7 shadow-[0_12px_40px_rgba(57,28,45,0.05)] transition hover:border-[color:var(--brand-light)] hover:shadow-[0_16px_48px_rgba(204,55,113,0.1)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                <section.icon size={20} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-xl text-[color:var(--text-main)] group-hover:text-[color:var(--brand-deep)]">
                {t(`section.${section.key}.title`)}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[color:var(--text-soft)]">
                {t(`section.${section.key}.description`)}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--brand-deep)] transition group-hover:text-[color:var(--brand)]">
                {t("section.learnMore")} <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
