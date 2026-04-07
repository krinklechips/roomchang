"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Doctor } from "@/lib/data";

const LANGUAGES = ["Khmer", "English", "Mandarin", "Japanese", "Malay", "French"];

// Sanitise credentials — replace any stray Cyrillic chars with ASCII equivalents
function cleanCredentials(raw: string): string {
  return raw
    .replace(/Д/g, "D")
    .replace(/С/g, "C")
    .replace(/В/g, "B");
}

export function DoctorGrid({ doctors }: { doctors: Doctor[] }) {
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);

  const filtered = activeLanguage
    ? doctors.filter((d) =>
        d.languages.some((l) => l.toLowerCase() === activeLanguage.toLowerCase())
      )
    : doctors;

  function toggleLanguage(lang: string) {
    setActiveLanguage((prev) => (prev === lang ? null : lang));
  }

  return (
    <>
      {/* Language filter pills */}
      <div className="border-b border-[color:var(--border-strong)]">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">
              Filter by language:
            </span>

            {/* All pill */}
            <button
              onClick={() => setActiveLanguage(null)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeLanguage === null
                  ? "border-[color:var(--brand)] bg-[color:var(--brand)] text-white shadow-sm"
                  : "border-[color:var(--border-strong)] bg-white text-[color:var(--text-soft)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand-deep)]"
              }`}
            >
              All
            </button>

            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeLanguage === lang
                    ? "border-[color:var(--brand)] bg-[color:var(--brand)] text-white shadow-sm"
                    : "border-[color:var(--border-strong)] bg-white text-[color:var(--text-soft)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand-deep)]"
                }`}
              >
                {lang}
              </button>
            ))}

            {activeLanguage && (
              <span className="ml-1 text-xs text-[color:var(--text-soft)]">
                — {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} speak {activeLanguage}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Doctor grid */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doctor) => (
            <article
              key={doctor.id}
              className="flex flex-col overflow-hidden rounded-[2rem] border border-[color:var(--border-strong)] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)] transition hover:shadow-[0_20px_56px_rgba(57,28,45,0.1)]"
            >
              {/* Photo header */}
              <div className="relative flex items-end bg-[linear-gradient(135deg,var(--brand-soft),#f0d6e4)] px-6 pb-0 pt-8">
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-4 border-white shadow-[0_8px_24px_rgba(57,28,45,0.12)]">
                  {doctor.photoUrl ? (
                    <Image
                      src={doctor.photoUrl}
                      alt={doctor.name}
                      fill
                      className="object-cover object-top"
                      sizes="128px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--brand-soft),var(--brand-light))] text-3xl font-bold text-[color:var(--brand-deep)]">
                      {doctor.initials}
                    </div>
                  )}
                </div>
                <div className="ml-4 mb-4 min-w-0">
                  <h2 className="font-display text-xl leading-snug text-[color:var(--text-main)]">
                    {doctor.name}
                  </h2>
                  {doctor.credentials && (
                    <p className="mt-0.5 text-xs font-normal text-[color:var(--text-soft)]">
                      {cleanCredentials(doctor.credentials)}
                    </p>
                  )}
                  <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-deep)]">
                    {doctor.role}
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                {/* Specialties */}
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-soft)]">
                    Specialties
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {doctor.specialty.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-[color:var(--brand-soft)] px-2.5 py-0.5 text-[0.68rem] font-semibold text-[color:var(--brand-deep)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-soft)]">
                    Languages
                  </p>
                  <p className="mt-1 text-sm text-[color:var(--text-main)]">
                    {doctor.languages.join(" · ")}
                  </p>
                </div>

                {doctor.note && (
                  <p className="text-[0.68rem] leading-5 italic text-[color:var(--text-soft)]">
                    {doctor.note}
                  </p>
                )}

                <Link
                  href={`/contact?doctor=${encodeURIComponent(doctor.name)}`}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-deep)] transition hover:text-[color:var(--brand)]"
                >
                  Book with this doctor <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-base text-[color:var(--text-soft)]">
              No doctors found for <span className="font-semibold">{activeLanguage}</span>.
            </p>
            <button
              onClick={() => setActiveLanguage(null)}
              className="mt-4 text-sm font-semibold text-[color:var(--brand)] underline"
            >
              Show all doctors
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-[2rem] bg-[color:var(--brand-soft)] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[color:var(--text-main)]">
                Not sure who to see?
              </h2>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
                Tell us what you&apos;re looking for and we&apos;ll match you with the right specialist.
              </p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0">
              Get Matched
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
