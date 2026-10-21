import { afterEach, describe, expect, it, vi } from 'vitest';
import { getPublishedPayloadPaths } from './payload-discovery';

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
describe('public CMS discovery', () => {
  it('uses the same canonical branch identity as the page, including slugless records', async () => {
    vi.stubEnv('PAYLOAD_API_URL', 'https://cms.example');
    vi.stubGlobal('fetch', vi.fn(async (input: string) => ({
      ok: true,
      json: async () => ({ docs: new URL(input).pathname.endsWith('/branches') ? [
        { id: 3, sourceId: 'fa9eb854-e2e5-4086-b879-47d80d26200c', slug: 'roomchang-dental-clinic-aeon-mall-sen-sok-city-branch' },
        { id: 4, sourceId: '74b77631-3bd3-4bf4-bc0d-400bc4dab254', slug: null },
        { id: 5, sourceId: 'new-branch-source', slug: 'new-location' },
        { id: 6, sourceId: 'slugless-source', slug: null },
      ] : [], hasNextPage: false }),
    })));
    const paths = await getPublishedPayloadPaths();
    expect(paths).toContain('/about/branches/aeon-mall');
    expect(paths).toContain('/about/branches/fun-mall');
    expect(paths).toContain('/about/branches/new-location');
    expect(paths).toContain('/about/branches/slugless-source');
    expect(paths).not.toContain('/about/branches/roomchang-dental-clinic-aeon-mall-sen-sok-city-branch');
  });
  it('preserves Next.js static-to-dynamic rendering signals', async () => {
    const bailout = Object.assign(new Error('Dynamic rendering required'), { digest: 'DYNAMIC_SERVER_USAGE' });
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(bailout));
    await expect(getPublishedPayloadPaths()).rejects.toBe(bailout);
  });
  it('includes CMS custom and detail pages without draft credentials', async () => {
    vi.stubEnv('PAYLOAD_API_URL', 'https://cms.example');
    const request = vi.fn(async (input: string, init: RequestInit) => {
      const url = new URL(input);
      expect(url.searchParams.get('where[_status][equals]')).toBe('published');
      expect(url.searchParams.get('draft')).not.toBe('true');
      expect(init.headers).toBeUndefined();
      const slug = url.pathname.endsWith('/pages') ? 'patient-information' : url.pathname.endsWith('/services') ? 'implants' : undefined;
      return { ok: true, json: async () => ({ docs: slug ? [{ slug }] : [], hasNextPage: false }) };
    });
    vi.stubGlobal('fetch', request);
    const paths = await getPublishedPayloadPaths();
    expect(paths).toContain('/patient-information');
    expect(paths).toContain('/services/implants');
  });
  it('fetches further pages and rejects unsafe slugs', async () => {
    vi.stubEnv('PAYLOAD_API_URL', 'https://cms.example');
    vi.stubGlobal('fetch', vi.fn(async (input: string) => {
      const url = new URL(input);
      const isPages = url.pathname.endsWith('/pages');
      const page = url.searchParams.get('page');
      return { ok: true, json: async () => ({ docs: !isPages ? [] : page === '1' ? [{ slug: 'first' }, { slug: '../admin' }] : [{ slug: 'second' }], hasNextPage: isPages && page === '1' }) };
    }));
    const paths = await getPublishedPayloadPaths();
    expect(paths).toContain('/first');
    expect(paths).toContain('/second');
    expect(paths.some((p) => p.includes('..'))).toBe(false);
  });
  it('surfaces dependency failures instead of publishing a misleading sitemap', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(getPublishedPayloadPaths()).rejects.toThrow(/CMS|content|unavailable/i);
  });
});
