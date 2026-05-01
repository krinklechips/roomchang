"use client";

import { useEffect, useRef, useState } from "react";

export type StatItem = { numeric_value: number; suffix: string; label: string };

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

export function HomeStats({ stats }: { stats: StatItem[] }) {
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
    <div ref={ref} className="border-y border-[--border-strong] bg-[color:var(--surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px bg-[color:var(--border-strong)] sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center gap-1 bg-[color:var(--surface)] px-4 py-8 text-center sm:px-6"
            >
              <p className="font-display text-[2.6rem] leading-none text-[--brand-deep] lg:text-[3rem]">
                <CountUp target={stat.numeric_value} suffix={stat.suffix} started={started} />
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
