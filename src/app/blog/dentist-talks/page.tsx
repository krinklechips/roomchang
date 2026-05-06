import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/components/site/site-shell";
import { getBlogPosts } from "@/lib/data";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Dentist Talks | Roomchang Dental Hospital",
  description:
    "Educational articles and expert insights from Roomchang's specialist dentists.",
};

export default async function DentistTalksPage() {
  const posts = await getBlogPosts("dentist-talks");

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> Education Blog
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            Dentist Talks
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            Educational articles and practical advice from our specialist dental team.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-[color:var(--border-strong)] bg-white p-12 text-center">
            <p className="font-display text-2xl text-[color:var(--text-main)]">Coming Soon</p>
            <p className="mt-3 text-sm text-[color:var(--text-soft)]">
              Our dentists are preparing educational articles. Check back soon for expert insights on dental health.
            </p>
            <Link href="/blog" className="btn-secondary mt-6 inline-block">Back to Blog</Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/dentist-talks/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-[color:var(--border-strong)] bg-white overflow-hidden shadow-[0_8px_24px_rgba(57,28,45,0.05)] transition hover:shadow-[0_16px_48px_rgba(204,55,113,0.1)]"
              >
                {post.cover_image && (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="font-display text-xl text-[color:var(--text-main)] group-hover:text-[color:var(--brand-deep)]">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 flex-1 text-sm leading-6 text-[color:var(--text-soft)]">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    {post.author_name && (
                      <span className="text-xs font-medium text-[color:var(--text-soft)]">
                        By {post.author_name}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--brand-deep)]">
                      Read <ArrowRight size={13} strokeWidth={2} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
