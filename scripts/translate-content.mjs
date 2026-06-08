/**
 * Machine-translate DB content into the content_translations table.
 *
 *   node --env-file=.env scripts/translate-content.mjs <entityType> [--force]
 *
 * Reads English content per entity, asks OpenAI to translate the human-readable
 * fields into Khmer (km) and Simplified Chinese (zh) — preserving JSON shape,
 * brand names, prices, codes, and URLs — then upserts one row per
 * (entity_type, entity_id, locale, field) into content_translations.
 *
 * Idempotent: skips (entity, locale) already translated unless --force.
 */
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const LOCALES = { zh: "Simplified Chinese (中文)", km: "Khmer (ខ្មែរ)" };

// Per-entity config: which table, id column, and which fields to translate.
const CONFIGS = {
  service: {
    table: "services", idField: "id", where: { published: true },
    fields: ["name", "description", "eyebrow", "heroDescription", "features", "content"],
  },
  technology: {
    table: "technology", idField: "id",
    fields: ["name", "description", "highlights", "content"],
  },
  community_article: {
    table: "community_articles", idField: "id", where: { published: true },
    fields: ["title", "description", "body"],
  },
  news_article: {
    table: "news_articles", idField: "id", where: { published: true },
    fields: ["title", "description", "body"],
  },
  clinical_case: {
    table: "clinical_cases", idField: "id",
    fields: ["title", "category", "treatment", "duration", "tag", "description", "fullText"],
  },
  doctor: {
    table: "doctors", idField: "id", where: { published: true },
    fields: ["role", "bio", "specialty"],
  },
  faq: {
    table: "faq_items", idField: "id",
    fields: ["question", "answer", "category"],
  },
  testimonial: {
    table: "testimonials", idField: "id", where: { published: true },
    fields: ["quote", "authorTitle"],
  },
};

function sysPrompt(langName) {
  return `You are a professional medical/dental translator. Translate the human-readable text values in the given JSON object into ${langName}, for a dental hospital website.

STRICT RULES:
- Return ONLY a JSON object with the SAME keys and SAME structure as the input.
- Translate ONLY natural-language text (titles, descriptions, headings, body text, labels, list items, button text, quotes).
- DO NOT translate or alter: JSON keys, any "type"/"icon"/"slug"/"href"/"src"/"image"/"id" values, URLs, file paths, prices (e.g. "$550", "AUD $1,642", "MPa"), numbers, ADA codes, and brand/product names — keep these EXACTLY: Roomchang, Invisalign, Clear Aligner (CA), E-Max, CAD/CAM, CBCT, OPG, Beyond, Ortho-Tain, ResMed, ApneaLink Air, ICON, PFM, Myplant Two, Ankylos, Bureau Veritas, ISO, UKAS, Goethe University.
- Preserve any {placeholder} tokens and ®/™ symbols verbatim.
- Use natural, professional ${langName} appropriate for patient-facing healthcare content. Do not romanize the brand name; keep "Roomchang" in Latin letters.`;
}

async function translateObj(obj, langName) {
  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: sysPrompt(langName) },
      { role: "user", content: JSON.stringify(obj) },
    ],
  });
  return JSON.parse(res.choices[0].message.content);
}

/** Rows for an entity type, applying any configured `where` filters. */
function fetchRows(cfg) {
  let q = supabase.from(cfg.table).select("*");
  if (cfg.where) for (const [k, v] of Object.entries(cfg.where)) q = q.eq(k, v);
  return q;
}

/** True if this (entity, locale) already has translations stored. */
async function alreadyTranslated(entityType, id, locale) {
  const { count } = await supabase
    .from("content_translations")
    .select("id", { count: "exact", head: true })
    .eq("entity_type", entityType)
    .eq("entity_id", id)
    .eq("locale", locale);
  return (count ?? 0) > 0;
}

/** Pick only the fields that actually have content to translate. */
function buildSource(row, fields) {
  const src = {};
  for (const f of fields) {
    const val = row[f];
    if (val === null || val === undefined) continue;
    if (Array.isArray(val) && val.length === 0) continue;
    src[f] = val;
  }
  return src;
}

/** One content_translations row per translated field. */
function buildInserts(entityType, id, locale, src, translated) {
  const inserts = [];
  for (const f of Object.keys(src)) {
    if (translated[f] === undefined) continue;
    inserts.push({ entity_type: entityType, entity_id: id, locale, field: f, value: translated[f] });
  }
  return inserts;
}

/** Translate + upsert a single (row, locale), logging the outcome. */
async function translateRowLocale(entityType, cfg, row, id, locale, langName, force) {
  if (!force && (await alreadyTranslated(entityType, id, locale))) {
    process.stdout.write(`  skip ${entityType}#${id} ${locale} (exists)\n`);
    return;
  }
  const src = buildSource(row, cfg.fields);
  if (Object.keys(src).length === 0) return;

  try {
    const translated = await translateObj(src, langName);
    const inserts = buildInserts(entityType, id, locale, src, translated);
    const { error: upErr } = await supabase
      .from("content_translations")
      .upsert(inserts, { onConflict: "entity_type,entity_id,locale,field" });
    if (upErr) console.log(`  ERR ${entityType}#${id} ${locale}: ${upErr.message}`);
    else process.stdout.write(`  ✓ ${entityType}#${id} ${locale} (${inserts.length} fields)\n`);
  } catch (e) {
    console.log(`  FAIL ${entityType}#${id} ${locale}: ${e.message}`);
  }
}

async function run() {
  const entityType = process.argv[2];
  const force = process.argv.includes("--force");
  const cfg = CONFIGS[entityType];
  if (!cfg) {
    console.error("Unknown entity type:", entityType, "\nKnown:", Object.keys(CONFIGS).join(", "));
    process.exit(1);
  }

  const { data: rows, error } = await fetchRows(cfg);
  if (error) { console.error("fetch failed:", error.message); process.exit(1); }
  console.log(`Translating ${rows.length} ${entityType} rows → zh, km`);

  for (const row of rows) {
    const id = String(row[cfg.idField]);
    for (const [locale, langName] of Object.entries(LOCALES)) {
      await translateRowLocale(entityType, cfg, row, id, locale, langName, force);
    }
  }
  console.log("Done.");
}

run().catch((e) => { console.error(e); process.exit(1); });
