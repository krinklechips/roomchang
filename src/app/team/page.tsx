import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Doctors & Team | Roomchang Dental Hospital",
  description:
    "Meet the specialist dentists and clinical team at Roomchang Dental Hospital — multilingual experts in implants, orthodontics, cosmetic dentistry, and more.",
};

// CMS-ready stub: replace with API fetch when CMS is live
const DOCTORS = [
  {
    id: "dr-chan",
    name: "Dr. Chan Sotheavy",
    role: "Oral & Maxillofacial Surgeon",
    specialties: ["Oral Surgery", "Implantology", "Bone Grafting"],
    languages: ["Khmer", "English", "French"],
    imageSrc: null,
    initials: "CS",
  },
  {
    id: "dr-keo",
    name: "Dr. Keo Piseth",
    role: "Implantologist",
    specialties: ["Dental Implants", "All-on-4", "Full Mouth Reconstruction"],
    languages: ["Khmer", "English"],
    imageSrc: null,
    initials: "KP",
  },
  {
    id: "dr-lim",
    name: "Dr. Lim Sokunthea",
    role: "Orthodontist",
    specialties: ["Clear Aligners", "Invisalign", "Braces"],
    languages: ["Khmer", "English", "Mandarin"],
    imageSrc: null,
    initials: "LS",
  },
  {
    id: "dr-heng",
    name: "Dr. Heng Bunrith",
    role: "Prosthodontist",
    specialties: ["Crowns & Bridges", "Veneers", "Dentures"],
    languages: ["Khmer", "English"],
    imageSrc: null,
    initials: "HB",
  },
  {
    id: "dr-sok",
    name: "Dr. Sok Chandy",
    role: "Cosmetic Dentist",
    specialties: ["Smile Design", "Teeth Whitening", "Composite Bonding"],
    languages: ["Khmer", "English", "Japanese"],
    imageSrc: null,
    initials: "SC",
  },
  {
    id: "dr-prak",
    name: "Dr. Prak Rathana",
    role: "Paediatric Dentist",
    specialties: ["Children's Dentistry", "Preventive Care", "Early Orthodontics"],
    languages: ["Khmer", "English"],
    imageSrc: null,
    initials: "PR",
  },
];

const LANGUAGES = ["Khmer", "English", "Mandarin", "Japanese", "Malay", "French"];

export default function TeamPage() {
  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[--brand]">
            Meet the Team
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">
            Our Doctors
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            Roomchang&apos;s clinical team combines decades of local experience with internationally
            trained specialists. All consultations are available in your language.
          </p>

          {/* Language chips */}
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[--text-soft] self-center">
              Languages:
            </span>
            {LANGUAGES.map((lang) => (
              <span
                key={lang}
                className="rounded-full border border-[--border-strong] bg-white px-3 py-1 text-xs font-semibold text-[--text-soft]"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor grid */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DOCTORS.map((doctor) => (
            <article
              key={doctor.id}
              className="overflow-hidden rounded-[2rem] border border-[--border-strong] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)]"
            >
              {/* Avatar */}
              <div className="flex items-center gap-5 border-b border-[--border-strong] px-6 py-6">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--brand-soft),var(--brand-light))] text-xl font-bold text-[--brand-deep]">
                  {doctor.initials}
                </div>
                <div>
                  <h2 className="font-display text-xl leading-tight text-[--text-main]">{doctor.name}</h2>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-[--text-soft]">
                    {doctor.role}
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-6">
                {/* Specialties */}
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[--text-soft]">
                    Specialties
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {doctor.specialties.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-[--brand-soft] px-2.5 py-0.5 text-[0.68rem] font-semibold text-[--brand-deep]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[--text-soft]">
                    Languages
                  </p>
                  <p className="mt-1 text-sm text-[--text-main]">{doctor.languages.join(" · ")}</p>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[--brand-deep] transition hover:text-[--brand]"
                >
                  Book with this doctor →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-[2rem] bg-[--brand-soft] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[--text-main]">Not sure who to see?</h2>
              <p className="mt-2 text-sm leading-7 text-[--text-soft]">
                Tell us what you&apos;re looking for and we&apos;ll match you with the right specialist.
              </p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0">
              Get Matched
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
