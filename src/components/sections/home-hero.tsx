import Link from "next/link";
import { HeroSlideshow, type HeroSlide } from "./hero-slideshow";
import { getHeroSlides } from "@/lib/data";

// Fallback slides used if the database returns nothing
const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: "team",
    eyebrow: "Roomchang team",
    title: "A Large Specialist Dental Team",
    description: "A broad, credible team that signals scale, continuity, and specialist coverage.",
    imageSrc: "/hero/roomchang-team-hero.jpg",
    imageAlt: "Roomchang Dental Hospital team portrait",
    imagePosition: "bottom center",
    imageSize: "100% auto",
    preserveFullImage: true,
  },
  {
    id: "care",
    eyebrow: "Patient care",
    title: "Warm, Reassuring Treatment",
    description: "The bedside manner and consultation experience patients actually care about.",
    imageSrc: "/hero/roomchang-patient-care.jpg",
    imageAlt: "Roomchang staff smiling with a patient in a treatment room",
    imagePosition: "center center",
  },
  {
    id: "digital",
    eyebrow: "Digital dentistry",
    title: "Modern Lab And Imaging Workflow",
    description: "Advanced digital planning, in-house lab capability, and a modern clinical operation.",
    imageSrc: "/hero/roomchang-digital-lab.jpeg",
    imageAlt: "Roomchang staff working with digital dental laboratory technology",
    imagePosition: "center center",
  },
];

export async function HomeHero() {
  const dbSlides = await getHeroSlides();

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
      : FALLBACK_SLIDES;

  return (
    <section className="relative overflow-hidden sm:min-h-[calc(100svh-6.625rem)] lg:min-h-[calc(100svh-7.25rem)]">

      {/* Trust pill — in flow on mobile, absolute top-left on sm+ */}
      <div className="relative z-20 px-4 pb-3 pt-4 sm:absolute sm:left-7 sm:top-7 sm:p-0">
        <p className="inline-flex rounded-full border border-[rgba(33,23,31,0.2)] bg-white/96 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--text-main)] shadow-[0_10px_28px_rgba(29,19,27,0.08)] sm:backdrop-blur-md">
          Trusted Since 1996
        </p>
      </div>

      {/* Slideshow — natural height on mobile, fills full section on sm+ */}
      <div className="relative sm:absolute sm:inset-0">
        <HeroSlideshow
          slides={heroSlides}
          showCaption={false}
          flush
          className="sm:h-full"
          mediaClassName="aspect-[3/2] sm:rounded-none sm:h-full sm:aspect-auto"
        />

        {/* Bottom pink fade blending into page */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[color:var(--brand-soft)] via-[rgba(255,220,235,0.5)] to-transparent sm:h-48" />

        {/* Scroll chevron — desktop only */}
        <a
          href="#brands"
          aria-label="Scroll to next section"
          className="absolute bottom-1 left-1/2 z-10 hidden -translate-x-1/2 animate-bounce text-white/60 transition hover:text-white sm:block"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* CTA dock — in flow below image on mobile, absolute bottom on sm+ */}
      <div className="relative z-20 flex justify-center px-4 pb-5 pt-3 sm:absolute sm:inset-x-0 sm:bottom-10 sm:pb-0 sm:pt-0">
        <div className="flex w-full max-w-xs flex-col gap-2 sm:w-auto sm:max-w-none sm:flex-row sm:rounded-full sm:border sm:border-white/18 sm:bg-[color:rgba(20,10,18,0.16)] sm:p-1.5 sm:shadow-[0_10px_30px_rgba(20,10,18,0.14)] sm:backdrop-blur-md">
          <Link
            href="/contact"
            className="btn-primary justify-center whitespace-nowrap !px-5 !py-3 !text-xs"
          >
            Request An Appointment
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[rgba(33,23,31,0.12)] bg-[rgba(255,255,255,0.72)] px-5 py-3 text-xs font-semibold text-[color:var(--text-main)] transition hover:-translate-y-px hover:bg-[rgba(255,255,255,0.92)] sm:border-white/22 sm:bg-[color:rgba(255,255,255,0.12)] sm:text-white sm:hover:bg-[color:rgba(255,255,255,0.22)]"
          >
            Explore Services
          </Link>
        </div>
      </div>

    </section>
  );
}
