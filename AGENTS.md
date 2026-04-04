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

## Architecture

```
OpenClaw Cron (7 AM CDT)
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

---

## Important Conventions

### Report Format
- Reports live at `public/reports/YYYY-MM-DD.md` (EN) and `public/reports/es/YYYY-MM-DD.md` (ES)
- Must have YAML frontmatter: `title` and `date`
- 4 sections exactly: Clinical Trials, Breakthrough Treatments, Lifestyle Interventions, Emerging Research
- 2-3 findings per section
- Finding format: `### [Headline — max 8 words]\n[2-3 sentences]\n*From: Source (URL)*`

### Email System
- Email sending is handled by `/api/send-report` on Vercel — NOT by calling Resend directly
- The endpoint reads markdown, converts to HTML, fetches subscribers from Supabase, and sends via Resend
- Always call the Vercel endpoint after a successful push, not Resend directly

### Git Workflow
- Reports are committed to `public/reports/` only
- Source code changes go in separate commits
- Commit message format for reports: `reports: YYYY-MM-DD daily update`

### Testing
- Always build locally before pushing: `npm run build`
- Test the email endpoint with: `curl -X POST "https://parkinson-research.vercel.app/api/send-report" -H "Content-Type: application/json" -d '{"date": "YYYY-MM-DD", "language": "en"}'`
- All 5 subscribers confirmed in Supabase (all English)

### Content Standards
- No invented facts, sources, or citations
- No medical jargon without plain-language explanation
- No cure/reversal/guarantee claims
- No social media or paywalled sources
- Source must be credible: PubMed, NIH, FDA, major universities, Parkinson's Foundation, MJFF

---

## Key Files

| File | Purpose |
|------|---------|
| `src/app/api/send-report/route.ts` | Email delivery endpoint (HTML conversion + Resend) |
| `src/lib/supabase.ts` | Supabase client, subscriber and report operations |
| `src/lib/parseReport.ts` | Markdown → structured report sections |
| `public/reports/YYYY-MM-DD.md` | Daily EN report |
| `public/reports/es/YYYY-MM-DD.md` | Daily ES report |
| `supabase_schema.sql` | Subscribers table schema |
| `supabase_schema_reports.sql` | Reports + reviews tables schema |
| `skills/SKILL.md` | Research pipeline skill (read before working on reports) |

---

## Working with the OpenClaw Cron

The cron job ID: `8f562e97-5653-4f7a-a100-3d1e0ff79da7`

To check status:
```bash
openclaw cron list
openclaw cron runs --id 8f562e97-5653-4f7a-a100-3d1e0ff79da7
```

Cron fires at 7:00 AM CDT (13:00 UTC) daily. It runs as an `agentTurn` payload with a 600-second timeout.

---

## Adding New Skills

If you add a new skill for this project, place it in `skills/` and name it descriptively (e.g., `skills/research-pipeline.md`). Follow the skill template in `skills/SKILL.md`.

---

## Getting Help

- Project README: `README.md`
- Full spec: `SPEC.md`
- Research pipeline skill: `skills/SKILL.md`
- OpenClaw docs: https://docs.openclaw.ai
