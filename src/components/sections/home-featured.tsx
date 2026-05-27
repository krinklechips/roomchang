import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { supabaseServer } from "@/lib/supabase-server";

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
  const t = await getTranslations("homeHighlights.card");

  // Fallback cards use translation keys; DB cards use their own text
  const FALLBACK_CARDS = [
    {
      id: "international",
      title: t("international.title"),
      description: t("international.description"),
      imageSrc: "/hero/roomchang-patient-care.jpg",
      imageAlt: t("international.alt"),
      href: "/international",
      cta: t("international.cta"),
    },
    {
      id: "team",
      title: t("team.title"),
      description: t("team.description"),
      imageSrc: "/hero/roomchang-team.jpg",
      imageAlt: t("team.alt"),
      href: "/team",
      cta: t("team.cta"),
    },
    {
      id: "aligner",
      title: t("aligner.title"),
      description: t("aligner.description"),
      imageSrc: "/hero/roomchang-clear-aligner.jpg",
      imageAlt: t("aligner.alt"),
      href: "/technology/ca-clear-aligner",
      cta: t("aligner.cta"),
    },
  ];

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
    : FALLBACK_CARDS;

  return (
    <section className="border-t border-[color:var(--border-strong)] bg-[color:var(--surface)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_16px_50px_rgba(57,28,45,0.07)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(57,28,45,0.12)]"
            >
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
              <div className="flex flex-1 flex-col gap-2 p-5 sm:gap-3 sm:p-6">
                <h3 className="font-display text-xl leading-tight text-[color:var(--text-main)] sm:text-[1.8rem]">
                  {card.title}
                </h3>
                <p className="text-sm leading-7 text-[color:var(--text-soft)]">{card.description}</p>
                <Link
                  href={card.href}
                  className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-[color:var(--brand-deep)] transition group-hover:text-[color:var(--brand)]"
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
