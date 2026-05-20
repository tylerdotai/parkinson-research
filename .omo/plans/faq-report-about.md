# FAQ, Report Redesign, About Reorg + Footer Cleanup

## TL;DR

> Add FAQ to landing, redesign specific report pages, reorg about page content, remove corny flickering animations, remove API link from footer.

## Changes

### 1. FAQ Section — Landing Page
**Files**: `src/app/[lang]/home-client.tsx`, `dictionaries/en.json`, `dictionaries/es.json`

- Add accordion FAQ section between "Mission cards" and "Subscribe CTA"
- 6 questions with expandable answers
- Dictionary-driven (i18n ready)
- Clean, minimal styling matching existing design

### 2. Specific Report Page Redesign
**File**: `src/app/[lang]/report/[date]/page.tsx`

- Clean reading layout (680px max-width, good typography)
- Better visual hierarchy (section headers, dividers between sections)
- Reading progress indicator (sticky top bar)
- Back to reports link
- Source attribution per finding
- Disclaimer box

### 3. About Page Reorg
**File**: `src/app/[lang]/about/page.tsx`

- Founder story FIRST (currently buried at bottom)
- Then mission/research agent section
- Then what's tracked grid
- Then privacy/disclaimer
- Warmer, more personal content tone
- SectionCard components throughout

### 4. Remove Flickering Animations
**Files**: `src/app/[lang]/home-client.tsx`, `src/components/footer.tsx`

- Remove `animate-ping` pulsing dot in home-client.tsx (lines 109-112)
- Remove `animate-ping` pulsing dot in footer.tsx (lines 53-56)
- Replace with simple static dots (no animation)

### 5. Remove API Link from Footer
**File**: `src/components/footer.tsx`

- Remove `{ label: 'API', href: '/api/reports' }` from nav list (line 73)
- Keep: Reports, Resources, About, Privacy, Terms, GitHub

## Must NOT
- Change report format (4 sections, YAML frontmatter)
- Change email system
- Change subscription logic
- Add new pages/routes
- Change design system colors/tokens

## Wave 1 (Foundation)
- T1: Update dictionaries (en + es) with FAQ content

## Wave 2 (FAQ)
- T2: Add FAQ accordion to home-client.tsx

## Wave 3 (Pages)
- T3: Redesign specific report page
- T4: Reorg about page

## Wave 4 (Cleanup)
- T5: Remove flickering animations (home-client + footer)
- T6: Remove API link from footer

## Final Wave
- T7: QA — lint, typecheck, build

## Success Criteria
- `npm run lint` passes
- `npm run typecheck` passes
- `npm run build` exits 0
- FAQ accordion expands/collapses
- Report page has clean reading layout
- About page shows founder story first
- No flickering/pulsing animations anywhere
- No API link in footer