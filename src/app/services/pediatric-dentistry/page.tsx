import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pediatric Dentistry | Roomchang Dental Hospital",
  description:
    "Child-friendly dental care at Roomchang — from infancy through adolescence. Preventive care, fillings, sealants, and early orthodontic assessment in Phnom Penh.",
};

const TREATMENTS = [
  "Fillings for decayed primary and permanent teeth",
  "Fissure sealants on permanent molars",
  "Fluoride applications",
  "Pulp treatment and root canal therapy for children",
  "High-grade crowns for primary teeth",
  "Dental X-rays (paediatric-appropriate dose)",
  "Early orthodontic assessment",
  "Sedation and general anaesthesia options for anxious children",
];

const TIMELINE = [
  { age: "6–8 months", event: "First primary (baby) teeth begin to erupt." },
  { age: "2.5–3 years", event: "All 20 primary teeth are present." },
  { age: "Age 6", event: "First permanent teeth begin erupting; first dental check-up should be well established." },
  { age: "Age 12", event: "All primary teeth replaced by permanent teeth." },
];

export default function PediatricDentistryPage() {
  return (
    <SiteShell>
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">Children&apos;s Dentistry</p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">Pediatric Dentistry</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            Early care of children&apos;s teeth means healthy teeth for life. Studies show that children with healthy
            primary teeth are more likely to have healthy permanent teeth — and regular dental visits from an early
            age prevent pain, infections, and future orthodontic problems.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">Book for Your Child</Link>
            <Link href="/services" className="btn-secondary">All Services</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 space-y-16">

        {/* Why early visits matter */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-[--text-main]">When Should My Child First Visit?</h2>
            <p className="mt-4 text-sm leading-7 text-[--text-soft]">
              Children — just like adults — should be seen by a dentist twice a year. Your Roomchang dentist can
              detect and correct problems early, before they become painful or expensive to treat.
            </p>
            <p className="mt-3 text-sm leading-7 text-[--text-soft]">
              We recommend starting dental visits around the first birthday or when the first tooth appears.
              Daily brushing with a smear of fluoride toothpaste should also begin before the first birthday.
            </p>
            <p className="mt-3 text-sm leading-7 text-[--text-soft]">
              Healthy primary teeth prevent pain and infections, aid in speech development, and hold space for
              permanent teeth — reducing the likelihood of future orthodontic treatment.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-[--text-main] mb-4">Tooth Development Timeline</h2>
            <div className="space-y-3">
              {TIMELINE.map((t) => (
                <div key={t.age} className="flex gap-4 rounded-2xl border border-[--border-strong] bg-white px-5 py-4">
                  <div className="shrink-0 w-20 text-xs font-semibold text-[color:var(--brand)] pt-0.5">{t.age}</div>
                  <p className="text-sm leading-6 text-[--text-soft]">{t.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Treatments */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">Treatments Available</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {TREATMENTS.map((t) => (
              <div key={t} className="flex items-start gap-3 rounded-2xl border border-[--border-strong] bg-white px-5 py-4">
                <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]" />
                <p className="text-sm leading-6 text-[--text-soft]">{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Specialist note */}
        <div className="rounded-3xl bg-[color:var(--brand-soft)] p-8">
          <h2 className="font-display text-2xl text-[color:var(--brand-deep)]">Led by a Regional Expert</h2>
          <p className="mt-4 text-sm leading-7 text-[--text-soft]">
            Our paediatric dentistry department is led by Dr. Yos Chantho, DDS, MSc — who holds a Master&apos;s degree
            in Pediatric Dentistry and serves as President of the Cambodian Association of Pediatric Dentistry.
            Our child-friendly clinic environment is designed to keep children calm, comfortable, and unafraid of
            the dentist from their very first visit.
          </p>
        </div>
      </div>

      <div className="border-t border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl text-[--text-main]">Give your child a healthy smile for life.</h2>
            <p className="mt-2 text-sm text-[--text-soft]">Call <a href="tel:+85523211338" className="font-semibold text-[color:var(--brand)]">+855 23 211 338</a> or send us an enquiry.</p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">Book for Your Child</Link>
        </div>
      </div>
    </SiteShell>
  );
}
