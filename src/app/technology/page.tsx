import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technology | Roomchang Dental Hospital",
  description:
    "Roomchang Dental Hospital uses the latest in digital dentistry — CAD/CAM milling, CBCT imaging, CA® Clear Aligners, and advanced sterilisation systems.",
};

// CMS-ready stub: replace with API fetch when CMS is live
const TECHNOLOGIES = [
  {
    id: "ca-aligner",
    name: "CA® Clear Aligner",
    category: "Orthodontics",
    description:
      "Roomchang's proprietary clear aligner system — designed, fabricated, and fitted in-house. CA® allows complete control over the aligner design and material quality, with faster turnaround than imported systems.",
    highlights: [
      "Designed and produced in-house",
      "Custom-fit for each patient's anatomy",
      "Discreet, removable, and comfortable",
      "Shorter lead times vs. third-party systems",
    ],
    imageSrc: "/hero/roomchang-clear-aligner.jpg",
  },
  {
    id: "cadcam",
    name: "CAD/CAM Digital Dentistry",
    category: "Lab & Restoration",
    description:
      "Computer-aided design and manufacturing allows Roomchang to digitally design and mill crowns, bridges, and prosthetics in-house with sub-millimetre precision. This reduces turnaround time and eliminates traditional impression errors.",
    highlights: [
      "In-house digital milling unit",
      "Precision fit for crowns, bridges, and veneers",
      "Reduces multi-visit workflows",
      "Full digital treatment records",
    ],
    imageSrc: "/hero/roomchang-digital-lab.jpeg",
  },
  {
    id: "invisalign",
    name: "Invisalign Clear Aligners",
    category: "Orthodontics",
    description:
      "As an authorised Invisalign provider, Roomchang offers the globally-recognised aligner system for patients who prefer a brand-specific solution. Our orthodontists are trained and certified by Align Technology.",
    highlights: [
      "Authorised Invisalign provider",
      "Certified orthodontists on staff",
      "SmileView digital preview available",
      "Suitable for mild to complex cases",
    ],
    imageSrc: null,
  },
  {
    id: "beyond",
    name: "Beyond® Teeth Whitening",
    category: "Cosmetic",
    description:
      "The Beyond Whitening Accelerator uses a high-intensity light source combined with a professional-grade bleaching agent to whiten teeth by up to 14 shades in a single session — safely and without sensitivity.",
    highlights: [
      "Up to 14 shades in one session",
      "FDA-cleared technology",
      "Safe for enamel",
      "Minimal post-treatment sensitivity",
    ],
    imageSrc: null,
  },
  {
    id: "sterilisation",
    name: "Hospital-Grade Sterilisation",
    category: "Infection Control",
    description:
      "Roomchang operates autoclave sterilisation systems that exceed standard dental clinic requirements — matching the infection control protocols used in surgical hospitals. All instruments are tracked through a sterile processing workflow.",
    highlights: [
      "Class B autoclave systems",
      "Instrument tracking per patient",
      "Single-use disposables where applicable",
      "Regular third-party audit",
    ],
    imageSrc: null,
  },
  {
    id: "cbct",
    name: "3D CBCT Imaging",
    category: "Diagnostics",
    description:
      "Cone-beam computed tomography gives Roomchang's implantologists and oral surgeons a full three-dimensional view of bone structure, nerve pathways, and sinus anatomy — enabling safer, more predictable surgery.",
    highlights: [
      "3D bone structure mapping",
      "Nerve and sinus visualisation",
      "Implant placement simulation",
      "Low-dose radiation protocol",
    ],
    imageSrc: null,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Orthodontics": "bg-[linear-gradient(135deg,#a22f7b,#8c2a8d)]",
  "Lab & Restoration": "bg-[linear-gradient(135deg,#0fa5a4,#0b8b8a)]",
  "Cosmetic": "bg-[linear-gradient(135deg,#c76ad7,#a750b7)]",
  "Infection Control": "bg-[linear-gradient(135deg,#1592db,#0e7cc7)]",
  "Diagnostics": "bg-[linear-gradient(135deg,#6cab18,#5a9514)]",
};

export default function TechnologyPage() {
  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[--brand]">
            Precision & Innovation
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">
            Our Technology
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            Roomchang invests continuously in the tools and systems that make dental care safer,
            faster, and more precise. From in-house aligner fabrication to 3D surgical planning,
            technology is at the core of how we work.
          </p>
        </div>
      </div>

      {/* Technology list */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="space-y-10">
          {TECHNOLOGIES.map((tech, i) => (
            <article
              key={tech.id}
              className={`grid gap-0 overflow-hidden rounded-[2rem] border border-[--border-strong] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)] lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>:first-child]:order-2" : ""
              }`}
            >
              {/* Image or placeholder */}
              <div
                className={`min-h-[18rem] lg:min-h-[24rem] ${
                  tech.imageSrc
                    ? "bg-cover bg-center"
                    : `${CATEGORY_COLORS[tech.category] ?? "bg-[--surface-strong]"} flex items-center justify-center`
                }`}
                style={tech.imageSrc ? { backgroundImage: `url(${tech.imageSrc})` } : {}}
              >
                {!tech.imageSrc && (
                  <span className="font-display text-[4rem] font-bold text-white/30 select-none">
                    {tech.name.charAt(0)}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center gap-5 p-8 sm:p-10">
                <div>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-white ${CATEGORY_COLORS[tech.category] ?? "bg-[--brand]"}`}
                  >
                    {tech.category}
                  </span>
                </div>
                <h2 className="font-display text-3xl leading-tight text-[--text-main] sm:text-4xl">
                  {tech.name}
                </h2>
                <p className="text-sm leading-7 text-[--text-soft]">{tech.description}</p>
                <ul className="space-y-2">
                  {tech.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2.5 text-sm text-[--text-main]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[--brand-soft] text-[--brand-deep] text-[0.6rem] font-bold">
                        ✓
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[--brand-deep] transition hover:text-[--brand]"
                >
                  Ask about this technology →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-start gap-6 rounded-[2rem] border border-[--border-strong] bg-[--surface] p-10 sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <div>
            <h2 className="font-display text-3xl text-[--text-main]">See it in person</h2>
            <p className="mt-2 text-sm leading-7 text-[--text-soft]">
              Book a consultation and our team will walk you through exactly what technology
              applies to your treatment.
            </p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">
            Book a Consultation
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
