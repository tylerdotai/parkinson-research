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

function cleanDomain(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`)
    return u.hostname.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  }
}

export function parseReportSections(content: string): ReportSection[] {
  const lines = content.split('\n')
  const sections: ReportSection[] = []
  let currentSection: ReportSection | null = null
  let currentEntryTitle = ''
  let currentBody = ''

  const flushEntry = () => {
    if (currentSection && (currentEntryTitle || currentBody.trim())) {
      // Extract source from body if present
      let source = ''
      let sourceUrl = ''
      let snippet = currentBody.trim()

      // Look for "From: domain.com (https://...)" or "*From: domain.com (https://...)*" (markdown italic)
      const sourceLine = currentBody.match(/(?:\*From:|From|Source):\s*(.+?)(?:\n|$)/i)
      if (sourceLine) {
        const raw = sourceLine[1].replace(/\*+/g, '').trim()
        // Extract URL from parenthetical: "domain.com (https://...)"
        const urlMatch = raw.match(/\(https?:\/\/[^\)]+\)/)
        if (urlMatch) {
          sourceUrl = urlMatch[0].replace(/[()]/g, '')
          source = cleanDomain(sourceUrl)
        } else {
          source = cleanDomain(raw)
        }
        snippet = snippet.replace(/(?:\*From:|From|Source):\s*\(?https?:\/\/[^\)]+\)?\s*/gi, '').replace(/(?:\*From:|From|Source):\s*[^\n]+/gi, '').trim()
      }

      // Clean markdown from snippet
      snippet = snippet
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/\n+/g, ' ')
        .trim()

      if (snippet || currentEntryTitle) {
        currentSection.entries.push({
          title: currentEntryTitle.trim() || 'Research Update',
          snippet: snippet || undefined,
          source: source || undefined,
          url: sourceUrl || undefined,
        })
      }
    }
    currentEntryTitle = ''
    currentBody = ''
  }

  for (const rawLine of lines) {
    const line = rawLine
    const trimmed = line.trim()

    if (!trimmed || trimmed === '---') continue

    // Skip top-level headers
    if (trimmed.startsWith('# ')) continue

    // Section header
    if (trimmed.startsWith('## ')) {
      flushEntry()
      if (currentSection) sections.push(currentSection)
      const title = trimmed.slice(3).trim()
      currentSection = {
        title,
        emoji: '',
        category: (CATEGORY_MAP[title] || 'clinical') as ReportSection['category'],
        entries: [],
      }
      continue
    }

    // Entry title (### Title)
    if (trimmed.startsWith('### ')) {
      flushEntry()
      currentEntryTitle = trimmed.slice(4).trim()
      continue
    }

    // Body text (accumulate until next ### or ##)
    if (currentSection) {
      currentBody += ' ' + trimmed
    }
  }

  flushEntry()
  if (currentSection) sections.push(currentSection)
  return sections
}
