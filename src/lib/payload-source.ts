import "server-only";

import { getLocale } from "next-intl/server";
import { LOCALE_TO_LANG } from "@/i18n/routing";
import type { Doctor, Service } from "./data";

/**
 * DUMMY-SITE data source: reads content from the Serviette Payload CMS
 * instead of Supabase. Enabled per-deployment via CONTENT_SOURCE=payload
 * (see `npm run dev:payload`). The LIVE deployment never sets this, so
 * production keeps reading Supabase — structure: live ─▶ CMS ─▶ dummy.
 *
 * Localization is native in Payload: we pass ?locale=km|zh and get merged
 * documents back — no content_translations overlay needed here.
 */

export const isPayloadSource = () => process.env.CONTENT_SOURCE === "payload";

const API = () => process.env.PAYLOAD_API_URL || "http://localhost:3100";

/** Current request's language (en/km/zh) from the URL locale (en/kh/cn). */
async function payloadLocale(): Promise<string> {
  try {
    const locale = await getLocale();
    return LOCALE_TO_LANG[locale] ?? locale;
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

type PayloadService = {
  id: number | string;
  sourceId?: string | null;
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

type PayloadDoctor = {
  id: number | string;
  sourceId?: string | null;
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

const strings = (arr: { [k: string]: string | null | undefined }[] | null | undefined, key: string): string[] =>
  (arr ?? []).map((x) => x?.[key]).filter((v): v is string => typeof v === "string" && v.trim() !== "");

const mapService = (p: PayloadService): Service => ({
  id: p.sourceId ?? String(p.id),
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
  id: p.sourceId ?? String(p.id),
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
