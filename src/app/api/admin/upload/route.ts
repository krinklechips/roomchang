import { NextRequest, NextResponse } from "next/server";
import { uploadToR2, validateUpload, isR2Configured } from "@/lib/r2";
import { supabaseServer } from "@/lib/supabase-server";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

/**
 * POST /api/admin/upload
 *
 * Accepts multipart form data with a single file.
 * Uploads to R2 and records in cms_images.
 *
 * Protected by Basic Auth via middleware.
 *
 * Form fields:
 *   - file: File (required)
 *   - folder: string (optional, e.g. "technology", "doctors")
 *   - alt_text: string (optional)
 *   - entity_type: string (optional, for linking to a content entity)
 *   - entity_id: string (optional)
 */
export async function POST(request: NextRequest) {
  if (!isR2Configured()) {
    return NextResponse.json(
      { error: "R2 storage is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY." },
      { status: 503 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data. Send multipart/form-data with a 'file' field." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Missing 'file' field." },
      { status: 400 },
    );
  }

  // Validate type and size
  const validationError = validateUpload({ type: file.type, size: file.size });
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  // Build the R2 key
  const folder = (formData.get("folder") as string) || "uploads";
  const ext = file.name.split(".").pop() ?? "bin";
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .toLowerCase()
    .slice(0, 60);
  const key = `roomchang/${folder}/${safeName}-${randomUUID().slice(0, 8)}.${ext}`;

  // Upload to R2
  const buffer = Buffer.from(await file.arrayBuffer());
  const { url } = await uploadToR2(key, buffer, file.type);

  // Record in database
  const altText = (formData.get("alt_text") as string) || null;
  const entityType = (formData.get("entity_type") as string) || null;
  const entityId = (formData.get("entity_id") as string) || null;

  const { data: record, error: dbError } = await supabaseServer
    .from("cms_images")
    .insert({
      filename: file.name,
      r2_key: key,
      url,
      alt_text: altText,
      size_bytes: file.size,
      mime_type: file.type,
      entity_type: entityType,
      entity_id: entityId,
    })
    .select()
    .single();

  if (dbError) {
    console.error("[Upload] Failed to record image:", dbError.message);
    // Image was uploaded to R2 but DB record failed — still return the URL
    return NextResponse.json({ url, key, warning: "Uploaded but DB record failed" });
  }

  return NextResponse.json({
    id: record.id,
    url,
    key,
    filename: file.name,
  });
}
