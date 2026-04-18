import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/components/site/site-shell";
import { Check, ArrowRight } from "lucide-react";
import { getTechnology } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technology | Roomchang Dental Hospital",
  description:
    "Roomchang Dental Hospital uses the latest in digital dentistry — CAD/CAM milling, CBCT imaging, CA® Clear Aligners, and advanced sterilisation systems.",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Orthodontics":      "bg-[color:var(--brand)]",
  "Lab & Restoration": "bg-[color:var(--brand-deep)]",
  "Cosmetic":          "bg-[linear-gradient(135deg,var(--brand),var(--brand-deep))]",
  "Infection Control": "bg-[color:var(--brand-deep)]",
  "Diagnostics":       "bg-[color:var(--brand)]",
};

const HERO_TRUST = [
  { value: "CAD/CAM", label: "In-house Lab" },
  { value: "3D",      label: "CBCT Imaging" },
  { value: "CA®",     label: "Clear Aligners" },
  { value: "ISO",     label: "Sterilisation" },
];

export default async function TechnologyPage() {
  const technologies = await getTechnology();

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
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
          <div className="hidden lg:flex lg:justify-end">
            <div className="grid grid-cols-2 gap-3">
              {HERO_TRUST.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[color:var(--border-strong)] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(57,28,45,0.06)]">
                  <p className="font-display text-2xl text-[color:var(--brand-deep)]">{item.value}</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Technology list */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="space-y-10">
          {technologies.map((tech, i) => (
            <article
              key={tech.id}
              className={`grid gap-0 overflow-hidden rounded-3xl border border-[--border-strong] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)] lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>:first-child]:order-2" : ""
              }`}
            >
              {/* Image or gradient placeholder */}
              {tech.imageSrc ? (
                <div className="flex items-center justify-center overflow-hidden bg-[color:var(--surface)] p-6 lg:p-8">
                  <Image
                    src={tech.imageSrc}
                    alt={tech.name}
                    width={700}
                    height={500}
                    className="w-full h-auto max-h-[22rem] rounded-xl object-contain"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
              ) : (
                <div className={`min-h-[18rem] lg:min-h-[24rem] flex items-center justify-center ${CATEGORY_COLORS[tech.category] ?? "bg-[--surface-strong]"}`}>
                  <span className="font-display text-[4rem] font-bold text-white/30 select-none">
                    {tech.name.charAt(0)}
                  </span>
                </div>
              )}

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
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[--brand-soft] text-[--brand-deep]">
                        <Check size={11} strokeWidth={3} aria-hidden="true" />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
                {tech.slug ? (
                  <Link
                    href={`/technology/${tech.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[--brand-deep] transition hover:text-[--brand]"
                  >
                    Learn more <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                  </Link>
                ) : (
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[--brand-deep] transition hover:text-[--brand]"
                  >
                    Ask about this <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-start gap-6 rounded-3xl border border-[--border-strong] bg-[--surface] p-10 sm:flex-row sm:items-center sm:justify-between sm:p-12">
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
