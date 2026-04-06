import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community & Charity | Roomchang Dental Hospital",
  description:
    "Roomchang's charity missions bring free dental care to underserved communities across Cambodia — mobile clinics, blood drives, and oral health education.",
};

const PROGRAMS = [
  {
    title: "Mobile Dental Clinic",
    description:
      "A fully equipped mobile clinic that delivers essential dental care to rural Cambodia. Volunteer dentists and clinical staff provide all services free of charge to communities that would otherwise have no access to dental treatment.",
    highlight: "160+ children treated in a single visit to Battambang — 16 dentists and support staff.",
  },
  {
    title: "Blood Donation Drives",
    description:
      "Annual blood donation initiatives organised in collaboration with the National Blood Center. Staff volunteers participate each year, with campaigns supporting Kantha Bopha Children's Hospital and the broader national blood supply.",
    highlight: "29 staff volunteers mobilised for the 29th anniversary drive alone.",
  },
  {
    title: "Oral Health Education",
    description:
      "Our clinical fellows and dental assistants visit schools and orphanages across Phnom Penh to teach children proper oral hygiene — including toothbrushing technique and dietary advice — and provide free toothbrushes and supplies.",
    highlight: "Ongoing partnerships with Footprints International School and RHB Indochina Bank.",
  },
  {
    title: "COVID-19 Response",
    description:
      "During the pandemic, Roomchang donated protective equipment and financial contributions to Cambodia's national response efforts, supporting healthcare workers on the front line.",
    highlight: null,
  },
];

export default function CommunityPage() {
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
            Community & Charity
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            Dental care shouldn&apos;t be a luxury. Our charity missions bring free treatment to
            underserved communities across Cambodia — schools, rural provinces, and urban
            neighbourhoods that lack access to dental services.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {PROGRAMS.map((program) => (
            <div
              key={program.title}
              className="flex flex-col rounded-[2rem] border border-[--border-strong] bg-white p-8 shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
            >
              <h2 className="font-display text-2xl text-[--text-main]">{program.title}</h2>
              <p className="mt-4 flex-1 text-sm leading-7 text-[--text-soft]">{program.description}</p>
              {program.highlight && (
                <p className="mt-4 rounded-xl bg-[--brand-soft] px-4 py-3 text-xs font-semibold text-[--brand-deep]">
                  {program.highlight}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-[2rem] bg-[--brand-soft] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[--text-main]">Partner With Us</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-[--text-soft]">
                If your organisation would like to support or co-sponsor a charity dental mission,
                we&apos;d love to hear from you.
              </p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0">
              Get In Touch
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
