import { supabaseServer } from "@/lib/supabase-server";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  description: string | null;
  min_price: number | null;
  max_price: number | null;
  currency: string | null;
  category: string | null;
  slug: string | null;
}

export async function PricingBlock({
  title,
  category,
}: {
  title?: string;
  category?: string;
}) {
  const supabase = supabaseServer;

  let query = supabase
    .from("services")
    .select("id, name, description, min_price, max_price, currency, category, slug")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (category?.trim()) {
    query = query.ilike("category", `%${category.trim()}%`);
  }

  const { data: services, error } = await query.limit(24);

  if (error) {
    console.error("[PricingBlock] Supabase error:", error.message);
  }

  const items: Service[] = services ?? [];

  function formatPrice(min: number | null, max: number | null, currency: string | null) {
    const c = currency || "USD";
    if (!min && !max) return "Contact us";
    if (min && max && min !== max) return `$${min}–$${max} ${c}`;
    return `$${min || max} ${c}`;
  }

  return (
    <section className="px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center font-display text-4xl text-[color:var(--text-main)] lg:text-5xl">
          {title || "Our Services"}
        </h2>
        {items.length === 0 ? (
          <p className="text-center text-sm text-[color:var(--text-soft)]">
            No services published yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((service) => (
              <div key={service.id} className="panel-card flex flex-col gap-2">
                {service.category && (
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-[color:var(--brand)]">
                    {service.category}
                  </p>
                )}
                <p className="font-semibold text-[color:var(--text-main)]">{service.name}</p>
                {service.description && (
                  <p className="text-xs leading-6 text-[color:var(--text-soft)]">
                    {service.description}
                  </p>
                )}
                <p className="mt-auto pt-2 text-sm font-semibold text-[color:var(--brand-deep)]">
                  {formatPrice(service.min_price, service.max_price, service.currency)}
                </p>
                {service.slug && (
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-xs font-medium text-[color:var(--brand)] hover:underline"
                  >
                    Learn more →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
