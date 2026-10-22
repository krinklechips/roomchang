// Comparison aliases from published EN/KH/CN doctor language arrays. Keep the
// original editorial labels for display; unknown labels have no inferred identity.
const aliases = [
  ["Khmer", "ភាសាខ្មែរ", "高棉语"],
  ["English", "ភាសាអង់គ្លេស", "英语"],
  ["Mandarin", "ភាសាចិនកុកងឺ", "普通话"],
  ["Japanese", "ភាសាជប៉ុន", "日语"],
  ["German", "ភាសាអាល្លឺម៉ង់", "德语"],
  ["French", "ភាសាបារាំង", "法语"],
];

const normalize = (label: string) => label.trim().normalize("NFC").toLowerCase();
const identities = new Map(aliases.flatMap(([identity, ...labels]) =>
  [identity, ...labels].map((label) => [normalize(label), identity] as const)
));

export function matchesDoctorLanguage(languages: readonly string[], selected: string): boolean {
  const identity = identities.get(normalize(selected));
  return identity !== undefined && languages.some((label) => identities.get(normalize(label)) === identity);
}
