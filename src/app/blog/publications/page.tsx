import Link from "next/link";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/site/site-shell";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publications & Research | Roomchang Dental Hospital",
  description:
    "Peer-reviewed research papers and clinical studies published by Roomchang's specialist dentists, advancing evidence-based dental care.",
};

type Publication = {
  year: number;
  label: string;
  title: string;
  citation: ReactNode;
  doi: string;
};

// Roomchang-affiliated author names to highlight in bold
const B = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-[color:var(--text-main)]">{children}</strong>
);

const PUBLICATIONS: Publication[] = [
  {
    year: 2025,
    label: "PEER-REVIEWED",
    title:
      "Preliminary orthodontic insights into facial soft tissue thickness measurements using semi-automated cephalometric analysis in a Cambodian cohort",
    citation: (
      <>
        <B>Sonita, E.</B>, <B>Sally, M.</B>, Kimheng, C., Marya, A., Nalabothu, P., Ryna, L., Kanetaka, H., Kurniawan, A., Tabnjh, A. K., &amp; Selvaraj, S. (2025). Preliminary orthodontic insights into facial soft tissue thickness measurements using semi-automated cephalometric analysis in a Cambodian cohort. <em>Frontiers in Dental Medicine</em>, 6, Article 1714360.{" "}
        <a href="https://doi.org/10.3389/fdmed.2025.1714360" target="_blank" rel="noopener noreferrer" className="text-[color:var(--brand-deep)] underline decoration-[color:var(--brand-light)] underline-offset-2 transition hover:text-[color:var(--brand)]">https://doi.org/10.3389/fdmed.2025.1714360</a>
      </>
    ),
    doi: "https://doi.org/10.3389/fdmed.2025.1714360",
  },
  {
    year: 2025,
    label: "PEER-REVIEWED",
    title:
      "Analysis of Maxillary Anterior Tooth Dimensions and Proportions in Young Cambodians: A Cross-Sectional Study",
    citation: (
      <>
        <B>Tithphit, A.</B>, Schneider, B., Othman, A., <B>Phit, V.</B>, <B>Tith, H. Y.</B>, &amp; von See, C. (2025). Analysis of Maxillary Anterior Tooth Dimensions and Proportions in Young Cambodians: A Cross-Sectional Study. <em>Oral</em>, 5(4), 99.{" "}
        <a href="https://doi.org/10.3390/oral5040099" target="_blank" rel="noopener noreferrer" className="text-[color:var(--brand-deep)] underline decoration-[color:var(--brand-light)] underline-offset-2 transition hover:text-[color:var(--brand)]">https://doi.org/10.3390/oral5040099</a>
      </>
    ),
    doi: "https://doi.org/10.3390/oral5040099",
  },
  {
    year: 2024,
    label: "PEER-REVIEWED",
    title:
      "Radiological assessment of Sella Turcica morphology correlates with skeletal classes in an Austrian population: An observational study",
    citation: (
      <>
        Schwab, J., Stucki, L., Fitzek, S., <B>Tithphit, A.</B>, Hönigl, A., Stackmann, S., Horn, I., Thenner, H., Dasser, P., Woitek, R., Choi, K.-E., Hatamikia, S., &amp; Furtner, J. (2025). Radiological assessment of Sella Turcica morphology correlates with skeletal classes in an Austrian population: An observational study. <em>Oral Radiology</em>, 41, 169–179.{" "}
        <a href="https://doi.org/10.1007/s11282-024-00785-z" target="_blank" rel="noopener noreferrer" className="text-[color:var(--brand-deep)] underline decoration-[color:var(--brand-light)] underline-offset-2 transition hover:text-[color:var(--brand)]">https://doi.org/10.1007/s11282-024-00785-z</a>
      </>
    ),
    doi: "https://doi.org/10.1007/s11282-024-00785-z",
  },
  {
    year: 2023,
    label: "PEER-REVIEWED",
    title:
      "Molecular Mechanisms of Inhibitory Effects of Bovine Lactoferrin on Invasion of Oral Squamous Cell Carcinoma",
    citation: (
      <>
        Chea, C., Miyauchi, M., Inubushi, T., Okamoto, K., <B>Haing, S.</B>, &amp; Takata, T. (2023). Molecular mechanisms of inhibitory effects of bovine lactoferrin on invasion of oral squamous cell carcinoma. <em>Pharmaceutics</em>, 15(2), Article 562.{" "}
        <a href="https://doi.org/10.3390/pharmaceutics15020562" target="_blank" rel="noopener noreferrer" className="text-[color:var(--brand-deep)] underline decoration-[color:var(--brand-light)] underline-offset-2 transition hover:text-[color:var(--brand)]">https://doi.org/10.3390/pharmaceutics15020562</a>
      </>
    ),
    doi: "https://doi.org/10.3390/pharmaceutics15020562",
  },
  {
    year: 2020,
    label: "PEER-REVIEWED",
    title:
      "A pilot study to investigate the histomorphometric changes of murine maxillary bone around the site of mini-screw insertion in regenerated bone induced by anabolic reagents",
    citation: (
      <>
        <B>Keo, P.</B>, Matsumoto, Y., Shimizu, Y., Nagahiro, S., Ikeda, M., Aoki, K., &amp; Ono, T. (2021). A pilot study to investigate the histomorphometric changes of murine maxillary bone around the site of mini-screw insertion in regenerated bone induced by anabolic reagents. <em>European Journal of Orthodontics</em>, 43(1), 86–93.{" "}
        <a href="https://doi.org/10.1093/ejo/cjaa018" target="_blank" rel="noopener noreferrer" className="text-[color:var(--brand-deep)] underline decoration-[color:var(--brand-light)] underline-offset-2 transition hover:text-[color:var(--brand)]">https://doi.org/10.1093/ejo/cjaa018</a>
      </>
    ),
    doi: "https://doi.org/10.1093/ejo/cjaa018",
  },
  {
    year: 2018,
    label: "PEER-REVIEWED",
    title:
      "Molecular mechanisms underlying the inhibitory effects of bovine lactoferrin on osteosarcoma",
    citation: (
      <>
        Chea, C., <B>Haing, S.</B>, Miyauchi, M., Shrestha, M., Imanaka, H., &amp; Takata, T. (2019). Molecular mechanisms underlying the inhibitory effects of bovine lactoferrin on osteosarcoma. <em>Biochemical and Biophysical Research Communications</em>, 508(3), 946–952.{" "}
        <a href="https://doi.org/10.1016/j.bbrc.2018.11.204" target="_blank" rel="noopener noreferrer" className="text-[color:var(--brand-deep)] underline decoration-[color:var(--brand-light)] underline-offset-2 transition hover:text-[color:var(--brand)]">https://doi.org/10.1016/j.bbrc.2018.11.204</a>
      </>
    ),
    doi: "https://doi.org/10.1016/j.bbrc.2018.11.204",
  },
  {
    year: 2018,
    label: "PEER-REVIEWED",
    title:
      "Bovine lactoferrin reverses programming of epithelial-to-mesenchymal transition to mesenchymal-to-epithelial transition in oral squamous cell carcinoma",
    citation: (
      <>
        Chea, C., Miyauchi, M., Inubushi, T., Okamoto, K., <B>Haing, S.</B>, Nguyen, P. T., Imanaka, H., &amp; Takata, T. (2018). Bovine lactoferrin reverses programming of epithelial-to-mesenchymal transition to mesenchymal-to-epithelial transition in oral squamous cell carcinoma. <em>Biochemical and Biophysical Research Communications</em>, 507(1–4), 142–147.{" "}
        <a href="https://doi.org/10.1016/j.bbrc.2018.10.193" target="_blank" rel="noopener noreferrer" className="text-[color:var(--brand-deep)] underline decoration-[color:var(--brand-light)] underline-offset-2 transition hover:text-[color:var(--brand)]">https://doi.org/10.1016/j.bbrc.2018.10.193</a>
      </>
    ),
    doi: "https://doi.org/10.1016/j.bbrc.2018.10.193",
  },
  {
    year: 2018,
    label: "PEER-REVIEWED",
    title:
      "Molecular mechanism of inhibitory effects of bovine lactoferrin on the growth of oral squamous cell carcinoma",
    citation: (
      <>
        Chea, C., Miyauchi, M., Inubushi, T., Ayuningtyas, N. F., Subarnbhesaj, A., Nguyen, P. T., Shrestha, M., <B>Haing, S.</B>, Ohta, K., Yamada, S., &amp; Takata, T. (2018). Molecular mechanism of inhibitory effects of bovine lactoferrin on the growth of oral squamous cell carcinoma. <em>PLOS ONE</em>, 13(1), Article e0191683.{" "}
        <a href="https://doi.org/10.1371/journal.pone.0191683" target="_blank" rel="noopener noreferrer" className="text-[color:var(--brand-deep)] underline decoration-[color:var(--brand-light)] underline-offset-2 transition hover:text-[color:var(--brand)]">https://doi.org/10.1371/journal.pone.0191683</a>
      </>
    ),
    doi: "https://doi.org/10.1371/journal.pone.0191683",
  },
];

// Group publications by year
function groupByYear(pubs: Publication[]): Map<number, Publication[]> {
  const map = new Map<number, Publication[]>();
  for (const pub of pubs) {
    const arr = map.get(pub.year) ?? [];
    arr.push(pub);
    map.set(pub.year, arr);
  }
  return map;
}

export default function PublicationsPage() {
  const grouped = groupByYear(PUBLICATIONS);
  const years = Array.from(grouped.keys()).sort((a, b) => b - a);

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
            Publication &amp; Research
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[color:var(--text-soft)]">
            Dentists at Roomchang do more than provide clinical care. They are also actively
            involved in research that helps improve diagnosis, treatment planning, materials,
            techniques, and long-term patient outcomes. Through education and research, dental
            professionals continue to advance evidence-based care and bring the latest knowledge
            into everyday clinical practice.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {/* Publications by year */}
        <div className="space-y-14">
          {years.map((year) => (
            <section key={year}>
              <h2 className="font-display text-3xl text-[color:var(--text-main)]">{year}</h2>
              <div className="mt-6 space-y-6">
                {grouped.get(year)!.map((pub, i) => (
                  <article
                    key={i}
                    className="rounded-2xl border border-[color:var(--border-strong)] bg-white p-6 sm:p-8"
                  >
                    <span className="inline-block rounded-full bg-[color:var(--brand-soft)] px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-deep)]">
                      {pub.label}
                    </span>
                    <h3 className="mt-3 font-display text-lg leading-snug text-[color:var(--text-main)]">
                      {pub.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--text-soft)]">
                      {pub.citation}
                    </p>
                    <a
                      href={pub.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--brand-deep)] transition hover:text-[color:var(--brand)]"
                    >
                      Read full paper
                      <ExternalLink size={13} strokeWidth={2} aria-hidden="true" />
                    </a>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-[color:var(--brand-soft)] px-8 py-8 text-center">
          <h3 className="font-display text-2xl text-[color:var(--brand-deep)]">
            Interested in collaborating?
          </h3>
          <p className="mt-2 text-sm text-[color:var(--text-soft)]">
            Roomchang welcomes research collaborations with universities and dental
            institutions worldwide.
          </p>
          <Link href="/contact" className="btn-primary mt-5 inline-block">
            Get in Touch
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}
