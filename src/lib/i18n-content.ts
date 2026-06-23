import { getLocale } from "next-intl/server";
import { LOCALE_TO_LANG } from "@/i18n/routing";
import { supabase } from "./supabase";

/**
 * Locale-aware content overlay.
 *
 * Page/section text lives in the DB in English. Translations are stored in the
 * `content_translations` table keyed by (entity_type, entity_id, locale, field),
 * with `value` (jsonb) mirroring the source field's shape (string, array, or
 * object). These helpers fetch the active-locale overrides so callers can merge
 * them over the English base, falling back to English for any missing field.
 *
 * On the default locale (en) — or if no request locale is available — they
 * return empty, so the English source is used unchanged.
 */

type FieldMap = Record<string, unknown>;

async function activeLocale(): Promise<string | null> {
  try {
    return await getLocale();
  } catch {
    return null; // called outside a request (e.g. build-time static gen of /en)
  }
}

/** Translated fields for a single entity. Empty on `en` / no translations. */
export async function getTranslatedFields(
  entityType: string,
  entityId: string | number,
): Promise<FieldMap> {
  const locale = await activeLocale();
  if (!locale || locale === "en") return {};

  const { data, error } = await supabase
    .from("content_translations")
    .select("field, value")
    .eq("entity_type", entityType)
    .eq("entity_id", String(entityId))
    .eq("locale", LOCALE_TO_LANG[locale] ?? locale);

  if (error || !data) return {};
  const out: FieldMap = {};
  for (const row of data as { field: string; value: unknown }[]) {
    if (row.value !== null && row.value !== undefined) out[row.field] = row.value;
  }
  return out;
}

/** Translated fields for many entities at once → Map<entityId, fields>. */
export async function getTranslatedFieldsBatch(
  entityType: string,
  entityIds: (string | number)[],
): Promise<Map<string, FieldMap>> {
  const map = new Map<string, FieldMap>();
  const locale = await activeLocale();
  if (!locale || locale === "en" || entityIds.length === 0) return map;

  const { data, error } = await supabase
    .from("content_translations")
    .select('entity_id, field, value')
    .eq("entity_type", entityType)
    .eq("locale", LOCALE_TO_LANG[locale] ?? locale)
    .in("entity_id", entityIds.map(String));

  if (error || !data) return map;
  for (const row of data as { entity_id: string; field: string; value: unknown }[]) {
    if (row.value === null || row.value === undefined) continue;
    if (!map.has(row.entity_id)) map.set(row.entity_id, {});
    map.get(row.entity_id)![row.field] = row.value;
  }
  return map;
}

/** Overlay translated fields onto an English base object. */
export function mergeTranslation<T extends object>(base: T, fields: FieldMap): T {
  if (!fields || Object.keys(fields).length === 0) return base;
  return { ...base, ...fields } as T;
}
