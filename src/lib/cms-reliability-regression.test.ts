import { afterEach, describe, expect, it, vi } from 'vitest';
vi.mock('next-intl/server', () => ({ getLocale: async () => 'kh' }));
vi.mock('next/headers', () => ({ draftMode: async () => ({ isEnabled: false }) }));

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.resetModules(); });
describe('CMS failure handling', () => {
  it('preserves Next.js dynamic-render control flow', async () => {
    const bailout = Object.assign(new Error('Dynamic rendering required'), { digest: 'DYNAMIC_SERVER_USAGE' });
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(bailout));
    const { getPayloadSiteStats } = await import('./payload-source');
    await expect(getPayloadSiteStats()).rejects.toBe(bailout);
  });
  it('does not turn a failed CMS read into a valid empty collection', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    const { getPayloadSiteStats } = await import('./payload-source');
    await expect(getPayloadSiteStats()).rejects.toThrow(/CMS|content|unavailable/i);
  });
  it('distinguishes invalid CMS responses from a valid empty collection', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ error: 'unexpected' }) }));
    const { getPayloadSiteStats } = await import('./payload-source');
    await expect(getPayloadSiteStats()).rejects.toThrow(/CMS|content|invalid/i);
  });
  it('still supports a legitimately empty published collection', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ docs: [] }) }));
    const { getPayloadSiteStats } = await import('./payload-source');
    await expect(getPayloadSiteStats()).resolves.toEqual([]);
  });
});
