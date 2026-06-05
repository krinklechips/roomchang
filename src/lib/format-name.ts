/**
 * Abbreviate a person's surname to an initial for public display.
 * "Aliza Tithphit" → "Aliza T." · "Sarah Mitchell" → "Sarah M."
 * Single-word names are returned unchanged.
 */
export function abbreviateName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return name.trim();
  const first = parts[0];
  const surnameInitial = parts[parts.length - 1][0]?.toUpperCase() ?? "";
  return surnameInitial ? `${first} ${surnameInitial}.` : first;
}
