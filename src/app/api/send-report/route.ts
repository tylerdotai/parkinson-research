import { NextRequest } from 'next/server'
import { marked } from 'marked'

// Configure marked for safe HTML output
marked.setOptions({ gfm: true, breaks: true })

const HTML_TEMPLATE = (
  title: string,
  date: string,
  body: string,
  siteUrl: string,
  unsubscribeUrl: string
) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 680px; margin: 0 auto; padding: 2rem; background: #faf9f7; color: #292827; line-height: 1.7; }
    h1 { font-size: 2rem; font-weight: 400; color: #1b1938; margin-bottom: 0.25rem; }
    .subtitle { color: #6b6560; font-size: 0.9rem; margin-bottom: 2rem; }
    h2 { font-size: 1.35rem; color: #1b1938; margin-top: 2.5rem; border-bottom: 1px solid #d4cfc9; padding-bottom: 0.4rem; margin-bottom: 1rem; font-weight: 400; }
    h3 { font-size: 1.05rem; color: #1b1938; margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: 400; }
    p { margin: 0.75rem 0; }
    a { color: #714cb6; }
    blockquote { border-left: 3px solid #714cb6; margin: 1rem 0; padding: 0.25rem 1rem; color: #4a4541; font-style: italic; }
    hr { border: none; border-top: 1px solid #d4cfc9; margin: 2rem 0; }
    .footer { font-size: 0.8rem; color: #8a847d; margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #d4cfc9; }
    @media only screen and (max-width: 600px) {
      body { padding: 1rem; }
      h1 { font-size: 1.5rem; }
    }
  </style>
</head>
<body>
${body}
<div class="footer">
  <strong>Disclaimer:</strong> This content is for informational purposes only and is not medical advice. Always consult your healthcare provider before making treatment decisions.<br>
  <a href="${siteUrl}">Visit AI Against Parkinson's</a> | <a href="${unsubscribeUrl}">Unsubscribe</a>
</div>
</body>
</html>`

export async function POST(req: NextRequest) {
  try {
    const { date, language } = await req.json()

    if (!date) {
      return Response.json({ error: 'Missing date' }, { status: 400 })
    }

    const lang = language || 'en'

    // Read the report markdown from the filesystem
    const fs = await import('fs')
    const path = await import('path')

    const reportsDir = path.join(process.cwd(), 'public', 'reports')
    const filePath = lang === 'es'
      ? path.join(reportsDir, 'es', `${date}.md`)
      : path.join(reportsDir, `${date}.md`)

    let rawContent: string
    try {
      rawContent = fs.readFileSync(filePath, 'utf8')
    } catch {
      return Response.json({ error: `Report not found: ${date} (${lang})` }, { status: 404 })
    }

    // Get subscribers from Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const subsRes = await fetch(
      `${supabaseUrl}/rest/v1/subscribers?confirmed_at=not.is.null&unsubscribed_at=is.null&select=email,language`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    )

    if (!subsRes.ok) {
      const errText = await subsRes.text()
      console.error('[send-report] Supabase fetch failed:', subsRes.status, errText)
      return Response.json({ error: 'Failed to fetch subscribers', detail: errText }, { status: 500 })
    }

    const subscribers = await subsRes.json()

    // Send emails via Resend
    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return Response.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
    }

    const fromAddress = 'Parkinson Research <research@clawplex.dev>'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://parkinson-research.vercel.app'

    const subjectPrefix = lang === 'es' ? 'Investigación sobre Parkinson' : "Parkinson's Research"
    const pageTitle = lang === 'es' ? 'Investigación sobre Parkinson' : "Parkinson's Research"
    const formattedDate = new Date(date).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    // Strip frontmatter and convert markdown to HTML (done once, reused per subscriber)
    const contentWithoutFrontmatter = rawContent.replace(/^---[\s\S]*?---\n*/m, '').trim()
    const bodyHtml = await marked.parse(contentWithoutFrontmatter)

    const sent: string[] = []
    const failed: string[] = []

    for (const sub of subscribers) {
      if (lang === 'es' && sub.language !== 'es') continue
      if (lang === 'en' && sub.language === 'es') continue

      const subject = `${subjectPrefix} — ${formattedDate}`
      const unsubUrl = `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(sub.email)}`
      const htmlContent = HTML_TEMPLATE(pageTitle, formattedDate, bodyHtml, siteUrl, unsubUrl)

      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [sub.email],
          subject,
          html: htmlContent,
        }),
      })

      if (emailRes.ok) {
        sent.push(sub.email)
      } else {
        const errBody = await emailRes.text()
        failed.push(`${sub.email}: ${emailRes.status} ${errBody}`)
      }
    }

    return Response.json({
      success: true,
      sent: sent.length,
      failed,
      total: subscribers.length,
    })
  } catch (err) {
    console.error('[send-report]', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
