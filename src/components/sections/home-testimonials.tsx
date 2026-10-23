"use client";

import { startTransition, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Star } from "lucide-react";
import { abbreviateName } from "@/lib/format-name";
import type { Testimonial } from "@/lib/data";
import { TestimonialAvatar } from "@/components/sections/testimonial-video-media";

type TestimonialData = Pick<Testimonial, "id" | "authorName" | "authorTitle" | "quote">
  & Partial<Pick<Testimonial, "authorPhotoUrl" | "rating" | "isFeatured">>;

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function parseOriginAndTreatment(authorTitle: string | null): {
  origin: string;
  treatment: string;
} {
  if (!authorTitle) return { origin: "", treatment: "" };
  const parts = authorTitle.split("—").map((s) => s.trim());
  return {
    origin: parts[0] ?? "",
    treatment: parts[1] ?? "",
  };
}

export function HomeTestimonials({
  testimonials,
  filterFeatured = false,
}: {
  testimonials: TestimonialData[];
  filterFeatured?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const tTestimonials = useTranslations("homeTestimonials");
  const featured = filterFeatured ? testimonials.filter((testimonial) => testimonial.isFeatured === true) : [];
  const displayed = featured.length > 0 ? featured : testimonials;

  useEffect(() => {
    if (paused || displayed.length === 0) return;
    const nextActive = (i: number) => (i + 1) % displayed.length;
    const advance = () => startTransition(() => setActive(nextActive));
    const id = setInterval(advance, 6000);
    return () => clearInterval(id);
  }, [paused, displayed.length]);

  if (displayed.length === 0) return null;

  const activeIndex = active < displayed.length ? active : 0;
  const current = displayed[activeIndex];
  const { origin, treatment } = parseOriginAndTreatment(current.authorTitle);
  return (
    <section
      className="border-t border-[color:var(--border-strong)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-24 lg:px-8">
        {/* Quote mark */}
        <div className="flex justify-center">
          <svg
            width="44"
            height="36"
            viewBox="0 0 44 36"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0 36V22.4C0 15.467 1.6 9.867 4.8 5.6 8.267 1.333 13.067 0 19.2 0v6.4c-3.2 0-5.6.933-7.2 2.8C10.4 11.067 9.6 14 9.6 17.6H18V36H0ZM26 36V22.4c0-6.933 1.6-12.533 4.8-16.8C34.267 1.333 39.067 0 45.2 0v6.4c-3.2 0-5.6.933-7.2 2.8C36.4 11.067 35.6 14 35.6 17.6H44V36H26Z"
              fill="var(--brand)"
              opacity="0.25"
            />
          </svg>
        </div>

        {/* Quote text */}
        <blockquote className="mt-8 text-center">
          <p className="line-clamp-3 font-display text-[1.45rem] leading-[1.6] text-[color:var(--text-main)] sm:text-[1.7rem]">
            &ldquo;{current.quote}&rdquo;
          </p>
        </blockquote>

        {/* Attribution */}
        <div className="mt-8 flex flex-col items-center gap-1">
          <p className="font-semibold text-[color:var(--text-main)]">{abbreviateName(current.authorName)}</p>
          {origin && <p className="text-sm text-[color:var(--text-soft)]">{origin}</p>}
          {typeof current.rating === "number" && Number.isFinite(current.rating) && current.rating >= 1 && current.rating <= 5 && (
            <p className="flex items-center gap-1 text-xs text-[color:var(--text-soft)]">
              <Star size={12} fill="currentColor" aria-hidden="true" />
              <span>{current.rating}/5</span>
            </p>
          )}
          {treatment && (
            <span className="mt-1 rounded-full bg-[color:var(--brand-soft)] px-3 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-deep)]">
              {treatment}
            </span>
          )}
        </div>

        {/* Avatar navigation */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {displayed.map((t, i) => {
            const isActive = i === activeIndex;
            return (
              <button
                key={t.id}
                type="button"
                aria-label={tTestimonials("readAriaLabel", { name: t.authorName })}
                aria-pressed={isActive}
                onClick={() => {
                  setPaused(true);
                  setActive(i);
                }}
                className={`flex items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                  isActive
                    ? "h-14 w-14 bg-[color:var(--brand)] text-base text-white shadow-[0_8px_24px_rgba(204,55,113,0.35)]"
                    : "h-10 w-10 bg-[color:var(--surface-strong)] text-sm text-[color:var(--text-soft)] hover:bg-[color:var(--brand-soft)] hover:text-[color:var(--brand-deep)]"
                }`}
              >
                <TestimonialAvatar photoUrl={t.authorPhotoUrl} initials={getInitials(t.authorName)} />
              </button>
            );
          })}
        </div>

        {/* Link to full testimonials */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/about/testimonials"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--brand-deep)] transition hover:text-[color:var(--brand)]"
          >
            {tTestimonials("seeAll")} <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
