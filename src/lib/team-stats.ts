import { resolveSiteStat } from './site-stats';

type Row = { key: string; display_value?: string | null; numeric_value?: number | null; suffix?: string | null; label?: string | null };

export const TEAM_STAT_KEYS = ['specialist_dentists', 'years_experience', 'branches_count'] as const;

export function teamTrustStats(rows: Row[], doctors: { languages: string[] }[], labels: { doctors: string; languages: string; years: string; branches: string }, preferContentLabel: boolean) {
  const stat = (key: string, value: string, label: string) => {
    const resolved = resolveSiteStat(rows.find((r) => r.key === key), { display_value: value, label }, preferContentLabel);
    return { value: resolved.display_value, label: resolved.label };
  };
  const languages = new Set(doctors.flatMap((d) => d.languages).map((language) => {
    const normalized = language.trim().toLowerCase();
    return normalized === 'mandarin' ? 'chinese' : normalized;
  }).filter(Boolean));
  return [
    stat('specialist_dentists', String(doctors.length), labels.doctors),
    { value: String(languages.size), label: labels.languages },
    stat('years_experience', '', labels.years),
    stat('branches_count', '', labels.branches),
  ];
}
