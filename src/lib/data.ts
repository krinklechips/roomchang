import { cache } from "react";
import { supabase } from "./supabase";
import { supabaseServer } from "./supabase-server";
import { getTranslatedFields, getTranslatedFieldsBatch, mergeTranslation } from "./i18n-content";
import {
  getPayloadBranches,
  getPayloadCareerPositionBySlug,
  getPayloadCareerPositions,
  getPayloadClinicalCaseBySlug,
  getPayloadClinicalCases,
  getPayloadCommunityArticles,
  getPayloadDoctors,
  getPayloadFaqItems,
  getPayloadHeroSlides,
  getPayloadInternationalPopularTreatments,
  getPayloadInternationalSteps,
  getPayloadInternationalWhyItems,
  getPayloadPricingCategories,
  getPayloadPublications,
  getPayloadServiceBySlug,
  getPayloadServices,
  getPayloadTechnology,
  getPayloadTechnologyBySlug,
  getPayloadTestimonials,
  getPayloadTimelineEvents,
  getPayloadVideos,
  isPayloadSource,
} from "./payload-source";

// ─── Types ──────────────────────────────────────────────────────────────────

export type Doctor = {
  id: string;
  name: string;
  credentials: string;
  role: string;
  department: string;
  specialty: string[];
  languages: string[];
  bio: string | null;
  note: string | null;
  initials: string;
  photoUrl: string | null;
  order: number;
  published: boolean;
};

export type Branch = {
  id: string;
  name: string;
  address: string;
  phone: string;
  mobile: string | null;
  email: string | null;
  hours: string;
  order: number;
  published: boolean;
  /** Official Google Maps place link (share/cid) — exact pin + place page. */
  map_place_url: string | null;
};

export type PricingCategory = {
  id: string;
  title: string;
  icon: string;
  order: number;
  items: PricingItem[];
};

export type PricingItem = {
  id: string;
  name: string;
  price: string;
  note: string | null;
  ada: string | null;
  aus: string | null;
  order: number;
  categoryId: string;
};

export type ServiceSection =
  | { type: "callout"; icon?: string; title: string; body: string; stats?: { value: string; label: string }[] }
  | { type: "text"; heading: string; body: string; card?: boolean }
  | { type: "list"; heading?: string; items: string[] }
  | { type: "cards"; heading: string; subheading?: string; numbered?: boolean; columns?: number; items: { title: string; body: string; tag?: string; icon?: string; badge?: string; spec?: string; link?: string }[] }
  | { type: "steps"; heading: string; subheading?: string; items: { step: string; detail: string }[] }
  | { type: "pricing"; heading?: string; subheading?: string; rows: { treatment: string; price: string }[] }
  | { type: "pricetable"; heading?: string; subheading?: string; rows: { treatment: string; price: string }[] }
  | { type: "gallery"; heading?: string; subheading?: string; images: string[] }
  | { type: "image"; heading?: string; subheading?: string; src: string; alt: string; caption?: string; size?: "small" | "medium" | "large" | "full"; width?: number; height?: number }
  | { type: "twocol"; left: ServiceSection; right: ServiceSection };

export type Service = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  features: string[];
  icon: string | null;
  imageSrc: string | null;
  isFeatured: boolean;
  order: number;
  published: boolean;
  eyebrow: string | null;
  heroDescription: string | null;
  content: { sections: ServiceSection[] } | null;
};

export type Testimonial = {
  id: string;
  authorName: string;
  authorTitle: string | null;
  authorPhotoUrl: string | null;
  quote: string;
  rating: number;
  isFeatured: boolean;
  order: number;
  published: boolean;
};

export type TechSection =
  | { type: "callout"; icon?: string; title: string; body: string }
  | { type: "text"; heading: string; body: string; card?: boolean }
  | { type: "cards"; heading: string; subheading?: string; columns?: number; items: { title: string; body: string; icon?: string }[] }
  | { type: "steps"; heading: string; subheading?: string; items: { step: string; detail: string }[] }
  | { type: "video"; heading?: string; subheading?: string; videoId: string }
  | { type: "image"; src: string; alt: string; caption?: string; size?: "small" | "medium" | "full" }
  | { type: "image_pair"; left: { src: string; alt: string; caption?: string }; right: { src: string; alt: string; caption?: string } }
  | { type: "self_video"; src: string; heading?: string; caption?: string }
  | { type: "twocol"; left: TechSection; right: TechSection };

export type TechnologyItem = {
  id: string;
  name: string;
  slug: string | null;
  category: string;
  description: string | null;
  highlights: string[];
  imageSrc: string | null;
  order: number;
  published: boolean;
  content: { sections: TechSection[] } | null;
};

export type ClinicalCase = {
  id: string;
  slug: string;
  title: string;
  category: string;
  treatment: string;
  duration: string;
  description: string | null;
  tag: string;
  cardImage: string | null;   // maps from imageUrl column
  fullText: string | null;
  images: { src: string; caption?: string }[];
  order: number;
  published: boolean;
};

export type HeroSlideDb = {
  id: string;
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  imageSrc: string;
  imageAlt: string | null;
  imagePosition: string | null;
  imageSize: string | null;
  preserveFullImage: boolean;
  order: number;
  published: boolean;
};

export type SeoPageMeta = {
  path: string;
  title: string | null;
  description: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
};

export type WarrantyCoverageRow = {
  treatment: string;
  coverage: string;
  period: string;
};

export type WarrantyTerms = {
  intro: string | null;
  coverageRows: WarrantyCoverageRow[];
  covered: string[];
  notCovered: string[];
  validityConditions: string[];
  validityNote: string | null;
  postWarrantyIntro: string | null;
  postWarrantyBenefit: string | null;
  postWarrantyTerms: string[];
  limitationOfLiability: string | null;
  nonTransferability: string | null;
  clinicalAssessment: string | null;
  contactWebsite: string | null;
  contactPhone: string | null;
  discrepancyNote: string | null;
};

// ─── Queries ────────────────────────────────────────────────────────────────

export async function getDoctors(): Promise<Doctor[]> {
  // Dummy-site mode: content comes from the Payload CMS (live → CMS → dummy).
  if (isPayloadSource()) return getPayloadDoctors();
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("published", true)
    .order("order");

  if (error) {
    console.error("Failed to fetch doctors:", error.message);
    return [];
  }
  const doctors = data ?? [];
  const tr = await getTranslatedFieldsBatch("doctor", doctors.map((d) => d.id));
  return doctors.map((d) => mergeTranslation(d, tr.get(d.id) ?? {}));
}

export async function getBranches(): Promise<Branch[]> {
  if (isPayloadSource()) return getPayloadBranches();
  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .eq("published", true)
    .order("order");

  if (error) {
    console.error("Failed to fetch branches:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getPricingCategories(): Promise<PricingCategory[]> {
  if (isPayloadSource()) return getPayloadPricingCategories();
  const { data: categories, error: catErr } = await supabase
    .from("pricing_categories")
    .select("*")
    .order("order");

  if (catErr) {
    console.error("Failed to fetch pricing categories:", catErr.message);
    return [];
  }

  const { data: items, error: itemErr } = await supabase
    .from("pricing_items")
    .select("*")
    .order("order");

  if (itemErr) {
    console.error("Failed to fetch pricing items:", itemErr.message);
    return [];
  }

  // Overlay active-locale translations (content_translations): category titles
  // (entity 'pricing_category'/id) and item names (entity 'pricing_item'/id).
  const catTr = await getTranslatedFieldsBatch(
    "pricing_category",
    (categories ?? []).map((c) => c.id),
  );
  const itemTr = await getTranslatedFieldsBatch(
    "pricing_item",
    (items ?? []).map((i) => i.id),
  );

  return (categories ?? []).map((cat) => ({
    ...mergeTranslation(cat, catTr.get(cat.id) ?? {}),
    items: (items ?? [])
      .filter((item) => item.categoryId === cat.id)
      .map((item) => mergeTranslation(item, itemTr.get(item.id) ?? {})),
  }));
}

export async function getServices(): Promise<Service[]> {
  if (isPayloadSource()) return getPayloadServices();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("published", true)
    .order("order");

  if (error) {
    console.error("Failed to fetch services:", error.message);
    return [];
  }
  const services = data ?? [];
  // Overlay active-locale translations (no-op on en / when none exist)
  const translations = await getTranslatedFieldsBatch("service", services.map((s) => s.id));
  return services.map((s) => mergeTranslation(s, translations.get(s.id) ?? {}));
}

export const getServiceBySlug = cache(async function getServiceBySlug(slug: string): Promise<Service | null> {
  if (isPayloadSource()) return getPayloadServiceBySlug(slug);
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) {
    console.error("Failed to fetch service:", error.message);
    return null;
  }
  if (!data) return null;
  const translations = await getTranslatedFields("service", data.id);
  return mergeTranslation(data, translations);
});

export async function getTestimonials(): Promise<Testimonial[]> {
  if (isPayloadSource()) return getPayloadTestimonials();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("order");

  if (error) {
    console.error("Failed to fetch testimonials:", error.message);
    return [];
  }
  const testimonials = data ?? [];
  const tr = await getTranslatedFieldsBatch("testimonial", testimonials.map((t) => t.id));
  return testimonials.map((t) => mergeTranslation(t, tr.get(t.id) ?? {}));
}

export async function getTechnology(): Promise<TechnologyItem[]> {
  if (isPayloadSource()) return getPayloadTechnology();
  const { data, error } = await supabase
    .from("technology")
    .select("*")
    .eq("published", true)
    .order("order");

  if (error) {
    console.error("Failed to fetch technology:", error.message);
    return [];
  }
  const tech = data ?? [];
  const tr = await getTranslatedFieldsBatch("technology", tech.map((t) => t.id));
  return tech.map((t) => mergeTranslation(t, tr.get(t.id) ?? {}));
}

export const getTechnologyBySlug = cache(async function getTechnologyBySlug(slug: string): Promise<TechnologyItem | null> {
  if (isPayloadSource()) return getPayloadTechnologyBySlug(slug);
  const { data, error } = await supabase
    .from("technology")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) {
    console.error("Failed to fetch technology:", error.message);
    return null;
  }
  if (!data) return null;
  return mergeTranslation(data, await getTranslatedFields("technology", data.id));
});

export async function getClinicalCases(): Promise<ClinicalCase[]> {
  if (isPayloadSource()) return getPayloadClinicalCases();
  const { data, error } = await supabase
    .from("clinical_cases")
    .select("id, slug, title, category, treatment, duration, description, tag, imageUrl, fullText, images, order, published")
    .eq("published", true)
    .order("order");

  if (error) {
    console.error("Failed to fetch clinical cases:", error.message);
    return [];
  }
  const cases = (data ?? []).map((row) => ({
    ...row,
    cardImage: row.imageUrl ?? null,
    images: Array.isArray(row.images) ? row.images : [],
  }));
  const tr = await getTranslatedFieldsBatch("clinical_case", cases.map((c) => c.id));
  return cases.map((c) => mergeTranslation(c, tr.get(c.id) ?? {}));
}

export const getClinicalCaseBySlug = cache(async function getClinicalCaseBySlug(slug: string): Promise<ClinicalCase | null> {
  if (isPayloadSource()) return getPayloadClinicalCaseBySlug(slug);
  const { data, error } = await supabase
    .from("clinical_cases")
    .select("id, slug, title, category, treatment, duration, description, tag, imageUrl, fullText, images, order, published")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) {
    console.error("Failed to fetch clinical case:", error.message);
    return null;
  }
  if (!data) return null;
  const base = { ...data, cardImage: data.imageUrl ?? null, images: Array.isArray(data.images) ? data.images : [] };
  return mergeTranslation(base, await getTranslatedFields("clinical_case", data.id));
});

export type InternationalStep = {
  id: number;
  step_label: string;
  title: string;
  description: string;
  sort_order: number;
};

export type InternationalWhyItem = {
  id: number;
  title: string;
  description: string;
  sort_order: number;
};

export type InternationalPopularTreatment = {
  id: number;
  name: string;
  saving: string;
  sort_order: number;
};

export async function getInternationalSteps(): Promise<InternationalStep[]> {
  if (isPayloadSource()) return getPayloadInternationalSteps();
  const { data, error } = await supabaseServer
    .from("international_steps")
    .select("*")
    .order("sort_order");
  if (error) { console.error("Failed to fetch international steps:", error.message); return []; }
  const tr = await getTranslatedFieldsBatch("international_step", (data ?? []).map((s) => s.id));
  return (data ?? []).map((s) => mergeTranslation(s, tr.get(String(s.id)) ?? {}));
}

export async function getInternationalWhyItems(): Promise<InternationalWhyItem[]> {
  if (isPayloadSource()) return getPayloadInternationalWhyItems();
  const { data, error } = await supabaseServer
    .from("international_why_items")
    .select("*")
    .order("sort_order");
  if (error) { console.error("Failed to fetch international why items:", error.message); return []; }
  const tr = await getTranslatedFieldsBatch("international_why_item", (data ?? []).map((w) => w.id));
  return (data ?? []).map((w) => mergeTranslation(w, tr.get(String(w.id)) ?? {}));
}

export async function getInternationalPopularTreatments(): Promise<InternationalPopularTreatment[]> {
  if (isPayloadSource()) return getPayloadInternationalPopularTreatments();
  const { data, error } = await supabaseServer
    .from("international_popular_treatments")
    .select("*")
    .order("sort_order");
  if (error) { console.error("Failed to fetch popular treatments:", error.message); return []; }
  const tr = await getTranslatedFieldsBatch("international_popular_treatment", (data ?? []).map((p) => p.id));
  return (data ?? []).map((p) => mergeTranslation(p, tr.get(String(p.id)) ?? {}));
}

export async function getHeroSlides(): Promise<HeroSlideDb[]> {
  if (isPayloadSource()) return getPayloadHeroSlides();
  const { data, error } = await supabase
    .from("hero_slides")
    .select("*")
    .eq("published", true)
    .order("order");

  if (error) {
    console.error("Failed to fetch hero slides:", error.message);
    return [];
  }
  return data ?? [];
}

export const getSeoPageMeta = cache(async function getSeoPageMeta(path: string): Promise<SeoPageMeta | null> {
  const { data, error } = await supabaseServer
    .from("seo_page_meta")
    .select(`
      page_path,
      title,
      description,
      og_title,
      og_description,
      og_image,
      twitter_title,
      twitter_description,
      twitter_image,
      canonical_url,
      noindex
    `)
    .eq("page_path", path)
    .maybeSingle();

  // maybeSingle() returns data=null (no error) when no override row exists for
  // this path — the normal case, since most pages rely on their built-in
  // metadata. A non-null error here is a genuine failure worth surfacing.
  if (error) {
    console.error(`Failed to fetch SEO page meta for ${path}:`, error.message);
    return null;
  }
  if (!data) {
    return null;
  }

  return {
    path: data.page_path,
    title: data.title ?? null,
    description: data.description ?? null,
    ogTitle: data.og_title ?? null,
    ogDescription: data.og_description ?? null,
    ogImage: data.og_image ?? null,
    twitterTitle: data.twitter_title ?? null,
    twitterDescription: data.twitter_description ?? null,
    twitterImage: data.twitter_image ?? null,
    canonicalUrl: data.canonical_url ?? null,
    noIndex: Boolean(data.noindex),
  };
});

// ─── Blog & FAQ Types ─────────────────────────────────────────────────────

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  category: "dentist-talks" | "publications";
  author_name: string | null;
  author_id: string | null;
  cover_image: string | null;
  featured: boolean;
  published_at: string | null;
};

// ─── Blog & FAQ Queries ───────────────────────────────────────────────────

export async function getFaqItems(): Promise<FaqItem[]> {
  if (isPayloadSource()) return getPayloadFaqItems();
  const { data, error } = await supabase
    .from("faq_items")
    .select("id, question, answer, category, sort_order")
    .eq("published", true)
    .order("sort_order");

  if (error) {
    console.error("Failed to fetch FAQ items:", error.message);
    return [];
  }
  const faqs = data ?? [];
  const tr = await getTranslatedFieldsBatch("faq", faqs.map((f) => f.id));
  return faqs.map((f) => mergeTranslation(f, tr.get(f.id) ?? {}));
}

export async function getBlogPosts(category?: "dentist-talks" | "publications"): Promise<BlogPost[]> {
  let query = supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, body, category, author_name, author_id, cover_image, featured, published_at")
    .eq("published", true)
    .order("sort_order");

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Failed to fetch blog posts:", error.message);
    return [];
  }
  return data ?? [];
}

export const getBlogPostBySlug = cache(async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, body, category, author_name, author_id, cover_image, featured, published_at")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error) {
    console.error("Failed to fetch blog post:", error.message);
    return null;
  }
  return data ?? null;
});

// ── Videos ──
export type Video = {
  id: string;
  title: string;
  url: string;
  thumbnail: string | null;
  description: string | null;
  category: string;
  doctor: string | null;
  topic: string | null;
  treatment: string | null;
  order: number;
  published: boolean;
};

export async function getVideos(category?: string): Promise<Video[]> {
  if (isPayloadSource()) return getPayloadVideos(category);
  let query = supabase
    .from("videos")
    .select("*")
    .eq("published", true)
    .order("order");
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) {
    console.error("Failed to fetch videos:", error.message);
    return [];
  }
  return data ?? [];
}

// ── Career Positions ──
export type CareerPosition = {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  type: string | null;
  location: string | null;
  description: string | null;
  requirements: string[];
  benefits: string[];
  order: number;
  published: boolean;
};

export async function getCareerPositions(): Promise<CareerPosition[]> {
  if (isPayloadSource()) return getPayloadCareerPositions();
  const { data, error } = await supabase
    .from("career_positions")
    .select("*")
    .eq("published", true)
    .order("order");
  if (error) {
    console.error("Failed to fetch career positions:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCareerPositionBySlug(slug: string): Promise<CareerPosition | null> {
  if (isPayloadSource()) return getPayloadCareerPositionBySlug(slug);
  const { data, error } = await supabase
    .from("career_positions")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  if (error) {
    console.error("Failed to fetch career position:", error.message);
    return null;
  }
  return data ?? null;
}

// ── Community Articles ──
export type CommunityArticle = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  imageAlt: string | null;
  href: string | null;
  order: number;
  published: boolean;
};

export async function getCommunityArticles(): Promise<CommunityArticle[]> {
  if (isPayloadSource()) return getPayloadCommunityArticles();
  const { data, error } = await supabase
    .from("community_articles")
    .select("*")
    .eq("published", true)
    .order("order");
  if (error) {
    console.error("Failed to fetch community articles:", error.message);
    return [];
  }
  return data ?? [];
}

// ── Timeline Events ──
export type TimelineEvent = {
  id: string;
  year: string;
  caption: string;
  heading: string;
  body: string;
  imageSrc: string;
  imageAlt: string | null;
  imagePosition: string | null;
  order: number;
  published: boolean;
};

export async function getTimelineEvents(): Promise<TimelineEvent[]> {
  if (isPayloadSource()) return getPayloadTimelineEvents();
  const { data, error } = await supabase
    .from("timeline_events")
    .select("*")
    .eq("published", true)
    .order("order");
  if (error) {
    console.error("Failed to fetch timeline events:", error.message);
    return [];
  }
  return data ?? [];
}

// ── Publications ──
export type Publication = {
  id: string;
  title: string;
  authors: string | null;
  journal: string | null;
  year: number;
  doi: string | null;
  url: string | null;
  abstract: string | null;
  order: number;
  published: boolean;
};

// ── Warranty Terms ──
// Single-doc content for /pricing/warranty. Stored in Supabase (`warranty_terms`)
// so the clinic can edit the legal text without a redeploy. Legal/medical copy is
// English-only for now (translations held for sign-off), so no i18n overlay here.
// Fail-loud: returns null on error/missing so the page shows a visible fallback
// notice rather than blank or fabricated terms.
export async function getWarrantyTerms(): Promise<WarrantyTerms | null> {
  const { data, error } = await supabase
    .from("warranty_terms")
    .select("*")
    .eq("published", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch warranty terms:", error.message);
    return null;
  }
  if (!data) {
    console.warn("No published warranty_terms row found.");
    return null;
  }

  const asStrings = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

  return {
    intro: data.intro ?? null,
    coverageRows: Array.isArray(data.coverage_rows)
      ? (data.coverage_rows as WarrantyCoverageRow[])
      : [],
    covered: asStrings(data.covered),
    notCovered: asStrings(data.not_covered),
    validityConditions: asStrings(data.validity_conditions),
    validityNote: data.validity_note ?? null,
    postWarrantyIntro: data.post_warranty_intro ?? null,
    postWarrantyBenefit: data.post_warranty_benefit ?? null,
    postWarrantyTerms: asStrings(data.post_warranty_terms),
    limitationOfLiability: data.limitation_of_liability ?? null,
    nonTransferability: data.non_transferability ?? null,
    clinicalAssessment: data.clinical_assessment ?? null,
    contactWebsite: data.contact_website ?? null,
    contactPhone: data.contact_phone ?? null,
    discrepancyNote: data.discrepancy_note ?? null,
  };
}

export async function getPublications(): Promise<Publication[]> {
  if (isPayloadSource()) return getPayloadPublications();
  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .eq("published", true)
    .order("year", { ascending: false });
  if (error) {
    console.error("Failed to fetch publications:", error.message);
    return [];
  }
  return data ?? [];
}
