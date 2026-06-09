interface VideoGridItem {
  url: string;
  title: string;
  description?: string;
  thumbnail?: string;
}

interface VideoGridBlockProps {
  videoGridTitle?: string;
  videoGridSubtitle?: string;
  videoGridColumns?: 2 | 3;
  videoGridItems?: VideoGridItem[];
}

function resolveEmbedUrl(url: string): string | null {
  if (!url) return null;

  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  // Direct mp4 — return as-is (will use <video>)
  if (url.endsWith(".mp4") || url.includes(".mp4?")) return url;

  return null;
}

function getGridClass(columns: 2 | 3) {
  return columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
}

export function VideoGridBlock({
  videoGridTitle,
  videoGridSubtitle,
  videoGridColumns = 2,
  videoGridItems,
}: VideoGridBlockProps) {
  const columns = [2, 3].includes(videoGridColumns) ? videoGridColumns : 2;
  const items = videoGridItems?.filter((item) => item.url && item.title) ?? [];

  if (items.length === 0) return null;

  return (
    <section className="px-6 py-8 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {(videoGridTitle || videoGridSubtitle) && (
          <div className="mx-auto mb-10 max-w-3xl text-center">
            {videoGridTitle && (
              <h2 className="font-display text-4xl text-[color:var(--text-main)] lg:text-5xl">
                {videoGridTitle}
              </h2>
            )}
            {videoGridSubtitle && (
              <p className="mt-4 text-sm leading-7 text-[color:var(--text-soft)]">
                {videoGridSubtitle}
              </p>
            )}
          </div>
        )}
        <div className={`grid gap-6 sm:grid-cols-2 ${getGridClass(columns)}`}>
          {items.map((item, i) => {
            const embedUrl = resolveEmbedUrl(item.url);
            const isDirect =
              embedUrl?.endsWith(".mp4") || embedUrl?.includes(".mp4?");

            return (
              <article key={`${item.url}-${i}`} className="panel-card overflow-hidden">
                <div className="relative aspect-video overflow-hidden bg-[color:var(--text-main)]">
                  {embedUrl && !isDirect ? (
                    <iframe
                      src={embedUrl}
                      title={item.title}
                      className="absolute inset-0 h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : isDirect ? (
                    <video
                      src={embedUrl ?? undefined}
                      poster={item.thumbnail}
                      controls
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full w-full items-center justify-center bg-cover bg-center"
                      style={
                        item.thumbnail
                          ? { backgroundImage: `url(${item.thumbnail})` }
                          : undefined
                      }
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                        <span className="ml-1 h-0 w-0 border-b-[10px] border-l-[18px] border-t-[10px] border-b-transparent border-l-[color:var(--brand)] border-t-transparent" />
                      </span>
                    </a>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-[color:var(--text-main)]">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                      {item.description}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
