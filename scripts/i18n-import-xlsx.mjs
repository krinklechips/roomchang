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

const placeholders = (s) => [...String(s ?? "").matchAll(/\{[a-zA-Z0-9_]+\}/g)].map((m) => m[0]).sort().join(",");
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

async function run() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(xlsxPath);

  const kmJson = readJson("km"), zhJson = readJson("zh"), enJson = readJson("en");
  const enFlat = flat(enJson), kmFlat = flat(kmJson), zhFlat = flat(zhJson);

  // Current DB translations, for change detection (skip no-op upserts).
  // Key: `${entity_type}:${entity_id}|${field}|${locale}` -> value
  const dbCurrent = new Map();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const svcKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  let supabase = null;
  if (url && svcKey) {
    supabase = createClient(url, svcKey);
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
        if (typeof r.value === "string") dbCurrent.set(`${r.entity_type}:${r.entity_id}|${r.field}|${r.locale}`, r.value);
      }
      if (data.length < PAGE) break;
    }
  }

  const dbUpserts = []; // { entity_type, entity_id, locale, field, value }
  let uiChanged = 0, dbChanged = 0, skipped = 0;
  const skips = [];

  wb.eachSheet((ws) => {
    if (ws.name.startsWith("➀")) return; // README tab
    ws.eachRow((row, n) => {
      if (n === 1) return; // header
      const store = cellText(row.getCell(1)).trim();
      const ref = cellText(row.getCell(2)).trim();
      const field = cellText(row.getCell(3)).trim();
      const en = cellText(row.getCell(4));
      const editKm = cellText(row.getCell(5));
      const editZh = cellText(row.getCell(6));
      if (!store || !ref) return;

      for (const [locale, edited] of [["km", editKm], ["zh", editZh]]) {
        const newVal = norm(edited);
        if (!newVal) continue; // empty cell = leave as-is (don't wipe)

        // current value (to detect real changes)
        if (store === "ui" && newVal === norm((locale === "km" ? kmFlat : zhFlat)[ref])) continue;

        // placeholder safety against the English reference
        if (placeholders(newVal) !== placeholders(en)) {
          skipped++;
          skips.push(`${ws.name} · ${ref}${field ? "|" + field : ""} (${locale}): placeholder mismatch`);
          continue;
        }

        if (store === "ui") {
          setDeep(locale === "km" ? kmJson : zhJson, ref, newVal);
          uiChanged++;
        } else if (store === "db") {
          const ci = ref.indexOf(":");
          const entity_type = ref.slice(0, ci);
          const entity_id = ref.slice(ci + 1);
          if (norm(dbCurrent.get(`${entity_type}:${entity_id}|${field}|${locale}`)) === newVal) continue; // no-op
          dbUpserts.push({ entity_type, entity_id, locale, field, value: newVal });
          dbChanged++;
        }
      }
    });
  });

  console.log(`${dry ? "[DRY] " : ""}UI changes: ${uiChanged} · DB changes: ${dbChanged} · skipped (placeholder): ${skipped}`);
  if (skips.length) console.log("  Skipped:\n   - " + skips.slice(0, 30).join("\n   - "));

  if (dry) { console.log("Dry run — nothing written."); return; }

  // Write UI files
  if (uiChanged) {
    fs.writeFileSync(path.join(ROOT, "messages/km.json"), JSON.stringify(kmJson, null, 2) + "\n");
    fs.writeFileSync(path.join(ROOT, "messages/zh.json"), JSON.stringify(zhJson, null, 2) + "\n");
    console.log(`  ✓ wrote messages/km.json + messages/zh.json`);
  }

  // Upsert DB rows
  if (dbChanged) {
    if (!supabase) { console.error("✗ SUPABASE_SERVICE_ROLE_KEY missing — DB changes NOT applied."); process.exit(1); }
    // chunk to stay well under limits
    for (let i = 0; i < dbUpserts.length; i += 200) {
      const chunk = dbUpserts.slice(i, i + 200);
      const { error } = await supabase.from("content_translations")
        .upsert(chunk, { onConflict: "entity_type,entity_id,locale,field" });
      if (error) { console.error("✗ upsert failed:", error.message); process.exit(1); }
    }
    console.log(`  ✓ upserted ${dbUpserts.length} content_translations rows`);
  }
  console.log("Done. Run `npm run build` to confirm nothing broke.");
}

run().catch((e) => { console.error(e); process.exit(1); });
