import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Snoring & Sleep Apnea Treatment | Roomchang Dental Hospital",
  description:
    "Roomchang is the only hospital in Cambodia offering advanced oral appliance therapy for snoring and obstructive sleep apnea. Phnom Penh.",
};

export default function SleepApneaPage() {
  return (
    <SiteShell>
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">Sleep Medicine</p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">
            Snoring &amp; Sleep Apnea
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            Roomchang Dental Hospital is the only hospital in Cambodia offering a new advanced technology solution
            to snoring and Obstructive Sleep Apnea (OSA). OSA is associated with serious conditions including
            heart failure, stroke, heart attack, and circulatory problems — and it doesn&apos;t just diminish your
            quality of life, it can shorten it.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">Book a Consultation</Link>
            <Link href="/services" className="btn-secondary">All Services</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 space-y-16">

        {/* Understanding OSA */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-[--text-main]">Understanding Sleep Apnea</h2>
            <p className="mt-4 text-sm leading-7 text-[--text-soft]">
              Obstructive Sleep Apnea occurs when the muscles of the throat relax during sleep, causing the
              airway to collapse and breathing to stop repeatedly throughout the night. Each episode reduces
              oxygen levels in the blood, straining the heart and cardiovascular system.
            </p>
            <p className="mt-3 text-sm leading-7 text-[--text-soft]">
              Snoring is the most visible symptom, but OSA often goes undiagnosed for years — with sufferers
              experiencing daytime fatigue, poor concentration, morning headaches, and irritability without
              knowing why.
            </p>
          </div>
          <div className="rounded-3xl bg-[color:var(--brand-soft)] p-8">
            <h3 className="font-display text-xl text-[color:var(--brand-deep)]">Associated Health Risks</h3>
            <ul className="mt-4 space-y-3">
              {[
                "Heart failure and cardiac arrhythmias",
                "Stroke and increased stroke risk",
                "Heart attack",
                "Respiratory and circulatory problems",
                "Severe daytime fatigue and cognitive impairment",
                "Increased risk of road and workplace accidents",
              ].map((r) => (
                <li key={r} className="flex items-start gap-3 text-sm text-[--text-soft]">
                  <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Treatment */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">Our Treatment Approach</h2>
          <p className="mt-4 text-sm leading-7 text-[--text-soft] max-w-3xl">
            We offer non-surgical oral appliance therapy — a small device worn at night that repositions the
            jaw to keep the airway open. Our diagnostic equipment measures body mass index, breathing frequency,
            and other OSA indicators to accurately characterise the severity of your condition before treatment.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "Step 1",
                title: "Consultation & Diagnosis",
                body: "Your initial appointment includes a full assessment using specialist diagnostic equipment to measure OSA indicators.",
              },
              {
                step: "Step 2",
                title: "Home Sleep Study",
                body: "You spend one night at home connected to monitors for an accurate, real-world sleep diagnosis.",
              },
              {
                step: "Step 3",
                title: "Oral Appliance Delivered",
                body: "Seven days later, your custom-made oral appliance is fitted — effectively eliminating the condition in most cases.",
              },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-[--border-strong] bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">{s.step}</p>
                <h3 className="mt-2 font-display text-xl text-[--text-main]">{s.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[--text-soft]">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Roomchang */}
        <div className="rounded-3xl border border-[--border-strong] bg-white p-8">
          <h2 className="font-display text-2xl text-[--text-main]">Only Available at Roomchang</h2>
          <p className="mt-4 text-sm leading-7 text-[--text-soft]">
            Roomchang Dental Hospital is currently the only facility in Cambodia offering this advanced oral
            appliance technology for snoring and OSA. Our specialist in this area is Dr. Loung Lov, DDS, MSc —
            who holds a Master&apos;s degree in Oral Implantology and has specific expertise in snoring and sleep
            apnea treatment.
          </p>
        </div>
      </div>

      <div className="border-t border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl text-[--text-main]">Sleep better. Live better.</h2>
            <p className="mt-2 text-sm text-[--text-soft]">Call <a href="tel:+85523211338" className="font-semibold text-[color:var(--brand)]">+855 23 211 338</a> or send us an enquiry.</p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">Book a Consultation</Link>
        </div>
      </div>
    </SiteShell>
  );
}
