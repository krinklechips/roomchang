import { getTranslations } from "next-intl/server";

import { getTestimonials } from "@/lib/data";
import { abbreviateName } from "@/lib/format-name";

export async function TestimonialsBlock({
  title,
  limit,
}: {
  title?: string;
  limit?: number;
}) {
  const t = await getTranslations("blocks.testimonials");
  const take = limit || 3;
  const testimonials = await getTestimonials();
  const items = testimonials
    .filter((testimonial) => testimonial.isFeatured)
    .slice(0, take);

  return (
    <section className="bg-[color:var(--surface)] px-6 py-8 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center font-display text-4xl text-[color:var(--text-main)] lg:text-5xl">
          {title || t("defaultHeading")}
        </h2>
        {items.length === 0 ? (
          <p className="text-center text-sm text-[color:var(--text-soft)]">
            {t("empty")}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((testimonial) => (
              <div key={testimonial.id} className="panel-card flex flex-col gap-3">
                {testimonial.rating > 0 && (
                  <div className="flex gap-0.5" aria-label={t("ratingStars", { count: testimonial.rating })}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={i < testimonial.rating ? "text-[color:var(--brand)]" : "text-gray-200"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm leading-7 text-[color:var(--text-soft)] italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-auto">
                  <p className="text-sm font-semibold text-[color:var(--text-main)]">
                    {abbreviateName(testimonial.authorName)}
                  </p>
                  {testimonial.authorTitle && (
                    <p className="text-xs text-[color:var(--text-soft)]">
                      {testimonial.authorTitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
