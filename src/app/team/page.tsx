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
  // Director
  {
    id: "dr-tith",
    name: "Dr. Tith Hong Yoeu",
    credentials: "DDS, MSc.",
    role: "Founder & Director — Oral Surgery & Implantology",
    specialties: ["Oral Surgery", "Implantology", "Full Mouth Reconstruction"],
    note: "MSc. in Oral Implantology — Goethe University Frankfurt, Germany",
    languages: ["Khmer", "English"],
    initials: "TH",
  },
  // Implantology & Oral Reconstruction
  {
    id: "dr-heng-kyhak",
    name: "Dr. Heng Kyhak",
    credentials: "DDS, MSc.",
    role: "Oral Surgery & Reconstruction",
    specialties: ["Oral Surgery", "Bone Grafting", "Full Mouth Reconstruction"],
    languages: ["Khmer", "English"],
    initials: "HK",
  },
  {
    id: "dr-chav",
    name: "Dr. Chav Bunhean",
    credentials: "DDS, MSc.",
    role: "Periodontist & Implantologist",
    specialties: ["Periodontal Disease", "Implantology", "Full Mouth Rehabilitation"],
    languages: ["Khmer", "English"],
    initials: "CB",
  },
  {
    id: "dr-hy",
    name: "Dr. Hy Bunhay",
    credentials: "DDS",
    role: "Prosthodontist & Implantologist",
    specialties: ["Prosthodontics", "Aesthetic Dentistry", "Implantology"],
    languages: ["Khmer", "English"],
    initials: "HB",
  },
  {
    id: "dr-kong",
    name: "Dr. Kong Pheakdey",
    credentials: "DDS, MSc.",
    role: "Oral Implantologist",
    specialties: ["Dental Implants", "All-on-4 / All-on-6", "Bone Grafting"],
    languages: ["Khmer", "English"],
    initials: "KP",
  },
  {
    id: "dr-loung",
    name: "Dr. Loung Lov",
    credentials: "DDS, MSc.",
    role: "Implantologist & Sleep Specialist",
    specialties: ["Implantology", "Snoring & Sleep Apnea"],
    languages: ["Khmer", "English"],
    initials: "LL",
  },
  {
    id: "dr-ke",
    name: "Dr. Ke Chenda",
    credentials: "DDS, MSc.",
    role: "General Dentistry & Implantology",
    specialties: ["Implantology", "Orthodontics", "Cosmetic Dentistry"],
    languages: ["Khmer", "English"],
    initials: "KC",
  },
  // Cosmetic Dentistry
  {
    id: "dr-ob",
    name: "Dr. Ob Samon",
    credentials: "DDS",
    role: "Prosthodontist",
    specialties: ["General Dentistry", "Prosthodontics", "Smile Design"],
    languages: ["Khmer", "English"],
    initials: "OS",
  },
  {
    id: "dr-sann",
    name: "Dr. Sann Sidaravitou",
    credentials: "DDS",
    role: "General Practitioner",
    specialties: ["General Dentistry", "Cosmetic Dentistry"],
    languages: ["Khmer", "English"],
    initials: "SS",
  },
  // Orthodontics
  {
    id: "dr-phit",
    name: "Dr. Phit Veasna",
    credentials: "DDS, MSc.",
    role: "Orthodontist",
    specialties: ["Orthodontics", "Braces", "Clear Aligners"],
    note: "MSc. in Orthodontics — Germany, 2019",
    languages: ["Khmer", "English"],
    initials: "PV",
  },
  {
    id: "dr-lao",
    name: "Dr. Lao Chanvattey",
    credentials: "DDS, MSc.",
    role: "Orthodontist",
    specialties: ["Orthodontics", "Invisalign", "Clear Aligners"],
    note: "MSc. in Orthodontics — Austria",
    languages: ["Khmer", "English", "German"],
    initials: "LC",
  },
  {
    id: "dr-samith-c",
    name: "Dr. Samith Chanvuthy",
    credentials: "DDS",
    role: "Orthodontist",
    specialties: ["Braces", "Clear Aligners", "Orthodontics"],
    languages: ["Khmer", "English"],
    initials: "SC",
  },
  // Paediatrics
  {
    id: "dr-yos",
    name: "Dr. Yos Chantho",
    credentials: "DDS, MSc.",
    role: "Paediatric Dentist",
    specialties: ["Children's Dentistry", "Preventive Care", "Early Orthodontics"],
    note: "President, Cambodian Association of Pediatric Dentistry",
    languages: ["Khmer", "English"],
    initials: "YC",
  },
  // Senior Consultants
  {
    id: "prof-nentwig",
    name: "Prof. Dr. Georg-Hubertus Nentwig",
    credentials: "DMD, Dr Med Dent, PhD",
    role: "Senior Consultant — Oral Surgery",
    specialties: ["Oral Surgery", "Implantology"],
    note: "Former Professor, Goethe University Frankfurt; founder of the Masters of Oral Implantology programme",
    languages: ["English", "German"],
    initials: "GN",
  },
  {
    id: "dr-yue",
    name: "Dr. Yue Weng Cheu",
    credentials: "BDS, FRACDS, MJDF, FICД",
    role: "Visiting Specialist — TMD",
    specialties: ["TMD", "Occlusion", "Oral Medicine"],
    languages: ["English", "Mandarin", "Malay"],
    initials: "YW",
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
                  <h2 className="font-display text-xl leading-tight text-[--text-main]">
                    {doctor.name}
                    {doctor.credentials && (
                      <span className="ml-1.5 text-sm font-sans font-normal text-[--text-soft]">{doctor.credentials}</span>
                    )}
                  </h2>
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

                {doctor.note && (
                  <p className="text-[0.68rem] leading-5 text-[--text-soft] italic">{doctor.note}</p>
                )}
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
