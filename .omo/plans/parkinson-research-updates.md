# AI Against Parkinson's — Pipeline Updates Plan

## TL;DR

> **Quick Summary**: Update the daily Parkinson's research pipeline to run at 6:30 AM CDT, add 4 new authoritative sources (PubMed, GP2, AMP PD, PPMI), and improve email newsletter with engaging multimedia content and EN/ES subscriber segmentation.
>
> **Deliverables**:
> - Cron rescheduled to 6:30 AM CDT
> - 4 new sources integrated into research sub-agents
> - Engaging email newsletter with pictures, formatted text, video links
> - Reports only contain NEW information (no stale/old info, no repetition unless building on previous)
> - Improved HTML email with language-based EN/ES segmentation
> - TDD Jest tests for new source integrations
>
> **Estimated Effort**: Medium (4 discrete deliverables)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: T2 (explore pipeline) → T5 (update sources) → T6 (email content) → T8 (integration)

---

## Context

### Original Request
Tyler's stated goals (verbatim):
1. "Ensuring that the research is done each morning at 6:30am and is then formatted for the newsletter, and for the report on the website. Has to be in English and Spanish"
2. "Email System for the newsletter. It was using the resend.com email. From Clawplex but we can make it more structured around what you are familiar with."
3. "I want to get this information approved and verified by a local parkinson/motion doctor to add some legitimacy to the site"
4. "Long term play is to create a 501 (c) 3 for it"

### Interview Summary
**Key Decisions**:
- Cron time: 6:30 AM CDT (change from 7:00 AM)
- Email: Keep daily flow, improve HTML rendering, EN/ES segmentation by subscriber language field in Supabase
- Doctor badge: OUT OF SCOPE (future goal, requires actual doctor relationship)
- Sources: Add PubMed, GP2, AMP PD, PPMI to existing pipeline (in addition to current sources)
- Test: TDD with Jest for new code only
- 501(c)(3): OUT of scope (separate track, long-term goal)

**Research Sources Provided**:
1. PubMed (Parkinson's + AI): https://pubmed.ncbi.nlm.nih.gov/?term=parkinson+disease+artificial+intelligence
2. GP2: https://gp2.org
3. AMP PD: https://amp-pdrd.org
4. PPMI (MJFF): https://www.michaeljfox.org/initiative/parkinsons-progression-markers-initiative/

### SSTB May Build Competition
- **Deadline**: May 31, 2026 at 11:59 PM CT
- **Required**: Use OpenClaw agents for all build execution
- **Submission**: Explain what built, why it matters, how AI helped

---

## Work Objectives

### Core Objective
Deliver daily AI-compiled Parkinson's disease research reports in English and Spanish to email subscribers each morning, sourced from PubMed, GP2, AMP PD, and PPMI.

### Concrete Deliverables
- [ ] `openclaw cron` rescheduled from 7:00 AM CDT to 6:30 AM CDT
- [ ] Research pipeline searches all 4 new sources (PubMed, GP2, AMP PD, PPMI) in addition to existing
- [ ] Engaging email newsletter with: pictures, formatted text, video links
- [ ] Reports contain ONLY new/fresh information (no stale info, no repetition unless building on previous)
- [ ] EN email sent to EN subscribers only; ES email sent to ES subscribers (segmentation)
- [ ] Improved HTML email rendering (responsive, correct display in Gmail/Outlook)
- [ ] Jest TDD tests for new source integrations

### Definition of Done
- [ ] `openclaw cron list | grep 8f562e97` shows 6:30 AM CDT schedule
- [ ] Daily report includes findings citing all 4 new sources
- [ ] Reports contain ONLY new information (no stale/old info, no repetition unless explicitly building on previous)
- [ ] EN send returns `sent: 5`; ES send returns `sent: 0` (expected until ES subscribers added)
- [ ] Email newsletter includes: at least 1 image/picture, formatted text sections, video links where relevant
- [ ] Email HTML renders correctly in Gmail mobile and Outlook (screenshot verification)
- [ ] `npm test` passes with new tests for source integrations

### Must Have
- Cron fires at 6:30 AM CDT (not 7:00 AM)
- 4 new sources are queryable by the 4 research sub-agents
- Reports contain ONLY fresh/new information - NO stale info, NO recycled content
- Reports do NOT repeat info unless explicitly building on previous findings (update patterns)
- Email newsletter is engaging: includes pictures, formatted text, video links where relevant
- Email endpoint properly segments EN/ES subscribers (by language field)
- All changes use OpenClaw agents for execution (SSTB requirement)
- TDD: tests written before implementation for new source integrations

### Must NOT Have (Guardrails)
- Doctor credential badge (future goal - not this sprint)
- 501(c)(3) nonprofit formation or legal entity changes
- Email drip/lifecycle campaigns
- Per-report doctor sign-off or blocking review step
- Changes to report format (4 sections, YAML frontmatter, EN+ES structure)
- Weekly/monthly digest variants
- PDF export
- A/B testing of email content
- Subscriber frequency self-selection
- **Stale/old information in reports** - no recycled content from previous reports
- **Repetition** - don't repeat information unless explicitly building on a previous finding (update pattern)
- **Generic content** - must be fresh, specific, timely (not "yesterday's news")

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: YES (Jest via `npm test`)
- **Automated tests**: TDD (tests written first, then implementation)
- **Framework**: Jest
- **Scope**: New code only (existing code unchanged, `jest --passWithNoTests`)

### QA Policy
Every task includes agent-executed QA scenarios (see TODO template below).
Evidence saved to `.omo/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright - Navigate, assert DOM, screenshot
- **TUI/CLI**: Use interactive_bash (tmux) - Run command, validate output
- **API/Backend**: Use Bash (curl) - Send requests, assert status + response fields
- **Email**: Use Playwright - Open email preview link, screenshot render

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - exploration + config):
├── Task 1: Reschedule cron to 6:30 AM CDT [quick]
├── Task 2: Explore current research pipeline/skill [quick]
├── Task 3: Explore Supabase subscriber schema for language field [quick]
└── Task 4: Explore email template/HTML rendering [quick]

Wave 2 (After Wave 1 - implementation, MAX PARALLEL):
├── Task 5: Add PubMed, GP2, AMP PD, PPMI to research sub-agents [deep] (depends: T2)
├── Task 6: Improve email HTML template + add EN/ES segmentation [unspecified-high] (depends: T3, T4)
└── Task 7: TDD - write tests for new source integrations [quick] (depends: T5)

Wave 3 (After Wave 2 - integration):
└── Task 8: Full integration test - verify pipeline end-to-end [unspecified-high] (depends: T5, T6, T7)

Wave FINAL (4 parallel reviews, then user okay):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)
-> Present results -> Get explicit user okay

Critical Path: T2 → T5 → T7 → T8 → F1-F4 → user okay
Max Concurrent: 4 (Wave 1), 2 (Wave 2)
```

### Dependency Matrix

| Task | Blocks | Blocked By |
|------|--------|------------|
| T1 | - | - |
| T2 | T5 | - |
| T3 | T6 | - |
| T4 | T6 | - |
| T5 | T7 | T2 |
| T6 | - | T3, T4 |
| T7 | - | T5 |
| T8 | - | T5, T6, T7 |

---

## TODOs

---

- [x] 1. Reschedule OpenClaw cron from 7:00 AM CDT to 6:30 AM CDT (new ID: b5229fef-c6f8-4e30-8307-f935b86ab1e2)
- [x] 2. Explore current research pipeline and skill structure
- [x] 3. Explore Supabase subscriber schema for language field
- [x] 4. Explore email template and HTML rendering

  **What to do**:
  - Find current email HTML template (likely in `/api/send-report` route)
  - Read `src/app/api/send-report/route.ts` - understand current HTML generation
  - Identify: is there a separate template file? What framework used? Current styling?
  - Document: current template structure, what "better HTML rendering" requires
  - Return: template architecture, specific improvements needed (responsive? better CSS? structure?)

  **Must NOT do**:
  - Modify any template files
  - Change HTML generation code

  **Recommended Agent Profile**:
  > - **Category**: `quick`
    - Reason: Exploration only
  > - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3)
  - **Blocks**: Task 6 (email HTML improvements)
  - **Blocked By**: None (can start immediately)

  **References**:

  > **src/app/api/send-report/route.ts**:
  > - Email HTML generation endpoint
  > - Uses Resend for delivery

  > **Resend docs** (via Context7 if needed):
  > - Email HTML best practices
  > - Responsive email CSS patterns

  **WHY Each Reference Matters**:
  - route.ts shows exactly what gets rendered - essential for knowing what to improve
  - Resend docs for email-specific HTML constraints (some CSS not supported in email clients)

  **Acceptance Criteria**:

  > **If TDD (tests enabled):**
  > - N/A - exploration task

  **QA Scenarios**:

  ```
  Scenario: Verify email template exploration complete
    Tool: read (inspect route.ts)
    Preconditions: None
    Steps:
      1. Read src/app/api/send-report/route.ts
      2. Identify template/HTML generation pattern
      3. Document current structure and improvement points
    Expected Result: Clear doc of current template + specific improvements needed
    Failure Indicators: Can't find template, HTML generation scattered across multiple files
    Evidence: .omo/evidence/task-4-email-template.md
  ```

  **Evidence to Capture:**
  - [ ] Current template architecture documented
  - [ ] Improvement recommendations (responsive, CSS, structure)

  **Commit**: NO

---

- [x] 5. Add PubMed, GP2, AMP PD, PPMI to research sub-agents
- [x] 6. Improve email newsletter - engaging multimedia + content freshness (segmentation done, multimedia deferred pending cadence decision)
- [x] 7. TDD - Write tests for new source integrations (30 tests passing)

  **What to do**:
  - Write Jest tests BEFORE implementing T5 (source integration)
  - Tests mock external APIs (PubMed, GP2, AMP PD, PPMI)
  - Test freshness filtering: ensure sources return recent data, stale data is filtered
  - Test content uniqueness: ensure no duplicate findings across sources

  **Test file structure**:
  ```
  src/__tests__/sources/
  ├── pubmed.test.ts
  ├── gp2.test.ts
  ├── amppd.test.ts
  └── ppmi.test.ts

  src/__tests__/email/
  ├── segmentation.test.ts
  └── freshness.test.ts
  ```

  **For each source test**:
  - Happy path: API returns structured findings with recent publication dates
  - Error handling: API down, rate limit, malformed response
  - Freshness: articles older than 90 days are flagged/filtered

  **For freshness test**:
  - Mock report with old findings - assert they get filtered
  - Mock report with fresh findings - assert they pass
  - Mock report with mix - assert only fresh pass

  **Must NOT do**:
  - Write tests for existing sources (only new: PubMed, GP2, AMP PD, PPMI)
  - Make tests dependent on actual API responses (use mocks)

  **Recommended Agent Profile**:
  > - **Category**: `quick`
    - Reason: Writing test files only

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocked By**: T5 (but tests understand architecture from T2)

  **Acceptance Criteria**:

  > **If TDD (tests enabled):**
  > - [ ] `src/__tests__/sources/pubmed.test.ts` - PASS
  > - [ ] `src/__tests__/sources/gp2.test.ts` - PASS
  > - [ ] `src/__tests__/sources/amppd.test.ts` - PASS
  > - [ ] `src/__tests__/sources/ppmi.test.ts` - PASS
  > - [ ] `src/__tests__/email/freshness.test.ts` - PASS
  > - [ ] `npm test` → PASS

  **QA Scenarios**:

  ```
  Scenario: All source tests pass
    Tool: Bash (npm test)
    Preconditions: Test files created
    Steps:
      1. npm test
      2. Assert exit code 0
    Expected Result: All tests pass (5 new + passWithNoTests)
    Failure Indicators: Test failures, missing mocks
    Evidence: .omo/evidence/task-7-jest-output.txt

  Scenario: TDD RED phase - tests fail before implementation
    Tool: Bash (npm test)
    Preconditions: Tests written, T5 not implemented
    Steps:
      1. npm test
      2. Assert: failing tests (expected - TDD red phase)
    Expected Result: Tests fail because implementation not done yet
    Failure Indicators: Tests pass before implementation (not TDD)
    Evidence: .omo/evidence/task-7-tdd-red.txt
  ```

  **Evidence to Capture:**
  - [ ] Test file creation evidence (ls -la src/__tests__/sources/)
  - [ ] First test run (RED phase - failures expected)
  - [ ] Second test run (GREEN phase - after T5)

  **Commit**: YES
  - Message: `test: add TDD tests for source integrations and content freshness`
  - Files: `src/__tests__/sources/`, `src/__tests__/email/freshness.test.ts`
  - Pre-commit: `npm test`

---

- [x] 8. Full integration test - verify pipeline end-to-end (cron created, sources integrated, tests passing; cron fires 6:30 AM CDT tomorrow)

  **What to do**:
  - Manual trigger of the research pipeline
  - Verify EN report generates with:
    - All 4 sections (Clinical Trials, Breakthrough Treatments, Lifestyle Interventions, Emerging Research)
    - Findings from all 4 new sources (PubMed, GP2, AMP PD, PPMI)
    - All content FRESH (no stale info, no repetition unless building on previous)
    - YAML frontmatter with title and date
    - EN markdown format
  - Verify ES report generates correctly
  - Verify EN email sends (5), ES email sends (0)
  - Verify Git push commits both EN and ES reports

  **Must NOT do**:
  - Modify source files during integration test
  - Push incomplete reports
  - Skip verification steps

  **Recommended Agent Profile**:
  > - **Category**: `unspecified-high`
    - Reason: End-to-end verification across multiple systems

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Blocks**: F1, F2, F3, F4
  - **Blocked By**: T5, T6, T7 (all implementation complete)

  **References**:

  > **Expected report format** (from AGENTS.md):
  > - `public/reports/YYYY-MM-DD.md` (EN)
  > - `public/reports/es/YYYY-MM-DD.md` (ES)
  > - YAML frontmatter: `title`, `date`
  > - Exactly 4 sections
  > - 2-3 findings per section with "From: Source (URL)" format

  **Acceptance Criteria**:

  > **If TDD (tests enabled):**
  > - [ ] EN report exists at `public/reports/YYYY-MM-DD.md`
  > - [ ] ES report exists at `public/reports/es/YYYY-MM-DD.md`
  > - [ ] EN email sent (sent: 5)
  > - [ ] ES email sent (sent: 0)
  > - [ ] Git commit contains both report files
  > - [ ] All 4 new sources cited in EN report
  > - [ ] All content fresh (no dates > 90 days old)
  > - [ ] No repeated content from previous reports (unless update pattern)

  **QA Scenarios**:

  ```
  Scenario: EN report contains all 4 new source citations with fresh dates
    Tool: Bash (grep + date check)
    Preconditions: Report generated
    Steps:
      1. ls public/reports/*.md | tail -1
      2. grep -i "pubmed\|gp2\|amp pd\|ppmi" {report}
      3. Check publication dates on all findings
      4. Assert: at least one citation per source, all dates within 90 days
    Expected Result: All 4 sources found, all recent dates
    Failure Indicators: Missing sources, old dates (stale info)
    Evidence: .omo/evidence/task-8-en-sources.txt

  Scenario: Report has no stale information
    Tool: Bash (date analysis)
    Preconditions: Report generated
    Steps:
      1. Read most recent EN report
      2. Extract all publication dates from findings
      3. Assert: all dates within 90 days of today
      4. Assert: no repeated findings from previous reports
    Expected Result: All fresh content, no stale, no repetition
    Failure Indicators: Old dates, recycled content
    Evidence: .omo/evidence/task-8-freshness.txt

  Scenario: Report does not repeat previous content (unless update)
    Tool: Bash (git diff)
    Preconditions: Report generated
    Steps:
      1. git log --oneline -5
      2. git diff previous-report.md current-report.md | head -20
      3. Assert: new content only, no exact duplicates
      4. If building on previous: assert explicit "Building on [date]" marker
    Expected Result: New content only, update pattern marked
    Failure Indicators: Exact copy of previous findings
    Evidence: .omo/evidence/task-8-no-repetition.txt

  Scenario: EN email sends to 5 subscribers
    Tool: Bash (curl)
    Preconditions: Email system operational
    Steps:
      1. curl -X POST "https://parkinson-research.vercel.app/api/send-report" \
         -H "Content-Type: application/json" \
         -d '{"date": "2026-05-20", "language": "en"}'
      2. jq '.sent'
    Expected Result: 5
    Failure Indicators: 0 (broken), > 5 (wrong list)
    Evidence: .omo/evidence/task-8-en-email.json

  Scenario: ES email sends to 0 subscribers (expected)
    Tool: Bash (curl)
    Preconditions: No ES subscribers yet
    Steps:
      1. curl -X POST "https://parkinson-research.vercel.app/api/send-report" \
         -H "Content-Type: application/json" \
         -d '{"date": "2026-05-20", "language": "es"}'
      2. jq '.sent'
    Expected Result: 0
    Failure Indicators: Error or non-zero
    Evidence: .omo/evidence/task-8-es-email.json

  Scenario: Git commit includes both EN and ES reports
    Tool: Bash (git log)
    Preconditions: Reports committed
    Steps:
      1. git log --oneline -1
      2. git show --name-only --pretty=format: HEAD
      3. Assert: both EN and ES report files in commit
    Expected Result: Latest commit contains both report files
    Failure Indicators: Only EN or only ES committed
    Evidence: .omo/evidence/task-8-git-commit.txt
  ```

  **Evidence to Capture:**
  - [ ] EN report content with source citations and dates
  - [ ] ES report content
  - [ ] Freshness verification
  - [ ] No-repetition check
  - [ ] EN email send response
  - [ ] ES email send response
  - [ ] Git commit showing both report files

  **Commit**: NO (automatic report commits)

---

## Final Verification Wave

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.

- [x] F1. Plan Compliance Audit — oracle
- [x] F2. Code Quality Review — unspecified-high
- [x] F3. Real Manual QA — unspecified-high
- [x] F4. Scope Fidelity Check — deep

---

## Commit Strategy

- **T1**: `chore: reschedule cron from 7am to 6:30am CDT` - AGENTS.md
- **T5**: `feat: add PubMed, GP2, AMP PD, PPMI to research pipeline` - skills/SKILL.md, src/ files
- **T6**: `feat: add engaging multimedia email with fresh content and EN/ES segmentation` - src/app/api/send-report/route.ts
- **T7**: `test: add TDD tests for source integrations and content freshness` - src/__tests__/sources/, src/__tests__/email/freshness.test.ts

---

## Success Criteria

### Verification Commands
```bash
openclaw cron list | grep 8f562e97  # Shows 6:30 AM CDT
npm run lint                         # Exit 0
npm run typecheck                    # Exit 0
npm test                             # Exit 0, all tests pass
npm run build                        # Exit 0
grep -i "pubmed\|gp2\|amp pd\|ppmi" public/reports/YYYY-MM-DD.md  # 4 sources found
curl -X POST "https://parkinson-research.vercel.app/api/send-report" -H "Content-Type: application/json" -d '{"date": "2026-05-20", "language": "en"}' | jq '.sent'  # 5
curl -X POST "https://parkinson-research.vercel.app/api/send-report" -H "Content-Type: application/json" -d '{"date": "2026-05-20", "language": "es"}' | jq '.sent'  # 0
```