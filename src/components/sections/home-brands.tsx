// CMS-ready: replace BRANDS with API data when CMS is live
const BRANDS = [
  { id: "osstem",    name: "OSSTEM IMPLANT",   style: "font-bold tracking-tight" },
  { id: "align",     name: "Align Technology",  style: "font-light tracking-widest" },
  { id: "dentsply",  name: "Dentsply Sirona",   style: "font-semibold tracking-tight" },
  { id: "envista",   name: "Envista",            style: "font-medium tracking-wide" },
  { id: "colgate",   name: "Colgate",            style: "font-bold italic text-xl" },
  { id: "gc",        name: "GC Corporation",     style: "font-semibold tracking-wide" },
  { id: "beyond",    name: "Beyond",             style: "font-bold text-xl tracking-widest" },
  { id: "myplant",   name: "myplant two®",       style: "font-medium tracking-tight" },
  { id: "tuttnauer", name: "Tuttnauer",          style: "font-semibold" },
  { id: "bureauv",   name: "Bureau Veritas",     style: "font-light tracking-wide" },
];

export function HomeBrands() {
  // Duplicate list so the marquee loops seamlessly
  const items = [...BRANDS, ...BRANDS];

  return (
    <div id="brands" className="mt-10 overflow-hidden border-y border-[--border-strong] bg-[--surface] py-8 sm:mt-14">
      <div className="flex w-max animate-marquee items-center gap-24 [animation-play-state:running] hover:[animation-play-state:paused]">
        {items.map((brand, i) => (
          <span
            key={`${brand.id}-${i}`}
            className={`select-none whitespace-nowrap text-2xl text-gray-300 ${brand.style}`}
          >
            {brand.name}
          </span>
        ))}
      </div>
    </div>
  );
}
