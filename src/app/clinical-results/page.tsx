import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinical Results | Roomchang Dental Hospital",
  description:
    "Real patient results from Roomchang Dental Hospital — before and after cases for implants, orthodontics, full mouth reconstruction, cosmetic dentistry and more.",
};

const CATEGORIES = [
  "All",
  "Implants",
  "Orthodontics",
  "Cosmetic",
  "Full Mouth",
  "Crowns & Veneers",
];

const CASES = [
  {
    id: "case-01",
    title: "Full Mouth Reconstruction",
    category: "Full Mouth",
    treatment: "All-on-6 implants + E-Max crowns, upper & lower arches",
    duration: "3 visits over 6 months",
    description:
      "Patient presented with severe bone loss and multiple failing teeth. A full arch restoration using All-on-6 implants with fixed E-Max crowns was completed across both arches.",
    tag: "Full Mouth",
  },
  {
    id: "case-02",
    title: "Single Implant Restoration",
    category: "Implants",
    treatment: "OSSTEM implant + zirconia crown, lower left molar",
    duration: "3 months",
    description:
      "Missing lower molar replaced with a single OSSTEM implant and custom zirconia crown. Patient regained full chewing function without affecting adjacent teeth.",
    tag: "Implants",
  },
  {
    id: "case-03",
    title: "CA® Clear Aligner Correction",
    category: "Orthodontics",
    treatment: "CA® proprietary clear aligner, full arch correction",
    duration: "14 months",
    description:
      "Crowding and spacing issues corrected using Roomchang's in-house CA® aligner system. Designed, fabricated, and monitored entirely at Roomchang.",
    tag: "Orthodontics",
  },
  {
    id: "case-04",
    title: "Smile Makeover with Veneers",
    category: "Cosmetic",
    treatment: "10 × E-Max porcelain veneers (upper arch)",
    duration: "2 visits",
    description:
      "Patient wanted a brighter, more even smile. Ten ultra-thin E-Max veneers were designed using digital smile design and fitted in two appointments.",
    tag: "Cosmetic",
  },
  {
    id: "case-05",
    title: "Invisalign Correction",
    category: "Orthodontics",
    treatment: "Invisalign Full, mild-moderate crowding",
    duration: "12 months",
    description:
      "International patient visiting from Singapore completed full Invisalign treatment at Roomchang with remote progress monitoring between visits.",
    tag: "Orthodontics",
  },
  {
    id: "case-06",
    title: "Crown Lengthening + Veneers",
    category: "Crowns & Veneers",
    treatment: "Crown lengthening surgery + 8 × porcelain veneers",
    duration: "3 months",
    description:
      "A gummy smile was corrected with minor crown lengthening surgery followed by porcelain veneers to achieve a balanced, proportional smile.",
    tag: "Crowns & Veneers",
  },
  {
    id: "case-07",
    title: "Implant Bridge",
    category: "Implants",
    treatment: "2 × implants supporting a 4-unit bridge",
    duration: "4 months",
    description:
      "Multiple missing teeth in the upper arch restored with two implants supporting a fixed 4-unit zirconia bridge. No removable denture required.",
    tag: "Implants",
  },
  {
    id: "case-08",
    title: "Beyond® Whitening + Bonding",
    category: "Cosmetic",
    treatment: "Beyond® in-clinic whitening + 4 × composite bonding",
    duration: "1 visit",
    description:
      "Single-session whitening followed by composite bonding to close minor gaps and chips. A quick cosmetic refresh with immediate results.",
    tag: "Cosmetic",
  },
  {
    id: "case-09",
    title: "E-Max Crown Replacement",
    category: "Crowns & Veneers",
    treatment: "8 × E-Max crowns replacing old PFM crowns",
    duration: "2 visits",
    description:
      "Outdated porcelain-on-metal crowns replaced with all-ceramic E-Max crowns for a more natural, translucent appearance using digital CAD/CAM design.",
    tag: "Crowns & Veneers",
  },
];

const STATS = [
  { value: "10,000+", label: "Patients per month" },
  { value: "20+", label: "Countries served" },
  { value: "28 yrs", label: "Clinical experience" },
  { value: "30+", label: "Specialist dentists" },
];

export default function ClinicalResultsPage() {
  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
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
      </div>

      {/* Stats band */}
      <div className="border-b border-[--border-strong] bg-[color:var(--brand)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-4xl font-bold text-white sm:text-5xl">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 space-y-14">

        {/* Category filter hint */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className={`cursor-default rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                cat === "All"
                  ? "border-[color:var(--brand)] bg-[color:var(--brand)] text-white"
                  : "border-[--border-strong] bg-white text-[color:var(--text-soft)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Cases grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {CASES.map((c) => (
            <article
              key={c.id}
              className="flex flex-col overflow-hidden rounded-[2rem] border border-[--border-strong] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(57,28,45,0.1)]"
            >
              {/* Before/After placeholder */}
              <div className="relative flex min-h-[14rem] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,var(--brand-soft),var(--surface-strong))]">
                <div className="flex w-full">
                  <div className="flex flex-1 flex-col items-center justify-center gap-1 border-r border-white/60 py-8">
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[color:var(--text-soft)]">Before</span>
                    <span className="font-display text-4xl text-[color:var(--border-strong)] select-none">◌</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center gap-1 py-8">
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[color:var(--brand-deep)]">After</span>
                    <span className="font-display text-4xl text-[color:var(--brand)] select-none">◎</span>
                  </div>
                </div>
                <span className="absolute right-3 top-3 rounded-full bg-[color:var(--brand-soft)] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-deep)]">
                  {c.tag}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-6">
                <h2 className="font-display text-xl leading-tight text-[color:var(--text-main)]">{c.title}</h2>
                <p className="text-xs font-semibold text-[color:var(--brand-deep)]">{c.treatment}</p>
                <p className="flex-1 text-sm leading-6 text-[color:var(--text-soft)]">{c.description}</p>
                <div className="flex items-center justify-between border-t border-[--border-strong] pt-3">
                  <span className="text-xs text-[color:var(--text-soft)]">
                    Duration: <span className="font-semibold text-[color:var(--text-main)]">{c.duration}</span>
                  </span>
                  <Link
                    href="/contact"
                    className="text-xs font-semibold text-[color:var(--brand-deep)] transition hover:text-[color:var(--brand)]"
                  >
                    Similar treatment →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-[color:var(--text-soft)]">
          * Patient images and full case photography available upon request in clinic. Cases shown with patient consent.
          Individual results may vary depending on oral health, bone density, and treatment complexity.
        </p>

        {/* CTA */}
        <section className="rounded-[2rem] bg-[color:var(--brand-soft)] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-4xl text-[color:var(--text-main)]">
                Achieve similar results
              </h2>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)] max-w-md">
                Book a consultation and our specialists will assess your case and show you what&apos;s
                possible — with a personalised treatment plan and clear pricing.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary shrink-0">
                Book a Consultation
              </Link>
              <Link href="/pricing" className="btn-secondary shrink-0">
                View Pricing
              </Link>
            </div>
          </div>
        </section>

      </div>
    </SiteShell>
  );
}
