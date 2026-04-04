# Skill: Local Development

> How to set up, run, test, and contribute to the parkinson-research project locally.

**Trigger phrases:** "develop parkinson locally", "parkinson development setup", "parkinson local testing", "parkinson contributing"

---

## Quick Start

```bash
cd ~/parkinson-research
npm install
npm run dev
# Visit http://localhost:3000
```

---

## Environment Setup

### 1. Clone the repo (if not already)
```bash
git clone https://github.com/tylerdotai/parkinson-research.git
cd parkinson-research
```

### 2. Create `.env.local`
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://gbzuvtzsezmfzgybryrs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_zB0PHZUbawooCQY0k1QRNQ__siDSybB

# Resend
RESEND_API_KEY=re_GcymgD7p_FPiqqch8s8QtBrKt6FAaraa7C

# Optional: for local email testing
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Install dependencies
```bash
npm install
```

### 4. Pull Vercel env vars (recommended)
```bash
vercel env pull .env.local
```
This syncs production env vars to your local `.env.local`.

---

## Running Locally

### Development server
```bash
npm run dev
# → http://localhost:3000
```

### Production build (before pushing)
```bash
npm run build
```
Must exit with code 0 before pushing. If ESLint errors appear, fix them — don't bypass.

### Type checking
```bash
npm run lint    # ESLint
npx tsc --noEmit  # TypeScript
```

### Tests
```bash
npm test        # Run all tests
npm test -- --watch  # Watch mode
```

---

## Testing the Email Endpoint Locally

Start the dev server:
```bash
npm run dev
```

In another terminal:
```bash
curl -X POST "http://localhost:3000/api/send-report" \
  -H "Content-Type: application/json" \
  -d '{"date": "2026-04-03", "language": "en"}'
```

Expected: `{"success": true, "sent": N, "failed": [], "total": N}`

---

## Testing Changes to `/api/send-report`

### 1. Make your changes
```bash
# Edit src/app/api/send-report/route.ts
```

### 2. Build locally first
```bash
npm run build
```
Fix any TypeScript or ESLint errors before proceeding.

### 3. Test with curl
```bash
curl -X POST "http://localhost:3000/api/send-report" \
  -H "Content-Type: application/json" \
  -d '{"date": "2026-04-03", "language": "en"}'
```

### 4. If it works, push
```bash
git add src/app/api/send-report/route.ts
git commit -m "fix: describe your change"
git push origin main
# Vercel auto-deploys
```

### 5. Verify production
After Vercel deploys (~30 seconds), test against production:
```bash
curl -X POST "https://parkinson-research.vercel.app/api/send-report" \
  -H "Content-Type: application/json" \
  -d '{"date": "2026-04-03", "language": "en"}'
```

---

## Working with Reports

### Report file locations
- EN: `public/reports/YYYY-MM-DD.md`
- ES: `public/reports/es/YYYY-MM-DD.md`

### Creating a test report
```bash
cp public/reports/2026-04-03.md public/reports/2026-04-99.md
# Edit the copy
```

### Viewing a report
Reports are static files — just open `public/reports/YYYY-MM-DD.md` in a text editor.

### Report format validation
Reports must have:
1. YAML frontmatter with `title` and `date`
2. Exact section headings: Clinical Trials, Breakthrough Treatments, Lifestyle Interventions, Emerging Research
3. Finding format: `### [Headline]\n[Body]\n*From: Source*\n`

---

## Database (Supabase)

### Schema files
```bash
cat supabase_schema.sql         # Subscribers table
cat supabase_schema_reports.sql # Reports + reviews tables
```

### Run schemas in Supabase SQL Editor
1. Go to: https://supabase.com/dashboard → your project → SQL Editor
2. Paste and run `supabase_schema.sql`
3. Paste and run `supabase_schema_reports.sql`

### Query subscribers (via Supabase dashboard)
```sql
SELECT id, email, language, subscribed_at
FROM subscribers
WHERE confirmed_at IS NOT NULL
  AND unsubscribed_at IS NULL;
```

### Manual unsubscribe (via SQL)
```sql
UPDATE subscribers
SET unsubscribed_at = now()
WHERE email = 'test@example.com';
```

---

## Git Workflow

### Branch naming
```bash
git checkout -b fix/unsubscribe-bug
git checkout -b feat/new-research-category
git checkout -b chore/update-email-template
```

### Commit message format
```
type: short description

Longer explanation if needed.
```

Types: `fix:`, `feat:`, `chore:`, `docs:`, `test:`, `refactor:`

### Push
```bash
git push origin HEAD
# Opens a PR on GitHub
```

### Don't
- Don't push directly to `main` unless it's a hotfix
- Don't commit `.env*` files
- Don't commit built artifacts (`.next/`, `out/`)

---

## Project Structure Reference

```
parkinson-research/
├── public/
│   └── reports/
│       ├── YYYY-MM-DD.md       # EN daily reports
│       └── es/
│           └── YYYY-MM-DD.md   # ES daily reports
├── src/
│   ├── app/
│   │   ├── [lang]/            # EN/ES locale routes
│   │   │   ├── api/
│   │   │   │   ├── subscribe/
│   │   │   │   └── unsubscribe/
│   │   │   ├── about/
│   │   │   ├── privacy/
│   │   │   ├── report/[date]/
│   │   │   ├── reports/
│   │   │   └── resources/
│   │   ├── api/
│   │   │   ├── reports/store
│   │   │   ├── reports/review
│   │   │   └── send-report     # ← Email endpoint
│   │   └── sitemap.xml
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SubscribeForm.tsx
│   │   └── report/
│   └── lib/
│       ├── supabase.ts         # DB client + queries
│       ├── parseReport.ts      # Markdown parser
│       ├── reports.ts          # Report file utilities
│       └── dictionary.ts       # i18n
├── skills/                     # Agent skills
│   ├── SKILL.md               # Research pipeline skill
│   ├── email-system.md         # Email system skill
│   └── development.md          # This file
├── supabase_schema.sql
├── supabase_schema_reports.sql
└── package.json
```

---

## Vercel Deployment

The project auto-deploys on every push to `main` via Vercel's GitHub integration.

### Check deployment status
```bash
vercel ls
```

### View logs
```bash
vercel logs parkinson-research
```

### Force a redeploy
```bash
git commit --allow-empty -m "chore: force redeploy" && git push
```

### Check production env vars
```bash
vercel env ls production
```
