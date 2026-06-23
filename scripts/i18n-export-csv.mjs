// Export EN/KH/CN translations to a review CSV for non-technical reviewers.
// Friend opens it in Google Sheets / Excel, edits the Khmer / Chinese columns,
// exports back to CSV, and we re-import with scripts/i18n-import-csv.mjs.
//
//   node scripts/i18n-export-csv.mjs
//
// Output: docs/translations/roomchang-translations.csv (UTF-8 with BOM).
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (l) => JSON.parse(fs.readFileSync(path.join(ROOT, `messages/${l}.json`), "utf8"));
const en = read("en"), km = read("km"), zh = read("zh");

const flat = (o, p = "", a = {}) => {
  for (const [k, v] of Object.entries(o || {})) {
    const key = p ? `${p}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flat(v, key, a);
    else a[key] = v;
  }
  return a;
};
const fe = flat(en), fk = flat(km), fz = flat(zh);

// Friendly section name from the top-level namespace.
const SECTION = {
  chatbot: "Chatbot (Roomy)", nav: "Navigation", header: "Header", mobileNav: "Mobile menu",
  footer: "Footer", floatingContact: "Floating contact", languageSwitcher: "Language switcher",
  homeHero: "Home — hero", heroSlideshow: "Home — slideshow", homeStats: "Home — stats",
  homeHighlights: "Home — highlights", homeServices: "Home — services", homeTestimonials: "Home — testimonials",
  about: "About — index", aboutTimeline: "About — timeline", services: "Services", team: "Team",
  doctorGrid: "Doctors grid", contact: "Contact", contactForm: "Contact form", international: "International",
  technology: "Technology", technologyDetail: "Technology — detail", pricing: "Pricing",
  clinicalResults: "Clinical results", clinicalResultsGrid: "Clinical results grid", checklistForm: "Checklist form",
  caseDetail: "Case detail", common: "Common", communityPage: "Community", newsPage: "News",
  notFound: "404 page", errorPage: "Error page", datePicker: "Date picker", zoomableImage: "Image zoom",
  communityGallery: "Community gallery", interactiveSteps: "Interactive steps",
  directorMessage: "About — director's message", visionMission: "About — vision/mission/values",
  facilities: "About — facilities", partnerships: "About — partnerships", testimonialsPage: "About — testimonials",
  careers: "About — careers", careersDetail: "About — career detail", branchDetail: "About — branch detail",
  blogIndex: "Blog — index", faqPage: "Blog — FAQ", publications: "Blog — publications",
  dentistTalks: "Blog — dentist talks", newsDetail: "News detail", communityDetail: "Community detail",
  implantsComparison: "Pricing — implants comparison", blocks: "CMS blocks",
  privacyPolicy: "Legal — privacy", termsOfService: "Legal — terms", cookiePolicy: "Legal — cookie",
  disclaimer: "Legal — DISCLAIMER (medical)", bookingPolicy: "Legal — booking/cancellation",
};
const sectionFor = (key) => {
  const top = key.split(".")[0];
  return SECTION[top] || top;
};

// Values that are pure invariants (brand names, numbers, identical across locales).
const isInvariant = (e, k, z) => e === k && e === z;

const csvCell = (s) => {
  const v = String(s ?? "");
  return `"${v.replace(/"/g, '""')}"`;
};

const rows = [
  ["Section", "key", "English (reference — do not edit)", "Khmer (edit here)", "Chinese (edit here)", "Notes for Claude"],
];
const keys = Object.keys(fe).sort((a, b) => {
  const sa = sectionFor(a), sb = sectionFor(b);
  return sa === sb ? a.localeCompare(b) : sa.localeCompare(sb);
});
let skipped = 0;
for (const key of keys) {
  const e = fe[key], k = fk[key], z = fz[key];
  if (typeof e !== "string") continue;
  if (isInvariant(e, k, z)) { skipped++; continue; } // brand names / numbers — nothing to review
  rows.push([sectionFor(key), key, e, k, z, ""]);
}

const csv = "﻿" + rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
const outDir = path.join(ROOT, "docs/translations");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "roomchang-translations.csv");
fs.writeFileSync(outPath, csv);
console.log(`Wrote ${rows.length - 1} rows to ${path.relative(ROOT, outPath)} (skipped ${skipped} brand/number invariants).`);
