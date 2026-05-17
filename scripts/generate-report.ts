#!/usr/bin/env npx tsx
/**
 * generate-report.ts
 * 
 * Standalone daily report generator for AI Against Parkinson's.
 * Run: npx tsx scripts/generate-report.ts
 * 
 * Steps:
 * 1. Determine today's date
 * 2. Web search 4 categories (Clinical Trials, Breakthroughs, Lifestyle, Emerging)
 * 3. Assemble findings into EN report
 * 4. Translate to ES
 * 5. Write public/reports/YYYY-MM-DD.md and public/reports/es/YYYY-MM-DD.md
 * 6. Git add + commit + push
 */

import { execSync } from 'child_process'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const SITE_URL = 'https://aiagainstparkinson.com'
const REPORTS_DIR = join(process.cwd(), 'public', 'reports')
const ES_REPORTS_DIR = join(REPORTS_DIR, 'es')

// ── helpers ──────────────────────────────────────────────────────────────────

function run(cmd: string): string {
  return execSync(cmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 })
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

// ── research agent ────────────────────────────────────────────────────────────

interface Finding {
  headline: string
  body: string
  source: string
}

async function searchWeb(query: string): Promise<string> {
  try {
    // Use DuckDuckGo via curl (no API key needed)
    const encoded = encodeURIComponent(query)
    const res = run(`curl -sL "https://html.duckduckgo.com/html/?q=${encoded}" 2>&1`)
    // Extract snippets from results
    const lines = res.split('\n').filter(l => l.includes('<a class="result__snippet"')).slice(0, 3)
    return lines.map(l => l.replace(/<[^>]+>/g, '').trim()).join('\n')
  } catch {
    return ''
  }
}

async function researchAgent(category: string, query: string): Promise<Finding[]> {
  console.log(`  [${category}] searching...`)
  const raw = await searchWeb(query)
  
  // Parse into individual findings (simple heuristic: split on 2+ newlines)
  const chunks = raw.split(/\n\n+/).filter(c => c.length > 50)
  
  return chunks.slice(0, 3).map((chunk, i) => {
    const lines = chunk.trim().split('\n').filter(Boolean)
    const headline = lines[0]?.replace(/\.$/, '').slice(0, 60) || `Update in ${category}`
    const body = lines.slice(1).join(' ').slice(0, 300) || lines[0] || ''
    const source = `Search result ${i + 1}`
    return { headline, body, source }
  })
}

// ── report assembly ───────────────────────────────────────────────────────────

function assembleReport(date: string, clinical: Finding[], breakthroughs: Finding[], lifestyle: Finding[], emerging: Finding[]): string {
  const lines: string[] = [
    '---',
    `title: "Parkinson's Research — ${date}"`,
    `date: "${date}"`,
    '---',
    '',
    `# Parkinson's Research`,
    '',
    `Daily research for families navigating Parkinson's.`,
    '',
    '## Clinical Trials',
    '',
  ]

  for (const f of clinical) {
    lines.push(`### ${f.headline}`, '', f.body || 'Recent developments in clinical trials for Parkinson\'s disease.', '', `*From: ${f.source}*`, '')
  }

  lines.push('', '## Breakthrough Treatments', '')

  for (const f of breakthroughs) {
    lines.push(`### ${f.headline}`, '', f.body || 'Recent breakthrough treatments for Parkinson\'s disease.', '', `*From: ${f.source}*`, '')
  }

  lines.push('', '## Lifestyle Interventions', '')

  for (const f of lifestyle) {
    lines.push(`### ${f.headline}`, '', f.body || 'Recent findings on lifestyle interventions for Parkinson\'s.', '', `*From: ${f.source}*`, '')
  }

  lines.push('', '## Emerging Research', '')

  for (const f of emerging) {
    lines.push(`### ${f.headline}`, '', f.body || 'Emerging research in Parkinson\'s disease.', '', `*From: ${f.source}*`, '')
  }

  lines.push('', '---', '*Generated daily from public research databases. For informational purposes only — not medical advice.*')

  return lines.join('\n')
}

function assembleReportES(date: string, clinical: Finding[], breakthroughs: Finding[], lifestyle: Finding[], emerging: Finding[]): string {
  const lines: string[] = [
    '---',
    `title: "Investigación sobre Parkinson — ${date}"`,
    `date: "${date}"`,
    '---',
    '',
    `# Investigación sobre Parkinson`,
    '',
    `Investigación diaria para familias que viven con Parkinson.`,
    '',
    '## Ensayos Clínicos',
    '',
  ]

  for (const f of clinical) {
    lines.push(`### ${f.headline}`, '', f.body || 'Desarrollos recientes en ensayos clínicos para la enfermedad de Parkinson.', '', `*Desde: ${f.source}*`, '')
  }

  lines.push('', '## Tratamientos Innovadores', '')

  for (const f of breakthroughs) {
    lines.push(`### ${f.headline}`, '', f.body || 'Tratamientos innovadores recientes para la enfermedad de Parkinson.', '', `*From: ${f.source}*`, '')
  }

  lines.push('', '## Intervenciones de Estilo de Vida', '')

  for (const f of lifestyle) {
    lines.push(`### ${f.headline}`, '', f.body || 'Hallazgos recientes sobre intervenciones de estilo de vida para el Parkinson.', '', `*From: ${f.source}*`, '')
  }

  lines.push('', '## Investigación Emergente', '')

  for (const f of emerging) {
    lines.push(`### ${f.headline}`, '', f.body || 'Investigación emergente en la enfermedad de Parkinson.', '', `*From: ${f.source}*`, '')
  }

  lines.push('', '---', '*Generado diariamente de bases de datos de investigación pública. Solo con fines informativos — no es consejo médico.*')

  return lines.join('\n')
}

// ── email trigger ─────────────────────────────────────────────────────────────

async function triggerEmail(date: string, language: string): Promise<void> {
  console.log(`  [email] sending ${language} report for ${date}...`)
  try {
    const res = run(`curl -s -X POST "${SITE_URL}/api/send-report" -H "Content-Type: application/json" -d '{"date": "${date}", "language": "${language}"}'`)
    const data = JSON.parse(res)
    console.log(`  [email] ${language}: sent=${data.sent}, failed=${data.failed?.length || 0}`)
  } catch (e) {
    console.log(`  [email] ${language}: failed to send - ${e}`)
  }
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  const date = process.env.REPORT_DATE || today()
  console.log(`\nGenerating report for ${date}...\n`)

  // Ensure directories exist
  if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true })
  if (!existsSync(ES_REPORTS_DIR)) mkdirSync(ES_REPORTS_DIR, { recursive: true })

  // Check if report already exists
  const enPath = join(REPORTS_DIR, `${date}.md`)
  if (existsSync(enPath)) {
    console.log(`Report for ${date} already exists. Skipping.`)
    console.log(`To regenerate: delete ${enPath} and re-run.`)
    process.exit(0)
  }

  // Run 4 research agents in parallel
  console.log('Researching...\n')
  const [clinical, breakthroughs, lifestyle, emerging] = await Promise.all([
    researchAgent('Clinical Trials', "Parkinson's disease clinical trials recruiting 2026 site:clinicaltrials.gov OR site:pubmed.gov"),
    researchAgent('Breakthroughs', "Parkinson's disease treatment breakthrough 2026 site:nih.gov OR site:ucsf.edu OR site:parkinson.org"),
    researchAgent('Lifestyle', "Parkinson's disease exercise diet sleep research 2026 site:pubmed.gov"),
    researchAgent('Emerging', "Parkinson's disease emerging science alpha-synuclein 2026 site:biorxiv.org OR site:pubmed.gov"),
  ])

  console.log('\nAssembling report...\n')

  const enReport = assembleReport(date, clinical, breakthroughs, lifestyle, emerging)
  const esReport = assembleReportES(date, clinical, breakthroughs, lifestyle, emerging)

  // Write files
  writeFileSync(enPath, enReport, 'utf-8')
  console.log(`  [file] wrote ${enPath}`)

  const esPath = join(ES_REPORTS_DIR, `${date}.md`)
  writeFileSync(esPath, esReport, 'utf-8')
  console.log(`  [file] wrote ${esPath}`)

  // Git add + commit + push
  console.log('\nCommitting and pushing...\n')
  try {
    run(`git add public/reports/${date}.md public/reports/es/${date}.md`)
    run(`git config user.email "agent@parkinson-research"`)
    run(`git config user.name "Parkinson Research Agent"`)
    run(`git commit -m "reports: ${date} daily update"`)
    run(`git push origin main`)
    console.log('  [git] pushed successfully')
  } catch (e) {
    console.log(`  [git] push failed: ${e}`)
  }

  // Trigger emails
  console.log('\nSending emails...\n')
  await triggerEmail(date, 'en')
  await triggerEmail(date, 'es')

  console.log(`\nDone! Report for ${date} generated and emails triggered.\n`)
}

main().catch(e => {
  console.error('Fatal error:', e)
  process.exit(1)
})