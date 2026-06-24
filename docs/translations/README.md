# Khmer / Chinese translation review

**`roomchang-translations.xlsx`** is the review workbook. It has **one tab per
section of the website**, so your reviewer always knows which page they're
editing. Each row shows **English** (reference) next to editable **Khmer** and
**Chinese** columns. It covers *both* stores:

- **UI strings** — buttons, labels, nav, the chatbot… (1,100 phrases)
- **Database content** — services, doctors, FAQs, pricing, testimonials… (1,300+ phrases)

> The old single-sheet `roomchang-translations.csv` (UI strings only) is kept for
> reference, but the `.xlsx` workbook is the one to use — it's the complete picture.

## For the reviewer (non-technical)

1. Open `roomchang-translations.xlsx` in **Google Sheets** (File → Open → Upload)
   or Excel. Khmer / Chinese display correctly.
2. Pick the **tab** for the section you want to fix (tabs are named like
   `UI · About — facilities`, `Content · Doctors`, `UI · Pricing`…). The first
   tab (**➀ READ ME**) has these instructions.
3. Read the **English** column, then fix the wording in the **Khmer (edit here)**
   / **Chinese (edit here)** column. Leave the English and the hidden columns alone.
4. An **empty** Khmer/Chinese cell means it isn't translated yet — please fill it in.
5. Keep `{...}` bits (like `{phone}`, `{count}`) exactly as they are. Brand /
   product names (Roomchang, Invisalign, WhatsApp…) stay in English on purpose.
6. Use the **Notes for Claude** column for anything that needs explaining.
7. When done: **File → Download → Microsoft Excel (.xlsx)** and send it back.

## For us (applying the edits)

```bash
# Regenerate the workbook from the current site/DB (run any time):
node --env-file=.env scripts/i18n-export-xlsx.mjs

# Preview what an edited workbook would change (safe, writes nothing):
node --env-file=.env scripts/i18n-import-xlsx.mjs path/to/edited.xlsx --dry

# Apply it, then rebuild to confirm:
node --env-file=.env scripts/i18n-import-xlsx.mjs path/to/edited.xlsx
npm run build
```

The importer is safe by design:
- **UI edits** → `messages/km.json` + `messages/zh.json`.
- **Content edits** → `content_translations` table (Supabase upsert).
- It **skips any edit that drops or changes a `{placeholder}`** (so an edit can't
  break interpolation) and reports those.
- It **only writes rows that actually changed** — re-importing an untouched
  workbook makes zero changes.

## Seeing it in context

Khmer / Chinese are live at `/kh` and `/cn`. Browse e.g. `/kh/about/facilities`,
`/cn/pricing`, open the chatbot, etc. To share a preview, deploy a branch to Vercel.

## Note: text still hardcoded in English

A handful of labels are still hardcoded in component code (not yet wired to the
translation system), so they won't appear in the workbook until they're extracted
— e.g. some facility stats and branch labels. Those are fixed in code separately.
