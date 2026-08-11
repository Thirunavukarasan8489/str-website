# AGENT.md — Scotland Tamils Raise Website Build Spec

## 1. Project Overview

Build a production-grade, marketing + community website for **"Scotland Tamils Raise"**, a Tamil community organization based in Scotland. The site bridges Tamil heritage and Scottish culture — premium, cultural, trustworthy, fast, and SEO-first.

**Goals:**
- Blazing fast load times (Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms)
- Fully responsive (mobile-first: 360px → 4K)
- Clean, reusable component architecture
- Strong SEO ranking + LLM/AI-search discoverability (AEO/GEO ready)
- Accessible (WCAG 2.1 AA minimum)

---

## 2. Tech Stack

- **Framework:** Next.js (latest, App Router only — no `pages/` directory)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS (with custom design tokens below)
- **Components:** shadcn/ui as base primitives, extended with custom components
- **Animations:** Framer Motion (used sparingly — performance over decoration)
- **Forms:** React Hook Form + Zod validation
- **Images:** next/image only, served via Cloudinary or Vercel image optimization
- **CMS (optional but recommended):** Sanity or a simple MongoDB + Mongoose backend for Events, Gallery, Members, News (since events/gallery content changes often, do not hardcode)
- **Deployment:** Vercel
- **Analytics:** Vercel Analytics + Google Search Console + Plausible/GA4

---

## 3. Design System (extracted from logo)

```css
--color-navy: #0A1440;       /* primary background/dark sections */
--color-navy-light: #1B3A6B; /* tartan blue - secondary */
--color-gold: #C9A227;       /* primary accent, buttons, borders */
--color-gold-light: #E8C468; /* highlight/hover gold */
--color-maroon: #8B1A2B;     /* CTA highlight, badges - use sparingly */
--color-purple: #6B3FA0;     /* rare decorative accent only */
--color-white: #FFFFFF;
```

- **Headings:** Elegant serif (e.g. Playfair Display or Cormorant Garamond)
- **Body:** Clean sans-serif (e.g. Inter or Manrope)
- Gold gradient CTAs, subtle gold-glow card borders on hover, dark navy hero sections with high-contrast gold typography.

---

## 4. Next.js App Router — Folder Structure

```
scotland-tamils-raise/
├── app/
│   ├── layout.tsx                  # Root layout: fonts, metadata, nav, footer
│   ├── page.tsx                    # Home
│   ├── globals.css
│   ├── sitemap.ts                  # Dynamic sitemap generation
│   ├── robots.ts                   # Dynamic robots.txt
│   ├── manifest.ts                 # PWA manifest
│   ├── about/
│   │   └── page.tsx
│   ├── events/
│   │   ├── page.tsx                # Events listing (upcoming/past)
│   │   └── [slug]/
│   │       └── page.tsx            # Single event detail (SSG/ISR)
│   ├── gallery/
│   │   └── page.tsx
│   ├── membership/
│   │   ├── page.tsx
│   │   └── join/
│   │       └── page.tsx            # Registration form
│   ├── news/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── donate/
│   │   └── page.tsx
│   └── api/
│       ├── events/route.ts
│       ├── membership/route.ts
│       ├── contact/route.ts
│       └── newsletter/route.ts
│
├── components/
│   ├── ui/                         # shadcn primitives (button, card, input, etc.)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── EventsCarousel.tsx
│   │   ├── AboutPreview.tsx
│   │   ├── GalleryPreview.tsx
│   │   ├── CommitteeGrid.tsx
│   │   ├── MilestonesTimeline.tsx
│   │   ├── MembershipTiers.tsx
│   │   └── NewsletterSignup.tsx
│   ├── cards/
│   │   ├── EventCard.tsx
│   │   ├── NewsCard.tsx
│   │   └── MemberCard.tsx
│   └── shared/
│       ├── SectionHeading.tsx
│       ├── CTAButton.tsx
│       ├── Lightbox.tsx
│       └── SEOSchema.tsx           # JSON-LD injector component
│
├── lib/
│   ├── db.ts                       # DB connection (if MongoDB)
│   ├── utils.ts
│   ├── seo.ts                      # metadata generator helpers
│   └── validators/                 # Zod schemas
│
├── content/                        # If using MDX/static content instead of CMS
│   ├── events/
│   └── news/
│
├── public/
│   ├── images/
│   ├── logo.png
│   └── favicon files (all sizes)
│
├── types/
│   └── index.ts
│
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

**Rules for the agent:**
- Every page uses the App Router `metadata` export (or `generateMetadata` for dynamic routes) — no exceptions.
- Components must be small, single-responsibility, and reused across pages (no copy-pasted markup between Home/About/Events).
- Use Server Components by default; only mark `"use client"` where interactivity is required (forms, carousels, mobile menu).
- All data fetching for events/news/gallery must support ISR (`revalidate`) so content updates without a full redeploy.

---

## 5. Performance Requirements

- Use `next/image` with proper `sizes` and `priority` only on above-the-fold hero images.
- Lazy-load all below-the-fold sections and gallery images.
- Self-host fonts via `next/font` (no external font CDN blocking render).
- Split heavy client components (carousel, lightbox, forms) with `next/dynamic`.
- No unused Tailwind classes shipped — purge configured correctly.
- Target Lighthouse score: 90+ across Performance, Accessibility, Best Practices, SEO.

---

## 6. SEO Requirements

- Unique, keyword-optimized `title` and `description` per page (target terms: "Tamil community Scotland", "Tamil association Edinburgh/Glasgow", "Pongal Diwali events Scotland", etc.)
- Semantic HTML: one `<h1>` per page, logical heading hierarchy, `<nav>`, `<main>`, `<footer>` landmarks.
- **Structured data (JSON-LD)** on relevant pages:
  - `Organization` schema on homepage/about
  - `Event` schema on each event detail page
  - `BreadcrumbList` on all inner pages
  - `FAQPage` schema if an FAQ section is added
- `sitemap.ts` and `robots.ts` generated dynamically from actual routes/content.
- Open Graph + Twitter Card meta tags on every page (with a proper OG image per page, not just one global image).
- Canonical URLs on every page.
- Alt text required on every image (culturally descriptive, not just filenames).
- Internal linking between related pages (e.g., Events page links to Membership CTA, News links to related Events).

---

## 7. LLM / AI-Search Friendliness (AEO/GEO)

- Add `public/llms.txt` summarizing the organization, mission, and site structure in plain language for AI crawlers.
- Write content in clear, self-contained paragraphs that directly answer likely questions ("What is Scotland Tamils Raise?", "How do I join?", "When is the next Pongal event?") — AI answer engines favor direct, quotable Q&A style content.
- Keep factual info (event dates, committee names, contact details) in clean text (not buried inside images or client-side-only rendered JS) so crawlers and LLMs can read it directly from server-rendered HTML.
- Use descriptive, consistent naming for entities (organization name, location, event names) across every page — avoid inconsistent phrasing that confuses entity recognition.

---

## 8. Accessibility

- Color contrast checked against navy/gold combos (gold-on-navy must meet 4.5:1 minimum for body text — adjust `--color-gold-light` for text if needed).
- All interactive elements keyboard-navigable and focus-visible.
- Forms have associated `<label>`s and error messaging tied via `aria-describedby`.
- Mobile menu and lightbox are fully operable via keyboard and screen reader.

---

## 9. Deliverable Instructions for the AI Agent

1. [x] Scaffold the Next.js project with the exact folder structure above.
2. [x] Implement design tokens in `globals.css` / Tailwind theme using the Scottish Tamil color palette in Section 3.
3. [x] Build shared layout (Navbar, Footer, MobileMenu) first — every page depends on it.
4. [x] Build Home page fully, then About, Events, Gallery, Membership, News, Contact, Donate, Privacy, Terms — all pages operational.
5. [x] Add metadata, JSON-LD schemas, sitemap (`sitemap.ts`), and robots (`robots.ts`) across all pages.
6. [x] Build validation with strict TypeScript compilation (28/28 routes SSG/ISR verified).
7. [x] Pull all event/gallery/news/membership data from `lib/data.ts` and dynamic API routes with MongoDB backend support.

---

## 10. Work Completed & Project Status Report

### ✅ 1. Pages & Routes Implementation

| Route | Type | Description | Schema / SEO | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/admin` | Static (○) | No-code Admin Control Center: Hero Editor, Gallery CMS, News CMS, Leads Tracker | Authenticated Admin | **Completed** |
| `/` | Static/ISR (○) | Homepage: Dynamic Hero, AboutPreview, EventsCarousel, GalleryPreview, MembershipTiers, Newsletter | `Organization` JSON-LD | **Completed** |
| `/about` | Static (○) | About Us: History, constitutional 5 pillars, milestones timeline, community advocacy | `BreadcrumbList`, `Organization` | **Completed** |
| `/events` | Static (○) | Events Calendar: Upcoming (2026) and past event archives with filtering | `BreadcrumbList` | **Completed** |
| `/events/[slug]` | SSG/ISR (●) | Dynamic event details: Agendas, ticket links, schedule breakdown, ISR revalidate (1 hr) | `Event`, `BreadcrumbList` | **Completed** |
| `/gallery` | Static/ISR (○) | Gallery Collections Overview: Album cards with covers, category pills & photo counts | `BreadcrumbList` | **Completed** |
| `/gallery/[slug]` | SSG/ISR (●) | Single Album Gallery: High-res photo grid with Lightbox modal, related albums | `BreadcrumbList` | **Completed** |
| `/membership` | Static (○) | Membership tier overview (Individual, Family, Student, Lifetime Patron) & FAQs | `FAQPage`, `BreadcrumbList` | **Completed** |
| `/membership/join` | Static (○) | Interactive registration form with Zod + React Hook Form + `/api/membership` | `BreadcrumbList` | **Completed** |
| `/news` | Static/ISR (○) | Live News & Announcements listing connected to Admin CMS | `BreadcrumbList` | **Completed** |
| `/news/[slug]` | SSG/ISR (●) | Single article view with full editorial content and live DB hydration | `BreadcrumbList` | **Completed** |
| `/contact` | Static (○) | Contact form, regional node information (Edinburgh, Glasgow, Aberdeen, Dundee) | `BreadcrumbList` | **Completed** |
| `/donate` | Static (○) | Charitable impact tiers (£5 - £20+) and direct contribution portal | `BreadcrumbList` | **Completed** |
| `/privacy` | Static (○) | UK GDPR compliant privacy policy and data rights statement | `BreadcrumbList` | **Completed** |
| `/terms` | Static (○) | Terms of service, membership rules, and community code of conduct | `BreadcrumbList` | **Completed** |

---

### ✅ 2. Admin Control Suite & Components Library

- **Admin Dashboard (`components/admin/`, `app/admin/`):**
  - [page.tsx](file:///f:/Thiru/frontend/Personal/str-website/app/admin/page.tsx): Main admin layout with tab switching, mobile drawer navigation, and session guard.
  - [AdminSidebar.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/AdminSidebar.tsx): Responsive navigation bar with live lead/article counts.
  - [AdminOverview.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/AdminOverview.tsx): Dashboard metrics summary and quick action cards.
  - [HeroManager.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/HeroManager.tsx): Live editor for hero copy, metrics, CTA buttons, and celebration photo with live preview.
  - [GalleryManager.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/GalleryManager.tsx): Complete Album & Photo management suite: create slug albums, upload photos to albums, batch delete, and category CRUD.
  - [NewsManager.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/NewsManager.tsx): Full news publication suite with Published/Draft status toggles, cover photo uploads, custom slugs, and summary fields.
  - [LeadsManager.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/LeadsManager.tsx): Searchable, filterable table for Membership applications, Contact inquiries, and Newsletter subscribers with CSV export.
  - [CloudinaryUploader.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/CloudinaryUploader.tsx): Drag-and-drop uploader with progress indicator and image URL fallback.
  - [MultiCloudinaryUploader.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/MultiCloudinaryUploader.tsx): Multi-photo batch selector & uploader to Cloudinary with thumbnail queue and progress tracking.
  - [AdminLoginModal.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/AdminLoginModal.tsx): Password authentication modal with session cookies.

- **Layout & Public Gallery (`components/layout/`, `components/gallery/`):**
  - [Navbar.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/layout/Navbar.tsx), [Footer.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/layout/Footer.tsx), [SiteLayoutWrapper.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/layout/SiteLayoutWrapper.tsx).
  - [GalleryAlbumGrid.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/gallery/GalleryAlbumGrid.tsx): Album collections grid with category pills, cover hover effects, and slug navigation.
  - [SingleAlbumGalleryView.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/gallery/SingleAlbumGalleryView.tsx): High-res photo masonry with interactive Lightbox zoom.

---

### ✅ 3. Data Architecture, Backend & API Endpoints

- **Data Layer (`lib/data.ts`, `lib/contentService.ts`):**
  - `getHeroData()`, `getGalleryAlbums()`, `getGalleryAlbumBySlug(slug)`, `getGalleryList()`, `getNewsList()`, `getNewsArticleBySlug()` with MongoDB queries and automatic fallback seeding.
- **Database Models (`lib/db.ts`, `models/`):**
  - `HeroContent.ts`, `GalleryAlbum.ts`, `GalleryItem.ts`, `GalleryCategory.ts`, `NewsArticle.ts`, `Member.ts`, `ContactMessage.ts`, `Subscriber.ts`.
- **API Endpoints (`app/api/`):**
  - `GET/POST/PUT/DELETE /api/admin/gallery/albums` — Album & Collection management with slug synchronization.
  - `GET/POST/PUT/DELETE /api/admin/gallery` — Photo management with album assignment and bulk deletion.
  - `GET/POST/PUT/DELETE /api/admin/gallery/categories` — Full Category CRUD with photo count tracking and safe reassignment.
  - `GET/PUT /api/admin/hero` — Live Hero content & photo management.
  - `GET/POST/PUT/DELETE /api/admin/news` — Full news article publishing with Published/Draft status.
  - `GET/DELETE /api/admin/leads` — Lead queries, statistics, and CSV export.
  - `POST /api/admin/upload` — Direct Cloudinary photo upload stream.
  - `GET/POST /api/admin/auth` — Secure session validation and sign-out.

---

### ✅ 4. SEO, AI-Search (AEO/GEO) & Discoverability

- [sitemap.ts](file:///f:/Thiru/frontend/Personal/str-website/app/sitemap.ts): Dynamic sitemap indexing static pages, event routes, news routes, and dynamic gallery album slug routes.
- [robots.ts](file:///f:/Thiru/frontend/Personal/str-website/app/robots.ts): Configured crawler permissions and sitemap link.
- [manifest.ts](file:///f:/Thiru/frontend/Personal/str-website/app/manifest.ts): PWA manifest with Scottish Tamil branding colors.
- [llms.txt](file:///f:/Thiru/frontend/Personal/str-website/public/llms.txt): Plain-language summary of Scotland Tamils Raise for AI search crawlers.
- JSON-LD Structured Data: Configured for `Organization`, `Event`, `FAQPage`, and `BreadcrumbList`.

---

### ✅ 5. Build Verification Results

- **Command:** `npm run build`
- **Output:** Clean build with 0 errors across 42 routes:
  - 14 Static prerendered pages (including `/admin`)
  - 12 SSG/ISR dynamic routes with hourly and minute revalidations
  - 12 Dynamic API route handlers
  - 4 System metadata endpoints (`sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `favicon.ico`)
- **TypeScript:** Strict type checking passed with 0 errors.