import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, GraduationCap, Handshake, Users, Lightbulb, Award, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Vision, Mission & Values | Roomchang Dental Hospital",
  description:
    "Roomchang's vision: enriching lives with quality dentistry. Five core values guide everything we do — professionalism, honesty, teamwork, innovation, and excellence.",
};

const VALUES: { id: string; Icon: LucideIcon }[] = [
  { id: "professionalism", Icon: GraduationCap },
  { id: "honesty", Icon: Handshake },
  { id: "teamwork", Icon: Users },
  { id: "innovation", Icon: Lightbulb },
  { id: "excellence", Icon: Award },
];

export default async function VisionMissionValuesPage() {
  const t = await getTranslations("visionMission");

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
            {t("title")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            {t("intro")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
        {/* Vision & Mission */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-[color:var(--border-strong)] bg-white p-10 shadow-[0_12px_40px_rgba(57,28,45,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">{t("vision.label")}</p>
            <p className="mt-4 font-display text-4xl leading-tight text-[color:var(--text-main)]">
              {t("vision.statement")}
            </p>
            <p className="mt-4 text-sm leading-7 text-[color:var(--text-soft)]">
              {t("vision.description")}
            </p>
          </div>
          <div className="rounded-3xl border border-[color:var(--border-strong)] bg-white p-10 shadow-[0_12px_40px_rgba(57,28,45,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">{t("mission.label")}</p>
            <p className="mt-4 font-display text-4xl leading-tight text-[color:var(--text-main)]">
              {t("mission.statement")}
            </p>
            <p className="mt-4 text-sm leading-7 text-[color:var(--text-soft)]">
              {t("mission.description")}
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mt-20">
          <h2 className="font-display text-4xl text-[color:var(--text-main)]">{t("values.heading")}</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--text-soft)]">
            {t("values.intro")}
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map((value) => (
              <div
                key={value.id}
                className="rounded-2xl border border-[color:var(--border-strong)] bg-white p-6 shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                  <value.Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="mt-3 font-display text-2xl text-[color:var(--brand-deep)]">{t(`values.items.${value.id}.title`)}</h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--text-soft)]">{t(`values.items.${value.id}.description`)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-3xl bg-[color:var(--brand-soft)] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[color:var(--text-main)]">{t("cta.heading")}</h2>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
                {t("cta.description")}
              </p>
            </div>
            <Link href="/team" className="btn-primary shrink-0">
              {t("cta.button")}
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}