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
    const reveal = (index: number) =>
      setVisibleSteps((prev) => new Set(prev).add(index));

    const onIntersect: IntersectionObserverCallback = (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal(Number((entry.target as HTMLElement).dataset.index));
      }
    };

    const observer = new IntersectionObserver(onIntersect, {
      threshold: 0.3,
      rootMargin: "0px 0px -40px 0px",
    });
    stepRefs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [steps]);

  return (
    <div className="relative mt-10">
      <div className="space-y-2">
        {steps.map((s, i) => {
          const isVisible = visibleSteps.has(i);
          const hasNextStep = i < steps.length - 1;
          const isNextVisible = visibleSteps.has(i + 1);

          return (
            <div
              key={s.step_label}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              data-index={i}
              className="relative py-3"
            >
              {hasNextStep && (
                <div
                  className="absolute left-[23px] top-9 h-[calc(100%+0.5rem)] w-[2px] bg-[color:var(--border-strong)]"
                  aria-hidden="true"
                >
                  <div
                    className={`h-full w-full origin-top bg-[color:var(--brand)] transition-transform duration-700 ease-out ${
                      isNextVisible ? "scale-y-100" : "scale-y-0"
                    }`}
                  />
                </div>
              )}

              <div
                className={`relative flex gap-5 sm:gap-6 transition-all duration-700 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Step number on timeline */}
                <div
                  className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold transition-all duration-500 ${
                    isVisible
                      ? "bg-[color:var(--brand)] text-white shadow-[0_8px_24px_rgba(204,55,113,0.3)]"
                      : "bg-[color:var(--surface-strong)] text-[color:var(--text-soft)]"
                  }`}
                >
                  {s.step_label}
                </div>

                {/* Content card */}
                <div
                  className={`flex-1 rounded-2xl border bg-white p-6 transition-all duration-500 ${
                    isVisible
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
