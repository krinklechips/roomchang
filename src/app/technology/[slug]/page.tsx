import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, Check, ArrowRight,
  Star, Shield, Sparkles, Zap, Clock, DollarSign,
  Heart, Bone, CircleDot, RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { getTechnologyBySlug, getTechnology, type TechSection } from "@/lib/data";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const items = await getTechnology();
  return items.filter((t) => t.slug).map((t) => ({ slug: t.slug! }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tech = await getTechnologyBySlug(slug);
  if (!tech) return {};
  return {
    title: `${tech.name} | Roomchang Dental Hospital`,
    description: tech.description ?? undefined,
  };
}

// ─── Icon map ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Star, Shield, Sparkles, Zap, Clock, DollarSign,
  Heart, Bone, CircleDot, RotateCcw, Check, ArrowRight,
};

function TechIcon({ name, size = 22 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} strokeWidth={1.75} aria-hidden="true" />;
}

// ─── Section renderers ────────────────────────────────────────────────────────

function Callout({ s }: { s: Extract<TechSection, { type: "callout" }> }) {
  return (
    <div className="rounded-3xl bg-[color:var(--brand-soft)] px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        {s.icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color:var(--brand)] text-white">
            <TechIcon name={s.icon} />
          </div>
        )}
        <div>
          <p className="font-semibold text-[color:var(--brand-deep)]">{s.title}</p>
          <p className="mt-1 text-sm leading-7 text-[color:var(--text-soft)]">{s.body}</p>
        </div>
      </div>
    </div>
  );
}

function TextBlock({ s }: { s: Extract<TechSection, { type: "text" }> }) {
  const inner = (
    <>
      <h2 className="font-display text-2xl text-[color:var(--text-main)]">{s.heading}</h2>
      <div className="mt-3 text-sm leading-7 text-[color:var(--text-soft)] space-y-3">
        {String(s.body).split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
      </div>
    </>
  );
  return s.card ? (
    <div className="rounded-3xl border border-[color:var(--border-strong)] bg-white p-8">{inner}</div>
  ) : (
    <div>{inner}</div>
  );
}

function Cards({ s }: { s: Extract<TechSection, { type: "cards" }> }) {
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
        {s.items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-[color:var(--border-strong)] bg-white p-6">
            {item.icon && (
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                <TechIcon name={item.icon} />
              </div>
            )}
            <h3 className="font-display text-xl text-[color:var(--text-main)]">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Steps({ s }: { s: Extract<TechSection, { type: "steps" }> }) {
  return (
    <div>
      <h2 className="font-display text-3xl text-[color:var(--text-main)]">{s.heading}</h2>
      {s.subheading && <p className="mt-3 text-sm text-[color:var(--text-soft)]">{s.subheading}</p>}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {s.items.map((item, i) => (
          <div key={item.step} className="rounded-2xl border border-[color:var(--border-strong)] bg-white p-6">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--brand)] text-white text-sm font-bold">
              {i + 1}
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--brand)]">{item.step}</p>
            <p className="mt-2 text-sm leading-7 text-[color:var(--text-soft)]">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RenderSection({ s }: { s: TechSection }) {
  if (s.type === "callout") return <Callout s={s} />;
  if (s.type === "text")    return <TextBlock s={s} />;
  if (s.type === "cards")   return <Cards s={s} />;
  if (s.type === "steps")   return <Steps s={s} />;
  return null;
}

// ─── Page ────────────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  "Orthodontics":      "bg-[linear-gradient(135deg,#a22f7b,#8c2a8d)]",
  "Lab & Restoration": "bg-[linear-gradient(135deg,#0fa5a4,#0b8b8a)]",
  "Cosmetic":          "bg-[linear-gradient(135deg,#c76ad7,#a750b7)]",
  "Infection Control": "bg-[linear-gradient(135deg,#1592db,#0e7cc7)]",
  "Diagnostics":       "bg-[linear-gradient(135deg,#6cab18,#5a9514)]",
};

export default async function TechnologyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tech = await getTechnologyBySlug(slug);
  if (!tech) notFound();

  const sections = tech.content?.sections ?? [];

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/technology"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> Technology
          </Link>
          <div className="mt-4">
            <span className={`inline-block rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-white ${CATEGORY_COLORS[tech.category] ?? "bg-[color:var(--brand)]"}`}>
              {tech.category}
            </span>
          </div>
          <h1 className="mt-3 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            {tech.name}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            {tech.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact" className="btn-primary">Book a Consultation</Link>
            <Link href="/technology" className="btn-secondary">All Technology</Link>
          </div>
        </div>
      </div>

      {/* Hero image */}
      {tech.imageSrc && (
        <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <Image
              src={tech.imageSrc}
              alt={tech.name}
              width={1200}
              height={700}
              className="w-full h-auto rounded-2xl object-contain"
              priority
            />
          </div>
        </div>
      )}

      {/* Highlights strip */}
      {tech.highlights.length > 0 && (
        <div className="border-b border-[color:var(--border-strong)] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {tech.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2.5 text-sm font-medium text-[color:var(--text-main)]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                    <Check size={11} strokeWidth={3} aria-hidden="true" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Content sections */}
      {sections.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 space-y-16">
          {sections.map((s, i) => (
            <RenderSection key={i} s={s} />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="border-t border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl text-[color:var(--text-main)]">
              Want to know if this is right for you?
            </h2>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              Book a consultation and our specialists will assess your case and advise on the best approach.
            </p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">Book a Consultation</Link>
        </div>
      </div>
    </SiteShell>
  );
}
