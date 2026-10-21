import type { StatItem } from "./home-stats";

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
  display_value?: string | null;
  original_display_value?: string | null;
};

export const HOMEPAGE_STATS_FALLBACK = [
  { numeric_value: 30, suffix: " yrs", label: "Years of Experience" },
  { numeric_value: 37, suffix: "+", label: "Specialist Dentists" },
  { numeric_value: 5, suffix: "", label: "Phnom Penh Branches" },
  { numeric_value: 100000, suffix: "+", label: "Patients Treated" },
];

function isCompleteStat(row: HomeStatRow | undefined): row is HomeStatRow {
  return Boolean(row) && Boolean(row?.display_value?.trim() || (
    typeof row?.numeric_value === "number" && Number.isFinite(row.numeric_value)
  ));
}

export function getHomepageStats(rows: HomeStatRow[] | null | undefined, fallbackLabels?: Record<string, string>): StatItem[] {
  const fallback = HOMEPAGE_STATS_FALLBACK.map((stat, index) => ({
    ...stat,
    label: fallbackLabels?.[HOMEPAGE_STAT_KEYS[index]] ?? stat.label,
  }));
  if (!rows?.length) return fallback;

  const byKey = new Map(rows.map((row) => [row.key, row]));
  const orderedRows = HOMEPAGE_STAT_KEYS.map((key) => byKey.get(key));
  // Retain numeric-only fallbacks without discarding another row's explicit CMS text.
  if (!orderedRows.every(isCompleteStat) && !orderedRows.some((row) => row?.display_value?.trim())) return fallback;

  return orderedRows.map((row, index) => {
    if (!isCompleteStat(row)) return fallback[index];
    return {
      numeric_value: typeof row.numeric_value === "number" && Number.isFinite(row.numeric_value) ? row.numeric_value : 0,
      suffix: row.suffix ?? "",
      label: row.label?.trim() ? row.label : fallback[index].label,
      ...(row.display_value?.trim()
        ? { display_value: row.display_value }
        : {}),
    };
  });
}
