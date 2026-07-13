"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { CaretDown } from "@phosphor-icons/react";
import { UNLISTED_LOCALES } from "@/i18n/routing";

// `code` is the URL path segment (country-style: kh/cn), which also matches the
// `display` chip — what visitors recognise. The ISO 639 language codes (km/zh)
// live under the hood for messages, content_translations, <html lang>, and
// hreflang (see LOCALE_TO_LANG in src/i18n/routing.ts).
//
// A locale in UNLISTED_LOCALES (routing.ts) is greyed out here ("Soon") but
// stays live by direct URL — the private-review state.
const LANGUAGE_BASE = [
  { code: "en", label: "English", display: "EN" },
  { code: "kh", label: "ខ្មែរ", display: "KH" },
  { code: "cn", label: "中文", display: "CN" },
] as const;

const LANGUAGES = LANGUAGE_BASE.map((l) => ({
  ...l,
  enabled: !UNLISTED_LOCALES.includes(l.code),
}));

type LocaleCode = (typeof LANGUAGE_BASE)[number]["code"];

export function LanguageSwitcher() {
  const t = useTranslations("languageSwitcher");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentLocale = useLocale() as LocaleCode;
  const pathname = usePathname();
  const router = useRouter();

  const activeLanguage =
    LANGUAGES.find((l) => l.code === currentLocale) ?? LANGUAGES[0];

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  function switchLocale(locale: LocaleCode) {
    const target = LANGUAGES.find((l) => l.code === locale);
    // Disabled locales stay routable by URL but aren't user-selectable here.
    if (target && !target.enabled) return;
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={t("ariaLabel")}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
        disabled={isPending}
        className="flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-white/88 px-3 py-2 text-sm font-semibold text-[color:var(--text-main)] shadow-sm backdrop-blur transition hover:border-[color:var(--brand)] hover:bg-white hover:text-[color:var(--brand-deep)] disabled:opacity-60"
      >
        <span>{activeLanguage.display}</span>
        <CaretDown
          size={13}
          weight="bold"
          className={`text-[color:var(--text-soft)] transition ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label={t("menuAriaLabel")}
          className="absolute right-0 top-[calc(100%+0.4rem)] min-w-32 rounded-2xl border border-[color:var(--border-strong)] bg-white/96 p-1.5 shadow-[0_24px_60px_rgba(61,24,47,0.14)] backdrop-blur"
        >
          {LANGUAGES.map((language) => {
            const isActive = language.code === currentLocale;
            const isDisabled = !language.enabled && !isActive;
            return (
              <button
                key={language.code}
                type="button"
                role="menuitem"
                aria-current={isActive ? "true" : undefined}
                aria-disabled={isDisabled || undefined}
                disabled={isPending || isDisabled}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-[color:var(--surface-strong)] text-[color:var(--brand-deep)]"
                    : isDisabled
                      ? "cursor-not-allowed text-[color:var(--text-soft)] opacity-50"
                      : "text-[color:var(--text-soft)] hover:bg-[color:var(--surface-strong)] hover:text-[color:var(--text-main)]"
                }`}
                onClick={() => switchLocale(language.code)}
              >
                <span className="flex-1 text-left">{language.label}</span>
                {isDisabled ? (
                  <span className="rounded-full bg-[color:var(--surface-strong)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[color:var(--text-soft)]">
                    {t("soon")}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
