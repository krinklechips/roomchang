import Link from "next/link";

const LANGUAGES = [
  { code: "EN", href: "/en" },
  { code: "KH", href: "/kh" },
  { code: "中文", href: "/zh" },
];

export function LanguageSwitcher() {
  return (
    <div
      aria-label="Language switcher"
      className="flex items-center gap-2 rounded-full border border-[--border-strong] bg-white/85 px-2 py-1 shadow-sm backdrop-blur"
    >
      {LANGUAGES.map((language) => (
        <Link
          key={language.code}
          href={language.href}
          className="rounded-full px-3 py-1.5 text-[0.7rem] font-semibold tracking-[0.24em] text-[--text-soft] transition hover:bg-[--surface-strong] hover:text-[--text-main]"
        >
          {language.code}
        </Link>
      ))}
    </div>
  );
}
