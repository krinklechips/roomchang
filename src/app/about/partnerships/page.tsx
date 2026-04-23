import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import { supabaseServer } from "@/lib/supabase-server";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Corporate Partnerships | Roomchang Dental Hospital",
  description:
    "Roomchang partners with leading banks, schools, insurers, hotels, and organisations across Cambodia to provide dental benefits for employees and members.",
};

type Partner = { name: string; logo?: string };
type PartnerCategory = { title: string; partners: Partner[] };

const PARTNER_CATEGORIES: PartnerCategory[] = [
  {
    title: "Banks & Financial Institutions",
    partners: [
      { name: "Vattanac Bank",           logo: "/partners/logos/vattanac-bank.jpg" },
      { name: "Cambodia Post Bank",       logo: "/partners/logos/cambodia-post-bank.webp" },
      { name: "Chip Mong Bank",           logo: "/partners/logos/chip-mong-bank.png" },
      { name: "BRED Bank",                logo: "/partners/logos/bred-bank.webp" },
      { name: "Phillip Bank",             logo: "/partners/logos/phillip-bank.svg" },
      { name: "Maybank",                  logo: "/partners/logos/maybank.png" },
      { name: "PPC Bank",                  logo: "/partners/logos/ppc-bank.png" },
      { name: "ACLEDA Bank",              logo: "/partners/logos/acleda-bank.png" },
      { name: "Canadia Bank",             logo: "/partners/logos/canadia-bank.png" },
      { name: "Sacom Bank",               logo: "/partners/logos/sacom-bank.jpg" },
      { name: "ABA Bank",                  logo: "/partners/logos/aba-bank.webp" },
      { name: "CIMB Bank",                logo: "/partners/logos/cimb-bank.jpg" },
      { name: "Hatha Kaksekar Limited" },
      { name: "Cambodian Public Bank",    logo: "/partners/logos/cambodian-public-bank.webp" },
      { name: "Hong Leong Bank",          logo: "/partners/logos/hong-leong-bank.webp" },
      { name: "Sathapana Bank",           logo: "/partners/logos/sathapana-bank.png" },
      { name: "Union Commercial Bank" },
      { name: "AEON Specialized Bank" },
      { name: "Oriental Bank",            logo: "/partners/logos/oriental-bank.jpg" },
      { name: "Bridge Bank" },
    ],
  },
  {
    title: "International Schools",
    partners: [
      { name: "American Intercon School" },
      { name: "Canadian International School" },
      { name: "Footprints International School" },
      { name: "Home of English International" },
      { name: "NIRA International School" },
      { name: "Northbridge International School" },
      { name: "Paragon International School" },
      { name: "Singapore Cambodia International Academy (SCIA)" },
      { name: "Southbridge International School" },
    ],
  },
  {
    title: "Insurance",
    partners: [
      { name: "AIA",       logo: "/partners/logos/aia.svg" },
      { name: "Prudential", logo: "/partners/logos/prudential.png" },
      { name: "Prosur Insurance" },
      { name: "CB Insurance" },
      { name: "South Asia Services" },
    ],
  },
  {
    title: "Hotels & Hospitality",
    partners: [
      { name: "Palace Gate Hotel & Resort" },
      { name: "Sun & Moon Urban Hotel" },
      { name: "Sofitel Hotel",             logo: "/partners/logos/sofitel.svg" },
    ],
  },
  {
    title: "Real Estate & Development",
    partners: [
      { name: "Chip Mong Land Co., Ltd." },
      { name: "Peng Huoth Residences" },
    ],
  },
  {
    title: "Professional Associations",
    partners: [
      { name: "EuroCham Cambodia" },
      { name: "AmCham Cambodia",           logo: "/partners/logos/amcham.svg" },
      { name: "IDI" },
    ],
  },
  {
    title: "Healthcare & Other",
    partners: [
      { name: "Orienda International Hospital" },
      { name: "PwC Cambodia", logo: "/partners/logos/pwc.svg" },
      { name: "Pathmazing" },
      { name: "Dragonair" },
      { name: "Peace Corps" },
    ],
  },
];

function PartnerLogo({ partner }: { partner: Partner }) {
  if (partner.logo) {
    return (
      <div className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-[color:var(--border-strong)] bg-white p-4 shadow-[0_4px_16px_rgba(57,28,45,0.04)] transition hover:shadow-[0_8px_24px_rgba(57,28,45,0.08)]">
        <div className="relative flex h-12 w-full items-center justify-center">
          <Image
            src={partner.logo}
            alt={partner.name}
            width={120}
            height={48}
            className="max-h-12 w-auto object-contain"
            unoptimized={partner.logo.endsWith(".svg")}
          />
        </div>
        <span className="text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-[color:var(--text-soft)]">
          {partner.name}
        </span>
      </div>
    );
  }

  // Text badge fallback
  return (
    <div className="flex items-center justify-center rounded-2xl border border-[color:var(--border-strong)] bg-white px-4 py-5 text-center shadow-[0_4px_16px_rgba(57,28,45,0.04)]">
      <span className="text-sm font-semibold text-[color:var(--text-soft)]">{partner.name}</span>
    </div>
  );
}

type PartnerRow = {
  name: string;
  logo_src: string | null;
  sort_order: number | null;
  partner_categories: { name: string; sort_order: number | null } | null;
};

export default async function PartnershipsPage() {
  const { data, error } = await supabaseServer
    .from("partners")
    .select("*, partner_categories(name, sort_order)")
    .order("sort_order");

  if (error) {
    console.error("[PartnershipsPage] partners fetch failed:", error.message);
  }

  const categoryMap = new Map<string, PartnerCategory & { sortOrder: number }>();
  ((data as PartnerRow[] | null) ?? []).forEach((row) => {
    const category = row.partner_categories;
    if (!category) return;
    const existing = categoryMap.get(category.name) ?? {
      title: category.name,
      partners: [],
      sortOrder: category.sort_order ?? 0,
    };
    existing.partners.push({
      name: row.name,
      ...(row.logo_src ? { logo: row.logo_src } : {}),
    });
    categoryMap.set(category.name, existing);
  });
  const partnerCategories = categoryMap.size
    ? Array.from(categoryMap.values())
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(({ sortOrder, ...category }) => category)
    : PARTNER_CATEGORIES;

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> About
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            Corporate Partnerships
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            Roomchang partners with leading organisations across Cambodia to provide dental care
            benefits for their employees, students, and members.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 space-y-16">
        {partnerCategories.map((category) => (
          <section key={category.title}>
            <div className="mb-6 flex items-baseline gap-3">
              <h2 className="font-display text-2xl text-[color:var(--text-main)]">{category.title}</h2>
              <span className="text-xs font-semibold text-[color:var(--text-soft)]">
                {category.partners.length} partners
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {category.partners.map((partner) => (
                <PartnerLogo key={partner.name} partner={partner} />
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <div className="rounded-3xl bg-[color:var(--brand-soft)] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[color:var(--text-main)]">Become a Partner</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-[color:var(--text-soft)]">
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
