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
│   ├── privacy/
│   │   └── page.tsx                # Privacy policy
│   ├── terms/
│   │   └── page.tsx                # Terms of service
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
│   │   └── logo.png
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
| `/` | Static/ISR (○) | Homepage: Dynamic Hero, AboutPreview, EventsCarousel, Live Album Cards Gallery, MembershipTiers, Newsletter | `Organization` JSON-LD | **Completed** |
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

### ✅ 2. Layout, Header & Footer Enhancements

- **Navbar & Logo Integration ([components/layout/Navbar.tsx](file:///e:/Projects/str-website/components/layout/Navbar.tsx)):**
  - Integrated official `/logo.png` image with circular gold accent border.
  - Sticky glassmorphic backdrop-blur header on scroll (`bg-[#0A1440]/90 backdrop-blur-md`).
- **Smooth Mobile Navigation Drawer ([components/layout/MobileMenu.tsx](file:///e:/Projects/str-website/components/layout/MobileMenu.tsx)):**
  - Upgraded to Framer Motion spring physics (`damping: 25, stiffness: 220`) for smooth right-to-left drawer slide (`x: '100%'` → `x: 0`).
  - Added dark backdrop blur fade (`opacity: 0` → `1`) and automatic body scroll locking when active.
  - Staggered entrance animations (`delay: 0.05s`) for navigation links.
- **Footer Updates ([components/layout/Footer.tsx](file:///e:/Projects/str-website/components/layout/Footer.tsx)):**
  - Embedded official organization logo image in footer brand block.
  - Added separate links for Privacy Policy (`/privacy`) and Terms of Service (`/terms`).
  - Clean inline SVG icons for Facebook, Instagram, and Twitter/X.

---

### ✅ 3. Dedicated Legal & Governance Pages

- **Privacy Policy Page ([app/privacy/page.tsx](file:///e:/Projects/str-website/app/privacy/page.tsx)):**
  - Styled with dark navy (`#0A1440`) & gold (`#C9A227`) design system.
  - Outlines UK GDPR compliance, information collection (membership, event booking, contact details), usage policies, user rights, and contact details for data inquiries.
- **Terms of Service Page ([app/terms/page.tsx](file:///e:/Projects/str-website/app/terms/page.tsx)):**
  - Formatted with structured card sections detailing the Community Code of Conduct, membership terms & AGM voting rights, event ticket refund policies, media release guidelines, and Scottish governing law.

---

### ✅ 4. Image Configuration & Remote Domain Support

- **Next.js Image Domain Configuration ([next.config.ts](file:///e:/Projects/str-website/next.config.ts)):**
  - Configured `images.remotePatterns` for `images.unsplash.com` enabling Next.js `<Image />` optimization across event cards, hero visual frames, and photo gallery preview items.
  - Placed fallback `/logo.png` in `public/` and `public/images/logo.png`.

---

### ✅ 5. Admin Control Suite & Dynamic CMS Enhancements

- **Admin Dashboard (`components/admin/`, `app/admin/`):**
  - [page.tsx](file:///e:/Projects/str-website/app/admin/page.tsx): Main admin layout with tab switching, mobile drawer navigation, and session guard.
  - [AdminSidebar.tsx](file:///e:/Projects/str-website/components/admin/AdminSidebar.tsx): Responsive navigation bar with live lead/article/event counts.
  - [AdminOverview.tsx](file:///e:/Projects/str-website/components/admin/AdminOverview.tsx): Dashboard metrics summary and quick action cards with live event statistics.
  - [EventsManager.tsx](file:///e:/Projects/str-website/components/admin/EventsManager.tsx): Full-featured Community Events CMS with Cloudinary poster upload and agenda builder.
  - [HeroManager.tsx](file:///e:/Projects/str-website/components/admin/HeroManager.tsx): Live hero copy, metrics, and CTA editor.
  - [GalleryManager.tsx](file:///e:/Projects/str-website/components/admin/GalleryManager.tsx): Album & Photo CMS with 100% dynamic categories and strict album isolation.
  - [MultiCloudinaryUploader.tsx](file:///e:/Projects/str-website/components/admin/MultiCloudinaryUploader.tsx) & [CloudinaryUploader.tsx](file:///e:/Projects/str-website/components/admin/CloudinaryUploader.tsx): Direct Cloudinary uploader with automatic category synchronization.
  - [NewsManager.tsx](file:///e:/Projects/str-website/components/admin/NewsManager.tsx): News publication suite with status toggles.
  - [LeadsManager.tsx](file:///e:/Projects/str-website/components/admin/LeadsManager.tsx): Lead queries and CSV export.

---

### ✅ 6. Build Verification Results

- **Command:** `npm run build`
- **Output:** Clean build with 0 errors across all routes:
  - 28 prerendered pages (including `/admin`, `/privacy`, `/terms`, `/events/[slug]`, `/news/[slug]`)
  - Dynamic SSG/ISR routes with hourly revalidation
  - Dynamic API route handlers (`/api/events`, `/api/membership`, `/api/contact`, `/api/newsletter`)
  - Metadata endpoints (`sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `llms.txt`, `favicon.ico`)
- **TypeScript:** Strict type checking passed with 0 errors.