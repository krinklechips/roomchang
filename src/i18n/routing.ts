import { defineRouting } from "next-intl/routing";

// URL path segments use country-style codes visitors recognise (KH / CN).
// Internally we keep the ISO 639 language codes (km / zh) for the message files,
// the content_translations table, <html lang>, and hreflang — so SEO stays
// correct and the existing DB translations keep matching. LOCALE_TO_LANG bridges
// the URL segment → language code.
export const routing = defineRouting({
  locales: ["en", "kh", "cn"],
  defaultLocale: "en",
  // No NEXT_LOCALE cookie: a Set-Cookie header on every page made Vercel treat
  // ALL responses as uncacheable (cache-control: no-store, x-vercel-cache: MISS
  // on every request), defeating ISR — every visitor paid a full server render
  // (~2s TTFB). The locale is always in the URL (localePrefix "always"), so the
  // cookie only ever influenced the bare "/" redirect; accept-language handles
  // that case fine.
  localeCookie: false,
});

export const LOCALE_TO_LANG: Record<string, string> = {
  en: "en",
  kh: "km",
  cn: "zh",
};

/**
 * Locales hidden from the public while their content is under review
 * (Borin's Khmer terminology pass, July 2026). An unlisted locale:
 *  - is greyed out ("Soon") in the language switcher,
 *  - is dropped from the sitemap's hreflang alternates,
 *  - serves <meta name="robots" content="noindex"> on all its pages,
 * but its routes STAY LIVE by direct URL (private review link, e.g. /kh).
 * To re-launch a locale, just remove it from this list.
 */
export const UNLISTED_LOCALES: string[] = ["kh"];
