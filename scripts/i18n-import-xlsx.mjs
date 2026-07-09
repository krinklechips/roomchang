/**
 * Re-import an edited review workbook (.xlsx from i18n-export-xlsx.mjs) back into
 * BOTH stores:
 *   - store=ui  → messages/{km,zh}.json
 *   - store=db  → content_translations (Supabase upsert)
 *
 *   node --env-file=.env scripts/i18n-import-xlsx.mjs [path/to/edited.xlsx] [--dry]
 *
 * Safety: an edit is SKIPPED (and reported) if it drops or changes an ICU
 * {placeholder}, so interpolation can never break. Defaults to the file at
 * docs/translations/roomchang-translations.xlsx. Run a --dry first.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ExcelJS from "exceljs";
import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dry = process.argv.includes("--dry");
const xlsxPath = process.argv.find((a, i) => i >= 2 && !a.startsWith("--")) ||
  path.join(ROOT, "docs/translations/roomchang-translations.xlsx");

const placeholders = (s) => [...String(s ?? "").matchAll(/\{[a-zA-Z0-9_]+\}/g)].map((m) => m[0]).sort((a, b) => a.localeCompare(b)).join(",");
// Normalize for comparison: Excel/Sheets round-trips newlines as \r\n; collapse
// to \n and trim so an untouched multi-line cell isn't seen as an edit.
const norm = (s) => String(s ?? "").replace(/\r\n?/g, "\n").trim();
const cellText = (c) => {
  const v = c?.value;
  if (v == null) return "";
  if (typeof v === "object" && Array.isArray(v.richText)) return v.richText.map((t) => t.text).join("");
  return String(v);
};

// messages/*.json helpers
const readJson = (l) => JSON.parse(fs.readFileSync(path.join(ROOT, `messages/${l}.json`), "utf8"));
const flat = (o, p = "", a = {}) => {
  for (const [k, v] of Object.entries(o || {})) {
    const key = p ? `${p}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flat(v, key, a); else a[key] = v;
  }
  return a;
};
const setDeep = (obj, dotted, val) => {
  const parts = dotted.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== "object" || cur[parts[i]] == null) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = val;
};

// Snapshot the current km/zh DB translations for no-op change detection.
// Key: `${entity_type}:${entity_id}|${field}|${locale}` -> value (arrays newline-joined).
async function loadDbTranslations(supabase) {
  const dbCurrent = new Map();
  // Paginate — Supabase caps a single select at 1000 rows; content has more,
  // and a truncated snapshot would falsely flag untouched rows as edits.
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("content_translations")
      .select("entity_type, entity_id, locale, field, value")
      .in("locale", ["km", "zh"])
      .range(from, from + PAGE - 1);
    if (error) { console.warn("⚠ could not load current DB translations:", error.message); break; }
    for (const r of data) {
      const k = `${r.entity_type}:${r.entity_id}|${r.field}|${r.locale}`;
      if (typeof r.value === "string") dbCurrent.set(k, r.value);
      // list fields are stored as JSON arrays; compare against the newline-joined cell
      else if (Array.isArray(r.value) && r.value.every((x) => typeof x === "string")) dbCurrent.set(k, r.value.join("\n"));
    }
    if (data.length < PAGE) break;
  }
  return dbCurrent;
}

// Apply one edited (locale, value) cell into the right store, mutating ctx.
function applyEdit(ctx, { store, ref, field, en, sheetName }, locale, edited) {
  const newVal = norm(edited);
  if (!newVal) return; // empty cell = leave as-is (don't wipe)

  // current value (to detect real changes)
  if (store === "ui" && newVal === norm((locale === "km" ? ctx.kmFlat : ctx.zhFlat)[ref])) return;

  // placeholder safety against the English reference
  if (placeholders(newVal) !== placeholders(en)) {
    ctx.stats.skipped++;
    ctx.skips.push(`${sheetName} · ${ref}${field ? "|" + field : ""} (${locale}): placeholder mismatch`);
    return;
  }

  if (store === "ui") {
    setDeep(locale === "km" ? ctx.kmJson : ctx.zhJson, ref, newVal);
    ctx.stats.uiChanged++;
    return;
  }
  if (store === "db" || store === "db-array") {
    const ci = ref.indexOf(":");
    const entity_type = ref.slice(0, ci);
    const entity_id = ref.slice(ci + 1);
    if (norm(ctx.dbCurrent.get(`${entity_type}:${entity_id}|${field}|${locale}`)) === newVal) return; // no-op
    // db-array: each line is one list item → store as a JSON array
    const value = store === "db-array"
      ? newVal.split("\n").map((s) => s.trim()).filter(Boolean)
      : newVal;
    ctx.dbUpserts.push({ entity_type, entity_id, locale, field, value });
    ctx.stats.dbChanged++;
  }
}

// Columns: 1 store · 2 ref · 3 field · 4 Section · 5 English · 6 Khmer · 7 Chinese
function processRow(ctx, row, n, sheetName) {
  if (n === 1) return; // header
  const store = cellText(row.getCell(1)).trim();
  const ref = cellText(row.getCell(2)).trim();
  const field = cellText(row.getCell(3)).trim();
  const en = cellText(row.getCell(5));
  if (!store || !ref) return;
  const meta = { store, ref, field, en, sheetName };
  applyEdit(ctx, meta, "km", cellText(row.getCell(6)));
  applyEdit(ctx, meta, "zh", cellText(row.getCell(7)));
}

async function writeResults(ctx, supabase) {
  if (ctx.stats.uiChanged) {
    fs.writeFileSync(path.join(ROOT, "messages/km.json"), JSON.stringify(ctx.kmJson, null, 2) + "\n");
    fs.writeFileSync(path.join(ROOT, "messages/zh.json"), JSON.stringify(ctx.zhJson, null, 2) + "\n");
    console.log(`  ✓ wrote messages/km.json + messages/zh.json`);
  }
  if (ctx.stats.dbChanged) {
    if (!supabase) { console.error("✗ SUPABASE_SERVICE_ROLE_KEY missing — DB changes NOT applied."); process.exit(1); }
    // chunk to stay well under limits
    for (let i = 0; i < ctx.dbUpserts.length; i += 200) {
      const chunk = ctx.dbUpserts.slice(i, i + 200);
      const { error } = await supabase.from("content_translations")
        .upsert(chunk, { onConflict: "entity_type,entity_id,locale,field" });
      if (error) { console.error("✗ upsert failed:", error.message); process.exit(1); }
    }
    console.log(`  ✓ upserted ${ctx.dbUpserts.length} content_translations rows`);
  }
  console.log("Done. Run `npm run build` to confirm nothing broke.");
}

async function run() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);

  const kmJson = readJson("km"), zhJson = readJson("zh");
  const kmFlat = flat(kmJson), zhFlat = flat(zhJson);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = url && svcKey ? createClient(url, svcKey) : null;
  const dbCurrent = supabase ? await loadDbTranslations(supabase) : new Map();

  const ctx = {
    kmJson, zhJson, kmFlat, zhFlat, dbCurrent,
    dbUpserts: [], // { entity_type, entity_id, locale, field, value }
    stats: { uiChanged: 0, dbChanged: 0, skipped: 0 },
    skips: [],
  };

  wb.eachSheet((ws) => {
    if (ws.name.startsWith("➀")) return; // README tab
    ws.eachRow((row, n) => processRow(ctx, row, n, ws.name));
  });

  const { uiChanged, dbChanged, skipped } = ctx.stats;
  console.log(`${dry ? "[DRY] " : ""}UI changes: ${uiChanged} · DB changes: ${dbChanged} · skipped (placeholder): ${skipped}`);
  if (ctx.skips.length) console.log("  Skipped:\n   - " + ctx.skips.slice(0, 30).join("\n   - "));

  if (dry) { console.log("Dry run — nothing written."); return; }
  await writeResults(ctx, supabase);
}

run().catch((e) => { console.error(e); process.exit(1); });
