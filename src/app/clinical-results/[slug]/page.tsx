import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import { CLINICAL_CASES, getCaseBySlug } from "@/lib/clinical-cases";
import type { Metadata } from "next";

export function generateStaticParams() {
  return CLINICAL_CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return {};
  return {
    title: `${c.title} | Clinical Results | Roomchang Dental Hospital`,
    description: c.description,
  };
}

export default async function ClinicalCaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) notFound();

  // Adjacent cases for prev/next navigation
  const allCases = CLINICAL_CASES;
  const idx = allCases.findIndex((x) => x.slug === slug);
  const prev = idx > 0 ? allCases[idx - 1] : null;
  const next = idx < allCases.length - 1 ? allCases[idx + 1] : null;

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/clinical-results"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> Clinical Results
          </Link>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block rounded-full bg-[color:var(--brand)] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white">
                  {c.tag}
                </span>
                <span className="inline-block rounded-full border border-[color:var(--border-strong)] bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-[color:var(--text-soft)]">
                  {c.category}
                </span>
              </div>
              <h1 className="mt-3 font-display text-4xl leading-none text-[color:var(--text-main)] sm:text-5xl">
                {c.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
                {c.description}
              </p>
            </div>

            {/* Quick meta pills */}
            <div className="flex flex-col gap-2 sm:items-end">
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[color:var(--text-soft)]">
                <Clock size={14} strokeWidth={2} className="text-[color:var(--brand)]" />
                {c.duration}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-white px-4 py-2 text-sm font-medium text-[color:var(--text-soft)]">
                <Tag size={14} strokeWidth={2} className="text-[color:var(--brand)]" />
                {c.treatment}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px] xl:gap-16">

          {/* Left — gallery + clinical narrative */}
          <div className="flex flex-col gap-10">

            {/* Image gallery */}
            <div className="flex flex-col gap-4">
              {c.images.map(({ src, caption }, i) => (
                <figure key={src} className="overflow-hidden rounded-3xl border border-[color:var(--border-strong)] shadow-[0_12px_40px_rgba(57,28,45,0.07)]">
                  <div className="relative w-full overflow-hidden bg-[color:var(--brand-soft)]" style={{ aspectRatio: i === 0 ? "16/9" : "16/9" }}>
                    <Image
                      src={src}
                      alt={caption ?? `${c.title} — image ${i + 1}`}
                      fill
                      className="object-cover object-center"
                      sizes="(min-width: 1280px) 780px, (min-width: 1024px) 65vw, 100vw"
                      priority={i === 0}
                    />
                  </div>
                  {caption && (
                    <figcaption className="border-t border-[color:var(--border-strong)] bg-white px-5 py-3 text-xs text-[color:var(--text-soft)]">
                      {caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>

            {/* Clinical narrative */}
            <div className="rounded-[2rem] border border-[color:var(--border-strong)] bg-white p-8 shadow-[0_12px_40px_rgba(57,28,45,0.05)] sm:p-10">
              <h2 className="font-display text-2xl text-[color:var(--text-main)]">Clinical Notes</h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-[color:var(--text-soft)] whitespace-pre-line">
                {c.fullText}
              </div>
            </div>

          </div>

          {/* Right — treatment summary + CTA */}
          <div className="flex flex-col gap-6">

            {/* Treatment summary card */}
            <div className="rounded-[2rem] border border-[color:var(--border-strong)] bg-white p-8 shadow-[0_12px_40px_rgba(57,28,45,0.05)]">
              <h2 className="font-display text-2xl text-[color:var(--text-main)]">Treatment Summary</h2>
              <dl className="mt-6 flex flex-col gap-5">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--text-soft)]">Category</dt>
                  <dd className="mt-1 text-sm font-medium text-[color:var(--text-main)]">{c.category}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--text-soft)]">Treatment</dt>
                  <dd className="mt-1 text-sm font-medium text-[color:var(--text-main)]">{c.treatment}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.15em] text-[color:var(--text-soft)]">Treatment Duration</dt>
                  <dd className="mt-1 text-sm font-medium text-[color:var(--text-main)]">{c.duration}</dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-col gap-3">
                <Link href="/contact" className="btn-primary w-full justify-center">
                  Book a Consultation
                </Link>
                <Link href="/pricing" className="btn-secondary w-full justify-center">
                  View Pricing
                </Link>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs leading-5 text-[color:var(--text-soft)]">
              * Cases shown with patient consent. Individual results may vary depending on oral health, bone density, and treatment complexity.
            </p>

          </div>
        </div>

        {/* Prev / Next navigation */}
        {(prev || next) && (
          <div className="mt-16 flex items-stretch justify-between gap-4 border-t border-[color:var(--border-strong)] pt-10">
            {prev ? (
              <Link
                href={`/clinical-results/${prev.slug}`}
                className="group flex flex-1 items-center gap-3 rounded-[1.5rem] border border-[color:var(--border-strong)] bg-white p-5 transition hover:border-[color:var(--brand-light)] hover:shadow-[0_8px_24px_rgba(57,28,45,0.08)]"
              >
                <ArrowLeft size={18} strokeWidth={2} className="shrink-0 text-[color:var(--brand)] transition group-hover:text-[color:var(--brand-deep)]" />
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Previous Case</p>
                  <p className="mt-0.5 font-display text-base text-[color:var(--text-main)] group-hover:text-[color:var(--brand-deep)]">{prev.title}</p>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {next ? (
              <Link
                href={`/clinical-results/${next.slug}`}
                className="group flex flex-1 items-center justify-end gap-3 rounded-[1.5rem] border border-[color:var(--border-strong)] bg-white p-5 text-right transition hover:border-[color:var(--brand-light)] hover:shadow-[0_8px_24px_rgba(57,28,45,0.08)]"
              >
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">Next Case</p>
                  <p className="mt-0.5 font-display text-base text-[color:var(--text-main)] group-hover:text-[color:var(--brand-deep)]">{next.title}</p>
                </div>
                <ArrowRight size={18} strokeWidth={2} className="shrink-0 text-[color:var(--brand)] transition group-hover:text-[color:var(--brand-deep)]" />
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
