"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

// Branded error boundary for runtime errors inside a locale's pages.
// Must be a client component; renders within the locale layout (so next-intl
// translations are available) but not the SiteShell (server component).
export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errorPage");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[color:var(--canvas)] px-4 text-center text-[color:var(--text-main)]">
      <h1 className="font-display text-3xl sm:text-4xl">{t("title")}</h1>
      <p className="mt-4 max-w-md text-base leading-7 text-[color:var(--text-soft)]">
        {t("body")}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn-primary">
          {t("retry")}
        </button>
        <Link href="/" className="btn-secondary">
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
