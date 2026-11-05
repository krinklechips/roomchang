# English Publications Test Pilot

This release is test-only. It starts from production source `017475d5`, not the full-CMS sandbox. Do not promote it to production or change existing sandbox aliases.

## Scope And Content Ownership

- Exactly `/en/blog/publications` reads published CMS records when explicitly selected.
- English nonpilot pages, Khmer and Chinese retain their existing production-based readers and copy. This separate pilot is not the full-CMS translation sandbox.
- No import, content migration, translation, draft publish or editorial restoration is part of deploying this code.
- Published reads use no staff credentials, draft cookies or fallback language. Editorial data remains in the CMS; deployment does not replace it.
- Test deployments deny operational API/admin requests and non-GET/HEAD requests, suppress referral tracking and disable live-app proxy rewrites. Do not submit real bookings or enquiries here.

## Preview Configuration

Use a separate Vercel **preview**, never `--prod` or a promotion:

```text
CONTENT_SOURCE=pilot
CMS_PILOT_PAGES=/en/blog/publications
SITE_VISIBILITY=staging
PAYLOAD_API_URL=https://roomchang.serviettelab.com
```

Set both build-time and runtime values. Keep these settings branch-specific; do not modify project-global production settings. Preserve Vercel Authentication. The release deliberately refuses a selected allowlist when `VERCEL_ENV=production`.

Staging uses a noindex response header, noindex metadata and a disallow-all robots file. These discourage indexing; they do not replace authentication.

## Failure Behavior

The public reader validates publication records and pagination with one total four-second deadline. Empty, malformed, draft, timeout or upstream-error responses render an explicit page-local unavailable message. They do not silently substitute another content source.

The unavailable document can have HTTP 200. Monitoring must inspect `data-publications-state="ready"` and the expected publications, not just the HTTP status.

## Rollback

1. Build a separate preview with the same code and public-read environment, but an **empty** `CMS_PILOT_PAGES` at build time and runtime.
2. Confirm `/en/blog/publications` has `data-publications-state="legacy"` and its visible text hash matches the control.
3. Compare successful, route-specific EN/KH/CN control pages again. An unchanged 404/error page is not preservation evidence.
4. Share the verified rollback preview or deliberately repoint only a newly created pilot alias after checking its ownership. Never move stable sandbox or production aliases for this drill.

Rollback is a code/configuration action. **Never replay an old database snapshot over newer staff edits or drafts.** This release requires no CMS schema rollback.

## Local Verification

After a production-mode local build with the same public read configuration:

```sh
npm test
npm run verify:publications-pilot
```

The drill creates only loopback fixtures and local Next servers. It checks five failure cases, recovery, exact legacy rollback and 14 healthy nonpilot pages in three languages. No live outage or hosted editorial write is injected. Evidence defaults to ignored `.artifacts/publications-pilot`; supply `PILOT_EVIDENCE_DIR` to retain it elsewhere.

## Editorial Gate Before Any Production Selection

On 5 November all eight publication titles matched, but **all eight citation strings differed** between production source and current published CMS records. CMS citations omit some volume/issue/page details and format authors differently. Three citation years differ:

| DOI | Current website citation year | CMS citation year |
| --- | --- | --- |
| 10.1007/s11282-024-00785-z | 2025 | 2024 |
| 10.1093/ejo/cjaa018 | 2021 | 2020 |
| 10.1016/j.bbrc.2018.11.204 | 2019 | 2018 |

These are source differences, not proof either source is wrong. No correction is authorized or automated here. Review the generated full citation comparison with the content owner before considering production. Review ordering, abstracts, links and metadata as well as titles.

The deployment gate is intentionally hardcoded for this first pilot. A later production rollout requires a separately reviewed change, owner-approved copy comparison, fresh published/draft preservation evidence and a production-specific rollback plan. Email and the database upgrade remain pending.
