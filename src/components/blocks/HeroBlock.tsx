import Image from "next/image";
import Link from "next/link";

interface HeroBlockProps {
  heroTitle?: string;
  heroSubtitle?: string;
  heroEyebrow?: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroImagePosition?: string;
  heroImageSize?: string;
  heroPreserveFullImage?: boolean;
  ctaText?: string;
  ctaUrl?: string;
}

export function HeroBlock({
  heroTitle,
  heroSubtitle,
  heroEyebrow,
  heroImage,
  heroImageAlt,
  heroImagePosition,
  heroPreserveFullImage,
  ctaText,
  ctaUrl,
}: HeroBlockProps) {
  const hasBg = !!heroImage;
  const objectPos = heroImagePosition
    ? heroImagePosition.replace("center ", "").replace(" center", "") || "center"
    : "center";

  return (
    <section
      className={`relative overflow-hidden ${hasBg ? "min-h-[55vh]" : "bg-[color:var(--surface)]"} flex items-center`}
    >
      {hasBg && (
        <>
          <Image
            src={heroImage!}
            alt={heroImageAlt || heroTitle || "Hero"}
            fill
            priority
            className={`object-${heroPreserveFullImage ? "contain" : "cover"} object-${objectPos}`}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[color:var(--text-main)]/40" />
        </>
      )}

      <div className="relative mx-auto w-full max-w-5xl px-6 py-20 lg:px-8 lg:py-28">
        {heroEyebrow && (
          <p
            className={`mb-3 text-[0.65rem] font-bold uppercase tracking-[0.35em] ${
              hasBg ? "text-white/80" : "text-[color:var(--brand)]"
            }`}
          >
            {heroEyebrow}
          </p>
        )}

        {heroTitle && (
          <h1
            className={`font-display text-4xl leading-tight md:text-5xl lg:text-6xl ${
              hasBg ? "text-white" : "text-[color:var(--text-main)]"
            }`}
          >
            {heroTitle}
          </h1>
        )}

        {heroSubtitle && (
          <p
            className={`mt-5 max-w-xl text-sm leading-8 ${
              hasBg ? "text-white/85" : "text-[color:var(--text-soft)]"
            }`}
          >
            {heroSubtitle}
          </p>
        )}

        {ctaText && ctaUrl && (
          <div className="mt-8">
            <Link href={ctaUrl} className="btn-primary">
              {ctaText}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
