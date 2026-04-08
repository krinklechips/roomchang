import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { getServices } from "@/lib/data";
import type { Metadata } from "next";
import {
  CircleDot,
  Crown,
  AlignCenter,
  Sparkles,
  RefreshCcw,
  Scissors,
  Smile,
  Moon,
  Zap,
  Shield,
  Bone,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dental Services | Roomchang Dental Hospital",
  description:
    "Comprehensive dental treatments at Roomchang — from implants and crowns to orthodontics, cosmetic dentistry, and oral surgery in Phnom Penh.",
};

// Maps service slug → lucide icon component
const SERVICE_ICONS: Record<string, LucideIcon> = {
  "dental-implants":          CircleDot,
  "dental-crowns":            Crown,
  "orthodontics":             AlignCenter,
  "cosmetic-dentistry":       Sparkles,
  "full-mouth-reconstruction":RefreshCcw,
  "oral-surgery":             Scissors,
  "pediatric-dentistry":      Smile,
  "sleep-apnea":              Moon,
  "teeth-whitening":          Zap,
  "all-on-4":                 Bone,
  "implant-bridges":          Shield,
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <SiteShell>
      {/* Page header */}
      <div className="border-b border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[--brand]">
            What We Treat
          </p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">
            Dental Services
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            Roomchang offers hospital-level dental care across all major specialties. Whether
            you&apos;re based in Phnom Penh or travelling from overseas, our multilingual team
            is here to guide you through every step.
          </p>
        </div>
      </div>

      {/* Services grid */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = SERVICE_ICONS[service.slug] ?? CircleDot;
            return (
              <article
                key={service.id}
                id={service.slug}
                className="group flex flex-col overflow-hidden rounded-[2rem] border border-[--border-strong] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(57,28,45,0.1)]"
              >
                <div className="flex items-center gap-4 border-b border-[--border-strong] px-6 py-5">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[--surface-strong] text-[--brand-deep]"
                    aria-hidden="true"
                  >
                    <Icon size={22} strokeWidth={1.75} />
                  </span>
                  <h2 className="font-display text-[1.5rem] leading-tight text-[--text-main]">
                    {service.name}
                  </h2>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <p className="flex-1 text-sm leading-7 text-[--text-soft]">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(service.features ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[--brand-soft] px-3 py-1 text-[0.7rem] font-semibold text-[--brand-deep]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[--brand-deep] transition hover:text-[--brand]"
                  >
                    Learn more
                    <ArrowRight size={14} strokeWidth={2} aria-hidden="true" className="transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* CTA band */}
      <div className="border-t border-[--border-strong] bg-[--surface]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[--text-main]">Not sure which treatment?</h2>
              <p className="mt-2 text-sm leading-7 text-[--text-soft]">
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
