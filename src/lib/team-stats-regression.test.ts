import { describe, it, expect } from 'vitest';
import { teamTrustStats } from './team-stats';

const labels = { doctors: 'Doctors', languages: 'Languages', years: 'Years', branches: 'Branches' };
describe('CMS Team statistics', () => {
  it('uses exact shared CMS display text rather than hardcoded facts', () => {
    const stats = teamTrustStats([
      { key: 'specialist_dentists', display_value: '42+', label: 'Specialists' },
      { key: 'years_experience', display_value: '30 \u5e74' },
      { key: 'branches_count', display_value: '7' },
    ], [{ languages: ['English', 'Khmer'] }], labels, true);
    expect(stats.map((s) => s.value)).toEqual(['42+', '2', '30 \u5e74', '7']);
    expect(stats[0].label).toBe('Specialists');
  });
  it('derives language coverage from doctors, normalizing duplicate Mandarin/Chinese names', () => {
    const stats = teamTrustStats([], [{ languages: ['English', 'Mandarin'] }, { languages: [' english ', 'Chinese', 'Khmer', ''] }], labels, false);
    expect(stats[1].value).toBe('3');
    expect(stats[0].value).toBe('2');
  });
});
