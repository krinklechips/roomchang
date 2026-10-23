"use client";

import { useState } from "react";
import { Play } from "lucide-react";

// Keep new CMS media consumers aligned with next.config.ts remotePatterns.
const IMAGE_HOSTS = new Set([
  "pub-2b835c19d8644293b271deaeb97352b1.r2.dev",
  "roomchang.com",
]);

function safeImageUrl(value: string | null | undefined): string | null {
  if (!value || value.includes("\\")) return null;
  try {
    const url = new URL(value, "https://cms-media.invalid");
    if (value.startsWith("/") && !value.startsWith("//") && url.origin === "https://cms-media.invalid") {
      return `${url.pathname}${url.search}${url.hash}`;
    }
    return /^https:\/\//i.test(value) && url.protocol === "https:" && !url.username && !url.password
      && !url.port && IMAGE_HOSTS.has(url.hostname)
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function TestimonialAvatar({
  photoUrl,
  initials,
}: {
  photoUrl?: string | null;
  initials: string;
}) {
  const src = safeImageUrl(photoUrl);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || src === failedSrc) return <>{initials}</>;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      className="h-full w-full rounded-full object-cover"
      onError={() => setFailedSrc(src)}
    />
  );
}

export function CmsVideoPlayer({
  src,
  title,
  thumbnail,
}: {
  src: string;
  title: string;
  thumbnail?: string | null;
}) {
  const imageSrc = safeImageUrl(thumbnail);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);

  if (imageSrc && imageSrc !== failedImageSrc && loadedSrc !== src) {
    return (
      <button
        type="button"
        aria-label={title}
        title={title}
        className="relative block h-full w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[color:var(--brand)]"
        onClick={() => setLoadedSrc(src)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
          onError={() => setFailedImageSrc(imageSrc)}
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/10" aria-hidden="true">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--brand)] text-white shadow-lg">
            <Play size={24} fill="currentColor" />
          </span>
        </span>
      </button>
    );
  }

  return (
    <iframe
      src={src}
      title={title}
      className="h-full w-full"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
