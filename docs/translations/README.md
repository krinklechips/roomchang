# Khmer / Chinese translation review

`roomchang-translations.csv` contains every translated phrase on the site, side
by side: **English** (reference) · **Khmer** · **Chinese**. Your reviewer edits
the Khmer and/or Chinese cells; we re-import their edits with a script that
checks nothing broke.

## For the reviewer (non-technical)

1. Open `roomchang-translations.csv` in **Google Sheets** (File → Import → Upload)
   or Excel. Khmer and Chinese display correctly (the file is UTF-8).
2. Use the **Section** column to filter to one part of the site at a time
   (e.g. "Chatbot (Roomy)", "About — facilities", "Legal — privacy").
3. Read the **English** column for meaning, then fix the wording in the
   **Khmer (edit here)** / **Chinese (edit here)** column. Don't touch the
   **English** or **key** columns.
4. If something needs explaining, leave a note in **Notes for Claude**.
5. When done: File → Download → **Comma-separated values (.csv)** and send it back.

**Keep the `{...}` bits** (like `{phone}`, `{ref}`, `{count}`) exactly as they
are — those get filled in with real values. Brand/product names (Roomchang,
Invisalign, WhatsApp…) stay in English on purpose.

## For us (applying the edits)

```bash
# preview what would change (safe):
node scripts/i18n-import-csv.mjs path/to/edited.csv --dry

# apply, then rebuild to confirm:
node scripts/i18n-import-csv.mjs path/to/edited.csv
npm run build
```

The importer **skips any edit that drops or changes a `{placeholder}`** (so an
edit can't break interpolation) and reports those. Re-generate this CSV any time
after translations change:

```bash
node scripts/i18n-export-csv.mjs
```

## Seeing it in context

Khmer/Chinese are live for QA at `/km` and `/zh` (they're hidden from the public
language switcher until enabled). Browse e.g. `/km/about/facilities`,
`/zh/pricing`, open the chatbot, etc. To put it on a shareable preview URL, deploy
a preview branch to Vercel.
