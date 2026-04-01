import Link from "next/link";
import { CircleDot, Crown, AlignCenter, Sparkles, Sun, Scissors, type LucideIcon } from "lucide-react";

const SERVICES: { id: string; label: string; href: string; Icon: LucideIcon }[] = [
  { id: "implants", label: "Dental Implants", href: "/services#implants", Icon: CircleDot },
  { id: "crowns", label: "Crowns & Bridges", href: "/services#crowns", Icon: Crown },
  { id: "aligners", label: "Clear Aligners", href: "/services#orthodontics", Icon: AlignCenter },
  { id: "cosmetic", label: "Cosmetic Dentistry", href: "/services#cosmetic", Icon: Sparkles },
  { id: "whitening", label: "Teeth Whitening", href: "/services#cosmetic", Icon: Sun },
  { id: "surgery", label: "Oral Surgery", href: "/services#surgery", Icon: Scissors },
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
              <service.Icon size={28} strokeWidth={1.75} aria-hidden="true" />
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
