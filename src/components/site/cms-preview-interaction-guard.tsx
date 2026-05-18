"use client";

import { useEffect } from "react";

function isCmsPreviewMode(): boolean {
  return new URLSearchParams(window.location.search).has("cmsPreview");
}

function closestInteractiveElement(target: EventTarget | null): Element | null {
  return target instanceof Element
    ? target.closest("a[href], button, [role='button'], input[type='submit'], input[type='button']")
    : null;
}

export function CmsPreviewInteractionGuard() {
  useEffect(() => {
    if (!isCmsPreviewMode()) return;

    const blockInteractiveClick = (event: MouseEvent) => {
      if (!closestInteractiveElement(event.target)) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    };

    const blockFormSubmit = (event: SubmitEvent) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    };

    document.documentElement.dataset.cmsPreviewMode = "true";
    document.addEventListener("click", blockInteractiveClick, true);
    document.addEventListener("submit", blockFormSubmit, true);

    return () => {
      delete document.documentElement.dataset.cmsPreviewMode;
      document.removeEventListener("click", blockInteractiveClick, true);
      document.removeEventListener("submit", blockFormSubmit, true);
    };
  }, []);

  return null;
}
