"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { Doctor } from "@/lib/data";

/** Filter pills — `value` drives the filter logic, `key` maps to the lang.* translation */
const LANGUAGES: { value: string; key: string }[] = [
  { value: "Khmer", key: "khmer" },
  { value: "English", key: "english" },
  { value: "Mandarin", key: "mandarin" },
  { value: "Japanese", key: "japanese" },
  { value: "German", key: "german" },
  { value: "French", key: "french" },
];

/** Each entry groups one or more DB department values under a single visible heading */
const DEPARTMENT_GROUPS: { key: string; depts: string[] }[] = [
  { key: "implantology",      depts: ["DIRECTOR", "IMPLANTOLOGY"] },
  { key: "cosmetic",          depts: ["COSMETIC"] },
  { key: "general",           depts: ["GENERAL"] },
  { key: "periodontics",      depts: ["PERIODONTICS"] },
  { key: "orthodontics",      depts: ["ORTHODONTICS"] },
  { key: "pediatrics",        depts: ["PEDIATRICS"] },
  { key: "seniorConsultant",  depts: ["SENIOR_CONSULTANT"] },
];

// Human-readable department label from the raw DB enum
// (e.g. "SENIOR_CONSULTANT" -> "Senior Consultant", "ORTHODONTICS" -> "Orthodontics")
function formatDepartment(raw: string): string {
  return raw
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Sanitise credentials — replace any stray Cyrillic chars with ASCII equivalents
function cleanCredentials(raw: string): string {
  return raw
    .replaceAll("Д", "D")
    .replaceAll("С", "C")
    .replaceAll("В", "B");
}

function DoctorModal({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("doctorGrid.modal");

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
    >
      {/* Backdrop — a real button so click-to-close is keyboard-accessible
          (Escape also closes via the keydown listener above). */}
      <button
        type="button"
        aria-label={t("close")}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/60"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl outline-none"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[color:var(--text-soft)] shadow-sm backdrop-blur-sm transition hover:bg-[color:var(--brand-soft)] hover:text-[color:var(--brand-deep)]"
          aria-label={t("close")}
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
              <p className="mt-0.5 text-xs text-[color:var(--text-soft)]">{formatDepartment(doctor.department)}</p>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 px-8 py-7">
          {/* Bio */}
          {doctor.bio && (
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-soft)]">
                {t("about")}
              </p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-main)] whitespace-pre-line">
                {doctor.bio}
              </p>
            </div>
          )}

          {/* Specialties */}
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--text-soft)]">
              {t("specialties")}
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
              {t("languages")}
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

          {doctor.department === "SENIOR_CONSULTANT" ? (
            <p className="mt-2 self-start rounded-full bg-[color:var(--brand-soft)] px-4 py-2 text-xs font-semibold text-[color:var(--brand-deep)]">
              {t("consultantNote")}
            </p>
          ) : (
            <Link
              href={`/contact?doctor=${encodeURIComponent(doctor.name)}`}
              className="btn-primary mt-2 self-start"
            >
              {t("bookWith", { lastName: doctor.name.split(" ").at(-1) ?? "" })}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function DoctorCard({ doctor, onSelect }: { doctor: Doctor; onSelect: (d: Doctor) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(doctor)}
      className="w-full cursor-pointer overflow-hidden rounded-2xl bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Portrait — fills card width, fixed height */}
      <div className="relative h-[220px] w-full overflow-hidden bg-[color:var(--brand-soft)]">
        {doctor.photoUrl ? (
          <Image
            src={doctor.photoUrl}
            alt={doctor.name}
            fill
            className="object-cover object-top"
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-[color:var(--brand-deep)]/30">
            {doctor.initials}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-3 py-3">
        <h3 className="font-display text-sm leading-snug text-[color:var(--text-main)]">
          {doctor.name}
        </h3>
        {doctor.credentials && (
          <p className="mt-0.5 text-[0.7rem] text-[color:var(--text-soft)]">
            {cleanCredentials(doctor.credentials)}
          </p>
        )}
        <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--brand-deep)]">
          {doctor.role}
        </p>
      </div>
    </button>
  );
}

export function DoctorGrid({ doctors }: { doctors: Doctor[] }) {
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const t = useTranslations("doctorGrid");

  const filtered = activeLanguage
    ? doctors.filter((d) =>
        d.languages.some((l) => l.toLowerCase() === activeLanguage.toLowerCase())
      )
    : doctors;

  // Group by department (only when not filtering)
  const grouped = activeLanguage
    ? null
    : DEPARTMENT_GROUPS
        .map(({ key, depts }) => ({
          key,
          docs: filtered.filter((d) => depts.includes(d.department ?? "")),
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
              {t("filterLabel")}
            </span>

            <button
              onClick={() => setActiveLanguage(null)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeLanguage === null
                  ? "border-[color:var(--brand)] bg-[color:var(--brand)] text-white shadow-sm"
                  : "border-[color:var(--border-strong)] bg-white text-[color:var(--text-soft)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand-deep)]"
              }`}
            >
              {t("filterAll")}
            </button>

            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                onClick={() => toggleLanguage(lang.value)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeLanguage === lang.value
                    ? "border-[color:var(--brand)] bg-[color:var(--brand)] text-white shadow-sm"
                    : "border-[color:var(--border-strong)] bg-white text-[color:var(--text-soft)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand-deep)]"
                }`}
              >
                {t(`lang.${lang.key}`)}
              </button>
            ))}

          </div>
          {activeLanguage && (
            <p className="mt-2 text-xs text-[color:var(--text-soft)]">
              {t("filterResult", { count: filtered.length, language: activeLanguage })}
            </p>
          )}
        </div>
      </div>

      {/* Doctor grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8">
        {grouped ? (
          // Grouped by department
          <div className="flex flex-col gap-16">
            {grouped.map(({ key, docs }) => (
              <section key={key}>
                <h2 className="mb-8 font-display text-2xl text-[color:var(--brand-deep)]">
                  {t(`dept.${key}`)}
                </h2>
                <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {docs.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} onSelect={setSelectedDoctor} />)}
                </div>
              </section>
            ))}
          </div>
        ) : (
          // Flat filtered grid
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} onSelect={setSelectedDoctor} />)}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="py-10 sm:py-20 text-center">
            <p className="text-base text-[color:var(--text-soft)]">
              {t("noResults", { language: activeLanguage ?? "" })}
            </p>
            <button
              onClick={() => setActiveLanguage(null)}
              className="mt-4 text-sm font-semibold text-[color:var(--brand)] underline"
            >
              {t("showAll")}
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-[color:var(--brand-soft)] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[color:var(--text-main)]">
                {t("cta.heading")}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
                {t("cta.body")}
              </p>
            </div>
            <Link href="/contact#enquiry-form" className="btn-primary shrink-0">
              {t("cta.button")}
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
