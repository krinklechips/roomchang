import "server-only";

import { cache } from "react";
import { getLocale } from "next-intl/server";
import type {
  Branch,
  CareerPosition,
  ClinicalCase,
  CommunityArticle,
  Doctor,
  FaqItem,
  HeroSlideDb,
  InternationalPopularTreatment,
  InternationalStep,
  InternationalWhyItem,
  PricingCategory,
  PricingItem,
  Publication,
  Service,
  TechnologyItem,
  Testimonial,
  TimelineEvent,
  Video,
} from "./data";

/**
 * DUMMY-SITE data source: reads content from the Serviette Payload CMS
 * instead of Supabase. Enabled per-deployment via CONTENT_SOURCE=payload
 * (see `npm run dev:payload`). The LIVE deployment never sets this, so
 * production keeps reading Supabase — structure: live ─▶ CMS ─▶ dummy.
 *
 * Localization is native in Payload, and its locale codes match the site's
 * URL segments (en/kh/cn — Enoch's convention), so the request locale passes
 * straight through. No content_translations overlay, no code mapping.
 */

export const isPayloadSource = () => process.env.CONTENT_SOURCE === "payload";

const API = () => process.env.PAYLOAD_API_URL || "http://localhost:3100";

/** Current request's locale segment (en/kh/cn) — Payload uses the same codes. */
async function payloadLocale(): Promise<string> {
  try {
    return await getLocale();
  } catch {
    return "en"; // outside a request (build-time)
  }
}

async function payloadFind<T>(collection: string, params: Record<string, string>): Promise<T[]> {
  const locale = await payloadLocale();
  const qs = new URLSearchParams({ locale, limit: "200", depth: "0", ...params });
  const res = await fetch(`${API()}/api/${collection}?${qs}`, { cache: "no-store" });
  if (!res.ok) {
    console.error(`[payload-source] ${collection} fetch failed: ${res.status}`);
    return [];
  }
  const json = (await res.json()) as { docs: T[] };
  return json.docs ?? [];
}

// ── mappers: Payload doc → live-site types ──────────────────────────────────

type PayloadDocBase = {
  id: number | string;
  sourceId?: string | null;
};

type PayloadRelation<T extends PayloadDocBase> = number | string | T | null | undefined;

type PayloadService = PayloadDocBase & {
  name: string;
  slug: string;
  description?: string | null;
  eyebrow?: string | null;
  heroDescription?: string | null;
  category?: string | null;
  icon?: string | null;
  isFeatured?: boolean | null;
  features?: { feature?: string | null }[] | null;
  imageUrl?: string | null;
  content?: Service["content"];
  order?: number | null;
  published?: boolean | null;
};

type PayloadDoctor = PayloadDocBase & {
  name: string;
  credentials?: string | null;
  role?: string | null;
  department?: string | null;
  specialty?: { value?: string | null }[] | null;
  languages?: { value?: string | null }[] | null;
  bio?: string | null;
  note?: string | null;
  initials?: string | null;
  photoUrl?: string | null;
  order?: number | null;
  published?: boolean | null;
};

type PayloadBranch = PayloadDocBase & {
  name: string;
  address?: string | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  hours?: string | null;
  mapPlaceUrl?: string | null;
  order?: number | null;
  published?: boolean | null;
};

type PayloadPricingCategory = PayloadDocBase & {
  title: string;
  icon?: string | null;
  order?: number | null;
};

type PayloadPricingItem = PayloadDocBase & {
  name: string;
  price?: string | null;
  note?: string | null;
  ada?: string | null;
  aus?: string | null;
  category?: PayloadRelation<PayloadPricingCategory>;
  sourceCategoryId?: string | null;
  order?: number | null;
};

type PayloadTestimonial = PayloadDocBase & {
  authorName: string;
  authorTitle?: string | null;
  authorPhotoUrl?: string | null;
  quote?: string | null;
  rating?: number | null;
  isFeatured?: boolean | null;
  order?: number | null;
  published?: boolean | null;
};

type PayloadTechnology = PayloadDocBase & {
  name: string;
  slug?: string | null;
  category?: string | null;
  description?: string | null;
  highlights?: { value?: string | null }[] | null;
  imageUrl?: string | null;
  content?: TechnologyItem["content"];
  order?: number | null;
  published?: boolean | null;
};

type PayloadClinicalCase = PayloadDocBase & {
  slug: string;
  title: string;
  category?: string | null;
  treatment?: string | null;
  duration?: string | null;
  description?: string | null;
  tag?: string | null;
  fullText?: string | null;
  imageUrl?: string | null;
  images?: ClinicalCase["images"] | null;
  order?: number | null;
  published?: boolean | null;
};

type PayloadInternationalStep = PayloadDocBase & {
  stepLabel?: string | null;
  title: string;
  description?: string | null;
  order?: number | null;
};

type PayloadInternationalWhyItem = PayloadDocBase & {
  title: string;
  description?: string | null;
  order?: number | null;
};

type PayloadInternationalTreatment = PayloadDocBase & {
  name: string;
  saving?: string | null;
  order?: number | null;
};

type PayloadHeroSlide = {
  id?: string | null;
  image?: PayloadRelation<PayloadMedia>;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  imagePosition?: string | null;
  imageSize?: string | null;
  preserveFullImage?: boolean | null;
  order?: number | null;
  published?: boolean | null;
};

type PayloadMedia = PayloadDocBase & {
  url?: string | null;
  alt?: string | null;
};

type PayloadHomepage = PayloadDocBase & {
  heroPill?: string | null;
  heroButtons?: { label?: string | null; url?: string | null }[] | null;
  slides?: PayloadHeroSlide[] | null;
};

export type PayloadHomepageSettings = {
  heroPill: string | null;
  heroButtons: { label: string; url: string }[];
};

type PayloadFaqItem = PayloadDocBase & {
  question: string;
  answer?: string | null;
  category?: string | null;
  order?: number | null;
  published?: boolean | null;
};

type PayloadVideo = PayloadDocBase & {
  title: string;
  url: string;
  thumbnail?: string | null;
  description?: string | null;
  category?: string | null;
  doctor?: string | null;
  topic?: string | null;
  treatment?: string | null;
  order?: number | null;
  published?: boolean | null;
};

type PayloadCareerPosition = PayloadDocBase & {
  title: string;
  slug: string;
  department?: string | null;
  type?: string | null;
  location?: string | null;
  description?: string | null;
  requirements?: { value?: string | null }[] | null;
  benefits?: { value?: string | null }[] | null;
  order?: number | null;
  published?: boolean | null;
};

type PayloadCommunityArticle = PayloadDocBase & {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  href?: string | null;
  order?: number | null;
  published?: boolean | null;
};

type PayloadTimelineEvent = PayloadDocBase & {
  year: string;
  caption?: string | null;
  heading: string;
  body?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  imagePosition?: string | null;
  order?: number | null;
  published?: boolean | null;
};

type PayloadPublication = PayloadDocBase & {
  title: string;
  authors?: string | null;
  journal?: string | null;
  year?: number | null;
  doi?: string | null;
  url?: string | null;
  abstract?: string | null;
  order?: number | null;
  published?: boolean | null;
};

type PayloadSiteStat = PayloadDocBase & {
  key: string;
  displayValue?: string | null;
  numericValue?: number | null;
  suffix?: string | null;
  label?: string | null;
  order?: number | null;
  published?: boolean | null;
};

type PayloadFeatureCard = PayloadDocBase & {
  slug: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  href?: string | null;
  cta?: string | null;
  order?: number | null;
};

type PayloadBrandLogo = PayloadDocBase & {
  slug: string;
  name: string;
  logoUrl?: string | null;
  order?: number | null;
};

type PayloadPartnerCategory = PayloadDocBase & {
  name: string;
  order?: number | null;
};

type PayloadPartner = PayloadDocBase & {
  name: string;
  logoUrl?: string | null;
  website?: string | null;
  category?: PayloadRelation<PayloadPartnerCategory>;
  sourceCategoryId?: string | null;
  order?: number | null;
};

type PayloadPricingComparisonSet = PayloadDocBase & {
  slug: string;
  exchangeRate?: number | null;
  sourceNote?: string | null;
  lastUpdated?: string | null;
};

type PayloadPricingComparisonRow = PayloadDocBase & {
  set?: PayloadRelation<PayloadPricingComparisonSet>;
  sourceSetId?: string | null;
  ada?: string | null;
  treatment: string;
  roomchangPrice?: string | null;
  australiaPrice?: string | null;
  singaporePrice?: string | null;
  order?: number | null;
};

type PayloadNewsArticle = PayloadDocBase & {
  slug: string;
  date?: string | null;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  body?: { paragraph?: string | null }[] | null;
  order?: number | null;
  published?: boolean | null;
};

type PayloadCommunityArticleDetail = PayloadNewsArticle & {
  href?: string | null;
  images?: { url?: string | null }[] | null;
};

export type PayloadSiteStatRow = {
  key: string;
  display_value: string | null;
  numeric_value: number | null;
  suffix: string | null;
  label: string;
  sort_order: number | null;
};

export type PayloadFeatureCardRow = {
  slug: string;
  title: string;
  description: string;
  image_src: string;
  image_alt: string;
  href: string;
  cta: string;
};

export type PayloadBrandLogoRow = {
  slug: string;
  name: string;
  logo_src: string;
};

export type PayloadPartnerLink = {
  name: string;
  logo?: string;
  website?: string;
};

export type PayloadPartnerGroup = {
  id: string;
  title: string;
  partners: PayloadPartnerLink[];
  sortOrder: number;
};

export type PayloadPricingComparisonRowShape = {
  ada: string | null;
  treatment: string;
  roomchang_price: string;
  australia_price: string;
  singapore_price: string | null;
  sort_order: number | null;
};

export type PayloadPricingComparisonSetShape = {
  exchange_rate: number | null;
  source_note: string | null;
  pricing_comparison_rows: PayloadPricingComparisonRowShape[];
};

export type PayloadNewsArticleShape = {
  id: string;
  slug: string;
  date: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  body: string[];
};

export type PayloadCommunityArticleShape = PayloadNewsArticleShape & {
  href: string | null;
  images: string[];
};

const sourceId = (p: PayloadDocBase): string => p.sourceId ?? String(p.id);

const sourceNumberId = (p: PayloadDocBase): number => {
  const numeric = Number(sourceId(p));
  return Number.isFinite(numeric) ? numeric : Number(p.id);
};

const strings = (
  arr: { [k: string]: string | null | undefined }[] | null | undefined,
  key: string,
): string[] =>
  (arr ?? []).map((x) => x?.[key]).filter((v): v is string => typeof v === "string" && v.trim() !== "");

const relationSourceId = <T extends PayloadDocBase>(relation: PayloadRelation<T>): string | null => {
  if (relation == null) return null;
  if (typeof relation === "object") return sourceId(relation);
  return String(relation);
};

const populatedMedia = (relation: PayloadRelation<PayloadMedia>): PayloadMedia | null =>
  relation != null && typeof relation === "object" ? relation : null;

const getPayloadHomepageDoc = cache(async (): Promise<PayloadHomepage | null> => {
  const docs = await payloadFind<PayloadHomepage>("homepage", {
    limit: "1",
    depth: "1",
  });
  return docs[0] ?? null;
});

const mapService = (p: PayloadService): Service => ({
  id: sourceId(p),
  name: p.name,
  slug: p.slug,
  description: p.description ?? null,
  category: p.category ?? null,
  features: strings(p.features, "feature"),
  icon: p.icon ?? null,
  imageSrc: p.imageUrl ?? null,
  isFeatured: p.isFeatured ?? false,
  order: p.order ?? 0,
  published: p.published ?? true,
  eyebrow: p.eyebrow ?? null,
  heroDescription: p.heroDescription ?? null,
  content: p.content ?? null,
});

const mapDoctor = (p: PayloadDoctor): Doctor => ({
  id: sourceId(p),
  name: p.name,
  credentials: p.credentials ?? "",
  role: p.role ?? "",
  department: p.department ?? "",
  specialty: strings(p.specialty, "value"),
  languages: strings(p.languages, "value"),
  bio: p.bio ?? null,
  note: p.note ?? null,
  initials: p.initials ?? "",
  photoUrl: p.photoUrl ?? null,
  order: p.order ?? 0,
  published: p.published ?? true,
});

const mapBranch = (p: PayloadBranch): Branch => ({
  id: sourceId(p),
  name: p.name,
  address: p.address ?? "",
  phone: p.phone ?? "",
  mobile: p.mobile ?? null,
  email: p.email ?? null,
  hours: p.hours ?? "",
  order: p.order ?? 0,
  published: p.published ?? true,
  map_place_url: p.mapPlaceUrl ?? null,
});

const mapPricingCategory = (p: PayloadPricingCategory, items: PricingItem[] = []): PricingCategory => ({
  id: sourceId(p),
  title: p.title,
  icon: p.icon ?? "",
  order: p.order ?? 0,
  items,
});

const mapPricingItem = (p: PayloadPricingItem): PricingItem => ({
  id: sourceId(p),
  name: p.name,
  price: p.price ?? "",
  note: p.note ?? null,
  ada: p.ada ?? null,
  aus: p.aus ?? null,
  order: p.order ?? 0,
  categoryId: p.sourceCategoryId ?? relationSourceId(p.category) ?? "",
});

const mapTestimonial = (p: PayloadTestimonial): Testimonial => ({
  id: sourceId(p),
  authorName: p.authorName,
  authorTitle: p.authorTitle ?? null,
  authorPhotoUrl: p.authorPhotoUrl ?? null,
  quote: p.quote ?? "",
  rating: p.rating ?? 5,
  isFeatured: p.isFeatured ?? false,
  order: p.order ?? 0,
  published: p.published ?? true,
});

const mapTechnology = (p: PayloadTechnology): TechnologyItem => ({
  id: sourceId(p),
  name: p.name,
  slug: p.slug ?? null,
  category: p.category ?? "",
  description: p.description ?? null,
  highlights: strings(p.highlights, "value"),
  imageSrc: p.imageUrl ?? null,
  order: p.order ?? 0,
  published: p.published ?? true,
  content: p.content ?? null,
});

const mapClinicalCase = (p: PayloadClinicalCase): ClinicalCase => ({
  id: sourceId(p),
  slug: p.slug,
  title: p.title,
  category: p.category ?? "",
  treatment: p.treatment ?? "",
  duration: p.duration ?? "",
  description: p.description ?? null,
  tag: p.tag ?? "",
  cardImage: p.imageUrl ?? null,
  fullText: p.fullText ?? null,
  images: Array.isArray(p.images) ? p.images : [],
  order: p.order ?? 0,
  published: p.published ?? true,
});

const mapInternationalStep = (p: PayloadInternationalStep): InternationalStep => ({
  id: sourceNumberId(p),
  step_label: p.stepLabel ?? "",
  title: p.title,
  description: p.description ?? "",
  sort_order: p.order ?? 0,
});

const mapInternationalWhyItem = (p: PayloadInternationalWhyItem): InternationalWhyItem => ({
  id: sourceNumberId(p),
  title: p.title,
  description: p.description ?? "",
  sort_order: p.order ?? 0,
});

const mapInternationalTreatment = (p: PayloadInternationalTreatment): InternationalPopularTreatment => ({
  id: sourceNumberId(p),
  name: p.name,
  saving: p.saving ?? "",
  sort_order: p.order ?? 0,
});

const mapHeroSlide = (p: PayloadHeroSlide, index: number): HeroSlideDb => {
  const image = populatedMedia(p.image);
  return {
    id: `slide-${index + 1}`,
    eyebrow: p.eyebrow ?? null,
    title: p.title ?? null,
    description: p.description ?? null,
    imageSrc: image?.url ?? p.imageUrl ?? "",
    imageAlt: image?.alt ?? p.imageAlt ?? p.title ?? null,
    imagePosition: p.imagePosition ?? null,
    imageSize: p.imageSize ?? null,
    preserveFullImage: p.preserveFullImage ?? false,
    order: index + 1,
    published: true,
  };
};

const mapFaqItem = (p: PayloadFaqItem): FaqItem => ({
  id: sourceId(p),
  question: p.question,
  answer: p.answer ?? "",
  category: p.category ?? null,
  sort_order: p.order ?? 0,
});

const mapVideo = (p: PayloadVideo): Video => ({
  id: sourceId(p),
  title: p.title,
  url: p.url,
  thumbnail: p.thumbnail ?? null,
  description: p.description ?? null,
  category: p.category ?? "",
  doctor: p.doctor ?? null,
  topic: p.topic ?? null,
  treatment: p.treatment ?? null,
  order: p.order ?? 0,
  published: p.published ?? true,
});

const mapCareerPosition = (p: PayloadCareerPosition): CareerPosition => ({
  id: sourceId(p),
  title: p.title,
  slug: p.slug,
  department: p.department ?? null,
  type: p.type ?? null,
  location: p.location ?? null,
  description: p.description ?? null,
  requirements: strings(p.requirements, "value"),
  benefits: strings(p.benefits, "value"),
  order: p.order ?? 0,
  published: p.published ?? true,
});

const mapCommunityArticle = (p: PayloadCommunityArticle): CommunityArticle => ({
  id: sourceId(p),
  title: p.title,
  description: p.description ?? null,
  image: p.imageUrl ?? null,
  imageAlt: p.imageAlt ?? null,
  href: p.href ?? null,
  order: p.order ?? 0,
  published: p.published ?? true,
});

const mapTimelineEvent = (p: PayloadTimelineEvent): TimelineEvent => ({
  id: sourceId(p),
  year: p.year,
  caption: p.caption ?? "",
  heading: p.heading,
  body: p.body ?? "",
  imageSrc: p.imageUrl ?? "",
  imageAlt: p.imageAlt ?? null,
  imagePosition: p.imagePosition ?? null,
  order: p.order ?? 0,
  published: p.published ?? true,
});

const mapPublication = (p: PayloadPublication): Publication => ({
  id: sourceId(p),
  title: p.title,
  authors: p.authors ?? null,
  journal: p.journal ?? null,
  year: p.year ?? 0,
  doi: p.doi ?? null,
  url: p.url ?? null,
  abstract: p.abstract ?? null,
  order: p.order ?? 0,
  published: p.published ?? true,
});

const mapSiteStat = (p: PayloadSiteStat): PayloadSiteStatRow => ({
  key: p.key,
  display_value: p.displayValue ?? null,
  numeric_value: p.numericValue ?? null,
  suffix: p.suffix ?? null,
  label: p.label ?? "",
  sort_order: p.order ?? 0,
});

const mapFeatureCard = (p: PayloadFeatureCard): PayloadFeatureCardRow => ({
  slug: p.slug,
  title: p.title,
  description: p.description ?? "",
  image_src: p.imageUrl ?? "",
  image_alt: p.imageAlt ?? "",
  href: p.href ?? "",
  cta: p.cta ?? "",
});

const mapBrandLogo = (p: PayloadBrandLogo): PayloadBrandLogoRow => ({
  slug: p.slug,
  name: p.name,
  logo_src: p.logoUrl ?? "",
});

const mapPricingComparisonRow = (p: PayloadPricingComparisonRow): PayloadPricingComparisonRowShape => ({
  ada: p.ada ?? null,
  treatment: p.treatment,
  roomchang_price: p.roomchangPrice ?? "",
  australia_price: p.australiaPrice ?? "",
  singapore_price: p.singaporePrice ?? null,
  sort_order: p.order ?? 0,
});

const mapNewsArticle = (p: PayloadNewsArticle): PayloadNewsArticleShape => ({
  id: sourceId(p),
  slug: p.slug,
  date: p.date ?? "",
  title: p.title,
  description: p.description ?? "",
  image: p.imageUrl ?? "",
  imageAlt: p.imageAlt ?? "",
  body: strings(p.body, "paragraph"),
});

const mapCommunityArticleDetail = (p: PayloadCommunityArticleDetail): PayloadCommunityArticleShape => ({
  ...mapNewsArticle(p),
  href: p.href ?? null,
  images: strings(p.images, "url"),
});

// ── public API (mirrors data.ts signatures) ─────────────────────────────────

export async function getPayloadServices(): Promise<Service[]> {
  const docs = await payloadFind<PayloadService>("services", {
    "where[published][equals]": "true",
    sort: "order",
  });
  return docs.map(mapService);
}

export async function getPayloadServiceBySlug(slug: string): Promise<Service | null> {
  const docs = await payloadFind<PayloadService>("services", {
    "where[slug][equals]": slug,
    "where[published][equals]": "true",
    limit: "1",
  });
  return docs[0] ? mapService(docs[0]) : null;
}

export async function getPayloadDoctors(): Promise<Doctor[]> {
  const docs = await payloadFind<PayloadDoctor>("doctors", {
    "where[published][equals]": "true",
    sort: "order",
  });
  return docs.map(mapDoctor);
}

export async function getPayloadBranches(): Promise<Branch[]> {
  const docs = await payloadFind<PayloadBranch>("branches", {
    "where[published][equals]": "true",
    sort: "order",
  });
  return docs.map(mapBranch);
}

export async function getPayloadPricingCategories(): Promise<PricingCategory[]> {
  const [categories, items] = await Promise.all([
    payloadFind<PayloadPricingCategory>("pricing-categories", { sort: "order" }),
    payloadFind<PayloadPricingItem>("pricing-items", { sort: "order", depth: "1" }),
  ]);
  const mappedItems = items.map(mapPricingItem);
  return categories.map((category) => {
    const id = sourceId(category);
    return mapPricingCategory(
      category,
      mappedItems.filter((item) => item.categoryId === id),
    );
  });
}

export async function getPayloadTestimonials(): Promise<Testimonial[]> {
  const docs = await payloadFind<PayloadTestimonial>("testimonials", {
    "where[published][equals]": "true",
    sort: "order",
  });
  return docs.map(mapTestimonial);
}

export async function getPayloadTechnology(): Promise<TechnologyItem[]> {
  const docs = await payloadFind<PayloadTechnology>("technology", {
    "where[published][equals]": "true",
    sort: "order",
  });
  return docs.map(mapTechnology);
}

export async function getPayloadTechnologyBySlug(slug: string): Promise<TechnologyItem | null> {
  const docs = await payloadFind<PayloadTechnology>("technology", {
    "where[slug][equals]": slug,
    "where[published][equals]": "true",
    limit: "1",
  });
  return docs[0] ? mapTechnology(docs[0]) : null;
}

export async function getPayloadClinicalCases(): Promise<ClinicalCase[]> {
  const docs = await payloadFind<PayloadClinicalCase>("clinical-cases", {
    "where[published][equals]": "true",
    sort: "order",
  });
  return docs.map(mapClinicalCase);
}

export async function getPayloadClinicalCaseBySlug(slug: string): Promise<ClinicalCase | null> {
  const docs = await payloadFind<PayloadClinicalCase>("clinical-cases", {
    "where[slug][equals]": slug,
    "where[published][equals]": "true",
    limit: "1",
  });
  return docs[0] ? mapClinicalCase(docs[0]) : null;
}

export async function getPayloadInternationalSteps(): Promise<InternationalStep[]> {
  const docs = await payloadFind<PayloadInternationalStep>("international-steps", { sort: "order" });
  return docs.map(mapInternationalStep);
}

export async function getPayloadInternationalWhyItems(): Promise<InternationalWhyItem[]> {
  const docs = await payloadFind<PayloadInternationalWhyItem>("international-why-items", { sort: "order" });
  return docs.map(mapInternationalWhyItem);
}

export async function getPayloadInternationalPopularTreatments(): Promise<InternationalPopularTreatment[]> {
  const docs = await payloadFind<PayloadInternationalTreatment>("international-treatments", { sort: "order" });
  return docs.map(mapInternationalTreatment);
}

export async function getPayloadHeroSlides(): Promise<HeroSlideDb[]> {
  const doc = await getPayloadHomepageDoc();
  return (doc?.slides ?? []).map(mapHeroSlide);
}

export async function getPayloadHomepageSettings(): Promise<PayloadHomepageSettings | null> {
  const doc = await getPayloadHomepageDoc();
  if (!doc) return null;

  return {
    heroPill: doc.heroPill ?? null,
    heroButtons: (doc.heroButtons ?? []).flatMap((button) =>
      button.label && button.url ? [{ label: button.label, url: button.url }] : [],
    ),
  };
}

export async function getPayloadFaqItems(): Promise<FaqItem[]> {
  const docs = await payloadFind<PayloadFaqItem>("faq-items", {
    "where[published][equals]": "true",
    sort: "order",
  });
  return docs.map(mapFaqItem);
}

export async function getPayloadVideos(category?: string): Promise<Video[]> {
  const params: Record<string, string> = {
    "where[published][equals]": "true",
    sort: "order",
  };
  if (category) params["where[category][equals]"] = category;
  const docs = await payloadFind<PayloadVideo>("videos", params);
  return docs.map(mapVideo);
}

export async function getPayloadCareerPositions(): Promise<CareerPosition[]> {
  const docs = await payloadFind<PayloadCareerPosition>("career-positions", {
    "where[published][equals]": "true",
    sort: "order",
  });
  return docs.map(mapCareerPosition);
}

export async function getPayloadCareerPositionBySlug(slug: string): Promise<CareerPosition | null> {
  const docs = await payloadFind<PayloadCareerPosition>("career-positions", {
    "where[slug][equals]": slug,
    "where[published][equals]": "true",
    limit: "1",
  });
  return docs[0] ? mapCareerPosition(docs[0]) : null;
}

export async function getPayloadCommunityArticles(): Promise<CommunityArticle[]> {
  const docs = await payloadFind<PayloadCommunityArticle>("community-articles", {
    "where[published][equals]": "true",
    sort: "order",
  });
  return docs.map(mapCommunityArticle);
}

export async function getPayloadTimelineEvents(): Promise<TimelineEvent[]> {
  const docs = await payloadFind<PayloadTimelineEvent>("timeline-events", {
    "where[published][equals]": "true",
    sort: "order",
  });
  return docs.map(mapTimelineEvent);
}

export async function getPayloadPublications(): Promise<Publication[]> {
  const docs = await payloadFind<PayloadPublication>("publications", {
    "where[published][equals]": "true",
    sort: "-year",
  });
  return docs.map(mapPublication);
}

export async function getPayloadSiteStats(keys?: readonly string[]): Promise<PayloadSiteStatRow[]> {
  const docs = await payloadFind<PayloadSiteStat>("site-stats", {
    "where[published][equals]": "true",
    sort: "order",
  });
  const keySet = keys ? new Set<string>(keys) : null;
  return docs.filter((doc) => !keySet || keySet.has(doc.key)).map(mapSiteStat);
}

export async function getPayloadFeatureCards(): Promise<PayloadFeatureCardRow[]> {
  const docs = await payloadFind<PayloadFeatureCard>("feature-cards", { sort: "order" });
  return docs.map(mapFeatureCard);
}

export async function getPayloadBrandLogos(): Promise<PayloadBrandLogoRow[]> {
  const docs = await payloadFind<PayloadBrandLogo>("brand-logos", { sort: "order" });
  return docs.map(mapBrandLogo);
}

export async function getPayloadPartnerGroups(): Promise<PayloadPartnerGroup[]> {
  const [categories, partners] = await Promise.all([
    payloadFind<PayloadPartnerCategory>("partner-categories", { sort: "order" }),
    payloadFind<PayloadPartner>("partners", { sort: "order", depth: "1" }),
  ]);

  return categories.map((category) => {
    const id = sourceId(category);
    return {
      id,
      title: category.name,
      sortOrder: category.order ?? 0,
      partners: partners
        .filter((partner) => (partner.sourceCategoryId ?? relationSourceId(partner.category)) === id)
        .map((partner) => ({
          name: partner.name,
          ...(partner.logoUrl ? { logo: partner.logoUrl } : {}),
          ...(partner.website ? { website: partner.website } : {}),
        })),
    };
  });
}

export async function getPayloadPricingComparisonSet(
  slug: string,
): Promise<PayloadPricingComparisonSetShape | null> {
  const sets = await payloadFind<PayloadPricingComparisonSet>("pricing-comparison-sets", {
    "where[slug][equals]": slug,
    limit: "1",
  });
  const set = sets[0];
  if (!set) return null;

  const setId = sourceId(set);
  const rows = await payloadFind<PayloadPricingComparisonRow>("pricing-comparison-rows", {
    sort: "order",
    depth: "1",
  });

  return {
    exchange_rate: set.exchangeRate ?? null,
    source_note: set.sourceNote ?? null,
    pricing_comparison_rows: rows
      .filter((row) => (row.sourceSetId ?? relationSourceId(row.set)) === setId)
      .map(mapPricingComparisonRow),
  };
}

export async function getPayloadNewsArticles(): Promise<PayloadNewsArticleShape[]> {
  const docs = await payloadFind<PayloadNewsArticle>("news-articles", {
    "where[published][equals]": "true",
    sort: "order",
  });
  return docs.map(mapNewsArticle);
}

export async function getPayloadNewsArticleBySlug(slug: string): Promise<PayloadNewsArticleShape | null> {
  const docs = await payloadFind<PayloadNewsArticle>("news-articles", {
    "where[slug][equals]": slug,
    "where[published][equals]": "true",
    limit: "1",
  });
  return docs[0] ? mapNewsArticle(docs[0]) : null;
}

export async function getPayloadCommunityArticleDetails(): Promise<PayloadCommunityArticleShape[]> {
  const docs = await payloadFind<PayloadCommunityArticleDetail>("community-articles", {
    "where[published][equals]": "true",
    sort: "order",
  });
  return docs.map(mapCommunityArticleDetail);
}

export async function getPayloadCommunityArticleBySlug(slug: string): Promise<PayloadCommunityArticleShape | null> {
  const docs = await payloadFind<PayloadCommunityArticleDetail>("community-articles", {
    "where[slug][equals]": slug,
    "where[published][equals]": "true",
    limit: "1",
  });
  return docs[0] ? mapCommunityArticleDetail(docs[0]) : null;
}
