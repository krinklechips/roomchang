import Image from "next/image";
import { AboutTimeline } from "@/components/sections/about-timeline";

interface TimelineItem {
  year: string;
  caption: string;
  heading: string;
  body: string;
  src: string;
  alt: string;
}

interface TimelineBlockProps {
  timelineTitle?: string;
  timelineItems?: TimelineItem[];
}

export function TimelineBlock({
  timelineTitle,
  timelineItems,
}: TimelineBlockProps) {
  const items =
    timelineItems?.filter(
      (item) =>
        item.year &&
        item.caption &&
        item.heading &&
        item.body &&
        item.src &&
        item.alt,
    ) ?? [];

  if (items.length === 0) return <AboutTimeline />;

  return (
    <section className="relative overflow-hidden border-y border-[color:var(--border-strong)]">
      {timelineTitle && (
        <div className="border-b border-[color:var(--border-strong)] px-6 py-12 text-center lg:px-8">
          <h2 className="font-display text-4xl text-[color:var(--text-main)] lg:text-5xl">
            {timelineTitle}
          </h2>
        </div>
      )}

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-[color:var(--border-strong)] lg:block"
        aria-hidden="true"
      />

      {items.map((item, i) => {
        const imgLeft = i % 2 === 0;

        return (
          <div
            key={`${item.year}-${i}`}
            className="relative flex flex-col border-b border-[color:var(--border-strong)] last:border-b-0 lg:min-h-[42rem] lg:flex-row"
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 hidden -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 lg:flex">
              <div className="h-3.5 w-3.5 rounded-full bg-[color:var(--brand)] shadow-[0_0_0_5px_white,0_0_0_6px_var(--brand-light)]" />
            </div>

            <div
              className={`relative h-72 w-full overflow-hidden lg:h-auto lg:w-1/2 ${
                imgLeft ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
                priority={i === 0}
              />
              <div
                className={`absolute inset-0 ${
                  imgLeft
                    ? "bg-gradient-to-r from-black/5 via-transparent to-black/20"
                    : "bg-gradient-to-l from-black/5 via-transparent to-black/20"
                }`}
              />
              <p
                className={`absolute select-none font-display leading-none text-white/[0.08] ${
                  imgLeft
                    ? "bottom-6 left-6 text-[7rem] lg:text-[10rem]"
                    : "bottom-6 right-6 text-right text-[7rem] lg:text-[10rem]"
                }`}
                aria-hidden="true"
              >
                {item.year}
              </p>
            </div>

            <div
              className={`flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-16 lg:py-20 xl:px-24 ${
                imgLeft ? "lg:order-2" : "lg:order-1"
              }`}
            >
              <p className="mb-1 font-display text-[2.8rem] leading-none text-[color:var(--brand)] lg:hidden">
                {item.year}
              </p>
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.35em] text-[color:var(--brand)]">
                {item.caption}
              </p>
              <h3 className="mt-3 font-display text-4xl leading-tight text-[color:var(--text-main)] lg:text-5xl xl:text-6xl">
                {item.heading}
              </h3>
              <p className="mt-2 hidden select-none font-display text-[5rem] leading-none text-[color:var(--brand-light)] opacity-40 lg:block xl:text-[6rem]">
                {item.year}
              </p>
              <p className="mt-5 max-w-md text-sm italic leading-8 text-[color:var(--text-soft)]">
                {item.body}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
