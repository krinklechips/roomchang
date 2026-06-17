import { createClient } from "@supabase/supabase-js";

// Fallback to a harmless placeholder during build if env vars aren't set yet.
// All data-fetching functions handle errors by returning [].
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * R2 CDN base URL for media assets. Defaults to the public bucket URL so
 * cdnUrl() still resolves to absolute R2 links if NEXT_PUBLIC_CDN_URL is ever
 * missing from the deployment env (an empty base produced relative /roomchang/…
 * paths that next/image couldn't fetch, breaking the facilities images). The
 * bucket URL is public (it's in DB media URLs and shipped to the browser), so
 * a hard-coded fallback is safe; the env var still overrides it.
 */
export const CDN_URL =
  process.env.NEXT_PUBLIC_CDN_URL || "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev";

/** Build a full CDN image URL from a relative path */
export function cdnUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${CDN_URL}/${path}`;
}
