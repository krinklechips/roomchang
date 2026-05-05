import { NextRequest, NextResponse } from "next/server";
import { listDrafts, saveDraft, type EntityType } from "@/lib/preview";

/**
 * GET /api/admin/drafts?entity_type=service
 *
 * List all drafts, optionally filtered by entity_type.
 * Protected by Basic Auth via middleware.
 */
export async function GET(request: NextRequest) {
  const entityType =
    (request.nextUrl.searchParams.get("entity_type") as EntityType) || undefined;

  const drafts = await listDrafts(entityType);
  return NextResponse.json({ drafts });
}

/**
 * POST /api/admin/drafts
 *
 * Create or update a draft.
 * Body: { entity_type, entity_id, draft_data, updated_by? }
 * Protected by Basic Auth via middleware.
 */
export async function POST(request: NextRequest) {
  let body: {
    entity_type: EntityType;
    entity_id: string;
    draft_data: Record<string, unknown>;
    updated_by?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  if (!body.entity_type || !body.entity_id || !body.draft_data) {
    return NextResponse.json(
      { error: "Required: entity_type, entity_id, draft_data" },
      { status: 400 },
    );
  }

  const draft = await saveDraft(
    body.entity_type,
    body.entity_id,
    body.draft_data,
    body.updated_by,
  );

  if (!draft) {
    return NextResponse.json(
      { error: "Failed to save draft." },
      { status: 500 },
    );
  }

  return NextResponse.json({ draft }, { status: 201 });
}
