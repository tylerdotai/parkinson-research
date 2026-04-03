# Parkinson Research Daily

**Autonomous AI research agent delivering daily Parkinson's disease reports — in English and Spanish. Live at [aiagainstparkinson.com](https://aiagainstparkinson.com).**

Every morning at 7:00 AM CDT, AI agents search clinical trials, medical journals, and research databases to bring you the latest breakthroughs, recruiting trials, and evidence-based tips for Parkinson's disease — delivered straight to your inbox.

## What's New

**New Domain** — Now live at [aiagainstparkinson.com](https://aiagainstparkinson.com)! Email delivery via Resend.

**Multilingual Support** — Full English and Spanish translations. Use the language switcher in the header to toggle between languages.

## What We Track

### Clinical Trials
Active recruiting trials, Phase 2/3 results, eligibility criteria — with plain-language explanations of what each trial means for patients and families.

### Breakthrough Treatments
FDA approvals, drug mechanisms, clinical evidence, and emerging therapeutic approaches — explained in terms of how they could help daily life.

### Lifestyle Interventions
Exercise protocols, dietary recommendations, sleep optimization, and stress management strategies — with specific, actionable advice.

### Emerging Research
Novel therapeutic targets, biomarker discoveries, diagnostic advances, and preprint findings — with context on what these breakthroughs could mean for the future of treatment.

### Community & Support
Local support groups, advocacy opportunities, caregiver resources, and outreach programs to help patients and families connect with the Parkinson's community.

## How It Works

```
OpenClaw Cron (7:00 AM CDT)
    |
    v
Parkinson Research Skill
    |
    v
4 Parallel AI Subagents --> Aggregate Report
    |
    v
Email to Subscribers
    |
    v
Commit to GitHub + Vercel Deploy
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Research Agent | OpenClaw + MiniMax M2.7 |
| Scheduling | OpenClaw native cron |
| Email Delivery | iCloud SMTP (curl) |
| Frontend | Next.js 16, TypeScript, Tailwind CSS 4 |
| Deployment | Vercel |
| Data Storage | Markdown files (GitHub) |
| i18n | Next.js App Router [lang] dynamic segment |

## Internationalization

The site supports **English** and **Spanish** with automatic locale detection.

- English: `/en/`
- Spanish: `/es/`

The middleware automatically detects browser language and redirects appropriately. Use the language switcher in the header to toggle languages.

## API Endpoints

All endpoints return JSON:

```
GET /[lang]/api/reports          # List all reports
GET /[lang]/api/reports/[date]   # Get specific report (YYYY-MM-DD)
GET /sitemap.xml                 # Sitemap for AI indexing
GET /robots.txt                  # Allows GPTBot, CCBot, anthropic-ai
```

Example response:
```json
{
  "count": 1,
  "reports": [
    {
      "date": "2026-03-31",
      "title": "Parkinson's Research Daily Report",
      "preview": "...",
      "url": "https://aiagainstparkinson.com/en/report/2026-03-31"
    }
  ],
  "_meta": {
    "source": "Parkinson Research Daily",
    "generated": "2026-03-31T12:00:00Z",
    "nextUpdate": "Daily at 7:00 AM CDT",
    "language": "en"
  }
}
```

## Setup

### Prerequisites
- Node.js 18+
- OpenClaw CLI
- iCloud SMTP access (or any SMTP provider)

### Email Configuration

Email delivery is handled by **Resend**. To configure:

1. Add your Resend API key to `.env.local`:
```bash
RESEND_API_KEY=re_your_api_key
```
2. Verify your sending domain in [Resend](https://resend.com/domains)
3. Update the cron agent with your Resend credentials

The cron agent constructs HTML emails directly and sends via the Resend API.

### Running Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — the site will redirect to `/en/` based on your browser language.

### Running Tests

```bash
npm test
```

## Project Structure

```
parkinson-research/
├── dictionaries/
│   ├── en.json          # English translations
│   └── es.json          # Spanish translations
├── public/
│   └── reports/         # Daily report markdown files
├── src/
│   ├── app/
│   │   ├── [lang]/      # Locale-specific routes
│   │   │   ├── about/
│   │   │   ├── api/reports/
│   │   │   ├── report/[date]/
│   │   │   └── reports/
│   │   ├── layout.tsx   # Root layout (redirects to /en)
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── Header.tsx   # Includes LanguageSwitcher
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── dictionary.ts # i18n dictionary loader
│   │   └── reports.ts   # Report file utilities
│   └── middleware.ts     # Locale detection & redirect
├── __tests__/
│   ├── dictionary.test.ts
│   └── reports.test.ts
├── EMAIL_SETUP.md
├── SPEC.md
└── package.json
```

## Deployment

Reports are published automatically via Vercel:

- **Live site:** https://aiagainstparkinson.com
- **English:** https://aiagainstparkinson.com/en
- **Spanish:** https://aiagainstparkinson.com/es
- **Reports archive:** https://aiagainstparkinson.com/en/reports

## For Patients & Families

This project exists to make cutting-edge Parkinson's research accessible to patients, caregivers, and families seeking actionable information.

**Disclaimer:** This site provides informational content only. Always consult healthcare providers before making treatment decisions.

## Contributing

This is an open-source public benefit project. Contributions welcome:

- Improve report readability and accessibility
- Add new research categories or sources
- Translate into other languages
- Suggest additional community resources
- Help families navigate the research

## License

MIT License — built with AI agents by Flume SaaS Factory

---

*Built for everyone affected by Parkinson's. Not affiliated with any medical institution.*
