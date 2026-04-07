// CMS-ready: replace BRANDS with API data when CMS is live
const BRANDS: { id: string; name: string; src: string; width: number; height: number }[] = [
  { id: "invisalign",     name: "Invisalign",         src: "/brands/logos/invisalign.svg",      width: 120, height: 36 },
  { id: "osstem",         name: "OSSTEM Implant",      src: "/brands/logos/osstem.svg",          width: 130, height: 36 },
  { id: "scheu",          name: "Scheu-Dental",        src: "/brands/logos/scheu-dental.svg",    width: 110, height: 36 },
  { id: "beyond",         name: "Beyond Whitening",    src: "/brands/logos/beyond.png",          width: 44,  height: 44 },
  { id: "gc",             name: "GC Corporation",      src: "/brands/logos/gc-corporation.svg",  width: 60,  height: 36 },
  { id: "tuttnauer",      name: "Tuttnauer",           src: "/brands/logos/tuttnauer.svg",       width: 110, height: 32 },
  { id: "bureau-veritas", name: "Bureau Veritas",      src: "/brands/logos/bureau-veritas.svg",  width: 120, height: 40 },
  { id: "dentsply",       name: "Dentsply Sirona",     src: "/brands/logos/dentsply-sirona.svg", width: 130, height: 36 },
  { id: "colgate",        name: "Colgate",             src: "/brands/logos/colgate.svg",         width: 100, height: 36 },
];

export function HomeBrands() {
  // Duplicate list so the marquee loops seamlessly
  const items = [...BRANDS, ...BRANDS];

  return (
    <div id="brands" className="mt-10 overflow-hidden border-y border-[--border-strong] bg-[--surface] py-8 sm:mt-14">
      <div className="flex w-max animate-marquee items-center gap-20 [animation-play-state:running] hover:[animation-play-state:paused]">
        {items.map((brand, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${brand.id}-${i}`}
            src={brand.src}
            alt={brand.name}
            width={brand.width}
            height={brand.height}
            className="select-none object-contain opacity-35 grayscale transition hover:opacity-55"
            style={{ maxHeight: brand.height, width: "auto" }}
            draggable={false}
          />
        ))}
      </div>
    </div>
  );
}
