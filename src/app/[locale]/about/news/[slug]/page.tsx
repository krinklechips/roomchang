import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabaseServer } from "@/lib/supabase-server";
import { getTranslatedFields, mergeTranslation } from "@/lib/i18n-content";
import { getPayloadNewsArticleBySlug, getPayloadNewsArticles, isPayloadSource } from "@/lib/payload-source";
import { getArticleBySlug as getFallbackArticle } from "@/lib/news";
import type { Metadata } from "next";

export const revalidate = 60;

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

type Article = {
  slug: string;
  date: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  body: string[];
};

async function getArticle(slug: string): Promise<Article | null> {
  if (isPayloadSource()) return getPayloadNewsArticleBySlug(slug);

  const { data, error } = await supabaseServer
    .from("news_articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    // Fall back to the hardcoded array during migration
    const fallback = getFallbackArticle(slug);
    return fallback ?? null;
  }

  return mergeTranslation(
    data as Article,
    await getTranslatedFields("news_article", (data as { id: string }).id),
  );
}

async function getAdjacentArticles(slug: string) {
  if (isPayloadSource()) {
    const articles = await getPayloadNewsArticles();
    const idx = articles.findIndex((a) => a.slug === slug);
    return {
      newer: idx > 0 ? articles[idx - 1] : null,
      older: idx < articles.length - 1 ? articles[idx + 1] : null,
    };
  }

  const { data } = await supabaseServer
    .from("news_articles")
    .select("slug, title")
    .eq("published", true)
    .order("order", { ascending: true });

  const articles = (data ?? []) as { slug: string; title: string }[];
  const idx = articles.findIndex((a) => a.slug === slug);

  return {
    newer: idx > 0 ? articles[idx - 1] : null,
    older: idx < articles.length - 1 ? articles[idx + 1] : null,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = await getArticle(slug);

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
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("newsDetail");
  const [article, adjacent] = await Promise.all([
    getArticle(slug),
    getAdjacentArticles(slug),
  ]);

  if (!article) {
    notFound();
  }

  const { newer, older } = adjacent;

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about/news"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> {t("backLink")}
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
            {t("backToNews")}
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
