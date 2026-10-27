# Cloudflare runtime

This directory contains the Cloudflare-first runtime for AI Against Parkinson's.

## Production resources

- Worker: `ai-against-parkinsons`
- D1: `ai-again-against-parkinsons`
- Worker URL: https://ai-against-parkinsons.tyler-delano.workers.dev
- Schedule: daily at 13:00 UTC

## Local checks

```bash
npm install
npm run typecheck
npx wrangler deploy --dry-run
npx wrangler d1 migrations apply ai-again-against-parkinsons --local
```

## Remote deployment

```bash
npx wrangler d1 migrations apply ai-again-against-parkinsons --remote
npx wrangler secret put ADMIN_TOKEN
npx wrangler secret put CRON_REPORT_SECRET
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put FROM_EMAIL
npx wrangler deploy
```

The AI binding is Cloudflare Workers AI. The pipeline retrieves recent records through Europe PMC, preserves PubMed links when available, generates English findings, translates to Spanish, validates section/URL parity, and publishes both languages atomically to D1.

A run is not considered successful when source collection fails, AI output cannot be structured, or translation parity fails. Zero-source runs are rejected. Each new finding stores evidence type, evidence level, study design, source quality, why-it-matters context, and limitations. Duplicate source records are removed before generation.

Operational verification:

```bash
curl https://ai-against-parkinsons.tyler-delano.workers.dev/api/health
curl https://ai-against-parkinsons.tyler-delano.workers.dev/api/status
curl https://ai-against-parkinsons.tyler-delano.workers.dev/api/verification/latest
```

`/api/verification/latest` checks the latest run, English/Spanish publication, source verification, findings, translation score, duplicate detection, and evidence metadata contract. Deploy the backend from this directory (`worker/`); running Wrangler from the repository root targets a different project.

## Current domain cutover status

The custom domain is still served by Vercel because its authoritative nameservers remain Vercel's. After the Cloudflare Worker is verified, add `aiagainstparkinson.com` to the Cloudflare account, update the registrar nameservers to Cloudflare's assigned nameservers, then attach the route in Wrangler. Verify `/api/health`, `/api/status`, `/en/reports`, and the latest report URL before removing Vercel.
