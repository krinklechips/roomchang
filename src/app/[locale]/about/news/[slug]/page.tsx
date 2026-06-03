import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NEWS_ARTICLES, NEWS_ARTICLES_SORTED, getArticleBySlug } from "@/lib/news";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return NEWS_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found — Roomchang Dental Hospital" };
  }

  return {
    title: `${article.title} | Roomchang Dental Hospital`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      images: [{ url: article.image }],
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Prev/next within the newest-first sorted order.
  // Left arrow = newer (previous in list), right arrow = older (next in list).
  const idx = NEWS_ARTICLES_SORTED.findIndex((a) => a.slug === slug);
  const newer = idx > 0 ? NEWS_ARTICLES_SORTED[idx - 1] : null;
  const older = idx < NEWS_ARTICLES_SORTED.length - 1 ? NEWS_ARTICLES_SORTED[idx + 1] : null;

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about/news"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> News &
            Events
          </Link>
          <p className="mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--brand)]">
            {article.date}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-[color:var(--text-main)] sm:text-5xl">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Hero image */}
      <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-[color:var(--surface)]">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            className="object-contain"
            sizes="(min-width: 1024px) 896px, (min-width: 640px) 90vw, 100vw"
            unoptimized
            priority
          />
        </div>
      </div>

      {/* Article body */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="space-y-5">
          {article.body.map((paragraph, i) => (
            <p
              key={i}
              className="text-base leading-8 text-[color:var(--text-soft)]"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Prev / Next navigation */}
        <div className="mt-12 border-t border-[color:var(--border-strong)] pt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
          {newer ? (
            <Link
              href={`/about/news/${newer.slug}`}
              className="group flex items-center gap-3 text-sm font-semibold text-[color:var(--text-soft)] hover:text-[color:var(--brand-deep)] transition sm:max-w-[45%]"
            >
              <ArrowLeft size={16} strokeWidth={2} className="shrink-0" aria-hidden="true" />
              <span className="line-clamp-2">{newer.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {older && (
            <Link
              href={`/about/news/${older.slug}`}
              className="group flex items-center gap-3 text-right text-sm font-semibold text-[color:var(--text-soft)] hover:text-[color:var(--brand-deep)] transition sm:max-w-[45%] sm:justify-end sm:ml-auto"
            >
              <span className="line-clamp-2">{older.title}</span>
              <ArrowRight size={16} strokeWidth={2} className="shrink-0" aria-hidden="true" />
            </Link>
          )}
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            href="/about/news"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--brand-deep)] transition hover:text-[color:var(--brand)]"
          >
            <ArrowLeft size={14} strokeWidth={2} aria-hidden="true" />
            Back to News & Events
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
