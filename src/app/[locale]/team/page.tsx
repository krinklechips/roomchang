import { SiteShell } from "@/components/site/site-shell";
import { DoctorGrid } from "@/components/sections/doctor-grid";
import { getDoctors } from "@/lib/data";
import { getPayloadSiteStats, isPayloadSource } from "@/lib/payload-source";
import { supabaseServer } from "@/lib/supabase-server";
import { TEAM_STAT_KEYS, teamTrustStats } from "@/lib/team-stats";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

// ISR: re-render at most every 60s so Supabase content edits go live without a deploy.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("team.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doctors = await getDoctors();
  const t = await getTranslations("team");
  const tStat = await getTranslations("team.stat");

  const payload = isPayloadSource();
  const { data: statRows, error: statError } = payload
    ? { data: await getPayloadSiteStats(TEAM_STAT_KEYS), error: null }
    : await supabaseServer.from('site_stats').select('key, display_value, numeric_value, suffix, label').in('key', [...TEAM_STAT_KEYS]);
  if (statError) throw new Error('Team statistics could not be loaded.');
  const HERO_TRUST = teamTrustStats(statRows ?? [], doctors, {
    doctors: tStat('doctors'), languages: tStat('languages'), years: tStat('yearsExp'), branches: tStat('branches'),
  }, payload);

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

      {/* Language filter + grid — client component handles interactivity */}
      <DoctorGrid doctors={doctors} />
    </SiteShell>
  );
}
