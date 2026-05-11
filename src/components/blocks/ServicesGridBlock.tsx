import { supabaseServer } from "@/lib/supabase-server";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  category: string | null;
  slug: string | null;
}

export async function ServicesGridBlock({
  title,
  filter,
  limit,
}: {
  title?: string;
  filter?: string;
  limit?: number;
}) {
  const supabase = supabaseServer;
  const take = limit || 6;

  let query = supabase
    .from("services")
    .select("id, name, description, icon, category, slug")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .limit(take);

  if (filter?.trim()) {
    query = query.ilike("category", `%${filter.trim()}%`);
  }

  const { data: services, error } = await query;
  if (error) console.error("[ServicesGridBlock] Supabase error:", error.message);

  const items: Service[] = services ?? [];

  return (
    <section className="px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        {title && (
          <h2 className="mb-10 text-center font-display text-4xl text-[color:var(--text-main)] lg:text-5xl">
            {title}
          </h2>
        )}
        {items.length === 0 ? (
          <p className="text-center text-sm text-[color:var(--text-soft)]">No services published yet.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((service) => (
              <div key={service.id} className="panel-card group flex flex-col gap-3">
                {service.icon && (
                  <span className="text-3xl">{service.icon}</span>
                )}
                {service.category && (
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-[color:var(--brand)]">
                    {service.category}
                  </p>
                )}
                <p className="font-semibold text-[color:var(--text-main)]">{service.name}</p>
                {service.description && (
                  <p className="text-xs leading-6 text-[color:var(--text-soft)] line-clamp-3">
                    {service.description}
                  </p>
                )}
                {service.slug && (
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-auto text-xs font-medium text-[color:var(--brand)] hover:underline"
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
