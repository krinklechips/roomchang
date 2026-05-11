import Link from "next/link";
import { CircleDot, Crown, AlignCenter, Sparkles, Sun, Scissors, ArrowRight, type LucideIcon } from "lucide-react";

const SERVICES: { id: string; label: string; href: string; Icon: LucideIcon }[] = [
  { id: "implants", label: "Dental Implants", href: "/services/dental-implants", Icon: CircleDot },
  { id: "crowns", label: "Crowns & Bridges", href: "/services/dental-crowns", Icon: Crown },
  { id: "aligners", label: "Clear Aligners", href: "/services/orthodontics", Icon: AlignCenter },
  { id: "cosmetic", label: "Cosmetic Dentistry", href: "/services/cosmetic-dentistry", Icon: Sparkles },
  { id: "whitening", label: "Teeth Whitening", href: "/services/teeth-whitening", Icon: Sun },
  { id: "surgery", label: "Oral Surgery", href: "/services/oral-surgery", Icon: Scissors },
];

export function HomeServices() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
            What We Offer
          </p>
          <h2 className="mt-2 font-display text-3xl text-[color:var(--text-main)] sm:text-5xl">
            Our Treatments
          </h2>
        </div>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-deep)] transition hover:text-[color:var(--brand)]"
        >
          See all services <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2.5 sm:mt-10 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {SERVICES.map((service) => (
          <Link
            key={service.id}
            href={service.href}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-[color:var(--border-strong)] bg-white px-3 py-4 text-center shadow-[0_8px_30px_rgba(57,28,45,0.05)] transition hover:-translate-y-0.5 hover:border-[color:var(--brand-light)] hover:shadow-[0_14px_40px_rgba(57,28,45,0.1)] sm:gap-3 sm:px-4 sm:py-6"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--surface-strong)] text-[color:var(--brand-deep)] transition group-hover:bg-[color:var(--brand-soft)] sm:h-14 sm:w-14 sm:rounded-2xl">
              <service.Icon size={22} strokeWidth={1.75} aria-hidden="true" className="sm:!h-7 sm:!w-7" />
            </div>
            <p className="text-[0.7rem] font-semibold leading-snug text-[color:var(--text-main)] sm:text-[0.82rem]">
              {service.label}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
