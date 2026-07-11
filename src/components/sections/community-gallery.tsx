"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";

export function CommunityGallery({
  images,
  title,
  columns = 3,
}: {
  images: string[];
  title: string;
  /** Max thumbnails per row on desktop (default 3). Use more for smaller thumbnails. */
  columns?: 3 | 4 | 5;
}) {
  const t = useTranslations("communityGallery");
  const gridCols =
    columns === 5 ? "sm:grid-cols-4 lg:grid-cols-5" :
    columns === 4 ? "sm:grid-cols-3 lg:grid-cols-4" :
    "sm:grid-cols-3";
  // Tell next/image the rendered width per breakpoint so thumbnails download
  // as small resized WebP/AVIF variants instead of the full R2 originals.
  const thumbSizes =
    columns === 5 ? "(min-width: 1024px) 20vw, (min-width: 640px) 25vw, 50vw" :
    columns === 4 ? "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" :
    "(min-width: 640px) 33vw, 50vw";
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length],
  );
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length],
  );

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    // Lock body scroll while the lightbox is open, restoring the prior value on close
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, prev, next]);

  // Restore focus to the triggering thumbnail when the lightbox closes
  useEffect(() => {
    if (!isOpen && triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);

  return (
    <>
      {/* Thumbnail grid */}
      <div className={`grid grid-cols-2 gap-3 sm:gap-4 ${gridCols}`}>
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setOpenIndex(i);
            }}
            className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-2xl bg-[color:var(--surface)] shadow-[0_8px_24px_rgba(57,28,45,0.06)]"
            aria-label={t("thumbnail.viewPhoto", { index: i + 1, total: images.length })}
          >
            {/* next/image so thumbnails go through /_next/image (resized +
                AVIF) instead of downloading full-size R2 originals per tile.
                The lightbox below keeps a raw <img> for the full photo. */}
            <Image
              src={src}
              alt={t("thumbnail.alt", { title, index: i + 1, total: images.length })}
              fill
              sizes={thumbSizes}
              className="object-cover transition duration-300 group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={t("lightbox.dialogLabel", { title })}
        >
          {/* Backdrop — a real button so click-to-close is keyboard-accessible
              (Escape/arrows are also handled by the keydown listener above). */}
          <button
            type="button"
            onClick={close}
            aria-label={t("lightbox.close")}
            className="absolute inset-0 cursor-zoom-out"
          />

          {/* Close */}
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label={t("lightbox.close")}
          >
            <X size={22} weight="bold" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
              aria-label={t("lightbox.previous")}
            >
              <CaretLeft size={26} weight="bold" />
            </button>
          )}

          {/* Image */}
          <div className="relative flex max-h-[88vh] max-w-[92vw] flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[openIndex]}
              alt={t("lightbox.alt", { title, index: openIndex + 1, total: images.length })}
              className="max-h-[82vh] max-w-full rounded-lg object-contain shadow-2xl"
            />
            <p className="mt-3 text-sm font-medium text-white/70">
              {openIndex + 1} / {images.length}
            </p>
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
              aria-label={t("lightbox.next")}
            >
              <CaretRight size={26} weight="bold" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
