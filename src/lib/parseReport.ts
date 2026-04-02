import type { ReportSection, ReportEntry } from './types'

const CATEGORY_MAP: Record<string, string> = {
  'Clinical Trials': 'clinical',
  'Ensayos Clinicos': 'clinical',
  'Breakthrough Treatments': 'breakthrough',
  'Tratamientos Innovadores': 'breakthrough',
  'Lifestyle Interventions': 'lifestyle',
  'Intervenciones de Estilo de Vida': 'lifestyle',
  'Emerging Research': 'emerging',
  'Investigacion Emergente': 'emerging',
  'Tech Tools & Assistive Technology': 'tech',
  'Tecnologia y Herramientas Asistenciales': 'tech',
  'Community & Support': 'community',
  'Apoyo Comunitario': 'community',
  'Caregiver Resources': 'caregiver',
  'Recursos para Cuidadores': 'caregiver',
}

function extractUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s\)]+/)
  return match ? match[0].replace(/\)$/, '') : null
}

function extractDate(line: string): string | undefined {
  const match = line.match(/([A-Z][a-z]{2}\s+\d{1,2},?\s+\d{4})/)
  if (match) return match[1]
  const isoMatch = line.match(/(\d{4}-\d{2}-\d{2})/)
  if (isoMatch) return isoMatch[1]
  return undefined
}

function extractSourceFromLine(line: string): { source: string; url: string } | null {
  const match = line.match(/^\*\*(.+?)\*\*(.*)$/)
  if (match) {
    const url = extractUrl(line)
    return { source: match[1].trim(), url: url || '' }
  }
  if (line.includes('[ClinicalTrials.gov]') || line.includes('[Source:')) {
    const url = extractUrl(line)
    return { source: 'Source', url: url || '' }
  }
  return null
}

export function parseReportSections(content: string): ReportSection[] {
  const lines = content.split('\n')
  const sections: ReportSection[] = []
  let currentSection: ReportSection | null = null
  let currentEntry: Partial<ReportEntry> = {}
  let currentContext: string[] = []
  let collectingContext = false

  const flushEntry = () => {
    const title = currentEntry.title
    if (title && currentSection) {
      const snippetText = currentContext.length > 0 ? currentContext.join(' ') : currentEntry.snippet
      const entry: ReportEntry = {
        title,
        snippet: snippetText || undefined,
        date: currentEntry.date,
        source: currentEntry.source,
        url: currentEntry.url,
      }
      currentSection.entries.push(entry)
    }
    currentEntry = {}
    currentContext = []
    collectingContext = false
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Skip empty lines
    if (!trimmed) {
      collectingContext = false
      continue
    }

    // Skip frontmatter and top-level headers
    if (trimmed.startsWith('# ') || trimmed.startsWith('---')) continue

    // Section header (##)
    if (trimmed.startsWith('## ')) {
      flushEntry()
      if (currentSection) sections.push(currentSection)

      const title = trimmed.slice(3).trim()
      currentSection = {
        title,
        emoji: getEmojiForSection(title),
        category: (CATEGORY_MAP[title] || 'clinical') as ReportSection['category'],
        entries: [],
      }
      continue
    }

    // Entry title (### Trial: or ### Title)
    if (trimmed.startsWith('### ')) {
      flushEntry()
      const entryTitle = trimmed.slice(4).trim()
        .replace(/^Trial:\s*/, '')
        .replace(/\*\*/g, '')
      currentEntry.title = entryTitle
      collectingContext = false
      continue
    }

    // Metadata fields **Key:** Value
    const metaMatch = trimmed.match(/^\*\*(.+?):\*\*\s*(.+)$/)
    if (metaMatch) {
      const [, key, value] = metaMatch
      collectingContext = false

      // Date extraction
      const dateValue = extractDate(value)
      if (dateValue) currentEntry.date = dateValue

      // Source field
      if (key.toLowerCase() === 'source') {
        currentEntry.source = value.trim()
        const url = extractUrl(trimmed)
        if (url) currentEntry.url = url
      }

      // Snippet accumulation for non-source, non-date fields
      if (key !== 'Source' && key !== 'ID' && key !== 'Phase' && key !== 'Status' && key !== 'Location' && key !== 'Eligibility' && key !== 'Intervention' && key !== 'Type' && key !== 'Mechanism' && key !== 'Evidence') {
        if (!currentEntry.snippet) {
          currentEntry.snippet = value.trim()
        }
      }
      continue
    }

    // Patient/Family Context block
    if (trimmed.includes('Patient/Family Context') || trimmed.includes('Daily Life Impact') || trimmed.includes('** ')) {
      flushEntry()
      collectingContext = true
      const ctx = trimmed.replace(/\*\*/g, '').replace(/^\*\*.*?\*\*:\s*/, '')
      if (ctx) currentContext.push(ctx)
      continue
    }

    // Continuation of context or plain text
    if (collectingContext) {
      currentContext.push(trimmed.replace(/\*\*/g, ''))
      continue
    }

    // List item (fallback)
    if (trimmed.startsWith('- ') && !currentEntry.title) {
      const text = trimmed.slice(2).trim()
      if (text.length > 20) {
        currentEntry.snippet = (currentEntry.snippet || '') + ' ' + text
      }
      continue
    }
  }

  flushEntry()
  if (currentSection) sections.push(currentSection)
  return sections
}

function getEmojiForSection(title: string): string {
  const lower = title.toLowerCase()
  if (lower.includes('clinical trial')) return '🧪'
  if (lower.includes('breakthrough') || lower.includes('treatment')) return '💊'
  if (lower.includes('lifestyle') || lower.includes('exercise') || lower.includes('diet')) return '🏃'
  if (lower.includes('emerging') || lower.includes('research')) return '🔬'
  if (lower.includes('tech') || lower.includes('assistive')) return '📱'
  if (lower.includes('community') || lower.includes('support')) return '👥'
  if (lower.includes('caregiver')) return '💜'
  return '📋'
}
