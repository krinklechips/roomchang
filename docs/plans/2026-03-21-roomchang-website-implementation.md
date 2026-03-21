# Roomchang Website Rebuild Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a multilingual Next.js website and internal CMS foundation for Roomchang Dental Hospital, with premium public pages and email-based contact/appointment enquiries.

**Architecture:** Use a single Next.js App Router codebase for the public site, protected admin pages, server actions or route handlers, and Prisma-backed content storage. Public pages are SEO-first and locale-aware; admin and enquiry handling live inside the same application to keep the system small and maintainable.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, React, Prisma, SQLite (local), Postgres-ready schema, Zod, Nodemailer or Resend, Vitest and Playwright

---

### Task 1: Initialize repository and application shell

**Files:**
- Create: `.gitignore`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.js`
- Create: `eslint.config.js`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`
- Create: `public/brand/roomchang-logo.jpeg`
- Create: `public/brand/roomchang-mark.jpeg`

**Step 1: Initialize git repository**

Run: `git init`
Expected: repository initialized in `/Users/enochphan/Desktop/Desktop - Silver Edge/ENOCH/Businesses/roomchang/.git`

**Step 2: Scaffold the Next.js app in the current directory**

Run: `npm create next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*"`
Expected: project files created without a nested subdirectory

**Step 3: Move brand assets into the public folder**

Run: `mkdir -p public/brand`
Expected: `public/brand` exists for static logo assets

**Step 4: Verify the app starts**

Run: `npm run dev`
Expected: local development server starts and the placeholder homepage loads

**Step 5: Commit**

```bash
git add .
git commit -m "chore: scaffold roomchang next app"
```

### Task 2: Set up design system and base application layout

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/components/site/site-shell.tsx`
- Create: `src/components/site/site-header.tsx`
- Create: `src/components/site/site-footer.tsx`
- Create: `src/components/site/language-switcher.tsx`
- Test: `src/components/site/site-shell.test.tsx`

**Step 1: Write the failing component test**

Create `src/components/site/site-shell.test.tsx` with assertions that the shell renders header, footer, and children.

**Step 2: Run test to verify it fails**

Run: `npm run test -- site-shell`
Expected: FAIL because the test script or component does not exist yet

**Step 3: Implement the global design system**

Add color tokens, spacing, typography, focus states, and base layout structure using the approved premium hospital direction.

**Step 4: Run test to verify it passes**

Run: `npm run test -- site-shell`
Expected: PASS once the shell and test setup exist

**Step 5: Commit**

```bash
git add src/app src/components
git commit -m "feat: add roomchang base layout and design system"
```

### Task 3: Add locale routing and translation infrastructure

**Files:**
- Create: `src/i18n/config.ts`
- Create: `src/i18n/dictionaries/en.ts`
- Create: `src/i18n/dictionaries/kh.ts`
- Create: `src/i18n/dictionaries/zh.ts`
- Create: `src/middleware.ts`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Test: `src/i18n/config.test.ts`

**Step 1: Write the failing locale config test**

Create `src/i18n/config.test.ts` to verify supported locales are `en`, `kh`, and `zh`, and that unsupported locales fall back safely.

**Step 2: Run test to verify it fails**

Run: `npm run test -- config`
Expected: FAIL because locale config is not implemented yet

**Step 3: Implement locale-aware routing**

Add middleware, locale helpers, and dictionary loading for the three approved languages.

**Step 4: Run test to verify it passes**

Run: `npm run test -- config`
Expected: PASS with valid locale resolution

**Step 5: Commit**

```bash
git add src/i18n src/middleware.ts src/app/[locale]
git commit -m "feat: add multilingual routing and dictionaries"
```

### Task 4: Model CMS and enquiry data with Prisma

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `src/lib/db.ts`
- Create: `src/lib/content-types.ts`
- Test: `src/lib/content-types.test.ts`

**Step 1: Write the failing schema helper test**

Create `src/lib/content-types.test.ts` to validate locale keys and enquiry status values.

**Step 2: Run test to verify it fails**

Run: `npm run test -- content-types`
Expected: FAIL because the shared content types do not exist yet

**Step 3: Implement the Prisma schema**

Create initial models for `Page`, `Service`, `Doctor`, `Branch`, `Testimonial`, `TechnologyItem`, `Faq`, `SiteSetting`, `Enquiry`, and `AdminUser`.

**Step 4: Generate the client and validate the schema**

Run: `npx prisma generate && npx prisma validate`
Expected: Prisma client generated and schema validation succeeds

**Step 5: Commit**

```bash
git add prisma src/lib
git commit -m "feat: add prisma schema for cms and enquiries"
```

### Task 5: Build public page templates and homepage sections

**Files:**
- Create: `src/components/sections/hero.tsx`
- Create: `src/components/sections/trust-band.tsx`
- Create: `src/components/sections/service-grid.tsx`
- Create: `src/components/sections/doctor-preview.tsx`
- Create: `src/components/sections/technology-showcase.tsx`
- Create: `src/components/sections/international-patients.tsx`
- Create: `src/components/sections/testimonial-strip.tsx`
- Create: `src/components/sections/branch-cta.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Create: `src/app/[locale]/about/page.tsx`
- Create: `src/app/[locale]/services/page.tsx`
- Create: `src/app/[locale]/doctors/page.tsx`
- Create: `src/app/[locale]/technology/page.tsx`
- Create: `src/app/[locale]/international-patients/page.tsx`
- Create: `src/app/[locale]/testimonials/page.tsx`
- Test: `src/app/[locale]/home-page.test.tsx`

**Step 1: Write the failing homepage test**

Create `src/app/[locale]/home-page.test.tsx` asserting that the localized homepage renders the hero CTA and trust band.

**Step 2: Run test to verify it fails**

Run: `npm run test -- home-page`
Expected: FAIL because the page sections are not implemented yet

**Step 3: Implement the homepage and core public pages**

Use CMS-ready section props and locale-aware copy loaders rather than hardcoded one-off markup.

**Step 4: Run test to verify it passes**

Run: `npm run test -- home-page`
Expected: PASS once the homepage structure exists

**Step 5: Commit**

```bash
git add src/app src/components/sections
git commit -m "feat: add multilingual public page templates"
```

### Task 6: Build contact and appointment request flows

**Files:**
- Create: `src/lib/validation/enquiry.ts`
- Create: `src/lib/email/send-enquiry-email.ts`
- Create: `src/app/api/enquiries/route.ts`
- Create: `src/components/forms/contact-form.tsx`
- Create: `src/components/forms/appointment-request-form.tsx`
- Create: `src/app/[locale]/contact/page.tsx`
- Create: `src/app/[locale]/book-appointment/page.tsx`
- Test: `src/app/api/enquiries/route.test.ts`

**Step 1: Write the failing API test**

Create `src/app/api/enquiries/route.test.ts` asserting that a valid submission stores an enquiry and targets `contact@roomchang.com`.

**Step 2: Run test to verify it fails**

Run: `npm run test -- enquiries`
Expected: FAIL because the route, validation, and email logic do not exist yet

**Step 3: Implement validation, persistence, and email notification**

Validate server-side, persist the enquiry, send the notification email to `contact@roomchang.com`, and return a localized success response.

**Step 4: Run test to verify it passes**

Run: `npm run test -- enquiries`
Expected: PASS with a mocked email transport

**Step 5: Commit**

```bash
git add src/app/api src/components/forms src/lib
git commit -m "feat: add contact and appointment enquiry flows"
```

### Task 7: Build the internal admin/CMS foundation

**Files:**
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/enquiries/page.tsx`
- Create: `src/app/admin/services/page.tsx`
- Create: `src/app/admin/doctors/page.tsx`
- Create: `src/components/admin/admin-shell.tsx`
- Create: `src/components/admin/content-table.tsx`
- Create: `src/lib/auth.ts`
- Test: `src/app/admin/enquiries/page.test.tsx`

**Step 1: Write the failing admin test**

Create `src/app/admin/enquiries/page.test.tsx` asserting that authenticated users can see enquiry status and key submission fields.

**Step 2: Run test to verify it fails**

Run: `npm run test -- admin/enquiries`
Expected: FAIL because admin routes and auth are not implemented yet

**Step 3: Implement protected admin pages**

Start with simple session-based auth, read-only enquiry listing, and editable core collections for services and doctors.

**Step 4: Run test to verify it passes**

Run: `npm run test -- admin/enquiries`
Expected: PASS with mocked auth and seeded data

**Step 5: Commit**

```bash
git add src/app/admin src/components/admin src/lib/auth.ts
git commit -m "feat: add cms admin foundation"
```

### Task 8: Add SEO, structured metadata, and sitemap support

**Files:**
- Create: `src/lib/seo.ts`
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Test: `src/lib/seo.test.ts`

**Step 1: Write the failing SEO helper test**

Create `src/lib/seo.test.ts` to verify locale-aware canonical URLs and metadata generation.

**Step 2: Run test to verify it fails**

Run: `npm run test -- seo`
Expected: FAIL because the SEO helper is not implemented yet

**Step 3: Implement metadata and crawl support**

Add locale-aware metadata helpers, sitemap generation, and robots configuration.

**Step 4: Run test to verify it passes**

Run: `npm run test -- seo`
Expected: PASS with stable canonical and alternate URL output

**Step 5: Commit**

```bash
git add src/lib/seo.ts src/app/sitemap.ts src/app/robots.ts src/app/[locale]
git commit -m "feat: add multilingual seo support"
```

### Task 9: Seed initial Roomchang content and uploads

**Files:**
- Modify: `prisma/seed.ts`
- Create: `src/lib/seed/roomchang-content.ts`
- Create: `public/brand/roomchang-logo.jpeg`
- Create: `public/brand/roomchang-mark.jpeg`
- Create: `public/uploads/.gitkeep`
- Test: `src/lib/seed/roomchang-content.test.ts`

**Step 1: Write the failing seed-content test**

Create `src/lib/seed/roomchang-content.test.ts` to verify that the seed exports homepage, service, and branch content for each locale.

**Step 2: Run test to verify it fails**

Run: `npm run test -- roomchang-content`
Expected: FAIL because the initial content seed is not defined yet

**Step 3: Implement seed content**

Seed enough localized content to render the homepage, core nav pages, and enquiry destinations without empty states.

**Step 4: Run the seed and verify it works**

Run: `npx prisma db push && npx prisma db seed`
Expected: local database created and seeded successfully

**Step 5: Commit**

```bash
git add prisma src/lib/seed public/brand public/uploads
git commit -m "feat: seed initial roomchang content"
```

### Task 10: Verify the full system and prepare deployment

**Files:**
- Create: `.env.example`
- Create: `README.md`
- Create: `playwright.config.ts`
- Create: `tests/e2e/public-site.spec.ts`
- Create: `tests/e2e/enquiry.spec.ts`

**Step 1: Write the failing end-to-end test**

Create `tests/e2e/enquiry.spec.ts` to assert that the appointment form can be submitted successfully in a local environment with mocked email.

**Step 2: Run test to verify it fails**

Run: `npm run playwright:test tests/e2e/enquiry.spec.ts`
Expected: FAIL because the flow or config is incomplete

**Step 3: Add deployment and local environment documentation**

Document required environment variables, admin bootstrap flow, email setup, local development commands, and deployment expectations.

**Step 4: Run verification**

Run: `npm run lint`
Expected: PASS

Run: `npm run test`
Expected: PASS

Run: `npm run build`
Expected: PASS

Run: `npm run playwright:test`
Expected: PASS or only known skipped tests

**Step 5: Commit**

```bash
git add .env.example README.md playwright.config.ts tests
git commit -m "chore: document and verify roomchang launch stack"
```
