import Image from "next/image";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { getTranslations } from "next-intl/server";
import { CommunityGallery } from "@/components/sections/community-gallery";
import { LazyVideo } from "@/components/ui/lazy-video";
import { ZoomableImage } from "@/components/ui/zoomable-image";
import type { ServiceSection } from "@/lib/data";

export const hasMediaSource = (src: unknown): src is string => typeof src === "string" && src.trim().length > 0;

export function BulletList({ s }: { s: Extract<ServiceSection, { type: "list" }> }) {
  return (
    <div>
      {s.heading && <h2 className="font-display text-3xl text-[color:var(--text-main)] mb-6">{s.heading}</h2>}
      <div className="grid gap-3 sm:grid-cols-2">
        {s.items?.map((item, i) => (
          <div key={i} className="flex items-start gap-3 rounded-2xl border border-[color:var(--border-strong)] bg-white px-5 py-4">
            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-[color:var(--brand)] text-white flex items-center justify-center"><CheckCircle size={9} weight="bold" aria-hidden="true" /></span>
            <span className="text-sm leading-6 text-[color:var(--text-soft)]">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function Gallery({ s }: { s: Extract<ServiceSection, { type: "gallery" }> }) {
  const t = await getTranslations("services.detail");
  const images = Array.isArray(s.images) ? s.images.filter(hasMediaSource) : [];
  return (
    <div>
      {s.heading && <h2 className="font-display text-3xl text-[color:var(--text-main)]">{s.heading}</h2>}
      {s.subheading && <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-soft)]">{s.subheading}</p>}
      {images.length > 0 && (
        <div className={s.heading || s.subheading ? "mt-8" : ""}>
          <CommunityGallery images={images} title={s.heading || t("galleryTitle")} columns={4} />
        </div>
      )}
    </div>
  );
}

export async function PriceTable({ s }: { s: Extract<ServiceSection, { type: "pricing" | "pricetable" }> }) {
  const t = await getTranslations("services.detail");
  return (
    <div>
      {s.heading && <h2 className="font-display text-3xl text-[color:var(--text-main)]">{s.heading}</h2>}
      {s.subheading && <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-soft)]">{s.subheading}</p>}
      <div className="mt-8 overflow-hidden rounded-3xl border border-[color:var(--brand-soft)] bg-white shadow-[0_16px_48px_rgba(57,28,45,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-[color:var(--brand-soft)] bg-[color:var(--surface)]">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-soft)]">{t("priceTableTreatment")}</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand-deep)]">{t("priceTablePriceUsd")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--brand-soft)]">
              {s.rows?.map((row, i) => (
                <tr key={i} className="transition hover:bg-[color:var(--surface)]">
                  <td className="px-6 py-4 font-medium text-[color:var(--text-main)]">{row.treatment}</td>
                  <td className="px-6 py-4 text-right font-bold text-[color:var(--brand-deep)]">{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function ImagePair({ s }: { s: Extract<ServiceSection, { type: "image_pair" }> }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {[s.left, s.right].map((img, i) => {
        if (!img || !hasMediaSource(img.src)) return null;
        const mediaWrap = "relative aspect-video overflow-hidden rounded-2xl border border-[color:var(--border-strong)] bg-[color:var(--surface)] shadow-[0_16px_48px_rgba(57,28,45,0.08)]";
        return (
          <figure key={i}>
            {/\.(mp4|webm)(?:[?#]|$)/i.test(img.src) ? (
              <div className={mediaWrap}>
                <LazyVideo src={img.src} className="absolute inset-0 h-full w-full object-cover" />
              </div>
            ) : (
              <ZoomableImage src={img.src} alt={img.alt ?? ""} caption={img.caption}>
                <div className={mediaWrap}>
                  <Image src={img.src} alt={img.alt ?? ""} fill className="object-cover" sizes="(min-width: 640px) 50vw, 100vw" />
                </div>
              </ZoomableImage>
            )}
            {img.caption && <figcaption className="mt-2 text-center text-xs text-[color:var(--text-soft)]">{img.caption}</figcaption>}
          </figure>
        );
      })}
    </div>
  );
}

export function SelfVideo({ s }: { s: Extract<ServiceSection, { type: "self_video" }> }) {
  if (!hasMediaSource(s.src)) return null;
  return (
    <figure>
      {s.heading && <h2 className="mb-6 font-display text-3xl text-[color:var(--text-main)]">{s.heading}</h2>}
      <div className="overflow-hidden rounded-2xl border border-[color:var(--border-strong)] shadow-[0_16px_48px_rgba(57,28,45,0.08)]">
        <LazyVideo src={s.src} className="w-full h-auto" />
      </div>
      {s.caption && <figcaption className="mt-3 text-center text-xs text-[color:var(--text-soft)]">{s.caption}</figcaption>}
    </figure>
  );
}

export async function VideoEmbed({ s }: { s: Extract<ServiceSection, { type: "video" }> }) {
  if (!hasMediaSource(s.videoId)) return null;
  const t = await getTranslations("technologyDetail");
  return (
    <div>
      {s.heading && <h2 className="font-display text-3xl text-[color:var(--text-main)]">{s.heading}</h2>}
      {s.subheading && <p className="mt-3 text-sm text-[color:var(--text-soft)]">{s.subheading}</p>}
      <div className={`${s.heading ? "mt-8" : ""} relative aspect-video overflow-hidden rounded-2xl border border-[color:var(--border-strong)] shadow-[0_16px_48px_rgba(57,28,45,0.08)]`}>
        <iframe
          src={`https://www.youtube.com/embed/${s.videoId}`}
          title={s.heading || t("video")}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
