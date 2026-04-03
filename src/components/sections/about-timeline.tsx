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
  },
  {
    year: "2002",
    caption: "Roots deepen",
    heading: "Reaching Further",
    body: "A second location. New equipment. The same uncompromising standard — now reaching more of Phnom Penh. The foundations of a multi-branch group are quietly being laid.",
    src: "/about/history-clinic-2002.jpg",
    alt: "Roomchang — expansion, 2002",
  },
  {
    year: "2010s",
    caption: "Recognition",
    heading: "Certified Excellence",
    body: "ISO 9001 certified — the first dental facility in Cambodia to earn it. Independently audited, internationally recognised. A standard that held us accountable long before it was expected.",
    src: "/about/certification-iso.jpg",
    alt: "Roomchang ISO 9001 certification",
  },
  {
    year: "Now",
    caption: "A hospital",
    heading: "Still Growing",
    body: "Five branches. Fifty-eight chairs. Thirty specialists. Ten thousand patients a month. And the same conviction that started it all — quality care, close to home.",
    src: "/team/team-implantologists-group.jpg",
    alt: "Roomchang specialist team — present day",
  },
] as const;

export function AboutTimeline() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setVisibleSet((prev) => new Set([...prev, i]));
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="mt-20">
      {ERAS.map((item, i) => {
        const isVisible = visibleSet.has(i);
        const isActive = activeIndex === i;
        const isOtherActive = activeIndex !== null && !isActive;
        const flipLayout = i % 2 === 1; // alternate sides on desktop

        return (
          <div
            key={item.year}
            ref={(el) => { itemRefs.current[i] = el; }}
            className={`relative mb-6 last:mb-0 transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            } ${isOtherActive ? "opacity-40 scale-[0.99]" : ""}`}
          >
            <button
              onClick={() => setActiveIndex(isActive ? null : i)}
              className={`group w-full text-left overflow-hidden rounded-3xl border transition-all duration-500 focus:outline-none ${
                isActive
                  ? "border-[color:var(--brand-light)] shadow-[0_32px_80px_rgba(204,55,113,0.18)]"
                  : "border-[color:var(--border-strong)] shadow-[0_12px_40px_rgba(57,28,45,0.06)] hover:border-[color:var(--brand-light)] hover:shadow-[0_20px_56px_rgba(204,55,113,0.12)]"
              }`}
            >
              <div className={`flex flex-col lg:flex-row ${flipLayout ? "lg:flex-row-reverse" : ""}`}>

                {/* ── Large image panel ── */}
                <div
                  className={`relative overflow-hidden transition-all duration-700 ease-in-out lg:w-[58%] shrink-0 ${
                    isActive ? "h-[28rem] lg:h-auto" : "h-64 lg:h-auto"
                  }`}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className={`object-cover transition-all duration-700 ease-in-out ${
                      isActive
                        ? "grayscale-0 scale-100"
                        : "grayscale-[25%] scale-100 group-hover:grayscale-0 group-hover:scale-[1.03]"
                    }`}
                  />
                  {/* Gradient over image */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      flipLayout
                        ? "bg-gradient-to-l from-white/0 via-white/0 to-white/5"
                        : "bg-gradient-to-r from-white/0 via-white/0 to-white/5"
                    } ${isActive ? "opacity-0" : "opacity-100"}`}
                  />
                </div>

                {/* ── Text panel ── */}
                <div className="flex flex-1 flex-col justify-center px-8 py-10 lg:px-12 lg:py-14 min-h-[16rem]">
                  {/* Year — large display */}
                  <p
                    className={`font-display leading-none select-none mb-4 transition-all duration-500 ${
                      isActive
                        ? "text-[4.5rem] text-[color:var(--brand)]"
                        : "text-[3.5rem] text-[color:var(--brand-soft)]"
                    }`}
                  >
                    {item.year}
                  </p>

                  {/* Caption pill */}
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.3em] text-[color:var(--brand)] mb-3">
                    {item.caption}
                  </p>

                  {/* Heading */}
                  <h3
                    className={`font-display leading-tight transition-all duration-300 ${
                      isActive
                        ? "text-3xl text-[color:var(--brand-deep)]"
                        : "text-2xl text-[--text-main] group-hover:text-[color:var(--brand-deep)]"
                    }`}
                  >
                    {item.heading}
                  </h3>

                  {/* Expandable body */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isActive ? "max-h-48 opacity-100 mt-4" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-sm leading-8 text-[--text-soft] italic">{item.body}</p>
                  </div>

                  {/* Tap hint */}
                  <p
                    className={`mt-6 text-[0.65rem] uppercase tracking-[0.22em] transition-all duration-300 ${
                      isActive
                        ? "text-[color:var(--brand)] opacity-60"
                        : "text-[--text-soft] opacity-40 group-hover:opacity-70"
                    }`}
                  >
                    {isActive ? "tap to close" : "tap to explore →"}
                  </p>
                </div>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
