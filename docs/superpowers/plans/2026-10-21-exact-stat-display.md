# Exact Statistic Display Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this scoped change with test-first verification.

**Goal:** Display saved statistic text exactly, in each language and on every statistic page.

**Architecture:** Remove the homepage's imported-value comparison. Explicit nonblank display text takes priority over numeric animation and suffix composition, matching the existing other-page resolver. Keep numeric fallbacks only when no explicit text exists.

**Tech Stack:** Next.js, TypeScript, React, Vitest, existing Payload read API.

**Spec:** The user approved "Use exact display text" on 2026-10-21: `37` stays `37`, `37+` stays `37+`, and existing values, drafts, and other languages are not rewritten.

## Global Constraints

- No CMS/database writes, migrations, content imports, or draft/version changes.
- Reuse the existing isolated `codex/cms-readiness` worktree; preserve untracked `docs/cms/`.
- Do not deploy the production website or change its content provider.
- Explicit text must not depend on the hidden import baseline or the shared numeric field.
- Existing no-display-text numeric fallback and label fallback behavior remain unchanged.
- Ruling: execute inline under the user's approved change and existing test-site deployment authorization; do not repeat design approval.

## Review Focus

- Imported display text equal to its baseline must still win over a conflicting suffix.
- Older API responses without an import baseline must honor explicit text.
- Explicit zero, localized units, punctuation, and spacing must remain exact.
- Text-only records must work without a usable numeric value.
- Rendering one language must not mutate another language's input or pending draft data.

## Task 1: Exact Homepage Text

**Files:** `src/components/sections/home-stats-data.ts`, `src/components/sections/home-stats-server.test.ts`, `src/components/sections/home-stats.test.tsx`, `src/lib/site-stats.test.ts`.

**Interfaces:** Keep `getHomepageStats(rows, fallbackLabels)` and `HomeStats` compatible with existing numeric-only callers. Return `display_value` for any explicit nonblank text; numeric values are irrelevant for rendering those entries.

- [x] Add failing tests for baseline-equal and baseline-absent display text, all three languages, text-only rows, exact punctuation, and immutable published/draft fixtures.
- [x] Run focused tests and observe failures caused by the existing baseline/numeric gate.
- [x] Implement explicit-text precedence without changing stored data or the other-page resolver.
- [x] Run focused tests, full suite, TypeScript, lint, and production build; report existing failures separately.

## Task 2: Review and Test-Site Deployment

- [x] Review the diff and test edge cases; verify no CMS or database write code was added.
- [ ] Commit only the intended files and push to `cms-sandbox`, not `main`.
- [ ] Verify the deployment and compare EN/KH/CN statistics across homepage, About, Facilities, and Clinical Results using read-only browser checks; capture screenshots.
- [ ] Confirm original production branch and hosted CMS content are unchanged, and report any remaining limitations.

## Progress

- Initial state: website HEAD and `origin/cms-sandbox` are `148fecc`; `origin/main` is `017475d`. Only pre-existing untracked `docs/cms/` is present.
- The hosted published specialist-dentist record contains `37` in EN/KH/CN and a separate `+` suffix. No content has been modified for this task.
- Red: the focused run failed 14 tests against the original baseline/numeric gate. Green: all 38 focused tests pass, including rendered output and immutable locale/draft fixtures. Scoped ESLint and diff checks pass.
- Independent review identified a whole-strip fallback that could still discard valid CMS text when another row is missing or invalid. Two new tests failed before the fix, then passed. In mixed CMS responses only the unusable row falls back; incomplete numeric-only responses retain the old whole-strip fallback.
- Full-suite baseline: 105 passing / 6 failing tests plus 11 failing files. After the added regressions: 126 passing / the same 6 failing tests and same 11 failing files. Existing failures concern Next navigation, server-only resolution and missing Intl context; no new failing test/file appeared.
- Standalone TypeScript still reports four existing test-fixture errors: missing locale/params in dentist-talks and dynamic-page-metadata tests. No touched file has a type error. The initial Next production build passed, including its TypeScript check. Final rebuilds after the review fix were blocked twice by external Google Fonts downloads (Battambang / Noto Sans SC); the hosted sandbox build is the remaining deployment gate.
- Read-only browser verification against the local production build confirms `37` on homepage, About, Facilities and Clinical Results for EN/KH/CN (12 pages). Existing content differences such as Chinese homepage `30 yrs` and its separate clinical-experience `30 \u5e74` are retained, not rewritten.
- Ruling: text-only entries use an inert numeric zero for the existing component prop type; explicit text renders directly and never animates or appends the legacy suffix.

### Existing Full-Suite Failures

- Load failures: `organization-schema.test.ts`, `home-hero.test.tsx`, `language-switcher.test.tsx`, `mobile-nav.test.tsx`, `site-footer.test.tsx`, `site-header.test.tsx`, `site-shell.test.tsx`, and `blog/dentist-talks/page.test.tsx`.
- `dynamic-page-metadata.test.ts`: "lets CMS SEO overrides win for services pages", "falls back to default technology metadata when CMS SEO is missing", and "lets CMS SEO overrides win for clinical result pages".
- `data.seo.test.ts`: "maps a CMS row into the server SEO shape" and "returns null when the CMS lookup fails".
- `floating-contact.test.tsx`: "preserves the aspect ratio of the Roomchang contact mark image".
