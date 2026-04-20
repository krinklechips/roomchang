"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const ERAS = [
  {
    year: "1996",
    caption: "The beginning",
    heading: "A Single Belief",
    body: "A single practice. A single belief — that Cambodians deserved world-class dental care at home. Dr. Tith Hong Yoeu opens Roomchang as Cambodia's first specialist dental clinic built to international standards.",
    src: "/about/history-clinic-1996.jpg",
    alt: "Roomchang — the original clinic, 1996",
    objectPos: "object-center",
  },
  {
    year: "2002",
    caption: "Roots deepen",
    heading: "Reaching Further",
    body: "A second location. New equipment. The same uncompromising standard — now reaching more of Phnom Penh. The foundations of a multi-branch group are quietly being laid.",
    src: "/about/history-clinic-2002.jpg",
    alt: "Roomchang — expansion, 2002",
    objectPos: "object-center",
  },
  {
    year: "2010s",
    caption: "Recognition",
    heading: "Certified Excellence",
    body: "Roomchang became the benchmark for dental quality in Cambodia — investing in international training, hospital-grade infrastructure, and a culture of clinical excellence that continues today.",
    src: "/about/certification-iso.jpg",
    alt: "Roomchang clinical excellence",
    objectPos: "object-top",
  },
  {
    year: "Now",
    caption: "A hospital",
    heading: "Still Growing",
    body: "Five branches. Fifty-eight chairs. Thirty specialists. Thousands of patients every month. And the same conviction that started it all — quality care, close to home.",
    src: "/team/team-implantologists-group.jpg",
    alt: "Roomchang specialist team — present day",
    objectPos: "object-left",
  },
];

export function AboutTimeline() {
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set());
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs: IntersectionObserver[] = [];

    function makeCallback(i: number): IntersectionObserverCallback {
      return ([entry]) => {
        if (entry.isIntersecting) setVisibleSet((prev) => new Set([...prev, i]));
      };
    }

    refs.current.forEach((el, i) => {
      if (!el) return;
      const o = new IntersectionObserver(makeCallback(i), { threshold: 0.08 });
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="relative overflow-hidden border-y border-[color:var(--border-strong)]">
      {/* Vertical spine — desktop only */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-[color:var(--border-strong)] lg:block"
        aria-hidden="true"
      />

      {ERAS.map((item, i) => {
        const isVisible = visibleSet.has(i);
        /* Even index → image left, text right. Odd → text left, image right. */
        const imgLeft = i % 2 === 0;

        return (
          <div
            key={item.year}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="relative flex flex-col border-b border-[color:var(--border-strong)] last:border-b-0 lg:flex-row lg:min-h-[42rem]"
          >
            {/* ── Spine dot + year label (desktop) ── */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 lg:flex">
              <div className="h-3.5 w-3.5 rounded-full bg-[color:var(--brand)] shadow-[0_0_0_5px_white,0_0_0_6px_var(--brand-light)]" />
            </div>

            {/* ── IMAGE HALF ── */}
            <div
              className={`relative h-72 w-full overflow-hidden lg:h-auto lg:w-1/2 ${
                !imgLeft ? "lg:order-2" : "lg:order-1"
              }`}
            >
              {/* Scroll-reveal */}
              <div
                className={`h-full w-full transition-all duration-1000 ease-out ${
                  isVisible
                    ? "opacity-100 scale-100"
                    : imgLeft
                    ? "opacity-0 -translate-x-6 scale-[1.02]"
                    : "opacity-0 translate-x-6 scale-[1.02]"
                }`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={`object-cover ${item.objectPos}`}
                  priority={i === 0}
                />
                {/* Subtle darkening vignette */}
                <div
                  className={`absolute inset-0 ${
                    imgLeft
                      ? "bg-gradient-to-r from-black/5 via-transparent to-black/20"
                      : "bg-gradient-to-l from-black/5 via-transparent to-black/20"
                  }`}
                />
                {/* Ghost year in image corner */}
                <p
                  className={`absolute select-none font-display leading-none text-white/[0.08] ${
                    imgLeft
                      ? "bottom-6 left-6 text-[7rem] lg:text-[10rem]"
                      : "bottom-6 right-6 text-right text-[7rem] lg:text-[10rem]"
                  }`}
                  aria-hidden="true"
                >
                  {item.year}
                </p>
              </div>
            </div>

            {/* ── TEXT HALF ── */}
            <div
              className={`flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-16 lg:py-20 xl:px-24 ${
                !imgLeft ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <div
                className={`transition-all duration-700 delay-300 ease-out ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                {/* Year — mobile only (desktop has spine) */}
                <p className="mb-1 font-display text-[2.8rem] leading-none text-[color:var(--brand-soft)] lg:hidden">
                  {item.year}
                </p>

                {/* Caption pill */}
                <p className="text-[0.6rem] font-bold uppercase tracking-[0.35em] text-[color:var(--brand)]">
                  {item.caption}
                </p>

                {/* Heading */}
                <h3 className="mt-3 font-display text-4xl leading-tight text-[--text-main] lg:text-5xl xl:text-6xl">
                  {item.heading}
                </h3>

                {/* Year — desktop (sits under heading, editorial) */}
                <p className="mt-2 hidden font-display text-[5rem] leading-none text-[color:var(--brand-soft)] select-none lg:block xl:text-[6rem]">
                  {item.year}
                </p>

                {/* Body */}
                <p className="mt-5 max-w-md text-sm leading-8 text-[--text-soft] italic">
                  {item.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
