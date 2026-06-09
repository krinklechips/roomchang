import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ZoomableImage } from "@/components/ui/zoomable-image";
import {
  ArrowLeft, CheckCircle, ArrowRight,
  Star, ShieldCheck, Sparkle, Lightning, Clock, CurrencyDollar,
  Heart, Bone, Crosshair, ArrowCounterClockwise,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react/dist/lib/types";
import { InteractiveSteps } from "@/components/sections/interactive-steps";
import { SiteShell } from "@/components/site/site-shell";
import type { TechnologyItem, TechSection } from "@/lib/data";

// ─── Icon map ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, PhosphorIcon> = {
  Star, Shield: ShieldCheck, Sparkles: Sparkle, Zap: Lightning, Clock, DollarSign: CurrencyDollar,
  Heart, Bone, CircleDot: Crosshair, RotateCcw: ArrowCounterClockwise, Check: CheckCircle, ArrowRight,
};

function TechIcon({ name, size = 22 }: { name: string; size?: number }) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} weight="duotone" aria-hidden="true" />;
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
      <InteractiveSteps
        steps={s.items.map((item, index) => ({
          step_label: String(index + 1).padStart(2, "0"),
          title: item.step,
          description: item.detail,
        }))}
      />
    </div>
  );
}

function InlineImage({ s }: { s: Extract<TechSection, { type: "image" }> }) {
  // Inline images are contained + centered by default so a single photo never
  // spans the full content width. `size: "full"` opts back into full width.
  const sizeClass =
    s.size === "small"  ? "max-w-md mx-auto" :
    s.size === "medium" ? "max-w-2xl mx-auto" :
    s.size === "full"   ? "" :
    "max-w-3xl mx-auto";
  return (
    <figure className={sizeClass}>
      <ZoomableImage src={s.src} alt={s.alt} caption={s.caption}>
        <div className="overflow-hidden rounded-2xl border border-[color:var(--border-strong)] shadow-[0_16px_48px_rgba(57,28,45,0.08)]">
          <Image
            src={s.src}
            alt={s.alt}
            width={1200}
            height={700}
            className="w-full h-auto"
            sizes="(min-width: 768px) 768px, 100vw"
          />
        </div>
      </ZoomableImage>
      {s.caption && (
        <figcaption className="mt-3 text-center text-xs text-[color:var(--text-soft)]">{s.caption}</figcaption>
      )}
    </figure>
  );
}

function ImagePair({ s }: { s: Extract<TechSection, { type: "image_pair" }> }) {
  const isVideo = (src: string) => /\.(mp4|webm)$/i.test(src);

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {[s.left, s.right].map((img) => {
        const mediaWrap = "relative aspect-video overflow-hidden rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] shadow-[0_16px_48px_rgba(57,28,45,0.08)]";
        return (
          <figure key={img.src}>
            {isVideo(img.src) ? (
              <div className={mediaWrap}>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  src={img.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            ) : (
              <ZoomableImage src={img.src} alt={img.alt} caption={img.caption}>
                <div className={mediaWrap}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                </div>
              </ZoomableImage>
            )}
            {img.caption && (
              <figcaption className="mt-2 text-center text-xs text-[color:var(--text-soft)]">{img.caption}</figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}

function SelfVideo({ s }: { s: Extract<TechSection, { type: "self_video" }> }) {
  return (
    <figure>
      {s.heading && <h2 className="mb-6 font-display text-3xl text-[color:var(--text-main)]">{s.heading}</h2>}
      <div className="overflow-hidden rounded-2xl border border-[color:var(--border-strong)] shadow-[0_16px_48px_rgba(57,28,45,0.08)]">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          src={s.src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto"
        />
      </div>
      {s.caption && (
        <figcaption className="mt-3 text-center text-xs text-[color:var(--text-soft)]">{s.caption}</figcaption>
      )}
    </figure>
  );
}

function VideoEmbed({ s }: { s: Extract<TechSection, { type: "video" }> }) {
  return (
    <div>
      {s.heading && <h2 className="font-display text-3xl text-[color:var(--text-main)]">{s.heading}</h2>}
      {s.subheading && <p className="mt-3 text-sm text-[color:var(--text-soft)]">{s.subheading}</p>}
      <div className={`${s.heading ? "mt-8" : ""} relative aspect-video overflow-hidden rounded-2xl border border-[color:var(--border-strong)] shadow-[0_16px_48px_rgba(57,28,45,0.08)]`}>
        <iframe
          src={`https://www.youtube.com/embed/${s.videoId}`}
          title={s.heading ?? "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}

function RenderSection({ s }: { s: TechSection }) {
  if (s.type === "callout")    return <Callout s={s} />;
  if (s.type === "text")       return <TextBlock s={s} />;
  if (s.type === "cards")      return <Cards s={s} />;
  if (s.type === "steps")      return <Steps s={s} />;
  if (s.type === "video")      return <VideoEmbed s={s} />;
  if (s.type === "image")      return <InlineImage s={s} />;
  if (s.type === "image_pair") return <ImagePair s={s} />;
  if (s.type === "self_video") return <SelfVideo s={s} />;
  if (s.type === "twocol") {
    return (
      <div className="overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white">
        <div className="grid lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="p-8">
            <RenderSection s={s.left} />
          </div>
          <div className="max-h-[320px] max-w-[360px] overflow-hidden">
            <RenderSection s={s.right} />
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// ─── Category colours ────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  "Orthodontics":      "bg-[linear-gradient(135deg,#a22f7b,#8c2a8d)]",
  "Lab & Restoration": "bg-[linear-gradient(135deg,#0fa5a4,#0b8b8a)]",
  "Cosmetic":          "bg-[linear-gradient(135deg,#c76ad7,#a750b7)]",
  "Infection Control": "bg-[linear-gradient(135deg,#1592db,#0e7cc7)]",
  "Diagnostics":       "bg-[linear-gradient(135deg,#6cab18,#5a9514)]",
};

// ─── Shared content component ────────────────────────────────────────────────

export type TechnologyDetailTranslations = {
  backLink: string;
  bookConsultation: string;
  allTechnology: string;
  ctaHeading: string;
  ctaBody: string;
};

/**
 * Renders the full technology detail page body.
 * Used by both the live page and the preview page.
 */
export function TechnologyDetailContent({ tech, translations: i18n }: { tech: TechnologyItem; translations?: TechnologyDetailTranslations }) {
  const sections = tech.content?.sections ?? [];

  return (
    <SiteShell>
      {/* Hero — text left, product image upper-right (matches the services page) */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(300px,440px)] lg:items-stretch lg:px-8">
          <div className="flex flex-col justify-center">
            <Link
              href="/technology"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
            >
              <ArrowLeft size={13} weight="bold" aria-hidden="true" /> {i18n?.backLink ?? "Technology"}
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
              <Link href="/contact" className="btn-primary">{i18n?.bookConsultation ?? "Book a Consultation"}</Link>
              <Link href="/technology" className="btn-secondary">{i18n?.allTechnology ?? "All Technology"}</Link>
            </div>
          </div>
          {tech.imageSrc && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_20px_60px_rgba(57,28,45,0.10)] lg:aspect-auto lg:min-h-[300px]">
              <Image
                src={tech.imageSrc}
                alt={tech.name}
                fill
                priority
                sizes="(min-width: 1024px) 440px, 100vw"
                className="object-contain p-6"
              />
            </div>
          )}
        </div>
      </div>

      {/* Highlights strip */}
      {tech.highlights.length > 0 && (
        <div className="border-b border-[color:var(--border-strong)] bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {tech.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5 text-sm font-medium text-[color:var(--text-main)]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
                    <CheckCircle size={14} weight="duotone" aria-hidden="true" />
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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8 space-y-8 sm:space-y-16">
          {sections.map((s, i) => (
            <RenderSection key={i} s={s} />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="border-t border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-3xl text-[color:var(--text-main)]">
              {i18n?.ctaHeading ?? "Want to know if this is right for you?"}
            </h2>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              {i18n?.ctaBody ?? "Book a consultation and our specialists will assess your case and advise on the best approach."}
            </p>
          </div>
          <Link href="/contact" className="btn-primary shrink-0">{i18n?.bookConsultation ?? "Book a Consultation"}</Link>
        </div>
      </div>
    </SiteShell>
  );
}
