# English Publications Pilot Safeguards

The user's instruction to implement the safeguards in the 5 November read-only review approves this scope. Production and the existing full-CMS test site must remain unchanged. Work starts from production `017475d502f2a6bac5ba44d2d6e18420682745a0`, not the much broader CMS test branch.

## Intent And Anti-Goals

Prepare a separate test deployment that can select only `/en/blog/publications` for published CMS content. Do not edit CMS rows, import translations, replace drafts, enable email, upgrade PostgreSQL, or change production. Do not claim that selecting a new source preserves identical wording: the current CMS citations lack details in the legacy page. Publish a content-difference report and block production release pending editorial approval.

## Approaches

- Selected: exact page/locale selection inside the existing website, using the existing production readers for every nonpilot page. A separate preview deployment preserves Borin's full-CMS sandbox.
- Rejected: turning on deployment-wide `CONTENT_SOURCE=payload`; this changes unrelated data consumers and discovery.
- Rejected: reverse proxying production to the development sandbox; this introduces cross-zone assets, navigation, indexing and operational boundaries beyond a first content pilot.

## Source Policy

- Default remains legacy. `CONTENT_SOURCE=pilot` enables the scoped-policy mode, but an empty allowlist still selects no CMS pages.
- `CMS_PILOT_PAGES` accepts only the registered exact path `/en/blog/publications`; no wildcards, prefixes, query parameters, hostnames, encoded aliases, other locales or other pages.
- Existing global readers see pilot mode as non-Payload and retain their production behavior. Only the Publications page opts into its explicit published-only reader.
- Page body and discovery use the same policy. Existing publication metadata remains message-driven; no CMS metadata or unrelated slug discovery is introduced.
- Production draft preview is unavailable in pilot mode. The pilot reader sends no API key, no cookies and no draft=true, regardless of caller cookies or configured preview credentials.
- A nonempty pilot allowlist is rejected when `VERCEL_ENV=production`, even if staging visibility was accidentally carried over. This first release cannot enable CMS content on a production target without a later reviewed code change and editorial approval.
- `SITE_VISIBILITY=staging` is an explicit deployment purpose, independent of content source. It provides noindex headers and disallows crawling; it must not be carried to any future public production deployment.
- The isolated staging pilot is read-only: block operational APIs/admin paths and non-GET/HEAD dispatch, skip referral logging, and disable proxies to the separate production admin/international apps. Public production dispatch remains unchanged.

## Reader And Failure Behavior

- Read only the English published publications endpoint, with deterministic year/order/ID sorting and validated pagination.
- Reject failed HTTP, malformed records/pagination, duplicate identities, empty required content and missing/unsafe external links. Keep request time bounded and total pages bounded.
- A pilot outage must not silently replace CMS content with old copy. Render an explicit unavailable state for this page only; leave other pages and languages operational.
- Validate usable titles, IDs and years; render text as React text, not raw HTML. Preserve all current CMS text; do not reconstruct missing citation details or alter the database.
- Rollback is an immutable legacy-source test deployment (allowlist empty), not a database restore. Test healthy -> outage -> recovery -> legacy rollback -> healthy pilot and compare content hashes.

## Indexing

Preserve the intended Khmer review noindex policy through SEO helper composition, with tests for absent and positive SEO overrides. Keep Khmer unlisted in navigation. This changes indexing metadata only, not translations. Pilot staging protection must not depend on the page's source mode.

## Content Preservation Gates

- Capture a current public-content baseline, plus read-only fingerprints covering CMS published content, locales, drafts, versions and audit records.
- Compare all sampled nonpilot text against a same-source production-baseline control deployment. No app/style/message/static-copy refactors are included.
- Compare pilot English publications against both the live CMS values and original page, documenting intentional source differences. Current author/year/citation discrepancies remain an editorial release blocker.
- Compare English and Chinese CMS records and all saved editorial state before/after. If staff edits concurrently, report audit attribution and never restore an older snapshot.
- No live outage injection: use a loopback fixture server for timeout/empty/malformed/recovery integration tests.

## Validation And Release

Use regression tests first, a production build, isolated-browser checks in EN/KH/CN and desktop/mobile, read-only hosted checks, and a fresh independent branch review. Deploy preview artifacts only, on a new `codex/` branch. Do not push `main` or `cms-sandbox`, modify their aliases or CMS configuration, or create a protection-bypass secret. Keep a local server URL available for the user as well as the separate hosted pilot URL.
