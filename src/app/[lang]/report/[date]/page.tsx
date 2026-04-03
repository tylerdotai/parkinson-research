import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'
import { getReport, getReportSections, getAllReportDates } from '@/lib/reports'
import ReportSection from '@/components/report/ReportSection'

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

  const totalEntries = sections.reduce((acc, s) => acc + s.entries.length, 0)

  return (
    <div style={{ background: '#faf9f7', minHeight: '100vh' }}>
      {/* Header */}
      <header
        style={{
          background: 'linear-gradient(160deg, #1b1938 0%, #2d2252 100%)',
          paddingTop: '3.5rem',
          paddingBottom: '3rem',
        }}
      >
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 1.5rem' }}>
          {/* Back */}
          <Link
            href={`/${lang}/reports`}
            className="inline-flex items-center gap-2 text-base mb-8 transition-opacity hover:opacity-70"
            style={{
              color: 'rgba(203, 183, 251, 0.80)',
              minHeight: '48px',
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '1rem',
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {dictionary.report.allReports}
          </Link>

          <h1
            style={{
              fontFamily: 'Instrument Serif, Georgia, serif',
              fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: 'rgba(255,255,255,0.97)',
              marginBottom: '1rem',
            }}
          >
            {report.title}
          </h1>

          <p
            className="text-base"
            style={{ color: 'rgba(255,255,255,0.50)' }}
          >
            {formatDate(date)} • {totalEntries} {dictionary.report.updatesForFamilies}
          </p>
        </div>
      </header>

      {/* Content */}
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
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
            padding: '1.5rem 1.75rem',
            borderRadius: '12px',
            background: 'rgba(203, 183, 251, 0.06)',
            border: '1px solid rgba(203, 183, 251, 0.15)',
          }}
        >
          <p
            className="text-base leading-relaxed"
            style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}
          >
            {dictionary.disclaimer.text}
          </p>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-6 mt-8"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <Link
            href={`/${lang}/reports`}
            className="text-base font-medium"
            style={{
              color: 'var(--color-amethyst)',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              minHeight: '48px',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            ← {dictionary.report.allReports}
          </Link>
          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {dictionary.report.freeUpdatedDaily}
          </span>
        </div>
      </main>
    </div>
  )
}
