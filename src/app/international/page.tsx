import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "International Patients | Roomchang Dental Hospital",
  description:
    "Planning dental treatment in Cambodia? Roomchang supports international patients from Australia, Asia, and worldwide — treatment planning, coordination, and multilingual care.",
};

const STEPS = [
  {
    step: "01",
    title: "Send Us Your X-rays or Photos",
    description:
      "Email or WhatsApp your dental records, existing X-rays, or clear photos of your teeth. Our team will review them and provide an initial assessment.",
  },
  {
    step: "02",
    title: "Receive a Treatment Plan & Quote",
    description:
      "Within 1–2 business days, you'll receive a detailed treatment plan with costs, timelines, and what to expect at each visit.",
  },
  {
    step: "03",
    title: "Book Your Dates",
    description:
      "Once you're happy to proceed, we'll schedule your appointments around your travel dates and confirm everything in writing.",
  },
  {
    step: "04",
    title: "Arrive — We Handle the Rest",
    description:
      "Our team can assist with airport directions, accommodation recommendations near our clinic, and a warm welcome on arrival.",
  },
  {
    step: "05",
    title: "Treatment & Follow-up",
    description:
      "Receive your treatment in a modern, hospital-standard facility. We'll provide digital records and a full report for your home dentist.",
  },
];

const WHY_ITEMS = [
  {
    title: "Significant Cost Savings",
    description:
      "Dental work in Phnom Penh can cost 40–70% less than equivalent treatment in Australia, Singapore, or the UK — without compromising on quality.",
  },
  {
    title: "Hospital-Grade Standards",
    description:
      "Roomchang operates to international sterilisation and clinical protocols. Our lab, imaging, and materials meet the same standards you expect at home.",
  },
  {
    title: "Multilingual Team",
    description:
      "Our staff speak Khmer, English, Mandarin, Japanese, Malay, and French. You will always have someone who can communicate clearly with you.",
  },
  {
    title: "Flexible Scheduling",
    description:
      "We work around your travel itinerary. Many treatments can be staged across a single trip, with digital follow-up when you return home.",
  },
  {
    title: "Digital Records",
    description:
      "All imaging, treatment notes, and records are stored digitally and shared with you so your home dentist can continue your care seamlessly.",
  },
  {
    title: "Established Reputation",
    description:
      "Since 1996, Roomchang has treated thousands of international patients from over 20 countries. Read their stories in our testimonials.",
  },
];

const POPULAR_TREATMENTS = [
  { name: "Full Mouth Reconstruction", saving: "Save ~60%" },
  { name: "Dental Implants (per implant)", saving: "Save ~50%" },
  { name: "All-on-4 / All-on-6", saving: "Save ~55%" },
  { name: "Porcelain Veneers (per tooth)", saving: "Save ~45%" },
  { name: "E-Max Crown", saving: "Save ~50%" },
  { name: "Invisalign / Clear Aligner", saving: "Save ~40%" },
];

export default function InternationalPage() {
  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[--brand]">
            Dental Tourism
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">
            International Patients
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            Thousands of patients travel from Australia, Japan, Singapore, and beyond to receive
            world-class dental care at Roomchang. We make the process simple, transparent, and as
            comfortable as possible.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">
              Start Your Treatment Plan
            </Link>
            <Link href="/services" className="btn-secondary">
              Browse Services
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 space-y-20">

        {/* Why Roomchang */}
        <section>
          <h2 className="font-display text-4xl text-[--text-main]">Why Choose Roomchang?</h2>
          <p className="mt-3 text-sm leading-7 text-[--text-soft] max-w-xl">
            Quality dental care in Cambodia offers genuine value — not as a compromise, but as a
            deliberate choice by patients who have done their research.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_ITEMS.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.75rem] border border-[--border-strong] bg-white p-6 shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
              >
                <h3 className="font-display text-xl text-[--brand-deep]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[--text-soft]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cost comparison */}
        <section className="rounded-[2rem] border border-[--border-strong] bg-[--surface] overflow-hidden">
          <div className="px-8 py-8 border-b border-[--border-strong]">
            <h2 className="font-display text-3xl text-[--text-main]">Cost Comparison</h2>
            <p className="mt-2 text-sm leading-6 text-[--text-soft]">
              Indicative savings vs. equivalent treatments in Australia and Singapore.
            </p>
          </div>
          <div className="divide-y divide-[--border-strong]">
            {POPULAR_TREATMENTS.map((t) => (
              <div
                key={t.name}
                className="flex items-center justify-between px-8 py-4"
              >
                <p className="text-sm font-semibold text-[--text-main]">{t.name}</p>
                <span className="rounded-full bg-[--brand-soft] px-3 py-1 text-xs font-bold text-[--brand-deep]">
                  {t.saving}
                </span>
              </div>
            ))}
          </div>
          <div className="px-8 py-5 bg-[--brand-soft]">
            <p className="text-xs text-[--text-soft]">
              * Savings are estimates compared to typical Western prices. Exact quotes depend on
              your specific treatment needs. Contact us for a personalised plan.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works">
          <h2 className="font-display text-4xl text-[--text-main]">How It Works</h2>
          <p className="mt-3 text-sm leading-7 text-[--text-soft] max-w-xl">
            From your first message to your last appointment, we make every step clear and
            manageable — even from the other side of the world.
          </p>
          <div className="mt-10 space-y-6">
            {STEPS.map((s) => (
              <div
                key={s.step}
                className="flex gap-6 rounded-[1.75rem] border border-[--border-strong] bg-white p-6 shadow-[0_8px_30px_rgba(57,28,45,0.04)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[--brand] font-bold text-white text-sm">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-semibold text-[--text-main]">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-[--text-soft]">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-[2rem] bg-[--brand] p-10 sm:p-14 text-white">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-4xl">Ready to get started?</h2>
              <p className="mt-2 text-sm leading-7 text-white/80 max-w-md">
                Send us your X-rays or a short message and we&apos;ll put together a free
                treatment plan within two business days.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-full border border-white/30 bg-white px-7 py-4 text-sm font-bold text-[--brand] transition hover:bg-white/90"
            >
              Request a Free Plan
            </Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
