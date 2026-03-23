import Link from "next/link";
import { HeroSlideshow, type HeroSlide } from "./hero-slideshow";

const heroSlides: HeroSlide[] = [
  {
    id: "team",
    eyebrow: "Roomchang team",
    title: "A Large Specialist Dental Team",
    description: "A broad, credible team that signals scale, continuity, and specialist coverage.",
    imageSrc: "/hero/roomchang-team-hero.jpg",
    imageAlt: "Roomchang Dental Hospital team portrait",
    imagePosition: "center center",
    imageSize: "100% auto",
    mobileImagePosition: "center top",
    mobileImageSize: "100% auto",
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
    mobileImagePosition: "center top",
    mobileImageSize: "contain",
  },
  {
    id: "digital",
    eyebrow: "Digital dentistry",
    title: "Modern Lab And Imaging Workflow",
    description: "Advanced digital planning, in-house lab capability, and a modern clinical operation.",
    imageSrc: "/hero/roomchang-digital-lab.jpeg",
    imageAlt: "Roomchang staff working with digital dental laboratory technology",
    imagePosition: "center center",
    mobileImagePosition: "center top",
    mobileImageSize: "contain",
  },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative z-10 mb-3 px-4 pt-4 sm:absolute sm:left-7 sm:top-7 sm:mb-0 sm:px-0 sm:pt-0" data-testid="hero-trust-pill">
        <p className="inline-flex rounded-full border border-[rgba(33,23,31,0.2)] bg-white/96 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[--text] shadow-[0_10px_28px_rgba(29,19,27,0.08)] sm:border-white/45 sm:bg-[color:rgba(255,255,255,0.26)] sm:text-white sm:shadow-[0_10px_28px_rgba(29,19,27,0.14)] sm:backdrop-blur-md">
          Trusted Since 1996
        </p>
      </div>

      <div
        data-testid="hero-mobile-shell"
        className="relative mx-4 overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(255,249,251,0.98)_0%,rgba(255,239,246,0.92)_62%,rgba(255,247,250,1)_100%)] shadow-[0_20px_48px_rgba(33,23,31,0.08)] sm:mx-0 sm:overflow-visible sm:rounded-none sm:bg-transparent sm:shadow-none"
      >
        <div className="relative">
          <HeroSlideshow
            slides={heroSlides}
            showCaption={false}
            flush
            className="rounded-none border-0 shadow-none"
            mediaClassName="min-h-0 rounded-t-[1.75rem] aspect-[2325/950] sm:min-h-0 sm:rounded-none sm:aspect-[16/10] lg:min-h-0 lg:aspect-[2325/950]"
          />

          {/* Bottom: brand-pink fade to blend team photo into page */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[rgba(255,231,241,0.92)] via-[rgba(255,231,241,0.5)] to-transparent sm:h-48 sm:from-[color:var(--brand-soft)] sm:via-[rgba(255,220,235,0.5)]" />

          {/* Scroll-down indicator */}
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

        {/* CTA dock */}
        <div
          data-testid="hero-cta-dock"
          className="relative z-10 mt-0 flex justify-center px-4 pb-4 pt-3 sm:absolute sm:inset-x-0 sm:bottom-10 sm:mt-0 sm:px-4 sm:pb-0 sm:pt-0"
        >
          <div
            data-testid="hero-cta-surface"
            className="flex w-full max-w-xs flex-col gap-2 rounded-[1.4rem] border-t border-white/60 bg-transparent p-0 shadow-none sm:max-w-none sm:w-auto sm:flex-row sm:rounded-full sm:border sm:border-white/18 sm:bg-[color:rgba(20,10,18,0.16)] sm:p-1.5 sm:shadow-[0_10px_30px_rgba(20,10,18,0.14)] sm:backdrop-blur-md"
          >
            <Link href="/contact" className="btn-primary justify-center text-center whitespace-nowrap !py-3 !px-5 !text-xs">
              Request An Appointment
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-[rgba(33,23,31,0.12)] bg-[rgba(255,255,255,0.72)] px-5 py-3 text-xs font-semibold text-[--text] transition hover:-translate-y-px hover:bg-[rgba(255,255,255,0.92)] sm:border-white/22 sm:bg-[color:rgba(255,255,255,0.12)] sm:text-white sm:hover:bg-[color:rgba(255,255,255,0.22)]"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
