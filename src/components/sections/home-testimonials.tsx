"use client";

import { startTransition, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface TestimonialData {
  id: string;
  authorName: string;
  authorTitle: string | null;
  quote: string;
}

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
}: {
  testimonials: TestimonialData[];
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || testimonials.length === 0) return;
    function advance() {
      startTransition(() => {
        setActive((i) => (i + 1) % testimonials.length);
      });
    }
    const id = setInterval(advance, 6000);
    return () => clearInterval(id);
  }, [paused, testimonials.length]);

  if (testimonials.length === 0) return null;

  const current = testimonials[active];
  const { origin, treatment } = parseOriginAndTreatment(current.authorTitle);
  const initials = getInitials(current.authorName);

  return (
    <section
      className="border-t border-[--border-strong]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
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
          <p className="font-display text-[1.45rem] leading-[1.6] text-[--text-main] sm:text-[1.7rem]">
            &ldquo;{current.quote}&rdquo;
          </p>
        </blockquote>

        {/* Attribution */}
        <div className="mt-8 flex flex-col items-center gap-1">
          <p className="font-semibold text-[--text-main]">{current.authorName}</p>
          {origin && <p className="text-sm text-[--text-soft]">{origin}</p>}
          {treatment && (
            <span className="mt-1 rounded-full bg-[--brand-soft] px-3 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[--brand-deep]">
              {treatment}
            </span>
          )}
        </div>

        {/* Avatar navigation */}
        <div className="mt-10 flex items-center justify-center gap-3">
          {testimonials.map((t, i) => {
            const isActive = i === active;
            return (
              <button
                key={t.id}
                type="button"
                aria-label={`Read testimonial from ${t.authorName}`}
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
                {getInitials(t.authorName)}
              </button>
            );
          })}
        </div>

        {/* Link to full testimonials */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/clinical-results"
            className="text-sm font-semibold text-[--brand-deep] transition hover:text-[--brand]"
          >
            See clinical results & cases <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
