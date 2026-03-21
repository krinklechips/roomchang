# Roomchang Website Rebuild Design

**Date:** 2026-03-21

**Project:** Roomchang Dental Hospital public website and internal CMS foundation

## Objective

Rebuild `roomchang.com` as a premium multilingual dental hospital website with a modern public experience, strong SEO, and an internal CMS from day one. The launch conversion flow will use structured contact and appointment request forms that email `contact@roomchang.com` and save enquiries internally for staff follow-up.

## Why Rebuild

The current live website contains useful institutional content, but it has four structural problems:

- weak trust presentation for a hospital brand
- dated visual hierarchy and navigation
- unclear conversion flow for enquiries and appointment requests
- live-site contamination from spammy footer content that damages brand credibility

The rebuild should treat trust, clarity, and maintainability as first-order requirements.

## Product Direction

### Recommended approach

Build a premium hospital marketing site that keeps the existing Roomchang logo and pink floral brand cues, but modernizes the experience around clinical authority, patient reassurance, multilingual access, and clear conversion.

### Rejected alternatives

1. Close visual refresh of the current site
   This is faster, but it preserves a weak information model and does not create a real step-change in perceived quality.

2. Enterprise healthcare portal aesthetic
   This would improve structure, but it risks becoming too cold and operational for a patient-facing dental brand.

## Approved Scope

### Public-facing scope

- fuller migration of the existing website content, reorganized into a cleaner patient-facing structure
- multilingual support in English, Khmer, and Chinese
- premium homepage and page templates
- services, doctors, technologies, testimonials, international patient information, branches, and contact
- pricing/cost guides and travel support pages where relevant

### Internal scope

- internal admin/CMS from the start
- content editing for key collections
- enquiry inbox for contact and appointment submissions
- no real-time scheduling or calendar sync in v1

## Technical Direction

### Recommended stack

- Next.js with TypeScript
- Tailwind CSS
- App Router
- Prisma ORM
- SQLite for local development
- Postgres-ready schema for production deployment
- server-side email sending for contact and appointment requests

### Why this stack

- server rendering and static generation are a better fit than a client-only SPA for multilingual SEO pages
- one TypeScript codebase can serve the public site, admin workflows, APIs, and validation
- the project stays aligned with the modular public-site architecture used in other customer-facing work without dragging in a second backend ecosystem
- a custom CMS can stay lightweight and purpose-built instead of forcing WordPress or Laravel into a marketing-first build

### Why not Laravel

Laravel is not necessary for this project unless the team wants a PHP-first operational backend. This job is primarily a premium multilingual public website with CMS-backed content and email enquiry flows. Next.js is the better center of gravity.

## Information Architecture

### Primary navigation

- Home
- About
- Services
- Doctors
- Technology
- International Patients
- Testimonials
- Contact
- Book Appointment

### Secondary/discoverable pages

- Clinical Results
- Pricing / Treatment Costs
- Branches
- Plan Your Trip
- Charity Mission
- Corporate Partnerships
- Careers

### Homepage structure

1. Premium hero with immediate trust signals and appointment CTA
2. Clinical trust band: since 1996, branches, languages, and care quality
3. Signature services overview
4. Technology and in-house lab capabilities
5. Doctors/team preview
6. International patient support section
7. Testimonials and clinical confidence content
8. Branch locations and contact methods
9. Final appointment request CTA

## Multilingual Model

The site will support three first-class locales:

- English: `en`
- Khmer: `kh`
- Chinese: `zh`

### Routing

- `/en/...`
- `/kh/...`
- `/zh/...`

### Content model strategy

Collections should store shared identity plus localized fields rather than creating separate disconnected records for each language. Each page and content item should support:

- localized title
- localized slug
- localized summary/body
- localized SEO title and description

## CMS Scope

### CMS collections

- `pages`
- `services`
- `doctors`
- `branches`
- `testimonials`
- `technology_items`
- `faqs`
- `settings`
- `enquiries`

### CMS responsibilities

- edit and publish public content
- manage localized content by locale
- review incoming contact and appointment enquiries
- update homepage sections and trust metrics
- manage SEO metadata and slugs

## Enquiry And Appointment Flow

### Contact and appointment forms

Launch v1 with structured email-based workflows instead of full booking logic.

### Required fields

- full name
- email
- phone / WhatsApp
- preferred contact method
- preferred branch
- service needed
- preferred date note
- message
- locale/language

### Submission behavior

- validate request server-side
- persist enquiry in the CMS/database
- send notification email to `contact@roomchang.com`
- optionally send acknowledgement email to the patient
- expose enquiry status internally as `new`, `reviewed`, `contacted`, or `closed`

## Brand And Visual System

### Assets available locally

- `roomchanglogo.jpeg`: horizontal wordmark with “Dental Hospital Since 1996”
- `WhatsApp Image 2026-03-21 at 16.22.09.jpeg`: standalone flower mark

### Visual direction

- keep the Roomchang logo and pink floral identity
- reduce decorative noise and carousel-heavy patterns
- use cleaner whitespace and stronger typography
- make the interface feel premium, medical, and calm rather than loud or promotional
- preserve brand recognition without reproducing the current site’s dated layout

## Content Migration Principles

- do not clone the current site page-for-page in navigation
- preserve valuable institutional content, but regroup it under a cleaner patient-facing structure
- prioritize pages that improve trust, treatment clarity, and international patient confidence
- remove all contaminated/spam content and validate migrated copy before launch

## Deployment Shape

The project should be deployable as a single app with public pages, admin, API routes, and email handling. The data layer should be simple enough for fast delivery, while keeping a clear upgrade path for production hosting and managed database infrastructure.

## Risks To Watch

- multilingual copy collection may slow launch if the source content is inconsistent
- a custom CMS can drift in scope if admin requirements are not kept focused on actual content operations
- image and content quality from the legacy site may require editorial cleanup, not just technical migration
- booking expectations must stay clear: v1 is appointment request, not confirmed slot scheduling

## Definition Of A Good v1

The new site should look credible for a premium dental hospital, rank cleanly in search, support three languages from the start, give staff a simple internal content workflow, and turn contact and appointment intent into reliable emails and stored enquiries without operational complexity.
