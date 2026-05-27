"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { CaretDown } from "@phosphor-icons/react";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "km", label: "ខ្មែរ", flag: "🇰🇭" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
] as const;

type LocaleCode = (typeof LANGUAGES)[number]["code"];

export function LanguageSwitcher() {
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
    setIsOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
        disabled={isPending}
        className="flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-white/88 px-3 py-2 text-sm font-semibold text-[color:var(--text-main)] shadow-sm backdrop-blur transition hover:border-[color:var(--brand)] hover:bg-white hover:text-[color:var(--brand-deep)] disabled:opacity-60"
      >
        <span className="text-base leading-none" aria-hidden="true">
          {activeLanguage.flag}
        </span>
        <span className="hidden sm:inline">
          {activeLanguage.code.toUpperCase()}
        </span>
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
          aria-label="Language options"
          className="absolute right-0 top-[calc(100%+0.6rem)] min-w-44 rounded-3xl border border-[color:var(--border-strong)] bg-white/96 p-2 shadow-[0_24px_60px_rgba(61,24,47,0.14)] backdrop-blur"
        >
          {LANGUAGES.map((language) => {
            const isActive = language.code === currentLocale;
            return (
              <button
                key={language.code}
                type="button"
                role="menuitem"
                aria-current={isActive ? "true" : undefined}
                disabled={isPending}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[color:var(--surface-strong)] text-[color:var(--brand-deep)]"
                    : "text-[color:var(--text-soft)] hover:bg-[color:var(--surface-strong)] hover:text-[color:var(--text-main)]"
                }`}
                onClick={() => switchLocale(language.code)}
              >
                <span className="text-lg leading-none" aria-hidden="true">
                  {language.flag}
                </span>
                <span className="flex-1 text-left">{language.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
