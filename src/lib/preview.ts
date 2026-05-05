import "server-only";

import { supabaseServer } from "./supabase-server";
import type { Service, TechnologyItem, Doctor } from "./data";

// ─── Types ─────────────────────────────────────────────────────────────────

export type EntityType =
  | "service"
  | "technology"
  | "doctor"
  | "clinical_case"
  | "hero_slide"
  | "page";

export type ContentDraft = {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  draft_data: Record<string, unknown>;
  updated_at: string;
  updated_by: string | null;
};

// ─── Draft CRUD ────────────────────────────────────────────────────────────

/** Get a single draft by entity type + id */
export async function getDraft(
  entityType: EntityType,
  entityId: string,
): Promise<ContentDraft | null> {
  const { data, error } = await supabaseServer
    .from("content_drafts")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .single();

  if (error || !data) return null;
  return data as ContentDraft;
}

/** List all drafts, optionally filtered by entity type */
export async function listDrafts(
  entityType?: EntityType,
): Promise<ContentDraft[]> {
  let query = supabaseServer
    .from("content_drafts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (entityType) {
    query = query.eq("entity_type", entityType);
  }

  const { data, error } = await query;
  if (error) {
    console.error("[Preview] Failed to list drafts:", error.message);
    return [];
  }
  return (data ?? []) as ContentDraft[];
}

/** Save (upsert) a draft */
export async function saveDraft(
  entityType: EntityType,
  entityId: string,
  draftData: Record<string, unknown>,
  updatedBy?: string,
): Promise<ContentDraft | null> {
  const { data, error } = await supabaseServer
    .from("content_drafts")
    .upsert(
      {
        entity_type: entityType,
        entity_id: entityId,
        draft_data: draftData,
        updated_at: new Date().toISOString(),
        updated_by: updatedBy ?? null,
      },
      { onConflict: "entity_type,entity_id" },
    )
    .select()
    .single();

  if (error) {
    console.error("[Preview] Failed to save draft:", error.message);
    return null;
  }
  return data as ContentDraft;
}

/** Delete a draft */
export async function deleteDraft(
  entityType: EntityType,
  entityId: string,
): Promise<boolean> {
  const { error } = await supabaseServer
    .from("content_drafts")
    .delete()
    .eq("entity_type", entityType)
    .eq("entity_id", entityId);

  if (error) {
    console.error("[Preview] Failed to delete draft:", error.message);
    return false;
  }
  return true;
}

// ─── Safety helpers ────────────────────────────────────────────────────────

/**
 * Safely merge draft data over live data with runtime type guards.
 * Prevents crashes from malformed drafts (e.g. `{ highlights: null }`).
 */
function safeMerge<T extends Record<string, unknown>>(
  live: T,
  draft: Record<string, unknown>,
): T {
  const merged = { ...live };

  for (const [key, value] of Object.entries(draft)) {
    if (!(key in live)) continue; // skip unknown keys

    const liveValue = live[key];

    // Protect array fields from being overwritten with null/non-array
    if (Array.isArray(liveValue)) {
      if (Array.isArray(value)) {
        (merged as Record<string, unknown>)[key] = value;
      }
      // else: skip — don't replace array with null/string/etc.
      continue;
    }

    // Protect object fields (like content) from being set to non-object
    if (liveValue !== null && typeof liveValue === "object" && !Array.isArray(liveValue)) {
      if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        (merged as Record<string, unknown>)[key] = value;
      }
      continue;
    }

    // For primitives, allow the override (including null)
    (merged as Record<string, unknown>)[key] = value;
  }

  return merged;
}

// ─── Preview data helpers ──────────────────────────────────────────────────
// These fetch draft data and merge over live data so the preview
// shows the exact same shape the live components expect.

/** Get a service for preview: draft merged over live, or live fallback */
export async function getPreviewService(
  slug: string,
): Promise<Service | null> {
  // Fetch live data
  const { data: live } = await supabaseServer
    .from("services")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!live) return null;

  // Check for draft
  const draft = await getDraft("service", live.id);
  if (draft) {
    return safeMerge(live, draft.draft_data) as Service;
  }
  return live as Service;
}

/** Get a technology item for preview: draft merged over live */
export async function getPreviewTechnology(
  slug: string,
): Promise<TechnologyItem | null> {
  const { data: live } = await supabaseServer
    .from("technology")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!live) return null;

  const draft = await getDraft("technology", live.id);
  if (draft) {
    return safeMerge(live, draft.draft_data) as TechnologyItem;
  }
  return live as TechnologyItem;
}

/** Get all doctors for preview: drafts merged over live */
export async function getPreviewDoctors(): Promise<Doctor[]> {
  const { data: live } = await supabaseServer
    .from("doctors")
    .select("*")
    .order("order");

  if (!live) return [];

  // Load all doctor drafts
  const drafts = await listDrafts("doctor");
  const draftMap = new Map(drafts.map((d) => [d.entity_id, d.draft_data]));

  return live.map((doc) => {
    const draftData = draftMap.get(doc.id);
    return draftData
      ? (safeMerge(doc, draftData) as Doctor)
      : (doc as Doctor);
  });
}
