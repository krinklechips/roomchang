"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { ClinicalCaseDetail } from "@/lib/clinical-cases";

export function ClinicalResultsGrid({ cases }: { cases: ClinicalCaseDetail[] }) {
  const categories = ["All", ...Array.from(new Set(cases.map((c) => c.category)))];
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? cases : cases.filter((c) => c.category === active);

  return (
    <div className="space-y-14">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat === active && cat !== "All" ? "All" : cat)}
            className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
              cat === active
                ? "border-[color:var(--brand)] bg-[color:var(--brand)] text-white"
                : "border-[color:var(--border-strong)] bg-white text-[color:var(--text-soft)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand-deep)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cases grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Link
            key={c.slug}
            href={`/clinical-results/${c.slug}`}
            className="group flex flex-col overflow-hidden rounded-[2rem] border border-[color:var(--border-strong)] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(57,28,45,0.1)]"
          >
            <div className="relative overflow-hidden bg-[linear-gradient(135deg,var(--brand-soft),var(--surface-strong))]">
              <Image
                src={c.cardImage}
                alt={`Before and after — ${c.title}`}
                width={800}
                height={600}
                className="w-full h-auto transition duration-500 group-hover:scale-[1.03]"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <span className="absolute right-3 top-3 rounded-full bg-[color:var(--brand-soft)] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-deep)]">
                {c.tag}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-6">
              <h2 className="font-display text-xl leading-tight text-[color:var(--text-main)] transition group-hover:text-[color:var(--brand-deep)]">
                {c.title}
              </h2>
              <p className="text-xs font-semibold text-[color:var(--brand-deep)]">{c.treatment}</p>
              <p className="flex-1 text-sm leading-6 text-[color:var(--text-soft)]">{c.description}</p>
              <div className="flex items-center justify-between border-t border-[color:var(--border-strong)] pt-3">
                <span className="text-xs text-[color:var(--text-soft)]">
                  Duration: <span className="font-semibold text-[color:var(--text-main)]">{c.duration}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--brand-deep)] transition group-hover:text-[color:var(--brand)]">
                  View case <ArrowRight size={12} strokeWidth={2} aria-hidden="true" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-[color:var(--text-soft)]">
          No cases found for <span className="font-semibold">{active}</span>.{" "}
          <button
            onClick={() => setActive("All")}
            className="font-semibold text-[color:var(--brand)] underline"
          >
            Show all
          </button>
        </p>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-[color:var(--text-soft)]">
        * Patient images and full case photography available upon request in clinic. Cases shown with patient consent.
        Individual results may vary depending on oral health, bone density, and treatment complexity.
      </p>

      {/* CTA */}
      <section className="rounded-[2rem] bg-[color:var(--brand-soft)] p-10 sm:p-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-4xl text-[color:var(--text-main)]">Achieve similar results</h2>
            <p className="mt-2 max-w-md text-sm leading-7 text-[color:var(--text-soft)]">
              Book a consultation and our specialists will assess your case and show you what&apos;s
              possible — with a personalised treatment plan and clear pricing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary shrink-0">Book a Consultation</Link>
            <Link href="/pricing" className="btn-secondary shrink-0">View Pricing</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
