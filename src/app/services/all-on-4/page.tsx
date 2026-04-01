import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { Bone, Smile, UtensilsCrossed, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All-on-4 / All-on-6 Implant Supported Dentures | Roomchang Dental Hospital",
  description:
    "Full arch tooth replacement with implant-supported dentures at Roomchang. All-on-4, All-on-6, and All-on-8 solutions available in Phnom Penh.",
};

const PRICES = [
  { treatment: "Removable overdenture with 4 implants — Upper jaw (All-on-4)", price: "$9,000" },
  { treatment: "Removable overdenture with 4 implants — Lower jaw (All-on-4)", price: "$9,000" },
  { treatment: "Removable overdenture with 6 implants — Upper jaw (All-on-6)", price: "$13,200" },
  { treatment: "Removable overdenture with 6 implants — Lower jaw (All-on-6)", price: "$13,200" },
];

const OVERDENTURE_TYPES = [
  {
    title: "Implant-Retained, Gum Supported",
    body: "The denture rests on the gums and is removable. It is secured to the implants via special attachments, providing far greater stability than a conventional denture.",
  },
  {
    title: "Fixed, Implant Supported",
    body: "Secured directly to the implants and only removable by a dentist. This is the closest resemblance to natural teeth and provides the strongest, most natural feel.",
  },
];

export default function AllOn4Page() {
  return (
    <SiteShell>
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">Implantology</p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">
            All-on-4, 6 &amp; 8 Implant Supported Dentures
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            When a large number or all of a patient&apos;s teeth have been lost or need replacement, an implant-supported
            overdenture or full arch bridge is a practical and economical solution. Using just 4, 6, or 8 implants,
            we can restore an entire arch of teeth — often in a single day.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">Book a Consultation</Link>
            <Link href="/services" className="btn-secondary">All Services</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 space-y-16">

        {/* Why implant supported */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">Why Implant-Supported Dentures?</h2>
          <p className="mt-4 text-sm leading-7 text-[--text-soft] max-w-3xl">
            Conventional dentures rest on the gums and gradually become loose as the jawbone shrinks over time.
            Implant-supported dentures anchor into the bone — preventing that deterioration entirely.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Bone, benefit: "Preserves jawbone and prevents facial structure changes" },
              { Icon: Smile, benefit: "Prevents premature wrinkles from shifting facial contours" },
              { Icon: UtensilsCrossed, benefit: "Restores better chewing function and clearer speech" },
              { Icon: Sparkles, benefit: "Eliminates the need for denture creams and adhesives" },
            ].map((b) => (
              <div key={b.benefit} className="rounded-2xl border border-[--border-strong] bg-white p-5">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-[--brand-soft] text-[--brand-deep]">
                  <b.Icon size={18} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <p className="text-sm leading-6 text-[--text-soft]">{b.benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Types */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">Types of Overdenture</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {OVERDENTURE_TYPES.map((t) => (
              <div key={t.title} className="rounded-2xl border border-[--border-strong] bg-white p-6">
                <h3 className="font-display text-xl text-[--text-main]">{t.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[--text-soft]">{t.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-3xl bg-[color:var(--brand-soft)] p-8">
          <h2 className="font-display text-2xl text-[color:var(--brand-deep)]">The All-on-4 System Explained</h2>
          <p className="mt-4 text-sm leading-7 text-[--text-soft] max-w-3xl">
            The All-on-4 system places 4 implants in specific strategic locations in the jaw, creating a 3D
            trapezoid force that supports a full arch metal-ceramic bridge of 12 or 14 teeth. The bridge is made
            from a metal substructure supporting ceramic teeth — the same material as conventional crowns.
          </p>
          <p className="mt-3 text-sm leading-7 text-[--text-soft] max-w-3xl">
            <strong className="text-[color:var(--brand-deep)]">Same-day procedure:</strong> implants are loaded
            (attached to the bridge) on the same day they are placed. Where bone volume is insufficient, 6 or 8
            implants may be used to better distribute pressure across the arch.
          </p>
        </div>

        {/* Pricing */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">Pricing</h2>
          <p className="mt-3 text-sm text-[--text-soft] mb-8">All prices in USD. Consultation is free.</p>
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
            <h2 className="font-display text-3xl text-[--text-main]">Start your full-mouth restoration.</h2>
            <p className="mt-2 text-sm text-[--text-soft]">Call <a href="tel:+85523211338" className="font-semibold text-[color:var(--brand)]">+855 23 211 338</a> or send us an enquiry.</p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">Book a Consultation</Link>
        </div>
      </div>
    </SiteShell>
  );
}
