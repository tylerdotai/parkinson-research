import { NextRequest, NextResponse } from 'next/server'
import { getAllReportDates, getReport } from '@/lib/reports'
import { getDictionary } from '@/lib/dictionary'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params
  const { searchParams } = new URL(request.url)
  const dates = await getAllReportDates(lang)
  const dictionary = await getDictionary(lang)
  
  // Check if requesting latest specifically
  const isLatest = searchParams.get('latest') === 'true' || searchParams.get('date') === 'latest'
  
  if (isLatest && dates.length > 0) {
    const latestReport = await getReport(dates[0], lang)
    if (latestReport) {
      return NextResponse.json({
        date: latestReport.date,
        title: latestReport.title,
        content: latestReport.content,
        sections: parseSections(latestReport.content),
        url: `https://parkinson-research.vercel.app/${lang}/report/${dates[0]}`,
        _meta: {
          source: dictionary.metadata.title,
          generated: new Date().toISOString(),
          nextUpdate: 'Daily at 7:00 AM CDT',
          language: lang,
          agentNote: 'Set up a cron job to poll this endpoint daily for new reports.',
        }
      })
    }
  }
  
  const reports = await Promise.all(
    dates.map(async (date) => {
      const report = await getReport(date, lang)
      if (!report) return null
      return {
        date,
        title: report.title,
        preview: report.preview,
        url: `https://parkinson-research.vercel.app/${lang}/report/${date}`,
      }
    })
  )
  
  const filtered = reports.filter(Boolean)
  
  return NextResponse.json({
    count: filtered.length,
    reports: filtered,
    _meta: {
      source: dictionary.metadata.title,
      generated: new Date().toISOString(),
      nextUpdate: 'Daily at 7:00 AM CDT',
      language: lang,
      endpoints: {
        latest: `/${lang}/api/reports?latest=true`,
        byDate: `/${lang}/api/reports/YYYY-MM-DD`,
      },
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
  
  if (currentSection && currentContent.length) {
    if (!sections[currentSection]) sections[currentSection] = []
    sections[currentSection].push({
      heading: currentSubsection || currentSection,
      content: currentContent.join('\n').trim()
    })
  }
  
  return sections
}
