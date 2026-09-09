import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Enter Next draft mode so the page renders UNPUBLISHED CMS content (see
 * src/lib/payload-source.ts → payloadFind). The CMS's Live Preview iframe
 * opens this URL; the secret is shared with the CMS (PREVIEW_SECRET there,
 * PAYLOAD_PREVIEW_SECRET here). Only meaningful in payload mode — on the
 * live Supabase-backed site this endpoint does not exist (404).
 */
export async function GET(request: Request): Promise<Response> {
  if (process.env.CONTENT_SOURCE !== "payload") {
    return new NextResponse("Not found", { status: 404 });
  }
  const url = new URL(request.url);
  const secret = process.env.PAYLOAD_PREVIEW_SECRET;
  if (!secret || url.searchParams.get("secret") !== secret) {
    return new NextResponse("Invalid preview secret", { status: 401 });
  }
  const redirect = url.searchParams.get("redirect") ?? "/en";
  const safe = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/en";
  (await draftMode()).enable();
  return NextResponse.redirect(new URL(safe, url.origin), 307);
}
