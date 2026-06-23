"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Wraps a thumbnail (passed as children) in a click/tap-to-zoom affordance and
 * an accessible lightbox. The lightbox loads the full-resolution `src` so
 * detail-heavy images (clinical before/after, equipment/software shots) can be
 * inspected closely even though the inline thumbnail is kept small.
 *
 * Accessibility: the trigger is a real <button>; the overlay is a
 * role="dialog" aria-modal with focus moved to the close button, focus trapped
 * to it while open, Escape + backdrop-click to close, and focus restored to the
 * trigger on close. Body scroll is locked while open.
 */
export function ZoomableImage({
  src,
  alt,
  caption,
  children,
}: {
  src: string;
  alt: string;
  caption?: string;
  children: ReactNode;
}) {
  const t = useTranslations("zoomableImage");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      // Only the close button is interactive — keep focus on it.
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={alt ? t("trigger.enlargeWithAlt", { alt }) : t("trigger.enlarge")}
        className="group relative block w-full cursor-zoom-in"
      >
        {children}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[color:rgba(20,10,18,0.55)] text-white opacity-60 shadow-lg backdrop-blur-sm transition group-hover:opacity-100"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
        </span>
      </button>

      {open && (
        // Backdrop closes on click; keyboard users dismiss with Escape (handled
        // by the keydown listener above).
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt || t("dialog.label")}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("close")}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-[86vh] max-w-full rounded-lg object-contain shadow-2xl"
          />
          {caption && (
            <p className="mt-3 max-w-2xl text-center text-sm text-white/80">{caption}</p>
          )}
        </div>
      )}
    </>
  );
}