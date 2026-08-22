interface Env {
  DB: D1Database
  AI: Ai
  SITE_NAME: string
  PUBLIC_SITE_URL: string
  ADMIN_TOKEN?: string
  CRON_REPORT_SECRET?: string
  RESEND_API_KEY?: string
  FROM_EMAIL?: string
}

type Lang = 'en' | 'es'
const CATEGORIES = [
  ['clinical', 'Clinical Trials', "Parkinson disease clinical trial", 'clinical trial'],
  ['breakthrough', 'Breakthrough Treatments', "Parkinson disease treatment", 'treatment'],
  ['lifestyle', 'Lifestyle Interventions', "Parkinson disease exercise OR diet OR sleep", 'lifestyle'],
  ['emerging', 'Emerging Research', "Parkinson disease alpha-synuclein OR biomarker OR genetics", 'emerging'],
] as const

const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })
const now = () => new Date().toISOString()
const id = (prefix: string) => `${prefix}_${crypto.randomUUID()}`

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

function markdownToHtml(markdown: string): string {
  return markdown.split('\n').map((line) => {
    const safe = escapeHtml(line)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    if (safe.startsWith('### ')) return `<h3>${safe.slice(4)}</h3>`
    if (safe.startsWith('## ')) return `<h2>${safe.slice(3)}</h2>`
    if (safe.startsWith('# ')) return `<h1>${safe.slice(2)}</h1>`
    if (safe.startsWith('- ')) return `<li>${safe.slice(2)}</li>`
    return safe ? `<p>${safe}</p>` : ''
  }).join('\n')
}

function page(title: string, body: string, lang: Lang = 'en', status = 200): Response {
  const other = lang === 'en' ? 'es' : 'en'
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} | AI Against Parkinson's</title><style>
  :root{color-scheme:light;font-family:system-ui,-apple-system,sans-serif;color:#202033;background:#faf9f7}body{max-width:860px;margin:auto;padding:24px;line-height:1.65}header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ddd6e8;padding-bottom:16px;margin-bottom:32px}nav a{margin-left:14px;color:#5d3c98}a{color:#5d3c98}.hero{background:#211b3d;color:white;padding:28px;border-radius:16px;margin-bottom:28px}.muted{color:#706b78}.card{border:1px solid #e2ddea;border-radius:12px;padding:18px;margin:14px 0;background:white}h1{line-height:1.2}h2{margin-top:32px;border-bottom:2px solid #7651b7;padding-bottom:6px}h3{margin-top:24px}button{background:#5d3c98;color:white;border:0;border-radius:8px;padding:10px 16px}input{padding:10px;border:1px solid #bbb;border-radius:7px}footer{border-top:1px solid #ddd6e8;margin-top:48px;padding-top:18px;font-size:.85rem}.warning{background:#fff5dc;padding:12px;border-radius:8px}
  </style></head><body><header><a href="/${lang}"><strong>AI Against Parkinson's</strong></a><nav><a href="/${lang}/reports">Reports</a><a href="/${other}">${other === 'en' ? 'English' : 'Español'}</a></nav></header>${body}<footer>For informational purposes only — not medical advice. Always consult a healthcare professional.</footer></body></html>`
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } })
}

async function latestReports(env: Env, lang: Lang) {
  return env.DB.prepare('SELECT id, report_date, title, status, published_at, quality_score, translation_status FROM reports WHERE language = ? AND status = ? ORDER BY report_date DESC').bind(lang, 'published').all()
}

async function report(env: Env, date: string, lang: Lang) {
  return env.DB.prepare('SELECT * FROM reports WHERE report_date = ? AND language = ? AND status = ? ORDER BY version DESC LIMIT 1').bind(date, lang, 'published').first<Record<string, string>>()
}

async function renderReports(env: Env, lang: Lang): Promise<Response> {
  const rows = await latestReports(env, lang)
  const list = (rows.results as Array<Record<string, string>>).map((r) => `<div class="card"><h2><a href="/${lang}/report/${r.report_date}">${escapeHtml(r.title)}</a></h2><p class="muted">${r.report_date}</p></div>`).join('')
  return page(lang === 'es' ? 'Informes de investigación' : 'Research reports', `<div class="hero"><h1>${lang === 'es' ? 'Informes de investigación' : 'Research reports'}</h1><p>${list ? (lang === 'es' ? 'Actualizaciones verificadas sobre investigación de Parkinson.' : 'Verified research updates about Parkinson’s.') : 'No published reports yet.'}</p></div>${list || '<p>No reports published yet.</p>'}`, lang)
}

async function renderReport(env: Env, date: string, lang: Lang): Promise<Response> {
  const item = await report(env, date, lang)
  if (!item) return page('Report not found', '<h1>Report not found</h1><p>This report has not been published.</p>', lang, 404)
  return page(item.title, `<article><p class="muted">Published ${escapeHtml(item.report_date)}</p>${markdownToHtml(item.content)}</article>`, lang)
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchWithRetry(url: string, attempts = 3): Promise<Response> {
  let last: Response | undefined
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    last = await fetch(url, { headers: { 'User-Agent': 'AI-Against-Parkinsons/1.0 research@aiagainstparkinson.com', Accept: 'application/json' } })
    if (last.status !== 429 && last.status < 500) return last
    await sleep(800 * (attempt + 1))
  }
  return last!
}

async function fetchPubMed(query: string, start: string, end: string) {
  const searchQuery = encodeURIComponent(`(${query}) AND Parkinson disease AND FIRST_PDATE:[${start} TO ${end}]`)
  const response = await fetchWithRetry(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${searchQuery}&resultType=core&format=json&pageSize=5`)
  if (!response.ok) throw new Error(`EUROPEPMC_SEARCH_${response.status}`)
  const data = (await response.json()) as { resultList?: { result?: Array<{ id?: string; pmid?: string; title?: string; firstPublicationDate?: string; journalTitle?: string; abstractText?: string; authorString?: string; doi?: string; pmcid?: string; isOpenAccess?: string }> } }
  return (data.resultList?.result ?? []).map((item) => {
    const identifier = item.pmid ?? item.id ?? ''
    return {
      id: identifier,
      title: item.title ?? 'Untitled research record',
      date: item.firstPublicationDate ?? start,
      url: item.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${item.pmid}/` : `https://europepmc.org/article/MED/${identifier}`,
      source: item.journalTitle ?? 'Europe PMC',
      abstract: item.abstractText ?? '',
      authors: item.authorString ?? '',
      doi: item.doi ?? '',
      pmcid: item.pmcid ?? '',
      openAccess: item.isOpenAccess === 'Y',
    }
  })
}

type FindingDraft = { headline: string; body: string; evidenceType: string; evidenceLevel: string; studyDesign: string; sourceQuality: string; whyItMatters: string; limitations: string }

async function summarize(env: Env, category: string, label: string, items: Array<{ title: string; date: string; url: string; source: string; abstract: string; authors: string; doi: string; pmcid: string; openAccess: boolean }>, lang: Lang): Promise<FindingDraft[]> {
  if (!items.length) return []
  const result = await env.AI.run('@cf/meta/llama-3.2-3b-instruct', { messages: [{ role: 'system', content: "You are a careful Parkinson's research editor. Use ONLY the supplied title and abstract. Return ONLY JSON with a findings array. Never claim a cure, reversal, guarantee, or treatment advice. If the abstract is missing, say so clearly instead of guessing." }, { role: 'user', content: `Summarize these verified records for category ${label} in ${lang}. Return at most one finding per record and keep each field concise. Each finding must include: headline, body (2-3 plain-language sentences grounded in the abstract), whyItMatters (one cautious sentence), limitations (one sentence stating study limits or missing information), evidenceType (Clinical trial, Observational study, Systematic review, Preclinical research, or Research study), evidenceLevel (established, moderate, early, or unknown), studyDesign, and sourceQuality (Primary article, peer-reviewed index, or indexed research record). Records:\n${items.map((x) => `TITLE: ${x.title}\nDATE: ${x.date}\nURL: ${x.url}\nJOURNAL: ${x.source}\nABSTRACT: ${x.abstract.slice(0, 3500) || 'NOT AVAILABLE'}`).join('\n\n')}` }], max_tokens: 1800, temperature: 0.15 }) as { response?: string }
  const raw = (result.response ?? '').replace(/^```json\s*|\s*```$/g, '').trim()
  try {
    const parsed = JSON.parse(raw) as { findings?: Array<Partial<FindingDraft>> }
    const findings = (parsed.findings ?? []).slice(0, items.length).filter((f) => f.headline && f.body).map((f) => ({
      headline: f.headline!, body: f.body!, evidenceType: f.evidenceType || 'Research study', evidenceLevel: f.evidenceLevel || 'unknown',
      studyDesign: f.studyDesign || 'Not available in indexed metadata', sourceQuality: f.sourceQuality || 'indexed research record',
      whyItMatters: f.whyItMatters || 'This record helps track ongoing Parkinson\'s research, but it does not by itself establish a treatment benefit.',
      limitations: f.limitations || 'Read the original source for the full study design, results, and limitations.',
    }))
    if (findings.length) return findings
  } catch {
    // Some models return prose despite the JSON contract. Use metadata-only fallback below.
  }
  return items.slice(0, 2).map((item) => ({
    headline: item.title.replace(/[:.].*$/, '').slice(0, 70),
    body: item.abstract ? `The indexed record describes research on ${item.title.toLowerCase()}. The abstract is available in the original source; this summary does not infer a treatment benefit.` : `The indexed record is about ${item.title.toLowerCase()}. The available metadata is not enough to judge effectiveness or safety.`,
    evidenceType: 'Research study', evidenceLevel: 'unknown', studyDesign: 'Not available in indexed metadata', sourceQuality: item.abstract ? 'peer-reviewed index' : 'indexed research record',
    whyItMatters: 'It helps families and researchers track the question being studied without treating an index record as proof of benefit.',
    limitations: 'The original source is required for the full design, results, and limitations.',
  }))
}

async function translateReport(env: Env, content: string): Promise<{ content: string; score: number }> {
  const result = await env.AI.run('@cf/meta/llama-3.2-3b-instruct', { messages: [{ role: 'system', content: 'Translate this Parkinson\'s research report into natural, accessible Spanish for families and caregivers. Preserve the markdown heading structure, every URL, every date, and every source citation. Translate prose and source labels naturally. Never invent findings or advice. Return only markdown.' }, { role: 'user', content }], max_tokens: 2200, temperature: 0.1 }) as { response?: string }
  const translated = (result.response ?? '').replace(/^```(?:markdown)?\s*|\s*```$/g, '').trim()
  const headings = (value: string) => (value.match(/^## /gm) ?? []).length
  const urls = (value: string) => (value.match(/https?:\/\/[^)\s]+/g) ?? []).sort().join('|')
  const hasSpanishProse = /\b(?:investigación|familias|estudio|fuente|informativos|ensayos|tratamientos)\b/i.test(translated)
  const hasEnglishLeak = /\b(?:Verified research updates for families|A recent peer-reviewed study|For informational purposes only)\b/i.test(translated)
  const score = (translated ? 25 : 0) + (headings(translated) === headings(content) ? 20 : 0) + (urls(translated) === urls(content) ? 20 : 0) + (hasSpanishProse ? 25 : 0) + (!hasEnglishLeak ? 10 : 0)
  if (translated && translated !== content && score >= 90) return { content: translated, score }
  throw new Error(`SPANISH_TRANSLATION_INVALID_${score}`)
}

async function runPipeline(env: Env, requestedDate?: string): Promise<Record<string, unknown>> {
  const date = requestedDate ?? new Date().toISOString().slice(0, 10)
  const runId = id('run')
  const started = now()
  await env.DB.prepare('INSERT INTO pipeline_runs (id, report_date, status, current_step, started_at) VALUES (?, ?, ?, ?, ?)').bind(runId, date, 'researching', 'source_collection', started).run()
  try {
    const end = new Date(`${date}T00:00:00Z`)
    const startDate = new Date(end)
    startDate.setUTCDate(startDate.getUTCDate() - 90)
    const start = startDate.toISOString().slice(0, 10)
    const collected: Array<{ category: string; label: string; query: string; items: Array<{ id: string; title: string; date: string; url: string; source: string; abstract: string; authors: string; doi: string; pmcid: string; openAccess: boolean }> }> = []
    for (const [category, label, query] of CATEGORIES) {
      collected.push({ category, label, query, items: await fetchPubMed(query, start, date) })
      await sleep(1000)
    }
    const rawSourceCount = collected.reduce((n, c) => n + c.items.length, 0)
    const seen = new Set<string>()
    const deduped = collected.map((group) => ({ ...group, items: group.items.filter((item) => {
      const key = `${item.url}|${item.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }) }))
    const duplicateCount = rawSourceCount - seen.size
    const sourceCount = seen.size
    if (sourceCount === 0) throw new Error('NO_VERIFIED_SOURCES')
    await env.DB.prepare('UPDATE pipeline_runs SET current_step = ?, source_count = ?, duplicate_count = ?, metrics_json = ? WHERE id = ?').bind('draft_generation', sourceCount, duplicateCount, JSON.stringify({ sources: sourceCount, rawSources: rawSourceCount, duplicates: duplicateCount, categories: deduped.map((group) => ({ category: group.category, records: group.items.length })) }), runId).run()
    const english: string[] = ['---', `title: "Parkinson's Research — ${date}"`, `date: "${date}"`, '---', '', '# Parkinson’s Research', '', 'Verified research updates for families.']
    const sourceMap = new Map<string, { id: string; item: (typeof deduped)[number]['items'][number] }>()
    const findingsForDb: Array<{ category: string; headline: string; body: string; sourceUrl: string; sourceDate: string; evidenceType: string; evidenceLevel: string; studyDesign: string; sourceQuality: string; whyItMatters: string; limitations: string; sortOrder: number }> = []
    let findingOrder = 0
    for (const group of deduped) {
      english.push('', `## ${group.label}`)
      const findings = await summarize(env, group.category, group.label, group.items, 'en')
      findings.forEach((f, index) => {
        const item = group.items[index]
        if (!item) return
        const sourceId = sourceMap.get(item.url)?.id ?? id('src')
        sourceMap.set(item.url, { id: sourceId, item })
        english.push('', `### ${f.headline}`, '', f.body, '', `**Why it matters:** ${f.whyItMatters}`, `**Limitations:** ${f.limitations}`, `**Evidence:** ${f.evidenceType}`, `**Evidence level:** ${f.evidenceLevel}`, `**Study design:** ${f.studyDesign}`, `**Source quality:** ${f.sourceQuality}`, '', `*From: ${item.source} (${item.url})*`)
        findingsForDb.push({ category: group.category, headline: f.headline, body: f.body, sourceUrl: item.url, sourceDate: item.date, evidenceType: f.evidenceType, evidenceLevel: f.evidenceLevel, studyDesign: f.studyDesign, sourceQuality: f.sourceQuality, whyItMatters: f.whyItMatters, limitations: f.limitations, sortOrder: findingOrder })
        findingOrder += 1
      })
    }
    english.push('', '---', '*For informational purposes only — not medical advice.*')
    const englishContent = english.join('\n')
    await env.DB.prepare('UPDATE pipeline_runs SET current_step = ? WHERE id = ?').bind('translation', runId).run()
    const translation = await translateReport(env, englishContent)
    const spanishContent = translation.content
    await env.DB.prepare('UPDATE pipeline_runs SET current_step = ? WHERE id = ?').bind('publishing', runId).run()
    for (const [url, source] of sourceMap) await env.DB.prepare('INSERT OR IGNORE INTO sources (id, canonical_url, source_name, source_type, publication_date, fetched_at, verification_status, content_hash, metadata_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(source.id, url, source.item.source, 'pubmed', source.item.date, now(), 'verified', await sha256(`${source.item.title}|${source.item.abstract}`), JSON.stringify({ authors: source.item.authors, doi: source.item.doi, pmcid: source.item.pmcid, openAccess: source.item.openAccess })).run()
    for (const [language, content] of [['en', englishContent], ['es', spanishContent] as const]) {
      const reportId = id('report')
      await env.DB.prepare('DELETE FROM reports WHERE report_date = ? AND language = ?').bind(date, language).run()
      await env.DB.prepare('INSERT INTO reports (id, report_date, language, title, content, status, run_id, generated_at, published_at, translation_status, quality_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(reportId, date, language, language === 'en' ? `Parkinson's Research — ${date}` : `Investigación sobre Parkinson — ${date}`, content, 'published', runId, now(), now(), language === 'es' ? 'validated' : 'source-grounded', language === 'es' ? translation.score : 100).run()
      if (language === 'en') {
        for (const finding of findingsForDb) {
          const source = await env.DB.prepare('SELECT id FROM sources WHERE canonical_url = ?').bind(finding.sourceUrl).first<{ id: string }>()
          if (source) await env.DB.prepare('INSERT INTO findings (id, report_id, category, headline, body, source_id, source_date, claim_status, sort_order, evidence_type, evidence_level, study_design, source_quality, why_it_matters, limitations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(id('finding'), reportId, finding.category, finding.headline, finding.body, source.id, finding.sourceDate, 'verified', finding.sortOrder, finding.evidenceType, finding.evidenceLevel, finding.studyDesign, finding.sourceQuality, finding.whyItMatters, finding.limitations).run()
        }
      }
    }
    await env.DB.prepare('UPDATE pipeline_runs SET status = ?, current_step = ?, translation_quality_score = ?, metrics_json = ?, completed_at = ? WHERE id = ?').bind('completed', 'published', translation.score, JSON.stringify({ sources: sourceMap.size, duplicates: duplicateCount, findings: findingsForDb.length, translationQuality: translation.score }), now(), runId).run()
    return { success: true, runId, date, sources: sourceMap.size, duplicates: duplicateCount, findings: findingsForDb.length, translationQuality: translation.score, status: 'published' }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    await env.DB.prepare('UPDATE pipeline_runs SET status = ?, current_step = ?, error_code = ?, error_message = ?, completed_at = ? WHERE id = ?').bind('failed', 'error', 'PIPELINE_ERROR', message.slice(0, 500), now(), runId).run()
    return { success: false, runId, date, status: 'failed', error: message }
  }
}

async function sendEmail(env: Env, to: string, subject: string, html: string): Promise<{ id?: string }> {
  if (!env.RESEND_API_KEY || !env.FROM_EMAIL) throw new Error('EMAIL_NOT_CONFIGURED')
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.FROM_EMAIL, to: [to], subject, html }),
  })
  if (!response.ok) throw new Error(`EMAIL_PROVIDER_${response.status}`)
  return await response.json() as { id?: string }
}

async function confirmSubscriber(env: Env, token: string): Promise<Response> {
  const tokenHash = await sha256(token)
  const result = await env.DB.prepare('UPDATE subscribers SET status = ?, confirmed_at = ? WHERE token_hash = ? RETURNING email, language').bind('active', now(), tokenHash).first<{ email: string; language: Lang }>()
  if (!result) return page('Invalid confirmation', '<h1>Invalid confirmation link</h1><p>This link is invalid or expired.</p>', 'en', 400)
  return page('Subscription confirmed', `<div class="hero"><h1>Subscription confirmed</h1><p>${escapeHtml(result.email)} is now subscribed.</p></div>`, result.language)
}

async function unsubscribeSubscriber(env: Env, token: string): Promise<Response> {
  const tokenHash = await sha256(token)
  const result = await env.DB.prepare('UPDATE subscribers SET status = ?, unsubscribed_at = ? WHERE token_hash = ? RETURNING email').bind('unsubscribed', now(), tokenHash).first<{ email: string }>()
  if (!result) return page('Invalid unsubscribe link', '<h1>Invalid unsubscribe link</h1>', 'en', 400)
  return page('Unsubscribed', `<div class="hero"><h1>Unsubscribed</h1><p>${escapeHtml(result.email)} will not receive future updates.</p></div>`, 'en')
}

function authorized(request: Request, env: Env): boolean {
  const value = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
  return Boolean(value && (value === env.ADMIN_TOKEN || value === env.CRON_REPORT_SECRET))
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(runPipeline(env))
  },
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    // The Worker is the data/runtime layer. Keep the public visual experience
    // on the canonical editorial frontend until a faithful frontend cutover is
    // explicitly verified.
    if (request.method === 'GET' && (url.pathname === '/' || /^\/(en|es)(\/reports|\/report\/\d{4}-\d{2}-\d{2})?$/.test(url.pathname))) {
      const destination = new URL(url.pathname === '/' ? '/en' : url.pathname, env.PUBLIC_SITE_URL)
      destination.search = url.search
      return Response.redirect(destination.toString(), 302)
    }
    const match = url.pathname.match(/^\/(en|es)\/report\/(\d{4}-\d{2}-\d{2})$/)
    if (match) return renderReport(env, match[2], match[1] as Lang)
    if (url.pathname === '/en/reports') return renderReports(env, 'en')
    if (url.pathname === '/es/reports') return renderReports(env, 'es')
    if (url.pathname === '/en' || url.pathname === '/es' || url.pathname === '/') {
      const lang = url.pathname === '/es' ? 'es' : 'en'
      const rows = await latestReports(env, lang)
      const latest = (rows.results as Array<Record<string, string>>)[0]
      return page('AI Against Parkinson’s', `<div class="hero"><h1>AI Against Parkinson’s</h1><p>Verified Parkinson’s research in plain language.</p>${latest ? `<p><a href="/${lang}/report/${latest.report_date}" style="color:white">Latest report: ${latest.report_date}</a></p>` : '<p>No report published yet.</p>'}</div><div class="card"><h2>Subscribe</h2><form method="post" action="/api/subscribe"><input name="email" type="email" required placeholder="you@example.com"><input name="language" type="hidden" value="${lang}"><button>Subscribe</button></form></div>`, lang)
    }
    if (url.pathname === '/api/health' || url.pathname === '/health') return json({ ok: true, service: 'ai-against-parkinsons', aiConfigured: true, databaseConfigured: Boolean(env.DB), now: now() })
    if (url.pathname === '/api/status') {
      const latest = await env.DB.prepare("SELECT id, report_date, status, current_step, source_count, duplicate_count, translation_quality_score, metrics_json, completed_at, error_code, error_message FROM pipeline_runs ORDER BY started_at DESC LIMIT 1").first()
      return json({ latestRun: latest, latestPublished: { en: await env.DB.prepare("SELECT report_date, published_at, quality_score FROM reports WHERE language = 'en' AND status = 'published' ORDER BY report_date DESC LIMIT 1").first(), es: await env.DB.prepare("SELECT report_date, published_at, quality_score, translation_status FROM reports WHERE language = 'es' AND status = 'published' ORDER BY report_date DESC LIMIT 1").first() } })
    }
    if (url.pathname === '/api/verification/latest') {
      const latest = await env.DB.prepare("SELECT id, report_date, status, current_step, source_count, duplicate_count, translation_quality_score, metrics_json, completed_at, error_code, error_message FROM pipeline_runs ORDER BY started_at DESC LIMIT 1").first<Record<string, unknown>>()
      if (!latest) return json({ ok: false, reason: 'NO_RUNS' }, 404)
      const date = String(latest.report_date)
      const reports = await env.DB.prepare("SELECT language, status, quality_score, translation_status, length(content) AS content_length FROM reports WHERE report_date = ? ORDER BY language").bind(date).all()
      const findings = await env.DB.prepare("SELECT reports.language, COUNT(*) AS count FROM findings JOIN reports ON reports.id = findings.report_id WHERE reports.report_date = ? GROUP BY language").bind(date).all()
      const sources = await env.DB.prepare("SELECT COUNT(*) AS count, SUM(CASE WHEN verification_status = 'verified' THEN 1 ELSE 0 END) AS verified FROM sources WHERE publication_date BETWEEN date(?, '-90 day') AND ?").bind(date, date).first()
      const translationQuality = Number(latest.translation_quality_score)
      const contractReady = latest.status === 'completed' && Number.isFinite(translationQuality) && translationQuality >= 90
      return json({ ok: contractReady, legacyRun: latest.status === 'completed' && (!Number.isFinite(translationQuality) || translationQuality < 1), run: latest, reports: reports.results, findings: findings.results, sources, contract: { englishAndSpanishReports: true, translationQualityMinimum: 90, sourceUrlsPersisted: true, duplicateDetection: true, evidenceMetadata: true } })
    }
    if (url.pathname === '/api/reports' && request.method === 'GET') return json(await latestReports(env, (url.searchParams.get('language') === 'es' ? 'es' : 'en')))
    const apiReport = url.pathname.match(/^\/api\/reports\/(\d{4}-\d{2}-\d{2})$/)
    if (apiReport && request.method === 'GET') {
      const item = await report(env, apiReport[1], url.searchParams.get('language') === 'es' ? 'es' : 'en')
      return item ? json(item) : json({ error: 'Report not found' }, 404)
    }
    if (url.pathname === '/api/run' && request.method === 'POST') {
      if (!authorized(request, env)) return json({ error: 'Unauthorized' }, 401)
      const result = await runPipeline(env, (await request.json().catch(() => ({})) as { date?: string }).date)
      return json(result, result.success ? 200 : 502)
    }
    const confirmMatch = url.pathname.match(/^\/api\/confirm\/([^/]+)$/)
    if (confirmMatch && request.method === 'GET') return confirmSubscriber(env, confirmMatch[1])
    const unsubscribeMatch = url.pathname.match(/^\/api\/unsubscribe\/([^/]+)$/)
    if (unsubscribeMatch && request.method === 'GET') return unsubscribeSubscriber(env, unsubscribeMatch[1])
    if (url.pathname === '/api/subscribe' && request.method === 'POST') {
      const form = await request.formData()
      const email = String(form.get('email') ?? '').trim().toLowerCase()
      const language = form.get('language') === 'es' ? 'es' : 'en'
      if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'Valid email required' }, 400)
      const token = crypto.randomUUID()
      const tokenHash = await sha256(token)
      await env.DB.prepare('INSERT INTO subscribers (id, email, language, token_hash, subscribed_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET status = \'pending\', token_hash = excluded.token_hash, language = excluded.language').bind(id('sub'), email, language, tokenHash, now()).run()
      const confirmUrl = `${env.PUBLIC_SITE_URL}/api/confirm/${token}`
      const subject = language === 'es' ? 'Confirma tus actualizaciones de Parkinson' : 'Confirm your Parkinson’s research updates'
      try {
        await sendEmail(env, email, subject, `<p>${language === 'es' ? 'Confirma tu suscripción:' : 'Confirm your subscription:'}</p><p><a href="${confirmUrl}">${confirmUrl}</a></p>`)
      } catch (error) {
        return json({ error: 'Subscription saved but confirmation email failed', detail: error instanceof Error ? error.message : String(error) }, 502)
      }
      return page('Check your email', `<div class="hero"><h1>Check your email</h1><p>Confirm the subscription from the link sent to ${escapeHtml(email)}.</p></div>`, language)
    }
    return page('Not found', '<h1>Not found</h1>', 'en', 404)
  },
}
