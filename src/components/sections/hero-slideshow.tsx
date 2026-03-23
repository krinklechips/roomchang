"use client";

import type { CSSProperties } from "react";
import { startTransition, useEffect, useState } from "react";

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

  const updateSlide = (nextIndex: number) => {
    startTransition(() => {
      setActiveIndex(getWrappedIndex(nextIndex, slides.length));
    });
  };

  const showNext = () => updateSlide(activeIndex + 1);
  const showPrevious = () => updateSlide(activeIndex - 1);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return undefined;

    const intervalId = window.setInterval(() => {
      startTransition(() => {
        setActiveIndex((current) => getWrappedIndex(current + 1, slides.length));
      });
    }, autoRotateMs);

    return () => window.clearInterval(intervalId);
  }, [autoRotateMs, isPaused, slides.length]);

  const activeSlide = slides[activeIndex];
  const shouldPreserveFullImage = Boolean(activeSlide.preserveFullImage);
  const preserveImageStyle = shouldPreserveFullImage
    ? ({
        backgroundImage: `url(${activeSlide.imageSrc})`,
        backgroundRepeat: "no-repeat",
        "--hero-mobile-image-position":
          activeSlide.mobileImagePosition ?? activeSlide.imagePosition ?? "center center",
        "--hero-image-position": activeSlide.imagePosition ?? "center center",
        "--hero-mobile-image-size": activeSlide.mobileImageSize ?? activeSlide.imageSize ?? "contain",
        "--hero-image-size": activeSlide.imageSize ?? "contain",
      } as CSSProperties)
    : undefined;

  const dots = (
    <div className="flex items-center gap-2">
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={slide.id}
            type="button"
            aria-label={`Show ${slide.title}`}
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
      aria-label="Roomchang hero slideshow"
      className={`${flush ? "" : "panel-card p-3 sm:p-4"} relative overflow-hidden ${className}`}
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
        role="img"
        aria-label={activeSlide.imageAlt}
        className={`relative min-h-[23rem] overflow-hidden rounded-[1.6rem] bg-[--surface-strong] sm:min-h-[28rem] lg:min-h-[31rem] ${mediaClassName}`}
        style={{
          backgroundColor: shouldPreserveFullImage ? "white" : undefined,
          backgroundImage: shouldPreserveFullImage
            ? "none"
            : `linear-gradient(180deg, rgba(255, 255, 255, 0.08), rgba(44, 26, 40, 0.18)), url(${activeSlide.imageSrc})`,
          backgroundPosition: shouldPreserveFullImage
            ? "center"
            : (activeSlide.imagePosition ?? "center"),
          backgroundSize: shouldPreserveFullImage
            ? "cover"
            : (activeSlide.imageSize ?? "cover"),
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Foreground image layer for preserve mode — rendered first so overlays sit on top */}
        {shouldPreserveFullImage && (
          <div
            data-testid="hero-foreground-image"
            className="absolute inset-0 bg-no-repeat [background-position:var(--hero-mobile-image-position)] [background-size:var(--hero-mobile-image-size)] sm:[background-position:var(--hero-image-position)] sm:[background-size:var(--hero-image-size)]"
            style={preserveImageStyle}
          />
        )}

        {/* Depth overlay — only on photo slides for text readability */}
        {!shouldPreserveFullImage && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.35),_transparent_34%),linear-gradient(180deg,_rgba(255,249,250,0.04)_0%,_rgba(44,26,40,0.22)_100%)]" />
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
        <div className="absolute right-4 top-4 flex items-center gap-2 sm:right-5 sm:top-5">
          <button
            type="button"
            aria-label="Show previous slide"
            onClick={showPrevious}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-[color:rgba(255,255,255,0.18)] text-lg text-white backdrop-blur transition hover:bg-[color:rgba(255,255,255,0.28)]"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Show next slide"
            onClick={showNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-[color:rgba(255,255,255,0.18)] text-lg text-white backdrop-blur transition hover:bg-[color:rgba(255,255,255,0.28)]"
          >
            ›
          </button>
        </div>

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
                  aria-label={`Show ${slide.title}`}
                  onClick={() => updateSlide(index)}
                  className={`h-2.5 rounded-full transition ${
                    isActive ? "w-10 bg-[--brand]" : "w-2.5 bg-[--brand-soft]"
                  }`}
                />
              );
            })}
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[--text-soft]">
            Swipe on mobile
          </p>
        </div>
      )}
    </section>
  );
}
