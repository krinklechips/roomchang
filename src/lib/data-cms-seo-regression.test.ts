import { afterEach, describe, expect, it, vi } from 'vitest';
const cmsPage = vi.hoisted(() => vi.fn());
const legacy = vi.hoisted(() => vi.fn(() => { throw new Error('CMS mode must not read legacy SEO overrides'); }));
vi.mock('./supabase', () => ({ supabase: {} }));
vi.mock('./supabase-server', () => ({ supabaseServer: { from: legacy } }));
vi.mock('./payload-source', () => ({ isPayloadSource: () => true, getPayloadCmsPage: cmsPage }));
afterEach(() => { vi.clearAllMocks(); });

describe('CMS-selected SEO metadata', () => {
  it('uses the custom page SEO fields in the active CMS source', async () => {
    cmsPage.mockResolvedValue({ title: 'Page', slug: 'patient-information', seoTitle: 'CMS title', seoDescription: 'CMS description', seoImage: 'https://assets.example/image.png' });
    const { getSeoPageMeta } = await import('./data');
    expect(await getSeoPageMeta('/patient-information')).toMatchObject({ title: 'CMS title', description: 'CMS description', ogImage: 'https://assets.example/image.png' });
    expect(legacy).not.toHaveBeenCalled();
  });
  it('leaves collection metadata to CMS-derived page defaults rather than old Supabase overrides', async () => {
    const { getSeoPageMeta } = await import('./data');
    expect(await getSeoPageMeta('/services/implants')).toBeNull();
    expect(legacy).not.toHaveBeenCalled();
  });
});
