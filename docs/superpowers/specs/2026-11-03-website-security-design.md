# Website Security Patch Rollout

The user approved a dependency-only website security update, verification in English,
Khmer and Chinese, and deployment to the existing test site. Production, CMS content,
translations, drafts, R2 objects, email delivery and the database version stay unchanged.

Record the production website source and patch the latest `cms-sandbox` source for
this test-only release. Production patch integration remains a separate review; do not
merge the CMS test implementation into production. The alternative of replacing the test branch with
production would remove its CMS readers; importing or restoring content would risk
Borin's work and is expressly excluded.

Update Next.js, its image processor and affected website dependency paths using
published stable releases. Preserve existing rendering and sanitizer policy. No forced
npm audit downgrades, database migrations, imports, seeds or real form submissions.

Read the CMS audit log to quantify Borin's work since the 26 October release, separating
save/publish events from distinct documents and stating attribution limits. Capture
read-only content fingerprints before and after the deployment. Never restore the
baseline over legitimate concurrent staff changes.

Success means passing dependency-policy and legitimate-flow regressions, the complete
website test suite and production build, a test-site deployment of the reviewed commit,
and read-only EN/KH/CN checks. Keep both remote production `main` and the hosted CMS
release unchanged. Database maintenance, SMTP activation, and a real staff-account
publishing test remain outside this release.
