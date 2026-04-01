import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getReport, getAllReportDates } from '@/lib/reports'

export async function generateStaticParams() {
  const dates = await getAllReportDates()
  return dates.map((date) => ({ date }))
}

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params
  const report = await getReport(date)
  if (!report) return { title: 'Report Not Found' }
  
  return {
    title: `${report.title} | Parkinson Research Daily`,
    description: report.preview,
  }
}

export default async function ReportPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params
  const report = await getReport(date)
  
  if (!report) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/reports" className="text-sm text-gray-500 hover:text-primary mb-4 inline-block">
          ← Back to all reports
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">{report.title}</h1>
        <p className="text-gray-500">
          {new Date(date).toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <article className="report-card">
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: report.html }} />
        </div>
      </article>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <p className="font-medium mb-1">⚠️ Medical Disclaimer</p>
        <p className="text-amber-700">
          This report is for informational purposes only. The content is not intended 
          to be a substitute for professional medical advice, diagnosis, or treatment. 
          Always seek the advice of your physician or other qualified health provider 
          with any questions you may have regarding a medical condition.
        </p>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-between">
        <Link href="/reports" className="text-primary hover:underline">
          ← All Reports
        </Link>
        <span className="text-xs text-gray-400">
          Generated autonomously by AI research agents
        </span>
      </div>
    </div>
  )
}
