"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import type { ClinicalCase } from "@/lib/data";

const CATEGORY_ORDER = [
  "Full Mouth",
  "Implants & Crowns",
  "Implant Bridges",
  "Orthodontics",
  "Cosmetic & E-Max",
];

const HASH_TO_CATEGORY: Record<string, string> = {
  "full-mouth": "Full Mouth",
  implants:     "Implants & Crowns",
  bridges:      "Implant Bridges",
  orthodontics: "Orthodontics",
  cosmetic:     "Cosmetic & E-Max",
};

/** Map DB category/tag values → i18n keys */
const CAT_I18N: Record<string, string> = {
  "Full Mouth":       "cat.fullMouth",
  "Implants & Crowns":"cat.implantsCrowns",
  "Implant Bridges":  "cat.implantBridges",
  "Orthodontics":     "cat.orthodontics",
  "Cosmetic & E-Max": "cat.cosmeticEmax",
};

const TAG_I18N: Record<string, string> = {
  "Before & After": "tag.beforeAfter",
  "Cosmetic":       "tag.cosmetic",
};

export function ClinicalResultsGrid({ cases }: { cases: ClinicalCase[] }) {
  const t = useTranslations("clinicalResultsGrid");
  const rawCategories = Array.from(new Set(cases.map((c) => c.category)));
  const categories = [
    "All",
    ...CATEGORY_ORDER.filter((c) => rawCategories.includes(c)),
    ...rawCategories.filter((c) => !CATEGORY_ORDER.includes(c)),
  ];
  const [active, setActive] = useState("All");

  // Activate the filter from the URL hash — on first load AND whenever the hash
  // changes. Without the hashchange listener, tapping another category in the
  // header dropdown while already on this page would do nothing (the effect ran
  // only once at mount, so the filter stayed stuck on its initial value).
  useEffect(() => {
    function applyHashFilter() {
      const hash = window.location.hash.replace("#", "");
      if (hash && HASH_TO_CATEGORY[hash]) {
        setActive(HASH_TO_CATEGORY[hash]);
        // Scroll the matching filter pill into view
        document.getElementById(`filter-${hash}`)?.scrollIntoView({ block: "center" });
      } else if (!hash) {
        // "All Cases" link (no hash) resets the filter
        setActive("All");
      }
    }

    applyHashFilter();

    // hashchange fires for back/forward and native hash changes, but NOT for the
    // header dropdown's Next.js <Link>, whose same-page hash navigation goes
    // through history.pushState. Rather than patch global history (which runs
    // inside React's insertion-effect during navigation and throws), poll the
    // hash on a light interval to catch those changes.
    let lastHash = window.location.hash;
    const intervalId = window.setInterval(() => {
      if (window.location.hash !== lastHash) {
        lastHash = window.location.hash;
        applyHashFilter();
      }
    }, 150);
    window.addEventListener("hashchange", applyHashFilter);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("hashchange", applyHashFilter);
    };
  }, []);

  const filtered = active === "All" ? cases : cases.filter((c) => c.category === active);

  return (
    <div className="space-y-14">
      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const hashKey = Object.entries(HASH_TO_CATEGORY).find(([, v]) => v === cat)?.[0];
          return (
            <button
              key={cat}
              id={hashKey ? `filter-${hashKey}` : undefined}
              type="button"
              onClick={() => setActive(cat === active && cat !== "All" ? "All" : cat)}
              className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                cat === active
                  ? "border-[color:var(--brand)] bg-[color:var(--brand)] text-white"
                  : "border-[color:var(--border-strong)] bg-white text-[color:var(--text-soft)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand-deep)]"
              }`}
            >
              {cat === "All" ? t("filterAll") : CAT_I18N[cat] ? t(CAT_I18N[cat]) : cat}
            </button>
          );
        })}
      </div>

      {/* Cases grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Link
            key={c.slug}
            href={`/clinical-results/${c.slug}`}
            className="group flex flex-col overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(57,28,45,0.1)]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[color:var(--surface-strong)]">
              {c.cardImage && (
                <Image
                  src={c.cardImage}
                  alt={t("altPattern", { title: c.title })}
                  fill
                  className="object-contain transition duration-500 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              )}
              <span className="absolute right-3 top-3 z-10 rounded-full bg-[color:var(--brand-soft)] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-deep)]">
                {TAG_I18N[c.tag] ? t(TAG_I18N[c.tag]) : c.tag}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-2.5 p-6">
              <h2 className="font-display text-xl leading-tight text-[color:var(--text-main)] transition group-hover:text-[color:var(--brand-deep)]">
                {c.title}
              </h2>
              <p className="line-clamp-2 text-xs font-semibold leading-snug text-[color:var(--brand-deep)]">{c.treatment}</p>
              <p className="line-clamp-3 flex-1 text-sm leading-6 text-[color:var(--text-soft)]">{c.description}</p>
              <div className="mt-auto flex items-center justify-between border-t border-[color:var(--border-strong)] pt-3">
                <span className="text-xs text-[color:var(--text-soft)]">
                  {t("duration")} <span className="font-semibold text-[color:var(--text-main)]">{c.duration}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--brand-deep)] transition group-hover:text-[color:var(--brand)]">
                  {t("viewCase")} <ArrowRight size={12} strokeWidth={2} aria-hidden="true" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-[color:var(--text-soft)]">
          {t("noResults", { category: active })}{" "}
          <button
            onClick={() => setActive("All")}
            className="font-semibold text-[color:var(--brand)] underline"
          >
            {t("showAll")}
          </button>
        </p>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-[color:var(--text-soft)]">
        {t("disclaimer")}
      </p>

      {/* CTA */}
      <section className="rounded-3xl bg-[color:var(--brand-soft)] p-10 sm:p-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-4xl text-[color:var(--text-main)]">{t("cta.heading")}</h2>
            <p className="mt-2 max-w-md text-sm leading-7 text-[color:var(--text-soft)]">
              {t("cta.body")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary shrink-0">{t("cta.bookButton")}</Link>
            <Link href="/pricing" className="btn-secondary shrink-0">{t("cta.pricingButton")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
