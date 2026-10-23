import Image from "next/image";
import { ZoomableImage } from "@/components/ui/zoomable-image";

// Keep external sources aligned with next.config.ts images.remotePatterns.
const PHOTO_HOSTS = new Set([
  "pub-2b835c19d8644293b271deaeb97352b1.r2.dev",
  "roomchang.com",
]);

function nonemptyText(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function photoSource(value: unknown): string | undefined {
  const src = nonemptyText(value);
  if (!src || src !== src.trim() || /[\u0000-\u001f\u007f\\]/.test(src)) return undefined;
  if (src.startsWith("/") && !src.startsWith("//")) return src;
  if (!/^https:\/\//i.test(src)) return undefined;
  try {
    const url = new URL(src);
    // URL normalizes encoded hosts; require the literal authority too.
    const authority = /^https:\/\/([^/?#]+)/i.exec(src)?.[1].toLowerCase();
    if (PHOTO_HOSTS.has(url.hostname) && authority === url.hostname && !url.username && !url.password) return src;
  } catch {
    // Invalid optional URLs must not prevent the branch details from rendering.
  }
  return undefined;
}

export function BranchPhotoGallery({ photos }: { photos: unknown }) {
  if (!Array.isArray(photos)) return null;
  const items = photos.flatMap((photo: unknown) => {
    if (typeof photo === "string") {
      const src = photoSource(photo);
      return src ? [{ src, alt: "", caption: undefined }] : [];
    }
    if (!photo || typeof photo !== "object" || Array.isArray(photo)) return [];
    const entry = photo as Record<string, unknown>;
    const src = photoSource(entry.src) ?? photoSource(entry.url);
    if (!src) return [];
    const caption = nonemptyText(entry.caption);
    return [{ src, alt: nonemptyText(entry.alt) ?? caption ?? "", caption }];
  });
  if (items.length === 0) return null;

  return (
    <div className="grid min-w-0 gap-6 sm:grid-cols-2">
      {items.map(({ src, alt, caption }, index) => (
        <figure key={`${src}-${index}`} className="min-w-0">
          <ZoomableImage src={src} alt={alt} caption={caption}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)]">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </ZoomableImage>
          {caption && <figcaption className="mt-2 whitespace-pre-line break-words text-sm leading-6 text-[color:var(--text-soft)]">{caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
