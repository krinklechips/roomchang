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
    mobileImagePosition: "center 34%",
    mobileImageSize: "auto 76%",
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

export function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative">
        <HeroSlideshow
          slides={heroSlides}
          showCaption={false}
          flush
          className="rounded-none border-0 shadow-none"
          mediaClassName="min-h-0 rounded-none aspect-square sm:min-h-0 sm:aspect-[16/10] lg:min-h-0 lg:aspect-[2325/950]"
        />

        {/* Bottom: brand-pink fade to blend team photo into page */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[color:var(--brand-soft)] via-[rgba(255,220,235,0.5)] to-transparent" />

        {/* Trust pill */}
        <div className="absolute left-4 top-4 z-10 sm:left-7 sm:top-7">
          <p className="inline-flex rounded-full border border-white/45 bg-[color:rgba(255,255,255,0.26)] px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_10px_28px_rgba(29,19,27,0.14)] backdrop-blur-md">
            Since 1996 • Phnom Penh
          </p>
        </div>

        {/* CTA dock */}
        <div
          data-testid="hero-cta-dock"
          className="absolute inset-x-0 bottom-8 z-10 flex justify-center px-4 sm:bottom-10"
        >
          <div className="flex w-full max-w-xs flex-col gap-1.5 rounded-[1.5rem] border border-white/18 bg-[color:rgba(20,10,18,0.16)] p-1.5 shadow-[0_10px_30px_rgba(20,10,18,0.14)] backdrop-blur-md sm:max-w-none sm:w-auto sm:flex-row sm:rounded-full">
            <Link href="/contact" className="btn-primary justify-center text-center whitespace-nowrap !py-2.5 !px-5 !text-xs">
              Request An Appointment
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-white/22 bg-[color:rgba(255,255,255,0.12)] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[color:rgba(255,255,255,0.22)] hover:-translate-y-px"
            >
              Explore Services
            </Link>
          </div>
        </div>

        {/* Scroll-down indicator */}
        <a
          href="#brands"
          aria-label="Scroll to next section"
          className="absolute bottom-1 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/60 transition hover:text-white"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
