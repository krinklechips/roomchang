import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { supabaseServer } from "@/lib/supabase-server";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Community & Charity | Roomchang Dental Hospital",
  description:
    "Roomchang's charity missions bring free dental care to underserved communities across Cambodia — mobile clinics, blood drives, and oral health education.",
};

type Article = {
  id: string;
  slug: string;
  title: string;
  date: string;
  description: string;
  image: string;
  imageAlt: string;
};

// Fallback in case DB is unavailable
const FALLBACK_ARTICLES: Article[] = [
  {
    id: "1", slug: "29th-anniversary-blood-donation", date: "December 2024",
    title: "29th Anniversary Blood Donation Drive",
    description: "29 Roomchang staff volunteers participated in a blood donation drive at the National Blood Center, supporting Kantha Bopha Children's Hospital and the national blood supply.",
    image: "https://roomchang.com/wp-content/uploads/2024/12/470221513_1143548607331480_5822147168748663462_n-1024x684.jpg",
    imageAlt: "Roomchang 29th Anniversary Blood Donation Drive",
  },
  {
    id: "2", slug: "28th-anniversary-blood-donation", date: "December 2023",
    title: "28th Anniversary Blood Donation",
    description: "Staff volunteers returned to the National Blood Center for Roomchang's 28th anniversary blood donation campaign, continuing our annual tradition of giving back.",
    image: "https://roomchang.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-14-at-08.00.33.jpeg",
    imageAlt: "Roomchang 28th Anniversary Blood Donation 2023",
  },
  {
    id: "3", slug: "27th-anniversary-blood-donation", date: "December 2022",
    title: "27th Anniversary Blood Donation",
    description: "Roomchang staff rallied together for the 27th anniversary blood donation initiative, strengthening our commitment to community health.",
    image: "https://roomchang.com/wp-content/uploads/2023/12/photo_2022-12-12_16-53-12__2_.jpg",
    imageAlt: "Roomchang 27th Anniversary Blood Donation 2022",
  },
];

export default async function CommunityPage() {
  const { data, error } = await supabaseServer
    .from("community_articles")
    .select("id, slug, title, date, description, image, imageAlt")
    .eq("published", true)
    .order("order", { ascending: false });

  if (error) {
    console.error("[CommunityPage] fetch failed:", error.message);
  }

  const articles: Article[] = (data as Article[] | null)?.filter(a => a.slug) ?? FALLBACK_ARTICLES;

  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} weight="bold" aria-hidden="true" /> About
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            Community & Charity
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            Dental care shouldn&apos;t be a luxury. Since 1996, Roomchang has run charity missions
            bringing free treatment to underserved communities across Cambodia — rural provinces,
            schools, orphanages, and beyond.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 space-y-10">

        {/* Article grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/about/community/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_12px_40px_rgba(57,28,45,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(57,28,45,0.10)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--surface)]">
                <Image
                  src={article.image}
                  alt={article.imageAlt || article.title}
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
                <h2 className="mt-2 font-display text-xl leading-snug text-[color:var(--text-main)] transition group-hover:text-[color:var(--brand-deep)]">
                  {article.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-[color:var(--text-soft)]">
                  {article.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--brand-deep)] transition group-hover:text-[color:var(--brand)]">
                  Read More <ArrowRight size={14} weight="bold" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-3xl bg-[color:var(--brand-soft)] p-10 sm:p-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[color:var(--text-main)]">Partner With Us</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-[color:var(--text-soft)]">
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
