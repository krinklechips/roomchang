export type NewsArticle = {
  slug: string;
  date: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Full article body — array of paragraphs rendered on the detail page */
  body: string[];
};

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: "iso-9001-2015-awarded",
    date: "October 2018",
    title: "Roomchang Dental Hospital Awarded ISO 9001:2015",
    description:
      "After evaluation by Bureau Veritas, Roomchang Dental Hospital was awarded the ISO 9001:2015 (UKAS Accreditation) — recognising our commitment to quality management and continuous improvement in dental care.",
    image:
      "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/roomchang/news/ISO-9001-2015-300x139-1.png",
    imageAlt: "Roomchang Dental Hospital ISO 9001:2015 UKAS Accreditation",
    body: [
      "Roomchang Dental Hospital received its ISO 9001:2015 certification with UKAS accreditation following a comprehensive three-day evaluation conducted by Bureau Veritas, an internationally recognised standards certification body.",
      "The hospital first achieved ISO 9001 certification in 2008, becoming the first dental clinic in Cambodia to earn this distinction. The 2018 award represents a continued commitment to maintaining the highest standards of quality management in dental care.",
      'Director Dr. Tith Hong Yoeu noted that the hospital works to maintain international-standard dental care and has gained the trust of an increasing number of patients each year.',
      "Operating from a modern 10-storey building in central Phnom Penh, Roomchang employs over 30 specialist dentists, many with overseas training in Germany, Japan, and other countries. The facility features advanced dental technologies including CAD/CAM systems, CBCT scanners, laser dentistry, digital imaging, and Class B autoclave sterilisation equipment.",
      "Since 2007, Roomchang has conducted free dental clinics throughout Cambodia, providing services to thousands of patients in underserved communities. The hospital launched its Oral Health Care Education Project in 2011 to promote proper hygiene awareness among students and professionals.",
    ],
  },
  {
    slug: "customer-meet-inventor-2015",
    date: "December 2015",
    title: "Customer Meet Inventor",
    description:
      "A special event celebrating 20 years of Roomchang Dental Hospital — giving patients the opportunity to meet the specialists behind their treatments and learn about the technology that powers modern dentistry.",
    image:
      "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/roomchang/news/DSC_7984.jpg",
    imageAlt: "Roomchang Customer Meet Inventor event",
    body: [
      "To mark two decades of operation, Roomchang Dental Hospital hosted the “Customers Meet Inventor” 2015 event, bringing together patients, partners, and the specialist team for a celebration of the hospital’s journey since 1996.",
      "The event highlighted Roomchang’s longstanding partnership with Prof. Nentwig and the Goethe University of Frankfurt, Germany — a collaboration that has significantly shaped the hospital’s clinical development and training programs.",
      "A key focus of the event was implant dentistry. Since 2000, Roomchang has treated thousands of implant patients using the Ankylos implant system, maintaining clinical outcomes that meet and exceed international benchmarks.",
      "Guests had the opportunity to meet the specialists behind their treatments, learn about the latest advances in dental technology, and see firsthand how Roomchang combines international training with compassionate local care.",
    ],
  },
  {
    slug: "2nd-conference-excellence-in-dentistry",
    date: "December 2015",
    title: "2nd Conference — Roomchang Excellence in Dentistry",
    description:
      "Roomchang Dental Hospital held its second annual dental conference at the Kravan Hotel, with the opening ceremony presided over by Dr. Tith Hong Yoeu — bringing together dental professionals from across the region.",
    image:
      "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/roomchang/news/1-1-300x201-1.jpg",
    imageAlt:
      "2nd Annual Conference — Roomchang Excellence in Dentistry",
    body: [
      "Roomchang Dental Hospital hosted its second annual “Roomchang Excellence in Dentistry” conference at the Kravan Hotel in Phnom Penh, with the opening ceremony presided over by Director Dr. Tith Hong Yoeu.",
      "Building on the success of the inaugural conference, the 2015 event brought together dental professionals from across the region to share knowledge, present clinical research, and discuss the latest advances in dental techniques and technology.",
      "The conference reinforced Roomchang’s role as a centre for continuing dental education in Cambodia — providing a platform for knowledge exchange between local and international dental professionals.",
    ],
  },
  {
    slug: "1st-conference-excellence-in-dentistry",
    date: "December 2015",
    title: "1st Conference — Roomchang Excellence in Dentistry",
    description:
      "Roomchang Dental Hospital held its inaugural annual dental conference at the Cambodiana Hotel — a milestone event for continuing dental education in Cambodia.",
    image: "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/roomchang/news/01.jpg",
    imageAlt:
      "1st Annual Conference — Roomchang Excellence in Dentistry at the Cambodiana Hotel",
    body: [
      "Roomchang Dental Hospital organised its inaugural annual dental conference, “Roomchang Excellence in Dentistry,” on the weekend of 12–13 December 2015 at the Cambodiana Hotel in Phnom Penh. The opening ceremony was led by Director Dr. Tith Hong Yoeu.",
      "The event covered the latest clinical techniques and procedures across various dental specialties, attracting approximately 150 attendees including practising dentists, dental students, and healthcare professionals.",
      "Presentations showcased cutting-edge sterilisation equipment, digital crown design technology, and advanced surgical instruments. Roomchang’s dental professionals shared expertise gained from overseas training programs with Cambodian colleagues.",
      "By the time of the conference, Roomchang had reached its 20th year of operations with 31 doctors across all dental specialties, 48 treatment rooms, 4 operating theatres, and 5 sterilisation rooms — establishing itself as Cambodia’s largest dental group practice.",
    ],
  },
  {
    slug: "iso-9001-2008-sixth-time",
    date: "December 2014",
    title: "Roomchang Dental Hospital Awarded ISO 9001:2008 (Sixth Time)",
    description:
      "Roomchang Dental Hospital was awarded the ISO 9001:2008 (UKAS Accreditation) for the sixth consecutive time — demonstrating sustained excellence in quality management and patient care.",
    image:
      "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/roomchang/news/Roomchang-Dental-Hospital-Awarded-ISO-90012008-for-Sixth-Time-1.jpg",
    imageAlt: "Roomchang Dental Hospital ISO 9001:2008 sixth-time award",
    body: [
      "Roomchang Dental Hospital was awarded the ISO 9001:2008 (UKAS Accreditation) for the sixth consecutive time, reinforcing its position as Cambodia’s most quality-assured dental provider.",
      "The ISO 9001 standard, assessed by Bureau Veritas, evaluates an organisation’s quality management system — including patient care processes, clinical protocols, sterilisation procedures, and continuous improvement practices.",
      "Achieving this certification six times in a row demonstrates Roomchang’s unwavering commitment to maintaining international standards of dental care and operational excellence since first earning the distinction in 2008.",
    ],
  },
  {
    slug: "opening-rose-condo-branch",
    date: "August 2014",
    title: "Opening of Roomchang — Rose Condo Branch",
    description:
      "On August 15, 2014, the Roomchang Rose Condo Branch in Bassac Garden City was officially opened — expanding our reach to serve the surrounding residential communities of Bassac and BKK.",
    image:
      "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/roomchang/news/Opening-of-Roomchang-Rose-Condo-Branch-1.jpg",
    imageAlt: "Official opening of Roomchang Rose Condo Branch in Bassac Garden City",
    body: [
      "On August 15, 2014, Roomchang officially opened its Rose Condo Branch in Bassac Garden City, Phnom Penh. The launch event was attended by corporate partners, loyal patients, friends, and family.",
      "The new branch was established to provide convenient access to quality dental services for residents of Bassac Garden City, Elite Town, Koh Pich, and the surrounding BKK communities — bringing the full range of Roomchang specialist care closer to home.",
      "The Rose Condo branch offers the same standard of care as the main 10-storey hospital, including specialist consultations, digital diagnostics, and treatments across all dental disciplines.",
      "The opening marked an important milestone in Roomchang’s expansion strategy, bringing the total number of branches to two as the hospital continued to grow its presence across Phnom Penh.",
    ],
  },
  {
    slug: "international-accreditation-sixth-time",
    date: "March 2014",
    title: "Roomchang Earns International Accreditation — Sixth Time",
    description:
      "Roomchang Dental Hospital was awarded an ISO 9001:2008 (UKAS Accreditation) for the sixth time in a row — a testament to our continued focus on international standards of dental quality.",
    image:
      "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/roomchang/news/Roomchang-earns-international-accreditation-for-dental-quality-a-sixth-time.jpg",
    imageAlt:
      "Roomchang earns international dental quality accreditation — sixth time",
    body: [
      "Roomchang Dental Hospital earned its ISO 9001:2008 (UKAS Accreditation) for the sixth consecutive time, further cementing its reputation as Cambodia’s benchmark for dental quality assurance.",
      "The accreditation, awarded following assessment by an international standards body, evaluates clinical processes, patient safety protocols, infection control, and quality management systems across the entire hospital operation.",
      "This achievement reflects nearly a decade of consistent adherence to international quality standards since Roomchang first achieved ISO certification in 2008 — the first dental clinic in Cambodia to do so.",
    ],
  },
  {
    slug: "dental-care-in-cambodia",
    date: "July 2013",
    title: "Roomchang: Dental Care in Cambodia",
    description:
      "A patient experience article describing the decision to choose Roomchang for dental treatment over other options — highlighting the hospital’s modern facilities, multilingual staff, and international standards.",
    image:
      "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/roomchang/news/Roomchang-Dental-Care-in-Cambodia.jpg",
    imageAlt: "Roomchang Dental Care in Cambodia — patient experience",
    body: [
      "An international visitor to Cambodia chose Roomchang Dental Hospital for dental treatment after comparing options in the region. The patient described the facility as exceptionally hygienic, air-conditioned, and professionally run.",
      "Treatment was provided by one of Roomchang’s experienced dentists, with the patient noting the professional and comfortable experience throughout. The dental work included filling replacements, completed to a high standard.",
      "A key highlight was the value for money — with treatment costs at a fraction of prices in other countries, while delivering comparable quality. The patient reported being highly satisfied with both the clinical outcome and the overall experience.",
      "This account reflects the experience of many international patients who travel to Roomchang for affordable, high-quality dental care in a modern hospital setting.",
    ],
  },
  {
    slug: "getting-dental-care-in-cambodia",
    date: "January 2013",
    title: "Getting Dental Care in Cambodia: A Visit to Roomchang",
    description:
      "A detailed account from an international patient visiting Roomchang Dental Hospital for treatment — documenting their experience with the facility, staff, and quality of care received.",
    image:
      "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/roomchang/news/Getting-dental-care-in-Cambodia-A-visit-to-Roomchang.jpg",
    imageAlt:
      "Getting dental care in Cambodia — international patient visit to Roomchang",
    body: [
      "An expat living in Cambodia documented their first visit to Roomchang Dental Hospital after hearing recommendations about the quality of dental care available in Phnom Penh.",
      "Despite initial hesitation, the patient was impressed by the 10-storey facility, its modern equipment, and the professionalism of the dental team. The cleaning was described as thorough and remarkably efficient, using electronic scalers rather than traditional tools.",
      "The patient highlighted the competitive pricing — with free consultations, affordable cleanings, and treatment costs significantly below those in Western countries — while noting that the standard of care compared favourably to clinics in the USA, UK, and Ireland.",
      "Walk-in appointments are welcome at the main hospital, and the patient noted the stunning views of Phnom Penh from the upper floors as an unexpected bonus. The overall assessment was a strong recommendation to other expats seeking quality dental care in Cambodia.",
    ],
  },
  {
    slug: "top-cambodian-dentist-credits-germany",
    date: "October 2012",
    title: "Top Cambodian Dentist Credits Germany for Training",
    description:
      "A profile of Dr. Tith Hong Yoeu, Founder and Director of Roomchang Dental Hospital, discussing his training in Germany and how it shaped his vision to bring world-class dentistry to Cambodia.",
    image:
      "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/roomchang/news/Top-Cambodian-dentist-credits-Germany-for-training.jpg",
    imageAlt:
      "Dr. Tith Hong Yoeu — top Cambodian dentist credits Germany for training",
    body: [
      "Dr. Tith Hong Yoeu, Founder and Director of Roomchang Dental Hospital, is profiled in this article discussing how his training in Germany fundamentally shaped his approach to dentistry in Cambodia.",
      "Dr. Tith studied dentistry at Goethe University in Frankfurt, Germany from 2001 to 2003. Three additional Roomchang dentists subsequently completed the same German dental certification program, bringing international-standard expertise back to Cambodia.",
      "The director has spoken about the impact of his German education on transferring specialist knowledge, equipment, materials, and dental technologies to Roomchang — with the goal of providing the same quality of care available in Germany, at local prices.",
      "Dr. Tith’s commitment to continuous learning led him to send additional staff abroad for advanced education, citing his deep appreciation for the rigorous standards and attention to detail that characterise German dental training.",
      "Roomchang Dental Hospital is located at No. 4, Street 184 in Phnom Penh, and has grown from a single practice into Cambodia’s leading dental group under Dr. Tith’s direction.",
    ],
  },
  {
    slug: "expectations-exceeded-new-dental-hospital",
    date: "June 2012",
    title: "Expectations Exceeded at New Dental Hospital",
    description:
      "Dr. Tith Hong Yoeu opened Roomchang Dental Hospital in a new 10-storey building on Street 184 — a purpose-built facility that exceeded expectations and set a new benchmark for dental care in Cambodia.",
    image:
      "https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/roomchang/news/Expectations-exceeded-at-new-dental-hospital.jpg",
    imageAlt:
      "Expectations exceeded at new Roomchang Dental Hospital — 10-storey building",
    body: [
      "In 2012, Dr. Tith Hong Yoeu opened Roomchang Dental Hospital in a purpose-built 10-storey building on Street 184, off Norodom Boulevard in Phnom Penh — establishing Cambodia’s first comprehensive dental hospital.",
      "The new facility served approximately 150 patients daily, with a growing proportion of international visitors. The hospital earned recognition from several embassies as a safe and trusted dental care provider, and was contracted by the U.S. Peace Corps to serve American volunteers.",
      "With an initial team of 21 dentists and 80 staff, the hospital featured 26 dental chairs with plans for expansion. Equipment investment included German suction systems, Italian and Japanese dental chairs, and CAD/CAM technology from the USA.",
      "Treatment costs were positioned at approximately 20% of equivalent prices in the USA or Australia, making Roomchang a compelling destination for dental tourism while maintaining sterilisation protocols equivalent to UK, US, and German standards.",
      "Dr. Tith’s philosophy of continuous learning and hands-on involvement in complex cases set the tone for the hospital’s clinical culture, which continues to this day.",
    ],
  },
];

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return NEWS_ARTICLES.find((a) => a.slug === slug);
}

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

/** Parse a "Month YYYY" string into a sortable timestamp (0 if unparseable). */
function parseNewsDate(date: string): number {
  // Split on whitespace instead of an ambiguous regex: "Month YYYY" → [month, year].
  const [monStr, yrStr] = date.trim().toLowerCase().split(/\s+/);
  if (!monStr || !/^\d{4}$/.test(yrStr ?? "")) return 0;
  const month = MONTHS[monStr] ?? 0;
  return new Date(Number(yrStr), month, 1).getTime();
}

/**
 * Articles sorted newest-first. Array.prototype.sort is stable, so items
 * sharing the same month keep their authored order in NEWS_ARTICLES.
 */
export const NEWS_ARTICLES_SORTED: NewsArticle[] = [...NEWS_ARTICLES].sort(
  (a, b) => parseNewsDate(b.date) - parseNewsDate(a.date),
);
