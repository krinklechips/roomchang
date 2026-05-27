import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HeroSlideshow, type HeroSlide } from "./hero-slideshow";
import { getHeroSlides } from "@/lib/data";

export async function HomeHero() {
  const t = await getTranslations("homeHero");
  const dbSlides = await getHeroSlides();

  // Fallback slides use translation keys; DB slides use their own text
  const fallbackSlides: HeroSlide[] = [
    {
      id: "team",
      eyebrow: t("slide.team.eyebrow"),
      title: t("slide.team.title"),
      description: t("slide.team.description"),
      imageSrc: "/hero/hero-team-photo.jpg",
      imageAlt: t("slide.team.alt"),
      imagePosition: "center center",
      imageSize: "cover",
    },
    {
      id: "care",
      eyebrow: t("slide.care.eyebrow"),
      title: t("slide.care.title"),
      description: t("slide.care.description"),
      imageSrc: "/hero/hero-patient-care.jpeg",
      imageAlt: t("slide.care.alt"),
      imagePosition: "center center",
    },
    {
      id: "all-staff",
      eyebrow: t("slide.allStaff.eyebrow"),
      title: t("slide.allStaff.title"),
      description: t("slide.allStaff.description"),
      imageSrc: "/hero/hero-all-staff.jpg",
      imageAlt: t("slide.allStaff.alt"),
      imagePosition: "center top",
      imageSize: "cover",
    },
    {
      id: "digital",
      eyebrow: t("slide.digital.eyebrow"),
      title: t("slide.digital.title"),
      description: t("slide.digital.description"),
      imageSrc: "/hero/roomchang-digital-lab.jpeg",
      imageAlt: t("slide.digital.alt"),
      imagePosition: "center center",
    },
  ];

  const heroSlides: HeroSlide[] =
    dbSlides.length > 0
      ? dbSlides.map((s) => ({
          id: s.id,
          eyebrow: s.eyebrow ?? "",
          title: s.title ?? "",
          description: s.description ?? "",
          imageSrc: s.imageSrc,
          imageAlt: s.imageAlt ?? "",
          imagePosition: s.imagePosition ?? "center center",
          imageSize: s.imageSize ?? undefined,
          preserveFullImage: s.preserveFullImage,
        }))
      : fallbackSlides;

  return (
    <section className="relative overflow-hidden sm:min-h-[calc(100svh-6.625rem)] lg:min-h-[calc(100svh-7.25rem)]">

      {/* Trust pill — always overlaid on the image */}
      <div className="absolute left-3 top-3 z-20 sm:left-7 sm:top-7">
        <p className="inline-flex rounded-full border border-[rgba(33,23,31,0.2)] bg-white/96 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--text-main)] shadow-[0_10px_28px_rgba(29,19,27,0.08)] backdrop-blur-sm sm:px-3.5 sm:py-1.5 sm:text-[0.7rem]">
          {t("trustPill")}
        </p>
      </div>

      {/* Slideshow — natural height on mobile, fills full section on sm+ */}
      <div className="relative sm:absolute sm:inset-0">
        <HeroSlideshow
          slides={heroSlides}
          showCaption={false}
          flush
          className="sm:h-full"
          mediaClassName="aspect-[16/9] sm:rounded-none sm:h-full sm:aspect-auto"
        />

        {/* Bottom pink fade blending into page */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[color:var(--brand-soft)] via-[rgba(255,220,235,0.5)] to-transparent sm:h-48" />

        {/* Scroll chevron — desktop only */}
        <a
          href="#brands"
          aria-label={t("scrollAriaLabel")}
          className="absolute bottom-1 left-1/2 z-10 hidden -translate-x-1/2 animate-bounce text-white/60 transition hover:text-white sm:block"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* CTA dock — in flow below image on mobile, absolute bottom on sm+ */}
      <div className="relative z-20 flex justify-center px-4 pb-3 pt-2 sm:absolute sm:inset-x-0 sm:bottom-10 sm:pb-0 sm:pt-0">
        <div className="flex w-full max-w-xs flex-col gap-1.5 sm:w-auto sm:max-w-none sm:flex-row sm:gap-2 sm:rounded-full sm:border sm:border-white/18 sm:bg-[color:rgba(20,10,18,0.16)] sm:p-1.5 sm:shadow-[0_10px_30px_rgba(20,10,18,0.14)] sm:backdrop-blur-md">
          <Link
            href="/contact"
            className="btn-primary justify-center whitespace-nowrap !px-4 !py-2.5 !text-[0.7rem] sm:!px-5 sm:!py-3 sm:!text-xs"
          >
            {t("ctaPrimary")}
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[rgba(33,23,31,0.12)] bg-[rgba(255,255,255,0.72)] px-4 py-2.5 text-[0.7rem] font-semibold text-[color:var(--text-main)] transition hover:-translate-y-px hover:bg-[rgba(255,255,255,0.92)] sm:border-white/22 sm:bg-[color:rgba(255,255,255,0.12)] sm:px-5 sm:py-3 sm:text-xs sm:text-white sm:hover:bg-[color:rgba(255,255,255,0.22)]"
          >
            {t("ctaSecondary")}
          </Link>
          <Link
            href="/team"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[rgba(33,23,31,0.12)] bg-[rgba(255,255,255,0.72)] px-4 py-2.5 text-[0.7rem] font-semibold text-[color:var(--text-main)] transition hover:-translate-y-px hover:bg-[rgba(255,255,255,0.92)] sm:border-white/22 sm:bg-[color:rgba(255,255,255,0.12)] sm:px-5 sm:py-3 sm:text-xs sm:text-white sm:hover:bg-[color:rgba(255,255,255,0.22)]"
          >
            {t("ctaTertiary")}
          </Link>
        </div>
      </div>

    </section>
  );
}
