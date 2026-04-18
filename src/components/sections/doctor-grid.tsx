"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, X } from "lucide-react";
import type { Doctor } from "@/lib/data";

const LANGUAGES = ["Khmer", "English", "Mandarin", "Japanese", "Malay", "French"];

const DEPARTMENT_LABELS: Record<string, string> = {
  DIRECTOR: "Director & Founder",
  SENIOR_CONSULTANT: "Senior Consultants",
  IMPLANTOLOGY: "Implantology & Oral Reconstruction",
  PERIODONTICS: "Periodontics",
  COSMETIC: "Cosmetic Dentistry",
  ORTHODONTICS: "Orthodontics & Clear Aligners",
  PEDIATRICS: "Paediatric Dentistry",
  GENERAL: "General Dentistry",
};

const DEPARTMENT_ORDER = ["DIRECTOR", "SENIOR_CONSULTANT", "IMPLANTOLOGY", "PERIODONTICS", "COSMETIC", "ORTHODONTICS", "PEDIATRICS", "GENERAL"];

// Sanitise credentials — replace any stray Cyrillic chars with ASCII equivalents
function cleanCredentials(raw: string): string {
  return raw
    .replace(/Д/g, "D")
    .replace(/С/g, "C")
    .replace(/В/g, "B");
}

function DoctorModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="doctor-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[color:var(--text-soft)] shadow-sm backdrop-blur-sm transition hover:bg-[color:var(--brand-soft)] hover:text-[color:var(--brand-deep)]"
          aria-label="Close"
        >
          <X size={16} strokeWidth={2} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-6 border-b border-[color:var(--border-strong)] px-8 py-7">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl ring-2 ring-[color:var(--brand-soft)]">
            {doctor.photoUrl ? (
              <Image
                src={doctor.photoUrl}
                alt={doctor.name}
                fill
                className="object-contain object-center"
                sizes="112px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[color:var(--brand-soft)] text-3xl font-bold text-[color:var(--brand-deep)]">
                {doctor.initials}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <h2 id="doctor-modal-title" className="font-display text-2xl leading-snug text-[color:var(--text-main)]">
              {doctor.name}
            </h2>
            {doctor.credentials && (
              <p className="mt-1 text-sm text-[color:var(--text-soft)]">
                {cleanCredentials(doctor.credentials)}
              </p>
            )}
            <p className="mt-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-deep)]">
              {doctor.role}
            </p>
            {doctor.department && (
              <p className="mt-0.5 text-xs text-[color:var(--text-soft)]">{doctor.department}</p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 px-8 py-7">
          {/* Bio */}
          {doctor.bio && (
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-soft)]">
                About
              </p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-main)] whitespace-pre-line">
                {doctor.bio}
              </p>
            </div>
          )}

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
            <p className="text-[0.7rem] leading-5 italic text-[color:var(--text-soft)]">
              {doctor.note}
            </p>
          )}

          <Link
            href={`/contact?doctor=${encodeURIComponent(doctor.name)}`}
            className="btn-primary mt-2 self-start"
          >
            Book with Dr. {doctor.name.split(" ").at(-1)}
          </Link>
        </div>
      </div>
    </div>
  );
}

function DoctorCard({ doctor, onSelect }: { doctor: Doctor; onSelect: (d: Doctor) => void }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)] transition hover:shadow-[0_20px_56px_rgba(57,28,45,0.1)]">
      {/* Photo — fixed-width portrait, object-cover+object-top: fills box from top, crops only sides */}
      <div className="flex h-[260px] items-end justify-center overflow-hidden bg-[color:var(--brand-soft)]">
        {doctor.photoUrl ? (
          <div className="relative h-[260px] w-[200px] shrink-0 overflow-hidden rounded-t-3xl">
            <Image
              src={doctor.photoUrl}
              alt={doctor.name}
              fill
              className="object-cover object-top"
              sizes="200px"
            />
          </div>
        ) : (
          <div className="flex h-[260px] w-[200px] items-center justify-center rounded-t-3xl text-6xl font-bold text-[color:var(--brand-deep)]/30">
            {doctor.initials}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* Name + title */}
        <div>
          <h3 className="font-display text-xl leading-snug text-[color:var(--text-main)]">
            {doctor.name}
          </h3>
          {doctor.credentials && (
            <p className="mt-0.5 text-xs text-[color:var(--text-soft)]">
              {cleanCredentials(doctor.credentials)}
            </p>
          )}
          <p className="mt-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-deep)]">
            {doctor.role}
          </p>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1.5">
          {doctor.specialty.map((s) => (
            <span
              key={s}
              className="rounded-full bg-[color:var(--brand-soft)] px-2.5 py-0.5 text-[0.68rem] font-semibold text-[color:var(--brand-deep)]"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Bio preview */}
        {doctor.bio && (
          <p className="line-clamp-3 text-sm leading-6 text-[color:var(--text-soft)]">
            {doctor.bio}
          </p>
        )}

        {/* Languages */}
        <p className="text-xs text-[color:var(--text-soft)]">
          <span className="font-semibold">Languages: </span>
          {doctor.languages.join(" · ")}
        </p>

        {/* Actions */}
        <div className="mt-auto flex items-center justify-between pt-1">
          <button
            onClick={() => onSelect(doctor)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--brand-deep)] transition hover:text-[color:var(--brand)]"
          >
            View profile <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
          </button>
          <Link
            href={`/contact?doctor=${encodeURIComponent(doctor.name)}`}
            className="rounded-full border border-[color:var(--brand)] px-3.5 py-1.5 text-xs font-semibold text-[color:var(--brand-deep)] transition hover:bg-[color:var(--brand)] hover:text-white"
          >
            Book
          </Link>
        </div>
      </div>
    </article>
  );
}

export function DoctorGrid({ doctors }: { doctors: Doctor[] }) {
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const filtered = activeLanguage
    ? doctors.filter((d) =>
        d.languages.some((l) => l.toLowerCase() === activeLanguage.toLowerCase())
      )
    : doctors;

  // Group by department (only when not filtering)
  const grouped = activeLanguage
    ? null
    : DEPARTMENT_ORDER
        .map((dept) => ({
          dept,
          label: DEPARTMENT_LABELS[dept] ?? dept,
          docs: filtered.filter((d) => d.department === dept),
        }))
        .filter((g) => g.docs.length > 0);

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
        {grouped ? (
          // Grouped by department
          <div className="flex flex-col gap-16">
            {grouped.map(({ dept, label, docs }) => (
              <section key={dept}>
                <h2 className="mb-8 font-display text-2xl text-[color:var(--brand-deep)]">
                  {label}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {docs.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} onSelect={setSelectedDoctor} />)}
                </div>
              </section>
            ))}
          </div>
        ) : (
          // Flat filtered grid
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} onSelect={setSelectedDoctor} />)}
          </div>
        )}

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
        <div className="mt-16 rounded-3xl bg-[color:var(--brand-soft)] p-10 sm:p-12">
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

      {/* Doctor profile modal */}
      {selectedDoctor && (
        <DoctorModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
      )}
    </>
  );
}
