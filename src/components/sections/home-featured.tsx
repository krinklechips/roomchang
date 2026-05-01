import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { supabaseServer } from "@/lib/supabase-server";

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

type HomepageFeatureCardRow = {
  slug: string;
  title: string;
  description: string;
  image_src: string;
  image_alt: string;
  href: string;
  cta: string;
};

export async function HomeFeatured() {
  const { data, error } = await supabaseServer
    .from("homepage_feature_cards")
    .select("slug, title, description, image_src, image_alt, href, cta")
    .order("sort_order");

  if (error) {
    console.error("[HomeFeatured] homepage_feature_cards fetch failed:", error.message);
  }

  const cards = data?.length
    ? (data as HomepageFeatureCardRow[]).map((card) => ({
        id: card.slug,
        title: card.title,
        description: card.description,
        imageSrc: card.image_src,
        imageAlt: card.image_alt,
        href: card.href,
        cta: card.cta,
      }))
    : CARDS;

  return (
    <section className="border-t border-[--border-strong] bg-[color:var(--surface)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-[--border-strong] bg-white shadow-[0_16px_50px_rgba(57,28,45,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(57,28,45,0.12)]"
            >
              {/* aspect-[19/8] matches the native 2.375:1 aspect of all three
                  source photos, so object-cover yields no letterboxing and no
                  meaningful crop. */}
              <div className="relative aspect-[19/8] overflow-hidden bg-white">
                <Image
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  priority={card.id === "international"}
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h3 className="font-display text-[1.8rem] leading-tight text-[--text-main]">
                  {card.title}
                </h3>
                <p className="text-sm leading-7 text-[--text-soft]">{card.description}</p>
                <Link
                  href={card.href}
                  className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-[--brand-deep] transition group-hover:text-[--brand]"
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
