import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cosmetic Dentistry | Roomchang Dental Hospital",
  description:
    "Cosmetic dentistry and restorative fillings at Roomchang. Veneers, composite bonding, smile design, and tooth-coloured fillings in Phnom Penh.",
};

const PRICES = [
  { treatment: "Composite Filling — First Surface", price: "$35" },
  { treatment: "Composite Filling — Each Additional Surface", price: "$10–20" },
  { treatment: "Glass-Ionomer Restorative", price: "$25" },
  { treatment: "Fissure Sealant", price: "$20" },
  { treatment: "Indirect Composite Inlay", price: "$100–150" },
  { treatment: "Direct Composite Inlay", price: "$55–150" },
  { treatment: "Direct Composite Veneer / Composite Aesthetic Veneer", price: "$55–150" },
  { treatment: "Diastema / Space Closing", price: "$70–150" },
  { treatment: "Icon Filling (resin infiltration)", price: "$80–150" },
];

export default function CosmeticDentistryPage() {
  return (
    <SiteShell>
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">Aesthetics</p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">Cosmetic Dentistry</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            From a single composite filling to a complete smile transformation — Roomchang&apos;s cosmetic dentistry
            team blends artistic precision with state-of-the-art materials to deliver results that look and feel
            completely natural.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">Book a Consultation</Link>
            <Link href="/services" className="btn-secondary">All Services</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 space-y-16">

        {/* Fillings section */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-[--text-main]">Tooth-Coloured Fillings</h2>
            <p className="mt-4 text-sm leading-7 text-[--text-soft]">
              Dental cavities and cracked or damaged teeth require restorative treatment to halt further damage
              and preserve the natural tooth. At Roomchang, we use state-of-the-art composite resins and glass
              ionomers — not amalgam (mercury and silver alloy).
            </p>
            <p className="mt-3 text-sm leading-7 text-[--text-soft]">
              The result is a filling that matches the natural colour of your tooth perfectly.
              No more black fillings — ever.
            </p>
          </div>
          <div className="rounded-3xl bg-[color:var(--brand-soft)] p-8">
            <h3 className="font-display text-xl text-[color:var(--brand-deep)]">Why No Amalgam?</h3>
            <ul className="mt-4 space-y-3">
              {[
                "Mercury-free — safer for patients and the environment",
                "Tooth-coloured — invisible in your smile",
                "Bonds directly to tooth structure — less drilling required",
                "Durable and long-lasting with modern composite resins",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[--text-soft]">
                  <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Veneers & cosmetic */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">Veneers &amp; Smile Design</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Composite Veneers",
                body: "Tooth-coloured composite resin applied and sculpted directly onto the tooth surface in a single visit. An affordable way to close gaps, mask stains, or reshape teeth.",
              },
              {
                title: "Porcelain Veneers",
                body: "Ultra-thin porcelain shells bonded to the front of your teeth. More durable and stain-resistant than composite, with an exceptional lifelike translucency.",
              },
              {
                title: "Diastema Closure",
                body: "Gaps between teeth closed with composite bonding or veneers — a quick, minimally invasive treatment that transforms your smile.",
              },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl border border-[--border-strong] bg-white p-6">
                <h3 className="font-display text-xl text-[--text-main]">{v.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[--text-soft]">{v.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">Pricing</h2>
          <p className="mt-3 text-sm text-[--text-soft] mb-8">All prices in USD. General consultation is free.</p>
          <div className="overflow-hidden rounded-2xl border border-[--border-strong]">
            <table className="w-full text-sm">
              <thead className="bg-[--surface]">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-[--text-main]">Treatment</th>
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
            <h2 className="font-display text-3xl text-[--text-main]">Transform your smile.</h2>
            <p className="mt-2 text-sm text-[--text-soft]">Call <a href="tel:+85523211338" className="font-semibold text-[color:var(--brand)]">+855 23 211 338</a> or send us an enquiry.</p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">Book a Consultation</Link>
        </div>
      </div>
    </SiteShell>
  );
}
