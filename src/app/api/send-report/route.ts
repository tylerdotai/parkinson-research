import { NextRequest } from 'next/server'

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

    let content: string
    try {
      content = fs.readFileSync(filePath, 'utf8')
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
      return Response.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
    }

    const subscribers = await subsRes.json()

    // Send emails via Resend
    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return Response.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
    }

    const fromAddress = lang === 'es'
      ? 'Investigación Parkinson <research@clawplex.dev>'
      : 'Parkinson Research <research@clawplex.dev>'

    const subjectPrefix = lang === 'es' ? 'Investigación sobre Parkinson' : "Parkinson's Research"
    const formattedDate = new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })

    const sent: string[] = []
    const failed: string[] = []

    for (const sub of subscribers) {
      if (lang === 'es' && sub.language !== 'es') continue
      if (lang === 'en' && sub.language === 'es') continue

      const subject = `${subjectPrefix} — ${formattedDate}`

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
          text: content,
        }),
      })

      if (emailRes.ok) {
        sent.push(sub.email)
      } else {
        failed.push(`${sub.email}: ${emailRes.status}`)
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
