import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import { NEWS_ARTICLES, getArticleBySlug } from "@/lib/news";
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

        {/* Back link */}
        <div className="mt-12 border-t border-[color:var(--border-strong)] pt-8">
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
