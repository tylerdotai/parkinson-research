# Task 2: Pipeline Architecture Evidence

## Executive Summary

The Parkinson's research pipeline has **two parallel implementations**:
1. **skills/SKILL.md** — OpenClaw agent orchestration (primary, human-triggered)
2. **scripts/research-agent.ts** — Standalone Groq-powered script (production cron)

---

## 1. Sub-Agent Invocation Points

### Via OpenClaw Skill (skills/SKILL.md)

The skill describes spawning 4 parallel agents via `sessions_spawn` with `mode=run` and `runtime=subagent`:

| Agent | Section | Search Query |
|-------|---------|--------------|
| Agent 1 | Clinical Trials | `site:clinicaltrials.gov OR site:pubmed.gov` |
| Agent 2 | Breakthrough Treatments | `site:nih.gov OR site:ucsf.edu OR site:parkinson.org` |
| Agent 3 | Lifestyle Interventions | `site:pubmed.gov OR site:uci.edu` |
| Agent 4 | Emerging Research | `site:biorxiv.org OR site:pubmed.gov` |

### Via scripts/research-agent.ts (Production)

The production script uses **Groq LLM** (llama-3.1-8b-instant) to research each category. The sub-agent invocation is **not via sessions_spawn** but via `groqChat()` calling the Groq API directly. The categories are defined in the `CATEGORIES` array (lines 77-168).

---

## 2. Current Source List Per Sub-Agent

### Clinical Trials
```
site:clinicaltrials.gov OR site:pubmed.gov
```

### Breakthrough Treatments
```
site:nih.gov OR site:ucsf.edu OR site:parkinson.org
```

### Lifestyle Interventions
```
site:pubmed.gov OR site:uci.edu
```

### Emerging Research
```
site:biorxiv.org OR site:pubmed.gov
```

---

## 3. Source Integration Architecture

### Skills/SKILL.md (Source Definitions)
Lines 232-250 define **primary sources** and **do-not-use** sources:

**Primary sources (preferred):**
- ClinicalTrials.gov
- PubMed.gov
- NIH.gov / NINDS.nih.gov
- FDA.gov
- UCSF.edu
- Parkinson's Foundation (parkinson.org)
- Michael J. Fox Foundation (michaeljfox.org)
- Roche, AbbVie, Biogen press releases

### scripts/research-agent.ts (Source in Prompt)
The system prompt tells the LLM to use only credible institutions. Sources are NOT programmatically enforced — the LLM is instructed to use real URLs from credible institutions.

---

## 4. Where to Add New Sources

### PubMed (PubMed E-utilities API)

**Current status:** Already indirectly used (site:pubmed.gov in searches)

**Where to add API query capability:**
- `scripts/research-agent.ts` — Add `searchPubMed(query: string)` function using E-utilities API
- The `CATEGORIES` array (lines 77-168) `searchQuery` fields would be replaced by structured PubMed queries
- Example endpoint: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=Parkinson+disease+clinical+trial&retmax=5&retmode=json`

### GP2 (Global Parkinson's Genetics Program)

**Current status:** NOT currently used

**Where to add:**
- `scripts/research-agent.ts` — Add `searchGP2()` function
- GP2 data portal: `https://gp2.org/`
- Add to Emerging Research category or create new Genetics category
- GP2 API/training data endpoint would need to be researched

### AMP PD (Accelerating Medicines Partnership Parkinson's)

**Current status:** NOT currently used

**Where to add:**
- `scripts/research-agent.ts` — Add `searchAMPPD()` function
- AMP PD data: `https://amp-pd.org/`
- Add to Emerging Research category
- Would require understanding AMP PD data release schedule

### PPMI (Parkinson's Progression Markers Initiative)

**Current status:** NOT currently used

**Where to add:**
- `scripts/research-agent.ts` — Add `searchPPMI()` function
- PPMI data portal: `https://www.ppmi-info.org/`
- Add to Emerging Research or Clinical Trials category

---

## 5. Implementation Entry Points

The **primary entry point** for adding new sources is `scripts/research-agent.ts`:

1. **CATEGORIES array** (lines 77-168) — Contains `searchQuery` for each category
2. **researchCategory()** function (lines 172-186) — Calls Groq with category-specific prompts
3. **groqChat()** function (lines 35-63) — Makes API calls to Groq

To add structured API queries (PubMed, GP2, AMP PD, PPMI):

1. Create new async functions (e.g., `searchPubMed()`, `searchGP2()`)
2. Modify `CATEGORIES` array to include a new field like `customSearch?: (query: string) => Promise<string>`
3. Update `researchCategory()` to use custom search functions before falling back to Groq

---

## 6. Key Findings

1. **Two pipeline implementations exist** — SKILL.md describes OpenClaw agent-based approach; research-agent.ts is the standalone Groq-based production script
2. **Sources are search-query strings, not structured API calls** — Currently relies on LLM to produce credible sources from web search
3. **No programmatic enforcement of sources** — The LLM is instructed to use credible sources but there's no validation
4. **Groq API is the research engine** in production — not sub-agents as described in SKILL.md
5. **generate-report.ts** is a simpler fallback using DuckDuckGo HTML scraping

---

*Generated: Task 2 Pipeline Architecture Documentation*