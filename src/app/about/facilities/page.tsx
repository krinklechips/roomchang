import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Facilities | Roomchang Dental Hospital",
  description:
    "Explore Roomchang's 10-storey, 3,400 m² hospital with 58 dental chairs, 6 surgical theatres, in-house CAD/CAM lab, and hospital-grade sterilisation.",
};

const BUILDING_STATS = [
  { value: "10", label: "Storey Building" },
  { value: "3,400 m²", label: "Clinical Space" },
  { value: "58", label: "Dental Chairs" },
  { value: "6", label: "Surgical Theatres" },
];

const FACILITY_SECTIONS = [
  {
    title: "In-House Digital Laboratory",
    items: [
      "Digital intraoral scanners",
      "CAD/CAM milling technology from Germany",
      "3D printers for precision restorations",
      "CA® proprietary clear aligner lab",
      "Same-day crown fabrication capability",
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
      "Hospital-grade autoclave sterilisation at 134°C",
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
      "Electronic Medical Record (EMR) system — fully paperless",
      "Underground parking for 15 vehicles",
      "Full wheelchair accessibility",
      "Multilingual staff: Khmer, English, French, Chinese, Japanese, Malay",
    ],
  },
];

export default function FacilitiesPage() {
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
            Our Facilities
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            A purpose-built, 10-storey dental hospital in the heart of Phnom Penh — equipped with
            advanced digital technology from Germany and hospital-grade sterilisation throughout.
          </p>
        </div>
      </div>

      {/* Building stats */}
      <div className="border-b border-[--border-strong] bg-[--brand]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {BUILDING_STATS.map((stat) => (
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
        <div className="grid gap-8 sm:grid-cols-2">
          {FACILITY_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-[2rem] border border-[--border-strong] bg-white p-8 shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
            >
              <h2 className="font-display text-2xl text-[--text-main]">{section.title}</h2>
              <ul className="mt-5 space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-6 text-[--text-soft]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[--brand-soft] text-[--brand-deep]">
                      <Check size={11} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ISO callout */}
        <div className="mt-12 rounded-[2rem] bg-[--brand-soft] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[--brand-deep]">
                Quality Assurance
              </p>
              <h2 className="mt-2 font-display text-3xl text-[--text-main]">
                ISO 9001:2015 Certified
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-[--text-soft]">
                Roomchang was the first dental facility in Cambodia to achieve ISO 9001 certification —
                independently audited by Bureau Veritas under UKAS accreditation.
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
