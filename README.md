# AI Against Parkinson's

Daily AI-compiled research reports on Parkinson's disease — clinical trials, breakthrough treatments, lifestyle interventions, and emerging science. Free, bilingual (EN/ES), delivered to your inbox.

**Live:** [aiagainstparkinson.com](https://aiagainstparkinson.com)

---

## What It Does

Every morning, AI research agents search ClinicalTrials.gov, PubMed, and medical news sources to surface what's new in Parkinson's research. Reports are written in plain language, reviewed for accuracy, and delivered by email to subscribers. Reports are also published to the web in English and Spanish.

**Who it's for:** Patients, caregivers, and families navigating Parkinson's who want to stay current without wading through medical journals.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS 4 |
| Email | Resend (transactional API) |
| Database | Supabase (PostgreSQL) — subscribers + report reviews |
| Research | MiniMax M2.7 via OpenClaw subagents |
| Scheduling | OpenClaw native cron (7:00 AM CDT daily) |
| Deployment | Vercel |
| i18n | Next.js App Router `[lang]` route groups (EN + ES) |

---

## Setup

### Prerequisites

- Node.js 18+
- npm or pnpm
- Supabase project (free tier works)
- Resend API key (free tier: 100 emails/day)

### Environment Variables

Create `.env.local` in the project root:

```bash
# Supabase — found in Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Resend — found at resend.com/api-keys
RESEND_API_KEY=re_your_key
```

### Install and Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — English homepage loads by default; use the language switcher in the header to toggle Spanish.

### Database Setup

Run the Supabase schema in your project SQL Editor:

```bash
# Subscribers table
cat supabase_schema.sql

# Reports + reviews tables
cat supabase_schema_reports.sql
```

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
parkinson-research/
├── dictionaries/
│   ├── en.json              # English strings
│   └── es.json              # Spanish strings
├── public/
│   └── reports/
│       ├── YYYY-MM-DD.md     # English daily reports
│       └── es/
│           └── YYYY-MM-DD.md # Spanish daily reports
├── src/
│   ├── app/
│   │   ├── [lang]/           # Locale routes (en/ + es/)
│   │   │   ├── about/
│   │   │   ├── api/
│   │   │   │   ├── reports/  # GET reports list or by date
│   │   │   │   ├── subscribe/
│   │   │   │   └── unsubscribe/
│   │   │   ├── privacy/
│   │   │   ├── report/[date]/
│   │   │   ├── reports/
│   │   │   ├── resources/
│   │   │   └── terms/
│   │   ├── api/              # Root API routes
│   │   │   ├── reports/store # Cron: store generated report
│   │   │   └── reports/review # Cron: AI review stored report
│   │   ├── layout.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── SubscribeForm.tsx
│   │   └── report/           # Report rendering components
│   └── lib/
│       ├── dictionary.ts     # i18n loader
│       ├── parseReport.ts    # Markdown → structured sections
│       ├── reports.ts        # Report file utilities
│       └── supabase.ts       # DB + subscriber operations
├── supabase_schema.sql               # Subscribers table
├── supabase_schema_reports.sql        # Reports + reviews tables
├── EMAIL_SETUP.md            # Email delivery configuration guide
└── package.json
```

---

## How Reports Work

1. **Cron fires** at 7:00 AM CDT via OpenClaw
2. **4 research subagents** run in parallel (Clinical Trials, Breakthroughs, Lifestyle, Emerging Research)
3. Each agent queries public medical sources and returns structured findings
4. Results are assembled into a bilingual Markdown report
5. Report is stored in **Supabase** (`reports` table)
6. Report is AI-reviewed for medical accuracy via `/api/reports/review`
7. Report is committed to `public/reports/` and pushed to GitHub
8. Vercel auto-deploys the updated site
9. Report is emailed to EN and ES subscriber lists via Resend

---

## API Endpoints

```
GET  /[lang]/api/reports           # List all reports (JSON)
GET  /[lang]/api/reports/[date]    # Single report by date (YYYY-MM-DD)
GET  /[lang]/api/reports?lang=es   # Spanish reports only
GET  /sitemap.xml                   # Sitemap
GET  /robots.txt                   # Allows AI crawlers
```

---

## Contributing

This is a public benefit project. Contributions welcome:

- Improve plain-language writing in reports
- Add new research categories or source databases
- Expand language support (Spanish is first non-English)
- Strengthen the AI review pipeline
- Suggest credible sources the agents should search

Open an issue or submit a PR.

---

## Disclaimer

Content is for informational purposes only. It is not medical advice. Always consult a healthcare provider before making treatment decisions.
