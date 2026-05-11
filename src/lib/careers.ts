export type Position = {
  slug: string;
  title: string;
  shortDescription: string;
  category: "Clinical" | "Support";
  requirements: string[];
  benefits?: string[];
};

export const POSITIONS: Position[] = [
  {
    slug: "clinical-fellowship",
    title: "Clinical Fellowship",
    shortDescription:
      "A hands-on fellowship for dental students in their final years — learn from our specialist team and build the clinical skills to launch your career at Roomchang.",
    category: "Clinical",
    requirements: [
      "Must be Cambodian",
      "Must be in year 6 or year 7 of dental school",
      "Attention to detail and accuracy",
      "Proficiency in computerized equipment",
      "Good command in English (Chinese is a plus)",
      "Be friendly, flexible, honest",
      "Hard-working, confidential",
      "Excellent team working spirit",
      "Pleasant personality and able to work under pressure",
      "Self-motivate with a positive and professional approach",
    ],
    benefits: [
      "You will have a chance to become our dentist when you graduate",
      "You will learn about clinical cases from our team",
      "You will learn about clinical skills from our team",
      "Learn ways of communication with customers",
    ],
  },
  {
    slug: "dental-assistants",
    title: "Dental Assistants (Female)",
    shortDescription:
      "Support our clinical team in delivering outstanding patient care — assist dentists during procedures, manage instruments, and help maintain Roomchang's hospital-grade standards.",
    category: "Clinical",
    requirements: [
      "Females only",
      "Has completed high school",
      "Has completed a short course in dental assistant/health care is a plus",
      "Can communicate in English",
      "Good personality",
    ],
  },
  {
    slug: "dentists",
    title: "Dentists",
    shortDescription:
      "Join Cambodia's leading dental hospital as a general or specialist dentist — work with advanced CAD/CAM technology, a multidisciplinary team, and patients from over 20 countries.",
    category: "Clinical",
    requirements: [
      "Cambodian or expatriate between 25–45 years old",
      "Doctor’s degree in dentistry",
      "Proficiency in computerized equipment",
      "Good command of written and spoken English",
      "Be proactive, friendly, flexible, honest, hard-working, confidential, and willing to learn new things",
      "Excellent team working spirit",
      "Attention to detail and accuracy",
      "Pleasant personality and able to work under pressure",
      "Self-motivate with a positive and professional approach",
    ],
  },
  {
    slug: "customer-services",
    title: "Customer Services (Female)",
    shortDescription:
      "Be the first point of contact for our patients — manage appointments, provide a warm welcome, and deliver the exceptional service Roomchang is known for.",
    category: "Support",
    requirements: [
      "Females only",
      "Bachelor Degree",
      "Good command in English (Chinese is a plus)",
      "Pleasant personality and able to work under pressure",
      "Computer skills",
      "Friendly, flexible, honest, hard-working",
      "Excellent team working spirit",
      "Attention to detail and accuracy",
    ],
  },
];

export function getPositionBySlug(slug: string): Position | undefined {
  return POSITIONS.find((p) => p.slug === slug);
}
