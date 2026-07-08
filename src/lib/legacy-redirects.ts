import { supabaseServer } from "./supabase-server";
import {
  getPayloadCommunityArticleBySlug,
  getPayloadNewsArticleBySlug,
  isPayloadSource,
} from "./payload-source";

// Old WordPress URLs whose slug does NOT 1:1 match a current article slug,
// mapped to their new home (locale-relative path). Extend this from the old
// site's sitemap / Google Search Console "Pages" export.
const MANUAL_REDIRECTS: Record<string, string> = {
  // Branch-announcement posts → the branch page:
  "aeon-mall-sen-sok-city-branch": "/about/branches/aeon-mall",
};

/**
 * Resolve an old (WordPress) URL — given its path segments AFTER the locale — to
 * a current page, for a 301/308 redirect that preserves SEO. Returns a
 * locale-relative path (e.g. "/about/news/iso-9001-2015-awarded") or null when
 * there's no confident match (the caller then 404s).
 *
 * Only an EXACT slug match redirects — never a guess. Handles legacy patterns
 * like /2019/01/21/<slug>, /m/2019/01/21/<slug>, /category/<slug>, and bare
 * /<slug> by matching the final path segment against published news/community
 * articles (whose slugs were preserved in the migration) + the manual map above.
 */
export async function resolveLegacyPath(segments: string[]): Promise<string | null> {
  const slug = segments
    .filter(Boolean)
    .pop()
    ?.toLowerCase()
    .replace(/\.(html?|php)$/, ""); // tolerate old .html/.php suffixes
  if (!slug || slug.length > 120 || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) return null;

  if (MANUAL_REDIRECTS[slug]) return MANUAL_REDIRECTS[slug];

  if (isPayloadSource()) {
    const [news, community] = await Promise.all([
      getPayloadNewsArticleBySlug(slug),
      getPayloadCommunityArticleBySlug(slug),
    ]);
    if (news) return `/about/news/${slug}`;
    if (community) return `/about/community/${slug}`;
    return null;
  }

  const [news, community] = await Promise.all([
    supabaseServer
      .from("news_articles")
      .select("slug")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle(),
    supabaseServer
      .from("community_articles")
      .select("slug")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle(),
  ]);

  if (news.data) return `/about/news/${slug}`;
  if (community.data) return `/about/community/${slug}`;
  return null;
}
