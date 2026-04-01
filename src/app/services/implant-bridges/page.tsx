import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { Shield, Microscope, PiggyBank } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Implant Bridges | Roomchang Dental Hospital",
  description:
    "Implant-supported bridges at Roomchang Dental Hospital — an economical and reliable alternative to single implant placement in Phnom Penh.",
};

const PRICES = [
  { treatment: "3 Metal Ceramic Crowns on 2-implant bridge with Metal Abutments", price: "$4,300" },
  { treatment: "3 E-Max Crowns on 2-implant bridge with Metal Abutments", price: "$5,000" },
  { treatment: "3 E-Max Crowns on 2-implant bridge with Zirconium Abutment", price: "$5,400" },
];

const STEPS = [
  { step: "1st Visit", detail: "Check-up, consultation, and X-rays. Implant placed immediately if tissue is healthy." },
  { step: "2nd Visit", detail: "Suture removal 10 days post-op. Minimum 8 weeks for osseointegration." },
  { step: "3rd Visit", detail: "Crown impression taken for bridge fabrication." },
  { step: "4th Visit", detail: "Permanent bridge cemented 5–7 days after impression." },
];

export default function ImplantBridgesPage() {
  return (
    <SiteShell>
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">Implantology</p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">Implant Bridges</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            An economical alternative to individual implant placement — predictable, stable, and always looking
            great. When two or more adjacent teeth are missing, an implant-supported bridge replaces them all using
            just two implants, making it a cost-effective and long-lasting solution.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">Book a Consultation</Link>
            <Link href="/services" className="btn-secondary">All Services</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 space-y-16">

        {/* Benefits */}
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { Icon: Shield, title: "Lifetime Warranty", body: "Our implant-supported bridges are solid, reliable, and backed by a lifetime warranty." },
            { Icon: Microscope, title: "Long-term Tissue Stability", body: "The implant system is designed to prevent bone resorption while protecting your gums." },
            { Icon: PiggyBank, title: "Economical", body: "Replace multiple missing teeth using only two implants rather than one per tooth." },
          ].map((b) => (
            <div key={b.title} className="rounded-2xl border border-[--border-strong] bg-white p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[--brand-soft] text-[--brand-deep]">
                <b.Icon size={20} strokeWidth={1.75} aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl text-[--text-main]">{b.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[--text-soft]">{b.body}</p>
            </div>
          ))}
        </div>

        {/* Procedure */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">What to Expect</h2>
          <p className="mt-3 text-sm text-[--text-soft] mb-8">Completed over two trips, across four appointments.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.step} className="rounded-2xl border border-[--border-strong] bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">{s.step}</p>
                <p className="mt-2 text-sm leading-7 text-[--text-soft]">{s.detail}</p>
              </div>
            ))}
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
            <h2 className="font-display text-3xl text-[--text-main]">Replace missing teeth — permanently.</h2>
            <p className="mt-2 text-sm text-[--text-soft]">Call <a href="tel:+85523211338" className="font-semibold text-[color:var(--brand)]">+855 23 211 338</a> or send us an enquiry.</p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">Book a Consultation</Link>
        </div>
      </div>
    </SiteShell>
  );
}
