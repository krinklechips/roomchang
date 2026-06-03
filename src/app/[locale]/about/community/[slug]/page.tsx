import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { supabaseServer } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

type Article = {
  id: string;
  slug: string;
  title: string;
  date: string;
  description: string;
  image: string;
  imageAlt: string;
  body: string[];
  images: string[];
};

async function getArticle(slug: string): Promise<Article | null> {
  const { data, error } = await supabaseServer
    .from("community_articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) return null;
  return data as Article;
}

async function getAdjacentArticles(currentSlug: string) {
  const { data } = await supabaseServer
    .from("community_articles")
    .select("slug, title")
    .eq("published", true)
    .order("order", { ascending: true });

  if (!data) return { prev: null, next: null };
  const idx = data.findIndex((a) => a.slug === currentSlug);
  return {
    // Left arrow (prev) = newer article, right arrow (next) = older article.
    // List is sorted newest-first, so the newer item is at idx-1.
    prev: idx > 0 ? data[idx - 1] : null,
    next: idx < data.length - 1 ? data[idx + 1] : null,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} | Roomchang Dental Hospital`,
    description: article.description,
  };
}

export default async function CommunityArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, adjacent] = await Promise.all([
    getArticle(slug),
    getAdjacentArticles(slug),
  ]);

  if (!article) notFound();

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about/community"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} weight="bold" aria-hidden="true" /> Community & Charity
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--brand)]">
            {article.date}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-[color:var(--text-main)] sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            {article.description}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 space-y-12">

        {/* Hero image */}
        {article.image && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(57,28,45,0.10)]">
            <Image
              src={article.image}
              alt={article.imageAlt || article.title}
              fill
              className="object-cover"
              sizes="(min-width: 896px) 864px, 100vw"
              priority
              unoptimized
            />
          </div>
        )}

        {/* Body */}
        {article.body && article.body.length > 0 && (
          <div className="space-y-5">
            {article.body.map((paragraph, i) => (
              <p key={i} className="text-base leading-8 text-[color:var(--text-soft)]">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Image gallery */}
        {article.images && article.images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {article.images.map((src, i) => (
              <div
                key={src}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[color:var(--surface)] shadow-[0_8px_24px_rgba(57,28,45,0.06)]"
              >
                <Image
                  src={src}
                  alt={`${article.title} — photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 640px) 33vw, 50vw"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}

        {/* Prev / Next navigation */}
        <div className="border-t border-[color:var(--border-strong)] pt-10 flex flex-col gap-4 sm:flex-row sm:justify-between">
          {adjacent.prev ? (
            <Link
              href={`/about/community/${adjacent.prev.slug}`}
              className="group flex items-center gap-3 text-sm font-semibold text-[color:var(--text-soft)] hover:text-[color:var(--brand-deep)] transition"
            >
              <ArrowLeft size={16} weight="bold" className="shrink-0" aria-hidden="true" />
              <span className="line-clamp-2">{adjacent.prev.title}</span>
            </Link>
          ) : <div />}
          {adjacent.next && (
            <Link
              href={`/about/community/${adjacent.next.slug}`}
              className="group flex items-center gap-3 text-sm font-semibold text-[color:var(--text-soft)] hover:text-[color:var(--brand-deep)] transition sm:text-right"
            >
              <span className="line-clamp-2">{adjacent.next.title}</span>
              <ArrowRight size={16} weight="bold" className="shrink-0" aria-hidden="true" />
            </Link>
          )}
        </div>

      </div>
    </SiteShell>
  );
}
