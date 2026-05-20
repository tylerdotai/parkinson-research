import { NextRequest } from 'next/server'
import { marked } from 'marked'
import { Logger } from '@/lib/logger'

// Configure marked for safe HTML output
marked.setOptions({ gfm: true, breaks: true })

const SECTION_IMAGES = {
  clinical_trials: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Hospital_building.jpg/640px-Hospital_building.jpg',
    alt: 'Clinical research facility',
    credit: 'Wikimedia Commons',
  },
  breakthroughs: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Microscope_%285196199322%29.jpg/640px-Microscope_%285196199322%29.jpg',
    alt: 'Medical research laboratory',
    credit: 'Wikimedia Commons',
  },
  lifestyle: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Yoga_in_Nature.jpg/640px-Yoga_in_Nature.jpg',
    alt: 'Exercise and wellness',
    credit: 'Wikimedia Commons',
  },
  emerging: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Neural_network_block_diagram.svg/640px-Neural_network_block_diagram.svg.png',
    alt: 'Neuroscience research',
    credit: 'Wikimedia Commons',
  },
}

const SECTION_VIDEOS = {
  clinical_trials: [
    {
      title: 'Understanding Clinical Trials',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
  ],
  lifestyle: [
    {
      title: 'Exercise and Parkinson\'s Disease',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
  ],
}

function buildMultimediaBody(body: string, lang: string): string {
  const sections = body.split(/(?=<h2)/)
  let result = ''

  for (const section of sections) {
    const sectionMatch = section.match(/<h2>([^<]+)<\/h2>/)
    let sectionId = ''
    let sectionTitle = ''

    if (sectionMatch) {
      sectionTitle = sectionMatch[1]
      if (sectionTitle.toLowerCase().includes('clinical trial')) sectionId = 'clinical_trials'
      else if (sectionTitle.toLowerCase().includes('breakthrough')) sectionId = 'breakthroughs'
      else if (sectionTitle.toLowerCase().includes('lifestyle')) sectionId = 'lifestyle'
      else if (sectionTitle.toLowerCase().includes('emerging')) sectionId = 'emerging'
    }

    let calloutBox = ''
    if (sectionId && SECTION_IMAGES[sectionId as keyof typeof SECTION_IMAGES]) {
      const img = SECTION_IMAGES[sectionId as keyof typeof SECTION_IMAGES]
      const videoLabel = lang === 'es' ? 'Video relacionado' : 'Related Video'
      const imgLabel = lang === 'es' ? 'Ilustración' : 'Illustration'

      calloutBox = `
        <div style="margin: 1.5rem 0; padding: 1rem; background: #f0eef8; border-radius: 8px; border-left: 4px solid #714cb6;">
          <img src="${img.url}" alt="${img.alt}" style="width: 100%; max-width: 480px; border-radius: 6px; margin-bottom: 0.5rem;" loading="lazy" />
          <p style="font-size: 0.75rem; color: #8a847d; margin: 0;">${imgLabel}: ${img.alt} — ${img.credit}</p>
        </div>
      `

      const video = SECTION_VIDEOS[sectionId as keyof typeof SECTION_VIDEOS]?.[0]
      if (video) {
        calloutBox += `
          <div style="margin: 1.5rem 0; padding: 1rem; background: #fef9f0; border-radius: 8px; border-left: 4px solid #e6a23c;">
            <strong style="color: #1b1938;">🎬 ${videoLabel}:</strong> ${video.title}<br>
            <a href="${video.url}" style="color: #714cb6; font-size: 0.85rem;">▶ Watch on YouTube</a>
          </div>
        `
      }
    }

    result += section.replace(
      /(<h2>[^<]+<\/h2>)/,
      `$1${calloutBox}`
    )
  }

  return result
}

const HTML_TEMPLATE = (
  title: string,
  body: string,
  siteUrl: string,
  unsubscribeUrl: string,
  lang: string = 'en'
) => {
  const multimediaBody = buildMultimediaBody(body, lang)
  const isEs = lang === 'es'
  const heroImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Brain_noradrenaline.svg/640px-Brain_noradrenaline.svg.png'
  const heroImageAlt = isEs ? 'Ilustración del cerebro y neurotransmisores' : 'Brain and neurotransmitter illustration'
  const callToActionTitle = isEs ? '¿Te resultó útil?' : 'Was this helpful?'
  const callToActionText = isEs
    ? 'Suscríbete para recibir actualizaciones diarias de investigación sobre Parkinson directamente en tu bandeja de entrada.'
    : 'Subscribe to receive daily Parkinson\'s research updates delivered to your inbox.'
  const subscribeUrl = `${siteUrl}${isEs ? '/es' : ''}#subscribe`
  const subscribeLabel = isEs ? 'Suscribirme ahora' : 'Subscribe now'
  const unsubscribeLabel = isEs ? 'Cancelar suscripción' : 'Unsubscribe'

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Georgia, serif; max-width: 680px; margin: 0 auto; padding: 2rem; background: #faf9f7; color: #292827; line-height: 1.7; }
    .hero { background: linear-gradient(135deg, #1b1938 0%, #2d2654 100%); padding: 2rem; border-radius: 12px; margin-bottom: 2rem; text-align: center; }
    .hero h1 { color: #ffffff; font-size: 2rem; font-weight: 600; margin: 0 0 0.5rem 0; }
    .hero .subtitle { color: #c4bfe4; font-size: 0.95rem; margin: 0; }
    .hero img { max-width: 100%; height: auto; border-radius: 8px; margin-top: 1rem; }
    .section-header { font-size: 1.35rem; color: #1b1938; margin-top: 2.5rem; border-bottom: 2px solid #714cb6; padding-bottom: 0.5rem; margin-bottom: 1rem; font-weight: 600; }
    h3 { font-size: 1.1rem; color: #1b1938; margin-top: 1.5rem; margin-bottom: 0.5rem; font-weight: 600; }
    p { margin: 0.75rem 0; }
    ul { margin: 1rem 0; padding-left: 1.5rem; }
    li { margin: 0.5rem 0; }
    a { color: #714cb6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    blockquote { border-left: 4px solid #714cb6; margin: 1.5rem 0; padding: 0.75rem 1.25rem; background: #f5f3f0; border-radius: 0 8px 8px 0; color: #4a4541; font-style: normal; }
    blockquote strong { color: #714cb6; }
    .callout { padding: 1rem 1.25rem; border-radius: 8px; margin: 1.5rem 0; }
    .callout-info { background: #e8f4f8; border-left: 4px solid #3498db; }
    .callout-warning { background: #fef9f0; border-left: 4px solid #e6a23c; }
    .callout-tip { background: #f0eef8; border-left: 4px solid #714cb6; }
    .video-embed { margin: 1.5rem 0; }
    hr { border: none; border-top: 1px solid #d4cfc9; margin: 2.5rem 0; }
    .cta-box { background: linear-gradient(135deg, #714cb6 0%, #5a3a9e 100%); padding: 1.5rem; border-radius: 12px; text-align: center; margin: 2rem 0; }
    .cta-box h3 { color: #ffffff; font-size: 1.2rem; margin-top: 0; }
    .cta-box p { color: #e8e4f4; margin: 0.5rem 0; }
    .cta-button { display: inline-block; background: #ffffff; color: #714cb6; padding: 0.75rem 1.5rem; border-radius: 6px; font-weight: 600; text-decoration: none; margin-top: 0.75rem; }
    .cta-button:hover { background: #f0eef8; text-decoration: none; }
    .footer { font-size: 0.8rem; color: #8a847d; margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #d4cfc9; line-height: 1.8; }
    .footer a { color: #714cb6; }
    .disclaimer { background: #f5f3f0; padding: 1rem; border-radius: 8px; margin-top: 1.5rem; font-size: 0.8rem; color: #6b6560; }
    @media only screen and (max-width: 600px) {
      body { padding: 1rem; }
      .hero { padding: 1.25rem; }
      h1 { font-size: 1.5rem; }
      .section-header { font-size: 1.2rem; }
    }
  </style>
</head>
<body>
  <!-- Hero Section -->
  <div class="hero">
    <h1>${isEs ? 'Investigación sobre Parkinson' : "Parkinson's Research"}</h1>
    <p class="subtitle">${isEs ? 'Actualizaciones semanales de investigación para familias' : 'Weekly research updates for families navigating Parkinson\'s'}</p>
    <img src="${heroImageUrl}" alt="${heroImageAlt}" loading="lazy" />
  </div>

  <!-- Main Content -->
  ${multimediaBody}

  <!-- Call to Action -->
  <div class="cta-box">
    <h3>${callToActionTitle}</h3>
    <p>${callToActionText}</p>
    <a href="${subscribeUrl}" class="cta-button">${subscribeLabel}</a>
  </div>

  <!-- Footer -->
  <div class="footer">
    <div class="disclaimer">
      <strong>⚠️ ${isEs ? 'Aviso importante:' : 'Important Notice:'}</strong> ${isEs
        ? 'Este contenido es únicamente informativo y no constituye asesoramiento médico. Siempre consulte a su proveedor de atención médica antes de tomar decisiones sobre el tratamiento.'
        : 'This content is for informational purposes only and is not medical advice. Always consult your healthcare provider before making treatment decisions.'}
    </div>
    <br>
    <a href="${siteUrl}">${isEs ? 'Visitar AI Against Parkinson\'s' : 'Visit AI Against Parkinson\'s'}</a> | <a href="${unsubscribeUrl}">${unsubscribeLabel}</a>
  </div>
</body>
</html>`
}

interface SendThresholdResult {
  passed: boolean
  reason?: string
  meaningfulSections: number
}

function checkSendThreshold(rawContent: string): SendThresholdResult {
  const noSignificantPattern = /no significant|not found|no developments|no breakthroughs/i
  const hasSourceUrl = /https?:\/\/[^\s]+/i

  const sections = rawContent.split(/^##\s+/m).filter(Boolean)
  let meaningfulSections = 0

  for (const section of sections) {
    const isNoSignificant = noSignificantPattern.test(section)
    const hasUrl = hasSourceUrl.test(section)

    if (!isNoSignificant && hasUrl) {
      meaningfulSections++
    }
  }

  const MIN_MEANINGFUL_SECTIONS = 2

  if (meaningfulSections < MIN_MEANINGFUL_SECTIONS) {
    return {
      passed: false,
      reason: `Only ${meaningfulSections} section(s) with meaningful content (min: ${MIN_MEANINGFUL_SECTIONS}). Skipping send.`,
      meaningfulSections,
    }
  }

  return { passed: true, meaningfulSections }
}

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

    // Send threshold: only send if report has meaningful content
    const threshold = checkSendThreshold(rawContent)
    if (!threshold.passed) {
      Logger.warn('send-report', 'Content threshold not met', { date, lang, ...threshold })
      return Response.json({
        success: true,
        sent: 0,
        skipped: true,
        reason: threshold.reason,
        meaningfulSections: threshold.meaningfulSections,
      })
    }

    // Get subscribers from Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const subsRes = await fetch(
      `${supabaseUrl}/rest/v1/subscribers?confirmed_at=not.is.null&unsubscribed_at=is.null&select=email,id,language`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      }
    )

    if (!subsRes.ok) {
      const errText = await subsRes.text()
      Logger.error('send-report', 'Supabase fetch failed', { status: subsRes.status, errText })
      return Response.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
    }

    // Subscriber shape from Supabase
    interface Subscriber {
      id: string
      email: string
      language: string
    }

    const subscribers = await subsRes.json() as Subscriber[]

    // Filter subscribers by language once
    const filteredSubs = subscribers.filter((sub) =>
      lang === 'es' ? sub.language === 'es' : sub.language !== 'es'
    )

    if (filteredSubs.length === 0) {
      return Response.json({ success: true, sent: 0, failed: [], total: 0 })
    }

    // Send emails via Resend
    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return Response.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 })
    }

    const fromAddress = 'Parkinson Research <research@clawplex.dev>'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiagainstparkinson.com'

    const subjectPrefix = lang === 'es' ? 'Investigación sobre Parkinson' : "Parkinson's Research"
    const pageTitle = lang === 'es' ? 'Investigación sobre Parkinson' : "Parkinson's Research"
    const formattedDate = new Date(date).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    // Strip frontmatter and convert markdown to HTML (done once, reused per subscriber)
    const contentWithoutFrontmatter = rawContent.replace(/^---[\s\S]*?---\n*/m, '').trim()
    const bodyHtml = await marked.parse(contentWithoutFrontmatter)

    const sent: string[] = []
    const failed: string[] = []

    // Send emails in parallel batches to avoid overwhelming the API
    const sendEmail = async (sub: { email: string; id: string }) => {
      const subject = `${subjectPrefix} — ${formattedDate}`
      const unsubUrl = `${siteUrl}/api/unsubscribe/${sub.id}`
      const htmlContent = HTML_TEMPLATE(pageTitle, bodyHtml, siteUrl, unsubUrl, lang)

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
        return { email: sub.email, ok: true }
      } else {
        const errBody = await emailRes.text()
        return { email: sub.email, ok: false, err: `${emailRes.status} ${errBody}` }
      }
    }

    const BATCH_SIZE = 3
    for (let i = 0; i < filteredSubs.length; i += BATCH_SIZE) {
      const batch = filteredSubs.slice(i, i + BATCH_SIZE)
      const results = await Promise.all(batch.map(s => sendEmail(s)))
      for (const r of results) {
        if (r.ok) {
          sent.push(r.email)
        } else {
          failed.push(`${r.email}: ${(r as { err: string }).err}`)
        }
      }
    }

    return Response.json({
      success: true,
      sent: sent.length,
      failed,
      total: filteredSubs.length,
    })
  } catch (err) {
    Logger.error('send-report', 'Request failed', err)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
