import Link from "next/link";
import { ArrowLeft, Star, ExternalLink } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { getTestimonials } from "@/lib/data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patient Testimonials | Roomchang Dental Hospital",
  description:
    "Real patient stories from around the world — hear what our patients say about their experience at Roomchang Dental Hospital in Phnom Penh, Cambodia.",
};

function parseOriginAndTreatment(authorTitle: string | null): { origin: string; treatment: string } {
  if (!authorTitle) return { origin: "", treatment: "" };
  const parts = authorTitle.split("—").map((s) => s.trim());
  return { origin: parts[0] ?? "", treatment: parts[1] ?? "" };
}

function getInitials(name: string): string {
  return name.split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          strokeWidth={0}
          className={i < rating ? "fill-[color:var(--brand)]" : "fill-[color:var(--border-strong)]"}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> About
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            Patient Testimonials
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            Thousands of patients travel to Roomchang each year from Australia, Japan, Singapore,
            the USA, and beyond. Here&apos;s what they say about their experience.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 space-y-20">

        {/* Written testimonials grid */}
        <section>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {testimonials.map((t) => {
              const { origin, treatment } = parseOriginAndTreatment(t.authorTitle);
              const initials = getInitials(t.authorName);
              return (
                <div
                  key={t.id}
                  className="flex flex-col gap-4 rounded-3xl border border-[color:var(--brand-soft)] bg-white p-8 shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
                >
                  {/* Stars */}
                  <StarRating rating={t.rating} />

                  {/* Quote */}
                  <blockquote className="flex-1 text-sm leading-7 text-[color:var(--text-main)]">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3 border-t border-[color:var(--brand-soft)] pt-4">
                    {t.authorPhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.authorPhotoUrl}
                        alt={t.authorName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-sm font-semibold text-[color:var(--brand-deep)]">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[color:var(--text-main)]">{t.authorName}</p>
                      {origin && <p className="text-xs text-[color:var(--text-soft)]">{origin}</p>}
                      {treatment && (
                        <span className="mt-0.5 inline-block rounded-full bg-[color:var(--brand-soft)] px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-deep)]">
                          {treatment}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* YouTube video section */}
        <section>
          <h2 className="font-display text-4xl text-[color:var(--text-main)]">Video Testimonials</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--text-soft)]">
            Watch real patients share their experience at Roomchang Dental Hospital on our YouTube channel.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              href="https://www.youtube.com/@roomchang"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#FF0000] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#cc0000]"
            >
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
                <path d="M19.582 2.186A2.506 2.506 0 0 0 17.82.422C16.254 0 10 0 10 0S3.746 0 2.18.422A2.506 2.506 0 0 0 .418 2.186C0 3.754 0 7 0 7s0 3.246.418 4.814A2.506 2.506 0 0 0 2.18 13.578C3.746 14 10 14 10 14s6.254 0 7.82-.422a2.506 2.506 0 0 0 1.762-1.764C20 10.246 20 7 20 7s0-3.246-.418-4.814Z" fill="currentColor"/>
                <path d="M8 10l5.196-3L8 4v6Z" fill="white"/>
              </svg>
              Watch on YouTube
              <ExternalLink size={13} strokeWidth={2} />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-[color:var(--brand)] p-10 text-white sm:p-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-4xl">Ready to start your journey?</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-white/80">
                Join thousands of patients who have trusted Roomchang for world-class dental care.
                Get a free consultation and personalised treatment plan.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-full border border-white/30 bg-white px-7 py-4 text-sm font-bold text-[color:var(--brand)] transition hover:bg-white/90"
            >
              Book a Free Consultation
            </Link>
          </div>
        </section>

      </div>
    </SiteShell>
  );
}
