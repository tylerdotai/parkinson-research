# Website Redesign Plan

**Objective:** Audit and redesign the AI Against Parkinson's website pages for a cohesive visual identity, clear user journey, trust-building, and easy subscription flow — using Tailwind CSS 4.

**Pages:** Landing (/), About (/about), Resources (/resources), Reports (/reports), Subscribe (via /api/subscribe)

**Constraints:**
- Do NOT change report format or email system
- Do NOT change subscription logic (backend/API)
- May change subscription UX/visual flow only
- Use Tailwind CSS 4 exclusively

**SSTB:** All execution via OpenClaw agents (call_omo_agent with explore/librarian for research, coding-agent for implementation)

---

## Brand Summary (from research)

**Brand voice:** Warm, familial, hope-forward. Built by a caregiver for families. Plain language, no medical jargon. Autonomous AI research aggregated daily.

**Color palette (already in globals.css):**
- Primary: `--pap-purple: #714cb6` (soft purple)
- Background: `#ffffff`
- Surface: `#f8f8f8`
- Text: `#0f0f0f`
- Muted: `#707070`
- Lavender accent: `--pap-lavender: #cbb7fb`
- Soft purple bg: `rgba(113, 76, 182, 0.10)`

**Typography:**
- Display: Playfair Display (serif, editorial)
- Sans: Karla (clean, readable)

**Existing CSS vars:** `--color-pap-*` series (pap-void, pap-surface, pap-border, pap-text, pap-muted, pap-dim, pap-purple, pap-purple-soft, pap-lavender)

---

## Wave 1: Audit Current Pages

### 1.1 Landing Page (`/`)
**File:** `src/app/[lang]/home-client.tsx`

**Current structure:**
- Hero: 88vh, purple gradient bg + grid pattern, headline, CTA pair (Today\'s Report + Our Story), live indicator
- Mission: 3-column grid (Built for Families, AI-Powered Human-Reviewed, What Matters Now)
- Subscribe CTA: centered, surface bg

**Issues found:**
- Hero `min-h-[88vh]` feels oversized on large screens; content can look lost
- "Our Story" anchor link goes to `/about` which is correct but the link label `t.ourStory` ("Our Story") could be clearer as "Learn Our Story" or "About Us"
- Category badges (bottom of hero image) use absolute positioning; fragile on small screens
- Mission section lacks visual hierarchy — all 3 cards look equal weight but "Built for Families" is the lead message
- Subscribe CTA section uses generic `bg-pap-surface` — no visual distinction from surrounding content
- No "latest report" preview on homepage — users must navigate to /reports
- No trust signals (founder photo, testimonial, disclaimer) on homepage itself
- No breadcrumbs or page indicators showing user location

### 1.2 About Page (`/about`)
**File:** `src/app/[lang]/about/page.tsx`

**Current structure:**
- Title → 5 stacked sections: Research Agent, What\'s Tracked (2x2 grid), Privacy & Safety, Disclaimer, Founder card (dark gradient)

**Issues found:**
- "The Founder" dark card is the emotional peak — good design but may feel disconnected from the rest
- No back-to-top or quick-nav between sections
- "What\'s Tracked" grid cards use `bg: var(--pap-surface)` but no hover state — feels static
- Research Agent section has icon + bullet list — works but is text-heavy
- No photos or visuals breaking up the text density
- Privacy section could feel alarming ("no personal data") without context — needs friendlier framing

### 1.3 Resources Page (`/resources`)
**File:** `src/app/[lang]/resources/page.tsx`

**Current structure:**
- Title + subtitle → MJF infographics → 6 category sections (Emergency, Clinical Trials, Exercise, Caregiver, Financial, Tech) each with ResourceItem list

**Issues found:**
- Heavy reliance on external images (MJFF infographics) that may not always load
- No visual category markers — all sections look identical in structure
- ResourceItem component uses old color variable names (`--color-charcoal`, `--color-amethyst`, `--color-text-secondary`, `--color-parchment`) that don\'t match the current pap-* design system
- Long page = no sticky section nav or table of contents
- "Tech Tools & Assistive Technology" section defined in dictionary but not rendered (the section exists in defaultResources but not called in the JSX)
- "Mental Health & Counseling" category in dictionary is also missing from JSX

### 1.4 Reports Page (`/reports`)
**File:** `src/app/[lang]/reports/page.tsx`

**Current structure:**
- Title + count → report list (date-formatted Link cards) or empty state

**Issues found:**
- No search or filter by category
- No preview of what a report contains without clicking
- Date formatting `toLocaleDateString` with `weekday: long` produces very long dates ("Wednesday, May 20, 2026") — bulky in list view
- Report cards show preview text but it\'s 1-line clamped — not enough to hook the user
- No "subscribe to get reports delivered" prompt near the list
- No visual distinction between older/newer reports

### 1.5 Subscribe Flow
**Implementation:** API route at `src/app/[lang]/api/subscribe/route.ts` (not yet read — backend only)

**UX (from dictionary + nav):** User clicks "Subscribe" → directed to `/api/subscribe` which handles POST

**Issues found:**
- Subscribe link in nav points to API route directly — no dedicated subscribe page with messaging, testimonials, or value framing
- No intermediate landing/marketing page for subscription — user jumps straight to a form submission
- The nav "Subscribe" CTA has no visual differentiation from "Reports" and "Resources" nav items on desktop (it\'s styled as a button, which is correct, but on mobile in the full-screen overlay the button is full-width and prominent — this is fine)

---

## Wave 2: Design System Updates

### 2.1 Shared Component Library

Create/update in `src/components/`:

**`PageHeader.tsx`** — Reusable page header used across all interior pages
```tsx
// Props: title, subtitle?, badge?, icon?
// Consistent: max-w-6xl, py-20 md:py-28 lg:py-32, heading clamp, muted subtitle
// Usage: About, Resources, Reports pages
```

**`SectionCard.tsx`** — Reusable card for content sections
```tsx
// Props: icon?, title, children, variant? ('default' | 'surface')
// Consistent border, rounded-2xl, padding, icon block
// Used by: About (multiple), Resources sections
```

**`ResourceItem.tsx` refactor** — Fix color vars to use pap-* vars
```css
/* OLD (broken/missing globals): */
--color-charcoal     /* → should be --pap-text */
--color-amethyst    /* → should be --pap-purple */
--color-text-secondary /* → should be --pap-muted */
--color-parchment  /* → should be --pap-border */
```

**`CTASection.tsx`** — Unified subscribe/action callout
```tsx
// Props: headline, subline, buttonLabel, buttonHref, disclaimer?
// Used by: homepage, possibly about page
// Consistent: centered, max-w-2xl, purple bg or surface bg
```

**`Badge.tsx`** — Category/status badges
```tsx
// Props: label, variant? ('purple' | 'lavender' | 'outline')
// Used by: homepage hero, reports list category tags
```

### 2.2 Layout Tokens (globals.css additions)

```css
/* ── Consistent section spacing ── */
--spacing-section: 5rem;    /* py-20 */
--spacing-section-lg: 7rem; /* py-28 */
/* Consider adding as Tailwind utilities if not already present */
```

### 2.3 Nav Updates

- Add a subtle "active" indicator for the current page in desktop nav links
- Ensure the "Subscribe" CTA button uses the same hover transition everywhere
- Consider adding a site-wide announcement banner slot above the nav (optional, toggleable)

### 2.4 Footer Updates

- Ensure all footer links use `withLocale()` correctly (they appear to)
- Add a small "Daily at 7:00 AM CDT" badge or indicator near the brand tagline

---

## Wave 3: Per-Page Redesign

### 3.1 Landing Page (/)

**Tasks:**
1. Reduce hero height to `min-h-[75vh]` — content stays centered and prominent without excessive whitespace
2. Add "Latest Report" preview card below the hero (or integrate into hero section as a "Today's Report" preview) — shows most recent report date + first finding headline
3. Reweight mission cards — make "Built for Families" card slightly larger or add a subtle "featured" border treatment
4. Add founder attribution or small photo thumbnail near the subscribe CTA to build trust
5. Move the subscribe section to be more prominent — consider placing it above the fold or as a sticky side element
6. Add a short "How it Works" 3-step visual below mission (optional, quick win)
7. Category badges: move from absolute positioning to a flex row above the image, or remove and use text labels on the image itself

**Deliverable:** Updated `src/app/[lang]/home-client.tsx` with refined hero, latest report preview, trust signals.

### 3.2 About Page (/about)

**Tasks:**
1. Replace the static stacked sections with `SectionCard` components
2. Add a sticky section navigation (vertical tabs or anchors on left side for md+)
3. Make "What\'s Tracked" grid cards interactive — add hover lift + brief example tooltip
4. Reframe Privacy section — lead with "Your data is safe" positive framing before the bullet list
5. Add a small founder photo placeholder or illustrated avatar in the founder section
6. Add a "back to top" button that appears after scrolling past the header

**Deliverable:** Updated `src/app/[lang]/about/page.tsx` with SectionCard components and improved section UX.

### 3.3 Resources Page (/resources)

**Tasks:**
1. Add all missing categories from dictionary: "Mental Health & Counseling" and "Tech Tools & Assistive Technology" sections need to be added to the JSX
2. Refactor ResourceItem to use pap-* color variables
3. Add a left-side sticky category navigation (vertical list of category links that smooth-scroll to sections)
4. Add a visual icon or color-coded header for each category section for faster scanning
5. Add an "external link" icon consistently to all external resource links
6. Consider adding a "last updated" timestamp if resources data has such a field

**Deliverable:** Updated `src/app/[lang]/resources/page.tsx` + refactored `ResourceItem.tsx`.

### 3.4 Reports Page (/reports)

**Tasks:**
1. Improve date formatting — use `MMMM d, yyyy` (e.g., "May 20, 2026") instead of full weekday; keep it compact
2. Show more preview text (2 lines instead of 1) — the preview text is valuable for engagement
3. Add a "Subscribe to Daily Reports" banner above the list for non-subscribers
4. Add report category tags as small colored badges below the date
5. Add a search input (client-side filter by date or keyword) — simple implementation
6. Consider grouping reports by month (collapsible sections) if there are many

**Deliverable:** Updated `src/app/[lang]/reports/page.tsx`.

### 3.5 Subscribe Page (Visual/UX Only — `/subscribe`)

**Note:** Backend is `src/app/[lang]/api/subscribe/route.ts` — do NOT modify. The subscribe URL currently goes directly to the API. We need a visual landing page that presents the value proposition before the form.

**Tasks:**
1. Create `src/app/[lang]/subscribe/page.tsx` — a visual subscribe landing page
2. The page should be a client component that auto-submits to the API OR embeds a simple form
3. Include: headline, founder testimonial, "why subscribe" bullets, the email input form
4. Use dictionary strings (`subscribe.*`) for all text — no hardcoded strings
5. Handle states: default, loading, success, already-subscribed (based on API response)
6. On success, redirect to `/[lang]/confirmed`
7. Style to match the warm/professional brand — not a cold SaaS signup form

**Deliverable:** New `src/app/[lang]/subscribe/page.tsx` + `src/app/[lang]/subscribe/subscribe-client.tsx`.

---

## Wave 4: QA and Integration

### 4.1 Cross-Page Consistency

- Audit all pages for consistent: heading font (`font-display`), body font (`font-sans`), color usage (pap-* vars only), spacing (use Tailwind scale — py-20, max-w-6xl, etc.)
- Ensure all interactive elements (links, buttons) have consistent hover/focus states
- Verify language switcher works on all pages
- Verify i18n: all visible strings come from `dictionary.*` — no hardcoded EN/ES strings in UI components

### 4.2 Responsive Testing (via Playwright)

- Test: mobile hamburger nav opens/closes correctly
- Test: subscribe flow from homepage → confirmed page
- Test: reports list renders on mobile without overflow
- Test: resources page sections are readable on tablet
- Test: language switcher persists correctly

### 4.3 Build & Lint

```bash
npm run lint       # Must pass
npm run typecheck  # Must pass
npm run build      # Must exit 0
```

### 4.4 Content Validation

```bash
node scripts/content-validation.ts
```

---

## Execution Plan (OpenClaw Agents)

### Phase 1 — Wave 1 Audit (Delegate to explore/librarian agents)
- Agent reads all 5 page files + home-client.tsx + nav + footer + ResourceItem + globals.css
- Produces structured audit doc (this document section 1.1–1.5)

### Phase 2 — Wave 2 Design System (Delegate to coding-agent)
- Agent creates/updates shared components: PageHeader, SectionCard, CTASection, Badge, refactored ResourceItem
- Updates globals.css with any new tokens
- Uses --print flag, bypassPermissions

### Phase 3 — Wave 3 Per-Page Redesign (Delegate to coding-agent)
- Run 3 parallel coding-agent tasks: landing+about, resources+reports, subscribe-page
- Each agent works on a specific set of files with the design system components in scope

### Phase 4 — QA (Delegate to coding-agent + review-work)
- Agent runs lint, typecheck, build
- review-work subagent verifies all changes against this plan

---

## File Inventory

**Pages to modify:**
- `src/app/[lang]/home-client.tsx` — landing
- `src/app/[lang]/about/page.tsx` — about
- `src/app/[lang]/resources/page.tsx` — resources
- `src/app/[lang]/reports/page.tsx` — reports
- `src/app/[lang]/subscribe/page.tsx` — NEW subscribe landing page
- `src/app/[lang]/subscribe/subscribe-client.tsx` — NEW client component for subscribe

**Components to create/update:**
- `src/components/PageHeader.tsx` — NEW
- `src/components/SectionCard.tsx` — NEW
- `src/components/CTASection.tsx` — NEW
- `src/components/Badge.tsx` — NEW
- `src/components/ResourceItem.tsx` — UPDATE (color vars)
- `src/components/nav.tsx` — UPDATE (active state)
- `src/components/footer.tsx` — UPDATE (if needed)

**Styles:**
- `src/app/globals.css` — ADD tokens if needed

**Do NOT touch:**
- `src/lib/reports.ts`
- `src/lib/parseReport.ts`
- `src/lib/supabase.ts`
- `src/app/api/subscribe/route.ts`
- `src/app/api/send-report/route.ts`
- `public/reports/` (report format)
- `scripts/content-validation.ts`