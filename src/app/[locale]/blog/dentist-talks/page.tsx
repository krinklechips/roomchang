import { Link } from "@/i18n/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dentist Talks | Roomchang Dental Hospital",
  description:
    "Watch Roomchang dentists explain common dental concerns, treatment options, and modern technologies in short, informative videos.",
};

const YOUTUBE_PLAYLIST_ID = "PL2Dq5LzBKy4wi9hCaXPEoFhY1xY-LoN46";

export const DENTIST_TALKS = [
  {
    id: "Sj212poMjQQ",
    title: "Solutions for Bad Breath",
    topic: "Oral Hygiene",
  },
  {
    id: "zajv8AuutfE",
    title: "How to Get Whiter, Brighter Teeth",
    topic: "Cosmetic Dentistry",
  },
  {
    id: "cilwCM3Iguc",
    title: "Teeth Cleaning vs. Teeth Whitening: What's the Difference?",
    topic: "Cosmetic Dentistry",
  },
  {
    id: "H-57t06LuqE",
    title: "Understanding Gum Disease",
    topic: "Periodontal Dentistry",
  },
  {
    id: "xQrmC7xfpis",
    title: "Caring For and Treating Children's Teeth",
    topic: "Pediatric Dentistry",
  },
  {
    id: "p7Elqx5UUo4",
    title: "Should You See a Dentist If Your Teeth Don't Hurt?",
    topic: "Preventive Dentistry",
  },
  {
    id: "aseJoChyLM8",
    title: "Fissure Sealants for Children's Teeth",
    topic: "Pediatric Dentistry",
  },
  {
    id: "X8GvbpfjMAU",
    title: "Protecting Teeth from Grinding and Wear",
    topic: "Preventive Dentistry",
  },
  {
    id: "vTLQyPsjEvo",
    title: "Tooth Sensitivity, Explained by Dr. Seun Rathanak",
    topic: "General Dentistry",
  },
  {
    id: "8I06e8cQzAo",
    title: "When Should a Child Have Their First Orthodontic Visit?",
    topic: "Orthodontics",
  },
  {
    id: "TjCpgw7GDYQ",
    title: "Periodontal Disease, Explained by Dr. Meng Hang",
    topic: "Periodontal Dentistry",
  },
  {
    id: "WsaRFqhtULQ",
    title: "Should Pregnant Women See a Dentist? — Dr. Sam Chanphallyka",
    topic: "Preventive Dentistry",
  },
  {
    id: "3IeYTNI9hR8",
    title: "Early Childhood Caries (Tooth Decay in Young Children)",
    topic: "Pediatric Dentistry",
  },
  {
    id: "7GFKeh5GlSA",
    title: "How to Care for Your Teeth Properly — Dr. Lao Chanvattey",
    topic: "Preventive Dentistry",
  },
  {
    id: "FDTUTfFDESI",
    title: "The Effects of Snoring and Sleep Apnea",
    topic: "Sleep Apnea",
  },
  {
    id: "ZpQZqMHN4us",
    title: "Oral Health for Babies and Children",
    topic: "Pediatric Dentistry",
  },
  {
    id: "sUghKx1CrnA",
    title: "Interview with Dr. Heng Kyhak: Implantology",
    topic: "Implantology",
  },
  {
    id: "0dxBq4qkGDY",
    title: "Roomchang Dental Hospital with Dr. Tith Hong Yoeu — Dentistry Uncensored with Howard Farran",
    topic: "Interview",
  },
  {
    id: "cWWiy-CxvJI",
    title: "Roomchang in the News — Implants, Crowns & Dentistry",
    topic: "News",
  },
  {
    id: "lOlr2xdYjlM",
    title: "Roomchang TVC (English)",
    topic: "Roomchang",
  },
  {
    id: "GKftQhBRz4U",
    title: "Roomchang Dental & Aesthetic Hospital",
    topic: "Roomchang",
  },
  {
    id: "vesEO_2BoOI",
    title: "Roomchang Dental & Aesthetic Hospital",
    topic: "Roomchang",
  },
  {
    id: "LnhaRxo0JRs",
    title: "Roomchang Dental & Aesthetic Hospital",
    topic: "Roomchang",
  },
  {
    id: "98xjrKSG2Tg",
    title: "Impacted Wisdom Teeth, Explained by Dr. Dara Narith",
    topic: "Oral Surgery",
  },
];

export default function DentistTalksPage() {
  return (
    <SiteShell>
      {/* Header */}
      <div className="border-b border-[color:var(--border-strong)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)] transition hover:text-[color:var(--brand-deep)]"
          >
            <ArrowLeft size={13} strokeWidth={2.5} aria-hidden="true" /> Education Blog
          </Link>
          <h1 className="mt-4 font-display text-5xl leading-none text-[color:var(--text-main)] sm:text-6xl">
            Dentist Talks
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            Hear directly from Roomchang&apos;s dentists as they explain common dental concerns,
            treatment options, modern technologies, and how patients can make informed decisions
            about their oral health.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 space-y-20">
        {/* Intro */}
        <section>
          <h2 className="font-display text-3xl text-[color:var(--text-main)]">
            Expert Dental Advice from Roomchang
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--text-soft)]">
            At Roomchang Dental Hospital, patient education is part of every treatment journey.
            In this video series, our dentists share practical insights about dental care,
            treatment planning, prevention, and advanced procedures available at Roomchang.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-soft)]">
            Whether you are considering implants, braces, veneers, crowns, whitening, or routine
            care, these talks are designed to help you better understand your options before
            starting treatment.
          </p>
        </section>

        {/* Why These Talks Matter */}
        <section className="rounded-3xl bg-[color:var(--brand-soft)] px-8 py-8 sm:px-10 sm:py-10">
          <h3 className="font-display text-2xl text-[color:var(--brand-deep)]">
            Why These Talks Matter
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-soft)]">
            Dental treatment should never feel confusing. Our goal is to give patients clear,
            reliable information from experienced dentists, so they can feel confident about
            their care. These videos are especially helpful for patients who want to understand
            their treatment before visiting Roomchang, including local patients, international
            patients, and families planning dental care in Phnom Penh.
          </p>
        </section>

        {/* Video grid */}
        <section>
          <h2 className="font-display text-3xl text-[color:var(--text-main)]">
            Watch Our Dentists Explain
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--text-soft)]">
            Learn from Roomchang dentists through short, informative videos covering everyday
            dental questions and advanced treatment topics.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {DENTIST_TALKS.map((video) => (
              <div
                key={video.id}
                className="overflow-hidden rounded-3xl border border-[color:var(--border-strong)] bg-white shadow-[0_12px_40px_rgba(57,28,45,0.06)]"
              >
                {/* Video embed */}
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.id}?list=${YOUTUBE_PLAYLIST_ID}&rel=0`}
                    title={video.title}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Card content */}
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-display text-lg leading-snug text-[color:var(--text-main)]">
                        {video.title}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[color:var(--brand)]">
                        Roomchang Dental Hospital
                      </p>
                    </div>
                    <span className="mt-0.5 shrink-0 rounded-full bg-[color:var(--brand-soft)] px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-deep)]">
                      {video.topic}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--text-soft)]">
                    Watch this Roomchang Dentist Talks video from the official YouTube playlist.
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Playlist link */}
          <div className="mt-10 text-center">
            <a
              href="https://www.youtube.com/playlist?list=PL2Dq5LzBKy4wi9hCaXPEoFhY1xY-LoN46"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2"
            >
              View Full Playlist on YouTube
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814Z" />
                <path d="m9.545 15.568 6.272-3.568-6.272-3.568v7.136Z" fill="white" />
              </svg>
            </a>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-[color:var(--brand)] p-10 text-white sm:p-14">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-4xl">Have more questions?</h2>
              <p className="mt-2 max-w-md text-sm leading-7 text-white/80">
                Our team is ready to help. Book a free consultation and get personalised advice
                from our specialist dentists.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-full border border-white/30 bg-white px-7 py-4 text-sm font-bold text-[color:var(--brand)] transition hover:bg-white/90"
            >
              Book a Consultation
            </Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
