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
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx            # Single album gallery (SSG/ISR)
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
│       ├── admin/
│       │   ├── auth/route.ts
│       │   ├── gallery/route.ts
│       │   ├── gallery/albums/route.ts
│       │   ├── gallery/categories/route.ts
│       │   ├── hero/route.ts
│       │   ├── news/route.ts
│       │   ├── leads/route.ts
│       │   └── upload/route.ts
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
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminOverview.tsx
│   │   ├── HeroManager.tsx
│   │   ├── GalleryManager.tsx
│   │   ├── NewsManager.tsx
│   │   ├── LeadsManager.tsx
│   │   ├── CloudinaryUploader.tsx
│   │   ├── MultiCloudinaryUploader.tsx
│   │   └── AdminLoginModal.tsx
│   ├── gallery/
│   │   ├── GalleryAlbumGrid.tsx
│   │   └── SingleAlbumGalleryView.tsx
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
│   ├── db.ts                       # MongoDB Atlas connection
│   ├── cloudinary.ts               # Cloudinary upload, destroy & CDN helpers
│   ├── contentService.ts           # Dynamic MongoDB content fetcher & SSR layer
│   ├── utils.ts
│   ├── seo.ts                      # Metadata generator helpers
│   └── validators/                 # Zod schemas
│
├── models/
│   ├── HeroContent.ts
│   ├── GalleryAlbum.ts
│   ├── GalleryItem.ts
│   ├── GalleryCategory.ts
│   ├── NewsArticle.ts
│   ├── Member.ts
│   ├── ContactMessage.ts
│   └── Subscriber.ts
│
├── public/
│   ├── images/
│   ├── logo.png
│   ├── llms.txt
│   └── favicon files
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
6. [x] Build validation with strict TypeScript compilation (SSG/ISR verified).
7. [x] Pull all event/gallery/news/membership data from dynamic API routes with MongoDB Atlas & Cloudinary support.

---

## 10. Work Completed & Project Status Report

### ✅ 1. Pages & Routes Implementation

| Route | Type | Description | Schema / SEO | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/admin` | Static (○) | No-code Admin Control Center: Hero Editor, Gallery CMS, News CMS, Leads Tracker | Authenticated Admin | **Completed** |
| `/` | Static/ISR (○) | Homepage: Dynamic Hero, AboutPreview, EventsCarousel, Live Album Cards Gallery (up to 6 cards), MembershipTiers, Newsletter | `Organization` JSON-LD | **Completed** |
| `/about` | Static (○) | About Us: History, constitutional 5 pillars, milestones timeline, community advocacy | `BreadcrumbList`, `Organization` | **Completed** |
| `/events` | Static (○) | Events Calendar: Upcoming (2026) and past event archives with filtering | `BreadcrumbList` | **Completed** |
| `/events/[slug]` | SSG/ISR (●) | Dynamic event details: Agendas, ticket links, schedule breakdown, ISR revalidate (1 hr) | `Event`, `BreadcrumbList` | **Completed** |
| `/gallery` | Static/ISR (○) | Gallery Collections Overview: Album cards with covers, dynamic category pills & photo counts | `BreadcrumbList` | **Completed** |
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

### ✅ 2. Admin Control Suite & Dynamic CMS Enhancements

- **Admin Dashboard (`components/admin/`, `app/admin/`):**
  - [page.tsx](file:///f:/Thiru/frontend/Personal/str-website/app/admin/page.tsx): Main admin layout with tab switching, mobile drawer navigation, and session guard.
  - [AdminSidebar.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/AdminSidebar.tsx): Responsive navigation bar with live lead/article/event counts.
  - [AdminOverview.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/AdminOverview.tsx): Dashboard metrics summary and quick action cards with live event statistics.
  - [EventsManager.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/EventsManager.tsx): Full-featured Community Events CMS:
    - Create, edit, and delete cultural events and festivals.
    - Cloudinary poster/image integration with auto CDN asset cleanup on deletion.
    - Interactive agenda breakdown and schedule timeline builder.
    - Dynamic status toggles: Registration Open/Closed, Featured Flagship, and Past Event archive.
    - City and category filters with instant ISR revalidation across `/`, `/events`, and `/events/[slug]`.
  - [HeroManager.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/HeroManager.tsx): Live editor for hero copy, metrics, CTA buttons, and celebration photo with live preview.
  - [GalleryManager.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/GalleryManager.tsx): Complete Album & Photo management suite:
    - **100% Dynamic Categories**: Removed all hardcoded static categories; categories are strictly created/edited/deleted from MongoDB.
    - **Strict Photo Isolation**: Photos are bound strictly to their `albumSlug`, eliminating cross-album leakage under shared categories (e.g. *Koothu Dance* vs *Traditional Tamil Folk Arts*).
    - **Real-Time Data Hydration**: Added `{ cache: 'no-store' }` and cache-busting timestamps (`?t=${Date.now()}`) to ensure immediate UI updates.
    - **Single Photo Editor**: Cleaned `PUT /api/admin/gallery` update payload so reassigning photos to albums in the "All Photos" tab immediately persists in MongoDB.
  - [MultiCloudinaryUploader.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/MultiCloudinaryUploader.tsx):
    - Multi-photo batch selector and direct Cloudinary CDN uploader.
    - **Automatic Album ↔ Category Synchronization**: Selecting an album automatically syncs category and event date/year.
    - Mandatory album binding ensuring photos are never saved as unassigned.
  - [CloudinaryUploader.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/CloudinaryUploader.tsx): Single drag-and-drop uploader with progress tracking.
  - [NewsManager.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/NewsManager.tsx): News publication suite with Published/Draft status toggles and custom slugs.
  - [LeadsManager.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/admin/LeadsManager.tsx): Lead queries, statistics, and CSV export.

---

### ✅ 3. Cloudinary CDN & Automatic Storage Cleanup

- **Asset Lifecycle Management ([lib/cloudinary.ts](file:///f:/Thiru/frontend/Personal/str-website/lib/cloudinary.ts)):**
  - Added `extractPublicId(imageUrl)` to parse Cloudinary asset IDs from secure URLs.
  - Added `deleteCloudinaryImage(imageUrlOrPublicId)` helper calling `cloudinary.uploader.destroy()`.
  - **Album Deletion Cleanup**: Deleting an album automatically destroys all its photos and cover photo in Cloudinary CDN.
  - **Single & Bulk Photo Cleanup**: Deleting photos via single delete or batch delete immediately destroys the image files from Cloudinary storage.

---

### ✅ 4. Data Layer & Real-Time API Endpoints

- **Permanent Deletion & Zero Auto-Reseeding ([lib/contentService.ts](file:///f:/Thiru/frontend/Personal/str-website/lib/contentService.ts), [app/api/admin/](file:///f:/Thiru/frontend/Personal/str-website/app/api/admin/)):**
  - Removed all `if (count === 0)` auto-insertion blocks and static fallback data across Gallery Photos, Albums, News, and Events.
  - Cleared `EVENTS_DATA` static array — the website strictly renders live events added via the Admin CMS (`/admin`), displaying a clean responsive empty state when no events are scheduled.
  - **Dynamic Event Categories**: Implemented `models/EventCategory.ts` and `app/api/admin/events/categories/route.ts` enabling admins to create, edit, and delete event categories on the fly with category re-assignment and live count tracking.
- **Force-Dynamic Route Handlers**:
  - Added `export const dynamic = 'force-dynamic'` and `export const revalidate = 0` to all `/api/admin/*` endpoints to eliminate stale browser/Next.js cache.
- **Homepage Gallery Preview & Events Carousel ([components/sections/GalleryPreview.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/sections/GalleryPreview.tsx), [components/sections/EventsCarousel.tsx](file:///f:/Thiru/frontend/Personal/str-website/components/sections/EventsCarousel.tsx)):**
  - Dynamic album collection cards and dynamic community events queried via `getGalleryAlbums()` and `getEventsList()`.

---

### ✅ 5. Build Verification Results

- **Command:** `npm run build`
- **Output:** Clean build with 0 errors across all routes:
  - 14 Static prerendered pages (including `/admin`)
  - Dynamic SSG/ISR routes with hourly and minute revalidation
  - 12 Dynamic API route handlers
  - 4 System metadata endpoints (`sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `favicon.ico`)
- **TypeScript:** Strict type checking passed with 0 errors.