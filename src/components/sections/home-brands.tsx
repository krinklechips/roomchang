// CMS-ready: replace BRANDS with API data when CMS is live
const BRANDS: { id: string; name: string; src: string; width: number; height: number }[] = [
  { id: "invisalign",     name: "Invisalign",        src: "/brands/logos/invisalign.svg",      width: 110, height: 32 },
  { id: "osstem",         name: "OSSTEM",             src: "/brands/logos/osstem.svg",          width: 110, height: 32 },
  { id: "scheu",          name: "Scheu-Dental",       src: "/brands/logos/scheu-dental.svg",    width: 100, height: 32 },
  { id: "beyond",         name: "Beyond®",            src: "/brands/logos/beyond.svg",          width: 120, height: 36 },
  { id: "gc",             name: "GC Corporation",     src: "/brands/logos/gc-corporation.svg",  width: 120, height: 32 },
  { id: "tuttnauer",      name: "Tuttnauer",          src: "/brands/logos/tuttnauer.svg",       width: 100, height: 28 },
  { id: "bureau-veritas", name: "Bureau Veritas",     src: "/brands/logos/bureau-veritas.svg",  width: 140, height: 44 },
  { id: "dentsply",       name: "Dentsply Sirona",    src: "/brands/logos/dentsply-sirona.svg", width: 120, height: 32 },
  { id: "colgate",        name: "Colgate",            src: "/brands/logos/colgate.svg",         width: 90,  height: 32 },
];

export function HomeBrands() {
  // Triple the list — guarantees no visible gap when the strip loops back
  const items = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <div id="brands" className="mt-10 overflow-hidden border-y border-[--border-strong] bg-[--surface] py-6 sm:mt-14">
      <div className="flex w-max animate-marquee items-center [animation-play-state:running] hover:[animation-play-state:paused]">
        {items.map((brand, i) => (
          // Fixed-width slot so every logo gets equal space regardless of its own width
          <div
            key={`${brand.id}-${i}`}
            className="flex w-44 shrink-0 select-none items-center justify-center opacity-40 grayscale transition hover:opacity-60"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={brand.src}
              alt={brand.name}
              width={brand.width}
              height={brand.height}
              className="object-contain"
              style={{ maxHeight: brand.height, maxWidth: brand.width, width: "auto" }}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
