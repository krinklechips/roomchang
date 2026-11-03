# Website Security Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for inline implementation and a final independent review.

**Goal:** Patch website dependencies and release only to the test site without mutating editorial data.

**Architecture:** Patch the existing CMS test branch, preserving the production baseline for a separate integration. Hosted verification is read-only; no content migration or source switch occurs.

**Tech Stack:** Next.js 16, React 19, npm lockfile, Vitest, Vercel, read-only PostgreSQL audit queries.

**Spec:** `docs/superpowers/specs/2026-11-03-website-security-design.md`; the user's explicit rollout request approves this scope.

## Global Constraints

- Preserve Borin's Khmer updates, all other translations and all drafts.
- No production main push, CMS deployment, database upgrade or email activation.
- No hosted editorial writes, submissions, imports, seeds, restores or R2 writes.
- Preserve the existing content-source and locale mappings on each branch.
- Do not interpret scanner package counts as demonstrated exploits.

## Review Focus

- Safe HTML and Khmer/Chinese text must survive sanitizer upgrades.
- Existing SVG/JPEG processing must still work with the patched native image library.
- SMTP construction must work offline without sending a message or using live credentials.
- The sandbox must retain CMS readers and draft-preview authorization.
- Concurrent staff changes must never trigger automatic restoration or reconciliation.

## Task 1: Test Branch Dependency Patch

- [x] Record read-only audit metrics and content fingerprints; confirm branch bases.
- [x] Run existing tests on the clean production baseline and retain its existing failures.
- [x] Run the existing test-site baseline after a clean install: 45 files, 770 tests passed.
- [x] Add `src/lib/dependency-security.test.ts` policy and legitimate-flow checks: two expected failures on Next.js/sanitizer floors; nine compatibility/floor checks passed.
- [x] Update only dependency manifests/lockfile to reviewed stable patches and resolve high/critical transitive matches without forced downgrades.
- [x] Verify the new tests, full suite, type check, build, and scoped scanner results on `codex/test-site-security-20261103` without pushing main.

## Task 2: Test-Site Release

- [x] Start from the current `cms-sandbox` source; retain all existing CMS code and locale tests.
- [x] Run full tests/build and obtain an independent scoped review: no actionable findings.
- [ ] Deploy only to the verified Roomchang sandbox project; never promote to roomchang.com.
- [ ] Check EN/KH/CN using read-only requests/browser interactions, compare content fingerprints and report legitimate concurrent edits separately.
- [ ] Record release identity, remaining scan/coverage limits and Borin activity totals.

## Execution Ledger

- Isolation: reuse this task's clean private clone. The older managed CMS-readiness worktree contains unrelated untracked documentation and is left untouched.
- Baselines: website main `017475d502f2a6bac5ba44d2d6e18420682745a0`; test `5667120de9725b14a087d365b50060d057b60cbf`; CMS `18defb6333a88fe7da006b5ff7218b81b7ea53a6`.
- Ruling: deploy from the current test-site branch, not production main. Production's existing suite has eight failed imports and six failed tests before changes (11 files fail); the test branch already has locale-aware harness fixes. Backporting that unrelated harness during a test-only deployment would broaden scope.
- Activity: Borin has six Khmer publish events across four records since 26 October; 531 non-volatile CMS table fingerprints captured read-only.
- Ruling: declare supported patched Node 22/24 floors. Sanitizer 2.18.1 requires Node >=22.12; the test project's existing Node setting is 24.x and remains unchanged. This does not verify or change Borin's production runtime.
- Validation attempt: `npm audit fix --package-lock-only --ignore-scripts` failed in npm's resolver (`edgesOut` on null). Use a normal in-range `npm update --package-lock-only --ignore-scripts`; do not force suggested framework downgrades.
- Validation attempt: the first read-only page probe used nonexistent `/faq` and returned 404. The site's configured route is `/blog/faq`; correct the probe, not website content.
- Ruling: npm 10.9.9's peer resolver also crashes during broad updates; use task-local npm 12.2.1 without changing the Mac's installed npm. Its remote-artifact guard rejected a new unrelated Tailwind optional tarball during a broad update. Keep that guard enabled and limit in-range updates to the affected Prisma, Supabase/WebSocket, Resend and lodash paths; do not update the CSS framework incidentally.
- Read-only pre-release check: 21 published test-site pages render in the correct EN/KM/ZH language, and all 12 relevant published CMS field checks match their homepage output.
- Verification: clean final install passed; all 781 tests passed; local production build and its TypeScript check passed using only existing read-only sandbox configuration. SMTP credentials were not provided to the build.
- Dependency result: runtime audit has zero matches. Full audit has zero high/critical and 25 moderate package flags rooted in three development-tool advisories (humanfs, minimatch and legacy uuid). No incompatible major overrides were forced. Vite emits an informational warning about a future major's native config loader; the current config and suite pass.
- Lint: new security test has zero errors/warnings; the full repository reports 10 errors and 11 warnings in unchanged screenshot tooling, the contact form and chatbot. No unrelated runtime refactoring is included to silence those rules.
- Final review: independent scoped review found no actionable compatibility, security, deployment or scope blocker. Review does not stand in for hosted release verification.
