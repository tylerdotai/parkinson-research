import Link from 'next/link'
import { getAllReportDates, getReportMetadata } from '@/lib/reports'

export const metadata = {
  title: 'All Reports | Parkinson Research Daily',
  description: 'Archive of all daily Parkinson\'s research reports.',
}

export default async function ReportsPage() {
  const dates = await getAllReportDates()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">All Reports</h1>
        <p className="text-gray-600">{dates.length} reports available</p>
      </div>

      {dates.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">No Reports Yet</h3>
          <p className="text-gray-600">Reports will appear here once the research agent runs.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dates.map((date) => {
            const meta = getReportMetadata(date)
            return (
              <Link 
                key={date}
                href={`/report/${date}`}
                className="block report-card hover:border-primary/30"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    {meta?.preview && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {meta.preview}
                      </p>
                    )}
                  </div>
                  <span className="text-primary">→</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
