# Skill: Parkinson Research Pipeline

> Daily Parkinson's disease research → plain-language reports → email to subscribers

**Trigger phrases:** "run parkinson research", "generate today's parkinson report", "parkinson research pipeline", "update parkinson reports"

**Agent:** Any OpenClaw agent tasked with running or improving the daily research pipeline.

---

## What This Skill Does

Produces a daily bilingual (EN/ES) research report on Parkinson's disease and delivers it to subscribers via email. The pipeline:

1. Spawns 4 parallel research agents (one per category)
2. Assembles findings into the standard EN report format
3. Translates to Spanish
4. Pushes to GitHub → Vercel auto-deploys
5. Triggers email delivery via `/api/send-report`

---

## Prerequisites

- Access to the parkinson-research workspace: `~/parkinson-research/`
- Resend API key for email (already configured in Vercel)
- Supabase project for subscriber data (already configured)
- Git push access to `github.com/tylerdotai/parkinson-research`

---

## Step-by-Step Execution

### Step 1 — Determine Today's Date

```bash
date +%Y-%m-%d
```

Use this date for all file paths and email calls.

---

### Step 2 — Spawn 4 Parallel Research Agents

Use `sessions_spawn` with `mode=run` and `runtime=subagent`. Each agent independently web searches for their category and writes findings in the standard format.

**Agent 1 — Clinical Trials**
```
Search query: "Parkinson's disease clinical trials recruiting 2025 2026 site:clinicaltrials.gov OR site:pubmed.gov"
```

**Agent 2 — Breakthrough Treatments**
```
Search query: "Parkinson's disease treatment breakthrough 2025 2026 site: nih.gov OR site:ucsf.edu OR site:parkinson.org"
```

**Agent 3 — Lifestyle Interventions**
```
Search query: "Parkinson's disease exercise diet sleep research 2025 2026 site:pubmed.gov OR site:uci.edu"
```

**Agent 4 — Emerging Research**
```
Search query: "Parkinson's disease emerging science alpha-synuclein research 2025 2026 site:biorxiv.org OR site:pubmed.gov"
```

Each agent must write findings ONLY in this format:
```
### [Headline — max 8 words, plain language]

[2-3 sentences. First sentence: what is this? Second sentence: why does it matter for patients/caregivers? Third sentence (optional): nuance or caveat. Use plain language. No medical jargon without explanation.]

*From: Source Name (URL)*
```

**Rules for all agents:**
- Headlines: max 8 words, no jargon, specific
- Bodies: 2-3 sentences, plain language for patients and families
- Sources: real URLs from credible institutions (NIH, FDA, UCSF, PubMed, Parkinson's Foundation, MJFF)
- Never invent sources, facts, or citations
- Never include social media, Reddit, or paywalled journals
- Never claim cures, reversal, or guaranteed outcomes
- If no good findings: write "No significant developments this week in [category]." — do NOT pad with irrelevant content

Wait for all 4 agents to complete and collect their output.

---

### Step 3 — Assemble the EN Report

Write the report to `~/parkinson-research/public/reports/YYYY-MM-DD.md`

```
---
title: "Parkinson's Research — YYYY-MM-DD"
date: "YYYY-MM-DD"
---

# Parkinson's Research

Daily research for families navigating Parkinson's.

## Clinical Trials
[findings from Agent 1]

## Breakthrough Treatments
[findings from Agent 2]

## Lifestyle Interventions
[findings from Agent 3]

## Emerging Research
[findings from Agent 4]

---
*Generated daily from public research databases. For informational purposes only — not medical advice.*
```

---

### Step 4 — Spanish Translation

Spawn a Spanish translation agent using `sessions_spawn`:
- Pass the complete EN report as the task input
- Ask it to translate to warm, accessible Spanish (not overly formal)
- Preserve exact section headings, finding format, source URLs, and frontmatter
- Do NOT translate source URLs or NCT numbers
- Spanish date in frontmatter: same YYYY-MM-DD format

Write to `~/parkinson-research/public/reports/es/YYYY-MM-DD.md`

---

### Step 5 — Git Push

```bash
cd ~/parkinson-research
git add public/reports/
git commit -m "reports: YYYY-MM-DD daily update"
git push origin main
```

Wait for push to complete before proceeding.

---

### Step 6 — Trigger Email Delivery

After successful push, call the Vercel email endpoint **twice**:

```bash
curl -s -X POST "https://parkinson-research.vercel.app/api/send-report" \
  -H "Content-Type: application/json" \
  -d '{"date": "YYYY-MM-DD", "language": "en"}'

curl -s -X POST "https://parkinson-research.vercel.app/api/send-report" \
  -H "Content-Type: application/json" \
  -d '{"date": "YYYY-MM-DD", "language": "es"}'
```

Both must return `{"success": true, "sent": N}` where N > 0.

---

## Output Standards

### Report Quality Checklist
- [ ] All 4 sections present with 2-3 findings each
- [ ] Every finding has a real source URL
- [ ] No invented facts, sources, or citations
- [ ] Headlines ≤ 8 words, plain language
- [ ] No medical jargon without plain-language explanation
- [ ] No cure/reversal/guarantee claims
- [ ] Spanish report has same structure as EN
- [ ] Git push succeeded
- [ ] Both email calls returned success

### Email Verification
After the curl calls, verify:
- EN call returned `sent: 5` (all current subscribers)
- Response is `{"success": true, ...}`
- No `failed` entries in the response

---

## Troubleshooting

### Agent returns empty results
Re-spawn with a more specific search query. If still empty, write "No significant developments this week in [category]."

### Git push fails
Check git remote: `cd ~/parkinson-research && git remote -v`. Push to `origin main`.

### Email endpoint returns 500
Check Vercel deployment status. The endpoint may need the latest code. Check:
1. `.env.local` has `RESEND_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY`
2. Vercel env vars match (run `vercel env ls production`)
3. Report file exists at `public/reports/YYYY-MM-DD.md`

### Email endpoint returns 200 but sent: 0
No subscribers match the language filter. All current subscribers are English-only — ES sends will always return 0 until Spanish subscribers are added.

---

## Escalation

If the pipeline fails after 2 retries:
1. Report the failure to the #reoccurring-research-for-parkinson-each-day Discord channel
2. Note which step failed and the error message
3. Do NOT manually modify subscriber data or Supabase schema without checking AGENTS.md

---

## Related Skills

- `skills/email-system.md` — Email endpoint architecture and troubleshooting
- `skills/development.md` — Local development setup and testing

---

## Sources to Search

**Primary sources (preferred):**
- ClinicalTrials.gov — clinical trial registrations and results
- PubMed.gov — peer-reviewed research abstracts
- NIH.gov / NINDS.nih.gov — Parkinson's Institute and related institutes
- FDA.gov — drug approvals, clinical trial announcements
- UCSF.edu — Parkinson's research, clinical trials
- Parkinson's Foundation (parkinson.org) — patient-facing resources
- Michael J. Fox Foundation (michaeljfox.org) — research updates
- Roche, AbbVie, Biogen press releases — clinical trial results

**Do NOT use:**
- Social media (Twitter/X, Reddit, Facebook)
- Patient forums or anecdotal sources
- Paywalled journals without accessible abstracts
- Supplement or "natural cure" sites
- Single-patient case studies

---

## Architecture (IMPORTANT — Read First)

The pipeline runs in TWO places:

1. **Hoss Heartbeat (Primary Executor)** — Runs every 30 min during active hours (08:00–22:00 CDT) from Hoss's main session. Has full tool access (web_search, exec, git). Checks if today's report exists. If not, runs the full pipeline directly. Observable and debuggable.

2. **OpenClaw Cron (Backup Trigger)** — Fires at 7:00 AM CDT. Runs in `isolated` mode — cannot spawn sub-agents. May produce output, may not. Do NOT rely on it for the heavy lifting.

**Flow:**
- Cron fires at 7 AM → isolated agent tries → might work, might not
- Heartbeat at ~7:30 AM → checks if report exists → if missing, runs pipeline directly in main session
- Flag file `/tmp/parkinson-ran-YYYY-MM-DD` prevents duplicate runs

**Why this architecture?**
- Isolated sessions can't receive sub-agent results (fire-and-forget)
- Main session has full tool access and is observable
- Heartbeat is the reliable executor, cron is a potential head start

**If the pipeline fails:**
1. Check if flag file exists: `ls /tmp/parkinson-ran-*.md`
2. Check git log for today's commit: `cd ~/parkinson-research && git log --oneline --since="7:00" | grep daily`
3. Run manually if needed: spawn a research sub-agent and assemble the report
