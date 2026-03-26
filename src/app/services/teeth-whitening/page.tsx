import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teeth Whitening | Roomchang Dental Hospital",
  description:
    "Professional teeth whitening at Roomchang using the Beyond Polus system. Chairside and take-home whitening options in Phnom Penh.",
};

const PRICES = [
  { treatment: "Chairside Whitening — includes basic cleaning & polishing", price: "$250" },
  { treatment: "Home Whitening Kit — cleaning & polishing extra $25–45", price: "$150" },
  { treatment: "Chairside + Home Combo — includes basic cleaning & polishing", price: "$350" },
];

export default function TeethWhiteningPage() {
  return (
    <SiteShell>
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">Aesthetics</p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">Teeth Whitening</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            A dazzling white smile that lasts up to 2 years — in just one 45-minute treatment. Roomchang uses
            the Beyond Polus® whitening system, featuring the latest in Light Bright© technology for safe,
            painless, and dramatically effective results.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">Book a Whitening Session</Link>
            <Link href="/services" className="btn-secondary">All Services</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 space-y-16">

        {/* Technology callout */}
        <div className="rounded-3xl bg-[color:var(--brand-soft)] p-8">
          <h2 className="font-display text-2xl text-[color:var(--brand-deep)]">Beyond Polus® Technology</h2>
          <p className="mt-4 text-sm leading-7 text-[--text-soft]">
            The Beyond Polus® system uses a high-intensity blue light — not a heat lamp — that is completely
            filtered by a 12,000-strong optical fibre filtering system. Only cold light reaches your teeth,
            causing oxidation of stains without heat, pain, or harmful side effects.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { stat: "45 min", label: "Treatment time" },
              { stat: "2 years", label: "Results last up to" },
              { stat: "0", label: "UV exposure" },
              { stat: "100%", label: "Safe & painless" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white p-4 text-center">
                <p className="font-display text-2xl text-[color:var(--brand-deep)]">{s.stat}</p>
                <p className="mt-1 text-xs text-[--text-soft]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Options */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">Whitening Options</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-[--border-strong] bg-white p-6">
              <h3 className="font-display text-xl text-[--text-main]">In-Chair Whitening</h3>
              <p className="mt-1 text-xs text-[color:var(--brand)] font-semibold">One appointment · 1.5 hours total</p>
              <p className="mt-3 text-sm leading-7 text-[--text-soft]">
                The fastest way to whiten. Our dentist applies the professional-grade whitening gel and activates
                it with the Beyond Polus® blue light. Results are immediate and dramatic — often 6–10 shades
                lighter in a single session. Includes basic cleaning and polishing.
              </p>
              <p className="mt-4 text-sm font-semibold text-[--text-main]">
                Effective on: food, drink, and cigarette stains; fluoride staining; age-related discolouration.
              </p>
            </div>
            <div className="rounded-2xl border border-[--border-strong] bg-white p-6">
              <h3 className="font-display text-xl text-[--text-main]">Take-Home Kit</h3>
              <p className="mt-1 text-xs text-[color:var(--brand)] font-semibold">Two appointments · 30 min each</p>
              <p className="mt-3 text-sm leading-7 text-[--text-soft]">
                Custom-fitted trays and professional-grade whitening gel for use at home. Wear 1 hour per day
                for 14 days — visibly whiter in as few as 5 days. Comes with 6 syringes of whitening gel in
                Orange or Mint flavour, and a travel case with mirror.
              </p>
              <p className="mt-4 text-sm font-semibold text-[--text-main]">
                Uses a gentle hydrogen peroxide formula — suitable for sensitive teeth.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">Pricing</h2>
          <p className="mt-3 text-sm text-[--text-soft] mb-8">All prices in USD.</p>
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
            <h2 className="font-display text-3xl text-[--text-main]">Get a brighter smile — today.</h2>
            <p className="mt-2 text-sm text-[--text-soft]">Call <a href="tel:+85523211338" className="font-semibold text-[color:var(--brand)]">+855 23 211 338</a> or book online.</p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">Book a Whitening Session</Link>
        </div>
      </div>
    </SiteShell>
  );
}
