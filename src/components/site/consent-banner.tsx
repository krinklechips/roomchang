"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

// Cookie that records the visitor's analytics-consent choice. Read on every
// load by the inline Consent Mode script in the root layout (see layout.tsx),
// which re-applies "denied" for returning visitors who opted out.
const COOKIE = "rc_consent";
const ONE_YEAR = 60 * 60 * 24 * 365;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function hasChoice(): boolean {
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE}=`));
}

/** Persist the choice and push a Google Consent Mode v2 update to GTM. */
function applyConsent(value: "granted" | "denied") {
  document.cookie = `${COOKIE}=${value}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
  const update = {
    ad_storage: value,
    analytics_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  };
  // Reuse the gtag() defined by the inline default script; fall back to a raw
  // dataLayer push so the update still reaches GTM if gtag isn't ready.
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", update);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(["consent", "update", update]);
  }
}

export function ConsentBanner() {
  const t = useTranslations("consent");
  const locale = useLocale();
  const [show, setShow] = useState(false);

  // Only decide visibility on the client (the cookie isn't known at SSG time).
  useEffect(() => {
    if (!hasChoice()) setShow(true);
  }, []);

  if (!show) return null;

  const choose = (value: "granted" | "denied") => {
    applyConsent(value);
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label={t("title")}
      className="fixed inset-x-0 bottom-0 z-[70] flex justify-center px-3 pb-3 sm:px-4 sm:pb-4"
    >
      <div className="w-full max-w-3xl rounded-2xl border border-[color:var(--border-strong)] bg-white/95 p-4 shadow-[0_20px_60px_rgba(57,28,45,0.18)] backdrop-blur-sm [animation:fadeSlideUp_.3s_ease] sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-display text-lg leading-tight text-[color:var(--text-main)]">
              {t("title")}
            </p>
            <p className="text-sm leading-6 text-[color:var(--text-soft)]">
              {t("message")}{" "}
              <Link
                href={`/${locale}/cookie-policy`}
                className="font-semibold text-[color:var(--brand-deep)] underline underline-offset-2 transition hover:text-[color:var(--brand)]"
              >
                {t("learnMore")}
              </Link>
            </p>
          </div>
          <div className="flex shrink-0 gap-2 max-sm:w-full">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="btn-secondary btn-primary-sm max-sm:flex-1 max-sm:justify-center"
            >
              {t("decline")}
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="btn-primary btn-primary-sm max-sm:flex-1 max-sm:justify-center"
            >
              {t("accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
