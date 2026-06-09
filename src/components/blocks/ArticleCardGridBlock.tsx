import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface ArticleCardItem {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  href?: string;
}

interface ArticleCardGridBlockProps {
  articleTitle?: string;
  articleItems?: ArticleCardItem[];
}

export function ArticleCardGridBlock({
  articleTitle,
  articleItems,
}: ArticleCardGridBlockProps) {
  const items = articleItems?.filter((item) => item.title && item.description) ?? [];

  if (items.length === 0) return null;

  return (
    <section className="px-6 py-8 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {articleTitle && (
          <h2 className="mb-10 text-center font-display text-4xl text-[color:var(--text-main)] lg:text-5xl">
            {articleTitle}
          </h2>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <article
              key={`${item.title}-${i}`}
              className="panel-card flex h-full flex-col overflow-hidden"
            >
              {item.image && (
                <div className="relative aspect-[16/9] overflow-hidden bg-[color:var(--brand-soft)]">
                  <Image
                    src={item.image}
                    alt={item.imageAlt || item.title}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl text-[color:var(--text-main)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                  {item.description}
                </p>
                {item.href && (
                  <Link
                    href={item.href}
                    className="mt-5 text-sm font-semibold text-[color:var(--brand)] hover:underline"
                  >
                    Read more
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
