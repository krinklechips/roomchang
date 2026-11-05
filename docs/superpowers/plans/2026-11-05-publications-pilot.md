# English Publications Pilot Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans inline, with a fresh whole-branch review before release.

**Goal:** Prepare a separately hosted, reversible English Publications pilot without changing production or editorial data.

**Architecture:** Start at production main, carry the previously validated dependency security patch and current Next security patch, then add a narrow route/locale policy and a public-only publications reader. Nonpilot page source, copy, styles and operational APIs remain unchanged.

**Tech Stack:** Next.js/React, npm lockfile, Vitest, Playwright, Vercel preview, TLS read-only PostgreSQL snapshots.

**Spec:** `docs/superpowers/specs/2026-11-05-publications-pilot-design.md`.

## Global Constraints

- No production/main or cms-sandbox push, alias change, content-source switch or CMS deployment.
- No hosted editorial writes, imports, translations, draft publication, R2 writes, email or database upgrade.
- Pilot scope is exactly `/en/blog/publications`, default off, separate preview URL.
- Keep source-content differences explicit; no automatic content reconciliation.
- No live outage injection, form submissions, referral visits, slot generation or cron calls.

## Review Focus

- Config typos, aliases and wildcards must not opt unrelated routes/locales into CMS.
- Draft cookies/credentials must never affect the public-only pilot reader.
- CMS errors, empty lists and malformed pagination must not become silent content loss or unbounded reads.
- Source changes must not alter nonpilot text, indexing policy or sitemap discovery.
- Rollback must restore the legacy page without modifying any CMS draft or version.

## Task 1: Safe Baseline And Scoped Source Policy

**Files:** package manifests/lock; `src/lib/content-rollout.ts`; `src/lib/content-rollout.test.ts`; test harness files only where needed to run existing tests.

- [x] Verify source refs and baseline; record known predecessor-suite failures rather than relabel them as regressions.
- [x] Carry dependency-only security changes; use Next/eslint-config-next 16.4.5 and retain tested Sharp/sanitizer/mail patches. Install and audit without forced major overrides.
- [x] Write and run failing policy tests for default-off, exact EN route, disabled allowlist and invalid configuration.
- [x] Implement `resolveContentSource(page, env): 'legacy' | 'payload'` and `pilotSitemapEntries(env)` with a single registered route.
- [x] Run policy and existing suite; ledger harness-only corrections separately.

## Task 2: Published-Only Publications Reader And Page

**Files:** `src/lib/pilot-publications.ts`, reader/page tests, English Publications page; no CMS schema changes.

- [x] Write failing tests for selected CMS content, unselected legacy content and preserved current page markup/text.
- [x] Write failing boundary tests for published-only requests, bounded timeout/pagination, malformed/empty/error responses and unsafe links.
- [x] Implement the narrow validated reader and page selection. Keep the existing legacy publication array and other-language rendering intact.
- [x] Render a page-local unavailable state on explicit reader errors; do not silently substitute legacy content.
- [x] Run all relevant tests and record actual CMS-vs-legacy text differences for editorial review.

## Task 3: Metadata, Preview And Discovery Safeguards

**Files:** `src/lib/seo.ts` and its four route callers; `src/app/sitemap.ts`; staging robots/headers; preview route tests.

- [x] Write failing Khmer noindex tests with missing and positive SEO overrides, plus English unchanged cases.
- [x] Pass explicit locale through metadata composition; keep display text unchanged.
- [x] Add only selected pilot sitemap entries; prove no CMS slug discovery for nonpilot content.
- [x] Add explicit staging noindex/robots policy, independent of source selection.
- [x] Prove pilot-mode preview rejects even configured secrets and public reads never forward draft authorization.

## Task 4: Outage, Content Diff And Rollback Verification

**Files:** isolated loopback fixture/browser harness and generated evidence, not hosted data.

- [x] Build and run a legacy control and selected pilot against the same production source/config.
- [x] Compare nonpilot visible text/links in EN/KH/CN; compare pilot records and citations against both sources.
- [x] Exercise timeout, HTTP failure, malformed, empty, recovery and explicit rollback using a local fixture server.
- [ ] Compare legacy rollback body hashes, unrelated page hashes and CMS editorial snapshots.
- [ ] Verify all three languages, desktop/mobile, metadata, external link policy and read-only navigation.

## Task 5: Independent Review And Preview Release

- [x] Obtain fresh scoped code review and address important findings with regression tests.
- [ ] Clean install, tests, typecheck/build, whitespace and configured-secret scan.
- [ ] Commit/push only `codex/publications-pilot-20261105`; deploy separate Vercel preview artifacts with pilot/staging settings, not stable aliases.
- [ ] Verify hosted pilot and rollback artifacts read-only, retain stable sandbox and production refs/aliases, and repeat editorial fingerprints.
- [ ] Report pilot URL, rollback evidence, protected content state and unresolved editorial citation differences. No production-ready claim until those are approved.

## Execution Ledger

- Approved source: the user's explicit instruction to implement the safeguards and first pilot from the 5 November review.
- Ruling: use a separate production-based pilot clone, not the full CMS branch, because the full branch contains unrelated runtime/styles/content-consumer changes. Existing CMS preview stays intact.
- Ruling: CMS bibliography differences block production, not creation of a transparent test pilot. No editorial values will be guessed or overwritten.
- Baseline main `017475d502f2a6bac5ba44d2d6e18420682745a0`; stable sandbox `d61a8c499536595e4e57f0dd83ffd9464b35696d`.
- Isolation attempt: cloning a partial clone locally failed because its promisor objects cannot be served by local upload-pack. A fresh GitHub clone succeeded; no user repository was changed.
- Baseline: the original 20 test files have 11 failing files, six failed tests and 34 passing tests before feature changes. Test-only harness repair now runs those same 20 files with 56 passing tests; no runtime UI or copy was changed to satisfy old assertions.
- Task 1-3 checkpoint: 26 files, 119 tests passed before the additional production-target guard test. The guard and malformed locale-address test were watched failing before their implementation.
- Validation: Next 16.4.5 production build and TypeScript passed with only public read credentials; no SMTP or service-role credentials supplied.
- Ruling: the first pilot release also rejects `VERCEL_ENV=production` with a selected allowlist. A future approved production release must deliberately review this guard instead of treating a staging artifact as production-ready.
- The standalone preview inherits Vercel Authentication; do not disable project-wide protection or create an automation-bypass secret to simplify checks.
- Release validation: 28 files, 139 tests passed; native optimized build and TypeScript passed. Scoped lint and whitespace checks passed. Runtime npm audit: zero matches; 11 moderate development-tool findings remain outside the runtime audit. A zero-match scan is not a security guarantee.
- Independent review found one important verification gap: equal hashes could count unchanged 404s as preserved. Added a tested status/language/route-content gate. The final local drill passes with 14 healthy nonpilot pages unchanged, five explicit unavailable cases (HTTP 200), recovery, and exact English legacy rollback. Timeout was 4030ms.
- Independent final review has no critical/important findings. Minor known harness limit: it expects the current eight-article bibliography; a future added record requires updating that expectation before a release drill.
- Additional staging safety: deny operational API/admin and write requests, omit referral tracking and disable proxy rewrites to the live admin/international app. Direct middleware tests cover those paths without calling real mutation handlers.
- Native local build with a selected pilot and `VERCEL_ENV=production` failed with the intended guard. No hosted production deployment was attempted.
- Editorial comparison: eight titles match, all eight citations differ, including three year differences. The runbook records the approval gate; no citation, translation, draft or CMS record was changed.
- Preview preparation initially failed safely: Vercel cannot create branch-specific environment settings until the GitHub branch exists. No environment writes succeeded. Disable automatic Git deployment for this exact pilot branch in `vercel.json`, then push, configure only its preview settings and manually deploy explicit pilot/rollback configurations. Other branches remain enabled as before.
