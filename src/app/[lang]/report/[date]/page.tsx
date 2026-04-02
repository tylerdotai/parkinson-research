import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'
import { getReport, getReportSections, getAllReportDates } from '@/lib/reports'
import { ReportSection } from '@/components/report'

type Props = {
  params: Promise<{ lang: string; date: string }>
}

export async function generateStaticParams() {
  const locales = ['en', 'es']
  const params: { lang: string; date: string }[] = []
  for (const lang of locales) {
    const dates = await getAllReportDates(lang)
    for (const date of dates) {
      params.push({ lang, date })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, date } = await params
  const report = await getReport(date, lang)
  if (!report) return { title: 'Report Not Found' }
  return {
    title: report.title,
    description: report.preview,
    openGraph: {
      title: report.title,
      description: report.preview,
      url: `https://parkinson-research.vercel.app/${lang}/report/${date}`,
    },
  }
}

export default async function ReportPage({ params }: Props) {
  const { lang, date } = await params
  const dictionary = await getDictionary(lang)
  const [report, sections] = await Promise.all([
    getReport(date, lang),
    getReportSections(date, lang),
  ])

  if (!report) notFound()

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const t = dictionary.report

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Warm gradient hero */}
      <div
        style={{
          background: 'linear-gradient(160deg, #1b1938 0%, #2d2252 100%)',
          paddingTop: '4rem',
          paddingBottom: '3rem',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Back */}
          <Link
            href={`/${lang}/reports`}
            className="inline-flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-70"
            style={{ color: 'rgba(203, 183, 251, 0.80)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            All Reports
          </Link>

          {/* Header */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'rgba(203, 183, 251, 0.60)' }}
            >
              {formatDate(date)}
            </p>
            <h1
              style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: 'clamp(1.875rem, 5vw, 3rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'rgba(255,255,255,0.97)',
              }}
            >
              {report.title}
            </h1>
            <p
              className="text-sm mt-4"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              Daily research briefing • {sections.reduce((acc, s) => acc + s.entries.length, 0)} updates
            </p>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        {sections.length > 0 ? (
          sections.map((section, i) => (
            <ReportSection key={section.title} section={section} sectionIndex={i} />
          ))
        ) : (
          <div dangerouslySetInnerHTML={{ __html: report.html }} />
        )}

        {/* Disclaimer */}
        <div
          style={{
            marginTop: '3rem',
            padding: '1.25rem 1.5rem',
            borderRadius: '12px',
            background: 'rgba(203, 183, 251, 0.06)',
            border: '1px solid rgba(203, 183, 251, 0.15)',
          }}
        >
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            {dictionary.disclaimer.text}
          </p>
        </div>

        {/* Footer nav */}
        <div
          className="flex items-center justify-between pt-6 mt-8"
          style={{ borderTop: '1px solid var(--color-parchment)' }}
        >
          <Link
            href={`/${lang}/reports`}
            className="text-sm font-medium"
            style={{ color: 'var(--color-amethyst)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
          >
            {t.allReports}
          </Link>
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {t.generatedBy}
          </span>
        </div>
      </div>
    </div>
  )
}
