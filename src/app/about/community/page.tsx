import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Community & Charity | Roomchang Dental Hospital",
  description:
    "Roomchang's charity missions bring free dental care to underserved communities across Cambodia — mobile clinics, blood drives, and oral health education.",
};

const ARTICLES = [
  {
    date: "December 2024",
    title: "29th Anniversary Blood Donation Drive",
    description:
      "29 Roomchang staff volunteers participated in a blood donation drive at the National Blood Center, supporting Kantha Bopha Children's Hospital and the national blood supply.",
    image: "https://roomchang.com/wp-content/uploads/2024/12/470221513_1143548607331480_5822147168748663462_n-1024x684.jpg",
    imageAlt: "Roomchang 29th Anniversary Blood Donation Drive at the National Blood Center",
  },
  {
    date: "December 2023",
    title: "28th Anniversary Blood Donation",
    description:
      "Staff volunteers returned to the National Blood Center for Roomchang's 28th anniversary blood donation campaign, continuing our annual tradition of giving back to the community.",
    image: "https://roomchang.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-14-at-08.00.33.jpeg",
    imageAlt: "Roomchang 28th Anniversary Blood Donation 2023",
  },
  {
    date: "December 2022",
    title: "27th Anniversary Blood Donation",
    description:
      "Roomchang staff rallied together for the 27th anniversary blood donation initiative, strengthening our commitment to community health and the national blood supply.",
    image: "https://roomchang.com/wp-content/uploads/2023/12/photo_2022-12-12_16-53-12__2_.jpg",
    imageAlt: "Roomchang 27th Anniversary Blood Donation 2022",
  },
  {
    date: "April 2020",
    title: "COVID-19 Community Support",
    description:
      "During the pandemic, Roomchang dentists and staff donated protective equipment and financial contributions to support Cambodia's healthcare workers on the front line of the national COVID-19 response.",
    image: "https://roomchang.com/wp-content/uploads/2025/07/IMG_2809-1-1-1024x768.jpg",
    imageAlt: "Roomchang COVID-19 donations to healthcare workers",
  },
  {
    date: "October 2019",
    title: "Oral Health Education — Footprints International School",
    description:
      "Roomchang clinical fellows and dental assistants visited Footprints International School to teach preschool students proper toothbrushing technique, dietary advice, and healthy oral habits — providing free toothbrushes and dental supplies to every child.",
    image: "https://roomchang.com/wp-content/uploads/2019/10/IMG_20191003_093022.jpg",
    imageAlt: "Roomchang oral health education visit to Footprints International School",
  },
  {
    date: "December 2017",
    title: "Early Childhood Development Program",
    description:
      "In partnership with RHB Indochina Bank, Roomchang ran an early childhood dental health program — combining oral health education with free check-ups for children in underserved communities across Phnom Penh.",
    image: "https://roomchang.com/wp-content/uploads/2014/11/Early-childhood-development-school-program_RHB-Indochina-bank-Roomchang-Dental.jpg",
    imageAlt: "Roomchang early childhood development dental program with RHB Indochina Bank",
  },
  {
    date: "Multiple Years",
    title: "Kantha Bopha Children's Hospital Blood Drives",
    description:
      "Each year, Roomchang organises staff blood donations for Kantha Bopha Children's Hospital — Cambodia's most important free children's hospital, where all medical services are provided at no charge to families who cannot afford care. In 2017, 22 staff donated; in 2016, 21 staff participated.",
    image: "https://roomchang.com/wp-content/uploads/2013/08/Blood-donate-to-Kuntha-Bopha_Roomchang-in-the-community.jpg",
    imageAlt: "Roomchang staff blood donation for Kantha Bopha Children's Hospital",
  },
  {
    date: "March 2015",
    title: "Battambang Mobile Dental Clinic",
    description:
      "A team of 16 dentists, dental nurses, assistants, and an anaesthetist set up camp in a mobile dental clinic in Battambang province, treating over 160 children in a single visit — providing free dental care to communities with no access to dental services.",
    image: "https://roomchang.com/wp-content/uploads/2014/11/Giving-back-with-a-smile.jpg",
    imageAlt: "Roomchang mobile dental clinic in Battambang — treating children for free",
  },
  {
    date: "Ongoing",
    title: "Mobile Community Clinic",
    description:
      "Roomchang's mobile dental clinic makes regular visits to rural Cambodia, bringing fully equipped dental care directly to residents who would otherwise have no access to treatment. All services are provided free of charge.",
    image: "https://roomchang.com/wp-content/uploads/2013/08/Roomchang-in-the-community_The-mobile-community-clinic.jpg",
    imageAlt: "Roomchang mobile community dental clinic in rural Cambodia",
  },
];

export default function CommunityPage() {
  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[--border-strong] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[--brand] transition hover:text-[--brand-deep]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> About
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[--text-main] sm:text-6xl">
            Community & Charity
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[--text-soft]">
            Dental care shouldn&apos;t be a luxury. Since 1996, Roomchang has run charity missions
            bringing free treatment to underserved communities across Cambodia — rural provinces,
            schools, orphanages, and beyond.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 space-y-10">

        {/* Article grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article) => (
            <article
              key={article.title}
              className="flex flex-col overflow-hidden rounded-3xl border border-[--border-strong] bg-white shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--surface)]">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  unoptimized
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[--brand]">
                  {article.date}
                </p>
                <h2 className="mt-2 font-display text-xl leading-snug text-[--text-main]">
                  {article.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-[--text-soft]">
                  {article.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-3xl bg-[color:var(--brand-soft)] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[--text-main]">Partner With Us</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-[--text-soft]">
                If your organisation would like to support or co-sponsor a charity dental mission,
                we&apos;d love to hear from you.
              </p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0">
              Get In Touch
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
