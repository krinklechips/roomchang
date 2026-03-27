import { supabase } from "./supabase";

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

export type TechnologyItem = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  highlights: string[];
  imageSrc: string | null;
  order: number;
  published: boolean;
};

export type ClinicalCase = {
  id: string;
  title: string;
  category: string;
  treatment: string;
  duration: string;
  description: string | null;
  tag: string;
  order: number;
  published: boolean;
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

export async function getClinicalCases(): Promise<ClinicalCase[]> {
  const { data, error } = await supabase
    .from("clinical_cases")
    .select("*")
    .eq("published", true)
    .order("order");

  if (error) {
    console.error("Failed to fetch clinical cases:", error.message);
    return [];
  }
  return data ?? [];
}
