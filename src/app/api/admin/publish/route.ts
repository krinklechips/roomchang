import { NextRequest, NextResponse } from "next/server";
import { getDraft, deleteDraft, type EntityType } from "@/lib/preview";
import { supabaseServer } from "@/lib/supabase-server";

// Map entity types to their Supabase table names
const TABLE_MAP: Record<EntityType, string> = {
  service: "services",
  technology: "technology",
  doctor: "doctors",
  clinical_case: "clinical_cases",
  hero_slide: "hero_slides",
  page: "pages",
};

// Allowlisted columns per entity type — only these keys can be published
const ALLOWED_KEYS: Record<EntityType, Set<string>> = {
  service: new Set(["name", "slug", "description", "category", "features", "icon", "isFeatured", "order", "published", "eyebrow", "heroDescription", "content"]),
  technology: new Set(["name", "slug", "category", "description", "highlights", "imageSrc", "order", "published", "content"]),
  doctor: new Set(["name", "credentials", "role", "department", "specialty", "languages", "bio", "note", "initials", "photoUrl", "order", "published"]),
  clinical_case: new Set(["slug", "title", "category", "treatment", "duration", "description", "tag", "imageUrl", "fullText", "images", "order", "published"]),
  hero_slide: new Set(["eyebrow", "title", "description", "imageSrc", "imageAlt", "imagePosition", "imageSize", "preserveFullImage", "order", "published"]),
  page: new Set(["slug", "title", "status", "template", "seoTitle", "seoDescription", "seoImage", "blocks"]),
};

/** Strip unknown keys from draft data to prevent column injection */
function sanitizeDraftData(
  entityType: EntityType,
  data: Record<string, unknown>,
): Record<string, unknown> {
  const allowed = ALLOWED_KEYS[entityType];
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (allowed.has(key)) {
      clean[key] = value;
    }
  }
  return clean;
}

/**
 * POST /api/admin/publish
 *
 * Publish a draft: copy draft_data into the live table, then delete the draft.
 * Body: { entity_type, entity_id }
 *
 * Protected by Basic Auth via middleware.
 *
 * Safety: verifies the live row exists and was updated before removing the draft.
 * Only allowlisted columns are written to prevent schema corruption.
 */
export async function POST(request: NextRequest) {
  let body: { entity_type: EntityType; entity_id: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.entity_type || !body.entity_id) {
    return NextResponse.json(
      { error: "Required: entity_type, entity_id" },
      { status: 400 },
    );
  }

  const table = TABLE_MAP[body.entity_type];
  if (!table) {
    return NextResponse.json(
      { error: `Unknown entity type: ${body.entity_type}` },
      { status: 400 },
    );
  }

  // Fetch the draft
  const draft = await getDraft(body.entity_type, body.entity_id);
  if (!draft) {
    return NextResponse.json(
      { error: "No draft found for this entity." },
      { status: 404 },
    );
  }

  // Sanitize draft data — only allow known columns
  const safeData = sanitizeDraftData(body.entity_type, draft.draft_data);
  if (Object.keys(safeData).length === 0) {
    return NextResponse.json(
      { error: "Draft contains no valid fields to publish." },
      { status: 400 },
    );
  }

  // Write draft_data to the live table and confirm the row was updated
  const { data: updated, error: updateError } = await supabaseServer
    .from(table)
    .update(safeData)
    .eq("id", body.entity_id)
    .select("id")
    .single();

  if (updateError) {
    console.error("[Publish] Failed to update live table:", updateError.message);
    return NextResponse.json(
      { error: `Failed to publish: ${updateError.message}` },
      { status: 500 },
    );
  }

  if (!updated) {
    // Live row doesn't exist — do NOT delete the draft
    return NextResponse.json(
      { error: `No live row found for ${body.entity_type} "${body.entity_id}". Draft preserved.` },
      { status: 404 },
    );
  }

  // Only delete the draft after confirmed live write
  await deleteDraft(body.entity_type, body.entity_id);

  return NextResponse.json({
    ok: true,
    message: `Published ${body.entity_type} "${body.entity_id}" successfully.`,
  });
}
