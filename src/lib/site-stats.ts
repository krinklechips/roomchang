type DisplayStat = { display_value: string; label: string };

export function resolveSiteStat(
  row: { display_value?: string | null; numeric_value?: number | null; suffix?: string | null; label?: string | null } | undefined,
  fallback: DisplayStat,
  preferContentLabel = true,
): DisplayStat {
  const numericDisplay = typeof row?.numeric_value === "number" && Number.isFinite(row.numeric_value)
    ? `${row.numeric_value.toLocaleString("en-US")}${row.suffix ?? ""}`
    : fallback.display_value;
  return {
    display_value: row?.display_value?.trim() ? row.display_value : numericDisplay,
    label: preferContentLabel && row?.label?.trim() ? row.label : fallback.label,
  };
}
