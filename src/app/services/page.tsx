import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dental Services | Roomchang Dental Hospital",
  description:
    "Comprehensive dental treatments at Roomchang — from implants and crowns to orthodontics, cosmetic dentistry, and oral surgery in Phnom Penh.",
};

// CMS-ready stub: replace with API fetch when CMS is live
const SERVICE_CATEGORIES = [
  {
    id: "implants",
    title: "Dental Implants",
    description:
      "Permanent tooth replacement using titanium implants. Single implants, implant bridges, and All-on-4, 6 & 8 full-arch solutions available.",
    tags: ["Single Implant", "Implant Bridge", "All-on-4", "All-on-6", "All-on-8"],
    href: "/contact",
    icon: "🦷",
  },
  {
    id: "crowns",
    title: "Crowns & Bridges",
    description:
      "High-strength E-Max and zirconia crowns with digital design and in-house milling for precision fit and natural appearance.",
    tags: ["E-Max Crown", "Zirconia", "CAD/CAM Milled"],
    href: "/contact",
    icon: "✦",
  },
  {
    id: "orthodontics",
    title: "Orthodontics",
    description:
      "Straighten teeth discreetly with our CA® Clear Aligner, Invisalign, or traditional metal and ceramic braces.",
    tags: ["CA® Clear Aligner", "Invisalign", "Metal Braces", "Ceramic Braces"],
    href: "/contact",
    icon: "◎",
  },
  {
    id: "cosmetic",
    title: "Cosmetic Dentistry",
    description:
      "Transform your smile with porcelain veneers, teeth whitening, smile design, and aesthetic composite bonding.",
    tags: ["Veneers", "Teeth Whitening", "Smile Design", "Bonding"],
    href: "/contact",
    icon: "✶",
  },
  {
    id: "reconstruction",
    title: "Full Mouth Reconstruction",
    description:
      "Comprehensive treatment planning for patients who need to restore or rebuild the entire mouth using a combination of advanced techniques.",
    tags: ["Full Arch", "Combined Treatment", "Digital Planning"],
    href: "/contact",
    icon: "⊕",
  },
  {
    id: "surgery",
    title: "Oral Surgery",
    description:
      "Wisdom tooth extraction, bone grafting, sinus lifts, and other surgical procedures performed by our specialist oral surgeons.",
    tags: ["Wisdom Tooth", "Bone Graft", "Sinus Lift", "Extraction"],
    href: "/contact",
    icon: "⚕",
  },
  {
    id: "pediatric",
    title: "Pediatric Dentistry",
    description:
      "Child-friendly dental care from infancy through adolescence. Preventive care, fillings, sealants, and early orthodontic assessment.",
    tags: ["Children", "Preventive", "Sealants", "Early Orthodontics"],
    href: "/contact",
    icon: "♡",
  },
  {
    id: "sleep",
    title: "Sleep Apnea & Snoring",
    description:
      "Non-surgical oral appliance therapy and splints to reduce snoring and treat mild-to-moderate obstructive sleep apnea.",
    tags: ["Oral Appliance", "Sleep Splint", "Non-surgical"],
    href: "/contact",
    icon: "◐",
  },
  {
    id: "abroad",
    title: "Dental Treatment Abroad",
    description:
      "Full coordination for international patients — treatment planning, airport transfers, accommodation links, and multilingual support.",
    tags: ["International", "Treatment Planning", "Multilingual"],
    href: "/international",
    icon: "✈",
  },
];

export default function ServicesPage() {
  return (
    <SiteShell>
      {/* Page header */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[--brand]">
            What We Treat
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">
            Dental Services
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            Roomchang offers hospital-level dental care across all major specialties. Whether
            you&apos;re visiting from Phnom Penh or travelling from overseas, our multilingual team
            is here to guide you through every step.
          </p>
        </div>
      </div>

      {/* Services grid */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_CATEGORIES.map((service) => (
            <article
              key={service.id}
              className="group flex flex-col overflow-hidden rounded-[2rem] border border-[--border-strong] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(57,28,45,0.1)]"
            >
              <div className="flex items-center gap-4 border-b border-[--border-strong] px-6 py-5">
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[--surface-strong] text-xl text-[--brand-deep]"
                  aria-hidden="true"
                >
                  {service.icon}
                </span>
                <h2 className="font-display text-[1.5rem] leading-tight text-[--text-main]">
                  {service.title}
                </h2>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <p className="flex-1 text-sm leading-7 text-[--text-soft]">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[--brand-soft] px-3 py-1 text-[0.7rem] font-semibold text-[--brand-deep]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[--brand-deep] transition hover:text-[--brand]"
                >
                  Enquire about this treatment
                  <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* CTA band */}
      <div className="border-t border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[--text-main]">Not sure which treatment?</h2>
              <p className="mt-2 text-sm leading-7 text-[--text-soft]">
                Send us a message or call and our team will help you find the right path.
              </p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0">
              Request a Consultation
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
