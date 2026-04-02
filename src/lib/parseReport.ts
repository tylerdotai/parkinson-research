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

function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, (match) => match.replace(/`{1,3}/g, ''))
}

function extractTitleFromLine(line: string): { title: string; rest: string } | null {
  // Pattern: **Title** — rest
  const boldMatch = line.match(/^\*\*(.+?)\*\*(.*)$/)
  if (boldMatch) {
    return { title: boldMatch[1].trim(), rest: boldMatch[2].trim() }
  }
  // Pattern: Title — rest (without bold)
  const dashMatch = line.match(/^(.+?)\s*[—–-]\s*(.+)$/)
  if (dashMatch) {
    return { title: dashMatch[1].trim(), rest: dashMatch[2].trim() }
  }
  return null
}

function extractSource(lines: string[], startIdx: number): { source: string; url: string } | null {
  for (let i = startIdx; i < Math.min(startIdx + 3, lines.length); i++) {
    const line = lines[i].trim()
    const match = line.match(/^Source:\s*(.+)/i)
    if (match) {
      const sourceUrl = extractUrl(line)
      return {
        source: match[1].trim(),
        url: sourceUrl || '',
      }
    }
    // Also check for URL-only lines
    if (line.match(/^https?:\/\//)) {
      return { source: line, url: line }
    }
  }
  return null
}

function extractUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s\)]+/)
  return match ? match[0] : null
}

function extractDate(line: string): string | undefined {
  // Look for date patterns like "Mar 23, 2026" or "2026-03-23"
  const match = line.match(/([A-Z][a-z]{2}\s+\d{1,2},?\s+\d{4})/)
  if (match) return match[1]
  const isoMatch = line.match(/(\d{4}-\d{2}-\d{2})/)
  if (isoMatch) return isoMatch[1]
  return undefined
}

function parseSnippet(rest: string): string {
  // Remove Source: ... from snippet
  const withoutSource = rest.replace(/Source:\s*.+/i, '').trim()
  // Remove URL from snippet
  const withoutUrl = withoutSource.replace(/https?:\/\/[^\s]+/g, '').trim()
  // Clean up dashes
  return withoutUrl.replace(/^[—–-]\s*/, '').trim()
}

export function parseReportSections(content: string): ReportSection[] {
  const lines = content.split('\n')
  const sections: ReportSection[] = []
  let currentSection: ReportSection | null = null
  let currentEntries: ReportEntry[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Section header
    if (trimmed.startsWith('## ')) {
      // Save previous section
      if (currentSection) {
        currentSection.entries = [...currentEntries]
        sections.push(currentSection)
      }

      const title = trimmed.slice(3).trim()
      currentSection = {
        title,
        emoji: getEmojiForSection(title),
        category: (CATEGORY_MAP[title] || 'clinical') as ReportSection['category'],
        entries: [],
      }
      currentEntries = []
      continue
    }

    // Skip empty, frontmatter markers, headers, horizontal rules
    if (!trimmed || trimmed === '---' || trimmed.startsWith('# ') || trimmed.startsWith('### ') || trimmed.startsWith('#### ')) {
      continue
    }

    // List item entry
    if (trimmed.startsWith('- ')) {
      const entryText = trimmed.slice(2).trim()
      const parsed = extractTitleFromLine(entryText)

      if (parsed) {
        // Look ahead for Source
        const source = extractSource(lines, i + 1)

        const entry: ReportEntry = {
          title: parsed.title,
          snippet: parseSnippet(parsed.rest),
          date: extractDate(entryText),
        }

        if (source) {
          entry.source = source.source.replace(/^Source:\s*/i, '')
          entry.url = source.url
        }

        currentEntries.push(entry)
      } else if (entryText.length > 10) {
        // Plain text entry without title format
        currentEntries.push({
          title: '',
          snippet: entryText,
        })
      }
    }
  }

  // Save last section
  if (currentSection) {
    currentSection.entries = currentEntries
    sections.push(currentSection)
  }

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
