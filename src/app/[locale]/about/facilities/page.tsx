import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, ArrowRight, Check, MapPin, Clock, Phone as PhoneIcon } from "lucide-react";
import { supabaseServer } from "@/lib/supabase-server";
import { BRANCHES } from "@/lib/branches";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Facilities | Roomchang Dental Hospital",
  description:
    "Explore Roomchang's 10-storey hospital with 46 dental chairs, 9 operation rooms, in-house CAD/CAM lab, and hospital-grade sterilisation.",
};

type DisplayStat = { display_value: string; label: string };

const FALLBACK_STATS: Record<string, DisplayStat> = {
  building_storeys: { display_value: "10", label: "Storey Building" },
  dental_chairs: { display_value: "46", label: "Dental Chairs" },
  surgical_theatres: { display_value: "9", label: "Operation Rooms" },
  specialist_dentists: { display_value: "37", label: "Specialist Dentists" },
};

const FACILITY_SECTIONS = [
  {
    title: "In-House Digital Laboratory",
    items: [
      "Digital intraoral scanners",
      "CAD/CAM technology from Germany",
      "3D printers for precision restorations",
      "Clear Aligner (CA) fabrication",
    ],
  },
  {
    title: "Diagnostic Imaging",
    items: [
      "3D cone-beam CT imaging (CBCT)",
      "Digital panoramic X-ray (OPG)",
      "Cephalometric radiography",
      "Digital periapical and bitewing X-rays",
    ],
  },
  {
    title: "Sterilisation & Infection Control",
    items: [
      "Hospital-grade autoclave sterilisation",
      "High-pressure saturated steam processing",
      "All instruments sterilised for invasive and non-invasive procedures",
      "Daily cleaning and disinfection of the entire hospital",
      "Strict cross-infection control protocols",
    ],
  },
  {
    title: "Patient Comfort & Access",
    items: [
      "Dedicated children's treatment rooms",
      "Beyond® professional whitening system",
      "Electronic Medical Record (EMR) system",
      "Underground parking for 15 vehicles",
      "Full wheelchair accessibility",
      "Multilingual staff: Khmer, English, French, Chinese, Japanese, German",
    ],
  },
];

const GALLERY_INTERIOR = [
  { src: "/facilities/facility-treatment-abroad.jpg",      alt: "Roomchang treatment room — international patient care" },
  { src: "/facilities/facility-room-a.jpg",                alt: "Roomchang dental chair and treatment suite" },
  { src: "/facilities/facility-room-b.jpg",                alt: "Modern dental treatment room at Roomchang" },
  { src: "/facilities/facility-room-c.jpg",                alt: "Specialist dental suite with advanced equipment" },
  { src: "/facilities/treatment-room-1.jpg",               alt: "Treatment room at Roomchang Dental Hospital" },
  { src: "/facilities/international-patient-consultation.jpg", alt: "International patient consultation at Roomchang" },
];

export default async function FacilitiesPage() {
  const { data: statsData, error } = await supabaseServer
    .from("site_stats")
    .select("key, display_value, label")
    .order("sort_order");

  if (error) {
    console.error("[FacilitiesPage] site_stats fetch failed:", error.message);
  }

  const stat = (key: string) =>
    statsData?.find((s) => s.key === key) ?? FALLBACK_STATS[key] ?? { display_value: "—", label: key };

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> About
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            Our Facilities
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            A purpose-built, 10-storey dental hospital in the heart of Phnom Penh — equipped with
            advanced digital technology from Germany and hospital-grade sterilisation throughout.
          </p>
        </div>
      </div>

      {/* Building stats — fix: use [color:var(--brand)] not [--brand] */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--brand)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              stat("building_storeys"),
              stat("dental_chairs"),
              stat("surgical_theatres"),
              stat("specialist_dentists"),
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-5xl font-bold text-white">{stat.display_value}</p>
                <p className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Building hero — full-bleed tall portrait */}
      <div className="border-b border-[color:var(--border-strong)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
            {/* Tall building portrait */}
            <div className="relative overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(57,28,45,0.12)]">
              <Image
                src="/facilities/EDJI_0381.jpg"
                alt="Roomchang Dental Hospital — 10-storey building, Sisowath High School, Phnom Penh"
                width={769}
                height={1280}
                className="h-full w-full object-cover object-center"
                style={{ minHeight: "480px" }}
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(44,26,40,0.7)] to-transparent px-6 pb-6 pt-16">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Main Hospital</p>
                <p className="mt-1 font-display text-2xl text-white">10-Storey Building</p>
                <p className="mt-0.5 text-xs text-white/60">No. 4, Street 184, Khan Daun Penh, Phnom Penh</p>
              </div>
            </div>

            {/* Interior photo grid — 3-col × 2-row, uniform aspect ratio */}
            <div className="grid grid-cols-3 gap-3">
              {GALLERY_INTERIOR.map(({ src, alt }) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover transition duration-500 hover:scale-[1.04]"
                    sizes="(min-width: 1280px) 220px, (min-width: 1024px) 180px, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          {FACILITY_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-3xl border border-[color:var(--border-strong)] bg-white p-8 shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
            >
              <h2 className="font-display text-2xl text-[color:var(--text-main)]">{section.title}</h2>
              <ul className="mt-5 space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[color:var(--text-soft)]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                      <Check size={11} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Our Locations */}
        <div className="mt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
            Our Locations
          </p>
          <h2 className="mt-3 font-display text-4xl text-[color:var(--text-main)] sm:text-5xl">
            Five Branches Across Phnom Penh
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--text-soft)]">
            Every Roomchang branch delivers the same specialist care and hospital-grade standards —
            with the same team quality, equipment, and sterilisation protocols.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BRANCHES.map((branch) => (
              <div
                key={branch.slug}
                className="flex flex-col rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_12px_40px_rgba(57,28,45,0.05)] overflow-hidden"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={branch.imageSrc}
                    alt={branch.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-deep)] backdrop-blur-sm">
                      {branch.badge}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg text-[color:var(--text-main)]">{branch.name}</h3>
                  <p className="mt-2 text-xs leading-5 text-[color:var(--text-soft)]">{branch.description}</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-start gap-2 text-xs text-[color:var(--text-soft)]">
                      <MapPin size={13} strokeWidth={2} className="mt-0.5 shrink-0 text-[color:var(--brand)]" aria-hidden="true" />
                      <span>{branch.address}{branch.addressLine2 ? `, ${branch.addressLine2}` : ""}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[color:var(--text-soft)]">
                      <Clock size={13} strokeWidth={2} className="shrink-0 text-[color:var(--brand)]" aria-hidden="true" />
                      <span>{branch.hours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[color:var(--text-soft)]">
                      <PhoneIcon size={13} strokeWidth={2} className="shrink-0 text-[color:var(--brand)]" aria-hidden="true" />
                      <span>{branch.phone}</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-5">
                    <Link
                      href={`/about/branches/${branch.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--brand-deep)] transition hover:text-[color:var(--brand)]"
                    >
                      Discover This Location <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality callout */}
        <div className="mt-16 rounded-3xl bg-[color:var(--brand-soft)] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand-deep)]">
                Quality Assurance
              </p>
              <h2 className="mt-2 font-display text-3xl text-[color:var(--text-main)]">
                Hospital-Grade Standards
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-[color:var(--text-soft)]">
                Roomchang follows strict sterilisation, infection control, and clinical protocols —
                the same standards expected of leading international dental hospitals.
              </p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0">
              Book a Tour
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
