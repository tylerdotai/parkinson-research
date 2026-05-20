# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| main    | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

**Please do NOT file a public GitHub issue.**

Send a private report to: **tyler@aiagainstparkinson.com**

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (optional)

**Response timeline**: I aim to acknowledge within 48 hours and provide a timeline for resolution.

## Scope

This policy covers:
- The web application at aiagainstparkinson.com
- The research pipeline and data handling
- Email delivery systems (Resend API)
- Subscriber data (email addresses stored in Supabase)

This does NOT cover:
- Third-party services beyond our direct integration (Resend, Supabase, Vercel)
- Social media accounts or external channels

## Security Best Practices

This project follows good security practices:
- No secrets stored in git
- Environment variables for all API keys
- Minimal dependencies (audited via GitHub Actions npm audit)
- HTTPS-only deployment via Vercel
