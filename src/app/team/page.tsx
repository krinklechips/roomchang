import { SiteShell } from "@/components/site/site-shell";
import { DoctorGrid } from "@/components/sections/doctor-grid";
import { getDoctors } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Doctors & Team | Roomchang Dental Hospital",
  description:
    "Meet the specialist dentists and clinical team at Roomchang Dental Hospital — multilingual experts in implants, orthodontics, cosmetic dentistry, and more.",
};

export default async function TeamPage() {
  const doctors = await getDoctors();

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
            Meet the Team
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            Our Doctors
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            Roomchang&apos;s clinical team combines decades of local experience with internationally
            trained specialists. All consultations are available in your language.
          </p>
        </div>
      </div>

      {/* Language filter + grid — client component handles interactivity */}
      <DoctorGrid doctors={doctors} />
    </SiteShell>
  );
}
