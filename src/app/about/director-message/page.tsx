import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Message from Our Director | Roomchang Dental Hospital",
  description:
    "A message from Dr. Tith Hong Yoeu, DDS, MSc. — Founder & Director of Roomchang Dental Hospital, on the hospital's commitment to quality dentistry in Cambodia.",
};

export default function DirectorMessagePage() {
  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[--brand] transition hover:text-[--brand-deep]"
          >
            ← About
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">
            Message from Our Director
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Director card */}
          <div className="flex items-center gap-5 rounded-[2rem] border border-[--border-strong] bg-white p-6 shadow-[0_12px_40px_rgba(57,28,45,0.05)]">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--brand-soft),var(--brand-light))] text-2xl font-bold text-[--brand-deep]">
              TH
            </div>
            <div>
              <h2 className="font-display text-2xl text-[--text-main]">
                Dr. Tith Hong Yoeu
              </h2>
              <p className="text-sm font-semibold text-[--text-soft]">DDS, MSc.</p>
              <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-[--brand]">
                Founder & Director
              </p>
              <p className="mt-1 text-xs text-[--text-soft]">
                MSc. in Oral Implantology — Goethe University Frankfurt, Germany
              </p>
            </div>
          </div>

          {/* Message */}
          <div className="mt-10 space-y-6 text-base leading-8 text-[--text-soft]">
            <p>Dear Patients,</p>
            <p>
              Thank you for entrusting your dental care to Roomchang. Over the last three decades,
              we have always had a strong commitment to providing quality dentistry to everyone —
              regardless of background, nationality, or the complexity of the case.
            </p>
            <p>
              When I founded Roomchang in 1996, my goal was simple: to build a dental hospital in
              Cambodia that could match the standard of care available anywhere in the world. That
              vision hasn&apos;t changed. What has changed is the scale at which we can deliver it — five
              branches, 58 chairs, a full in-house digital laboratory, and a team of more than 30
              specialist dentists.
            </p>
            <p>
              We maintain strict ethical codes and invest continuously in the latest equipment and
              procedures. Our partnership with Prof. Nentwig and Goethe University of Frankfurt,
              Germany has been instrumental in shaping Roomchang&apos;s clinical philosophy — bringing
              European standards of implantology and oral surgery to our daily practice.
            </p>
            <p>
              Every member of our team — from our specialists to our front-desk staff — shares a
              belief that dentistry should be transparent, accessible, and delivered with genuine care.
              We don&apos;t just treat teeth; we build trust.
            </p>
            <p>
              I&apos;m grateful for the support our patients have given us over the years. It is your
              confidence in us that drives us to keep improving, keep innovating, and keep showing up
              every day with the same commitment we started with.
            </p>
            <p className="font-display text-xl text-[--text-main]">
              Dr. Tith Hong Yoeu
            </p>
            <p className="text-sm text-[--text-soft]">
              Director, Roomchang Dental Hospital
            </p>
          </div>

          {/* CTA */}
          <div className="mt-14 rounded-[2rem] bg-[--brand-soft] p-8 text-center">
            <h3 className="font-display text-2xl text-[--text-main]">
              Meet the full team
            </h3>
            <p className="mt-2 text-sm text-[--text-soft]">
              Get to know the specialist dentists Dr. Tith has assembled.
            </p>
            <Link href="/team" className="btn-primary mt-5 inline-flex">
              Our Doctors
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
