import { SiteShell } from "@/components/site/site-shell";
import { ClinicalResultsGrid } from "@/components/sections/clinical-results-grid";
import { getClinicalCases } from "@/lib/data";
import { supabaseServer } from "@/lib/supabase-server";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Clinical Results | Roomchang Dental Hospital",
  description:
    "Real patient results from Roomchang Dental Hospital — before and after cases for implants, orthodontics, full mouth reconstruction, cosmetic dentistry and more.",
};

type DisplayStat = { display_value: string; label: string };

const FALLBACK_STATS: Record<string, DisplayStat> = {
  patients_per_month: { display_value: "4,000+", label: "Patients per month" },
  countries_served: { display_value: "20+", label: "Countries served" },
  clinical_experience: { display_value: "30 yrs", label: "Clinical experience" },
  specialist_dentists: { display_value: "37+", label: "Specialist Dentists" },
  patients_treated: { display_value: "100,000+", label: "Patients Treated" },
};

export default async function ClinicalResultsPage() {
  const { data: statsData, error } = await supabaseServer
    .from("site_stats")
    .select("key, display_value, label")
    .order("sort_order");

  if (error) {
    console.error("[ClinicalResultsPage] site_stats fetch failed:", error.message);
  }

  const stat = (key: string) =>
    statsData?.find((s) => s.key === key) ?? FALLBACK_STATS[key] ?? { display_value: "—", label: key };
  const cases = await getClinicalCases();

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[--border-strong] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
              Real Patients, Real Results
            </p>
            <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
              Clinical Results
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
              A selection of cases from Roomchang&apos;s clinical team — covering implants, orthodontics,
              full mouth reconstructions, and cosmetic transformations. All cases are documented
              with clinical notes, photos, and patient consent.
            </p>
          </div>
          <div className="hidden lg:flex lg:justify-end">
            <div className="grid grid-cols-2 gap-3">
              {[
                stat("patients_treated"),
                stat("countries_served"),
                stat("clinical_experience"),
                stat("specialist_dentists"),
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-[color:var(--border-strong)] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(57,28,45,0.06)]">
                  <p className="font-display text-2xl text-[color:var(--brand-deep)]">{item.display_value}</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats band */}
      <div className="border-b border-[--border-strong] bg-[color:var(--brand)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              stat("patients_per_month"),
              stat("countries_served"),
              stat("clinical_experience"),
              stat("specialist_dentists"),
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-display text-4xl font-bold text-white sm:text-5xl">{item.display_value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <ClinicalResultsGrid cases={cases} />
      </div>
    </SiteShell>
  );
}
