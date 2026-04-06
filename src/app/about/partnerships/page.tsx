import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate Partnerships | Roomchang Dental Hospital",
  description:
    "Roomchang partners with leading banks, schools, insurers, hotels, and organisations across Cambodia to provide dental benefits for employees and members.",
};

const PARTNER_CATEGORIES = [
  {
    title: "Banks & Financial Institutions",
    partners: [
      "Vattanac Bank", "Cambodia Post Bank", "Chip Mong Bank", "Prince Bank",
      "BRED Bank", "Phillip Bank", "Maybank", "PPC Bank", "ACLEDA Bank",
      "Canadia Bank", "Sacom Bank", "ABA Bank", "CIMB Bank",
      "Hatha Kaksekar Limited", "Cambodian Public Bank", "Hong Leong Bank",
      "Sathapana Bank", "Union Commercial Bank", "AEON Specialized Bank", "Bridge Bank",
    ],
  },
  {
    title: "International Schools",
    partners: [
      "American Intercon School", "Canadian International School",
      "Footprints International School", "Home of English International",
      "NIRA International School", "Northbridge International School",
      "Paragon International School",
      "Singapore Cambodia International Academy (SCIA)",
      "Southbridge International School",
    ],
  },
  {
    title: "Insurance",
    partners: [
      "AIA", "Prudential", "Prosur Insurance", "CB Insurance", "South Asia Services",
    ],
  },
  {
    title: "Hotels & Hospitality",
    partners: [
      "Palace Gate Hotel & Resort", "Sun & Moon Urban Hotel", "Sofitel Hotel",
    ],
  },
  {
    title: "Real Estate & Development",
    partners: [
      "Chip Mong Land Co., Ltd.", "Peng Huoth Residences",
    ],
  },
  {
    title: "Professional Associations",
    partners: ["EuroCham Cambodia", "AmCham Cambodia", "IDI"],
  },
  {
    title: "Healthcare & Other",
    partners: [
      "Orienda International Hospital", "PwC Cambodia", "Pathmazing",
      "Dragonair", "Peace Corps",
    ],
  },
];

export default function PartnershipsPage() {
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
            Corporate Partnerships
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            Roomchang partners with leading organisations across Cambodia to provide dental care
            benefits for their employees, students, and members.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PARTNER_CATEGORIES.map((category) => (
            <div
              key={category.title}
              className="rounded-[2rem] border border-[--border-strong] bg-white p-8 shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
            >
              <h2 className="font-display text-xl text-[--text-main]">{category.title}</h2>
              <p className="mt-1 text-xs font-semibold text-[--text-soft]">
                {category.partners.length} partners
              </p>
              <ul className="mt-4 space-y-2">
                {category.partners.map((partner) => (
                  <li
                    key={partner}
                    className="text-sm text-[--text-soft]"
                  >
                    {partner}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-[2rem] bg-[--brand-soft] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[--text-main]">Become a Partner</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-[--text-soft]">
                Offer your employees or members access to Cambodia&apos;s leading dental hospital.
                Contact us to discuss partnership options.
              </p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0">
              Enquire About Partnerships
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
