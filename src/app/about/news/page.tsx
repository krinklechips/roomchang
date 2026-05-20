import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News & Events | Roomchang Dental Hospital",
  description:
    "The latest news, events, press coverage, and announcements from Roomchang Dental Hospital — Cambodia's leading dental group since 1996.",
};

const ARTICLES = [
  {
    date: "October 2018",
    title: "Roomchang Dental Hospital Awarded ISO 9001:2015",
    description:
      "After evaluation by Bureau Veritas, Roomchang Dental Hospital was awarded the ISO 9001:2015 (UKAS Accreditation) — recognising our commitment to quality management and continuous improvement in dental care.",
    image:
      "https://roomchang.com/wp-content/uploads/2023/02/ISO-9001-2015-300x139-1.png",
    imageAlt: "Roomchang Dental Hospital ISO 9001:2015 UKAS Accreditation",
    href: "https://roomchang.com/news-events/roomchang-dental-hospital-has-been-awarded-iso-9001-since-2018/",
  },
  {
    date: "December 2017",
    title: "Roomchang in the Community",
    description:
      "Dr. Sam Chanphallyka and dental assistants from Roomchang Dental Hospital provided oral health education and toothbrushes to pre-school students through the RHB Indochina Bank early childhood development program.",
    image:
      "https://roomchang.com/wp-content/uploads/2014/11/Early-childhood-development-school-program_RHB-Indochina-bank-Roomchang-Dental.jpg",
    imageAlt:
      "Roomchang oral health education — RHB Indochina Bank school program",
    href: "https://roomchang.com/news-events/roomchang-in-the-community/",
  },
  {
    date: "November 2016",
    title: "Campu BrightStar Hidden Talent Contest",
    description:
      "Roomchang Dental Hospital participated in the Campu BrightStar Hidden Talent Contest — a community event celebrating local talent and bringing together partners across Cambodia.",
    image:
      "https://roomchang.com/wp-content/uploads/2023/02/Campu-Bright-Star_Web.jpg",
    imageAlt: "Campu BrightStar Hidden Talent Contest",
    href: null,
  },
  {
    date: "December 2015",
    title: "Customer Meet Inventor",
    description:
      "A special event celebrating 20 years of Roomchang Dental Hospital — giving patients the opportunity to meet the specialists behind their treatments and learn about the technology that powers modern dentistry.",
    image:
      "https://roomchang.com/wp-content/uploads/2015/12/DSC_7984.jpg",
    imageAlt: "Roomchang Customer Meet Inventor event",
    href: "https://roomchang.com/news-events/customer-meet-inventor-2/",
  },
  {
    date: "December 2015",
    title: "2nd Conference — Roomchang Excellence in Dentistry",
    description:
      "Roomchang Dental Hospital held its second annual dental conference at the Kravan Hotel, with the opening ceremony presided over by Dr. Tith Hong Yoeu — bringing together dental professionals from across the region.",
    image:
      "https://roomchang.com/wp-content/uploads/2023/02/1-1-300x201-1.jpg",
    imageAlt:
      "2nd Annual Conference — Roomchang Excellence in Dentistry",
    href: null,
  },
  {
    date: "December 2015",
    title: "1st Conference — Roomchang Excellence in Dentistry",
    description:
      "Roomchang Dental Hospital held its inaugural annual dental conference at the Cambodiana Hotel — a milestone event for continuing dental education in Cambodia.",
    image: "https://roomchang.com/wp-content/uploads/2023/02/01.jpg",
    imageAlt:
      "1st Annual Conference — Roomchang Excellence in Dentistry at the Cambodiana Hotel",
    href: "https://roomchang.com/news-events/1st-conference-roomchang-excellence-in-dentistry/",
  },
  {
    date: "December 2015",
    title: "Nepal Earthquake — Charitable Response",
    description:
      "Roomchang staff and dentists organised a charitable response to support relief efforts following the devastating earthquake in Nepal — reflecting our commitment to humanitarian causes beyond dental care.",
    image:
      "https://roomchang.com/wp-content/uploads/2023/02/Nepal-Earthquake-1.jpg",
    imageAlt: "Roomchang charitable response — Nepal earthquake relief",
    href: null,
  },
  {
    date: "December 2014",
    title: "Roomchang Dental Hospital Awarded ISO 9001:2008 (Sixth Time)",
    description:
      "Roomchang Dental Hospital was awarded the ISO 9001:2008 (UKAS Accreditation) for the sixth consecutive time — demonstrating sustained excellence in quality management and patient care.",
    image:
      "https://roomchang.com/wp-content/uploads/2023/02/Roomchang-Dental-Hospital-Awarded-ISO-90012008-for-Sixth-Time-1.jpg",
    imageAlt: "Roomchang Dental Hospital ISO 9001:2008 sixth-time award",
    href: "https://roomchang.com/news-events/roomchang-dental-hospital-awarded-iso-90012008-for-sixth-time/",
  },
  {
    date: "August 2014",
    title: "Opening of Roomchang — Rose Condo Branch",
    description:
      "On August 15, 2014, the Roomchang Rose Condo Branch in Bassac Garden City was officially opened — expanding our reach to serve the surrounding residential communities of Bassac and BKK.",
    image:
      "https://roomchang.com/wp-content/uploads/2023/02/Opening-of-Roomchang-Rose-Condo-Branch-1.jpg",
    imageAlt: "Official opening of Roomchang Rose Condo Branch in Bassac Garden City",
    href: "https://roomchang.com/news-events/opening-of-roomchang-rose-condo-branch-2/",
  },
  {
    date: "March 2014",
    title: "Roomchang Earns International Accreditation — Sixth Time",
    description:
      "Roomchang Dental Hospital was awarded an ISO 9001:2008 (UKAS Accreditation) for the sixth time in a row — a testament to our continued focus on international standards of dental quality.",
    image:
      "https://roomchang.com/wp-content/uploads/2023/02/Roomchang-earns-international-accreditation-for-dental-quality-a-sixth-time.jpg",
    imageAlt:
      "Roomchang earns international dental quality accreditation — sixth time",
    href: "https://roomchang.com/news-events/roomchang-earns-international-accreditation-for-dental-quality-a-sixth-time/",
  },
  {
    date: "July 2013",
    title: "Roomchang: Dental Care in Cambodia",
    description:
      "A patient experience article describing the decision to choose Roomchang for dental treatment over other options — highlighting the hospital's modern facilities, multilingual staff, and international standards.",
    image:
      "https://roomchang.com/wp-content/uploads/2023/02/Roomchang-Dental-Care-in-Cambodia.jpg",
    imageAlt: "Roomchang Dental Care in Cambodia — patient experience",
    href: "https://roomchang.com/news-events/roomchang-dental-care-in-cambodia/",
  },
  {
    date: "January 2013",
    title: "Getting Dental Care in Cambodia: A Visit to Roomchang",
    description:
      "A detailed account from an international patient visiting Roomchang Dental Hospital for treatment — documenting their experience with the facility, staff, and quality of care received.",
    image:
      "https://roomchang.com/wp-content/uploads/2023/02/Getting-dental-care-in-Cambodia-A-visit-to-Roomchang.jpg",
    imageAlt:
      "Getting dental care in Cambodia — international patient visit to Roomchang",
    href: "https://roomchang.com/news-events/getting-dental-care-in-cambodia-a-visit-to-roomchang/",
  },
  {
    date: "October 2012",
    title: "Top Cambodian Dentist Credits Germany for Training",
    description:
      "A profile of Dr. Tith Hong Yoeu, Founder and Director of Roomchang Dental Hospital, discussing his training in Germany and how it shaped his vision to bring world-class dentistry to Cambodia.",
    image:
      "https://roomchang.com/wp-content/uploads/2023/02/Top-Cambodian-dentist-credits-Germany-for-training.jpg",
    imageAlt:
      "Dr. Tith Hong Yoeu — top Cambodian dentist credits Germany for training",
    href: "https://roomchang.com/news-events/top-cambodian-dentist-credits-germany-for-training/",
  },
  {
    date: "June 2012",
    title: "Expectations Exceeded at New Dental Hospital",
    description:
      "Dr. Tith Hong Yoeu opened Roomchang Dental Hospital in a new 10-storey building on Street 184 — a purpose-built facility that exceeded expectations and set a new benchmark for dental care in Cambodia.",
    image:
      "https://roomchang.com/wp-content/uploads/2023/02/Expectations-exceeded-at-new-dental-hospital.jpg",
    imageAlt:
      "Expectations exceeded at new Roomchang Dental Hospital — 10-storey building",
    href: "https://roomchang.com/news-events/expectations-exceeded-at-new-dental-hospital/",
  },
];

export default function NewsPage() {
  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> About
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            News & Events
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            Stay updated with the latest news, events, press coverage, and announcements from
            Roomchang Dental Hospital — Cambodia&apos;s leading dental group since 1996.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {/* Article grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((article) => {
            const inner = (
              <>
                <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--surface)]">
                  <Image
                    src={article.image}
                    alt={article.imageAlt}
                    fill
                    className="object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    unoptimized
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[color:var(--brand)]">
                    {article.date}
                  </p>
                  <h2 className="mt-2 font-display text-xl leading-snug text-[color:var(--text-main)] group-hover:text-[color:var(--brand-deep)] transition-colors">
                    {article.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-7 text-[color:var(--text-soft)]">
                    {article.description}
                  </p>
                  {article.href && (
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--brand-deep)] transition group-hover:text-[color:var(--brand)]">
                      Read Article <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                    </span>
                  )}
                </div>
              </>
            );

            return article.href ? (
              <a
                key={article.title}
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_12px_40px_rgba(57,28,45,0.05)] transition hover:border-[color:var(--brand-light)] hover:shadow-[0_16px_48px_rgba(57,28,45,0.10)]"
              >
                {inner}
              </a>
            ) : (
              <article
                key={article.title}
                className="group flex flex-col overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_12px_40px_rgba(57,28,45,0.05)]"
              >
                {inner}
              </article>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-[color:var(--brand-soft)] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[color:var(--text-main)]">
                Stay Connected
              </h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-[color:var(--text-soft)]">
                Follow us on social media for the latest updates, events, and dental health tips
                from Roomchang Dental Hospital.
              </p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
