# Site Audit Fix Plan — All 24 Issues

## TL;DR

> Fix every finding from the 5-agent council audit across security, design, content, automation, and PM. 24 issues total. CRITICAL issues first.

**Priority Order**: Security (#1-4, #18) → Design (#5-6, #19-20, #22-23) → Content (#7-9, #17) → Automation (#10-12, #15) → PM (#13-14, #16, #21, #24)

---

## CRITICAL (Fix Now)

### Must NOT break
- Email delivery to existing subscribers
- Report generation and display
- Subscription sign-up flow
- Existing Supabase data

---

## TODOs

<!-- Tasks will be appended in batches below -->

---

## Wave 1: Security — Auth + RLS (Issues #1, #2, #4)

**Context**: `/api/send-report`, `/api/reports/store`, `/api/reports/review` have zero authentication. Any internet caller can trigger emails, insert fake reports, or burn API credits. Subscriber emails are publicly enumerable via Supabase RLS.

**What to do**:

**T1: Add CRON_SECRET bearer token to API routes**

Add to `src/app/api/send-report/route.ts`:
```typescript
const authHeader = req.headers.get('Authorization')
const CRON_SECRET = process.env.CRON_REPORT_SECRET
if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
```
Same check in `src/app/api/reports/store/route.ts` and `src/app/api/reports/review/route.ts`.

**T2: Update cron-report.yml to pass bearer token**

Add `CRON_REPORT_SECRET` to GitHub Actions secrets (via GitHub repo settings). Then update workflow:
```yaml
- name: Trigger email delivery
  run: |
    DATE=$(date +%Y-%m-%d)
    curl -s -X POST "${{ secrets.CRON_REPORT_URL }}" \
      -H "Authorization: Bearer ${{ secrets.CRON_REPORT_SECRET }}" \
      -H "Content-Type: application/json" \
      -d "{\"date\": \"$DATE\", \"language\": \"en\"}"
```

**T3: Add GROQ_API_KEY to GitHub Actions + update cron-report.yml**

Add `GROQ_API_KEY` as GitHub Actions secret. Change `cron-report.yml` to actually run research as backup:
```yaml
- name: Run research backup
  run: |
    DATE=$(date +%Y-%m-%d) REPORT_DATE=$DATE npx tsx scripts/research-agent.ts
  env:
    GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}
```

**T4: Fix Supabase RLS — remove public email enumeration**

In `supabase_schema.sql`:
```sql
drop policy "anyone_can_view_subscribers" on public.subscribers;
create policy "service_role_view_subscribers"
  on public.subscribers for select
  using (auth.role() = 'service_role');
```
This makes subscriber emails only readable server-side (service role), not via the public anon key.

**References**:
- `src/app/api/send-report/route.ts:225` — POST handler, no auth
- `src/app/api/reports/store/route.ts:9` — no auth
- `src/app/api/reports/review/route.ts:30` — no auth
- `supabase_schema.sql:22-25` — RLS policy

**QA**: `npm run build` exits 0, API routes return 401 without token, subscriber emails not queryable via anon key

---

## Wave 2: Security — Next.js Upgrade (Issue #3)

**Context**: Next.js `15.5.14` has multiple HIGH-severity CVEs. Must upgrade to latest patch.

**What to do**:

**T5: Upgrade Next.js to latest**

```bash
npm install next@latest
npm install react@latest react-dom@latest
```

Then `npm run build` must exit 0.

**References**: `package.json:19` — `^15.5.14`

**QA**: `npm audit --audit-level=high` shows no next.js vulnerabilities

---

## Wave 3: Design — CSS Vars + Typography (Issues #5, #6)

**Context**: ReportEntry and ReportSection use undefined CSS variables (`--color-amethyst`, `--color-charcoal`, `--color-text-secondary`) that don't exist in globals.css. Report/legal pages use "Instrument Serif" font which is never loaded — falls back to system serif everywhere.

**What to do**:

**T6: Add missing CSS variable aliases to globals.css**

Add to `globals.css` after the existing `--pap-*` block:
```css
/* Legacy report component color mappings */
--color-amethyst: var(--pap-lavender);
--color-charcoal: var(--pap-text);
--color-text-secondary: var(--pap-muted);
--color-border: var(--pap-border);
```

**T7: Replace "Instrument Serif" with Playfair Display**

In ALL of these files, remove `fontFamily: 'Instrument Serif, Georgia, serif'` and replace with `className="font-display ..."` (already loaded via next/font):
- `src/app/[lang]/report/[date]/page.tsx` — remove inline style, use Tailwind font-display class
- `src/components/report/ReportSection.tsx:61` — same
- `src/components/report/ReportEntry.tsx:39` — same
- `src/app/[lang]/terms/page.tsx:27` — same
- `src/app/[lang]/privacy/page.tsx:27` — same
- `src/app/[lang]/confirmed/page.tsx:37` — same

**References**:
- `src/components/report/ReportEntry.tsx:24,31,43,57` — undefined vars
- `src/components/report/ReportSection.tsx:54,61` — undefined vars
- `src/app/[lang]/report/[date]/page.tsx:87` — Instrument Serif

**QA**: Report pages use Playfair Display (font-display class), no undefined CSS vars in lsp_diagnostics

---

## Wave 4: Content — Bugs (Issues #7, #8, #9)

**Context**: Three content bugs: HTML entities rendering as literal text on subscribe page, Spanish FAQ has garbled Chinese characters, report list badges always show all 4 categories regardless of actual content.

**What to do**:

**T8: Fix HTML entity bug on subscribe page**

In `src/app/[lang]/subscribe/subscribe-client.tsx`, the "Why subscribe?" list items use dictionary strings with `&apos;` (HTML entity) rendered as plain text. Fix: change dictionary strings to use actual apostrophes (`'`) instead of `&apos;`, or use `dangerouslySetInnerHTML` with a sanitizer. Simplest fix: replace `&apos;` → `'` in both `dictionaries/en.json` and `dictionaries/es.json` for the subscribe section.

**T9: Fix garbled Spanish FAQ**

In `dictionaries/es.json`, the first FAQ item has Chinese characters. Replace with correct Spanish text.

**T10: Fix report list badges to show only actual categories**

In `src/app/[lang]/reports/page.tsx`, badges are hardcoded for all 4 categories. Instead, read which sections actually have content from the report metadata and only render badges for those categories.

**References**:
- `src/app/[lang]/subscribe/subscribe-client.tsx` — renders dictionary strings as text
- `dictionaries/es.json:322` — garbled Spanish
- `src/app/[lang]/reports/page.tsx:101` — hardcoded all 4 badges

**QA**: Subscribe page shows proper apostrophes, Spanish FAQ is legible Spanish, report badges match actual content

---

## Wave 5: Automation — Backup Pipeline + Alerts (Issues #10, #11, #12, #15)

**Context**: cron-report.yml only sends emails (not a real backup). OpenClaw is the only real trigger. Silent failures produce stub reports with no alert. GitHub Actions backup jobs failing.

**What to do**:

**T11: Make cron-report.yml a real backup**

Update to: (1) run `npm run research` first, (2) then call email endpoint. Requires GROQ_API_KEY in GitHub Actions (added in T3).

**T12: Add failure alert when research produces stub content**

In `scripts/research-agent.ts`, after all 4 categories complete, check if all returned fallback text. If so, log a warning OR call a Discord webhook (if configured). At minimum, make the warning visible in CI logs:
```typescript
const allFallback = results.every(r => r.includes('No significant developments'))
if (allFallback) {
  Logger.warn('research-agent', 'All categories returned fallback — stub report generated')
}
```

**T13: Debug GitHub Actions failures**

Read the failing workflow runs in GitHub Actions. Fix the root cause (likely missing env vars or wrong API key names). Verify both `cron-report.yml` and `audit.yml` pass on next push.

**References**:
- `.github/workflows/cron-report.yml` — email-only, no research step
- `scripts/research-agent.ts` — no failure alert on stub reports
- `public/reports/2026-04-28.md` — evidence of silent failure

**QA**: `cron-report.yml` passes on GitHub Actions, stub reports trigger visible warnings

---

## Wave 6: PM — Documentation Cleanup (Issues #13, #14, #16, #21, #24)

**Context**: EMAIL_SETUP.md is obsolete (SMTP when system uses Resend). Cron time contradictory across docs. No CONTRIBUTING.md. SPEC.md drifted from implementation.

**What to do**:

**T14: Delete EMAIL_SETUP.md**

It's actively misleading. Delete it. The AGENTS.md already has correct email system docs.

**T15: Resolve cron time across all docs**

Pick one time and update consistently:
- **Decision**: OpenClaw fires at 6:30 AM CDT (`cron-report.yml` schedule `30 11 * * *` = 11:30 UTC = 6:30 AM CDT)
- Update README.md to say 6:30 AM CDT (not 7:00 AM CDT)
- Update AGENTS.md to remove the "7:00 AM CDT" reference
- Update SPEC.md

**T16: Create CONTRIBUTING.md**

Create a proper `CONTRIBUTING.md` with:
- PR process (fork, branch, review)
- Commit message convention (`type(scope): desc`)
- Testing requirements (`npm run build` must pass)
- What contributions are welcome (content, code, translations)
- How to report issues

**T17: Fix SPEC.md drift**

SPEC.md says 8 research categories but live reports have 4. Update SPEC.md to match reality (Clinical Trials, Breakthroughs, Lifestyle, Emerging).

**T18: Update AGENTS.md stale references**

- "5 current subscribers" → remove specific count
- Remove references to old generate-report workflow

**References**:
- `EMAIL_SETUP.md` — obsolete SMTP docs
- `README.md` — 7:00 AM CDT (wrong)
- `AGENTS.md` — 6:30 AM CDT (correct)
- `SPEC.md` — 8 categories (wrong)
- `.github/workflows/` — failing runs

**QA**: CONTRIBUTING.md exists and is comprehensive, docs no longer contradict each other

---

## Wave 7: Design — System Cleanup (Issues #19, #20, #22, #23)

**Context**: Button hover uses hardcoded `#8b5dc7` (not in CSS system). No unified type scale. Footer green dot misleading (static timestamp). Icon container inconsistency.

**What to do**:

**T19: Standardize button hover colors**

Replace all `hover:bg-[#8b5dc7]` with `hover:bg-pap-purple/90` throughout codebase. Files:
- `src/components/nav.tsx`
- `src/app/[lang]/home-client.tsx`
- `src/components/CTASection.tsx`
- `src/app/[lang]/subscribe/subscribe-client.tsx`
- `src/app/[lang]/reports/page.tsx`

**T20: Standardize type scale**

Audit all heading sizes. Create a consistent scale in globals.css:
- `--text-display`: 3.5rem–5rem (hero)
- `--text-h1`: clamp(2rem,5vw,3rem) (page titles)
- `--text-h2`: 1.5rem (section titles)
- `--text-h3`: 1.125rem (card titles)
- `--text-body`: 1rem

Apply via `font-display` (Playfair) for display/h1/h2, `font-sans` for body.

**T21: Fix footer "live" dot**

Change `bg-pap-success` (green) to `bg-pap-lavender` in `footer.tsx` — or just remove the dot entirely since it's a static timestamp, not live data.

**T22: Fix ReportSection icon container size**

`src/components/report/ReportSection.tsx:51` uses `w-10 h-10`. Change to `w-12 h-12` to match all other icon containers in the design system.

**References**:
- `nav.tsx:91` — hardcoded hover color
- `home-client.tsx:91,305` — hardcoded hover
- `footer.tsx:53` — green dot for static timestamp
- `ReportSection.tsx:51` — `w-10 h-10` vs `w-12 h-12` everywhere else

**QA**: No hardcoded purple hover colors in grep, footer dot is lavender or removed, icon containers consistent

---

## Wave 8: Content + Security — Additions (Issues #17, #18)

**Context**: Resources page has no Spanish-language resources despite bilingual site. No rate limiting on subscribe endpoint.

**What to do**:

**T23: Add Spanish-language resources to resources page**

Add a category "En Español" or "Spanish Resources" with Spanish-language Parkinson's resources (MJFF Spanish materials, Spanish helplines, etc.).

**T24: Add rate limiting to subscribe endpoint**

Add simple IP-based rate limiting to `src/app/api/subscribe/route.ts`:
```typescript
// Simple in-memory rate limit (IP → count)
// For production, use Vercel KV or Upstash
const rateLimitMap = new Map<string, number>()
const WINDOW_MS = 60_000
const MAX_REQUESTS = 5

// In handler:
const ip = req.headers.get('x-forwarded-for') || 'anonymous'
const count = rateLimitMap.get(ip) || 0
if (count >= MAX_REQUESTS) {
  return Response.json({ error: 'Rate limited' }, { status: 429 })
}
rateLimitMap.set(ip, count + 1)
setTimeout(() => rateLimitMap.delete(ip), WINDOW_MS)
```

**References**:
- `src/app/[lang]/resources/page.tsx` — no Spanish section
- `src/app/api/subscribe/route.ts:8` — no rate limiting

**QA**: Resources page has Spanish section, subscribe returns 429 after 5 rapid requests from same IP

---

## Final Verification Wave

- [x] F1: All 24 issues addressed — read each file that was changed
- [x] F2: `npm run lint` passes
- [x] F3: `npm run typecheck` passes
- [x] F4: `npm test` passes
- [x] F5: `npm run build` exits 0
- [x] F6: Security check — API routes return 401 without CRON_SECRET
- [x] F7: Subscriber emails NOT enumerable via anon key
- [x] F8: No undefined CSS vars in report pages

---

## Success Criteria

- All 24 issues addressed
- CI pipeline: lint → typecheck → test → build exits 0
- API endpoints protected with bearer token
- Subscriber emails not publicly enumerable
- Next.js upgraded to latest patch
- No undefined CSS variables anywhere
- CONTRIBUTING.md created
- Docs consistent (cron time, categories)
- GitHub Actions passing