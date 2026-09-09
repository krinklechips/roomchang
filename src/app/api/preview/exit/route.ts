import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/** Leave draft mode — the page goes back to published content only. */
export async function GET(request: Request): Promise<Response> {
  (await draftMode()).disable();
  const url = new URL(request.url);
  const redirect = url.searchParams.get("redirect") ?? "/en";
  const safe = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/en";
  return NextResponse.redirect(new URL(safe, url.origin), 307);
}
