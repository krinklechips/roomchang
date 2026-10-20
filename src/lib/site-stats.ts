type DisplayStat = { display_value: string; label: string };

export function resolveSiteStat(
  row: { display_value?: string | null; label?: string | null } | undefined,
  fallback: DisplayStat,
  preferContentLabel = true,
): DisplayStat {
  return {
    display_value: row?.display_value?.trim() ? row.display_value : fallback.display_value,
    label: preferContentLabel && row?.label?.trim() ? row.label : fallback.label,
  };
}
