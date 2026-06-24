import { notFound, permanentRedirect } from "next/navigation";
import { resolveLegacyPath } from "@/lib/legacy-redirects";

// Catch-all for any unmatched path under a valid locale (e.g. old WordPress
// permalinks like /2019/01/21/<slug>). Before 404ing, try to 301/308-redirect
// the old URL to its new home for SEO. Otherwise notFound() renders
// [locale]/not-found.tsx *inside* the locale layout (where the next-intl
// context exists), so unknown URLs return a clean branded 404 instead of a 500.
export default async function CatchAllNotFound({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  const { locale, rest } = await params;
  const target = await resolveLegacyPath(rest);
  if (target) permanentRedirect(`/${locale}${target}`);
  notFound();
}
