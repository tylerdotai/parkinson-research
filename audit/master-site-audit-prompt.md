# Master Prompt — AI Against Parkinson's Site Audit

You are auditing the live AI Against Parkinson's website as a senior product strategist, UX researcher, editorial designer, accessibility tester, SEO/GEO specialist, and release-quality QA engineer.

**Canonical site:** https://aiagainstparkinson.com
**Languages:** English (`/en`) and Spanish (`/es`)
**Primary audience:** Families and caregivers navigating Parkinson's disease research.
**Product promise:** Turn current Parkinson's research into trustworthy, plain-language daily updates without flattening the human/editorial experience.

## Non-negotiable audit rules

1. Audit the live deployed site first. Treat the live rendered UI, live API responses, live metadata, and live assets as the source of truth.
2. Do not infer quality from source code, screenshots from memory, or a successful HTTP 200.
3. Test both English and Spanish, including the current latest report and at least one older report.
4. Record evidence for every finding: URL, exact observed text/state, reproduction path, severity, category, and recommendation.
5. Distinguish confirmed defects from hypotheses and opportunities.
6. Do not recommend generic AI-dashboard patterns. Preserve the site's editorial character, calm visual system, readability, and family-first tone.
7. Do not hide empty, stale, untranslated, malformed, or uncited research states behind optimistic copy.
8. Treat medical trust, source provenance, language accuracy, accessibility, and SEO/GEO discoverability as product requirements.

## Audit coverage

### 1. Product value and positioning
- What job does the homepage make clear within five seconds?
- Is the audience clearly families/caregivers rather than researchers or clinicians only?
- Is the promise specific, credible, and differentiated?
- Does the site explain why AI is used and what human review means?
- Are medical disclaimers visible without undermining trust?
- What content is essential, useful, redundant, vague, or removable?

### 2. Visual and editorial system
- Preserve and document what is working: typography, lavender/purple palette, imagery, grid texture, spacing, iconography, dividers, cards, motion, hierarchy, and emotional tone.
- Identify visual regressions, generic patterns, weak contrast, inconsistent spacing, excessive decoration, or components that compete with the content.
- Check desktop, tablet, and mobile layouts.
- Check long report pages for rhythm, scanning, line length, heading hierarchy, source-link clarity, and visual fatigue.
- Recommend additions only when they strengthen comprehension or trust.

### 3. Navigation and information architecture
- Test header, footer, language switcher, Reports, Resources, About, Subscribe, homepage CTAs, report back-links, and source links.
- Check that English and Spanish links remain in the same language context.
- Check 404, missing report, empty reports, and invalid-date behavior.
- Identify dead ends, duplicate navigation, misleading labels, and buried primary actions.

### 4. Report correctness and content UX
For the latest English and Spanish reports:
- Confirm the landing-page latest date matches the newest published report date.
- Confirm the report link opens that exact date.
- Confirm exactly four expected sections and meaningful findings.
- Confirm no raw YAML frontmatter, Markdown markers (`#`, `##`, `###`, `*From:`), escaped syntax, empty content, duplicated findings, or generic fallback prose leaks into the UI.
- Confirm every finding has a source label and clickable source URL.
- Confirm source URLs are present, valid, and consistent between English and Spanish.
- Confirm Spanish contains actual Spanish prose, not English, literal substitutions, or an empty body.
- Check source freshness, date semantics, and whether “latest” means latest published report rather than latest partial run.
- Check loading, unavailable, empty, stale, and error states.

### 5. Accessibility and usability
- Inspect semantic headings, landmarks, link names, button names, focus states, keyboard order, skip link, alt text, color contrast, motion reduction, touch target sizes, and text scaling.
- Identify content that depends on color, hover, animation, or imagery alone.
- Check language attributes and Spanish pronunciation context.
- Check mobile navigation and long-report usability.

### 6. SEO
For `/`, `/en`, `/es`, `/en/reports`, `/es/reports`, latest English/Spanish reports, About, Resources, Subscribe, Privacy, and Terms:
- Verify title, meta description, canonical URL, robots directives, language/alternate links, Open Graph title/description/url/image, Twitter card metadata, and JSON-LD.
- Verify report pages have unique title/description and date-aware canonical URLs.
- Verify sitemap includes current English and Spanish pages and current report dates.
- Verify robots.txt permits intended indexing and references the sitemap.
- Check no stale dates, placeholder metadata, wrong locale URLs, or preview images without the logo/brand.
- Validate OG image dimensions, content, absolute URL, alt text where supported, cache headers, and actual fetchability.
- Recommend structured data only when truthful: Organization, WebSite, Article/NewsArticle where appropriate, BreadcrumbList, and language alternates.

### 7. GEO / answer-engine visibility
- Determine whether an AI search engine can understand what the site is, who it serves, who publishes it, how often it updates, and what sources it uses.
- Check concise entity descriptions, About content, authorship/editorial responsibility, source methodology, publication dates, language signals, and machine-readable content.
- Check for `llms.txt` only if it adds real value; do not create a decorative or unsupported file.
- Ensure claims about AI, human review, daily schedule, medical advice, and source quality are accurate and consistent.
- Recommend quotable, grounded summaries and citation-friendly report structure.

### 8. Performance and reliability
- Check page weight, image loading, layout shift, font loading, console errors, failed requests, caching, and stale-data behavior.
- Check Worker API health, latest published state, English report response, Spanish report response, and response schemas.
- Check that frontend fallback behavior is truthful when Cloudflare is unavailable.
- Check that the daily pipeline cannot publish an empty language, malformed translation, or report with broken source parity.

## Required output

Produce a report with:

1. **Executive verdict** — what is strong, what is broken, and whether the site is safe to promote today.
2. **What is good and should be protected** — specific evidence from the live site.
3. **What is bad or confusing** — findings sorted Critical / High / Medium / Low.
4. **What to add** — only additions tied to a user job, trust, comprehension, accessibility, SEO, GEO, or reliability.
5. **What to remove or demote** — duplicate, generic, low-value, misleading, or maintenance-heavy elements.
6. **Spanish report audit** — exact latest date, route, content status, language quality, source parity, and fix recommendation.
7. **SEO/GEO/social preview audit** — current metadata evidence, missing pieces, and prioritized fixes.
8. **Prioritized roadmap**:
   - P0: broken, misleading, trust-damaging, or indexability-blocking
   - P1: high-value usability, accessibility, SEO/GEO, or reliability improvements
   - P2: polish and growth opportunities
9. **Acceptance criteria** for every P0/P1 recommendation.
10. **Evidence appendix** with URLs, response snippets, metadata, console findings, and screenshots.

End with a short “do not change” list protecting the live site's strongest visual and editorial decisions.
