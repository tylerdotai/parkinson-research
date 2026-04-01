# 🧠 Parkinson Research Daily

**Autonomous AI research agent delivering daily Parkinson's disease reports.**

Every morning at 7:00 AM CDT, AI agents search clinical trials, medical journals, and research databases to bring you the latest breakthroughs, recruiting trials, and evidence-based tips for Parkinson's disease.

## What We Track

### 🔬 Clinical Trials
Active recruiting trials, Phase 2/3 results, eligibility criteria, intervention types, and locations.

### 💊 Breakthrough Treatments
FDA approvals, drug mechanisms, clinical evidence, and emerging therapeutic approaches.

### 🏃 Lifestyle Interventions
Exercise protocols, dietary recommendations, sleep optimization, and stress management strategies.

### 🔬 Emerging Research
Novel therapeutic targets, biomarker discoveries, diagnostic advances, and preprint findings.

## How It Works

```
OpenClaw Cron (7:00 AM CDT)
    ↓
Parkinson Research Skill
    ↓
4 Parallel AI Subagents → Aggregate Report
    ↓
Commit to GitHub
    ↓
Vercel Auto-Deploys
    ↓
parkinson-research.vercel.app
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Research Agent | OpenClaw + MiniMax M2.7 |
| Scheduling | OpenClaw native cron |
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Deployment | Vercel |
| Data Storage | Markdown files (GitHub) |

## For Patients & Families

This project exists to make cutting-edge Parkinson's research accessible to patients, caregivers, and families seeking actionable information.

**⚠️ Disclaimer:** This site provides informational content only. Always consult healthcare providers before making treatment decisions.

## Contributing

This is an open-source public benefit project. Contributions welcome:

- Report broken links or outdated information
- Suggest additional research sources
- Improve readability and accessibility
- Translate into other languages

## License

MIT License — built with 🤖 by Flume SaaS Factory

---

*Built for everyone affected by Parkinson's. Not affiliated with any medical institution.*
