import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { AboutTimeline } from "@/components/sections/about-timeline";
import { Building2, Star, Mail, Stethoscope, Heart, Handshake, ImagePlay, Cpu, Briefcase, ArrowRight, type LucideIcon } from "lucide-react";
import { supabaseServer } from "@/lib/supabase-server";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us | Roomchang Dental Hospital",
  description:
    "Established in 1996, Roomchang Dental Hospital is Cambodia's leading dental group — multilingual, technology-first, and rooted in compassionate care.",
};

type DisplayStat = { display_value: string; label: string };

const FALLBACK_STATS: Record<string, DisplayStat> = {
  year_established: { display_value: "1996", label: "Year Established" },
  branches_count: { display_value: "5", label: "Phnom Penh Branches" },
  specialist_dentists: { display_value: "37", label: "Specialist Dentists" },
  dental_chairs: { display_value: "74", label: "Dental Chairs across 5 branches" },
};

const ABOUT_SECTIONS: { title: string; description: string; href: string; icon: LucideIcon }[] = [
  {
    title: "Our Facilities",
    description:
      "A purpose-built, 10-storey dental hospital with 46 dental chairs, 4 operation rooms, an in-house CAD/CAM lab, and hospital-grade sterilisation.",
    href: "/about/facilities",
    icon: Building2,
  },
  {
    title: "Vision, Mission & Values",
    description:
      "Enriching lives with quality dentistry — guided by professionalism, honesty, teamwork, innovation, and excellence.",
    href: "/about/vision-mission-values",
    icon: Star,
  },
  {
    title: "Message from Our Director",
    description:
      "A personal message from Dr. Tith Hong Yoeu, DDS, MSc. — Founder & Director — on Roomchang's commitment to quality care.",
    href: "/about/director-message",
    icon: Mail,
  },
  {
    title: "Our Doctors",
    description:
      "Meet the specialist team — multilingual experts in implants, orthodontics, cosmetic dentistry, paediatrics, and more.",
    href: "/team",
    icon: Stethoscope,
  },
  {
    title: "Community & Charity",
    description:
      "Free dental care for underserved communities — mobile clinics, blood drives, and oral health education across Cambodia.",
    href: "/about/community",
    icon: Heart,
  },
  {
    title: "Corporate Partnerships",
    description:
      "Trusted by 50+ banks, schools, insurers, and organisations to deliver dental benefits for employees and members.",
    href: "/about/partnerships",
    icon: Handshake,
  },
  {
    title: "Clinical Results",
    description:
      "See real before-and-after cases — dental implants, smile makeovers, orthodontics, and full-mouth reconstructions.",
    href: "/clinical-results",
    icon: ImagePlay,
  },
  {
    title: "Technology",
    description:
      "CAD/CAM technology, digital intraoral scanning, Invisalign, Beyond® whitening, and the Clear Aligner (CA) system.",
    href: "/technology",
    icon: Cpu,
  },
  {
    title: "Employment Opportunities",
    description:
      "Join Cambodia's leading dental group — clinical fellowships, dental assistant, dentist, and customer service positions available.",
    href: "/about/careers",
    icon: Briefcase,
  },
];

export default async function AboutPage() {
  const { data: statsData, error } = await supabaseServer
    .from("site_stats")
    .select("key, display_value, label")
    .order("sort_order");

  if (error) {
    console.error("[AboutPage] site_stats fetch failed:", error.message);
  }

  const stat = (key: string) =>
    statsData?.find((s) => s.key === key) ?? FALLBACK_STATS[key] ?? { display_value: "—", label: key };

  return (
    <SiteShell>
      {/* Hero */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
              Our Story
            </p>
            <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
              About Roomchang
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
              Founded in 1996 by a vision to bring specialist dental care to Cambodia, Roomchang
              has grown into the country&apos;s most trusted dental group — serving local families
              and international patients from across Asia, Australia, and beyond.
            </p>
          </div>
          <div className="hidden lg:flex lg:justify-end">
            <div className="grid grid-cols-2 gap-3">
              {[
                stat("year_established"),
                stat("branches_count"),
                stat("specialist_dentists"),
                stat("dental_chairs"),
              ].map((item, i) => (
                <div key={`${item.label}-${i}`} className="rounded-2xl border border-[color:var(--border-strong)] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(57,28,45,0.06)]">
                  <p className="font-display text-2xl text-[color:var(--brand-deep)]">{item.display_value}</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--brand)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              stat("year_established"),
              stat("branches_count"),
              stat("specialist_dentists"),
              stat("dental_chairs"),
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-display text-5xl font-bold text-white">{item.display_value}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-14 pb-14 sm:px-6 sm:pt-20 sm:pb-20 lg:px-8">
        {/* History */}
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-4xl text-[color:var(--text-main)]">A Hospital, Not Just a Clinic</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-[color:var(--text-soft)]">
            <p>
              Roomchang Dental Hospital was built on the belief that Cambodian patients deserved
              access to the same quality of care available in the most advanced dental centres in
              the world — without having to travel abroad to get it.
            </p>
            <p>
              Over nearly 30 years, we&apos;ve grown from a single practice to a
              hospital-scale group with five branches across Phnom Penh, an in-house digital
              laboratory, and a specialist team covering every major dental discipline.
            </p>
            <p>
              Today, Roomchang treats thousands of patients every month — from routine checkups to
              complex full-mouth reconstructions — and serves international visitors from more
              than 20 countries who choose Cambodia for high-quality, cost-effective dental care
              delivered to the same standards as leading clinics abroad.
            </p>
          </div>
        </div>
      </div>

      {/* History — full-bleed timeline */}
      <AboutTimeline />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {/* Section cards grid */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group flex flex-col rounded-3xl border border-[color:var(--border-strong)] bg-white p-7 shadow-[0_12px_40px_rgba(57,28,45,0.05)] transition hover:border-[color:var(--brand-light)] hover:shadow-[0_16px_48px_rgba(204,55,113,0.1)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                <section.icon size={20} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-xl text-[color:var(--text-main)] group-hover:text-[color:var(--brand-deep)]">
                {section.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[color:var(--text-soft)]">
                {section.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--brand-deep)] transition group-hover:text-[color:var(--brand)]">
                Learn more <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
