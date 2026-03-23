"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 30, suffix: " yrs", label: "Established Experience" },
  { value: 30, suffix: "+", label: "Specialist Dentists" },
  { value: 5, suffix: "", label: "Phnom Penh Branches" },
  { value: 20, suffix: "+", label: "Countries Served" },
  { value: 100000, suffix: "+", label: "Patients Served Worldwide" },
];

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function CountUp({ target, suffix, started }: { target: number; suffix: string; started: boolean }) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!started) return;
    const duration = target > 1000 ? 2200 : 1600;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.round(easeOut(progress) * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [started, target]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function HomeStats() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="border-y border-[--border-strong] bg-[--surface]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px bg-[--border-strong] sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center justify-center gap-1 bg-[--surface] px-4 py-8 text-center sm:px-6 ${
                index === STATS.length - 1 ? "col-span-2 sm:col-span-1" : ""
              }`}
            >
              <p className="font-display text-[2.6rem] leading-none text-[--brand-deep] lg:text-[3rem]">
                <CountUp target={stat.value} suffix={stat.suffix} started={started} />
              </p>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[--text-soft]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
