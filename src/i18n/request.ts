import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing, LOCALE_TO_LANG } from "./routing";

// Static imports — NOT a dynamic `import(\`../../messages/${locale}.json\`)`.
// The template-literal dynamic import compiled each locale to its own chunk,
// which Vercel's serverless tracing failed to bundle into dynamically-rendered
// functions (e.g. the 404 page) — causing "Failed to load external" → 500.
// Importing all three statically bundles them into every i18n function.
import en from "../../messages/en.json";
import zh from "../../messages/zh.json";
import km from "../../messages/km.json";

const MESSAGES: Record<string, Record<string, unknown>> = { en, zh, km };

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: MESSAGES[LOCALE_TO_LANG[locale] ?? locale],
  };
});
