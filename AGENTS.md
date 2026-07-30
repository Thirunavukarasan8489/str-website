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

1. Scaffold the Next.js project with the exact folder structure above.
2. Implement design tokens in `tailwind.config.ts` using the color palette in Section 3.
3. Build shared layout (Navbar, Footer, MobileMenu) first — every page depends on it.
4. Build Home page fully, then About, Events, Gallery, Membership, News, Contact, Donate — in that order.
5. Add metadata, JSON-LD, sitemap, and robots.ts as each page is built (not as an afterthought at the end).
6. Run a Lighthouse + accessibility check before marking any page "done."
7. Do not hardcode event/gallery data directly in JSX — pull from `lib/` data layer so content is editable without code changes.