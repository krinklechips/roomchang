/**
 * Export EN/KH/CN translations to a review workbook (.xlsx), organised by the
 * SITE MENU (one tab per page: Home, About, Services, Technology…).
 *
 *   node --env-file=.env scripts/i18n-export-xlsx.mjs
 *
 * Each row shows English next to the EXISTING Khmer + Chinese (pre-filled), so
 * the reviewer corrects wording rather than starting blank. Covers both stores:
 *   - UI strings  (messages/{en,km,zh}.json)
 *   - DB content  (content_translations + source tables) — only the fields that
 *     are actually translatable (names, codes, credentials, prices are excluded).
 *
 * Reviewer edits the Khmer / Chinese columns, sends it back, we re-import with
 * scripts/i18n-import-xlsx.mjs.  Output: docs/translations/roomchang-translations.xlsx
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ExcelJS from "exceljs";
import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (l) => JSON.parse(fs.readFileSync(path.join(ROOT, `messages/${l}.json`), "utf8"));
const flat = (o, p = "", a = {}) => {
  for (const [k, v] of Object.entries(o || {})) {
    const key = p ? `${p}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flat(v, key, a); else a[key] = v;
  }
  return a;
};

// ─── Site menu → which UI namespaces + DB entity types live on that page ─────
// Tabs come out in this order. `ns` = top-level message namespaces; `db` =
// content_translations entity types.
const PAGES = [
  { tab: "Global — menu, footer, chat", ns: ["nav", "header", "mobileNav", "footer", "floatingContact", "languageSwitcher", "consent", "common", "chatbot", "datePicker", "zoomableImage", "communityGallery", "interactiveSteps", "notFound", "errorPage", "blocks", "checklistForm"], db: [] },
  { tab: "Home", ns: ["homeHero", "heroSlideshow", "homeStats", "homeHighlights", "homeServices", "homeTestimonials"], db: ["homepage_feature_card"] },
  { tab: "About", ns: ["about", "aboutTimeline", "directorMessage", "visionMission", "facilities", "partnerships", "testimonialsPage"], db: ["branch", "testimonial"] },
  { tab: "Services", ns: ["services"], db: ["service"] },
  { tab: "Doctors", ns: ["team", "doctorGrid"], db: ["doctor"] },
  { tab: "Technology", ns: ["technology", "technologyDetail"], db: ["technology"] },
  { tab: "International", ns: ["international"], db: ["international_why_item", "international_step", "international_popular_treatment"] },
  { tab: "Pricing", ns: ["pricing", "implantsComparison"], db: ["pricing_item", "pricing_category"] },
  { tab: "Clinical Results", ns: ["clinicalResults", "clinicalResultsGrid", "caseDetail"], db: ["clinical_case"] },
  { tab: "Blog & FAQ", ns: ["blogIndex", "faqPage", "publications", "dentistTalks", "newsPage", "newsDetail", "communityPage", "communityDetail"], db: ["faq", "news_article", "community_article"] },
  { tab: "Careers", ns: ["careers", "careersDetail"], db: ["career_position"] },
  { tab: "Contact", ns: ["contact", "contactForm", "branchDetail"], db: [] },
  { tab: "Legal", ns: ["privacyPolicy", "termsOfService", "cookiePolicy", "disclaimer", "bookingPolicy"], db: [] },
];

const nsToTab = {}, dbToTab = {};
for (const p of PAGES) { for (const n of p.ns) nsToTab[n] = p.tab; for (const d of p.db) dbToTab[d] = p.tab; }
const tabOrder = PAGES.map((p) => p.tab).concat(["Other"]);

// Friendly "Section" label shown inside a tab (so the reviewer has context).
const SECTION = {
  nav: "Navigation", header: "Header", mobileNav: "Mobile menu", footer: "Footer",
  floatingContact: "Floating contact", languageSwitcher: "Language switcher", consent: "Cookie banner",
  common: "Common", chatbot: "Chatbot", homeHero: "Hero", heroSlideshow: "Slideshow", homeStats: "Stats",
  homeHighlights: "Highlights", homeServices: "Services teaser", homeTestimonials: "Testimonials",
  about: "About", aboutTimeline: "Timeline", directorMessage: "Director's message", visionMission: "Vision/values",
  facilities: "Facilities", partnerships: "Partnerships", testimonialsPage: "Testimonials", careers: "Careers",
  careersDetail: "Career detail", branchDetail: "Branch detail", services: "Services", team: "Team",
  doctorGrid: "Doctors grid", contact: "Contact", contactForm: "Contact form", international: "International",
  technology: "Technology", technologyDetail: "Technology detail", pricing: "Pricing",
  implantsComparison: "Implants comparison", clinicalResults: "Clinical results",
  clinicalResultsGrid: "Results grid", caseDetail: "Case detail", blogIndex: "Blog", faqPage: "FAQ",
  publications: "Publications", dentistTalks: "Dentist talks", newsPage: "News", newsDetail: "News detail",
  communityPage: "Community", communityDetail: "Community detail", privacyPolicy: "Privacy",
  termsOfService: "Terms", cookiePolicy: "Cookie policy", disclaimer: "Disclaimer", bookingPolicy: "Booking policy",
  // DB entity types
  service: "Service (content)", technology_db: "Technology (content)", doctor: "Doctor bios",
  faq: "FAQ items", pricing_item: "Price items", pricing_category: "Price categories",
  clinical_case: "Clinical cases", community_article: "Community articles", news_article: "News articles",
  testimonial: "Testimonials", career_position: "Job posts", branch: "Branches",
  homepage_feature_card: "Home cards", international_why_item: "Why-us items",
  international_step: "Steps", international_popular_treatment: "Popular treatments",
};

// DB entity type → source table (id column is "id").
const DB_TABLE = {
  service: "services", technology: "technology", doctor: "doctors", faq: "faq_items",
  pricing_item: "pricing_items", pricing_category: "pricing_categories", clinical_case: "clinical_cases",
  community_article: "community_articles", news_article: "news_articles", testimonial: "testimonials",
  career_position: "career_positions", branch: "branches", homepage_feature_card: "homepage_feature_cards",
  international_why_item: "international_why_items", international_step: "international_steps",
  international_popular_treatment: "international_popular_treatments",
};

async function collectDbRows() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) { console.warn("⚠ No Supabase creds — UI strings only."); return []; }
  const supabase = createClient(url, key);
  const rows = [];

  for (const [entityType, table] of Object.entries(DB_TABLE)) {
    const tab = dbToTab[entityType];
    if (!tab) continue;
    const { data: src, error } = await supabase.from(table).select("*");
    if (error) { console.warn(`  ⚠ ${table}: ${error.message}`); continue; }
    const enById = new Map(src.map((r) => [String(r.id), r]));

    const { data: tr } = await supabase
      .from("content_translations")
      .select("entity_id, locale, field, value")
      .eq("entity_type", entityType);

    // Translatable fields = exactly the fields that have ANY translation for this
    // type. That cleanly excludes names, codes, credentials, prices, slugs, urls.
    const translatableFields = new Set();
    const trBy = new Map(); // `${id}|${field}` -> {km, zh}
    for (const t of tr ?? []) {
      translatableFields.add(t.field);
      const k = `${t.entity_id}|${t.field}`;
      if (!trBy.has(k)) trBy.set(k, {});
      trBy.get(k)[t.locale] = t.value;
    }
    const sectionLabel = SECTION[entityType] ?? entityType;

    const str = (v) => (typeof v === "string" ? v : "");
    const isStrArray = (v) => Array.isArray(v) && v.length > 0 && v.every((x) => typeof x === "string");
    for (const [id, row] of enById) {
      for (const field of translatableFields) {
        const enVal = row[field];
        const t = trBy.get(`${id}|${field}`) || {};
        const base = { tab, section: sectionLabel, ref: `${entityType}:${id}`, field };
        if (typeof enVal === "string" && enVal.trim()) {
          // scalar text
          rows.push({ ...base, store: "db", en: enVal, km: str(t.km), zh: str(t.zh) });
        } else if (isStrArray(enVal)) {
          // list of strings → one row, items on separate lines (round-trips as an array)
          rows.push({
            ...base, store: "db-array",
            en: enVal.join("\n"),
            km: isStrArray(t.km) ? t.km.join("\n") : "",
            zh: isStrArray(t.zh) ? t.zh.join("\n") : "",
          });
        }
        // objects / arrays-of-blocks (rich long-form) are intentionally skipped
      }
    }
  }
  return rows;
}

async function run() {
  const en = flat(read("en")), km = flat(read("km")), zh = flat(read("zh"));
  const all = [];

  // UI strings — skip invariants (identical across all three = brand/number)
  for (const key of Object.keys(en)) {
    const e = en[key];
    if (typeof e !== "string") continue;
    const k = km[key], z = zh[key];
    if (e === k && e === z) continue;
    const top = key.split(".")[0];
    all.push({
      tab: nsToTab[top] ?? "Other", section: SECTION[top] ?? top, store: "ui", ref: key, field: "",
      en: e, km: typeof k === "string" ? k : "", zh: typeof z === "string" ? z : "",
    });
  }
  all.push(...(await collectDbRows()));

  // Group by tab
  const byTab = new Map();
  for (const r of all) { if (!byTab.has(r.tab)) byTab.set(r.tab, []); byTab.get(r.tab).push(r); }
  const tabs = tabOrder.filter((t) => byTab.has(t));

  const wb = new ExcelJS.Workbook();
  wb.creator = "Roomchang i18n export";

  const idx = wb.addWorksheet("➀ READ ME", { properties: { tabColor: { argb: "FFCC3771" } } });
  idx.columns = [{ width: 3 }, { width: 64 }];
  [
    ["", "Roomchang — Khmer / Chinese translation review"],
    ["", ""],
    ["", "• Tabs = the site menu (Home, About, Services, Technology…)."],
    ["", "• Each row: English, then the CURRENT Khmer + Chinese (already filled in)."],
    ["", "• Fix the wording in the 'Khmer (edit here)' / 'Chinese (edit here)' columns."],
    ["", "• An EMPTY Khmer/Chinese cell = not translated yet — please fill it in."],
    ["", "• Don't touch the English column. The 'Section' column just shows where on"],
    ["", "  the page the text appears."],
    ["", "• Keep {placeholders} like {phone} {count} exactly as-is."],
    ["", "• Some cells are LISTS (e.g. service features, doctor specialties): one"],
    ["", "  item per line — keep the same number of lines as the English."],
    ["", "• Brand names (Roomchang, Invisalign, WhatsApp…) stay in English on purpose."],
    ["", "• When done: File → Download → Microsoft Excel (.xlsx) and send it back."],
    ["", ""],
    ["", `Generated: ${process.env.EXPORT_STAMP || "(stamped on commit)"} · ${tabs.length} tabs · ${all.length} strings`],
  ].forEach((r) => idx.addRow(r));
  idx.getRow(1).font = { bold: true, size: 14 };

  for (const tab of tabs) {
    const ws = wb.addWorksheet(tab.replace(/[:\\/?*\[\]]/g, "-").slice(0, 31));
    ws.columns = [
      { header: "store", key: "store", width: 6 },
      { header: "ref", key: "ref", width: 20 },
      { header: "field", key: "field", width: 12 },
      { header: "Section", key: "section", width: 18 },
      { header: "English (reference — do not edit)", key: "en", width: 52 },
      { header: "Khmer (edit here)", key: "km", width: 48 },
      { header: "Chinese (edit here)", key: "zh", width: 48 },
      { header: "Notes for Claude", key: "notes", width: 22 },
    ];
    byTab.get(tab)
      .sort((a, b) => (a.section === b.section ? 0 : a.section.localeCompare(b.section)))
      .forEach((r) => ws.addRow({ store: r.store, ref: r.ref, field: r.field, section: r.section, en: r.en, km: r.km, zh: r.zh, notes: "" }));
    const head = ws.getRow(1);
    head.font = { bold: true };
    head.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF7D6E2" } };
    ws.views = [{ state: "frozen", ySplit: 1, xSplit: 0 }];
    for (const c of ["store", "ref", "field"]) ws.getColumn(c).hidden = true;
    for (const c of ["en", "km", "zh"]) ws.getColumn(c).alignment = { wrapText: true, vertical: "top" };
  }

  const outDir = path.join(ROOT, "docs/translations");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "roomchang-translations.xlsx");
  await wb.xlsx.writeFile(outPath);
  const dbN = all.filter((r) => r.store === "db" || r.store === "db-array").length;
  const listN = all.filter((r) => r.store === "db-array").length;
  const filled = all.filter((r) => r.km && r.zh).length;
  console.log(`Wrote ${all.length} rows across ${tabs.length} tabs → ${path.relative(ROOT, outPath)}`);
  console.log(`  UI: ${all.length - dbN} · DB content: ${dbN} (incl. ${listN} list fields) · already-translated (km+zh): ${filled}`);
}

run().catch((e) => { console.error(e); process.exit(1); });
