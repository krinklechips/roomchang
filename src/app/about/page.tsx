import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { AboutTimeline } from "@/components/sections/about-timeline";
import { Building2, Star, Mail, Stethoscope, Heart, Handshake, ImagePlay, Cpu, ArrowRight, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Roomchang Dental Hospital",
  description:
    "Established in 1996, Roomchang Dental Hospital is Cambodia's leading dental group — multilingual, technology-first, and rooted in compassionate care.",
};

const STATS = [
  { value: "1996", label: "Year Established" },
  { value: "5", label: "Phnom Penh Branches" },
  { value: "30+", label: "Specialist Dentists" },
  { value: "58", label: "Dental Chairs" },
];

const ABOUT_SECTIONS: { title: string; description: string; href: string; icon: LucideIcon }[] = [
  {
    title: "Our Facilities",
    description:
      "A purpose-built, 10-storey dental hospital with 58 chairs, 6 surgical theatres, an in-house CAD/CAM lab, and hospital-grade sterilisation.",
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
      "CAD/CAM milling, digital intraoral scanning, Invisalign, Beyond® whitening, and the CA® proprietary clear aligner system.",
    href: "/technology",
    icon: Cpu,
  },
];

export default function AboutPage() {
  return (
    <SiteShell>
      {/* Hero */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[--brand]">
            Our Story
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">
            About Roomchang
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            Founded in 1996 by a vision to bring specialist dental care to Cambodia, Roomchang
            has grown into the country&apos;s most trusted dental group — serving local families
            and international patients from across Asia, Australia, and beyond.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--brand)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-5xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-14 pb-0 sm:px-6 sm:pt-20 lg:px-8">
        {/* History */}
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-4xl text-[--text-main]">A Hospital, Not Just a Clinic</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-[--text-soft]">
            <p>
              Roomchang Dental Hospital was built on the belief that Cambodian patients deserved
              access to the same quality of care available in the most advanced dental centres in
              the world — without having to travel abroad to get it.
            </p>
            <p>
              Over nearly three decades, we&apos;ve grown from a single practice to a
              hospital-scale group with five branches across Phnom Penh, an in-house digital
              laboratory, and a specialist team covering every major dental discipline.
            </p>
            <p>
              Today, Roomchang treats thousands of patients every month — from routine checkups to
              complex full-mouth reconstructions — and serves international visitors from more
              than 20 countries who choose Cambodia for high-quality, cost-effective dental care.
            </p>
            <p>
              Roomchang was the first dental facility in Cambodia to achieve ISO 9001 certification
              — a standard independently audited by Bureau Veritas under UKAS accreditation.
            </p>
          </div>
        </div>
      </div>

      {/* History — full-bleed timeline */}
      <AboutTimeline />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {/* Branch gallery */}
        <div className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
            5 Locations Across Phnom Penh
          </p>
          <h2 className="mt-3 font-display text-4xl text-[color:var(--text-main)]">Our Branches</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--text-soft)]">
            Each branch delivers the full range of Roomchang services — same specialist team, same
            hospital-grade equipment, same standard of care.
          </p>

          {/* Main branch — full width hero */}
          <div className="mt-8 relative overflow-hidden rounded-3xl">
            <Image
              src="/about/branch-main-exterior.jpg"
              alt="Roomchang Dental Hospital — Main Branch, Monivong Boulevard"
              width={1280}
              height={560}
              className="h-72 w-full object-cover sm:h-96 transition hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(44,26,40,0.7)] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 px-8 pb-8">
              <span className="inline-block rounded-full bg-[color:var(--brand)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white mb-3">
                Main Hospital
              </span>
              <h3 className="font-display text-3xl text-white leading-tight">
                Monivong Boulevard
              </h3>
              <p className="mt-1 text-sm text-white/80">10-storey purpose-built dental hospital · 58 chairs · 6 surgical theatres</p>
            </div>
          </div>

          {/* Other branches — 2 col */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              {
                src: "/about/branch-aeon-mall.jpg",
                label: "AEON Mall Branch",
                sublabel: "Sen Sok City — convenient for weekend appointments",
              },
              {
                src: "/about/branch-exterior-2.jpg",
                label: "Sen Sok Branch",
                sublabel: "North Phnom Penh — full range of specialist services",
              },
            ].map(({ src, label, sublabel }) => (
              <div key={src} className="relative overflow-hidden rounded-2xl">
                <Image
                  src={src}
                  alt={label}
                  width={640}
                  height={400}
                  className="h-64 w-full object-cover transition hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(44,26,40,0.7)] via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 px-6 pb-6">
                  <h3 className="font-display text-2xl text-white">{label}</h3>
                  <p className="mt-1 text-xs text-white/75">{sublabel}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional branch name pills */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
              Also at:
            </span>
            {[
              "PH Euro Park (Borey Peng Huoth)",
              "Fun Mall — TK Avenue",
            ].map((name) => (
              <span
                key={name}
                className="rounded-full border border-[color:var(--border-strong)] bg-white px-4 py-1.5 text-xs font-semibold text-[color:var(--text-soft)]"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Section cards grid */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group flex flex-col rounded-[2rem] border border-[--border-strong] bg-white p-7 shadow-[0_12px_40px_rgba(57,28,45,0.05)] transition hover:border-[--brand-light] hover:shadow-[0_16px_48px_rgba(204,55,113,0.1)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[--brand-soft] text-[--brand-deep]">
                <section.icon size={20} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-xl text-[--text-main] group-hover:text-[--brand-deep]">
                {section.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-[--text-soft]">
                {section.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[--brand-deep] transition group-hover:text-[--brand]">
                Learn more <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
