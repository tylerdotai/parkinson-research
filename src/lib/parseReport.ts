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

function extractCategoryFromTitle(title: string): string {
  // Strip emoji prefix like "🔬 " or "💊 " or "🏃 "
  const clean = title.replace(/^[^\w\s]+/, '').trim()
  return CATEGORY_MAP[clean] || 'clinical'
}

function cleanSectionTitle(title: string): string {
  // Strip emoji prefix
  return title.replace(/^[^\w\s]+/, '').trim()
}

export function parseReportSections(content: string): ReportSection[] {
  const lines = content.split('\n')
  const sections: ReportSection[] = []
  let currentSection: ReportSection | null = null
  let currentEntry: Partial<ReportEntry> = {}
  let pendingSnippet = ''

  const flushEntry = () => {
    if (currentEntry.title && currentSection) {
      const snippetText = (currentEntry.snippet || pendingSnippet).trim()
      const entry: ReportEntry = {
        title: currentEntry.title,
        snippet: snippetText || undefined,
        date: currentEntry.date,
        source: currentEntry.source,
        url: currentEntry.url,
      }
      currentSection.entries.push(entry)
    }
    currentEntry = {}
    pendingSnippet = ''
  }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const line = raw.replace(/^\s*/, '') // strip leading space only (preserve internal spaces)
    const indent = raw.length - line.length

    // Skip empty lines
    if (!line.trim()) {
      // Blank line — flush snippet context if nothing else
      continue
    }

    // Skip top-level headers
    if (line.startsWith('# ') || line.startsWith('---')) continue

    // Section header: ## [emoji] Category Title
    if (line.startsWith('## ')) {
      flushEntry()
      if (currentSection) sections.push(currentSection)
      const rawTitle = line.slice(3).trim()
      const title = cleanSectionTitle(rawTitle)
      currentSection = {
        title,
        emoji: '',
        category: extractCategoryFromTitle(rawTitle) as ReportSection['category'],
        entries: [],
      }
      continue
    }

    // Source on its own indented line
    if ((line.startsWith('Source:') || line.startsWith('source:')) && indent > 0) {
      const url = extractUrl(line)
      if (url) currentEntry.url = url
      const sourceMatch = line.match(/^Source:\s*(.+)/i)
      if (sourceMatch) currentEntry.source = sourceMatch[1].trim()
      continue
    }

    // List item entry: - **Title** — snippet
    if (line.startsWith('- **')) {
      flushEntry()

      // Non-greedy: stop at first **, then capture rest (snippet)
      // Handles titles like "UCSD Trials — San Diego" where em-dash is in title
      const match = line.match(/^- \*\*([^*]+)\*\*(.*)$/)
      if (match) {
        currentEntry.title = match[1].trim()
        const rest = (match[2] || '').trim()

        // Remove leading "— " or "- " from snippet
        currentEntry.snippet = rest.replace(/^[—–-]\s*/, '').trim()

        // Check for URL in the full line
        const url = extractUrl(line)
        if (url) {
          currentEntry.url = url
          currentEntry.source = cleanDomain(url)
        }
      }
      continue
    }

    // Metadata: **Date:** value or **Source:** value on same line
    if (line.startsWith('**') && line.includes(':**')) {
      const metaMatch = line.match(/^\*\*(.+?):\*\*\s*(.+)/)
      if (metaMatch) {
        const [, key, value] = metaMatch
        const url = extractUrl(value)

        if (key === 'Date' || key === 'date' || key === 'Posted') {
          currentEntry.date = value.trim()
        } else if (key === 'Source' || key === 'source') {
          currentEntry.source = value.trim()
          if (url) currentEntry.url = url
        }
      }
      continue
    }

    // Continuation of snippet or context (not highly indented)
    if (indent > 0 && indent < 10 && !line.startsWith('**')) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('Source')) {
        pendingSnippet += ' ' + trimmed
      }
      continue
    }
  }

  flushEntry()
  if (currentSection) sections.push(currentSection)
  return sections
}

function cleanDomain(url: string): string {
  if (!url) return ''
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }
}
