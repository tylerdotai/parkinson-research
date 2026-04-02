import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { parseReportSections } from './parseReport'
import type { ReportSection } from './types'

const REPORTS_DIR = path.join(process.cwd(), 'public', 'reports')

function getLangReportsDir(lang: string): string {
  if (lang === 'es') {
    return path.join(process.cwd(), 'public', 'reports', 'es')
  }
  return path.join(process.cwd(), 'public', 'reports')
}

export interface Report {
  title: string
  date: string
  content: string
  html: string
  preview: string
}

// Strip emojis from text for web display (reports keep them in markdown)
function stripEmojis(text: string): string {
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
}

function simpleMarkdownToHtml(md: string): string {
  // Strip emojis for web display
  let html = stripEmojis(md)
  
  // Extract sections and build structured HTML
  const lines = html.split('\n')
  const elements: string[] = []
  let inList = false
  let listItems: string[] = []
  
  const closeList = () => {
    if (listItems.length > 0) {
      elements.push(`<ul class="list-disc ml-5 mb-4 space-y-1">${listItems.join('')}</ul>`)
      listItems = []
    }
    inList = false
  }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    
    // Skip empty lines and frontmatter markers
    if (!trimmed || trimmed === '---') continue
    
    // Headers
    if (trimmed.startsWith('#### ')) {
      closeList()
      elements.push(`<h4 class="text-base font-semibold mt-5 mb-2 text-slate-900">${trimmed.slice(5)}</h4>`)
    } else if (trimmed.startsWith('### ')) {
      closeList()
      elements.push(`<h3 class="text-lg font-semibold mt-6 mb-2 text-slate-900">${trimmed.slice(4)}</h3>`)
    } else if (trimmed.startsWith('## ')) {
      closeList()
      elements.push(`<h2 class="text-xl font-semibold mt-8 mb-3 text-slate-900">${trimmed.slice(3)}</h2>`)
    } else if (trimmed.startsWith('# ')) {
      closeList()
      elements.push(`<h1 class="text-2xl font-bold mb-4 text-slate-900">${trimmed.slice(2)}</h1>`)
    }
    // List items
    else if (trimmed.startsWith('- ') || trimmed.match(/^[\d]+\.\s/)) {
      inList = true
      const content = trimmed.replace(/^[\d]+\.\s/, '').replace(/^- /, '')
      listItems.push(`<li class="text-slate-600">${content}</li>`)
    }
    // Horizontal rules
    else if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      closeList()
      elements.push('<hr class="border-slate-200 my-6" />')
    }
    // Regular paragraph
    else {
      closeList()
      const processed = processedLine(trimmed)
      if (processed) {
        elements.push(`<p class="mb-3 text-slate-600 leading-relaxed">${processed}</p>`)
      }
    }
  }
  
  closeList()
  return elements.join('\n')
}

function processedLine(text: string): string {
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-medium">$1</strong>')
  // Italic
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')
  // Links
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
  return text
}

export async function getAllReportDates(lang = 'en'): Promise<string[]> {
  try {
    const reportsDir = getLangReportsDir(lang)
    if (!fs.existsSync(reportsDir)) {
      return []
    }
    const files = fs.readdirSync(reportsDir)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''))
      .sort()
      .reverse()
    return files
  } catch {
    return []
  }
}

export function getReportMetadata(date: string, lang = 'en'): { preview: string } | null {
  try {
    const filePath = path.join(getLangReportsDir(lang), `${date}.md`)
    if (!fs.existsSync(filePath)) return null
    
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(content)
    
    // Extract first paragraph as preview (strip emojis)
    const firstParagraph = stripEmojis(
      content.split('\n\n')[2]?.replace(/^#.*\n/, '').trim() || ''
    )
    
    return {
      preview: firstParagraph.slice(0, 120) + (firstParagraph.length > 120 ? '...' : ''),
    }
  } catch {
    return null
  }
}

export async function getReport(date: string, lang = 'en'): Promise<Report | null> {
  try {
    const filePath = path.join(getLangReportsDir(lang), `${date}.md`)
    if (!fs.existsSync(filePath)) return null

    const content = fs.readFileSync(filePath, 'utf-8')
    const { data, content: body } = matter(content)

    const html = simpleMarkdownToHtml(body)

    return {
      title: data.title || `Parkinson's Research Report — ${date}`,
      date,
      content: body,
      html,
      preview: stripEmojis(body).slice(0, 200) + '...',
    }
  } catch {
    return null
  }
}

export async function getReportSections(date: string, lang = 'en'): Promise<ReportSection[]> {
  const report = await getReport(date, lang)
  if (!report) return []
  return parseReportSections(report.content)
}

export async function getLatestReport(lang = 'en'): Promise<Report | null> {
  const dates = await getAllReportDates(lang)
  if (dates.length === 0) return null
  return getReport(dates[0], lang)
}

export interface ReportSummary {
  date: string
  title: string
  sections: {
    title: string
    summary: string
  }[]
}

export async function getLatestReportSummary(lang = 'en'): Promise<ReportSummary | null> {
  const dates = await getAllReportDates(lang)
  if (dates.length === 0) return null
  
  const report = await getReport(dates[0])
  if (!report) return null
  
  // Extract section summaries from content
  const sections: { title: string; summary: string }[] = []
  const lines = report.content.split('\n')
  let currentSection = ''
  let currentContent: string[] = []
  
  for (const line of lines) {
    const h2Match = line.match(/^## (.+)/)
    
    if (h2Match) {
      // Save previous section
      if (currentSection && currentContent.length > 0) {
        const summary = extractSummary(currentContent.join(' '))
        if (summary) {
          sections.push({ title: currentSection, summary })
        }
      }
      currentSection = h2Match[1].trim()
      currentContent = []
    } else if (line.trim() && !line.startsWith('#') && !line.startsWith('---')) {
      // Skip list items for summary, just get prose
      const trimmed = line.trim()
      if (!trimmed.startsWith('-') && !trimmed.match(/^\d+\./)) {
        currentContent.push(trimmed)
      }
    }
  }
  
  // Don't include last section (usually Quick Tips, Action Items, Glossary) - keep it to main categories
  const mainSections = sections.filter(s => 
    s.title && !s.title.includes('Quick Tips') && 
    !s.title.includes('Action Items') && 
    !s.title.includes('Glossary') &&
    !s.title.includes('Resources')
  ).slice(0, 5)
  
  return {
    date: report.date,
    title: report.title,
    sections: mainSections,
  }
}

function extractSummary(text: string): string {
  // Remove markdown formatting
  let cleaned = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\|.*\|/g, '')
  
  // Take first 150 chars
  const summary = cleaned.trim().slice(0, 150)
  return summary.length < cleaned.trim().length ? summary + '...' : summary
}
