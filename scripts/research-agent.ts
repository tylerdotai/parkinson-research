#!/usr/bin/env npx tsx
/**
 * research-agent.ts
 *
 * AI-powered daily report generator for AI Against Parkinson's.
 * Uses Groq's free Llama 3.1 8B Instant for research and translation.
 *
 * Run: npx tsx scripts/research-agent.ts
 * Or: npm run research
 *
 * Steps:
 * 1. Determine today's date
 * 2. Research 4 categories using Groq LLM (parallel)
 * 3. Assemble findings into EN report
 * 4. Translate to ES
 * 5. Write report files
 * 6. Git add + commit + push
 * 7. Trigger email delivery
 */

import { execSync } from 'child_process'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const SITE_URL = 'https://aiagainstparkinson.com'
const REPORTS_DIR = join(process.cwd(), 'public', 'reports')
const ES_REPORTS_DIR = join(REPORTS_DIR, 'es')

// ── Groq API ─────────────────────────────────────────────────────────────────

interface GroqResponse {
  choices: { message: { content: string } }[]
}

async function groqChat(model: string, system: string, user: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY not set')

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Groq API error ${res.status}: ${text}`)
  }

  const data: GroqResponse = await res.json()
  return data.choices[0]?.message?.content?.trim() ?? ''
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function run(cmd: string): string {
  return execSync(cmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 })
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

// ── Research Categories ─────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'clinical_trials',
    section: 'Clinical Trials',
    searchQuery: "Parkinson's disease clinical trials recruiting 2026 site:clinicaltrials.gov OR site:pubmed.gov",
    system: `You are a medical research assistant specializing in Parkinson's disease clinical trials.
You write plain-language summaries for patients and families affected by Parkinson's.
You NEVER invent facts, sources, or citations. You ONLY write about real research from credible sources.
If no significant findings exist, write "No significant clinical trial developments this week."`,
    prompt: `Search for recent Parkinson's disease clinical trials recruiting patients in 2026.
Find 2-3 meaningful developments from ClinicalTrials.gov, PubMed, NIH, or major university research centers.
For each finding provide:
1. A headline (max 8 words, no medical jargon)
2. A plain-language explanation (2-3 sentences: what it is, why it matters for patients/families)
3. A real source URL from credible institutions (NIH, FDA, ClinicalTrials.gov, major universities, Parkinson's Foundation, MJFF)

Format each finding as:
### [Headline]

[2-3 sentence plain-language explanation]

*From: Source Name (URL)*`,
  },
  {
    id: 'breakthroughs',
    section: 'Breakthrough Treatments',
    searchQuery: "Parkinson's disease treatment breakthrough 2026 site:nih.gov OR site:ucsf.edu OR site:parkinson.org",
    system: `You are a medical research assistant specializing in Parkinson's disease treatments.
You write plain-language summaries for patients and families.
You NEVER invent facts, sources, or citations. You ONLY write about real research.
If no significant findings exist, write "No significant treatment breakthroughs this week."`,
    prompt: `Find 2-3 recent breakthrough treatments or significant advances in Parkinson's disease treatment from 2026.
Sources: NIH, FDA, UCSF, Parkinson's Foundation, MJFF, or major university research centers.
For each finding provide:
1. A headline (max 8 words, no medical jargon)
2. A plain-language explanation (2-3 sentences: what it is, why it matters)
3. A real source URL

Format each finding as:
### [Headline]

[2-3 sentence plain-language explanation]

*From: Source Name (URL)*`,
  },
  {
    id: 'lifestyle',
    section: 'Lifestyle Interventions',
    searchQuery: "Parkinson's disease exercise diet sleep research 2026 site:pubmed.gov",
    system: `You are a medical research assistant specializing in Parkinson's disease lifestyle research.
You write plain-language summaries for patients and families.
You NEVER invent facts, sources, or citations. You ONLY write about real research.
If no significant findings exist, write "No significant lifestyle intervention findings this week."`,
    prompt: `Find 2-3 recent findings on lifestyle interventions for Parkinson's disease from 2026.
Focus on exercise, diet, sleep, stress management, or other non-pharmacological interventions.
Sources: PubMed, NIH, major universities.
For each finding provide:
1. A headline (max 8 words, no medical jargon)
2. A plain-language explanation (2-3 sentences: what it is, why it matters for daily life)
3. A real source URL

Format each finding as:
### [Headline]

[2-3 sentence plain-language explanation]

*From: Source Name (URL)*`,
  },
  {
    id: 'emerging',
    section: 'Emerging Research',
    searchQuery: "Parkinson's disease emerging science alpha-synuclein research 2026 site:pubmed.gov OR site:biorxiv.org",
    system: `You are a medical research assistant specializing in Parkinson's disease neuroscience.
You write plain-language summaries for patients and families.
You NEVER invent facts, sources, or citations. You ONLY write about real research.
If no significant findings exist, write "No significant emerging research this week."`,
    prompt: `Find 2-3 recent emerging scientific developments in Parkinson's disease from 2026.
Focus on alpha-synuclein research, genetic discoveries, biomarker developments, or other scientific advances.
Sources: PubMed, bioRxiv, NIH, major university research labs.
For each finding provide:
1. A headline (max 8 words, no medical jargon)
2. A plain-language explanation (2-3 sentences: what it is, why it matters for future treatments)
3. A real source URL

Format each finding as:
### [Headline]

[2-3 sentence plain-language explanation]

*From: Source Name (URL)*`,
  },
]

// ── Freshness Filter ─────────────────────────────────────────────────────────

const FRESHNESS_DAYS = 90

function isFresh(dateStr: string): boolean {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  return diff < FRESHNESS_DAYS
}

// ── Source Search Functions ─────────────────────────────────────────────────

async function searchPubMed(query: string): Promise<string> {
  try {
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}+parkinson+disease&retmax=10&retmode=json&sort=relevance&datetype=pdat`
    const searchRes = await fetch(searchUrl)
    if (!searchRes.ok) return ''
    const searchData = await searchRes.json() as { esearchresult?: { idlist?: string[] } }
    const ids = searchData.esearchresult?.idlist ?? []
    if (ids.length === 0) return ''

    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`
    const fetchRes = await fetch(fetchUrl)
    if (!fetchRes.ok) return ''
    const fetchData = await fetchRes.json() as { result?: Record<string, { title?: string; source?: string; pubdate?: string; url?: string; authors?: Array<{ name: string }> }> }

    const results: string[] = []
    for (const id of ids.slice(0, 5)) {
      const article = fetchData.result?.[id]
      if (!article) continue
      const pubDate = article.pubdate ?? ''
      if (pubDate && !isFresh(pubDate)) continue
      const authors = (article.authors ?? []).slice(0, 3).map((a) => a.name).join(', ')
      results.push(`[PubMed:${id}] ${article.title ?? ''} (${pubDate}) — ${authors}`)
    }
    return results.join('\n')
  } catch {
    return ''
  }
}

async function searchGP2(query: string): Promise<string> {
  try {
    const url = `https://gp2.org/search?query=${encodeURIComponent(query + ' parkinson')}`
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    if (!res.ok) return ''
    const data = await res.json() as { results?: Array<{ title?: string; date?: string; url?: string; description?: string }> }
    const results: string[] = []
    for (const item of (data.results ?? []).slice(0, 5)) {
      if (item.date && !isFresh(item.date)) continue
      results.push(`[GP2] ${item.title ?? ''} — ${item.description ?? ''} (${item.url ?? ''})`)
    }
    return results.join('\n')
  } catch {
    return ''
  }
}

async function searchAMPPD(query: string): Promise<string> {
  try {
    const url = `https://amp-pd.org/api/search?q=${encodeURIComponent(query + ' parkinson')}`
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    if (!res.ok) return ''
    const data = await res.json() as { items?: Array<{ title?: string; date?: string; link?: string; summary?: string }> }
    const results: string[] = []
    for (const item of (data.items ?? []).slice(0, 5)) {
      if (item.date && !isFresh(item.date)) continue
      results.push(`[AMP PD] ${item.title ?? ''} — ${item.summary ?? ''} (${item.link ?? ''})`)
    }
    return results.join('\n')
  } catch {
    return ''
  }
}

async function searchPPMI(query: string): Promise<string> {
  try {
    const url = `https://www.ppmi-info.org/api/search?q=${encodeURIComponent(query + ' parkinson')}`
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    if (!res.ok) return ''
    const data = await res.json() as { results?: Array<{ title?: string; date?: string; url?: string; summary?: string }> }
    const results: string[] = []
    for (const item of (data.results ?? []).slice(0, 5)) {
      if (item.date && !isFresh(item.date)) continue
      results.push(`[PPMI] ${item.title ?? ''} — ${item.summary ?? ''} (${item.url ?? ''})`)
    }
    return results.join('\n')
  } catch {
    return ''
  }
}

async function fetchAllSources(query: string): Promise<string> {
  const [pubmed, gp2, ampPD, ppmi] = await Promise.all([
    searchPubMed(query),
    searchGP2(query),
    searchAMPPD(query),
    searchPPMI(query),
  ])
  const combined = [pubmed, gp2, ampPD, ppmi].filter(Boolean)
  if (combined.length === 0) return ''
  return '\n\n--- SOURCE DATA ---\n' + combined.join('\n') + '\n--- END SOURCE DATA ---\n'
}

// ── Research Agent ───────────────────────────────────────────────────────────

async function researchCategory(category: (typeof CATEGORIES)[0]): Promise<string> {
  console.log(`  [${category.section}] researching...`)
  try {
    const sourceData = await fetchAllSources(category.searchQuery)

    const result = await groqChat(
      'llama-3.1-8b-instant',
      category.system,
      category.prompt + (sourceData ? "\n\nBelow is structured data from authoritative Parkinson's sources. Use this data to supplement your search. If the data is relevant, incorporate it. If it is stale (older than 90 days), ignore it.\n\n" + sourceData : "")
    )
    console.log(`  [${category.section}] done`)
    return result
  } catch (e) {
    console.log(`  [${category.section}] error: ${e}`)
    return `No significant developments this week in ${category.section}.`
  }
}

// ── Report Assembly ─────────────────────────────────────────────────────────

function assembleReport(
  date: string,
  findings: Record<string, string>
): string {
  const lines: string[] = [
    '---',
    `title: "Parkinson's Research — ${date}"`,
    `date: "${date}"`,
    '---',
    '',
    "# Parkinson's Research",
    '',
    'Daily research for families navigating Parkinson\'s.',
    '',
  ]

  for (const cat of CATEGORIES) {
    lines.push(`## ${cat.section}`, '', findings[cat.id] || '', '')
  }

  lines.push(
    '---',
    "*Generated daily from public research databases. For informational purposes only — not medical advice.*"
  )

  return lines.join('\n')
}

// ── Email Trigger ───────────────────────────────────────────────────────────

async function triggerEmail(date: string, language: string): Promise<void> {
  console.log(`  [email] sending ${language} report for ${date}...`)
  try {
    const res = run(
      `curl -s -X POST "${SITE_URL}/api/send-report" ` +
      `-H "Content-Type: application/json" ` +
      `-d '{"date": "${date}", "language": "${language}"}'`
    )
    const data = JSON.parse(res)
    console.log(`  [email] ${language}: sent=${data.sent}, failed=${data.failed?.length || 0}`)
  } catch (e) {
    console.log(`  [email] ${language}: failed — ${e}`)
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const date = process.env.REPORT_DATE || today()
  console.log(`\nParkinson Research Agent — ${date}\n`)

  // Ensure directories exist
  if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true })
  if (!existsSync(ES_REPORTS_DIR)) mkdirSync(ES_REPORTS_DIR, { recursive: true })

  // Check if report already exists
  const enPath = join(REPORTS_DIR, `${date}.md`)
  if (existsSync(enPath)) {
    console.log(`Report for ${date} already exists. Skipping.`)
    process.exit(0)
  }

  // ── Research all categories in parallel ──────────────────────────────────
  console.log('Researching categories...\n')
  const results = await Promise.all(
    CATEGORIES.map((cat) => researchCategory(cat))
  )
  const findings: Record<string, string> = {}
  CATEGORIES.forEach((cat, i) => {
    findings[cat.id] = results[i]
  })

  // ── Assemble EN report ────────────────────────────────────────────────────
  console.log('\nAssembling EN report...')
  const enReport = assembleReport(date, findings)

  // ── Translate to ES ────────────────────────────────────────────────────────
  console.log('Translating to Spanish...')
  let esReport = ''
  try {
    esReport = await groqChat(
      'llama-3.1-8b-instant',
      `You are a professional medical translator. Translate the following Parkinson's disease research report from English to warm, accessible Spanish (not overly formal). Preserve the exact structure: YAML frontmatter (change title to Spanish), section headings, finding format, and source URLs. Do NOT translate source URLs or NCT numbers.`,
      `Translate this report to Spanish:\n\n${enReport}`
    )
  } catch (e) {
    console.log(`  [translation] error: ${e} — using fallback`)
    esReport = enReport // fallback: skip translation
  }

  // ── Write files ────────────────────────────────────────────────────────────
  writeFileSync(enPath, enReport, 'utf-8')
  console.log(`  [file] wrote ${enPath}`)

  const esPath = join(ES_REPORTS_DIR, `${date}.md`)
  if (esReport && esReport !== enReport) {
    writeFileSync(esPath, esReport, 'utf-8')
    console.log(`  [file] wrote ${esPath}`)
  }

  // ── Git push ───────────────────────────────────────────────────────────────
  console.log('\nCommitting and pushing...')
  try {
    run(`git add public/reports/${date}.md public/reports/es/${date}.md`)
    run(`git config user.email "agent@parkinson-research"`)
    run(`git config user.name "Parkinson Research Agent"`)
    run(`git commit -m "reports: ${date} daily update"`)
    run(`git push origin main`)
    console.log('  [git] pushed successfully')
  } catch (e) {
    console.log(`  [git] push failed: ${e}`)
    process.exit(1)
  }

  // ── Trigger emails ────────────────────────────────────────────────────────
  console.log('\nSending emails...')
  await triggerEmail(date, 'en')
  await triggerEmail(date, 'es')

  console.log(`\n✅ Done — report for ${date} generated and emails triggered.\n`)
}

main().catch((e) => {
  console.error('Fatal error:', e)
  process.exit(1)
})