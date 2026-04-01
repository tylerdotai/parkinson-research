# 🧠 Parkinson Research Daily

**Autonomous AI research agent delivering daily Parkinson's disease reports via email.**

Every morning at 7:00 AM CDT, AI agents search clinical trials, medical journals, and research databases to bring you the latest breakthroughs, recruiting trials, and evidence-based tips for Parkinson's disease — delivered straight to your inbox.

## What We Track

### 🔬 Clinical Trials
Active recruiting trials, Phase 2/3 results, eligibility criteria, intervention types, and locations — with plain-language explanations of what each trial means for patients and families.

### 💊 Breakthrough Treatments
FDA approvals, drug mechanisms, clinical evidence, and emerging therapeutic approaches — explained in terms of how they could help daily life.

### 🏃 Lifestyle Interventions
Exercise protocols, dietary recommendations, sleep optimization, and stress management strategies — with specific, actionable advice.

### 🔬 Emerging Research
Novel therapeutic targets, biomarker discoveries, diagnostic advances, and preprint findings — with context on what these breakthroughs could mean for the future of treatment.

### 🤝 Community & Support
Local support groups, advocacy opportunities, caregiver resources, and outreach programs to help patients and families connect with the Parkinson's community.

## How It Works

```
OpenClaw Cron (7:00 AM CDT)
    ↓
Parkinson Research Skill
    ↓
4 Parallel AI Subagents → Aggregate Report
    ↓
Email to Subscribers
    ↓
Commit to GitHub + Vercel Deploy
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Research Agent | OpenClaw + MiniMax M2.7 |
| Scheduling | OpenClaw native cron |
| Email Delivery | iCloud SMTP (curl) |
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Deployment | Vercel |
| Data Storage | Markdown files (GitHub) |

## Setup

### Prerequisites
- Node.js 18+
- OpenClaw CLI
- iCloud SMTP access (or any SMTP provider)

### Email Configuration

The agent uses iCloud SMTP by default. To configure your own email:

1. Create `~/.config/himalaya/account.toml`:
```toml
[[accounts]]
name = "your-email"
email = "your@email.com"

[accounts.your-email.smtp]
host = "smtp.mail.me.com"  # or your provider's SMTP host
port = 465
username = "your@email.com"
password = "your-app-password"
tls = true
tls_autostart = true
```

2. Update the email command in `cron` to use your SMTP credentials.

3. Set the recipient in the cron message to your subscriber's email.

### Running the Research Agent Manually

```bash
# Run the research cron immediately
openclaw cron run <cron-id>

# Or spawn the subagents manually via OpenClaw
```

## Report Format

Each daily report includes:

1. **Clinical Trials** — What's recruiting, what just posted results, with patient-family context
2. **Breakthrough Treatments** — New approvals, drug updates, what they mean for daily life
3. **Lifestyle Interventions** — Exercise, diet, sleep, stress — evidence-based and actionable
4. **Emerging Research** — Cutting-edge science translated into plain language
5. **Community & Support** — Groups, advocacy, caregiver resources

## Deployment

Reports are published to a public website via Vercel:

- **Live site:** https://parkinson-research.vercel.app
- **Reports archive:** https://parkinson-research.vercel.app/reports

## For Patients & Families

This project exists to make cutting-edge Parkinson's research accessible to patients, caregivers, and families seeking actionable information.

**⚠️ Disclaimer:** This site provides informational content only. Always consult healthcare providers before making treatment decisions.

## Contributing

This is an open-source public benefit project. Contributions welcome:

- Improve report readability and accessibility
- Add new research categories or sources
- Translate into other languages
- Suggest additional community resources

## License

MIT License — built with 🤖 by Flume SaaS Factory

---

*Built for everyone affected by Parkinson's. Not affiliated with any medical institution.*
