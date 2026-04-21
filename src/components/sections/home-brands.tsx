// CMS-ready: replace BRANDS with API data when CMS is live
// Brand list sourced from Unident Cambodia's partners strip.
const BRANDS: { id: string; name: string; src: string }[] = [
  { id: "amann-girrbach",   name: "Amann Girrbach",               src: "/brands/logos/amann-girrbach.png" },
  { id: "beyond",           name: "Beyond International",         src: "/brands/logos/beyond-international.png" },
  { id: "bl-biotech",       name: "B&L Biotech",                  src: "/brands/logos/bl-biotech.png" },
  { id: "botiss",           name: "Botiss Biomaterials",          src: "/brands/logos/botiss.png" },
  { id: "henry-schein",     name: "Henry Schein Orthodontics",    src: "/brands/logos/henry-schein.jpg" },
  { id: "cefla",            name: "Cefla",                        src: "/brands/logos/cefla.png" },
  { id: "yamahachi",        name: "Yamahachi",                    src: "/brands/logos/yamahachi.png" },
  { id: "dentaurum",        name: "Dentaurum",                    src: "/brands/logos/dentaurum.png" },
  { id: "durr-dental",      name: "Dürr Dental",                  src: "/brands/logos/durr-dental.png" },
  { id: "garrison",         name: "Garrison Dental Solutions",    src: "/brands/logos/garrison.png" },
  { id: "gc",               name: "GC Corporation",               src: "/brands/logos/gc-corporation.svg" },
  { id: "helmut-zepf",      name: "Helmut Zepf",                  src: "/brands/logos/helmut-zepf.png" },
  { id: "hu-friedy",        name: "Hu-Friedy",                    src: "/brands/logos/hu-friedy.png" },
  { id: "itena",            name: "Itena Clinical",               src: "/brands/logos/itena.png" },
  { id: "jota",             name: "Jota",                         src: "/brands/logos/jota.png" },
  { id: "monitex",          name: "Monitex",                      src: "/brands/logos/monitex.png" },
  { id: "nissin",           name: "Nissin",                       src: "/brands/logos/nissin.png" },
  { id: "novocol",          name: "Novocol",                      src: "/brands/logos/novocol.png" },
  { id: "paradise-dental",  name: "Paradise Dental Technologies", src: "/brands/logos/paradise-dental.png" },
  { id: "meisinger",        name: "Meisinger",                    src: "/brands/logos/meisinger.png" },
  { id: "takara-belmont",   name: "Takara Belmont",               src: "/brands/logos/takara-belmont.png" },
  { id: "therabreath",      name: "TheraBreath",                  src: "/brands/logos/therabreath.png" },
  { id: "tuttnauer",        name: "Tuttnauer",                    src: "/brands/logos/tuttnauer.svg" },
  { id: "wh",               name: "W&H",                          src: "/brands/logos/wh.png" },
  { id: "ustomed",          name: "Ustomed Instrumente",          src: "/brands/logos/ustomed.jpg" },
  { id: "photocentric",     name: "Photocentric",                 src: "/brands/logos/photocentric.jpg" },
  { id: "posdion",          name: "Posdion",                      src: "/brands/logos/posdion.jpg" },
  { id: "admetec",          name: "Admetec",                      src: "/brands/logos/admetec.jpg" },
  { id: "lasotronix",       name: "Lasotronix",                   src: "/brands/logos/lasotronix.jpg" },
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
              className="h-10 w-auto max-w-[160px] object-contain"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
