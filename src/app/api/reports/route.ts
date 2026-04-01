import { NextResponse } from 'next/server'
import { getAllReportDates, getReport } from '@/lib/reports'

export async function GET() {
  const dates = await getAllReportDates()
  
  const reports = await Promise.all(
    dates.map(async (date) => {
      const report = await getReport(date)
      if (!report) return null
      return {
        date,
        title: report.title,
        preview: report.preview,
        url: `https://parkinson-research.vercel.app/report/${date}`,
      }
    })
  )
  
  const filtered = reports.filter(Boolean)
  
  return NextResponse.json({
    count: filtered.length,
    reports: filtered,
    _meta: {
      source: 'Parkinson Research Daily',
      generated: new Date().toISOString(),
      nextUpdate: 'Daily at 7:00 AM CDT',
    }
  })
}
