import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { HeartPulse, Utensils, Gem, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Full Mouth Reconstruction | Roomchang Dental Hospital",
  description:
    "Comprehensive full mouth reconstruction at Roomchang Dental Hospital — restoring function, comfort, and aesthetics for complex cases in Phnom Penh.",
};

export default function FullMouthReconstructionPage() {
  return (
    <SiteShell>
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">Advanced Dentistry</p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">Full Mouth Reconstruction</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            Full mouth reconstruction involves combining various advanced dental methods to create the correct
            relationship between your gums, bones, muscles, and teeth — restoring comfort, function, and a
            confident smile at the same time.
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
            <h2 className="font-display text-3xl text-[--text-main]">When Teeth Work Against You</h2>
            <p className="mt-4 text-sm leading-7 text-[--text-soft]">
              The mouth functions as a complex, interconnected system. When teeth are misaligned, destructive
              forces attack them with every jaw closure — causing progressive tooth breakage and pain in the
              jaw, neck, and head. Over time, this can result in severe wear, cracked teeth, receding gums,
              and difficulty eating.
            </p>
            <p className="mt-3 text-sm leading-7 text-[--text-soft]">
              Full mouth reconstruction addresses the root cause rather than treating individual teeth in
              isolation — creating a bite that works harmoniously and lasts for life.
            </p>
          </div>
          <div className="rounded-3xl bg-[color:var(--brand-soft)] p-8">
            <h3 className="font-display text-xl text-[color:var(--brand-deep)]">Who Is a Candidate?</h3>
            <ul className="mt-4 space-y-3">
              {[
                "Severely worn, cracked, or broken teeth",
                "Multiple missing teeth across the mouth",
                "Chronic jaw pain or TMJ disorder",
                "Advanced gum disease with bone loss",
                "Bite misalignment causing headaches or neck pain",
                "Patients wanting a complete aesthetic and functional overhaul",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[--text-soft]">
                  <span className="mt-1 shrink-0 h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Benefits */}
        <div>
          <h2 className="font-display text-3xl text-[--text-main]">What Reconstruction Achieves</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: HeartPulse, title: "Pain Relief", body: "Correcting bite misalignment relieves pressure on jaw joints, muscles, and individual teeth — eliminating pain that patients often accept as normal." },
              { Icon: Utensils, title: "Restored Function", body: "Eat, speak, and smile without discomfort or embarrassment. Every tooth doing the job it was designed to do." },
              { Icon: Gem, title: "Improved Aesthetics", body: "A full reconstruction considers aesthetics from the outset — the size, shape, colour, and alignment of every visible tooth." },
              { Icon: ShieldCheck, title: "Long-term Health", body: "Addressing the root causes of dental breakdown — rather than patching individual problems — protects your investment for decades." },
            ].map((b) => (
              <div key={b.title} className="rounded-2xl border border-[--border-strong] bg-white p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[--brand-soft] text-[--brand-deep]">
                  <b.Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg text-[--text-main]">{b.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[--text-soft]">{b.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our approach */}
        <div className="rounded-3xl border border-[--border-strong] bg-white p-8">
          <h2 className="font-display text-2xl text-[--text-main]">Our Approach</h2>
          <p className="mt-4 text-sm leading-7 text-[--text-soft]">
            Roomchang has a team of leading specialists in oral reconstruction across implantology, prosthodontics,
            orthodontics, periodontics, and oral surgery. Each full mouth reconstruction case is planned digitally
            using 3D CBCT scans and digital impressions, with a comprehensive treatment plan agreed with the
            patient before any work begins.
          </p>
          <p className="mt-3 text-sm leading-7 text-[--text-soft]">
            Treatment may combine implants, crowns, bridges, orthodontics, bone grafting, and gum treatment —
            sequenced carefully over a tailored timeline to achieve a result that is both functionally excellent
            and aesthetically natural.
          </p>
        </div>
      </div>

      <div className="border-t border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl text-[--text-main]">Start with a full assessment.</h2>
            <p className="mt-2 text-sm text-[--text-soft]">Call <a href="tel:+85523211338" className="font-semibold text-[color:var(--brand)]">+855 23 211 338</a> or send us an enquiry.</p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">Book a Consultation</Link>
        </div>
      </div>
    </SiteShell>
  );
}
