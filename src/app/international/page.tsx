import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { getInternationalSteps, getInternationalWhyItems, getInternationalPopularTreatments } from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "International Patients | Roomchang Dental Hospital",
  description:
    "Planning dental treatment in Cambodia? Roomchang supports international patients from Australia, Asia, and worldwide — treatment planning, coordination, and multilingual care.",
};

const HERO_TRUST = [
  { value: "20+",    label: "Countries" },
  { value: "40–70%", label: "Savings" },
  { value: "6",      label: "Languages" },
  { value: "30 yrs", label: "Experience" },
];

export default async function InternationalPage() {
  const [steps, whyItems, popularTreatments] = await Promise.all([
    getInternationalSteps(),
    getInternationalWhyItems(),
    getInternationalPopularTreatments(),
  ]);

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[--border-strong] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
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

        {/* Why Roomchang */}
        <section>
          <h2 className="font-display text-4xl text-[--text-main]">Why Choose Roomchang?</h2>
          <p className="mt-3 text-sm leading-7 text-[--text-soft] max-w-xl">
            Quality dental care in Cambodia offers genuine value — not as a compromise, but as a
            deliberate choice by patients who have done their research.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyItems.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[--border-strong] bg-white p-6 shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
              >
                <h3 className="font-display text-xl text-[--brand-deep]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[--text-soft]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cost comparison */}
        <section className="rounded-3xl border border-[--border-strong] bg-[color:var(--surface)] overflow-hidden">
          <div className="px-8 py-8 border-b border-[--border-strong]">
            <h2 className="font-display text-3xl text-[--text-main]">Cost Comparison</h2>
            <p className="mt-2 text-sm leading-6 text-[--text-soft]">
              Indicative savings vs. equivalent treatments in Australia and Singapore.
            </p>
          </div>
          <div className="divide-y divide-[--border-strong]">
            {popularTreatments.map((t) => (
              <div
                key={t.name}
                className="flex items-center justify-between px-8 py-4"
              >
                <p className="text-sm font-semibold text-[--text-main]">{t.name}</p>
                <span className="rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-xs font-bold text-[--brand-deep]">
                  {t.saving}
                </span>
              </div>
            ))}
          </div>
          <div className="px-8 py-5 bg-[color:var(--brand-soft)]">
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
            {steps.map((s) => (
              <div
                key={s.step_label}
                className="flex gap-6 rounded-2xl border border-[--border-strong] bg-white p-6 shadow-[0_8px_30px_rgba(57,28,45,0.04)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--brand)] font-bold text-white text-sm">
                  {s.step_label}
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
        <section className="rounded-3xl bg-[color:var(--brand)] p-10 sm:p-14 text-white">
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
