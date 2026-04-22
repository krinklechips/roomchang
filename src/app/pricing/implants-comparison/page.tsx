import Link from "next/link";
import type { Metadata } from "next";
import { Package, FlaskConical, Building2 } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";

export const metadata: Metadata = {
  title: "Dental Implants Price Comparison | Roomchang Dental Hospital",
  description:
    "Why Roomchang's dental implants cost a fraction of Australian prices without compromising material quality — a breakdown of implant costs and the Myplant Two® system.",
};

const COST_DRIVERS = [
  {
    icon: Package,
    title: "Implant materials",
    body:
      "Every dental implant has three parts — the titanium implant, an abutment, and a crown (E-max, ceramic fused to metal, or zirconium). Roomchang uses Myplant Two® from Germany, internationally recognised as one of the most reliable and stable implant systems on the market. Material cost is the same whether the implant is placed in Phnom Penh or Perth.",
  },
  {
    icon: FlaskConical,
    title: "Laboratory fees",
    body:
      "Roomchang operates an in-house CAD/CAM dental laboratory. Crowns, bridges, and custom abutments are designed and milled on-site — we don't pay a third-party lab markup the way Australian clinics do. That single line item accounts for a large share of the price difference on anything involving a crown or bridge.",
  },
  {
    icon: Building2,
    title: "Dentist fees & overheads",
    body:
      "The 2022 Australian Dental Association survey put private-practice chair time at AUD $400–$700 per hour. Cost of living and commercial rent in Cambodia are dramatically lower, so our overheads are lower. Our specialists are internationally trained — many of them in Japan, Korea, and Australia — but their practice costs don't compare.",
  },
];

const IMPLANT_PRICES = [
  { ada: "688", treatment: "Single dental implant (Myplant Two®)",             roomchang: "$1,200",    australia: "AUD $2,277" },
  { ada: "672", treatment: "Full ceramic crown on implant",                    roomchang: "$550–600",  australia: "AUD $1,734" },
  { ada: "",    treatment: "Implant + custom abutment + E-Max crown",          roomchang: "$2,400",    australia: "AUD $4,200+" },
  { ada: "",    treatment: "3-crown bridge on 2 implants (E-Max)",             roomchang: "$5,000–5,400", australia: "AUD $9,500+" },
];

export default function ImplantsComparisonPage() {
  return (
    <SiteShell>
      {/* Hero */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
            Why Our Implants Cost Less
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            Dental Implants Price Comparison
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            Patients often ask how Roomchang can offer dental implants at roughly half the Australian
            price. The short answer: same materials, lower overheads. Here&apos;s the honest breakdown.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">Request an Implant Quote</Link>
            <Link href="/services/dental-implants" className="btn-secondary">About Our Implants</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 space-y-16">

        {/* Cost drivers */}
        <section>
          <h2 className="font-display text-3xl text-[color:var(--text-main)]">
            Three things drive the price of a dental implant
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-soft)]">
            Material quality, lab work, and clinical overheads. Only two of those three vary by country —
            and that&apos;s where the savings come from.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {COST_DRIVERS.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="rounded-3xl border border-[--border-strong] bg-white p-7 shadow-[0_16px_48px_rgba(57,28,45,0.06)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                  <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-xl text-[color:var(--text-main)]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">{body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Material callout */}
        <section className="rounded-3xl bg-[color:var(--brand-soft)] px-8 py-10 sm:px-12 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
                Material quality is not where we save
              </p>
              <h2 className="mt-3 font-display text-3xl leading-tight text-[color:var(--text-main)]">
                Myplant Two® — the same German implant system used by leading clinics worldwide
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--text-soft)]">
                Cheap implants exist. We don&apos;t use them. Roomchang&apos;s standard implant is Myplant Two®,
                a German-engineered titanium system with over a decade of clinical outcomes behind it.
                The implant sitting in a patient&apos;s jaw in Phnom Penh is the same part number that
                would be placed in Munich, Sydney, or London. Where we save money is in the lab and
                in clinic operating costs — never in the part we leave in your body.
              </p>
            </div>
          </div>
        </section>

        {/* Price table */}
        <section>
          <h2 className="font-display text-3xl text-[color:var(--text-main)]">
            Implant price comparison
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-soft)]">
            All Roomchang prices in USD. Australian prices reflect the 2022 ADA fee survey plus
            typical 10–25% increases through 2026. Final price depends on bone condition, abutment
            type, and crown material — confirmed after consultation and CT imaging.
          </p>

          <div className="mt-8 overflow-hidden rounded-3xl border border-[color:var(--brand-soft)] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-[color:var(--brand-soft)] bg-[--surface]">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                      Treatment
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                      ADA
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-deep)]">
                      Roomchang (USD)
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
                      Australia (AUD)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[color:var(--brand-soft)]">
                  {IMPLANT_PRICES.map((row, i) => (
                    <tr key={i} className="transition hover:bg-[--surface]">
                      <td className="px-6 py-4 font-medium text-[color:var(--text-main)]">{row.treatment}</td>
                      <td className="px-6 py-4 text-center text-xs text-[color:var(--text-soft)]">{row.ada || "—"}</td>
                      <td className="px-6 py-4 text-right font-bold text-[color:var(--brand-deep)]">{row.roomchang}</td>
                      <td className="px-6 py-4 text-right text-[color:var(--text-soft)]">{row.australia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-[color:var(--brand)] p-10 text-white sm:p-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-4xl">Ready to plan your implants?</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-white/80">
                Send us your OPG, CT scan, or recent photos. We&apos;ll come back within two business
                days with a full treatment plan and an exact quote — no charge, no obligation.
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
