"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqBlock({
  title,
  items,
}: {
  title?: string;
  items?: FaqItem[];
}) {
  const [open, setOpen] = useState<number | null>(null);
  const faqItems = items?.filter((it) => it.question) ?? [];
  if (faqItems.length === 0) return null;

  return (
    <section className="mx-auto max-w-3xl px-6 py-8 lg:px-8 lg:py-20">
      {title && (
        <h2 className="mb-10 text-center font-display text-4xl text-[color:var(--text-main)] lg:text-5xl">
          {title}
        </h2>
      )}
      <dl className="divide-y divide-[color:var(--border-strong)]">
        {faqItems.map((item, i) => (
          <div key={i} className="py-4">
            <dt>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 text-left"
              >
                <span className="font-semibold text-[color:var(--text-main)] leading-6">
                  {item.question}
                </span>
                <span
                  className={`shrink-0 text-[color:var(--brand)] text-xl transition-transform duration-200 ${
                    open === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
            </dt>
            {open === i && (
              <dd className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                {item.answer}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
