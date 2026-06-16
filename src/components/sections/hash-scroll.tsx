"use client";

import { useEffect } from "react";

/**
 * Scrolls to the element matching the URL hash on arrival.
 *
 * Next.js App Router doesn't reliably honour `#anchor` on cross-page navigation
 * (it resets scroll on load/hydration), and lazy images below the fold shift
 * layout after the initial scroll. This re-runs the scroll a few times so the
 * target (e.g. /about/facilities#locations from a branch page's back link)
 * actually lands in view. Respects the target's CSS scroll-margin-top.
 */
export function HashScroll() {
  useEffect(() => {
    function scrollToHash() {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!id) return;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    scrollToHash();
    // Retry after layout settles (fonts/lazy images can shift the target down).
    const timers = [250, 700].map((ms) => window.setTimeout(scrollToHash, ms));
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  return null;
}
