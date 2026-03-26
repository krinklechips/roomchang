import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dental Crowns | Roomchang Dental Hospital",
  description:
    "E-Max, zirconia, and PFM dental crowns at Roomchang. In-house CAD/CAM milling for precision fit crowns and bridges in Phnom Penh.",
};

const PRICES = [
  { treatment: "Ceramic Fused to Standard Alloy (PFM) — express service +$30", price: "$300" },
  { treatment: "Zirconium Based Ceramic Crown", price: "$600" },
  { treatment: "All Ceramic E-Max CAD/CAM Crown & Bridge", price: "$600" },
];

const CROWN_TYPES = [
  {
    title: "All Ceramic E-Max Crown",
    strength: "360–400 MPa",
    description:
      "Made from a single block of lithium disilicate ceramic. The transparent colour matches natural teeth with no grey gum line — the best aesthetic match available. Durable, strong, and non-allergic.",
    best: "Best aesthetics",
  },
  {
    title: "Zirconium Crown",
    strength: "900–1,200 MPa",
    description:
      "Made from zirconium oxide stabilised with yttrium oxide (YSZ). Extremely strong, non-allergic, metal-free, and allows light to pass through just like a natural tooth.",
    best: "Best strength",
  },
  {
    title: "Ceramic Fused to Metal (PFM)",
    strength: "90–160 MPa",
    description:
      "A metal shell of nickel, chromium, and cobalt with a fused porcelain veneer. A reliable, cost-effective option. Note: a thin dark line may occasionally be visible at the gum margin.",
    best: "Most economical",
  },
];

export default function DentalCrownsPage() {
  return (
    <SiteShell>
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">Restorative Dentistry</p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">Dental Crowns</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            If your tooth is damaged but not lost, a crown can restore its shape, appearance, and function. You may
            need a crown after a root canal, a large filling, or a broken tooth. We offer E-Max, zirconia, and
            PFM crowns — all milled in-house using digital CAD/CAM technology for a precise, natural-looking fit.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">Book a Consultation</Link>
            <Link href="/services" className="btn-secondary">All Services</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 space-y-16">

        {/* Crown types */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">Crown Options</h2>
          <p className="mt-3 text-sm text-[--text-soft] mb-8">
            Different materials suit different situations. Our specialists will recommend the best option for you
            based on the tooth location, bite force, and your aesthetic goals.
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {CROWN_TYPES.map((c) => (
              <div key={c.title} className="rounded-2xl border border-[--border-strong] bg-white p-6 flex flex-col">
                <span className="self-start rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-[0.7rem] font-semibold text-[color:var(--brand-deep)] mb-4">
                  {c.best}
                </span>
                <h3 className="font-display text-xl text-[--text-main]">{c.title}</h3>
                <p className="mt-1 text-xs text-[color:var(--brand)] font-semibold">Flexural strength: {c.strength}</p>
                <p className="mt-3 text-sm leading-7 text-[--text-soft] flex-1">{c.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Procedure */}
        <div className="rounded-3xl border border-[--border-strong] bg-white p-8">
          <h2 className="font-display text-2xl text-[--text-main]">The Procedure — 2 Appointments</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">1st Visit</p>
              <p className="mt-2 text-sm leading-7 text-[--text-soft]">
                The tooth is shaped, an impression or digital scan is taken, and a temporary crown is placed.
                Your permanent crown is fabricated in our in-house lab within 3–7 days. Express service is
                available for an additional $30 per crown.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">2nd Visit</p>
              <p className="mt-2 text-sm leading-7 text-[--text-soft]">
                The temporary crown is removed and the permanent crown is fitted, adjusted for bite, and
                permanently cemented. The result is natural-looking and immediately functional.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">Pricing</h2>
          <p className="mt-3 text-sm text-[--text-soft] mb-8">All prices in USD. Consultation is free.</p>
          <div className="overflow-hidden rounded-2xl border border-[--border-strong]">
            <table className="w-full text-sm">
              <thead className="bg-[--surface]">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-[--text-main]">Crown Type</th>
                  <th className="px-6 py-4 text-right font-semibold text-[--text-main]">Price (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[--border-strong] bg-white">
                {PRICES.map((p) => (
                  <tr key={p.treatment}>
                    <td className="px-6 py-4 text-[--text-soft]">{p.treatment}</td>
                    <td className="px-6 py-4 text-right font-semibold text-[--text-main]">{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="border-t border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl text-[--text-main]">Protect and restore your tooth.</h2>
            <p className="mt-2 text-sm text-[--text-soft]">Call <a href="tel:+85523211338" className="font-semibold text-[color:var(--brand)]">+855 23 211 338</a> or send us an enquiry.</p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">Book a Consultation</Link>
        </div>
      </div>
    </SiteShell>
  );
}
