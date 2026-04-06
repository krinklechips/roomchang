import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, GraduationCap, Handshake, Users, Lightbulb, Award, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vision, Mission & Values | Roomchang Dental Hospital",
  description:
    "Roomchang's vision: enriching lives with quality dentistry. Five core values guide everything we do — professionalism, honesty, teamwork, innovation, and excellence.",
};

const VALUES: { title: string; Icon: LucideIcon; description: string }[] = [
  {
    title: "Professionalism",
    Icon: GraduationCap,
    description:
      "Our team holds international qualifications and operates to the highest clinical standards — backed by ISO 9001:2015 certification.",
  },
  {
    title: "Honesty",
    Icon: Handshake,
    description:
      "Clear pricing, transparent treatment options, and no hidden fees. We believe informed patients make the best decisions.",
  },
  {
    title: "Teamwork",
    Icon: Users,
    description:
      "A collaborative environment where specialists across disciplines work together to deliver the best outcome for every patient.",
  },
  {
    title: "Innovation",
    Icon: Lightbulb,
    description:
      "We invest continuously in technology — from CAD/CAM digital labs to 3D CBCT imaging — to stay at the forefront of dentistry.",
  },
  {
    title: "Excellence",
    Icon: Award,
    description:
      "From routine check-ups to complex full-mouth reconstructions, we hold ourselves to the same standard of excellence every time.",
  },
];

export default function VisionMissionValuesPage() {
  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[--brand] transition hover:text-[--brand-deep]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> About
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">
            Vision, Mission & Values
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            The principles that have guided Roomchang since 1996 — and continue to shape every
            consultation, treatment plan, and patient interaction.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {/* Vision & Mission */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-[2rem] border border-[--border-strong] bg-white p-10 shadow-[0_12px_40px_rgba(57,28,45,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[--brand]">Vision</p>
            <p className="mt-4 font-display text-4xl leading-tight text-[--text-main]">
              Enriching lives with quality dentistry.
            </p>
            <p className="mt-4 text-sm leading-7 text-[--text-soft]">
              We see a Cambodia where every person has access to world-class dental care — and where
              choosing local doesn&apos;t mean compromising on quality.
            </p>
          </div>
          <div className="rounded-[2rem] border border-[--border-strong] bg-white p-10 shadow-[0_12px_40px_rgba(57,28,45,0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[--brand]">Mission</p>
            <p className="mt-4 font-display text-4xl leading-tight text-[--text-main]">
              We truly care for your teeth.
            </p>
            <p className="mt-4 text-sm leading-7 text-[--text-soft]">
              Every treatment plan is designed around the patient — not the procedure. We listen,
              educate, and deliver care that respects your time, your budget, and your goals.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mt-20">
          <h2 className="font-display text-4xl text-[--text-main]">Our Core Values</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[--text-soft]">
            Five principles shape every interaction at Roomchang, from how we design treatments to
            how we answer the phone.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-[1.75rem] border border-[--border-strong] bg-white p-6 shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[--brand-soft] text-[--brand-deep]">
                  <value.Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                </span>
                <h3 className="mt-3 font-display text-2xl text-[--brand-deep]">{value.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[--text-soft]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-[2rem] bg-[--brand-soft] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[--text-main]">See our values in action</h2>
              <p className="mt-2 text-sm leading-7 text-[--text-soft]">
                Meet the specialist team that brings these principles to life every day.
              </p>
            </div>
            <Link href="/team" className="btn-primary shrink-0">
              Meet Our Doctors
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
