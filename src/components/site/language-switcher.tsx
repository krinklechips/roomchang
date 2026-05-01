"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// Multilingual routing is not yet implemented — all hrefs point to "#"
// to prevent 404s. Update hrefs when /[locale] routes are built.
const LANGUAGES = [
  { code: "EN", label: "English", flag: "🇬🇧", href: "#", active: true },
  { code: "KH", label: "ខ្មែរ", flag: "🇰🇭", href: "#", active: false },
  { code: "中文", label: "中文", flag: "🇨🇳", href: "#", active: false },
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeLanguage = LANGUAGES[0];

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="Change language"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 rounded-full border border-[--border-strong] bg-white/88 px-3 py-2 text-sm font-semibold text-[--text-main] shadow-sm backdrop-blur transition hover:border-[--brand] hover:bg-white hover:text-[--brand-deep]"
      >
        <span className="text-base leading-none" aria-hidden="true">
          {activeLanguage.flag}
        </span>
        <span className="hidden sm:inline">{activeLanguage.code}</span>
        <ChevronDown
          size={13}
          strokeWidth={2.5}
          className={`text-[--text-soft] transition ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label="Language options"
          className="absolute right-0 top-[calc(100%+0.6rem)] min-w-44 rounded-3xl border border-[--border-strong] bg-white/96 p-2 shadow-[0_24px_60px_rgba(61,24,47,0.14)] backdrop-blur"
        >
          {LANGUAGES.map((language) => (
            <Link
              key={language.code}
              href={language.href}
              role="menuitem"
              aria-current={language.active ? "true" : undefined}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                language.active
                  ? "bg-[color:var(--surface-strong)] text-[--brand-deep]"
                  : "text-[--text-soft] hover:bg-[color:var(--surface-strong)] hover:text-[--text-main]"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg leading-none" aria-hidden="true">
                {language.flag}
              </span>
              <span className="flex-1">{language.label}</span>
              {!language.active && (
                <span className="rounded-full bg-[color:var(--border-strong)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[--text-soft]">
                  Soon
                </span>
              )}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
