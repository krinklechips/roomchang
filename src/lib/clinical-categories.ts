/**
 * Clinical-results categories as real, indexable landing pages.
 *
 * Each entry maps a URL `slug` (used at /clinical-results/category/<slug>) to the
 * `category` value stored on clinical cases, the legacy gallery `hashKey`
 * (/clinical-results#<hashKey>, kept working as a fallback), and SEO copy.
 *
 * Category pages live under /clinical-results/category/<slug> rather than
 * /clinical-results/<slug> because the latter is already the individual case
 * route (/clinical-results/[slug]).
 */
export type ClinicalCategory = {
  slug: string;
  category: string; // must match ClinicalCase.category exactly
  hashKey: string; // legacy gallery hash
  label: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
};

export const CLINICAL_CATEGORIES: ClinicalCategory[] = [
  {
    slug: "full-mouth-reconstruction",
    category: "Full Mouth",
    hashKey: "full-mouth",
    label: "Full Mouth Reconstruction",
    metaTitle: "Full Mouth Reconstruction — Before & After | Roomchang Dental Hospital",
    metaDescription:
      "Real full-mouth rehabilitation cases at Roomchang Dental Hospital — restoring full-arch function and aesthetics with implants, crowns, and bridges. See before & after results.",
    intro:
      "Full-arch rehabilitation that rebuilds function and aesthetics — combining implants, crowns, and bridges to restore a complete, confident smile.",
  },
  {
    slug: "implants-and-crowns",
    category: "Implants & Crowns",
    hashKey: "implants",
    label: "Dental Implants & Crowns",
    metaTitle: "Dental Implants & Crowns — Before & After Cases | Roomchang Dental Hospital",
    metaDescription:
      "Dental implant and crown cases at Roomchang Dental Hospital in Phnom Penh — replacing missing teeth and restoring damaged ones with natural-looking, durable results.",
    intro:
      "Replacing missing teeth and restoring damaged ones with titanium implants and precision-crafted crowns for natural-looking, long-lasting results.",
  },
  {
    slug: "implant-bridges",
    category: "Implant Bridges",
    hashKey: "bridges",
    label: "Implant Bridges",
    metaTitle: "Implant Bridges — Before & After Cases | Roomchang Dental Hospital",
    metaDescription:
      "Implant-supported bridge cases at Roomchang Dental Hospital — replacing several missing teeth in a row with a stable, fixed solution. See real before & after results.",
    intro:
      "Replacing several missing teeth in a row with a fixed, implant-supported bridge — stable, comfortable, and built to last.",
  },
  {
    slug: "orthodontics",
    category: "Orthodontics",
    hashKey: "orthodontics",
    label: "Orthodontics",
    metaTitle: "Orthodontics — Before & After Cases | Roomchang Dental Hospital",
    metaDescription:
      "Orthodontic treatment cases at Roomchang Dental Hospital — braces and clear aligners that straighten teeth and correct bites. See real patient before & after results.",
    intro:
      "Straightening teeth and correcting bites with braces and clear aligners — for healthier function and a confident, even smile.",
  },
  {
    slug: "cosmetic-and-emax",
    category: "Cosmetic & E-Max",
    hashKey: "cosmetic",
    label: "Cosmetic Dentistry & E-Max",
    metaTitle: "Cosmetic Dentistry & E-Max Veneers — Before & After | Roomchang Dental Hospital",
    metaDescription:
      "Cosmetic dentistry and E-Max veneer cases at Roomchang Dental Hospital — reshaping, whitening, and perfecting smiles with minimal, natural-looking enhancements.",
    intro:
      "Reshaping and perfecting smiles with E-Max veneers and cosmetic treatments — subtle, natural-looking enhancements that brighten your smile.",
  },
];

export function getClinicalCategoryBySlug(slug: string): ClinicalCategory | undefined {
  return CLINICAL_CATEGORIES.find((c) => c.slug === slug);
}
