import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowRight } from "lucide-react";
import { CLINICAL_CASES } from "@/lib/clinical-cases";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clinical Results | Roomchang Dental Hospital",
  description:
    "Real patient results from Roomchang Dental Hospital — before and after cases for implants, orthodontics, full mouth reconstruction, cosmetic dentistry and more.",
};

const STATS = [
  { value: "10,000+", label: "Patients per month" },
  { value: "20+",     label: "Countries served" },
  { value: "30 yrs",  label: "Clinical experience" },
  { value: "30+",     label: "Specialist dentists" },
];

export default function ClinicalResultsPage() {
  const cases = CLINICAL_CASES;

  // Derive unique categories
  const categories = ["All", ...Array.from(new Set(cases.map((c) => c.category)))];

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
          {categories.map((cat, i) => (
            <span
              key={cat}
              className={`cursor-default rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                i === 0
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
          {cases.map((c) => (
            <Link
              key={c.slug}
              href={`/clinical-results/${c.slug}`}
              className="group flex flex-col overflow-hidden rounded-[2rem] border border-[--border-strong] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(57,28,45,0.1)]"
            >
              {/* Before/After card image — natural height, no cropping */}
              <div className="relative overflow-hidden bg-[linear-gradient(135deg,var(--brand-soft),var(--surface-strong))]">
                <Image
                  src={c.cardImage}
                  alt={`Before and after — ${c.title}`}
                  width={800}
                  height={600}
                  className="w-full h-auto transition duration-500 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <span className="absolute right-3 top-3 rounded-full bg-[color:var(--brand-soft)] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-deep)]">
                  {c.tag}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-6">
                <h2 className="font-display text-xl leading-tight text-[color:var(--text-main)] group-hover:text-[color:var(--brand-deep)] transition">{c.title}</h2>
                <p className="text-xs font-semibold text-[color:var(--brand-deep)]">{c.treatment}</p>
                <p className="flex-1 text-sm leading-6 text-[color:var(--text-soft)]">{c.description}</p>
                <div className="flex items-center justify-between border-t border-[--border-strong] pt-3">
                  <span className="text-xs text-[color:var(--text-soft)]">
                    Duration: <span className="font-semibold text-[color:var(--text-main)]">{c.duration}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--brand-deep)] transition group-hover:text-[color:var(--brand)]">
                    View case <ArrowRight size={12} strokeWidth={2} aria-hidden="true" />
                  </span>
                </div>
              </div>
            </Link>
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
