# CI/CD Pipeline Audit — parkinson-research

**Date:** 2026-05-20
**Auditor:** Claude Code

---

## Pipeline Diagram

```
[push to main / PR]
       │
       ▼
┌─────────────────┐
│   ci.yml        │  lint → typecheck → test → build → audit
│   (CI pipeline)  │  ⚠ Missing: content-validation
└────────┬────────┘
         │ pass
         ▼
┌─────────────────┐
│  deploy.yml     │  Build → Deploy to Vercel
│  (on push main) │  ⚠ No dependency on ci.yml passing
└─────────────────┘

──────────────────────────────────────────────────────────────

DAILY CRON (12:00 UTC / 7 AM CDT) — TWO CONFLICTING WORKFLOWS:

Option A: generate-report.yml
  └── npx tsx scripts/generate-report.ts  (uses MINIMAX_API_KEY)

Option B: cron-report.yml
  └── npx tsx scripts/research-agent.ts  (uses GROQ_API_KEY)
        └── POST /api/send-report (en)
        └── POST /api/send-report (es)

⚠ BOTH FIRE AT SAME TIME — will conflict or duplicate
```

---

## Per-Workflow Status

### 1. `ci.yml` — CI Pipeline

| Status | **BROKEN** |
|--------|------------|

**Trigger:** Push to `main`, PRs to `main`

**Jobs:**
| Job | Status | Notes |
|-----|--------|-------|
| lint-and-typecheck | Working | ESLint + TypeScript check |
| test | Working | Jest runs, coverage uploaded |
| build | Working | Next.js build, artifact uploaded |
| audit | Partial | npm audit OK; Snyk `continue-on-error: true` |

**Issues:**
- **CRITICAL: `content-validation` step missing.** AGENTS.md line 32 specifies CI order: `lint → typecheck → test → build → content-validation`. The `scripts/content-validation.ts` exists but is **never called** by any workflow.
- **CRITICAL: No `needs` dependency on build in ci.yml.** `deploy.yml` fires on push to `main` with no check that `ci.yml` passed. A failing build could be deployed.

---

### 2. `deploy.yml` — Vercel Deploy

| Status | **BROKEN** |
|--------|------------|

**Trigger:** Push to `main`, manual (`workflow_dispatch`)

**Jobs:** deploy

**Issues:**
- **No gate on CI success.** Fires immediately on push to `main` without waiting for `ci.yml`. Could deploy broken code.
- Should add: `needs: [lint-and-typecheck, test, build]` or trigger only on `ci.yml` completion via `workflow_run`.

---

### 3. `generate-report.yml` — Daily Report Generation

| Status | **CONFLICTING** |
|--------|------------------|

**Trigger:** Schedule `0 12 * * *` (12:00 UTC / 7 AM CDT), manual

**Issues:**
- **Conflicts with `cron-report.yml`.** Both fire at `0 12 * * *` simultaneously.
- **Wrong script.** Calls `scripts/generate-report.ts` (MINIMAX_API_KEY). AGENTS.md describes the pipeline as `npm run research` → `scripts/research-agent.ts`.
- **No conditional commit.** Commits even if nothing changed, but has an if-check. Could race with `cron-report.yml`.

---

### 4. `cron-report.yml` — Backup Cron + Email

| Status | **CONFLICTING** |
|--------|------------------|

**Trigger:** Schedule `0 12 * * *` (12:00 UTC / 7 AM CDT), manual

**Issues:**
- **Conflicts with `generate-report.yml`.** Both fire at same time.
- **Broken `REPORT_DATE` input.** Line 34: `needs.date.outputs.date` — but there is no `date` job. This resolves to empty/undefined.
- **GROQ_API_KEY referenced.** Uses `GROQ_API_KEY` env var — is this correct? AGENTS.md mentions OpenClaw with MiniMax M2.7.
- **Email trigger is hardcoded POST to live URL.** Relies on external endpoint being reachable.

---

### 5. `audit.yml` — Weekly Security Audit

| Status | **PARTIAL** |
|--------|-------------|

**Trigger:** Schedule `0 0 * * 1` (Monday midnight UTC), manual

**Jobs:** audit

**Issues:**
- **Snyk runs `continue-on-error: true`.** Failures are silently ignored.
- **SNYK_TOKEN secret required but optional.** If not set, Snyk step fails silently.
- **Trivy scan uses `aquasec/trivy:latest`.** Floating tag — non-deterministic. Should pin a version.

---

## Missing / Orphaned Config

### `content-validation.ts` — **ORPHANED**

**Location:** `scripts/content-validation.ts`

**Problem:** Referenced in AGENTS.md (line 116) as a CI step, but **no workflow calls it**.

```bash
# What AGENTS.md says:
CI order: lint → typecheck → test → build → content-validation

# What ci.yml actually does:
lint → typecheck → test → build → audit
#                                                     ^ missing ^
```

The script:
1. Starts a Next.js dev server on port 3001
2. Validates EN and ES pages return HTTP 200
3. Validates report JSON files have required fields (`date`, `title`, `sections`, `lang`)
4. Runs against standalone output in `.next/standalone/public/reports`

**Problem:** The standalone output path requires `output: 'standalone'` in `next.config.js` — not confirmed if configured.

---

## Script Inventory

| Script | Referenced By | Status |
|--------|---------------|--------|
| `scripts/research-agent.ts` | `cron-report.yml` (GROQ_API_KEY) | Orphaned — wrong env var |
| `scripts/generate-report.ts` | `generate-report.yml` (MINIMAX_API_KEY) | Active — but conflicts |
| `scripts/content-validation.ts` | **Nobody** | Orphaned |
| `scripts/test-email.ts` | Nobody | Likely orphaned |

---

## Env Var Inconsistencies

| Workflow | Env Var | Notes |
|----------|---------|-------|
| `generate-report.yml` | `MINIMAX_API_KEY` | MiniMax (per AGENTS.md) |
| `cron-report.yml` | `GROQ_API_KEY` | Wrong — Groq ≠ MiniMax |

---

## Recommendations

### Priority 1 — Fix Immediately

1. **Add `content-validation` to CI or remove from AGENTS.md**
   - Either add the step to `ci.yml` after build, or remove the reference from AGENTS.md
   - If adding: `run: npx tsx scripts/content-validation.ts` (requires standalone output configured)

2. **Add `needs: [build]` gate to `deploy.yml`**
   ```yaml
   deploy:
     needs: [build]  # reference the job name in ci.yml
     # OR trigger deploy only on ci.yml workflow completion
   ```

3. **Resolve cron conflict — pick ONE workflow**
   - Either `generate-report.yml` OR `cron-report.yml`, not both
   - Recommended: Keep `generate-report.yml` (has commit+push), delete `cron-report.yml`

4. **Fix `cron-report.yml` `REPORT_DATE`**
   - Remove the broken `needs.date.outputs.date` reference
   - Use `date +%Y-%m-%d` directly

### Priority 2 — Clean Up

5. **Unify API key env var**
   - Both cron workflows should use same `MINIMAX_API_KEY`

6. **Pin Trivy image tag in `audit.yml`**
   - Replace `aquasec/trivy:latest` with `aquasec/trivy:0.50.0` or similar

7. **Add `permissions` to workflows**
   - GitHub Actions should declare minimal permissions for security

8. **Configure Next.js standalone output**
   - Required for `content-validation.ts` to work as intended

---

## Summary Table

| Workflow | Status | Critical Issues |
|----------|--------|-----------------|
| ci.yml | BROKEN | Missing content-validation step |
| deploy.yml | BROKEN | No CI gate, could deploy broken code |
| generate-report.yml | CONFLICTING | Duplicate cron with cron-report.yml |
| cron-report.yml | CONFLICTING | Duplicate cron, broken REPORT_DATE |
| audit.yml | PARTIAL | Snyk silent failures, floating image tag |

**Orphaned:** `scripts/content-validation.ts` (exists, referenced, never called)
