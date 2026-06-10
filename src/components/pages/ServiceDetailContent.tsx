/**
 * ServiceDetailContent — shared renderer for service detail pages.
 *
 * Used by both the live /services/[slug] route and the
 * /preview/service/[slug] preview route so they render identically.
 */

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
  CheckCircle,
  CurrencyDollar,
  Bone,
  Sparkle,
  Barbell,
  Smiley,
  Clock,
  Crosshair,
  Heart,
  ShieldCheck,
  Star,
  Lightning,
  Tooth,
  Eye,
  FirstAidKit,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react/dist/lib/types";
import { SiteShell } from "@/components/site/site-shell";
import { CommunityGallery } from "@/components/sections/community-gallery";
import type { Service, ServiceSection } from "@/lib/data";
import { cdnUrl } from "@/lib/supabase";
import { getTranslations } from "next-intl/server";

// Maps icon name strings (stored in DB) → Phosphor components
const ICON_MAP: Record<string, PhosphorIcon> = {
  DollarSign: CurrencyDollar,
  Bone,
  Sparkles: Sparkle,
  Dumbbell: Barbell,
  Smile: Smiley,
  Clock,
  CircleDot: Crosshair,
  Heart,
  Shield: ShieldCheck,
  Star,
  Zap: Lightning,
  Check: CheckCircle,
  Tooth,
  Eye,
  FirstAidKit,
};

function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={24} weight="duotone" className={className} aria-hidden="true" />;
}

function resolveServiceImage(src: string | null | undefined): string | null {
  if (!src) return null;
  if (src.startsWith("/") || src.startsWith("http")) return src;
  return cdnUrl(src);
}

// ─── Section renderers ───────────────────────────────────────────────────────

function Callout({ s }: { s: Extract<ServiceSection, { type: "callout" }> }) {
  // Distribute the stat pills evenly across the full width based on how many there are.
  const statCount = s.stats?.length ?? 0;
  const statGrid =
    statCount === 1 ? "grid-cols-1" :
    statCount === 2 ? "grid-cols-2" :
    statCount === 3 ? "grid-cols-3" :
    "grid-cols-2 sm:grid-cols-4";
  return (
    <div className="rounded-3xl bg-[color:var(--brand-soft)] px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {s.icon && (
          <div className="shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--brand)] text-white">
            <ServiceIcon name={s.icon} />
          </div>
        )}
        <div className="flex-1">
          <p className="font-semibold text-[color:var(--brand-deep)]">{s.title}</p>
          <p className="mt-1 text-sm leading-7 text-[color:var(--text-soft)]">{s.body}</p>
        </div>
      </div>
      {s.stats && (
        <div className={`mt-6 grid gap-4 ${statGrid}`}>
          {s.stats.map((st) => (
            <div key={st.label} className="flex flex-col items-center justify-center rounded-2xl bg-white/60 px-4 py-4 text-center">
              <p className="text-xl font-bold text-[color:var(--brand-deep)]">{st.value}</p>
              <p className="mt-1 text-xs text-[color:var(--text-soft)]">{st.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TextBlock({ s }: { s: Extract<ServiceSection, { type: "text" }> }) {
  const inner = (
    <>
      <h2 className="font-display text-3xl text-[color:var(--text-main)]">{s.heading}</h2>
      <div className="mt-3 text-sm leading-7 text-[color:var(--text-soft)] space-y-3">
        {String(s.body).split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </>
  );
  return s.card ? (
    <div className="rounded-3xl border border-[color:var(--border-strong)] bg-white p-8">{inner}</div>
  ) : (
    <div>{inner}</div>
  );
}

function BulletList({ s }: { s: Extract<ServiceSection, { type: "list" }> }) {
  return (
    <div>
      {s.heading && <h2 className="font-display text-3xl text-[color:var(--text-main)] mb-6">{s.heading}</h2>}
      <div className="grid gap-3 sm:grid-cols-2">
        {s.items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-2xl border border-[color:var(--border-strong)] bg-white px-5 py-4">
            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-[color:var(--brand)] text-white flex items-center justify-center"><CheckCircle size={9} weight="bold" aria-hidden="true" /></span>
            <span className="text-sm leading-6 text-[color:var(--text-soft)]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cards({ s }: { s: Extract<ServiceSection, { type: "cards" }> }) {
  const cols = s.columns ?? 3;
  const gridClass =
    cols === 2 ? "sm:grid-cols-2" :
    cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" :
    "sm:grid-cols-3";
  return (
    <div>
      <h2 className="font-display text-3xl text-[color:var(--text-main)]">{s.heading}</h2>
      {s.subheading && <p className="mt-3 text-sm text-[color:var(--text-soft)]">{s.subheading}</p>}
      <div className={`mt-8 grid gap-6 ${gridClass}`}>
        {s.items.map((item, i) => (
          <div key={item.title} className="rounded-2xl border border-[color:var(--border-strong)] bg-white p-6">
            {s.numbered && (
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--brand)] text-white text-sm font-bold">
                {i + 1}
              </div>
            )}
            {item.icon && !s.numbered && (
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                <ServiceIcon name={item.icon} />
              </div>
            )}
            {item.badge && (
              <span className="mb-2 inline-block rounded-full bg-[color:var(--brand-soft)] px-2.5 py-0.5 text-xs font-semibold text-[color:var(--brand-deep)]">
                {item.badge}
              </span>
            )}
            <h3 className="font-display text-xl text-[color:var(--text-main)]">
              {item.link ? (
                <Link href={item.link} className="underline decoration-[color:var(--brand-soft)] underline-offset-2 hover:decoration-[color:var(--brand)] transition-colors">
                  {item.title}
                </Link>
              ) : item.title}
            </h3>
            {item.spec && (
              <p className="mt-1 text-xs font-semibold text-[color:var(--brand)]">{item.spec}</p>
            )}
            {item.tag && (
              <span className="mt-1 inline-block rounded-full bg-[color:var(--brand-soft)] px-2 py-0.5 text-xs font-medium text-[color:var(--brand-deep)]">
                {item.tag}
              </span>
            )}
            <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Steps({ s }: { s: Extract<ServiceSection, { type: "steps" }> }) {
  return (
    <div>
      <h2 className="font-display text-3xl text-[color:var(--text-main)]">{s.heading}</h2>
      {s.subheading && <p className="mt-3 text-sm text-[color:var(--text-soft)]">{s.subheading}</p>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {s.items.map((item) => (
          <div key={item.step} className="rounded-2xl border border-[color:var(--border-strong)] bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">{item.step}</p>
            <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PricingCTA({
  s,
  ctaLabel,
  ctaNote,
  href,
}: {
  s: Extract<ServiceSection, { type: "pricing" }>;
  ctaLabel: string;
  ctaNote: string;
  href: string;
}) {
  return (
    <div className="rounded-3xl border border-[color:var(--border-strong)] bg-white p-8 shadow-[0_8px_32px_rgba(57,28,45,0.06)] sm:p-10">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[color:var(--brand)] text-white shadow-[0_4px_16px_rgba(204,55,113,0.3)]">
          <CurrencyDollar size={28} weight="duotone" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          {s.heading && (
            <h2 className="font-display text-2xl text-[color:var(--text-main)]">{s.heading}</h2>
          )}
          <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">
            {ctaNote}
          </p>
          <div className="mt-5">
            <Link
              href={href}
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_16px_rgba(204,55,113,0.3)] transition hover:bg-[color:var(--brand-deep)] hover:shadow-[0_4px_20px_rgba(204,55,113,0.4)]"
            >
              {ctaLabel} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Gallery({ s }: { s: Extract<ServiceSection, { type: "gallery" }> }) {
  return (
    <div>
      {s.heading && <h2 className="font-display text-3xl text-[color:var(--text-main)]">{s.heading}</h2>}
      {s.subheading && <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-soft)]">{s.subheading}</p>}
      <div className={s.heading || s.subheading ? "mt-8" : ""}>
        {/* 4-up grid keeps thumbnails small (these diagrams are low-res) */}
        <CommunityGallery images={s.images} title={s.heading ?? "Gallery"} columns={4} />
      </div>
    </div>
  );
}

function PriceTable({ s }: { s: Extract<ServiceSection, { type: "pricetable" }> }) {
  return (
    <div>
      {s.heading && <h2 className="font-display text-3xl text-[color:var(--text-main)]">{s.heading}</h2>}
      {s.subheading && <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-soft)]">{s.subheading}</p>}
      <div className="mt-8 overflow-hidden rounded-3xl border border-[color:var(--brand-soft)] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-[color:var(--brand-soft)] bg-[color:var(--surface)]">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">Treatment</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-deep)]">Price (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--brand-soft)]">
              {s.rows.map((row) => (
                <tr key={row.treatment} className="transition hover:bg-[color:var(--surface)]">
                  <td className="px-6 py-4 font-medium text-[color:var(--text-main)]">{row.treatment}</td>
                  <td className="px-6 py-4 text-right font-bold text-[color:var(--brand-deep)]">{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DiameterChart({ s }: { s: Extract<ServiceSection, { type: "diameters" }> }) {
  return (
    <div>
      {s.heading && <h2 className="font-display text-3xl text-[color:var(--text-main)]">{s.heading}</h2>}
      {s.subheading && <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-soft)]">{s.subheading}</p>}
      <div className={`${s.heading || s.subheading ? "mt-8" : ""} max-w-2xl divide-y divide-[color:var(--border-strong)] overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)]`}>
        {s.items.map((item) => (
          <div key={item.label} className="flex items-center gap-4 px-5 py-4 sm:gap-5 sm:px-6">
            <span
              className="h-7 w-14 shrink-0 rounded-md shadow-inner"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className="w-20 shrink-0 font-display text-xl text-[color:var(--brand-deep)]">{item.label}</span>
            {item.description && (
              <span className="text-sm leading-6 text-[color:var(--text-soft)]">{item.description}</span>
            )}
          </div>
        ))}
      </div>
      {s.note && <p className="mt-3 text-xs text-[color:var(--text-soft)]">{s.note}</p>}
    </div>
  );
}

function RenderSection({
  s,
  pricingCtaLabel,
  pricingCtaNote,
  pricingHref,
}: {
  s: ServiceSection;
  pricingCtaLabel: string;
  pricingCtaNote: string;
  pricingHref: string;
}) {
  if (s.type === "callout") return <Callout s={s} />;
  if (s.type === "text") return <TextBlock s={s} />;
  if (s.type === "list") return <BulletList s={s} />;
  if (s.type === "cards") return <Cards s={s} />;
  if (s.type === "steps") return <Steps s={s} />;
  if (s.type === "gallery") return <Gallery s={s} />;
  if (s.type === "diameters") return <DiameterChart s={s} />;
  if (s.type === "pricetable") return <PriceTable s={s} />;
  if (s.type === "pricing") return <PricingCTA s={s} ctaLabel={pricingCtaLabel} ctaNote={pricingCtaNote} href={pricingHref} />;
  if (s.type === "twocol") {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <RenderSection s={s.left} pricingCtaLabel={pricingCtaLabel} pricingCtaNote={pricingCtaNote} pricingHref={pricingHref} />
        <RenderSection s={s.right} pricingCtaLabel={pricingCtaLabel} pricingCtaNote={pricingCtaNote} pricingHref={pricingHref} />
      </div>
    );
  }
  return null;
}

// Maps a service slug → the matching accordion category id on /pricing,
// so the "View Full Pricing" CTA deep-links to the relevant section.
const PRICING_ANCHOR: Record<string, string> = {
  "preventive-dentistry":      "exams-cleaning",
  "cosmetic-dentistry":        "filling",
  "endodontics":               "root-canal",
  "dental-crowns":             "crowns",
  "orthodontics":              "orthodontics",
  "periodontics":              "periodontic",
  "dentures":                  "dentures",
  "dental-implants":           "implants",
  "implant-bridges":           "implants",
  "full-mouth-reconstruction": "implants",
  "oral-surgery":              "surgery",
  "teeth-whitening":           "whitening",
  "sleep-apnea":               "sleep-apnea",
};

// ─── Main content component ─────────────────────────────────────────────────

export async function ServiceDetailContent({ service }: { service: Service }) {
  const t = await getTranslations("services.detail");
  const sections = service.content?.sections ?? [];
  const heroImage = resolveServiceImage(service.imageSrc);
  const pricingCtaLabel = t("pricingCtaLabel");
  const pricingCtaNote = t("pricingCtaNote");
  const anchor = PRICING_ANCHOR[service.slug];
  const pricingHref = anchor ? `/pricing#${anchor}` : "/pricing";

  return (
    <SiteShell>
      {/* Hero */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(300px,440px)] lg:items-stretch lg:px-8">
          <div className="flex flex-col justify-center">
            {service.eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--brand)]">
                {service.eyebrow}
              </p>
            )}
            <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
              {service.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
              {service.heroDescription ?? service.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact" className="btn-primary">{t("bookConsultation")}</Link>
              <Link href="/services" className="btn-secondary">{t("allServices")}</Link>
            </div>
          </div>
          {heroImage && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_20px_60px_rgba(57,28,45,0.10)] lg:aspect-auto lg:min-h-[300px]">
              <Image
                src={heroImage}
                alt={t("imageAlt", { name: service.name })}
                fill
                priority
                sizes="(min-width: 1024px) 440px, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Sections */}
      {sections.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8 space-y-8 sm:space-y-16">
          {sections.map((s, i) => (
            <RenderSection key={i} s={s} pricingCtaLabel={pricingCtaLabel} pricingCtaNote={pricingCtaNote} pricingHref={pricingHref} />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="border-t border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl text-[color:var(--text-main)]">{t("ctaHeading")}</h2>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              {t("ctaBody", { phone: "+855 69 811 338" })}
            </p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">{t("ctaButton")}</Link>
        </div>
      </div>
    </SiteShell>
  );
}
