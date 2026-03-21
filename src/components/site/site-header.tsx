import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "./language-switcher";

const NAV_ITEMS = [
  "About",
  "Services",
  "Doctors",
  "Technology",
  "International",
  "Contact",
];

export function SiteHeader() {
  return (
    <header
      aria-label="Roomchang Dental Hospital"
      className="sticky top-0 z-50 border-b border-black/5 bg-[color:rgba(255,250,251,0.92)] backdrop-blur-xl"
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label="Roomchang Dental Hospital home">
          <Image
            src="/brand/roomchang-mark.jpeg"
            alt="Roomchang flower mark"
            width={52}
            height={52}
            className="h-12 w-12 rounded-full border border-black/5 object-cover shadow-sm"
          />
          <div className="min-w-0">
            <p className="font-display text-lg leading-none tracking-[0.18em] text-[--brand-deep] sm:text-xl">
              ROOMCHANG
            </p>
            <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[--text-soft] sm:text-[0.72rem]">
              Dental Hospital Since 1996
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <nav aria-label="Primary" className="flex items-center gap-5">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-semibold text-[--text-soft] transition hover:text-[--brand-deep]"
              >
                {item}
              </a>
            ))}
          </nav>
          <LanguageSwitcher />
          <a href="#book" className="btn-primary">
            Book Appointment
          </a>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <a href="#book" className="btn-primary px-4 py-2 text-sm">
            Book
          </a>
        </div>
      </div>
    </header>
  );
}
