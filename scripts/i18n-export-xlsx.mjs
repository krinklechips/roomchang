/**
 * Export EN/KH/CN translations to a MULTI-TAB review workbook (.xlsx).
 *
 *   node --env-file=.env scripts/i18n-export-xlsx.mjs
 *
 * One tab per page/section so the reviewer always knows what they're editing.
 * Covers BOTH stores:
 *   - UI strings   (messages/{en,km,zh}.json)        → tabs by namespace section
 *   - DB content   (content_translations + sources)  → tabs by content type
 *
 * The reviewer edits the "Khmer" / "Chinese" columns in Google Sheets, then
 * sends the file back; re-import with scripts/i18n-import-xlsx.mjs.
 *
 * Output: docs/translations/roomchang-translations.xlsx
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ExcelJS from "exceljs";
import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (l) => JSON.parse(fs.readFileSync(path.join(ROOT, `messages/${l}.json`), "utf8"));

// ─── UI strings (messages/*.json) ──────────────────────────────────────────
const flat = (o, p = "", a = {}) => {
  for (const [k, v] of Object.entries(o || {})) {
    const key = p ? `${p}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flat(v, key, a);
    else a[key] = v;
  }
  return a;
};

const UI_SECTION = {
  chatbot: "Chatbot (Roomy)", nav: "Navigation", header: "Header", mobileNav: "Mobile menu",
  footer: "Footer", floatingContact: "Floating contact", languageSwitcher: "Language switcher",
  consent: "Cookie banner",
  homeHero: "Home — hero", heroSlideshow: "Home — slideshow", homeStats: "Home — stats",
  homeHighlights: "Home — highlights", homeServices: "Home — services", homeTestimonials: "Home — testimonials",
  about: "About — index", aboutTimeline: "About — timeline", services: "Services", team: "Team",
  doctorGrid: "Doctors grid", contact: "Contact", contactForm: "Contact form", international: "International",
  technology: "Technology", technologyDetail: "Technology — detail", pricing: "Pricing",
  clinicalResults: "Clinical results", clinicalResultsGrid: "Clinical results grid", checklistForm: "Checklist form",
  caseDetail: "Case detail", common: "Common", communityPage: "Community", newsPage: "News",
  notFound: "404 page", errorPage: "Error page", datePicker: "Date picker", zoomableImage: "Image zoom",
  communityGallery: "Community gallery", interactiveSteps: "Interactive steps",
  directorMessage: "About — director message", visionMission: "About — vision/values",
  facilities: "About — facilities", partnerships: "About — partnerships", testimonialsPage: "About — testimonials",
  careers: "About — careers", careersDetail: "About — career detail", branchDetail: "About — branch detail",
  blogIndex: "Blog — index", faqPage: "Blog — FAQ", publications: "Blog — publications",
  dentistTalks: "Blog — dentist talks", newsDetail: "News detail", communityDetail: "Community detail",
  implantsComparison: "Pricing — implants comparison", blocks: "CMS blocks",
  privacyPolicy: "Legal — privacy", termsOfService: "Legal — terms", cookiePolicy: "Legal — cookie",
  disclaimer: "Legal — disclaimer", bookingPolicy: "Legal — booking",
};
const uiSectionFor = (key) => {
  const top = key.split(".")[0];
  return `UI · ${UI_SECTION[top] || top}`;
};

// ─── DB content (content_translations + source tables) ──────────────────────
// entity_type → { table, section } (id column is always "id").
const DB = {
  service: { table: "services", section: "Content · Services" },
  technology: { table: "technology", section: "Content · Technology" },
  doctor: { table: "doctors", section: "Content · Doctors" },
  faq: { table: "faq_items", section: "Content · FAQ" },
  pricing_item: { table: "pricing_items", section: "Content · Pricing" },
  pricing_category: { table: "pricing_categories", section: "Content · Pricing" },
  clinical_case: { table: "clinical_cases", section: "Content · Clinical results" },
  community_article: { table: "community_articles", section: "Content · Community" },
  news_article: { table: "news_articles", section: "Content · News" },
  testimonial: { table: "testimonials", section: "Content · Testimonials" },
  career_position: { table: "career_positions", section: "Content · Careers" },
  branch: { table: "branches", section: "Content · Branches" },
  homepage_feature_card: { table: "homepage_feature_cards", section: "Content · Home cards" },
  international_why_item: { table: "international_why_items", section: "Content · International" },
  international_step: { table: "international_steps", section: "Content · International" },
  international_popular_treatment: { table: "international_popular_treatments", section: "Content · International" },
};

async function collectDbRows() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("⚠ No Supabase credentials in env — skipping DB content (UI strings only).");
    return [];
  }
  const supabase = createClient(url, key);
  const rows = [];

  for (const [entityType, cfg] of Object.entries(DB)) {
    // English base, keyed by id → { field: value }
    const { data: src, error: srcErr } = await supabase.from(cfg.table).select("*");
    if (srcErr) { console.warn(`  ⚠ ${cfg.table}: ${srcErr.message}`); continue; }
    const enById = new Map(src.map((r) => [String(r.id), r]));

    // Existing translations
    const { data: tr } = await supabase
      .from("content_translations")
      .select("entity_id, locale, field, value")
      .eq("entity_type", entityType);
    const trBy = new Map(); // `${id}|${field}` -> { km, zh }
    for (const t of tr ?? []) {
      const k = `${t.entity_id}|${t.field}`;
      if (!trBy.has(k)) trBy.set(k, {});
      trBy.get(k)[t.locale] = t.value;
    }

    for (const [id, row] of enById) {
      for (const [field, enVal] of Object.entries(row)) {
        // Only human-editable scalar text (skip ids, urls, json blocks, arrays).
        if (typeof enVal !== "string") continue;
        if (!enVal.trim()) continue;
        if (["id", "slug", "icon", "href", "image", "image_src", "src", "type", "coords"].includes(field)) continue;
        if (/^https?:\/\//.test(enVal) || /\.(png|jpe?g|webp|svg|gif|mp4)$/i.test(enVal)) continue;
        const t = trBy.get(`${id}|${field}`) || {};
        const km = typeof t.km === "string" ? t.km : "";
        const zh = typeof t.zh === "string" ? t.zh : "";
        // Skip rows with nothing to review (English only, no translation expected)
        // ONLY when there's genuinely no translatable text — keep untranslated
        // ones (empty km/zh) so the reviewer can fill them in.
        rows.push({
          section: cfg.section, store: "db", ref: `${entityType}:${id}`, field,
          en: enVal, km, zh,
        });
      }
    }
  }
  return rows;
}

// ─── Assemble workbook ──────────────────────────────────────────────────────
function sheetName(name, used) {
  let s = name.replace(/[:\\/?*\[\]]/g, "-").slice(0, 31);
  let n = s, i = 2;
  while (used.has(n)) { n = `${s.slice(0, 28)} ${i++}`; }
  used.add(n);
  return n;
}

async function run() {
  const en = flat(read("en")), km = flat(read("km")), zh = flat(read("zh"));

  const all = [];
  // UI rows (skip invariants: identical across all three = brand/number, nothing to review)
  for (const key of Object.keys(en)) {
    const e = en[key];
    if (typeof e !== "string") continue;
    const k = km[key], z = zh[key];
    if (e === k && e === z) continue;
    all.push({ section: uiSectionFor(key), store: "ui", ref: key, field: "", en: e, km: typeof k === "string" ? k : "", zh: typeof z === "string" ? z : "" });
  }
  // DB rows
  const dbRows = await collectDbRows();
  all.push(...dbRows);

  // Group by section
  const bySection = new Map();
  for (const r of all) {
    if (!bySection.has(r.section)) bySection.set(r.section, []);
    bySection.get(r.section).push(r);
  }
  const sections = [...bySection.keys()].sort();

  const wb = new ExcelJS.Workbook();
  wb.creator = "Roomchang i18n export";

  // Index/README tab
  const idx = wb.addWorksheet("➀ READ ME", { properties: { tabColor: { argb: "FFCC3771" } } });
  idx.columns = [{ width: 4 }, { width: 60 }];
  const note = [
    ["", "Roomchang — Khmer / Chinese translation review"],
    ["", ""],
    ["", "• Each tab below is one section of the website."],
    ["", "• Read the English column, then fix the wording in the"],
    ["", "  'Khmer (edit here)' and 'Chinese (edit here)' columns."],
    ["", "• Do NOT touch the English column or the hidden ref columns."],
    ["", "• Keep {placeholders} like {phone} {count} exactly as-is."],
    ["", "• Brand names (Roomchang, Invisalign, WhatsApp…) stay in English."],
    ["", "• Empty Khmer/Chinese cell = not translated yet; please fill it in."],
    ["", "• When done: File → Download → Microsoft Excel (.xlsx) and send it back."],
    ["", ""],
    ["", `Generated: ${process.env.EXPORT_STAMP || "(date stamped on commit)"}`],
    ["", `Sections: ${sections.length} · Strings: ${all.length}`],
  ];
  note.forEach((r) => idx.addRow(r));
  idx.getRow(1).font = { bold: true, size: 14 };

  const used = new Set(["➀ READ ME"]);
  for (const section of sections) {
    const ws = wb.addWorksheet(sheetName(section, used));
    ws.columns = [
      { header: "store", key: "store", width: 6 },
      { header: "ref", key: "ref", width: 22 },
      { header: "field", key: "field", width: 14 },
      { header: "English (reference — do not edit)", key: "en", width: 55 },
      { header: "Khmer (edit here)", key: "km", width: 50 },
      { header: "Chinese (edit here)", key: "zh", width: 50 },
      { header: "Notes for Claude", key: "notes", width: 24 },
    ];
    for (const r of bySection.get(section)) {
      ws.addRow({ store: r.store, ref: r.ref, field: r.field, en: r.en, km: r.km, zh: r.zh, notes: "" });
    }
    // Header style + freeze + wrap + hide the machine columns
    const head = ws.getRow(1);
    head.font = { bold: true };
    head.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF7D6E2" } };
    ws.views = [{ state: "frozen", ySplit: 1, xSplit: 0 }];
    ws.getColumn("store").hidden = true;
    ws.getColumn("ref").hidden = true;
    ws.getColumn("field").hidden = true;
    ws.getColumn("en").alignment = { wrapText: true, vertical: "top" };
    ws.getColumn("km").alignment = { wrapText: true, vertical: "top" };
    ws.getColumn("zh").alignment = { wrapText: true, vertical: "top" };
  }

  const outDir = path.join(ROOT, "docs/translations");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "roomchang-translations.xlsx");
  await wb.xlsx.writeFile(outPath);
  console.log(`Wrote ${all.length} rows across ${sections.length} tabs → ${path.relative(ROOT, outPath)}`);
  console.log(`  UI strings: ${all.filter((r) => r.store === "ui").length} · DB content: ${all.filter((r) => r.store === "db").length}`);
}

run().catch((e) => { console.error(e); process.exit(1); });
