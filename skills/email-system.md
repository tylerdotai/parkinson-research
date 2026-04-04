# Skill: Email Delivery System

> How the `/api/send-report` email endpoint works, how to test it, and how to troubleshoot it.

**Trigger phrases:** "parkinson email endpoint", "parkinson email not working", "test parkinson email", "resend parkinson"

---

## Architecture

The email system is a Vercel Serverless Function that:
1. Reads a markdown report from the filesystem
2. Converts markdown → HTML using `marked`
3. Fetches active subscribers from Supabase
4. Sends personalized HTML emails via Resend

```
GitHub push → Vercel auto-deploys → /api/send-report updated
                                              ↓
              Cron agent calls → POST /api/send-report
                                              ↓
                              Reads report markdown
                                              ↓
                              Parses to HTML (marked)
                                              ↓
                              Fetches subscribers (Supabase)
                                              ↓
                              Sends HTML email per subscriber (Resend)
```

---

## The Endpoint

**URL:** `POST https://parkinson-research.vercel.app/api/send-report`

**Request body:**
```json
{
  "date": "2026-04-04",
  "language": "en"
}
```

**Response (success):**
```json
{"success": true, "sent": 5, "failed": [], "total": 5}
```

**Response (error):**
```json
{"error": "Failed to fetch subscribers", "detail": "..."}
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/app/api/send-report/route.ts` | The email endpoint |
| `src/lib/supabase.ts` | Subscriber queries and unsubscribe logic |
| `public/reports/YYYY-MM-DD.md` | EN report source |
| `public/reports/es/YYYY-MM-DD.md` | ES report source |

---

## HTML Template

Emails are rendered with a clean, readable HTML template:
- Georgia serif font, warm background (#faf9f7)
- Purple accent color (#714cb6) for links and blockquote borders
- H2 section headers with bottom border
- Per-subscriber unsubscribe URL (`/api/unsubscribe/{id}`)
- Disclaimer footer
- Mobile-responsive (680px max-width)

The unsubscribe URL uses the subscriber's UUID: `/api/unsubscribe/{subscriber_id}` → redirects to homepage with `?unsubscribed=1`.

---

## Environment Variables

All required env vars (set in Vercel dashboard → Settings → Environment Variables):

| Variable | Value | Purpose |
|----------|-------|---------|
| `RESEND_API_KEY` | `re_...` | Resend transactional email |
| `SUPABASE_SERVICE_ROLE_KEY` | JWT | Supabase service role (bypasses RLS) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://gbzuvtzsezmfzgybryrs.supabase.co` | Supabase project URL |
| `NEXT_PUBLIC_SITE_URL` | `https://aiagainstparkinson.com` | Used for unsubscribe links |

To check if vars are set in Vercel:
```bash
vercel env ls production
```

To pull vars locally:
```bash
vercel env pull .env.local
```

---

## Testing the Endpoint

### Test from any machine with curl:
```bash
curl -s -X POST "https://parkinson-research.vercel.app/api/send-report" \
  -H "Content-Type: application/json" \
  -d '{"date": "2026-04-04", "language": "en"}'
```

Expected: `{"success": true, "sent": 5, "failed": [], "total": 5}`

### Test locally (from parkinson-research directory):
```bash
vercel dev
# Then in another terminal:
curl -X POST "http://localhost:3000/api/send-report" \
  -H "Content-Type: application/json" \
  -d '{"date": "2026-04-04", "language": "en"}'
```

### Test with a specific report date:
Any date with an existing report file will work. Use `2026-04-03` or `2026-04-04` as test dates.

---

## Troubleshooting

### 500 "Failed to fetch subscribers"
1. Check `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel production env
2. Check the key hasn't expired (decode the JWT at jwt.io — exp should be in the future)
3. Run the query manually to verify it works:
```bash
curl -s "https://gbzuvtzsezmfzgybryrs.supabase.co/rest/v1/subscribers?confirmed_at=not.is.null&unsubscribed_at=is.null&select=email,language" \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"
```

### 500 "Report not found"
The report file doesn't exist at `public/reports/YYYY-MM-DD.md` (or `es/YYYY-MM-DD.md` for Spanish). Check the date in the request matches an existing file.

### 200 but sent: 0
No subscribers match the language filter. Currently all 5 subscribers are English. Spanish sends will return 0 until Spanish subscribers exist.

### Email arrives as plain text (not HTML)
The `html:` field is not being sent to Resend. Check that `route.ts` is passing `html:` (not `text:`) to the Resend API. This was a bug that was fixed — verify the route has `html: htmlContent` in the `JSON.stringify`.

### Unsubscribe link 404s
The `/api/unsubscribe/{id}` route was recently updated to use UUID path params. Make sure the email template passes `sub.id` (UUID), not `sub.token` or email. Check the unsubUrl construction in `route.ts`:
```typescript
const unsubUrl = `${siteUrl}/api/unsubscribe/${sub.id}`
```

---

## Adding the Email Skill

If adding email features (e.g., HTML template redesign, A/B subject lines, analytics):
1. Test with `curl` against the Vercel preview deployment first
2. Do NOT commit broken email templates — malformed HTML breaks email rendering in many clients
3. Test HTML emails with Litmus or Email on Acid (or just send test emails to yourself)
4. Keep HTML email templates simple — avoid CSS flexbox/grid, heavy images, or JavaScript

---

## Resend API Reference

Direct Resend calls are NOT the preferred path. Always use the `/api/send-report` endpoint.

If you must call Resend directly:
```typescript
await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'Parkinson Research <research@clawplex.dev>',
    to: ['subscriber@example.com'],
    subject: "Parkinson's Research — April 4, 2026",
    html: '<h1>Report content here</h1>',
  }),
})
```

Resend free tier: 100 emails/day. Current usage: 5-10/day. No risk of hitting limits.
