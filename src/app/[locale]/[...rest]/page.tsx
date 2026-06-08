import { notFound } from "next/navigation";

// Catch-all for any unmatched path under a valid locale. Triggering notFound()
// here renders [locale]/not-found.tsx *inside* the locale layout (where the
// next-intl context exists), so unknown URLs return a clean branded 404 instead
// of crashing with a 500 in the root layout's getLocale().
export default function CatchAllNotFound() {
  notFound();
}
