import Link from "next/link";

const SERVICES = [
  {
    id: "implants",
    label: "Dental Implants",
    href: "/services#implants",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-7 w-7" aria-hidden="true">
        <rect x="16" y="2" width="8" height="20" rx="4" fill="currentColor" opacity="0.9" />
        <path d="M12 22 C8 26 8 36 20 36 C32 36 32 26 28 22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "crowns",
    label: "Crowns & Bridges",
    href: "/services#crowns",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-7 w-7" aria-hidden="true">
        <path d="M6 30 L10 10 L20 22 L30 10 L34 30 Z" fill="currentColor" opacity="0.9" />
        <rect x="4" y="30" width="32" height="5" rx="2.5" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "aligners",
    label: "Clear Aligners",
    href: "/services#orthodontics",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-7 w-7" aria-hidden="true">
        <ellipse cx="20" cy="20" rx="16" ry="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <ellipse cx="20" cy="20" rx="10" ry="5" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    id: "cosmetic",
    label: "Cosmetic Dentistry",
    href: "/services#cosmetic",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-7 w-7" aria-hidden="true">
        <path d="M20 6 C10 6 4 14 4 20 C4 30 12 36 20 36 C28 36 36 30 36 20 C36 14 30 6 20 6Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2" />
        <path d="M13 22 Q20 30 27 22" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="15" cy="17" r="2" fill="currentColor" opacity="0.8" />
        <circle cx="25" cy="17" r="2" fill="currentColor" opacity="0.8" />
      </svg>
    ),
  },
  {
    id: "whitening",
    label: "Teeth Whitening",
    href: "/services#cosmetic",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-7 w-7" aria-hidden="true">
        <circle cx="20" cy="20" r="10" fill="currentColor" opacity="0.2" />
        <circle cx="20" cy="20" r="6" fill="currentColor" opacity="0.7" />
        <line x1="20" y1="4" x2="20" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="20" y1="32" x2="20" y2="36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="4" y1="20" x2="8" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="20" x2="36" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="8.7" y1="8.7" x2="11.5" y2="11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="28.5" y1="28.5" x2="31.3" y2="31.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="31.3" y1="8.7" x2="28.5" y2="11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="11.5" y1="28.5" x2="8.7" y2="31.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "surgery",
    label: "Oral Surgery",
    href: "/services#surgery",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="h-7 w-7" aria-hidden="true">
        <path d="M8 32 L20 8 L32 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="12" y1="24" x2="28" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function HomeServices() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[--brand]">
            What We Offer
          </p>
          <h2 className="mt-2 font-display text-4xl text-[--text-main] sm:text-5xl">
            Our Treatments
          </h2>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[--brand-deep] transition hover:text-[--brand]"
        >
          See all services →
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {SERVICES.map((service) => (
          <Link
            key={service.id}
            href={service.href}
            className="group flex flex-col items-center gap-3 rounded-[1.75rem] border border-[--border-strong] bg-white px-4 py-6 text-center shadow-[0_8px_30px_rgba(57,28,45,0.05)] transition hover:-translate-y-0.5 hover:border-[--brand-light] hover:shadow-[0_14px_40px_rgba(57,28,45,0.1)]"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[--surface-strong] text-[--brand-deep] transition group-hover:bg-[--brand-soft]">
              {service.icon}
            </div>
            <p className="text-[0.82rem] font-semibold leading-snug text-[--text-main]">
              {service.label}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
