"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl: string;
}

export function CarouselBlock({ slides }: { slides?: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const items = slides?.filter((s) => s.image) ?? [];
  if (items.length === 0) return null;

  const slide = items[current];

  return (
    <section className="relative overflow-hidden" style={{ minHeight: "420px" }}>
      {/* Background image */}
      <Image
        src={slide.image}
        alt={slide.title || "Slide"}
        fill
        className="object-cover"
        sizes="100vw"
        priority={current === 0}
      />
      <div className="absolute inset-0 bg-[color:var(--text-main)]/45" />

      {/* Content */}
      <div className="relative flex min-h-[420px] flex-col items-center justify-center px-6 py-20 text-center">
        <h2 className="font-display text-4xl text-white md:text-5xl">
          {slide.title}
        </h2>
        {slide.subtitle && (
          <p className="mt-4 max-w-lg text-sm leading-7 text-white/85">
            {slide.subtitle}
          </p>
        )}
        {slide.ctaText && slide.ctaUrl && (
          <Link href={slide.ctaUrl} className="btn-primary mt-8">
            {slide.ctaText}
          </Link>
        )}
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-6 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
