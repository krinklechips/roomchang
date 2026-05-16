export const HOMEPAGE_STAT_KEYS = [
  "years_experience",
  "specialist_dentists",
  "branches_count",
  "patients_treated",
] as const;

export type HomeStatRow = {
  key: string;
  numeric_value: number | null;
  suffix: string | null;
  label: string;
};

export const HOMEPAGE_STATS_FALLBACK = [
  { numeric_value: 30, suffix: " yrs", label: "Years of Experience" },
  { numeric_value: 37, suffix: "+", label: "Specialist Dentists" },
  { numeric_value: 5, suffix: "", label: "Phnom Penh Branches" },
  { numeric_value: 100000, suffix: "+", label: "Patients Treated" },
];

function isCompleteStat(row: HomeStatRow | undefined): row is HomeStatRow & { numeric_value: number } {
  return Boolean(row) && row?.numeric_value !== null;
}

export function getHomepageStats(rows: HomeStatRow[] | null | undefined) {
  if (!rows?.length) return HOMEPAGE_STATS_FALLBACK;

  const byKey = new Map(rows.map((row) => [row.key, row]));
  const stats = HOMEPAGE_STAT_KEYS
    .map((key) => byKey.get(key))
    .filter(isCompleteStat)
    .map((row) => ({
      numeric_value: row.numeric_value,
      suffix: row.suffix ?? "",
      label: row.label,
    }));

  return stats.length === HOMEPAGE_STAT_KEYS.length ? stats : HOMEPAGE_STATS_FALLBACK;
}
