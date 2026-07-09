// Re-import an edited review CSV (from i18n-export-csv.mjs) back into the
// Khmer + Chinese message files. Validates that ICU placeholders ({name}, {ref}
// …) still match the English so an edit can't break interpolation.
//
//   node scripts/i18n-import-csv.mjs [path/to/edited.csv] [--dry]
//
// Defaults to docs/translations/roomchang-translations.csv. After a real run,
// rebuild (npm run build) to confirm nothing broke.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dry = process.argv.includes("--dry");
const csvPath = process.argv.find((a, i) => i >= 2 && !a.startsWith("--")) ||
  path.join(ROOT, "docs/translations/roomchang-translations.csv");

// --- minimal RFC-4180 CSV parser (quoted fields, doubled quotes, newlines) ---
// Process a single character. Returns the number of extra characters to skip
// (1 when consuming an escaped "" quote pair, otherwise 0).
function stepCSV(state, c, next, endField, endRow) {
  if (state.inQuotes) {
    if (c === '"') {
      if (next === '"') { state.field += '"'; return 1; }
      state.inQuotes = false;
      return 0;
    }
    state.field += c;
    return 0;
  }
  if (c === '"') state.inQuotes = true;
  else if (c === ",") endField();
  else if (c === "\n") endRow();
  else if (c !== "\r") state.field += c; // bare \r is dropped
  return 0;
}

function parseCSV(text) {
  const src = text.replace(/^﻿/, ""); // strip BOM
  const rows = [];
  const state = { row: [], field: "", inQuotes: false };
  const endField = () => { state.row.push(state.field); state.field = ""; };
  const endRow = () => { endField(); rows.push(state.row); state.row = []; };

  for (let i = 0; i < src.length; i++) {
    i += stepCSV(state, src[i], src[i + 1], endField, endRow);
  }
  if (state.field.length || state.row.length) endRow();
  return rows;
}

const placeholders = (s) => [...String(s ?? "").matchAll(/\{[a-zA-Z0-9_]+\}/g)].map((m) => m[0]).sort((a, b) => a.localeCompare(b)).join(",");

const read = (l) => JSON.parse(fs.readFileSync(path.join(ROOT, `messages/${l}.json`), "utf8"));
const km = read("km"), zh = read("zh"), en = read("en");
const flat = (o, p = "", a = {}) => { for (const [k, v] of Object.entries(o || {})) { const key = p ? `${p}.${k}` : k; if (v && typeof v === "object" && !Array.isArray(v)) flat(v, key, a); else a[key] = v; } return a; };
const fe = flat(en), fkCur = flat(km), fzCur = flat(zh);
const setNested = (obj, dotted, value) => { const parts = dotted.split("."); let cur = obj; for (let i = 0; i < parts.length - 1; i++) { if (typeof cur[parts[i]] !== "object" || cur[parts[i]] === null) cur[parts[i]] = {}; cur = cur[parts[i]]; } cur[parts[parts.length - 1]] = value; };

const rows = parseCSV(fs.readFileSync(csvPath, "utf8"));
const header = rows.shift();
const col = (name) => header.findIndex((h) => h.toLowerCase().includes(name));
const iKey = col("key"), iKm = header.findIndex((h) => /khmer/i.test(h)), iZh = header.findIndex((h) => /chinese/i.test(h));
if (iKey < 0 || iKm < 0 || iZh < 0) { console.error("CSV missing key/Khmer/Chinese columns"); process.exit(1); }

const changes = [], warnings = [];
for (const r of rows) {
  const key = r[iKey]?.trim();
  if (!key || !(key in fe)) continue;
  const enPh = placeholders(fe[key]);
  for (const [loc, idx, cur] of [["km", iKm, fkCur], ["zh", iZh, fzCur]]) {
    const next = r[idx];
    if (next == null) continue;
    if (next === cur[key]) continue; // unchanged
    if (placeholders(next) !== enPh) {
      warnings.push(`${loc}  ${key}: placeholder mismatch — EN[${enPh || "none"}] vs edit[${placeholders(next) || "none"}] — SKIPPED`);
      continue;
    }
    changes.push({ loc, key, from: cur[key], to: next });
    if (!dry) setNested(loc === "km" ? km : zh, key, next);
  }
}

if (!dry) {
  fs.writeFileSync(path.join(ROOT, "messages/km.json"), JSON.stringify(km, null, 2) + "\n");
  fs.writeFileSync(path.join(ROOT, "messages/zh.json"), JSON.stringify(zh, null, 2) + "\n");
}

console.log(`${dry ? "DRY RUN — " : ""}${changes.length} cell(s) ${dry ? "would change" : "updated"} from ${path.relative(ROOT, csvPath)}`);
for (const c of changes.slice(0, 40)) console.log(`  ${c.loc}  ${c.key}\n     - ${c.from}\n     + ${c.to}`);
if (changes.length > 40) console.log(`  …and ${changes.length - 40} more`);
if (warnings.length) { console.log(`\n⚠ ${warnings.length} skipped (placeholder safety):`); warnings.forEach((w) => console.log("  " + w)); }
console.log(dry ? "\nRun without --dry to apply, then: npm run build" : "\nNext: npm run build  (confirm clean), then commit.");
