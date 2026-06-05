"use client";

import { useEffect, useRef, useState } from "react";

type Step = {
  step_label: string;
  title: string;
  description: string;
};

export function InteractiveSteps({ steps }: { steps: Step[] }) {
  const [visibleSteps, setVisibleSteps] = useState<Set<number>>(new Set());
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleSteps((prev) => {
              const next = new Set(prev);
              next.add(index);
              return next;
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -40px 0px" },
    );

    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [steps]);

  const maxVisible = visibleSteps.size > 0 ? Math.max(...Array.from(visibleSteps)) : -1;
  const progressPct = steps.length > 1 ? (maxVisible / (steps.length - 1)) * 100 : 0;

  return (
    <div className="relative mt-10">
      {/* Background timeline track */}
      <div
        className="absolute left-[23px] top-8 bottom-8 w-[2px] bg-[color:var(--border-strong)]"
        aria-hidden="true"
      />

      {/* Filled progress line */}
      <div
        className="absolute left-[23px] top-8 w-[2px] bg-[color:var(--brand)] transition-all duration-700 ease-out"
        style={{ height: `calc(${progressPct}% - 32px)` }}
        aria-hidden="true"
      />

      <div className="space-y-2">
        {steps.map((s, i) => (
          <div
            key={s.step_label}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            data-index={i}
            className={`relative flex gap-5 sm:gap-6 py-3 transition-all duration-700 ease-out ${
              visibleSteps.has(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: `${i * 120}ms` }}
          >
            {/* Step number on timeline */}
            <div
              className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold transition-all duration-500 ${
                visibleSteps.has(i)
                  ? "bg-[color:var(--brand)] text-white shadow-[0_8px_24px_rgba(204,55,113,0.3)]"
                  : "bg-[color:var(--surface-strong)] text-[color:var(--text-soft)]"
              }`}
            >
              {s.step_label}
            </div>

            {/* Content card */}
            <div
              className={`flex-1 rounded-2xl border bg-white p-6 transition-all duration-500 ${
                visibleSteps.has(i)
                  ? "border-[color:var(--brand-soft)] shadow-[0_8px_30px_rgba(57,28,45,0.06)]"
                  : "border-[color:var(--border-strong)]"
              }`}
            >
              <h3 className="font-semibold text-[color:var(--text-main)]">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-[color:var(--text-soft)]">
                {s.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
