import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CARDS = [
  {
    id: "international",
    title: "International Patients",
    description:
      "Thousands of patients from Australia, Japan, Singapore, and beyond visit Roomchang each year. We make the journey simple.",
    imageSrc: "/hero/roomchang-patient-care.jpg",
    imageAlt: "Roomchang patient care team",
    href: "/international",
    cta: "Plan your trip",
  },
  {
    id: "team",
    title: "Meet Our Team",
    description:
      "30+ specialist dentists across every discipline — multilingual, experienced, and committed to your comfort.",
    imageSrc: "/hero/roomchang-team.jpg",
    imageAlt: "Roomchang dental hospital team",
    href: "/team",
    cta: "Meet the doctors",
  },
  {
    id: "aligner",
    title: "CA® Clear Aligner",
    description:
      "Our proprietary aligner — designed, fabricated, and fitted in-house for a precise, discreet result.",
    imageSrc: "/hero/roomchang-clear-aligner.jpg",
    imageAlt: "Roomchang clear aligner treatment",
    href: "/technology/ca-clear-aligner",
    cta: "Learn more",
  },
];

export function HomeFeatured() {
  return (
    <section className="border-t border-[--border-strong] bg-[--surface]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {CARDS.map((card) => (
            <article
              key={card.id}
              className="group overflow-hidden rounded-3xl border border-[--border-strong] bg-white shadow-[0_16px_50px_rgba(57,28,45,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(57,28,45,0.12)]"
            >
              <div
                role="img"
                aria-label={card.imageAlt}
                className="h-52 bg-[--surface-strong] bg-cover bg-center"
                style={{ backgroundImage: `url(${card.imageSrc})` }}
              />
              <div className="space-y-3 p-6">
                <h3 className="font-display text-[1.8rem] leading-tight text-[--text-main]">
                  {card.title}
                </h3>
                <p className="text-sm leading-7 text-[--text-soft]">{card.description}</p>
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[--brand-deep] transition group-hover:text-[--brand]"
                >
                  {card.cta} <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
