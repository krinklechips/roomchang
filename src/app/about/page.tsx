import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Roomchang Dental Hospital",
  description:
    "Established in 1996, Roomchang Dental Hospital is Cambodia's leading dental group practice — multilingual, technology-first, and rooted in compassionate care.",
};

const STATS = [
  { value: "1996", label: "Year Established" },
  { value: "5", label: "Phnom Penh Branches" },
  { value: "30+", label: "Specialist Dentists" },
  { value: "6", label: "Languages Spoken" },
];

const VALUES = [
  {
    title: "Patient First",
    description:
      "Every decision — from treatment planning to the design of our waiting rooms — starts by asking what's best for the patient.",
  },
  {
    title: "Clinical Excellence",
    description:
      "We invest continuously in education, certification, and technology to ensure our standards match international best practice.",
  },
  {
    title: "Transparency",
    description:
      "Clear pricing, honest treatment options, and no hidden fees. We believe informed patients make the best decisions.",
  },
  {
    title: "Community",
    description:
      "Through charity missions and free treatment programs, Roomchang gives back to the communities of Phnom Penh.",
  },
];

const FACILITIES = [
  "Hospital-grade sterilisation systems",
  "In-house dental laboratory with CAD/CAM milling",
  "3D cone-beam CT imaging (CBCT)",
  "Digital intraoral scanners",
  "Beyond® professional whitening system",
  "CA® proprietary clear aligner lab",
  "Dedicated children's treatment rooms",
  "Private consultation suites",
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
      <div className="border-b border-[--border-strong] bg-[--brand]">
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

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {/* History */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
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
                Today, Roomchang treats thousands of patients each year — from routine checkups to
                complex full-mouth reconstructions — and serves international visitors from more
                than 20 countries who choose Cambodia for high-quality, cost-effective dental care.
              </p>
            </div>
          </div>

          {/* Facilities list */}
          <div className="rounded-[2rem] border border-[--border-strong] bg-[--surface] p-8">
            <h3 className="font-display text-2xl text-[--text-main]">Our Facilities</h3>
            <ul className="mt-5 space-y-3">
              {FACILITIES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[--text-soft]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[--brand-soft] text-[--brand-deep] text-[0.65rem] font-bold">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Values */}
        <div className="mt-20">
          <h2 className="font-display text-4xl text-[--text-main]">Vision, Mission & Values</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[--text-soft]">
            Four principles shape every interaction at Roomchang, from how we design treatments to
            how we answer the phone.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <div
                key={value.title}
                className="rounded-[1.75rem] border border-[--border-strong] bg-white p-6 shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
              >
                <h3 className="font-display text-2xl text-[--brand-deep]">{value.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[--text-soft]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community */}
        <div className="mt-20 rounded-[2rem] bg-[--brand-soft] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
            <div className="flex-1">
              <h2 className="font-display text-4xl text-[--text-main]">Roomchang In The Community</h2>
              <p className="mt-4 text-sm leading-7 text-[--text-soft]">
                Dental care shouldn&apos;t be a luxury. Our charity missions bring free treatment to
                underserved communities across Cambodia — schools, rural provinces, and urban
                neighbourhoods that lack access to dental services. Each year, our volunteer teams
                treat hundreds of patients who could not otherwise afford care.
              </p>
            </div>
            <div className="shrink-0">
              <Link href="/contact" className="btn-primary">
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
