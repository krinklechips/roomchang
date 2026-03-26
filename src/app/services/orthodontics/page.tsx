import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orthodontics & Braces | Roomchang Dental Hospital",
  description:
    "Orthodontics at Roomchang — metal braces, ceramic braces, CA® Clear Aligner, and Invisalign. Straighten your teeth in Phnom Penh.",
};

const PROBLEMS = [
  { title: "Overbite", desc: "Upper front teeth protrude excessively over the lower teeth." },
  { title: "Underbite", desc: "Lower teeth sit too far forward or upper teeth too far back." },
  { title: "Crossbite", desc: "Upper teeth do not come down slightly in front of the lower teeth when biting." },
  { title: "Open Bite", desc: "Space between the biting surfaces of the front or side teeth when back teeth bite together." },
  { title: "Spacing", desc: "Gaps from excessive distance between teeth or missing teeth." },
  { title: "Crowding", desc: "Too many teeth for the dental ridge to accommodate." },
];

const OPTIONS = [
  {
    title: "Metal Braces",
    tag: "Most effective",
    desc: "The most common orthodontic appliance. Brackets bonded to the teeth use arch wires to create tension that gradually moves teeth into alignment. Modern metal braces are much smaller and lighter than older versions — available in colours or clear.",
  },
  {
    title: "Ceramic Braces",
    tag: "Discreet",
    desc: "Same mechanics as metal braces but with tooth-coloured or clear ceramic brackets — far less visible from a distance while delivering the same reliable results.",
  },
  {
    title: "CA® Clear Aligner",
    tag: "Nearly invisible",
    desc: "A series of clear, transparent custom-made splints that guide your teeth into position. Almost invisible, comfortable to wear, and easy to keep clean. Made from the highest-quality transparent material by SCHEU-DENTAL.",
  },
  {
    title: "Invisalign®",
    tag: "Premium aligner",
    desc: "Custom-made clear plastic aligners designed using 3D computer imaging and CAD/CAM technology. Virtually invisible and fully removable. Each aligner is worn for approximately 2 weeks before moving to the next in the sequence.",
  },
];

export default function OrthodonticsPage() {
  return (
    <SiteShell>
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">Orthodontics</p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">
            Orthodontics &amp; Braces
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            Correct and straighten your teeth for the perfect smile. Roomchang&apos;s specialist orthodontists have
            treated hundreds of cases — each one a personalised treatment plan tailored to the patient&apos;s specific
            needs, whether child or adult.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">Book a Consultation</Link>
            <Link href="/services" className="btn-secondary">All Services</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 space-y-16">

        {/* Why it matters */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-[--text-main]">More Than Just Aesthetics</h2>
            <p className="mt-4 text-sm leading-7 text-[--text-soft]">
              Crowded or misaligned teeth are harder to clean, making them more susceptible to decay and
              periodontal disease — leading to early tooth loss. Misaligned teeth also place stress on the
              chewing muscles, which can cause headaches, ear pain, and TMJ syndrome.
            </p>
            <p className="mt-3 text-sm leading-7 text-[--text-soft]">
              Orthodontic treatment works for both children and adults. It&apos;s never too late to straighten
              your teeth and protect your long-term oral health.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-[--text-main] mb-4">Problems We Treat</h2>
            <div className="grid grid-cols-2 gap-3">
              {PROBLEMS.map((p) => (
                <div key={p.title} className="rounded-2xl border border-[--border-strong] bg-white p-4">
                  <p className="font-semibold text-sm text-[--text-main]">{p.title}</p>
                  <p className="mt-1 text-xs leading-5 text-[--text-soft]">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Treatment options */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">Treatment Options</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {OPTIONS.map((o) => (
              <div key={o.title} className="rounded-2xl border border-[--border-strong] bg-white p-6 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl text-[--text-main]">{o.title}</h3>
                  <span className="shrink-0 rounded-full bg-[color:var(--brand-soft)] px-2.5 py-1 text-[0.65rem] font-semibold text-[color:var(--brand-deep)]">
                    {o.tag}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-[--text-soft] flex-1">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Specialists note */}
        <div className="rounded-3xl bg-[color:var(--brand-soft)] p-8">
          <h2 className="font-display text-2xl text-[color:var(--brand-deep)]">Our Orthodontic Team</h2>
          <p className="mt-4 text-sm leading-7 text-[--text-soft]">
            Roomchang has 5 specialist orthodontists, many holding Masters degrees from leading European
            institutions in Germany and Austria. Our team treats complex cases including lingual braces,
            orthognathic surgery coordination, and early childhood orthodontic assessment.
          </p>
        </div>
      </div>

      <div className="border-t border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl text-[--text-main]">Start your smile journey.</h2>
            <p className="mt-2 text-sm text-[--text-soft]">Call <a href="tel:+85523211338" className="font-semibold text-[color:var(--brand)]">+855 23 211 338</a> or send us an enquiry.</p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">Book a Consultation</Link>
        </div>
      </div>
    </SiteShell>
  );
}
