"use client";

import type { CSSProperties } from "react";
import { startTransition, useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type HeroSlide = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: string;
  imageSize?: string;
  mobileImagePosition?: string;
  mobileImageSize?: string;
  preserveFullImage?: boolean;
};

type HeroSlideshowProps = {
  slides: HeroSlide[];
  autoRotateMs?: number;
  className?: string;
  mediaClassName?: string;
  showCaption?: boolean;
  flush?: boolean;
};

const SWIPE_THRESHOLD = 44;

function getWrappedIndex(index: number, total: number) {
  return (index + total) % total;
}

export function HeroSlideshow({
  slides,
  autoRotateMs = 5200,
  className = "",
  mediaClassName = "",
  showCaption = true,
  flush = false,
}: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const t = useTranslations("heroSlideshow");

  const updateSlide = (nextIndex: number) => {
    startTransition(() => {
      setActiveIndex(getWrappedIndex(nextIndex, slides.length));
    });
  };

  const showNext = () => updateSlide(activeIndex + 1);
  const showPrevious = () => updateSlide(activeIndex - 1);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return undefined;

    const nextIndex = (current: number) => getWrappedIndex(current + 1, slides.length);
    const advance = () => startTransition(() => setActiveIndex(nextIndex));

    const intervalId = window.setInterval(advance, autoRotateMs);
    return () => window.clearInterval(intervalId);
  }, [autoRotateMs, isPaused, slides.length]);

  const activeSlide = slides[activeIndex];
  const shouldPreserveFullImage = Boolean(activeSlide.preserveFullImage);
  // object-position is responsive: mobile var by default, desktop var at sm+.
  const mobileImagePosition = activeSlide.mobileImagePosition ?? activeSlide.imagePosition ?? "center center";
  const imagePosition = activeSlide.imagePosition ?? "center center";
  const imagePositionStyle = {
    "--hero-mobile-image-position": mobileImagePosition,
    "--hero-image-position": imagePosition,
  } as CSSProperties;

  const dots = (
    <div className="flex items-center gap-2">
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={slide.id}
            type="button"
            aria-label={t("showSlide", { title: slide.title })}
            onClick={() => updateSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              isActive ? "w-8 bg-white" : "w-2 bg-white/40"
            }`}
          />
        );
      })}
    </div>
  );

  return (
    <section
      aria-label={t("ariaLabel")}
      className={`${flush ? "" : "panel-card p-3 sm:p-4"} relative overflow-hidden xl:h-full ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={(event) => setTouchStartX(event.changedTouches[0]?.clientX ?? null)}
      onTouchEnd={(event) => {
        if (touchStartX == null) return;
        const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
        const delta = touchStartX - touchEndX;
        if (Math.abs(delta) >= SWIPE_THRESHOLD) {
          if (delta > 0) {
            showNext();
          } else {
            showPrevious();
          }
        }
        setTouchStartX(null);
      }}
    >
      <div
        data-testid="hero-stage"
        // preserveFullImage slides are panoramic (~2.4:1). At lg (small-laptop
        // ~1024-1280px) the 16/9 stage left big top/bottom gaps — switch to a
        // matching ~2.4:1 box ONLY at lg. Mobile/tablet keep the natural 16/9
        // hero (Aliza feedback round 2). No role="img" — the nested <Image>
        // carries the alt text, so a wrapper label would double-announce.
        className={`relative min-h-0 overflow-hidden rounded-[1.6rem] sm:min-h-[28rem] ${shouldPreserveFullImage ? "bg-white lg:!aspect-[12/5] lg:!min-h-0" : "bg-[color:var(--surface-strong)]"} xl:min-h-[31rem] xl:!aspect-auto ${mediaClassName}`}
      >
        {/* Slide image via next/image (resized + WebP/AVIF instead of a raw R2
            background download). preserveFullImage → object-contain on the white
            stage: the panorama is anchored by object-position with light margins
            that blend into the page, reproducing the old background-size:100%/
            contain. Photo slides → cover (contain on mobile to avoid hard crops),
            matching the previous responsive size vars. */}
        <Image
          key={activeSlide.id}
          data-testid="hero-foreground-image"
          src={activeSlide.imageSrc}
          alt={activeSlide.imageAlt}
          fill
          sizes="100vw"
          priority={activeIndex === 0}
          style={imagePositionStyle}
          className={`select-none [object-position:var(--hero-mobile-image-position)] sm:[object-position:var(--hero-image-position)] ${shouldPreserveFullImage ? "object-contain" : "object-contain sm:object-cover"}`}
          draggable={false}
        />

        {/* Depth overlay — only on photo slides for text readability */}
        {!shouldPreserveFullImage && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.35),_transparent_34%),linear-gradient(180deg,_rgba(255,249,250,0.04)_0%,_rgba(44,26,40,0.22)_100%)]" />
        )}

        {showCaption && (
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <div className="rounded-[1.5rem] border border-white/25 bg-[color:rgba(36,20,31,0.56)] p-4 text-white shadow-2xl backdrop-blur-md sm:p-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/70">
                {activeSlide.eyebrow}
              </p>
              <p className="mt-2 font-display text-3xl leading-none sm:text-[2.6rem]">
                {activeSlide.title}
              </p>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/82 sm:text-[0.95rem]">
                {activeSlide.description}
              </p>
            </div>
          </div>
        )}

        {/* Prev / Next controls */}
        <button
          type="button"
          aria-label={t("previousAriaLabel")}
          onClick={showPrevious}
          className="absolute left-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/24 bg-[color:rgba(255,255,255,0.12)] text-white backdrop-blur-md transition hover:bg-[color:rgba(255,255,255,0.24)] sm:flex"
        >
          <ChevronLeft size={22} strokeWidth={2} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={t("nextAriaLabel")}
          onClick={showNext}
          className="absolute right-4 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/24 bg-[color:rgba(255,255,255,0.12)] text-white backdrop-blur-md transition hover:bg-[color:rgba(255,255,255,0.24)] sm:flex"
        >
          <ChevronRight size={22} strokeWidth={2} aria-hidden="true" />
        </button>

        {/* Dots inside the image when flush (so CTA dock positions correctly) */}
        {flush && (
          <div className="absolute bottom-4 left-4 z-10 sm:bottom-5 sm:left-6">
            {dots}
          </div>
        )}
      </div>

      {/* Dots below image in non-flush (card) mode */}
      {!flush && (
        <div className="mt-4 flex items-center justify-between gap-4 px-1">
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={t("showSlide", { title: slide.title })}
                  onClick={() => updateSlide(index)}
                  className={`h-2.5 rounded-full transition ${
                    isActive ? "w-10 bg-[color:var(--brand)]" : "w-2.5 bg-[color:var(--brand-soft)]"
                  }`}
                />
              );
            })}
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--text-soft)]">
            {t("swipeHint")}
          </p>
        </div>
      )}
    </section>
  );
}
