import { NextRequest, NextResponse } from 'next/server'
import { getReport } from '@/lib/reports'
import { getDictionary } from '@/lib/dictionary'

interface Params {
  params: Promise<{ lang: string; date: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  const { lang, date } = await params
  
  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: 'Invalid date format. Use YYYY-MM-DD' },
      { status: 400 }
    )
  }
  
  const report = await getReport(date, lang)
  const dictionary = await getDictionary(lang)
  
  if (!report) {
    return NextResponse.json(
      { error: 'Report not found' },
      { status: 404 }
    )
  }
  
  // Return full report as structured JSON
  return NextResponse.json({
    date: report.date,
    title: report.title,
    content: report.content,
    sections: parseSections(report.content),
    _meta: {
      source: dictionary.metadata.title,
      url: `https://parkinson-research.vercel.app/${lang}/report/${date}`,
      language: lang,
    }
  })
}

function parseSections(content: string) {
  const sections: Record<string, { heading: string; content: string }[]> = {}
  const lines = content.split('\n')
  let currentSection = ''
  let currentSubsection = ''
  let currentContent: string[] = []
  
  for (const line of lines) {
    const h2Match = line.match(/^## (.+)/)
    const h3Match = line.match(/^### (.+)/)
    
    if (h2Match) {
      if (currentSection && currentContent.length) {
        if (!sections[currentSection]) sections[currentSection] = []
        sections[currentSection].push({
          heading: currentSubsection || currentSection,
          content: currentContent.join('\n').trim()
        })
      }
      currentSection = h2Match[1]
      currentSubsection = ''
      currentContent = []
    } else if (h3Match) {
      if (currentSubsection && currentContent.length && sections[currentSection]) {
        sections[currentSection].push({
          heading: currentSubsection,
          content: currentContent.join('\n').trim()
        })
      }
      currentSubsection = h3Match[1]
      currentContent = []
    } else if (line.trim() && !line.startsWith('#') && !line.startsWith('---')) {
      currentContent.push(line)
    }
  }
  
  // Push last section
  if (currentSection && currentContent.length) {
    if (!sections[currentSection]) sections[currentSection] = []
    sections[currentSection].push({
      heading: currentSubsection || currentSection,
      content: currentContent.join('\n').trim()
    })
  }
  
  return sections
}

export async function HEAD(request: NextRequest, { params }: Params) {
  const { lang, date } = await params
  const report = await getReport(date, lang)
  
  if (!report) {
    return new NextResponse(null, { status: 404 })
  }
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    }
  })
}
