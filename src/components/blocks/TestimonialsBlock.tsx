import { getTestimonials } from "@/lib/data";

export async function TestimonialsBlock({
  title,
  limit,
}: {
  title?: string;
  limit?: number;
}) {
  const take = limit || 3;
  const testimonials = await getTestimonials();
  const items = testimonials
    .filter((testimonial) => testimonial.isFeatured)
    .slice(0, take);

  return (
    <section className="bg-[color:var(--surface)] px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center font-display text-4xl text-[color:var(--text-main)] lg:text-5xl">
          {title || "What Our Patients Say"}
        </h2>
        {items.length === 0 ? (
          <p className="text-center text-sm text-[color:var(--text-soft)]">
            No testimonials published yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => (
              <div key={t.id} className="panel-card flex flex-col gap-3">
                {t.rating > 0 && (
                  <div className="flex gap-0.5" aria-label={`${t.rating} stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={i < t.rating ? "text-[color:var(--brand)]" : "text-gray-200"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-sm leading-7 text-[color:var(--text-soft)] italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-auto">
                  <p className="text-sm font-semibold text-[color:var(--text-main)]">
                    {t.authorName}
                  </p>
                  {t.authorTitle && (
                    <p className="text-xs text-[color:var(--text-soft)]">
                      {t.authorTitle}
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
