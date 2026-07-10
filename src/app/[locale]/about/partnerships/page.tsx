import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import { supabaseServer } from "@/lib/supabase-server";
import { getPayloadPartnerGroups, isPayloadSource } from "@/lib/payload-source";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partnerships" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

type Partner = { name: string; logo?: string; website?: string };
type PartnerCategory = { id: string; title: string; partners: Partner[] };

const PARTNER_CATEGORIES: PartnerCategory[] = [
  {
    id: "banks",
    title: "Banks & Financial Institutions",
    partners: [
      { name: "Vattanac Bank",           logo: "/about/partners/vattanac-bank.jpg" },
      { name: "Cambodia Post Bank",       logo: "/about/partners/cambodia-post-bank.webp" },
      { name: "Chip Mong Bank",           logo: "/about/partners/chip-mong-bank.png" },
      { name: "BRED Bank",                logo: "/about/partners/bred-bank.webp" },
      { name: "Phillip Bank",             logo: "/about/partners/phillip-bank.svg" },
      { name: "Maybank",                  logo: "/about/partners/maybank.png" },
      { name: "PPC Bank",                  logo: "/about/partners/ppc-bank.png" },
      { name: "ACLEDA Bank",              logo: "/about/partners/acleda-bank.png" },
      { name: "Canadia Bank",             logo: "/about/partners/canadia-bank.png" },
      { name: "Sacom Bank",               logo: "/about/partners/sacom-bank.jpg" },
      { name: "ABA Bank",                  logo: "/about/partners/aba-bank.webp" },
      { name: "CIMB Bank",                logo: "/about/partners/cimb-bank.jpg" },
      { name: "Hatha Kaksekar Limited" },
      { name: "Cambodian Public Bank",    logo: "/about/partners/cambodian-public-bank.webp" },
      { name: "Hong Leong Bank",          logo: "/about/partners/hong-leong-bank.webp" },
      { name: "Sathapana Bank",           logo: "/about/partners/sathapana-bank.png" },
      { name: "Union Commercial Bank" },
      { name: "AEON Specialized Bank" },
      { name: "Oriental Bank",            logo: "/about/partners/oriental-bank.jpg" },
      { name: "Bridge Bank" },
      { name: "CCU Bank" },
    ],
  },
  {
    id: "schools",
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
    id: "healthcare",
    title: "Healthcare",
    partners: [
      { name: "Orienda International Hospital" },
      { name: "KHEMA International Polyclinic" },
    ],
  },
  {
    id: "insurance",
    title: "Insurance",
    partners: [
      { name: "AIA",       logo: "/about/partners/aia.svg" },
      { name: "Prudential", logo: "/about/partners/prudential.png" },
      { name: "Prosur Insurance" },
      { name: "CB Insurance" },
      { name: "South Asia Services" },
      { name: "Assurnet" },
    ],
  },
  {
    id: "hotels",
    title: "Hotels & Hospitality",
    partners: [
      { name: "Palace Gate Hotel & Resort" },
      { name: "Sun & Moon Urban Hotel" },
      { name: "Sofitel Hotel",             logo: "/about/partners/sofitel.svg" },
    ],
  },
  {
    id: "realEstate",
    title: "Real Estate & Development",
    partners: [
      { name: "Chip Mong Land Co., Ltd." },
      { name: "Peng Huoth Residences" },
    ],
  },
  {
    id: "associations",
    title: "Professional Associations",
    partners: [
      { name: "EuroCham Cambodia" },
      { name: "AmCham Cambodia",           logo: "/about/partners/amcham.svg" },
      { name: "IDI" },
    ],
  },
  {
    id: "other",
    title: "Other",
    partners: [
      { name: "PwC Cambodia", logo: "/about/partners/pwc.svg" },
      { name: "Pathmazing" },
      { name: "Dragonair" },
      { name: "Peace Corps" },
    ],
  },
];

function PartnerLogo({
  partner,
  visitLabel,
}: {
  partner: Partner;
  visitLabel: string;
}) {
  const inner = partner.logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={partner.logo}
      alt={partner.name}
      className="h-auto w-auto max-h-28 max-w-[90%] object-contain mx-auto"
      loading="lazy"
    />
  ) : (
    <span className="text-center text-sm font-semibold leading-tight text-[color:var(--text-main)] px-2">
      {partner.name}
    </span>
  );

  const cardClass =
    "flex items-center justify-center rounded-2xl bg-white p-3 shadow-[0_4px_16px_rgba(57,28,45,0.06)] transition hover:shadow-[0_8px_24px_rgba(57,28,45,0.10)] aspect-[4/3]";

  // Partners with a website become clickable (open in a new tab).
  if (partner.website) {
    return (
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        title={visitLabel}
        className={`${cardClass} hover:-translate-y-0.5`}
      >
        {inner}
      </a>
    );
  }

  return (
    <div title={partner.name} className={cardClass}>
      {inner}
    </div>
  );
}

type PartnerRow = {
  name: string;
  logo_src: string | null;
  website: string | null;
  sort_order: number | null;
  partner_categories: { name: string; sort_order: number | null } | null;
};

export default async function PartnershipsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("partnerships");

  const { data, error } = isPayloadSource()
    ? { data: await getPayloadPartnerGroups(), error: null }
    : await supabaseServer
        .from("partners")
        .select("*, partner_categories(name, sort_order)")
        .order("sort_order");

  if (error) {
    console.error("[PartnershipsPage] partners fetch failed:", error.message);
  }

  // DB partner-category names match the fallback titles; translate via their key.
  const categoryKeyByTitle = new Map(PARTNER_CATEGORIES.map((c) => [c.title, c.id]));
  const categoryMap = new Map<string, PartnerCategory & { sortOrder: number }>();
  if (isPayloadSource()) {
    ((data as Awaited<ReturnType<typeof getPayloadPartnerGroups>> | null) ?? []).forEach((category) => {
      const title = categoryKeyByTitle.has(category.title)
        ? t(`categories.${categoryKeyByTitle.get(category.title)}`)
        : category.title;
      categoryMap.set(category.title, { ...category, title });
    });
  } else {
    ((data as PartnerRow[] | null) ?? []).forEach((row) => {
      const category = row.partner_categories;
      if (!category) return;
      const existing = categoryMap.get(category.name) ?? {
        id: category.name,
        title: categoryKeyByTitle.has(category.name)
          ? t(`categories.${categoryKeyByTitle.get(category.name)}`)
          : category.name,
        partners: [],
        sortOrder: category.sort_order ?? 0,
      };
      existing.partners.push({
        name: row.name,
        ...(row.logo_src ? { logo: row.logo_src } : {}),
        ...(row.website ? { website: row.website } : {}),
      });
      categoryMap.set(category.name, existing);
    });
  }
  const partnerCategories = categoryMap.size
    ? Array.from(categoryMap.values())
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((category) => ({
          id: category.id,
          title: category.title,
          partners: category.partners,
        }))
    : PARTNER_CATEGORIES.map((category) => ({
        ...category,
        title: t(`categories.${category.id}`),
      }));

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> {t("backLink")}
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            {t("hero.subtitle")}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8 space-y-8 sm:space-y-16">
        {partnerCategories.map((category) => (
          <section key={category.title}>
            <div className="mb-6 flex items-baseline gap-3">
              <h2 className="font-display text-2xl text-[color:var(--text-main)]">{category.title}</h2>
              <span className="text-xs font-semibold text-[color:var(--text-soft)]">
                {t("partnerCount", { count: category.partners.length })}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {category.partners.map((partner) => (
                <PartnerLogo
                  key={partner.name}
                  partner={partner}
                  visitLabel={t("visitPartner", { name: partner.name })}
                />
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <div className="rounded-3xl bg-[color:var(--brand-soft)] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[color:var(--text-main)]">{t("cta.title")}</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-[color:var(--text-soft)]">
                {t("cta.description")}
              </p>
            </div>
            <Link href="/contact#enquiry-form" className="btn-primary shrink-0">
              {t("cta.button")}
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
