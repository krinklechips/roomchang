/**
 * CMS API client for Roomchang.
 *
 * The CMS (cms-platform) is a separate service. Its public API serves page
 * blocks and other tenant content without authentication.
 *
 * Required environment variables:
 *   CMS_API_URL        - Base URL of the cms-platform server, e.g. https://cms.serviette.io
 *   CMS_TENANT_SLUG    - Tenant identifier, default "roomchang"
 *
 * Public API shape:
 *   GET /api/public/pages/:slug?tenantSlug=roomchang
 *   → { item: CmsPage | null }
 */

export interface CmsBlock {
  id: number
  blockType: string
  blockData: Record<string, unknown>
  sortOrder: number
}

export interface CmsPage {
  id: number
  slug: string
  title: string
  status: string
  template: string
  seoTitle: string | null
  seoDescription: string | null
  seoImage: string | null
  blocks: CmsBlock[]
}

const CMS_API_URL = process.env.CMS_API_URL?.replace(/\/$/, '') ?? ''
const CMS_TENANT_SLUG = process.env.CMS_TENANT_SLUG ?? 'roomchang'

/**
 * Fetch a CMS page by its slug.
 * Returns null when the page does not exist or the CMS is not configured.
 * Throws visibly on network/server errors — never silently swallows them.
 */
export async function getCmsPage(slug: string): Promise<CmsPage | null> {
  if (!CMS_API_URL) {
    // CMS not connected — return null so the catch-all 404s cleanly.
    return null
  }

  const url = `${CMS_API_URL}/api/public/pages/${encodeURIComponent(slug)}?tenantSlug=${CMS_TENANT_SLUG}`
  const res = await fetch(url, {
    next: { revalidate: 60 }, // ISR: revalidate every 60 s
  })

  if (res.status === 404) return null

  if (!res.ok) {
    // Fail loudly — don't fall back to a blank page.
    throw new Error(
      `CMS API error ${res.status} for page "${slug}" (${url})`,
    )
  }

  const json = await res.json()
  const page = json?.item ?? null
  if (!page) return null

  // Only serve published pages on the live site.
  if (page.status !== 'published') return null

  return page as CmsPage
}
