"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const LANGUAGES = [
  { code: "EN", label: "English", flag: "🇬🇧", href: "/en" },
  { code: "KH", label: "Khmer", flag: "🇰🇭", href: "/kh" },
  { code: "中文", label: "中文", flag: "🇨🇳", href: "/zh" },
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
        <span
          className={`text-[0.7rem] text-[--text-soft] transition ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label="Language options"
          className="absolute right-0 top-[calc(100%+0.6rem)] min-w-44 rounded-3xl border border-[--border-strong] bg-white/96 p-2 shadow-[0_24px_60px_rgba(61,24,47,0.14)] backdrop-blur"
        >
          {LANGUAGES.map((language) => (
            <Link
              key={language.href}
              href={language.href}
              role="menuitem"
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-[--text-main] transition hover:bg-[--surface-strong]"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg leading-none" aria-hidden="true">
                {language.flag}
              </span>
              <span className="flex-1">{language.label}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
