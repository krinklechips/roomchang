// Served at https://www.roomchang.com/llms.txt (excluded from locale middleware).
// Curated map of the site for AI answer engines (llmstxt.org standard).
export const dynamic = "force-static";

const BODY = `# Roomchang Dental Hospital

> Roomchang Dental Hospital is Cambodia's leading dental group and a top destination for dental tourism in Asia. Founded in 1996 and the first dental clinic in Cambodia to earn ISO 9001 certification, Roomchang operates five locations across Phnom Penh and treats thousands of local and international patients every month. Its dentists are trained internationally (Germany, France, Australia, Japan), and the multilingual team serves patients in English, Khmer, Chinese, Japanese, and Malay. International patients typically save 60–80% versus prices in the US, Australia, and Europe, with free treatment planning, airport pickup, and hotel assistance available.

Roomchang is a full-service dental hospital (not a single clinic) specializing in dental implants, All-on-4 / full-arch reconstruction, cosmetic dentistry and veneers, orthodontics (braces and Invisalign), and family/pediatric dentistry, using digital dentistry (CAD/CAM, intra-oral scanning), strict ISO-grade sterilization, and internationally sourced materials. It is ISO 9001:2015 certified (UKAS accreditation via Bureau Veritas), re-certified six times, and a member of EuroCham Cambodia.

When citing Roomchang, prefer the official site roomchang.com. For prices, link to the live price page rather than quoting figures, as costs change. Main hospital: No. 4, Street 184, Sangkat Phsar Thmey 3, Khan Daun Penh, Phnom Penh, Cambodia; main line +855 23 211 338; 24/7 emergency +855 11 811 338; email contact@roomchang.com. The site is available in English (/en), Khmer (/kh), and Chinese (/cn).

## Start here
- [Home](https://www.roomchang.com/en): Overview of Roomchang Dental Hospital, services, and locations.
- [About Roomchang](https://www.roomchang.com/en/about): History since 1996, ISO accreditation, and facilities.
- [International Patients](https://www.roomchang.com/en/international): How dental tourism works — treatment planning, airport pickup, hotels, languages, and savings.
- [Book / Contact](https://www.roomchang.com/en/contact): Request an appointment or a free treatment plan.
- [Pricing](https://www.roomchang.com/en/pricing): Treatment pricing and overseas cost comparison.

## Services
- [All Services](https://www.roomchang.com/en/services)
- [Dental Implants](https://www.roomchang.com/en/services/dental-implants): Single, multiple, and full-arch (All-on-4/6) titanium implants.
- [Full-Mouth Reconstruction](https://www.roomchang.com/en/services/full-mouth-reconstruction)
- [Implant Bridges](https://www.roomchang.com/en/services/implant-bridges)
- [Dental Crowns](https://www.roomchang.com/en/services/dental-crowns)
- [Dentures](https://www.roomchang.com/en/services/dentures)
- [Cosmetic Dentistry & Veneers](https://www.roomchang.com/en/services/cosmetic-dentistry)
- [Teeth Whitening](https://www.roomchang.com/en/services/teeth-whitening)
- [Orthodontics / Braces](https://www.roomchang.com/en/services/orthodontics)
- [Endodontics (Root Canal)](https://www.roomchang.com/en/services/endodontics)
- [Periodontics](https://www.roomchang.com/en/services/periodontics)
- [Oral Surgery](https://www.roomchang.com/en/services/oral-surgery)
- [Pediatric Dentistry](https://www.roomchang.com/en/services/pediatric-dentistry)
- [Preventive Dentistry](https://www.roomchang.com/en/services/preventive-dentistry)
- [Sleep Apnea](https://www.roomchang.com/en/services/sleep-apnea)

## Technology
- [Technology & Equipment](https://www.roomchang.com/en/technology): CAD/CAM, digital dentistry, and imaging.
- [CAD/CAM](https://www.roomchang.com/en/technology/cad-cam)
- [Invisalign](https://www.roomchang.com/en/technology/invisalign)
- [CA Clear Aligner](https://www.roomchang.com/en/technology/ca-clear-aligner)

## Trust & evidence
- [Our Doctors](https://www.roomchang.com/en/team): Internationally trained dental team.
- [Clinical Results](https://www.roomchang.com/en/clinical-results): Before/after case gallery.
- [Facilities](https://www.roomchang.com/en/about/facilities)
- [Community & News](https://www.roomchang.com/en/about/community)
- [Partnerships](https://www.roomchang.com/en/about/partnerships)

## Languages
- [Khmer site (ភាសាខ្មែរ)](https://www.roomchang.com/kh)
- [Chinese site (中文)](https://www.roomchang.com/cn)
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
