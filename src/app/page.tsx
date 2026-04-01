import Link from 'next/link'
import { getLatestReport, getAllReportDates } from '@/lib/reports'

export default async function Home() {
  const dates = await getAllReportDates()
  const latestDate = dates[0]
  const latestReport = latestDate ? await getLatestReport() : null

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
          <span>🤖</span>
          <span>Autonomous AI Research</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Daily Parkinson's<br />
          <span className="text-primary">Research Reports</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Every morning, AI agents search clinical trials, medical journals, and research databases 
          to bring you the latest breakthroughs, trials, and evidence-based tips.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link 
            href="/reports"
            className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Browse All Reports
          </Link>
          <Link 
            href="/about"
            className="text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Latest Report Preview */}
      {latestReport ? (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-header">Latest Report</h2>
            <span className="text-sm text-gray-500">
              {new Date(latestDate!).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <div className="report-card">
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: latestReport.html }} />
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
              <Link 
                href={`/report/${latestDate}`}
                className="text-primary font-medium hover:underline"
              >
                Read full report →
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>📅 Daily at 7:00 AM CDT</span>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="mb-16 text-center py-16 bg-gray-50 rounded-2xl">
          <div className="text-4xl mb-4">🔬</div>
          <h3 className="text-xl font-semibold mb-2">First Report Coming Soon</h3>
          <p className="text-gray-600">
            The research agent will publish its first report soon. Check back tomorrow morning.
          </p>
        </section>
      )}

      {/* Categories */}
      <section className="mb-16">
        <h2 className="section-header mb-6">What's Tracked</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="report-card text-center">
            <div className="text-3xl mb-3">🧪</div>
            <h3 className="font-semibold mb-2">Clinical Trials</h3>
            <p className="text-sm text-gray-600">Active recruiting trials, Phase 2/3 results, eligibility criteria</p>
          </div>
          <div className="report-card text-center">
            <div className="text-3xl mb-3">💊</div>
            <h3 className="font-semibold mb-2">Breakthroughs</h3>
            <p className="text-sm text-gray-600">FDA approvals, drug mechanisms, clinical evidence</p>
          </div>
          <div className="report-card text-center">
            <div className="text-3xl mb-3">🏃</div>
            <h3 className="font-semibold mb-2">Lifestyle</h3>
            <p className="text-sm text-gray-600">Exercise protocols, diet plans, sleep optimization</p>
          </div>
          <div className="report-card text-center">
            <div className="text-3xl mb-3">🔬</div>
            <h3 className="font-semibold mb-2">Emerging Research</h3>
            <p className="text-sm text-gray-600">Preprints, novel targets, biomarkers, diagnostics</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Stay Informed
        </h2>
        <p className="text-white/80 mb-6 max-w-lg mx-auto">
          Get daily reports delivered. No spam, just research.
        </p>
        <Link 
          href="/about#subscribe"
          className="inline-block bg-white text-primary px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-colors"
        >
          Get Notified
        </Link>
      </section>
    </div>
  )
}
