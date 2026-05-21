# Roomchang Dental Hospital

Official website for Roomchang Dental Hospital — Cambodia's leading dental group since 1996, with five locations across Phnom Penh.

**Production:** [roomchang.vercel.app](https://roomchang.vercel.app)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4, Lucide icons |
| Database | Supabase (PostgreSQL) |
| ORM | Prisma 7 |
| Email | Resend |
| Media | Cloudflare R2 |
| Hosting | Vercel |
| Testing | Vitest, Testing Library |

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
ENQUIRY_TO_EMAIL=
```

### Development

```bash
npm install
npm run dev
```

The dev server runs at [http://localhost:3000](http://localhost:3000) with Turbopack hot reload.

### Build & Test

```bash
npm run build    # Production build
npm run start    # Start production server
npm run test     # Run test suite
npm run lint     # ESLint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/              # About, history, branches, careers, news, partnerships
│   ├── api/                # API routes (enquiry, referral, admin)
│   ├── blog/               # Dentist Talks, publications
│   ├── clinical-results/   # Before/after case gallery
│   ├── contact/            # Enquiry form + branch information
│   ├── international/      # International patient guide, cost comparison
│   ├── preview/            # CMS draft preview routes
│   ├── pricing/            # Treatment pricing tables
│   ├── services/           # 12 dental specialties + sub-service pages
│   ├── team/               # Doctor profiles
│   └── technology/         # Equipment & technology deep-dives
├── components/
│   ├── blocks/             # CMS block components (used by page builder)
│   ├── pages/              # Full page content renderers
│   ├── sections/           # Homepage sections (hero, stats, testimonials)
│   ├── site/               # Layout shell, header, footer, mobile nav
│   └── ui/                 # Shared UI primitives
└── lib/                    # Data fetching, utilities, Supabase clients
```

## Key Features

- **12 dental specialties** with detailed service pages, pricing, and content sections
- **Doctor profiles** with credentials, specialties, and multilingual support
- **International patient guide** with cost comparisons and step-by-step process
- **Clinical case gallery** with before/after imagery
- **Enquiry system** — form submissions saved to Supabase + email notifications via Resend
- **Referral tracking** — agent referral codes via cookie-based attribution
- **CMS preview** — draft content preview at `/preview/*` routes with ISR revalidation
- **SEO** — dynamic metadata, sitemap generation, Open Graph tags
- **Responsive design** — mobile-first with tailored layouts across breakpoints

## Data Architecture

Content is stored in Supabase PostgreSQL with the following primary tables:

- `services` — dental specialties with rich JSON content sections
- `doctors` — team profiles, credentials, photos
- `branches` — location information and hours
- `hero_slides` — homepage slideshow with configurable display modes
- `pricing_categories` / `pricing_items` — treatment pricing
- `clinical_cases` — before/after cases with image galleries
- `technology` — equipment pages with rich content
- `testimonials` — patient reviews
- `enquiries` — form submissions
- `blog_posts` — dentist talks and publications
- `faq_items` — frequently asked questions
- `seo_page_meta` — per-page SEO overrides

Service and technology pages use a section-based content model (stored as JSONB) supporting: callouts, text blocks, bullet lists, card grids, step sequences, pricing tables, two-column layouts, images, and video embeds.

## Deployment

The site deploys automatically via Vercel's GitHub integration:

- **Production** — pushes to `main` deploy to production
- **Preview** — branch pushes generate preview deployments

ISR (Incremental Static Regeneration) with 60-second revalidation ensures content updates propagate without full rebuilds.

## Fonts

- **Manrope** — primary sans-serif (body text, UI)
- **Cormorant Garamond** — display serif (headings, titles)

## License

Proprietary. All rights reserved by Roomchang Dental Hospital.
