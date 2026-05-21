import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/components/site/site-shell";
import { getServices } from "@/lib/data";
import { cdnUrl } from "@/lib/supabase";
import type { Metadata } from "next";
import {
  ShieldCheck,
  Tooth,
  Crown,
  Sparkle,
  ArrowsClockwise,
  Scissors,
  SmileyWink,
  Moon,
  Lightning,
  ArrowRight,
  Target,
  FirstAidKit,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react/dist/lib/types";

export const metadata: Metadata = {
  title: "Dental Services | Roomchang Dental Hospital",
  description:
    "Comprehensive dental treatments at Roomchang — from implants and crowns to orthodontics, cosmetic dentistry, and oral surgery in Phnom Penh.",
};

const HERO_TRUST = [
  { value: "11",  label: "Specialties" },
  { value: "37",  label: "Specialists" },
  { value: "5",   label: "Locations" },
];

// Maps service slug → Phosphor icon component (duotone)
const SERVICE_ICONS: Record<string, PhosphorIcon> = {
  "preventive-dentistry":     ShieldCheck,
  "dental-implants":          Target,
  "dental-crowns":            Crown,
  "orthodontics":             FirstAidKit,
  "cosmetic-dentistry":       Sparkle,
  "full-mouth-reconstruction":ArrowsClockwise,
  "oral-surgery":             Scissors,
  "pediatric-dentistry":      SmileyWink,
  "sleep-apnea":              Moon,
  "teeth-whitening":          Lightning,
  "endodontics":              Tooth,
  "dentures":                 SmileyWink,
};

const SERVICE_IMAGES: Record<string, { src: string; alt: string }> = {
  "preventive-dentistry": {
    src: "/services/Preventive Dentistry.jpg",
    alt: "Preventive dentistry consultation at Roomchang Dental Hospital",
  },
  "dental-implants": {
    src: "/services/Implants.jpg",
    alt: "Dental implant treatment at Roomchang Dental Hospital",
  },
  "dental-crowns": {
    src: "/services/Dental Crowns.jpg",
    alt: "Dental crowns treatment at Roomchang Dental Hospital",
  },
  "orthodontics": {
    src: "/services/Orthodontics 2.jpg",
    alt: "Orthodontic clear aligner treatment at Roomchang Dental Hospital",
  },
  "cosmetic-dentistry": {
    src: "/services/Cosmetic Dentistry.jpg",
    alt: "Cosmetic dentistry treatment at Roomchang Dental Hospital",
  },
  "oral-surgery": {
    src: "/services/Oral Surgery.jpg",
    alt: "Oral surgery treatment at Roomchang Dental Hospital",
  },
  "pediatric-dentistry": {
    src: "/services/Pediatric Dentistry.jpg",
    alt: "Pediatric dentistry treatment at Roomchang Dental Hospital",
  },
  "sleep-apnea": {
    src: "/services/Sleep Apnea.jpg",
    alt: "Sleep apnea dental appliance consultation at Roomchang Dental Hospital",
  },
  "teeth-whitening": {
    src: "/services/Whitening 1.jpg",
    alt: "Teeth whitening treatment at Roomchang Dental Hospital",
  },
  "endodontics": {
    src: "/services/Endodontics.JPG",
    alt: "Endodontic treatment at Roomchang Dental Hospital",
  },
};

function resolveServiceImage(src: string | null | undefined): string | null {
  if (!src) return null;
  if (src.startsWith("/") || src.startsWith("http")) return src;
  return cdnUrl(src);
}

// Sub-services shown as links inside their parent card rather than as top-level cards
const HIDDEN_FROM_GRID = new Set(["all-on-4", "implant-bridges"]);

const SUB_SERVICES: Record<string, { label: string; href: string }[]> = {
  "dental-implants": [
    { label: "All-on-4, 6 & 8", href: "/services/all-on-4" },
    { label: "Implant Bridges", href: "/services/implant-bridges" },
  ],
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <SiteShell>
      {/* Page header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
              What We Treat
            </p>
            <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
              Dental Services
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
              Roomchang offers hospital-level dental care across all major specialties. Whether
              you&apos;re based in Phnom Penh or travelling from overseas, our multilingual team
              is here to guide you through every step.
            </p>
          </div>
          <div className="hidden lg:flex lg:justify-end">
            <div className="grid grid-cols-2 gap-3">
              {HERO_TRUST.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[color:var(--border-strong)] bg-white px-5 py-4 shadow-[0_8px_24px_rgba(57,28,45,0.06)]">
                  <p className="font-display text-2xl text-[color:var(--brand-deep)]">{item.value}</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-soft)]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services grid */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.filter((s) => !HIDDEN_FROM_GRID.has(s.slug)).map((service) => {
            const Icon = SERVICE_ICONS[service.slug] ?? Tooth;
            const serviceImage = SERVICE_IMAGES[service.slug];
            const imageSrc = resolveServiceImage(service.imageSrc ?? serviceImage?.src);
            const imageAlt = serviceImage?.alt ?? `${service.name} treatment at Roomchang Dental Hospital`;
            const subServices = SUB_SERVICES[service.slug] ?? [];
            return (
              <article
                key={service.id}
                id={service.slug}
                className="group flex flex-col overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(57,28,45,0.1)]"
              >
                {imageSrc && (
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex items-center gap-4 border-b border-[color:var(--border-strong)] px-6 py-5">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--surface-strong)] text-[color:var(--brand-deep)]"
                    aria-hidden="true"
                  >
                    <Icon size={22} weight="duotone" />
                  </span>
                  <h2 className="font-display text-[1.5rem] leading-tight text-[color:var(--text-main)]">
                    {service.name}
                  </h2>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <p className="flex-1 text-sm leading-7 text-[color:var(--text-soft)]">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(service.features ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[color:var(--brand-soft)] px-3 py-1 text-[0.7rem] font-semibold text-[color:var(--brand-deep)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {subServices.length > 0 && (
                    <div className="flex flex-wrap gap-2 border-t border-[color:var(--border-strong)] pt-3">
                      {subServices.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="rounded-full border border-[color:var(--border-strong)] px-3 py-1 text-[0.7rem] font-semibold text-[color:var(--brand-deep)] transition hover:border-[color:var(--brand)] hover:bg-[color:var(--brand-soft)]"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--brand-deep)] transition hover:text-[color:var(--brand)]"
                  >
                    Learn more
                    <ArrowRight size={14} weight="bold" aria-hidden="true" className="transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* CTA band */}
      <div className="border-t border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[color:var(--text-main)]">Not sure which treatment?</h2>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
                Send us a message or call and our team will help you find the right path.
              </p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0">
              Request a Consultation
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
