import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'
import { getAllReportDates, getReportMetadata, getReportSections } from '@/lib/reports'
import { Badge } from '@/components/Badge'
import { localizedMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return {
    ...localizedMetadata(lang, '/reports'),
    title: dictionary.reports.title,
    description: dictionary.reports.noReportsDesc,
  }
}

export default async function ReportsPage({ params }: Props) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  const dates = await getAllReportDates(lang)
  const t = dictionary.reports

  const formatDate = (date: string) => {
    const [year, month, day] = date.split('-').map(Number)
    return new Date(year, month - 1, day).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const categoryLabels: Record<string, string> = {
    clinical: 'Clinical Trials',
    breakthrough: 'Breakthroughs',
    lifestyle: 'Lifestyle',
    emerging: 'Emerging',
  }

  const reportData = await Promise.all(
    dates.map(async (date) => {
      const sections = await getReportSections(date, lang)
      const meta = await getReportMetadata(date, lang)
      if (!sections.length) return null
      const categoriesWithContent = sections.map(s => s.category).filter(c => categoryLabels[c])
      return { date, categoriesWithContent, preview: meta?.preview }
    })
  )
  const validReports = reportData.filter(Boolean)

  return (
    <div className="py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-10 max-w-5xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-pap-purple mb-4 flex items-center gap-2">
            <span className="inline-block h-px w-6 bg-pap-purple/60" />
            Daily Reports
          </p>
          <h1 className="mb-3 font-display text-[clamp(2rem,5vw,3rem)] font-normal leading-[1.1] tracking-tight text-pap-text">
            {t.title}
          </h1>
          <p className="text-sm text-pap-muted">
            {dates.length} {t.count}
          </p>
        </div>

        {dates.length === 0 ? (
          <div className="border border-pap-border rounded-2xl p-6 text-center py-16" style={{ padding: '3rem' }}>
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
              style={{ color: 'var(--pap-dim)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <h3 className="text-lg mb-2 font-display text-pap-text">
              {t.noReports}
            </h3>
            <p className="text-sm text-pap-muted">{t.noReportsDesc}</p>
          </div>
        ) : (
          <>
            <div className="max-w-5xl mb-6">
              <a
                href={`/${lang}/reports`}
                className="inline-flex items-center gap-2 rounded-full border border-pap-border px-5 py-2.5 text-sm text-pap-muted hover:text-pap-text hover:border-pap-border-hover transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                {dates.length} reports available
              </a>
            </div>
            <div className="max-w-5xl space-y-3">
              {validReports.map((report) => {
                if (!report) return null
                const { date, categoriesWithContent } = report

                return (
                  <div key={date}>
                    <Link
                      href={`/${lang}/report/${date}`}
                      className="border border-pap-border rounded-2xl p-5 block transition-all duration-200 hover:border-pap-purple/30 hover:shadow-md"
                    >
                      <div className="flex items-start sm:items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-display text-pap-text mb-1.5" style={{ fontSize: '1.0625rem' }}>
                            {formatDate(date)}
                          </p>
                          {report.preview && (
                            <p className="text-sm line-clamp-2 text-pap-muted">
                              {report.preview}
                            </p>
                          )}
                          <div className="flex gap-2 mt-2">
                            {categoriesWithContent.map((cat) => (
                              <Badge key={cat} label={categoryLabels[cat]} variant="outline" />
                            ))}
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          style={{ color: 'var(--pap-purple)' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}