import Image from "next/image";

interface GalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageGalleryBlockProps {
  galleryTitle?: string;
  galleryColumns?: 2 | 3 | 4;
  galleryItems?: GalleryItem[];
}

function getGridClass(columns: 2 | 3 | 4) {
  if (columns === 2) return "sm:grid-cols-2";
  if (columns === 4) return "sm:grid-cols-2 lg:grid-cols-4";
  return "sm:grid-cols-2 lg:grid-cols-3";
}

export function ImageGalleryBlock({
  galleryTitle,
  galleryColumns = 3,
  galleryItems,
}: ImageGalleryBlockProps) {
  const columns = [2, 3, 4].includes(galleryColumns) ? galleryColumns : 3;
  const items = galleryItems?.filter((item) => item.src) ?? [];

  if (items.length === 0) return null;

  return (
    <section className="px-6 py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {galleryTitle && (
          <h2 className="mb-10 text-center font-display text-4xl text-[color:var(--text-main)] lg:text-5xl">
            {galleryTitle}
          </h2>
        )}
        <div className={`grid gap-6 ${getGridClass(columns)}`}>
          {items.map((item, i) => (
            <figure key={`${item.src}-${i}`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)]">
                <Image
                  src={item.src}
                  alt={item.alt || ""}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              {item.caption && (
                <figcaption className="mt-3 text-sm leading-6 text-[color:var(--text-soft)]">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
