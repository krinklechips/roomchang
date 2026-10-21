import { afterEach, describe, expect, it, vi } from 'vitest';
vi.mock('@/lib/mailer', () => ({ verifySmtp: async () => ({ ok: true }) }));
vi.mock('@/lib/supabase-admin', () => ({ supabaseAdmin: { from: () => ({ select: () => ({ gte: async () => ({ error: null, count: 0 }) }) }) } }));
afterEach(() => { vi.resetModules(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
describe('selected content dependency health', () => {
  it('does not report healthy when only the CMS dependency fails', async () => {
    vi.stubEnv('CONTENT_SOURCE', 'payload');
    vi.stubEnv('PAYLOAD_API_URL', 'https://cms.example');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    const { checkSiteHealth } = await import('./health');
    const health = await checkSiteHealth();
    expect(health.ok).toBe(false);
    expect(health.db.ok).toBe(true);
    expect(health.content).toMatchObject({ source: 'payload', ok: false });
  });
  it('checks anonymous CMS content without draft credentials', async () => {
    vi.stubEnv('CONTENT_SOURCE', 'payload');
    vi.stubEnv('PAYLOAD_API_URL', 'https://cms.example');
    const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ docs: [] }) });
    vi.stubGlobal('fetch', fetcher);
    const { checkSiteHealth } = await import('./health');
    expect(await checkSiteHealth()).toMatchObject({ ok: true, content: { source: 'payload', ok: true } });
    expect(fetcher.mock.calls[0][1].headers).toBeUndefined();
  });
  it('does not add CMS calls to the existing production Supabase source', async () => {
    vi.stubEnv('CONTENT_SOURCE', 'supabase');
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    const { checkSiteHealth } = await import('./health');
    expect(await checkSiteHealth()).toMatchObject({ ok: true, content: { source: 'supabase', ok: true } });
    expect(fetcher).not.toHaveBeenCalled();
  });
});
