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
    title: report.title,
    description: report.preview,
    openGraph: {
      title: report.title,
      description: report.preview,
      url: `https://parkinson-research.vercel.app/report/${date}`,
    },
  }
}

export default async function ReportPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params
  const report = await getReport(date)
  
  if (!report) {
    notFound()
  }

  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link 
        href="/reports" 
        className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 text-sm mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to all reports
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-slate-900 mb-2">{report.title}</h1>
        <p className="text-slate-500">{formattedDate}</p>
      </header>

      {/* Report content */}
      <article className="card mb-8">
        <div className="report-content">
          <div dangerouslySetInnerHTML={{ __html: report.html }} />
        </div>
      </article>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          Medical Disclaimer
        </h4>
        <p className="text-amber-700 text-sm">
          This report is for informational purposes only. The content is not intended to be a substitute for 
          professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or 
          other qualified health provider with any questions you may have regarding a medical condition.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-200">
        <Link href="/reports" className="text-blue-600 font-medium text-sm">
          All Reports
        </Link>
        <span className="text-xs text-slate-400">
          Generated autonomously by AI research agents
        </span>
      </div>
    </div>
  )
}
