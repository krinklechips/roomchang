import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
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

const VIDEO_TESTIMONIALS = [
  {
    id: "ryxcCSeH4ZE",
    title: "Mr. Robert Backert — USA",
    description: "From the USA to Roomchang: Mr. Robert Backert's smile says it all after his successful dental implant procedure.",
    treatment: "Dental Implants",
  },
  {
    id: "RdWGGl0U_p4",
    title: "Mr. Kevin — Australia",
    description: "Mr. Kevin from Australia had a positive experience at Roomchang Dental Hospital — excellent dental treatment plus an enjoyable vacation in Cambodia.",
    treatment: "Dental Treatment",
  },
  {
    id: "7ydJxsMTw4k",
    title: "Mr. William Morris — Sydney, Australia",
    description: "Mr. William Morris traveled from Sydney, Australia to get his dental work done at Roomchang and enjoyed his vacation in Cambodia.",
    treatment: "Dental Tourism",
  },
  {
    id: "bzfVyEb0Qak",
    title: "Ms. Pauline Scott — New Zealand",
    description: "Ms. Pauline Scott travels from New Zealand to Cambodia to have her dental treatments done at Roomchang.",
    treatment: "Dental Treatment",
  },
  {
    id: "jEnBISKgthw",
    title: "Mr. Andrew Smith — Full Mouth Rehabilitation",
    description: "Mr. Andrew Smith shares his full mouth rehabilitation experience with Roomchang's Implantology department.",
    treatment: "Full Mouth Rehabilitation",
  },
  {
    id: "GPI31xSd2TU",
    title: "Ms. Jayadevi — Lingual Braces",
    description: "Ms. Jayadevi chose lingual braces (back-of-teeth) to correct her crooked teeth at Roomchang.",
    treatment: "Orthodontics",
  },
  {
    id: "c33gA9XwUgA",
    title: "Ms. Jenifer Padget — Lingual Braces",
    description: "Ms. Jenifer Padget shares her first experience with Lingual Braces from Roomchang.",
    treatment: "Orthodontics",
  },
  {
    id: "TXsRqtNesVs",
    title: "Mr. Pen Saravuth — Lingual Braces",
    description: "Mr. Pen Saravuth shares his experience with Lingual Braces from orthodontist Dr. Nicolas Salesse.",
    treatment: "Orthodontics",
  },
  {
    id: "VaveFPmQSVA",
    title: "Charley & Clem — Australia",
    description: "Charley and Clem from Australia explain why they chose to have dental implants at Roomchang.",
    treatment: "Dental Implants",
  },
  {
    id: "917hvs8COHI",
    title: "Mr. Russell — Australia",
    description: "Russell explains why he traveled from Australia to Cambodia for dental work at Roomchang.",
    treatment: "Dental Treatment",
  },
  {
    id: "UVptrgYbvfk",
    title: "Ms. Judy Hanson — Canada",
    description: "Judy Hanson from Canada talks about her experience at Roomchang.",
    treatment: "Dental Treatment",
  },
  {
    id: "3sWMhXCD5GA",
    title: "Ms. Wong Siew Wei",
    description: "Ms. Wong Siew Wei explains why she chose dental work at Roomchang — her family have been long-time customers for international quality at local prices.",
    treatment: "Dental Treatment",
  },
  {
    id: "TT1bcfDV4k8",
    title: "Ms. Kong Navy — Cambodia",
    description: "Ms. Kong Navy talks about her successful treatment at Roomchang Dental Hospital.",
    treatment: "Dental Treatment",
  },
  {
    id: "4u1t_jnGM9k",
    title: "Ms. Sharon Wilkinson — Britain",
    description: "Sharon Wilkinson from Britain talks about her successful treatment with Dr. Tith Hong Yoeu at Roomchang.",
    treatment: "Dental Treatment",
  },
  {
    id: "H6oW3rgIkXg",
    title: "Ms. Chhan Kimbuoy — Cambodia",
    description: "Roomchang happy brace patient Ms. Chhan Kimbuoy shares her orthodontic journey.",
    treatment: "Orthodontics",
  },
];

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
        {testimonials.length > 0 && (
          <section>
            <h2 className="font-display text-4xl text-[color:var(--text-main)]">What Patients Say</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--text-soft)]">
              Verified reviews from patients who have visited Roomchang.
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {testimonials.map((t) => {
                const { origin, treatment } = parseOriginAndTreatment(t.authorTitle);
                const initials = getInitials(t.authorName);
                return (
                  <div
                    key={t.id}
                    className="flex flex-col gap-4 rounded-3xl border border-[color:var(--brand-soft)] bg-white p-8 shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
                  >
                    <StarRating rating={t.rating} />
                    <blockquote className="flex-1 text-sm leading-7 text-[color:var(--text-main)]">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
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
        )}

        {/* Video testimonials */}
        <section>
          <h2 className="font-display text-4xl text-[color:var(--text-main)]">Video Testimonials</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--text-soft)]">
            Watch real patients share their experience at Roomchang Dental Hospital.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {VIDEO_TESTIMONIALS.map((video) => (
              <div
                key={video.id}
                className="overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_12px_40px_rgba(57,28,45,0.06)]"
              >
                {/* Video embed */}
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                    title={video.title}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Card content */}
                <div className="flex items-start justify-between gap-4 px-6 py-5">
                  <div className="min-w-0">
                    <p className="font-display text-lg leading-snug text-[color:var(--text-main)]">
                      {video.title}
                    </p>
                    <p className="mt-1.5 text-sm leading-6 text-[color:var(--text-soft)]">
                      {video.description}
                    </p>
                  </div>
                  <span className="mt-0.5 shrink-0 rounded-full bg-[color:var(--brand-soft)] px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-deep)]">
                    {video.treatment}
                  </span>
                </div>
              </div>
            ))}
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
