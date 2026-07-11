"use client";

import { useEffect, useRef } from "react";

/**
 * Autoplaying decorative video that only downloads once it scrolls into view.
 * A plain <video autoPlay> downloads the entire file during initial page load
 * (the 0.5–1.2MB technology MP4s competed with the hero for bandwidth) —
 * preload="none" + IntersectionObserver defers the fetch until the video is
 * near the viewport, then plays/pauses with visibility.
 */
export function LazyVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() triggers the deferred download on first visibility
          el.play().catch(() => {
            // Autoplay can be blocked (e.g. low-power mode) — leave it paused.
          });
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={ref}
      src={src}
      preload="none"
      loop
      muted
      playsInline
      className={className}
    />
  );
}
