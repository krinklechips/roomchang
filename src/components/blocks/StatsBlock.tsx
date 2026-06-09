"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  value: string;
  label: string;
  description?: string;
}

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return count;
}

function StatCard({ item, active }: { item: StatItem; active: boolean }) {
  // Extract numeric prefix for count-up animation, keep suffix
  const match = item.value.match(/^(\d+)(.*)$/);
  const numericPart = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : "";
  const count = useCountUp(numericPart ?? 0, active && numericPart !== null);
  const displayValue = numericPart !== null ? `${count}${suffix}` : item.value;

  return (
    <div className="flex flex-col items-center text-center">
      <p className="font-display text-5xl font-bold text-[color:var(--brand)] lg:text-6xl">
        {displayValue}
      </p>
      <p className="mt-2 text-sm font-semibold text-[color:var(--text-main)]">{item.label}</p>
      {item.description && (
        <p className="mt-1 max-w-[160px] text-xs text-[color:var(--text-soft)]">{item.description}</p>
      )}
    </div>
  );
}

export function StatsBlock({
  title,
  items,
}: {
  title?: string;
  items?: StatItem[];
}) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const stats = items?.filter((it) => it.value && it.label) ?? [];
  if (stats.length === 0) return null;

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true) },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="bg-[color:var(--brand-soft)] px-6 py-8 sm:py-16 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-5xl">
        {title && (
          <h2 className="mb-12 text-center font-display text-4xl text-[color:var(--text-main)] lg:text-5xl">
            {title}
          </h2>
        )}
        <div
          className={`grid gap-10 ${
            stats.length <= 2
              ? "grid-cols-2"
              : stats.length === 3
              ? "grid-cols-3"
              : "grid-cols-2 sm:grid-cols-4"
          }`}
        >
          {stats.map((item, i) => (
            <StatCard key={i} item={item} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}
