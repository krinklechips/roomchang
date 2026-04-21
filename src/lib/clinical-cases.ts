export type ClinicalCaseDetail = {
  slug: string;
  title: string;
  category: string;
  tag: string;
  treatment: string;
  duration: string;
  description: string;
  /** Full clinical narrative from the original case notes */
  fullText: string;
  /** Main before/after image shown on the listing card */
  cardImage: string;
  /** All images for the detail page gallery */
  images: { src: string; caption?: string }[];
};

export const CLINICAL_CASES: ClinicalCaseDetail[] = [
  {
    slug: "full-mouth-reconstruction",
    title: "Full Mouth Reconstruction",
    category: "Full Mouth",
    tag: "Before & After",
    treatment: "Dental implants + porcelain crowns, full arch restoration",
    duration: "6–8 months",
    description:
      "Complete rehabilitation of failed dentition using dental implants and zirconia crowns across both arches.",
    fullText: `A 31-year-old male came for consultation to see what could be done with his severely eroded and rotted teeth. Appearance being one consideration, basic function was also being impacted. This patient was an avid consumer of sugary and carbonated drinks.

In the initial consultation different options were discussed and study models were made to show the 'now' and the expected outcome. The patient opted for the best long-term option.

His first appointment started with a root canal on tooth #23. Next, the broken teeth on #24 and #25 were removed and implants were placed. The entire arch was systematically restored over the following months using Ankylos implants with zirconia-based crowns.

The final results show a complete transformation — both aesthetically and functionally. The patient reported a dramatic improvement in confidence and daily quality of life.`,
    cardImage: "/clinical-results/full-mouth-recon-before-after.jpg",
    images: [
      { src: "/clinical-results/cases/full-mouth-1.jpg", caption: "Before and after — full arch restoration (upper)" },
      { src: "/clinical-results/cases/full-mouth-2.jpg", caption: "Before and after — full arch restoration (lower)" },
      { src: "/clinical-results/cases/full-mouth-3.jpg", caption: "Composite before/after overview" },
    ],
  },
  {
    slug: "implants-crowns-1",
    title: "Implants & Crowns — Case 1",
    category: "Implants & Crowns",
    tag: "Before & After",
    treatment: "Osseointegrated implants with zirconia crowns",
    duration: "4–6 months",
    description:
      "Single and multiple tooth replacement using OSSTEM implants with custom zirconia restorations following apical cyst removal.",
    fullText: `A 50-year-old male presented with dental pain and difficulty eating. The patient also expressed dissatisfaction with the appearance of his teeth. Radiographic imaging revealed an apical cyst at one location, which was surgically removed along with the affected tooth.

Two dental implants were subsequently placed to restore function and aesthetics. The implants were allowed to osseointegrate over a 3-month period.

Custom zirconia crowns were then fabricated in-house using Roomchang's CAD/CAM digital laboratory. The permanent crowns were cemented following a try-in and adjustment phase.

The final result is a natural-looking, fully functional restoration that blends seamlessly with the surrounding teeth.`,
    cardImage: "/clinical-results/implants-crowns-1-before-after.jpg",
    images: [
      { src: "/clinical-results/cases/implants-crowns-1-a.jpg", caption: "Clinical view — implant placement" },
      { src: "/clinical-results/cases/implants-crowns-1-b.jpg", caption: "Clinical view — final crown placement" },
      { src: "/clinical-results/cases/implants-crowns-1-c.jpg", caption: "Before and after comparison" },
    ],
  },
  {
    slug: "implants-crowns-2",
    title: "Implants & Crowns — Case 2",
    category: "Implants & Crowns",
    tag: "Before & After",
    treatment: "Multiple implants with E-Max crowns, full posterior restoration",
    duration: "5–6 months",
    description:
      "Posterior implant placement with ceramic crown restorations for improved function and aesthetics.",
    fullText: `A 56-year-old male complained of poor dental function and many missing teeth. He was also unhappy with the appearance of his smile. Large spacing where the teeth were missing was evident in the digital X-ray.

The patient already had missing teeth #44–48 and #34–38. Tooth #43 was extracted and an immediate implant was placed. A further five implants were placed on #44–47. Four more implants were placed on the opposite side at #34–37. A root canal on #27 was also redone.

The dental implants needed two months to heal and bond with the bone. After three months, impressions were made for 15 full E-Max crowns. After ten days in the lab all 15 crowns were permanently cemented. The patient was very pleased with the results.`,
    cardImage: "/clinical-results/implants-crowns-2-before-after.jpg",
    images: [
      { src: "/clinical-results/cases/implants-crowns-2-a.jpg", caption: "Before treatment — panoramic view showing missing teeth" },
      { src: "/clinical-results/cases/implants-crowns-2-b.jpg", caption: "After treatment — 15 E-Max crowns cemented" },
      { src: "/clinical-results/cases/implants-crowns-2-c.jpg", caption: "Lower arch — close-up after restoration" },
      { src: "/clinical-results/cases/implants-crowns-2-d.jpg", caption: "Upper arch — close-up after restoration" },
    ],
  },
  {
    slug: "implants-crowns-3",
    title: "Implants & Crowns — Case 3",
    category: "Implants & Crowns",
    tag: "Before & After",
    treatment: "Anterior implants with E-Max crowns",
    duration: "4–5 months",
    description:
      "Anterior tooth replacement using implants with E-Max ceramic restorations for a natural-looking result.",
    fullText: `A 40-year-old male complained of pain on his upper-left tooth #22. After consultation, treatment was planned with the patient. The bridge was removed from teeth #11–22.

Root canal treatment was redone on tooth #22 and a zirconium post was placed. An Ankylos implant was placed on #21 with a temporary crown. Two months later, a full ceramic E4D crown was permanently cemented.

A second bridge was removed from teeth #36–38. Tooth #38 was extracted. Tooth #36 had a root canal treatment. An implant was placed on #37 and capped. After a three-month healing period, a crown was placed. The patient is very happy with the results.`,
    cardImage: "/clinical-results/implants-crowns-3-before-after.jpg",
    images: [
      { src: "/clinical-results/cases/implants-crowns-3-a.jpg", caption: "Before treatment — anterior view" },
      { src: "/clinical-results/cases/implants-crowns-3-b.jpg", caption: "After treatment — E-Max crown restorations" },
      { src: "/clinical-results/cases/implants-crowns-3-c.jpg", caption: "Close-up — crown detail upper arch" },
      { src: "/clinical-results/cases/implants-crowns-3-d.jpg", caption: "Close-up — crown detail lower arch" },
    ],
  },
  {
    slug: "implant-bridges-1",
    title: "Implant Bridge — Case 1",
    category: "Implant Bridges",
    tag: "Before & After",
    treatment: "Multiple implants with ceramic bridge — upper and lower arch",
    duration: "5–7 months",
    description:
      "Full-arch implant bridge restoring both aesthetics and full chewing function.",
    fullText: `A 62-year-old female patient came to Roomchang complaining of mobile upper teeth. She was very unhappy with the current appearance of her teeth and smile. Periodontitis was prevalent and her gums were noticeably receding.

Treatment started with the extraction of the two front teeth #11 and #21. Implants were immediately inserted to replace the missing teeth. Tooth #48 was also extracted. The existing pontic bridges were also removed and two implants placed at #35 and #37. Two weeks later, two more implants were placed on #46 and #47.

Temporary crowns and bridges were used before permanent bridges and crowns were cemented five months post-surgery. The results are obvious at the end of treatment and the gums have a much healthier appearance. The patient is very happy and now smiles with confidence.`,
    cardImage: "/clinical-results/implant-bridges-1-before-after.jpg",
    images: [
      { src: "/clinical-results/cases/implant-bridges-1-a.jpg", caption: "Before treatment — mobile upper teeth and receding gums" },
      { src: "/clinical-results/cases/implant-bridges-1-b.jpg", caption: "Implant placement — upper and lower arch" },
      { src: "/clinical-results/cases/implant-bridges-1-c.jpg", caption: "After treatment — final bridge seated" },
      { src: "/clinical-results/cases/implant-bridges-1-d.jpg", caption: "Final result — natural smile restored" },
    ],
  },
  {
    slug: "implant-bridges-2",
    title: "Implant Bridge — Case 2",
    category: "Implant Bridges",
    tag: "Before & After",
    treatment: "Implant-supported lower bridge with full upper denture",
    duration: "5–7 months",
    description:
      "Extended implant bridge restoring posterior function with Ankylos Syncone abutment system.",
    fullText: `A 72-year-old patient complained of mobility in his lower teeth and unstable pontic bridges. After consultation and a discussion of the options with his dentist, planning was made for an implant-supported bridge on the lower jaw. The upper jaw was to have a removable full upper denture.

All unstable and infected teeth were removed in preparation for the implants. Four Ankylos implants were placed at positions #34, 35, 43, and 45 with Syncone 5-degree abutments to support and retain the bridge.

The before and after photos show the results of the treatment of both the full upper denture and the implant-supported bridge. The patient reported significantly improved function and comfort.`,
    cardImage: "/clinical-results/implant-bridges-2-before-after.jpg",
    images: [
      { src: "/clinical-results/cases/implant-bridges-2-a.jpg", caption: "Before treatment — unstable lower bridge" },
      { src: "/clinical-results/cases/implant-bridges-2-b.jpg", caption: "After treatment — Ankylos implant-supported bridge" },
      { src: "/clinical-results/cases/implant-bridges-2-c.jpg", caption: "Lower arch — implant positions #34, 35, 43, 45" },
      { src: "/clinical-results/cases/implant-bridges-2-d.jpg", caption: "Final result — full upper denture and lower bridge" },
    ],
  },
  {
    slug: "emax-crowns",
    title: "E-Max Crown Smile Makeover",
    category: "Cosmetic & E-Max",
    tag: "Cosmetic",
    treatment: "Four E-Max ceramic crowns on upper anterior teeth",
    duration: "2–3 weeks",
    description:
      "Smile transformation using four E-Max ceramic crowns to correct spacing and aesthetics of the front teeth.",
    fullText: `A 48-year-old female was unhappy with the general appearance and the spacing of her front teeth. After a consultation and study model, four E-Max crowns were placed on the four upper front teeth.

Other treatment included numerous composite restorations on the surrounding teeth to complete the aesthetic result.

The change is quite dramatic. The patient is very pleased with the results and the natural appearance of her new smile.`,
    cardImage: "/clinical-results/emax-crowns-before-after.jpg",
    images: [
      { src: "/clinical-results/cases/emax-crowns-a.jpg", caption: "Before treatment — spacing and discolouration on upper anteriors" },
      { src: "/clinical-results/cases/emax-crowns-b.jpg", caption: "After treatment — four E-Max crowns cemented" },
    ],
  },
  {
    slug: "open-bite",
    title: "Open Bite Correction",
    category: "Orthodontics",
    tag: "Before & After",
    treatment: "Orthodontic treatment with implant — open bite and protrusion correction",
    duration: "24–30 months",
    description:
      "Severe anterior open bite and protrusion corrected with orthodontic treatment and strategic implant placement.",
    fullText: `A 26-year-old male patient came to Roomchang with a severe protrusion and open bite (malocclusion). When biting, his back teeth would touch and his front teeth would remain open. He had an existing pontic bridge on teeth #12 to #22.

Orthodontic treatment was started to widen the space at the missing tooth #11. This allowed the placing of an implant. It also corrected the open bite and the protrusion.

The X-rays and clinical photos document the dramatic transformation achieved through the combined orthodontic and implant approach. The patient's bite was fully corrected and the protrusion resolved, achieving both improved function and a dramatically improved facial profile.`,
    cardImage: "/clinical-results/open-bite-before-after.jpg",
    images: [
      { src: "/clinical-results/cases/open-bite-1.jpg", caption: "Before treatment — severe open bite and protrusion" },
      { src: "/clinical-results/cases/open-bite-2.jpg", caption: "X-ray — before treatment" },
      { src: "/clinical-results/cases/open-bite-3.jpg", caption: "X-ray — after treatment" },
      { src: "/clinical-results/cases/open-bite-4.jpg", caption: "Progress — orthodontic alignment phase" },
      { src: "/clinical-results/cases/open-bite-5.jpg", caption: "After treatment — open bite corrected" },
      { src: "/clinical-results/cases/open-bite-6.jpg", caption: "Final result — profile and bite fully restored" },
    ],
  },
  {
    slug: "orthodontics-1",
    title: "Orthodontics — Case 1",
    category: "Orthodontics",
    tag: "Before & After",
    treatment: "Full fixed orthodontic treatment — Class III malocclusion correction",
    duration: "18–24 months",
    description:
      "Severe Class III malocclusion with bilateral crossbite corrected using fixed metal bracket orthodontics.",
    fullText: `A 21-year-old Cambodian patient presented with a severe Class III malocclusion with bilateral crossbite. The cephalometric X-ray showed the patient's protruding jaw before treatment and the dramatic correction achieved after treatment. This represents a significant change in the patient's profile.

Treatment was carried out using metal brackets over a two-year period. The bilateral crossbite was fully corrected and the patient's profile improved dramatically.

The final results show both the dental alignment and the profile improvement — a life-changing transformation for this young patient.`,
    cardImage: "/clinical-results/orthodontic-1-before-after.jpg",
    images: [
      { src: "/clinical-results/cases/orthodontic-1-a.jpg", caption: "Cephalometric X-ray — before and after profile change" },
      { src: "/clinical-results/cases/orthodontic-1-b.jpg", caption: "Dental alignment — before bilateral crossbite correction" },
      { src: "/clinical-results/cases/orthodontic-1-c.jpg", caption: "Dental alignment — after bilateral crossbite correction" },
    ],
  },
  {
    slug: "orthodontics-2",
    title: "Orthodontics — Case 2",
    category: "Orthodontics",
    tag: "Before & After",
    treatment: "Orthodontic treatment with strategic extractions — crossbite correction",
    duration: "18–24 months",
    description:
      "Crossbite and crowding correction with metal bracket orthodontics and strategic premolar extractions.",
    fullText: `A 22-year-old female patient presented with a crossbite. Orthodontic treatment was recommended to correct her occlusion. Three molar teeth were also removed (#18, 38, and 48). The molars were removed to improve functionality and oral hygiene while also contributing to the overall aesthetic outcome, including the patient's final profile.

Teeth #34 and #44 were removed to create space for the realignment of the teeth. Metal brackets were placed for a two-year period.

The final result shows full correction of the crossbite and a beautifully aligned smile. The patient is very happy with her new smile and new profile.`,
    cardImage: "/clinical-results/orthodontic-2-before-after.jpg",
    images: [
      { src: "/clinical-results/cases/orthodontic-2-a.jpg", caption: "Profile view — before treatment" },
      { src: "/clinical-results/cases/orthodontic-2-b.jpg", caption: "Profile view — after treatment, crossbite corrected" },
    ],
  },
  {
    slug: "orthodontics-3",
    title: "Orthodontics — Case 3",
    category: "Orthodontics",
    tag: "Before & After",
    treatment: "Orthodontic alignment with extractions — severe crowding correction",
    duration: "24–30 months",
    description:
      "Severe crowding with Class II malocclusion and peg lateral incisors corrected over two and a half years.",
    fullText: `A 23-year-old Cambodian female was brought to Roomchang by her mother seeking orthodontic treatment. The patient had severe crowding on teeth #25–15 and #45–35 with Class II malocclusion, peg-shaped lateral teeth (#12 and #22) with palatal eruption and rotation.

Teeth #34, #24, #14, and #44 were extracted to make space for the realignment. The molar teeth (#18, 28, 38, and 48) were also removed to improve functionality and oral hygiene while contributing to the aesthetic outcome, including the final face profile.

Metal brackets were bonded on both upper and lower teeth. Total treatment time was two and a half years. The final result is a fully aligned, healthy smile with a significantly improved facial profile.`,
    cardImage: "/clinical-results/orthodontic-3-before-after.jpg",
    images: [
      { src: "/clinical-results/cases/orthodontic-3-a.jpg", caption: "Before treatment — severe crowding and Class II malocclusion" },
      { src: "/clinical-results/cases/orthodontic-3-b.jpg", caption: "After treatment — full alignment achieved over 2.5 years" },
    ],
  },
];

export function getCaseBySlug(slug: string): ClinicalCaseDetail | undefined {
  return CLINICAL_CASES.find((c) => c.slug === slug);
}
