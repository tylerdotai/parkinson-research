# AGENTS.md — AI Against Parkinson's

This file is for AI agents working on or contributing to the project.

---

## Project Overview

**AI Against Parkinson's** is a daily autonomous research pipeline that:
1. Searches medical databases for recent Parkinson's disease research
2. Writes plain-language reports in English and Spanish
3. Stores reports in Supabase and commits to GitHub
4. Emails subscribers via Resend
5. Auto-deploys to Vercel on every push

**Live site:** https://aiagainstparkinson.com
**GitHub:** https://github.com/tylerdotai/parkinson-research
**Tech stack:** Next.js 15, TypeScript, Supabase, Resend, OpenClaw cron

---

## Developer Commands

```bash
npm run dev        # Local dev server → http://localhost:3000
npm run lint       # ESLint
npm run typecheck  # TypeScript (tsc --noEmit)
npm test           # Jest (passWithNoTests)
npm run build      # Next.js production build (required before every push)
```

**CI order (important):** lint → typecheck → test → build
Always run `npm run build` locally before pushing — it must exit code 0.

---

## Architecture

```
OpenClaw Cron (6:30 AM CDT)
  └── Research Agent (orchestrator)
        ├── Clinical Trials sub-agent
        ├── Breakthroughs sub-agent
        ├── Lifestyle sub-agent
        └── Emerging Research sub-agent
              ↓
        Assemble EN report
              ↓
        Spanish translation sub-agent
              ↓
        Git push → Vercel auto-deploy
              ↓
        POST /api/send-report (EN)
              ↓
        POST /api/send-report (ES)
```

**Backup trigger:** GitHub Actions `cron-report.yml` fires daily at 11:30 UTC (5:30 AM CDT) and runs `npm run research` if configured.

---

## Report Format

- Reports: `public/reports/YYYY-MM-DD.md` (EN), `public/reports/es/YYYY-MM-DD.md` (ES)
- YAML frontmatter required: `title` and `date`
- **Exactly 4 sections:** Clinical Trials, Breakthrough Treatments, Lifestyle Interventions, Emerging Research
- **2–3 findings per section**
- Finding format: `### [Headline — max 8 words]\n[2–3 sentences]\n*From: Source (URL)*`

---

## Email System

- **Never call Resend directly** — always use the `/api/send-report` Vercel endpoint
- The endpoint reads markdown, converts to HTML, fetches subscribers from Supabase, and sends via Resend

```bash
# Test email endpoint (any machine)
curl -X POST "https://parkinson-research.vercel.app/api/send-report" \
  -H "Content-Type: application/json" \
  -d '{"date": "YYYY-MM-DD", "language": "en"}'
```

- ES sends return `sent: 0` until Spanish subscribers are added — this is normal, not an error
- Subscriber language preferences are stored in Supabase and respected during send

---

## Git Workflow

- Report commits: `public/reports/` only — message: `reports: YYYY-MM-DD daily update`
- Source code changes: separate commits from report commits
- Branch naming: `fix/`, `feat/`, `chore/`, `refactor/` prefixes

---

## Content Standards (non-negotiable)

- No invented facts, sources, or citations
- No medical jargon without plain-language explanation
- No cure/reversal/guarantee claims
- No social media, Reddit, or paywalled sources
- Credible sources only: PubMed, NIH, FDA, major universities, Parkinson's Foundation, MJFF

---

## Key Files

| File | Purpose |
|------|---------|
| `src/app/api/send-report/route.ts` | Email endpoint (HTML conversion + Resend) |
| `src/lib/supabase.ts` | Supabase client, subscriber/report queries |
| `src/lib/parseReport.ts` | Markdown → structured report sections |
| `public/reports/YYYY-MM-DD.md` | Daily EN report |
| `public/reports/es/YYYY-MM-DD.md` | Daily ES report |
| `supabase_schema.sql` | Subscribers table schema |
| `supabase_schema_reports.sql` | Reports + reviews tables schema |
| `skills/SKILL.md` | Research pipeline skill (detailed — read before working on reports) |

---

## OpenClaw Cron

Cron job ID: `8f562e97-5653-4f7a-a100-3d1e0ff79da7`

```bash
openclaw cron list
openclaw cron runs --id 8f562e97-5653-4f7a-a100-3d1e0ff79da7
```

Cron fires at 6:30 AM CDT (12:30 UTC) daily. Runs as `agentTurn` with 600s timeout.

---

## Environment Setup

```bash
# Pull production env vars from Vercel
vercel env pull .env.local

# Required env vars
NEXT_PUBLIC_SUPABASE_URL=https://gbzuvtzsezmfzgybryrs.supabase.co
RESEND_API_KEY=re_...           # Vercel only — never commit
SUPABASE_SERVICE_ROLE_KEY=...   # Vercel only — never commit
```

---

## Adding Skills

Place new skills in `skills/` with descriptive names (e.g., `skills/research-pipeline.md`). Follow the template in `skills/SKILL.md`.

---

## Getting Help

- Research pipeline skill: `skills/SKILL.md`
- Email system skill: `skills/email-system.md`
- Local dev guide: `skills/development.md`
- OpenClaw docs: https://docs.openclaw.ai