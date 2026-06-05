"use client";

import { useEffect } from "react";

/**
 * When /pricing is opened with a hash (e.g. /pricing#crowns), open the matching
 * <details> accordion section and scroll it into view. Service-page "View Full
 * Pricing" CTAs deep-link here, so the relevant category is expanded on arrival.
 */
export function PricingHashOpener() {
  useEffect(() => {
    function openFromHash() {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      // Expand if it's a <details> accordion section
      if (el.tagName.toLowerCase() === "details") {
        (el as HTMLDetailsElement).open = true;
      }
      // Let the layout settle before scrolling
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return null;
}
