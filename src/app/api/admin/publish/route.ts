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

/**
 * POST /api/admin/publish
 *
 * Publish a draft: copy draft_data into the live table, then delete the draft.
 * Body: { entity_type, entity_id }
 *
 * Protected by Basic Auth via middleware.
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

  // Write draft_data to the live table
  const { error: updateError } = await supabaseServer
    .from(table)
    .update(draft.draft_data)
    .eq("id", body.entity_id);

  if (updateError) {
    console.error("[Publish] Failed to update live table:", updateError.message);
    return NextResponse.json(
      { error: `Failed to publish: ${updateError.message}` },
      { status: 500 },
    );
  }

  // Delete the draft
  await deleteDraft(body.entity_type, body.entity_id);

  return NextResponse.json({
    ok: true,
    message: `Published ${body.entity_type} "${body.entity_id}" successfully.`,
  });
}
