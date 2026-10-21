import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TeamPage from '@/app/[locale]/team/page';

vi.mock('@/components/site/site-shell', () => ({ SiteShell: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock('@/components/sections/doctor-grid', () => ({ DoctorGrid: () => null }));
vi.mock('@/lib/data', () => ({ getDoctors: async () => [{ languages: ['English', 'Khmer'] }] }));
vi.mock('@/lib/supabase-server', () => ({ supabaseServer: { from: () => { throw new Error('CMS mode must not read Supabase statistics'); } } }));
vi.mock('@/lib/payload-source', () => ({
  isPayloadSource: () => true,
  getPayloadSiteStats: async () => [
    { key: 'specialist_dentists', display_value: '42+' },
    { key: 'years_experience', display_value: '30 \u5e74' },
    { key: 'branches_count', display_value: '7' },
  ],
}));
vi.mock('next-intl/server', () => ({ getTranslations: async () => (key: string) => key, setRequestLocale: () => {} }));

describe('Team page CMS connection', () => {
  it('renders current CMS statistics and language coverage instead of fixed numbers', async () => {
    render(await TeamPage({ params: Promise.resolve({ locale: 'cn' }) }));
    expect(screen.getByText('42+')).toBeInTheDocument();
    expect(screen.getByText('30 \u5e74')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
