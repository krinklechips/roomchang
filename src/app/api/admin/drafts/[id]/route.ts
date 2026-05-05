import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

/**
 * GET /api/admin/drafts/:id
 *
 * Fetch a single draft by its UUID.
 * Protected by Basic Auth via middleware.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { data, error } = await supabaseServer
    .from("content_drafts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Draft not found." }, { status: 404 });
  }

  return NextResponse.json({ draft: data });
}

/**
 * PUT /api/admin/drafts/:id
 *
 * Update draft_data for an existing draft.
 * Body: { draft_data, updated_by? }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: { draft_data: Record<string, unknown>; updated_by?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.draft_data) {
    return NextResponse.json(
      { error: "Required: draft_data" },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseServer
    .from("content_drafts")
    .update({
      draft_data: body.draft_data,
      updated_at: new Date().toISOString(),
      updated_by: body.updated_by ?? null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Failed to update draft." },
      { status: 500 },
    );
  }

  return NextResponse.json({ draft: data });
}

/**
 * DELETE /api/admin/drafts/:id
 *
 * Delete a draft (discard changes).
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { error } = await supabaseServer
    .from("content_drafts")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "Failed to delete draft." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
