import Link from "next/link";
import {
  Search,
  ScanLine,
  Droplets,
  Sparkles,
  Crown,
  Minus,
  CircleDot,
  AlignCenter,
  Scissors,
  Zap,
  Moon,
  Smile,
  type LucideIcon,
} from 'lucide-react';
import { SiteShell } from "@/components/site/site-shell";
import { getPricingCategories } from "@/lib/data";
import type { Metadata } from "next";
import pricingData from "@/data/pricing.json";

export const metadata: Metadata = {
  title: "Dental Treatment Prices | Roomchang Dental Hospital",
  description:
    "Transparent pricing for dental implants, crowns, orthodontics, veneers, and more at Roomchang Dental Hospital in Phnom Penh, Cambodia.",
};

const HERO_TRUST = [
  { value: "$0",     label: "Consultation" },
  { value: "USD",    label: "All Prices" },
  { value: "40–70%", label: "vs. AUS/UK" },
  { value: "No",     label: "Hidden Fees" },
];

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'examination': Search,
  'cleaning':    Droplets,
  'x-ray':       ScanLine,
  'digital':     ScanLine,
  'filling':     Sparkles,
  'cosmetic':    Sparkles,
  'aesthetic':   Sparkles,
  'crown':       Crown,
  'bridge':      Crown,
  'root canal':  Minus,
  'implant':     CircleDot,
  'orthodontic': AlignCenter,
  'surgery':     Scissors,
  'whitening':   Zap,
  'sleep':       Moon,
  'paediatric':  Smile,
  'pediatric':   Smile,
};

function getCategoryIcon(title: string): LucideIcon {
  const lower = title.toLowerCase();
  for (const [key, Icon] of Object.entries(CATEGORY_ICONS)) {
    if (lower.includes(key)) return Icon;
  }
  return Sparkles;
}

export default async function PricingPage() {
  const categories = await getPricingCategories();
  const { comparisons } = pricingData;

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
              Transparent Pricing
            </p>
            <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
              Treatment Prices
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
              We believe in clear, upfront pricing — no hidden fees. All prices below are in USD and reflect
              actual treatment costs. Your exact quote will be confirmed after consultation and X-rays.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">Get a Personalised Quote</Link>
              <Link href="/international" className="btn-secondary">International Patients</Link>
            </div>
          </div>
          <div className="hidden lg:flex lg:justify-end">
            <div className="grid grid-cols-2 gap-3">
              {HERO_TRUST.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[color:var(--border-strong)] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(57,28,45,0.06)]">
                  <p className="font-display text-2xl text-[color:var(--brand-deep)]">{item.value}</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 space-y-20">

        {/* Price tables */}
        <section>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="overflow-hidden rounded-[2rem] border border-[--border-strong] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)]"
              >
                <div className="flex items-center gap-3 border-b border-[--border-strong] px-6 py-5">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--surface-strong)] text-[color:var(--brand-deep)]"
                    aria-hidden="true"
                  >
                    {(() => { const Icon = getCategoryIcon(cat.title); return <Icon className="h-5 w-5" />; })()}
                  </span>
                  <h2 className="font-display text-xl leading-tight text-[color:var(--text-main)]">
                    {cat.title}
                  </h2>
                </div>
                <ul className="divide-y divide-[--border-strong]">
                  {cat.items.map((item, i) => (
                    <li key={i} className="flex items-start justify-between gap-3 px-6 py-3.5">
                      <div className="min-w-0">
                        <span className="block text-sm text-[color:var(--text-soft)]">{item.name}</span>
                        {item.aus && (
                          <span className="block text-[0.68rem] text-[color:var(--text-soft)]/60 mt-0.5">
                            AU avg: ${item.aus}
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 text-sm font-bold text-[color:var(--brand-deep)]">
                        {item.price.toLowerCase() === "free" ? "Free" : `$${item.price}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs text-[color:var(--text-soft)]">
            * All prices in USD. Final pricing confirmed after clinical assessment. Prices subject to change — please contact us for the latest quote.
          </p>
        </section>

        {/* International comparison */}
        <section>
          <h2 className="font-display text-4xl text-[color:var(--text-main)]">Price Comparison</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--text-soft)]">
            See how Roomchang&apos;s prices compare to equivalent treatments in Australia —
            without compromising on quality or safety. Patients save up to 70%.
          </p>

          <div className="mt-10 overflow-hidden rounded-[2rem] border border-[--border-strong] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-[--border-strong] bg-[--surface]">
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
                <tbody className="divide-y divide-[--border-strong]">
                  {(comparisons as { ada: string; treatment: string; roomchang: string; australia: string }[]).map((row) => (
                    <tr key={row.ada} className="transition hover:bg-[--surface]">
                      <td className="px-6 py-4 font-medium text-[color:var(--text-main)]">{row.treatment}</td>
                      <td className="px-6 py-4 text-center text-xs text-[color:var(--text-soft)]">{row.ada}</td>
                      <td className="px-6 py-4 text-right font-bold text-[color:var(--brand-deep)]">{row.roomchang}</td>
                      <td className="px-6 py-4 text-right text-[color:var(--text-soft)]">{row.australia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-[--border-strong] bg-[--brand-soft] px-6 py-4">
              <p className="text-xs text-[color:var(--text-soft)]">
                * ADA codes reference the Australian Dental Association Schedule. Australian prices sourced from ADA survey data. Contact us for a personalised comparison.
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
