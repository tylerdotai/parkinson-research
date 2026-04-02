import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'
import { getAllReportDates, getReportMetadata } from '@/lib/reports'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return {
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
    return new Date(date).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <div className="mb-10">
        <h1
          className="mb-3"
          style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--color-charcoal)' }}
        >
          {t.title}
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {dates.length} {t.count}
        </p>
      </div>

      {dates.length === 0 ? (
        <div className="card text-center py-16" style={{ padding: '3rem' }}>
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
            style={{ color: 'var(--color-border)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <h3
            className="text-lg mb-2"
            style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--color-charcoal)' }}
          >
            {t.noReports}
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{t.noReportsDesc}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dates.map((date) => {
            const meta = getReportMetadata(date, lang)

            return (
              <Link
                key={date}
                href={`/${lang}/report/${date}`}
                className="card card-lift block"
                style={{ padding: '1.375rem 1.5rem' }}
              >
                <div className="flex items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-medium truncate"
                      style={{ color: 'var(--color-charcoal)', fontFamily: 'Instrument Serif, serif', fontSize: '1.0625rem' }}
                    >
                      {formatDate(date)}
                    </h3>
                    {meta?.preview && (
                      <p className="text-sm mt-1 line-clamp-1" style={{ color: 'var(--color-text-secondary)' }}>
                        {meta.preview}
                      </p>
                    )}
                  </div>
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    style={{ color: 'var(--color-amethyst)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* API Section */}
      <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--color-parchment)' }}>
        <div className="card" style={{ padding: '1.75rem' }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3
                className="font-semibold mb-1"
                style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--color-charcoal)' }}
              >
                {t.apiSection}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{t.apiSectionDesc}</p>
            </div>
            <a
              href={`/${lang}/api/reports`}
              className="btn-secondary text-sm"
              target="_blank"
              rel="noopener"
            >
              {dictionary.home.viewApi}
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
