# Parkinson Research — Key Learnings

## Task 2: Pipeline Architecture

### Discovery: Two Parallel Pipeline Implementations

1. **skills/SKILL.md** — OpenClaw agent orchestration (human-triggered via skill invocation)
2. **scripts/research-agent.ts** — Production Groq LLM-powered script (runs via cron)

### Current Source Architecture

Sources are embedded as search query strings in two places:

| File | Lines | Purpose |
|------|-------|---------|
| `skills/SKILL.md` | 232-250 | Documented source list (human-readable) |
| `scripts/research-agent.ts` | 77-168 | `CATEGORIES` array with `searchQuery` per category |

### Sub-Agent Invocation Points

- **OpenClaw path:** `sessions_spawn` with `mode=run` and `runtime=subagent` (SKILL.md lines 56-96)
- **Groq path:** `groqChat()` function calls to Groq API (research-agent.ts lines 35-186)

### New Sources to Integrate

| Source | Status | Entry Point |
|--------|--------|-------------|
| PubMed E-utilities | Partially used (via search queries) | `scripts/research-agent.ts` — new `searchPubMed()` function |
| GP2 | NOT used | `scripts/research-agent.ts` — new `searchGP2()` function |
| AMP PD | NOT used | `scripts/research-agent.ts` — new `searchAMPPD()` function |
| PPMI | NOT used | `scripts/research-agent.ts` — new `searchPPMI()` function |

### Key Architectural Insight

The production pipeline (`research-agent.ts`) does **not** use sub-agents as described in SKILL.md. It uses Groq LLM with search queries passed in the prompt. To add structured API sources (PubMed, GP2, AMP PD, PPMI), the implementation should:

1. Add async functions for each API source
2. Modify `CATEGORIES` array to support custom search functions
3. Update `researchCategory()` to call custom search before/alongside Groq

### Date
2026-05-20

---

## Task: Add PubMed, GP2, AMP PD, PPMI to research-agent.ts

### What Was Added

4 new source search functions in `scripts/research-agent.ts`:

1. **searchPubMed(query)** — Uses NCBI E-utilities API (`esearch.fcgi` + `esummary.fcgi`). Free, no auth required.
2. **searchGP2(query)** — Queries GP2 public search endpoint.
3. **searchAMPPD(query)** — Queries AMP PD public search endpoint.
4. **searchPPMI(query)** — Queries PPMI public search endpoint.

**Freshness filter:** `isFresh(dateStr)` returns true if date < 90 days old. Applied to all 4 sources.

**Integration:** `fetchAllSources()` runs all 4 searches in parallel, combines results, and passes structured data to Groq LLM in `researchCategory()`. Stale data is flagged as "ignore if older than 90 days."

### Skills/SKILL.md Updated

Sources section now includes:
- GP2 (Global Parkinson's Genetics Program) — gp2.org
- AMP PD (Accelerating Medicines Partnership) — amp-pd.org
- PPMI (Parkinson's Progression Markers Initiative) — ppmi-info.org
- PubMed now documented with E-utilities API + 90-day freshness filter

### Source API Verification Needed

These APIs may not have public JSON endpoints:
- GP2: `https://gp2.org/search` — needs verification
- AMP PD: `https://amp-pd.org/api/search` — needs verification
- PPMI: `https://www.ppmi-info.org/api/search` — needs verification

If endpoints don't exist, these functions will gracefully fall back to empty string (no data passed to LLM). The graceful empty return prevents pipeline failures.

### Architecture

- `isFresh(dateStr)` — 90-day window filter
- `searchPubMed()` — E-utilities esearch + esummary
- `searchGP2()`, `searchAMPPD()`, `searchPPMI()` — HTTP JSON API calls (unverified endpoints)
- `fetchAllSources(query)` — Promise.all of all 4, filters empty, formats as `---\nSOURCE DATA\n---` block
- `researchCategory()` — appends source data to Groq prompt with freshness instruction

### Date
2026-05-20

---

## Task: Email Newsletter — Multimedia + EN/ES Segmentation

### What Was Changed

Modified `src/app/api/send-report/route.ts`:

1. **EN/ES Subscriber Segmentation** — Supabase query uses `language=eq.${lang}` filter directly in REST URL (server-side, not in-memory filter)

2. **Responsive HTML Email** — Table-based layout with MSO conditionals for Outlook compatibility:
   - Outer: `width="100%" min-width:320px`
   - Container: `max-width:680px`
   - MSO conditional comments (`<!--[if mso]>...<![endif]-->`) prevent Outlook ghosting
   - VML namespace + `border-collapse:collapse` in MSO styles

3. **Multimedia Per Section** — `SECTION_MEDIA` map: one Wikimedia Commons image + one YouTube video link per section category

4. **Content Freshness** — `isFresh(dateStr)` marks entries >90 days with `⚠️ 90+ days` badge; stale entries only shown if `prevReportDate` provided

5. **Repetition Avoidance** — `buildOnPrior()` generates EN/ES "Building on..." note when stale entries included

### API Contract Change

`prevReportDate` added as optional POST field — if provided and entries >90 days old, shows "Building on research from [date]" note.

### Date
2026-05-20