import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import en from '../../../messages/en.json';
import kh from '../../../messages/km.json';
import cn from '../../../messages/zh.json';

const source = vi.hoisted(() => ({ isPayloadSource: vi.fn(), getPayloadHomeServices: vi.fn() }));
let locale: 'en' | 'kh' | 'cn' = 'en';
const messages = { en, kh, cn };
vi.mock('@/lib/payload-source', () => source);
vi.mock('next-intl/server', () => ({ getTranslations: async () => (key: string) => messages[locale].homeServices[key as keyof typeof en.homeServices] }));
vi.mock('@/i18n/navigation', () => ({ Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a href={href} {...props}>{children}</a> }));
import { HomeServices } from './home-services';

beforeEach(() => { source.isPayloadSource.mockReturnValue(true); source.getPayloadHomeServices.mockResolvedValue(null); });
afterEach(() => { cleanup(); vi.clearAllMocks(); });
const keys = ['eyebrow', 'heading', 'seeAll', 'implants', 'crowns', 'aligners', 'cosmetic', 'whitening', 'surgery'] as const;
const links = ['/services', '/services/dental-implants', '/services/dental-crowns', '/services/orthodontics', '/services/cosmetic-dentistry', '/services/teeth-whitening', '/services/oral-surgery'];

describe('Home Services section', () => {
  it.each(['en', 'kh', 'cn'] as const)('renders all nine CMS text values in %s with unchanged shortcut destinations', async language => {
    locale = language;
    const doc = Object.fromEntries(keys.map(key => [key, `${language} CMS ${key}`]));
    source.getPayloadHomeServices.mockResolvedValue(doc);
    render(await HomeServices());
    for (const key of keys) expect(screen.getByText(doc[key])).toBeInTheDocument();
    expect(screen.getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(links);
    expect(source.getPayloadHomeServices).toHaveBeenCalledTimes(1);
  });
  it.each(['en', 'kh', 'cn'] as const)('preserves the current %s copy when the new record is absent', async language => {
    locale = language;
    render(await HomeServices());
    for (const key of keys) expect(screen.getByText(messages[language].homeServices[key])).toBeInTheDocument();
  });
  it('does not change production-source rendering or call the CMS outside Payload mode', async () => {
    locale = 'en'; source.isPayloadSource.mockReturnValue(false);
    source.getPayloadHomeServices.mockResolvedValue({ heading: 'Must not leak' });
    render(await HomeServices());
    expect(screen.getByRole('heading', { name: en.homeServices.heading })).toBeInTheDocument();
    expect(source.getPayloadHomeServices).not.toHaveBeenCalled();
  });
  it('does not replace intentionally empty text with another language or bundled copy', async () => {
    locale = 'kh'; source.getPayloadHomeServices.mockResolvedValue({ eyebrow: '', heading: 'Selected Khmer heading' });
    render(await HomeServices());
    expect(screen.queryByText(kh.homeServices.eyebrow)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Selected Khmer heading' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: kh.homeServices.seeAll })).toBeInTheDocument();
  });
  it('surfaces a configured CMS failure instead of claiming the newly edited text was published', async () => {
    source.getPayloadHomeServices.mockRejectedValue(new Error('CMS unavailable'));
    await expect(HomeServices()).rejects.toThrow('CMS unavailable');
  });
});
