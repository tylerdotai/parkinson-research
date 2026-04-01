import { NextResponse } from 'next/server'
import { getAllReportDates, getReport } from '@/lib/reports'
import { getDictionary } from '@/lib/dictionary'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params
  const dates = await getAllReportDates()
  const dictionary = await getDictionary(lang)
  
  const reports = await Promise.all(
    dates.map(async (date) => {
      const report = await getReport(date)
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
    }
  })
}
