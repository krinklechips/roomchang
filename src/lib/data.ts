import { cache } from "react";
import { supabase } from "./supabase";
import { supabaseServer } from "./supabase-server";

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
  ada: string | null;
  aus: string | null;
  order: number;
  categoryId: string;
};

export type ServiceSection =
  | { type: "callout"; icon?: string; title: string; body: string; stats?: { value: string; label: string }[] }
  | { type: "text"; heading: string; body: string; card?: boolean }
  | { type: "list"; heading?: string; items: string[] }
  | { type: "cards"; heading: string; subheading?: string; numbered?: boolean; columns?: number; items: { title: string; body: string; tag?: string; icon?: string; badge?: string; spec?: string }[] }
  | { type: "steps"; heading: string; subheading?: string; items: { step: string; detail: string }[] }
  | { type: "pricing"; heading?: string; subheading?: string; rows: { treatment: string; price: string }[] }
  | { type: "twocol"; left: ServiceSection; right: ServiceSection };

export type Service = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  features: string[];
  icon: string | null;
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
  | { type: "steps"; heading: string; subheading?: string; items: { step: string; detail: string }[] };

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

// ─── Queries ────────────────────────────────────────────────────────────────

export async function getDoctors(): Promise<Doctor[]> {
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("published", true)
    .order("order");

  if (error) {
    console.error("Failed to fetch doctors:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getBranches(): Promise<Branch[]> {
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

  return (categories ?? []).map((cat) => ({
    ...cat,
    items: (items ?? []).filter((item) => item.categoryId === cat.id),
  }));
}

export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("published", true)
    .order("order");

  if (error) {
    console.error("Failed to fetch services:", error.message);
    return [];
  }
  return data ?? [];
}

export const getServiceBySlug = cache(async function getServiceBySlug(slug: string): Promise<Service | null> {
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
  return data ?? null;
});

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("order");

  if (error) {
    console.error("Failed to fetch testimonials:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getTechnology(): Promise<TechnologyItem[]> {
  const { data, error } = await supabase
    .from("technology")
    .select("*")
    .eq("published", true)
    .order("order");

  if (error) {
    console.error("Failed to fetch technology:", error.message);
    return [];
  }
  return data ?? [];
}

export const getTechnologyBySlug = cache(async function getTechnologyBySlug(slug: string): Promise<TechnologyItem | null> {
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
  return data ?? null;
});

export async function getClinicalCases(): Promise<ClinicalCase[]> {
  const { data, error } = await supabase
    .from("clinical_cases")
    .select("id, slug, title, category, treatment, duration, description, tag, imageUrl, fullText, images, order, published")
    .eq("published", true)
    .order("order");

  if (error) {
    console.error("Failed to fetch clinical cases:", error.message);
    return [];
  }
  return (data ?? []).map((row) => ({
    ...row,
    cardImage: row.imageUrl ?? null,
    images: Array.isArray(row.images) ? row.images : [],
  }));
}

export const getClinicalCaseBySlug = cache(async function getClinicalCaseBySlug(slug: string): Promise<ClinicalCase | null> {
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
  return data ? { ...data, cardImage: data.imageUrl ?? null, images: Array.isArray(data.images) ? data.images : [] } : null;
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
  const { data, error } = await supabaseServer
    .from("international_steps")
    .select("*")
    .order("sort_order");
  if (error) { console.error("Failed to fetch international steps:", error.message); return []; }
  return data ?? [];
}

export async function getInternationalWhyItems(): Promise<InternationalWhyItem[]> {
  const { data, error } = await supabaseServer
    .from("international_why_items")
    .select("*")
    .order("sort_order");
  if (error) { console.error("Failed to fetch international why items:", error.message); return []; }
  return data ?? [];
}

export async function getInternationalPopularTreatments(): Promise<InternationalPopularTreatment[]> {
  const { data, error } = await supabaseServer
    .from("international_popular_treatments")
    .select("*")
    .order("sort_order");
  if (error) { console.error("Failed to fetch popular treatments:", error.message); return []; }
  return data ?? [];
}

export async function getHeroSlides(): Promise<HeroSlideDb[]> {
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
    .single();

  if (error || !data) {
    if (error) {
      console.error(`Failed to fetch SEO page meta for ${path}:`, error.message);
    }
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
