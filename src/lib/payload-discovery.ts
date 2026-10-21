import 'server-only';
import { unstable_rethrow } from 'next/navigation';
import { CmsContentError } from './cms-content-error';
import { matchStaticBranch } from './branches';

const ROUTES: Record<string, string> = {
  services: '/services/', technology: '/technology/', 'clinical-cases': '/clinical-results/',
  pages: '/', branches: '/about/branches/', 'news-articles': '/about/news/',
  'community-articles': '/about/community/', 'career-positions': '/about/careers/',
};

/** Always anonymous and published-only, even if the requesting browser is in draft mode. */
export async function getPublishedPayloadPaths(): Promise<string[]> {
  const groups = await Promise.all(Object.entries(ROUTES).map(async ([collection, prefix]) => {
    const paths: string[] = [];
    for (let page = 1; page <= 100; page++) {
      const qs = new URLSearchParams({ locale: 'en', limit: '200', page: String(page), depth: '0', 'where[_status][equals]': 'published', 'select[slug]': 'true' });
      if (collection === 'branches') qs.set('select[sourceId]', 'true');
      try {
        const res = await fetch(`${process.env.PAYLOAD_API_URL || 'http://localhost:3100'}/api/${collection}?${qs}`, { cache: 'no-store', signal: AbortSignal.timeout(15000) });
        if (!res.ok) throw new CmsContentError(collection, res.status);
        const json = await res.json() as { docs?: { id?: unknown; sourceId?: unknown; slug?: unknown }[]; hasNextPage?: boolean };
        if (!Array.isArray(json.docs)) throw new CmsContentError(collection);
        for (const doc of json.docs) {
          let slug = doc.slug;
          if (collection === 'branches') {
            const id = typeof doc.sourceId === 'string' && doc.sourceId ? doc.sourceId : String(doc.id ?? '');
            const branchSlug = typeof slug === 'string' ? slug.trim() : undefined;
            slug = matchStaticBranch({ id, slug: branchSlug, name: '' })?.slug || branchSlug || id;
          }
          if (typeof slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) paths.push(prefix + slug);
        }
        if (!json.hasNextPage) return paths;
      } catch (error) {
        unstable_rethrow(error);
        if (error instanceof CmsContentError) throw error;
        throw new CmsContentError(collection);
      }
    }
    throw new CmsContentError(collection);
  }));
  return [...new Set(groups.flat())];
}
