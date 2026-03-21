import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dental Treatment Prices | Roomchang Dental Hospital",
  description:
    "Transparent pricing for dental implants, crowns, orthodontics, veneers, and more at Roomchang Dental Hospital in Phnom Penh, Cambodia.",
};

const PRICE_CATEGORIES = [
  {
    id: "implants",
    title: "Dental Implants",
    icon: "🦷",
    items: [
      { name: "Single Implant (OSSTEM)", price: "From $900" },
      { name: "Single Implant + Crown", price: "From $1,200" },
      { name: "Implant Bridge (3-unit)", price: "From $2,800" },
      { name: "All-on-4 (per arch)", price: "From $6,500" },
      { name: "All-on-6 (per arch)", price: "From $8,500" },
      { name: "Bone Graft (minor)", price: "From $300" },
      { name: "Sinus Lift", price: "From $600" },
    ],
  },
  {
    id: "crowns",
    title: "Crowns & Bridges",
    icon: "✦",
    items: [
      { name: "E-Max Crown", price: "From $280" },
      { name: "Zirconia Crown", price: "From $320" },
      { name: "PFM Crown (Porcelain on Metal)", price: "From $180" },
      { name: "3-Unit Bridge (E-Max)", price: "From $780" },
      { name: "3-Unit Bridge (Zirconia)", price: "From $900" },
    ],
  },
  {
    id: "orthodontics",
    title: "Orthodontics",
    icon: "◎",
    items: [
      { name: "CA® Clear Aligner (Full)", price: "From $1,800" },
      { name: "Invisalign (Full)", price: "From $2,500" },
      { name: "Metal Braces", price: "From $800" },
      { name: "Ceramic Braces", price: "From $1,100" },
      { name: "Retainer (per arch)", price: "From $80" },
    ],
  },
  {
    id: "cosmetic",
    title: "Cosmetic Dentistry",
    icon: "✶",
    items: [
      { name: "Porcelain Veneer (per tooth)", price: "From $280" },
      { name: "Composite Veneer (per tooth)", price: "From $90" },
      { name: "Beyond® Teeth Whitening (in-clinic)", price: "From $180" },
      { name: "Take-Home Whitening Kit", price: "From $80" },
      { name: "Smile Design Consultation", price: "Complimentary" },
    ],
  },
  {
    id: "surgery",
    title: "Oral Surgery",
    icon: "⚕",
    items: [
      { name: "Simple Extraction", price: "From $30" },
      { name: "Surgical Extraction (wisdom tooth)", price: "From $100" },
      { name: "Frenectomy", price: "From $80" },
      { name: "Apicectomy", price: "From $150" },
    ],
  },
  {
    id: "general",
    title: "General Dentistry",
    icon: "◉",
    items: [
      { name: "Consultation / Check-up", price: "From $15" },
      { name: "X-ray (Periapical)", price: "From $10" },
      { name: "Panoramic X-ray (OPG)", price: "From $30" },
      { name: "CBCT (3D Scan)", price: "From $80" },
      { name: "Scale & Polish (Clean)", price: "From $30" },
      { name: "Composite Filling", price: "From $40" },
      { name: "Root Canal Treatment", price: "From $150" },
    ],
  },
];

const COMPARISONS = [
  { treatment: "Single Implant + Crown", roomchang: "$1,200", australia: "$4,500–$6,000", uk: "$3,500–$5,000" },
  { treatment: "All-on-4 (per arch)", roomchang: "$6,500", australia: "$18,000–$25,000", uk: "$14,000–$20,000" },
  { treatment: "E-Max Crown", roomchang: "$280", australia: "$1,500–$2,200", uk: "$900–$1,400" },
  { treatment: "Porcelain Veneer", roomchang: "$280", australia: "$1,500–$2,500", uk: "$800–$1,500" },
  { treatment: "Invisalign Full", roomchang: "$2,500", australia: "$6,000–$9,000", uk: "$4,500–$7,000" },
  { treatment: "Teeth Whitening", roomchang: "$180", australia: "$600–$1,200", uk: "$500–$900" },
];

export default function PricingPage() {
  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
            Transparent Pricing
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            Treatment Prices
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            We believe in clear, upfront pricing — no hidden fees. All prices below are indicative
            starting points. Your exact quote will be confirmed after a consultation and X-rays.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">
              Get a Personalised Quote
            </Link>
            <Link href="/international" className="btn-secondary">
              International Patients
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 space-y-20">

        {/* Price tables */}
        <section>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {PRICE_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="overflow-hidden rounded-[2rem] border border-[--border-strong] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)]"
              >
                <div className="flex items-center gap-3 border-b border-[--border-strong] px-6 py-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--surface-strong)] text-lg text-[color:var(--brand-deep)]" aria-hidden="true">
                    {cat.icon}
                  </span>
                  <h2 className="font-display text-xl leading-tight text-[color:var(--text-main)]">
                    {cat.title}
                  </h2>
                </div>
                <ul className="divide-y divide-[--border-strong]">
                  {cat.items.map((item) => (
                    <li key={item.name} className="flex items-center justify-between px-6 py-3.5">
                      <span className="text-sm text-[color:var(--text-soft)]">{item.name}</span>
                      <span className="ml-3 shrink-0 text-sm font-bold text-[color:var(--brand-deep)]">
                        {item.price}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-[color:var(--text-soft)]">
            * All prices in USD. Final pricing confirmed after clinical assessment. Prices valid as of 2025 and subject to change.
          </p>
        </section>

        {/* International comparison */}
        <section>
          <h2 className="font-display text-4xl text-[color:var(--text-main)]">Price Comparison</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--text-soft)]">
            See how Roomchang&apos;s prices compare to equivalent treatments in Australia and the UK —
            without compromising on quality or safety.
          </p>

          <div className="mt-10 overflow-hidden rounded-[2rem] border border-[--border-strong] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-[--border-strong] bg-[--surface]">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                      Treatment
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-deep)]">
                      Roomchang
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                      Australia
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                      UK
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--border-strong]">
                  {COMPARISONS.map((row) => (
                    <tr key={row.treatment} className="transition hover:bg-[--surface]">
                      <td className="px-6 py-4 font-medium text-[color:var(--text-main)]">{row.treatment}</td>
                      <td className="px-6 py-4 text-right font-bold text-[color:var(--brand-deep)]">{row.roomchang}</td>
                      <td className="px-6 py-4 text-right text-[color:var(--text-soft)]">{row.australia}</td>
                      <td className="px-6 py-4 text-right text-[color:var(--text-soft)]">{row.uk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[--border-strong] bg-[--brand-soft] px-6 py-4">
              <p className="text-xs text-[color:var(--text-soft)]">
                * Overseas prices are indicative ranges from public data (2024–2025). Contact us for a personalised comparison.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-[2rem] bg-[color:var(--brand)] p-10 sm:p-14 text-white">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-4xl">Get your exact quote</h2>
              <p className="mt-2 text-sm leading-7 text-white/80 max-w-md">
                Send us your X-rays or photos and we&apos;ll provide a detailed treatment plan
                with exact pricing within two business days — at no charge.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-full border border-white/30 bg-white px-7 py-4 text-sm font-bold text-[color:var(--brand)] transition hover:bg-white/90"
            >
              Request a Free Quote
            </Link>
          </div>
        </section>

      </div>
    </SiteShell>
  );
}
