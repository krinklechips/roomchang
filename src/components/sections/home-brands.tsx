import { supabaseServer } from "@/lib/supabase-server";

export async function HomeBrands() {
  const { data, error } = await supabaseServer
    .from("brand_logos")
    .select("slug, name, logo_src")
    .order("sort_order");

  if (error) {
    console.error("[HomeBrands] brand_logos fetch failed:", error.message);
  }

  const brands = data ?? [];
  // Triple the list — guarantees no visible gap when the strip loops back
  const items = [...brands, ...brands, ...brands];

  return (
    <div id="brands" className="mt-10 overflow-hidden border-y border-[--border-strong] bg-[--surface] py-6 sm:mt-14">
      <div className="flex w-max animate-marquee items-center [animation-play-state:running] hover:[animation-play-state:paused]">
        {items.map((brand, i) => (
          // Fixed-width slot so every logo gets equal space regardless of its own width
          <div
            key={`${brand.slug}-${i}`}
            className="flex w-44 shrink-0 select-none items-center justify-center opacity-40 grayscale transition hover:opacity-60"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brand.logo_src}
              alt={brand.name}
              className="h-10 w-auto max-w-[160px] object-contain"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
