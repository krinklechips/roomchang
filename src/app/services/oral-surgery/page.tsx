import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oral Surgery | Roomchang Dental Hospital",
  description:
    "Specialist oral surgery at Roomchang — extractions, wisdom teeth, bone grafting, sinus lifts, and more. Internationally trained surgeons in Phnom Penh.",
};

const PROCEDURES = [
  "Dental extractions (routine and surgical)",
  "Surgical removal of impacted teeth",
  "Wisdom tooth removal",
  "Incision and drainage of dental abscesses",
  "Soft tissue laser surgery — surgical treatment without incisions",
  "Implant placement surgery",
  "Bone and soft tissue grafting",
  "Sinus lifts for implant purposes",
  "Pre-prosthetic surgery",
  "Periodontal surgery",
];

export default function OralSurgeryPage() {
  return (
    <SiteShell>
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">Surgery</p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">Oral Surgery</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            Roomchang&apos;s oral surgeons are internationally trained specialists with extensive experience across the
            full range of oral surgical procedures. Our senior surgeons also lead seminars locally and overseas —
            bringing the very latest techniques to Phnom Penh.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">Book a Consultation</Link>
            <Link href="/services" className="btn-secondary">All Services</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 space-y-16">

        {/* Facilities callout */}
        <div className="rounded-3xl bg-[color:var(--brand-soft)] p-8">
          <h2 className="font-display text-2xl text-[color:var(--brand-deep)]">World-Class Surgical Facilities</h2>
          <p className="mt-4 text-sm leading-7 text-[--text-soft]">
            Our operating theatres are equipped with the best available equipment to ensure that every procedure
            is completed safely and successfully in a fully sterile environment. Sterilisation is performed at
            134°C via autoclave — certified to ISO 9001:2015 standards by Bureau Veritas.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { stat: "6", label: "Surgical theatres" },
              { stat: "58", label: "Dental chairs" },
              { stat: "3,400 m²", label: "Facility size" },
              { stat: "ISO", label: "9001:2015 Certified" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white p-4 text-center">
                <p className="font-display text-2xl text-[color:var(--brand-deep)]">{s.stat}</p>
                <p className="mt-1 text-xs text-[--text-soft]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Procedures */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">Procedures We Offer</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {PROCEDURES.map((p) => (
              <div key={p} className="flex items-start gap-3 rounded-2xl border border-[--border-strong] bg-white px-5 py-4">
                <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]" />
                <p className="text-sm leading-6 text-[--text-soft]">{p}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cost note */}
        <div className="rounded-3xl border border-[--border-strong] bg-white p-8">
          <h2 className="font-display text-2xl text-[--text-main]">Significant Cost Savings</h2>
          <p className="mt-4 text-sm leading-7 text-[--text-soft]">
            Many of our surgical procedures may be performed at a fraction of the cost of comparable care
            available in Australia, the United States, or Europe — without any compromise on quality,
            sterilisation standards, or surgical skill. Patients save up to 70% on procedures compared to
            Western prices.
          </p>
          <Link href="/international" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-deep)] hover:text-[color:var(--brand)] transition-colors">
            See international cost comparisons →
          </Link>
        </div>
      </div>

      <div className="border-t border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl text-[--text-main]">Speak to a specialist today.</h2>
            <p className="mt-2 text-sm text-[--text-soft]">24/7 mobile: <a href="tel:+85511811338" className="font-semibold text-[color:var(--brand)]">+855 11 811 338</a></p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">Book a Consultation</Link>
        </div>
      </div>
    </SiteShell>
  );
}
