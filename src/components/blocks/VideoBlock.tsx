function resolveEmbedUrl(url: string): string | null {
  if (!url) return null;

  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  // Direct mp4 — return as-is (will use <video>)
  if (url.endsWith(".mp4") || url.includes(".mp4?")) return url;

  return null;
}

export function VideoBlock({
  url,
  title,
  caption,
  thumbnail,
}: {
  url?: string;
  title?: string;
  caption?: string;
  thumbnail?: string;
}) {
  if (!url) return null;

  const embedUrl = resolveEmbedUrl(url);
  const isDirect = embedUrl?.endsWith(".mp4") || embedUrl?.includes(".mp4?");

  return (
    <section className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
      {title && (
        <h2 className="mb-6 font-display text-3xl text-[color:var(--text-main)] lg:text-4xl">
          {title}
        </h2>
      )}

      <div className="overflow-hidden rounded-xl shadow-xl">
        {embedUrl && !isDirect ? (
          <div className="relative aspect-video w-full">
            <iframe
              src={embedUrl}
              title={title || "Video"}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : isDirect ? (
          <video
            src={embedUrl!}
            poster={thumbnail}
            controls
            className="w-full rounded-xl"
          >
            <track kind="captions" />
          </video>
        ) : (
          // Unrecognised URL — show thumbnail with link
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex aspect-video w-full items-center justify-center bg-gray-900"
            style={
              thumbnail
                ? { backgroundImage: `url(${thumbnail})`, backgroundSize: "cover", backgroundPosition: "center" }
                : undefined
            }
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
              <div className="ml-1 h-0 w-0 border-b-[12px] border-t-[12px] border-l-[20px] border-b-transparent border-t-transparent border-l-[color:var(--brand)]" />
            </div>
          </a>
        )}
      </div>

      {caption && (
        <p className="mt-4 text-sm text-[color:var(--text-soft)]">{caption}</p>
      )}
    </section>
  );
}
