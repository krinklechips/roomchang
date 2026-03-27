import { createClient } from "@supabase/supabase-js";

// Fallback to a harmless placeholder during build if env vars aren't set yet.
// All data-fetching functions handle errors by returning [].
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** R2 CDN base URL for media assets */
export const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL ?? "";

/** Build a full CDN image URL from a relative path */
export function cdnUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${CDN_URL}/${path}`;
}
