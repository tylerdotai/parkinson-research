import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const REPORTS_DIR = path.join(process.cwd(), 'public', 'reports')

export interface Report {
  title: string
  date: string
  content: string
  html: string
  preview: string
}

function simpleMarkdownToHtml(md: string): string {
  return md
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-8 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener">$1</a>')
    // Lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4">')
    // Line breaks
    .replace(/\n/g, '<br/>')
    // Wrap in paragraph
    .replace(/^(?!<[hlip])/gm, '<p class="mb-4">')
    .replace(/(?<![>])$/gm, '</p>')
    // Clean up empty paragraphs
    .replace(/<p class="mb-4"><\/p>/g, '')
    // Fix list grouping
    .replace(/(<li class="ml-4">.*?<\/li>)(<br\/>)?/gs, '<ul class="list-disc my-4 space-y-1">$1</ul>')
    // Re-wrap properly
    .replace(/<ul class="list-disc my-4 space-y-1">(<li class="ml-4">.*?<\/li>)<\/ul>/gs, '<ul class="list-disc my-4 space-y-1">$1</ul>')
}

export async function getAllReportDates(): Promise<string[]> {
  try {
    if (!fs.existsSync(REPORTS_DIR)) {
      return []
    }
    const files = fs.readdirSync(REPORTS_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace('.md', ''))
      .sort()
      .reverse()
    return files
  } catch {
    return []
  }
}

export function getReportMetadata(date: string): { preview: string } | null {
  try {
    const filePath = path.join(REPORTS_DIR, `${date}.md`)
    if (!fs.existsSync(filePath)) return null
    
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(content)
    
    // Extract first paragraph as preview
    const firstParagraph = content
      .split('\n\n')[2]?.replace(/^#.*\n/, '').trim() || ''
    
    return {
      preview: firstParagraph.slice(0, 120) + (firstParagraph.length > 120 ? '...' : ''),
    }
  } catch {
    return null
  }
}

export async function getReport(date: string): Promise<Report | null> {
  try {
    const filePath = path.join(REPORTS_DIR, `${date}.md`)
    if (!fs.existsSync(filePath)) return null
    
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data, content: body } = matter(content)
    
    const html = simpleMarkdownToHtml(body)
    
    return {
      title: data.title || `Parkinson's Research Report — ${date}`,
      date,
      content: body,
      html,
      preview: body.slice(0, 200) + '...',
    }
  } catch {
    return null
  }
}

export async function getLatestReport(): Promise<Report | null> {
  const dates = await getAllReportDates()
  if (dates.length === 0) return null
  return getReport(dates[0])
}
