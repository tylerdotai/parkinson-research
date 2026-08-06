import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { parseReportSections } from './parseReport'
import type { ReportSection } from './types'


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

const REPORT_API_URL = process.env.REPORT_API_URL?.replace(/\/$/, '')

type RemoteReport = {
  title?: string
  report_date?: string
  content?: string
}

async function fetchRemote<T>(pathname: string): Promise<T | null> {
  if (!REPORT_API_URL) return null
  try {
    const response = await fetch(`${REPORT_API_URL}${pathname}`, {
      cache: 'no-store',
    })
    if (!response.ok) return null
    return await response.json() as T
  } catch {
    return null
  }
}

function reportFromRemote(item: RemoteReport, fallbackDate: string): Report | null {
  if (!item.content) return null
  const date = item.report_date || fallbackDate
  const body = item.content.replace(/^---[\s\S]*?\n---\s*/, '')
  return {
    title: item.title || `Parkinson's Research Report — ${date}`,
    date,
    content: body,
    html: simpleMarkdownToHtml(body),
    preview: previewFromMarkdown(body),
  }
}

function previewFromMarkdown(markdown: string): string {
  const intro = markdown
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#') && !line.startsWith('*From:') && !line.startsWith('*De:'))
  if (!intro) return 'Daily research update'
  const clean = stripEmojis(intro)
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()
  return clean.slice(0, 160) + (clean.length > 160 ? '...' : '')
}

// Strip emojis from text for web display (reports keep them in markdown)
function stripEmojis(text: string): string {
  return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
}

function simpleMarkdownToHtml(md: string): string {
  // Strip emojis for web display
  const html = stripEmojis(md)
  
  // Extract sections and build structured HTML
  const lines = html.split('\n')
  const elements: string[] = []
  let listItems: string[] = []
  
  const closeList = () => {
    if (listItems.length > 0) {
      elements.push(`<ul class="list-disc ml-5 mb-4 space-y-1">${listItems.join('')}</ul>`)
      listItems = []
    }
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
  const remote = await fetchRemote<{ results?: Array<{ report_date?: string }> }>(`/api/reports?language=${lang}`)
  const remoteDates = (remote?.results ?? []).map((item) => item.report_date).filter((date): date is string => Boolean(date))
  const dates = new Set(remoteDates)

  try {
    const reportsDir = getLangReportsDir(lang)
    if (fs.existsSync(reportsDir)) {
      for (const file of fs.readdirSync(reportsDir)) {
        if (file.endsWith('.md')) dates.add(file.replace('.md', ''))
      }
    }
    return [...dates].sort().reverse()
  } catch {
    return [...dates].sort().reverse()
  }
}

export async function getReportMetadata(date: string, lang = 'en'): Promise<{ preview: string } | null> {
  const remoteReport = await getReport(date, lang)
  if (remoteReport) return { preview: remoteReport.preview }

  try {
    const filePath = path.join(getLangReportsDir(lang), `${date}.md`)
    if (!fs.existsSync(filePath)) return null

    const rawContent = fs.readFileSync(filePath, 'utf-8')
    const { content } = matter(rawContent)

    // Find the intro paragraph (first non-header, non-empty paragraph after frontmatter)
    const lines = content.split('\n')
    let introLine = ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('##') && !trimmed.startsWith('*From:')) {
        introLine = trimmed
        break
      }
    }

    const preview = stripEmojis(introLine).slice(0, 120) + (introLine.length > 120 ? '...' : '')
    return { preview: preview || 'Daily research update' }
  } catch {
    return null
  }
}

export async function getReport(date: string, lang = 'en'): Promise<Report | null> {
  const remote = await fetchRemote<RemoteReport>(`/api/reports/${date}?language=${lang}`)
  const remoteReport = remote ? reportFromRemote(remote, date) : null
  if (remoteReport) return remoteReport

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
      preview: previewFromMarkdown(body),
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

  const remoteReport = await getReport(dates[0], lang)
  if (remoteReport) {
    const sections = parseReportSections(remoteReport.content)
    return {
      date: dates[0],
      title: remoteReport.title,
      sections: sections.map((section) => ({
        title: section.title,
        summary: extractSummary(section.entries.map((entry) => entry.snippet || '').join(' ')),
      })),
    }
  }

  const filePath = path.join(getLangReportsDir(lang), `${dates[0]}.md`)
  if (!fs.existsSync(filePath)) return null

  const rawContent = fs.readFileSync(filePath, 'utf-8')
  const { content } = matter(rawContent)

  // Extract section summaries from content (already stripped of frontmatter)
  const sections: { title: string; summary: string }[] = []
  const lines = content.split('\n')
  let currentSection = ''
  let currentContent: string[] = []

  for (const line of lines) {
    const h2Match = line.match(/^## (.+)/)

    if (h2Match) {
      if (currentSection && currentContent.length > 0) {
        const summary = extractSummary(currentContent.join(' '))
        if (summary) sections.push({ title: currentSection, summary })
      }
      currentSection = h2Match[1].trim()
      currentContent = []
    } else if (line.trim() && !line.startsWith('#') && !line.startsWith('---') && !line.startsWith('*From:')) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('-') && !trimmed.match(/^\d+\./)) {
        currentContent.push(trimmed)
      }
    }
  }

  const mainSections = sections.filter(s =>
    s.title && !s.title.includes('Quick Tips') &&
    !s.title.includes('Action Items') &&
    !s.title.includes('Glossary') &&
    !s.title.includes('Resources')
  ).slice(0, 5)

  return {
    date: dates[0],
    title: "Parkinson's Research",
    sections: mainSections,
  }
}

function extractSummary(text: string): string {
  // Remove markdown formatting
  const cleaned = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\|.*\|/g, '')
    .replace(/Source:\s*https?:\/\/[^\s]+/gi, '')
    .replace(/source:\s*https?:\/\/[^\s]+/gi, '')

  // Take first 150 chars
  const summary = cleaned.trim().slice(0, 150)
  return summary.length < cleaned.trim().length ? summary + '...' : summary
}
