import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dental Implants | Roomchang Dental Hospital",
  description:
    "Permanent tooth replacement using titanium implants at Roomchang. Single implants, implant bridges, and All-on-4/6/8 full-arch solutions in Phnom Penh.",
};

const PRICES = [
  { treatment: "Metal Ceramic Crown + Implant + Metal Abutment", price: "$2,000" },
  { treatment: "E-Max Crown + Implant + Metal Abutment", price: "$2,200" },
  { treatment: "E-Max Crown + Implant + Zirconium Abutment", price: "$2,400" },
];

const COMPONENTS = [
  {
    title: "Implant",
    body: "A small titanium screw surgically inserted into the jawbone. Titanium is bio-compatible and fuses directly to bone through osseointegration, providing a permanent, stable anchor.",
  },
  {
    title: "Abutment",
    body: "Screwed in once the implant fuses with bone. A ceramic or titanium component that ensures a secure fit between the implant and the crown. Healing time ranges from immediate loading to 2–4 months.",
  },
  {
    title: "Crown",
    body: "The visible part — a ceramic or metal-ceramic prosthetic tooth bonded to the abutment. Options include all-ceramic E-Max, porcelain fused to metal, or zirconium.",
  },
];

const STEPS = [
  { step: "1st Visit", detail: "Check-up, consultation, and X-rays. Implant placed immediately if tissue is healthy." },
  { step: "2nd Visit", detail: "Suture removal 10 days post-op. Minimum 6 weeks osseointegration period." },
  { step: "3rd Visit", detail: "Impression taken for the crown fabrication." },
  { step: "4th Visit", detail: "Permanent crown cemented 5–7 days after impression." },
];

export default function DentalImplantsPage() {
  return (
    <SiteShell>
      {/* Page header */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">Implantology</p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">Dental Implants</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            Dental implants are currently the best treatment option for a lost tooth — an artificial root surgically
            placed into the jawbone to permanently secure a replacement tooth, bridge, or denture. When you lose
            teeth, you lose a vital part of yourself. Implants give that back.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">Book a Consultation</Link>
            <Link href="/services" className="btn-secondary">All Services</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 space-y-16">

        {/* Brand callout */}
        <div className="rounded-3xl bg-[color:var(--brand-soft)] px-8 py-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="shrink-0 text-3xl">🦷</div>
          <div>
            <p className="font-semibold text-[color:var(--brand-deep)]">myplant two® Dental Implants</p>
            <p className="mt-1 text-sm text-[--text-soft]">
              We use the myplant two® implant system — featuring a special expansion thread and self-locking cone
              abutment connection, designed for long-term tissue stability and bone preservation.
            </p>
          </div>
        </div>

        {/* 3 Components */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">The 3 Components of an Implant</h2>
          <p className="mt-3 text-sm text-[--text-soft]">Every dental implant is made up of three distinct parts that work together.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {COMPONENTS.map((c, i) => (
              <div key={c.title} className="rounded-2xl border border-[--border-strong] bg-white p-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--brand)] text-white text-sm font-bold">{i + 1}</div>
                <h3 className="font-display text-xl text-[--text-main]">{c.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[--text-soft]">{c.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Patient requirements */}
        <div className="rounded-3xl border border-[--border-strong] bg-white p-8">
          <h2 className="font-display text-2xl text-[--text-main]">Patient Requirements</h2>
          <p className="mt-3 text-sm leading-7 text-[--text-soft]">
            Dental implants require healthy bone structure and healthy gums. A full examination, consultation, and
            X-rays (including 3D CBCT where needed) will determine your suitability. Our specialists will discuss
            any preparatory work — such as bone grafting or treatment of gum disease — that may be needed first.
          </p>
        </div>

        {/* Procedure steps */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">What to Expect</h2>
          <p className="mt-3 text-sm text-[--text-soft] mb-8">The full implant procedure is typically completed over two trips, across four appointments.</p>
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

      {/* CTA */}
      <div className="border-t border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl text-[--text-main]">Ready to restore your smile?</h2>
            <p className="mt-2 text-sm text-[--text-soft]">Call us on <a href="tel:+85523211338" className="font-semibold text-[color:var(--brand)]">+855 23 211 338</a> or send an enquiry and we&apos;ll get back to you within one business day.</p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">Book a Consultation</Link>
        </div>
      </div>
    </SiteShell>
  );
}
