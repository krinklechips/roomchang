import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { SiteShell } from "@/components/site/site-shell";
import { InteractiveSteps } from "@/components/sections/interactive-steps";
import { ChecklistForm } from "@/components/sections/checklist-form";
import { getInternationalSteps, getInternationalWhyItems, getInternationalPopularTreatments } from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "International Patients | Roomchang Dental Hospital",
  description:
    "Planning dental treatment in Cambodia? Roomchang supports international patients from Australia, Asia, and worldwide — treatment planning, coordination, and multilingual care.",
};

const HERO_TRUST = [
  { value: "35–60%", label: "Savings" },
  { value: "30 yrs", label: "Experience" },
];

function renderWhyCard(item: { title: string; description: string }) {
  const keyword = "Read their stories in our testimonials.";
  const hasTestimonials = item.description.includes(keyword);
  const cleanDesc = hasTestimonials ? item.description.replace(keyword, "").trim() : item.description;

  return (
    <div
      key={item.title}
      className="rounded-2xl border border-[color:var(--border-strong)] bg-white p-6 shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
    >
      <h3 className="font-display text-xl text-[color:var(--brand-deep)]">{item.title}</h3>
      <p className="mt-3 text-sm leading-6 text-[color:var(--text-soft)]">{cleanDesc}</p>
      {hasTestimonials && (
        <Link
          href="/about/testimonials"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-soft)] px-4 py-2 text-xs font-bold text-[color:var(--brand-deep)] transition hover:bg-[color:var(--brand-light)] hover:text-white"
        >
          Read Patient Testimonials <ArrowRight size={13} weight="bold" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export default async function InternationalPage() {
  const [steps, whyItems, popularTreatments] = await Promise.all([
    getInternationalSteps(),
    getInternationalWhyItems(),
    getInternationalPopularTreatments(),
  ]);

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
              Dental Tourism
            </p>
            <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
              International Patients
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
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
            <div className="grid grid-cols-2 gap-4">
              {HERO_TRUST.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[color:var(--brand-soft)] bg-white px-8 py-7 shadow-[0_8px_24px_rgba(57,28,45,0.06)]">
                  <p className="font-display text-4xl text-[color:var(--brand-deep)]">{item.value}</p>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero image */}
      <div className="border-b border-[color:var(--border-strong)]">
        <div className="relative aspect-[2500/1050] overflow-hidden sm:aspect-[21/8]">
          <Image
            src="/hero/hero-customer-service.jpg"
            alt="Roomchang dental team welcoming an international patient"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 space-y-20">

        {/* Why Roomchang */}
        <section>
          <h2 className="font-display text-4xl text-[color:var(--text-main)]">Why Choose Roomchang?</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)] max-w-xl">
            Quality dental care in Cambodia offers genuine value — not as a compromise, but as a
            deliberate choice by patients who have done their research.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyItems.map((item) => renderWhyCard(item))}
          </div>
        </section>

        {/* Cost comparison */}
        <section className="rounded-3xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] overflow-hidden">
          <div className="px-8 py-8 border-b border-[color:var(--border-strong)]">
            <h2 className="font-display text-3xl text-[color:var(--text-main)]">Cost Comparison</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--text-soft)]">
              Indicative savings vs. equivalent treatments in Australia, Singapore &amp; the UK.
            </p>
          </div>
          <div className="divide-y divide-[--border-strong]">
            {popularTreatments.map((t) => (
              <div
                key={t.name}
                className="flex items-center justify-between px-8 py-4"
              >
                <p className="text-sm font-semibold text-[color:var(--text-main)]">{t.name}</p>
                <span className="rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-xs font-bold text-[color:var(--brand-deep)]">
                  {t.saving}
                </span>
              </div>
            ))}
          </div>
          <div className="px-8 py-5 bg-[color:var(--brand-soft)]">
            <p className="text-xs text-[color:var(--text-soft)]">
              * Savings are estimates compared to typical prices in Australia, Singapore &amp; the UK. Exact quotes
              depend on your specific treatment needs. Contact us for a personalised plan.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works">
          <h2 className="font-display text-4xl text-[color:var(--text-main)]">How It Works</h2>
          <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)] max-w-xl">
            From your first message to your last appointment, we make every step clear and
            manageable — even from the other side of the world.
          </p>
          <InteractiveSteps steps={steps} />
          <ChecklistForm />
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
              className="shrink-0 rounded-full border border-white/30 bg-white px-7 py-4 text-sm font-bold text-[color:var(--brand)] transition hover:bg-white/90"
            >
              Request a Free Plan
            </Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
