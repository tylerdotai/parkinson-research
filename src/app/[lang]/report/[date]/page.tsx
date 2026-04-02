import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'
import { getReport, getAllReportDates } from '@/lib/reports'

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
  const dictionary = await getDictionary(lang)
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
  const report = await getReport(date, lang)

  if (!report) {
    notFound()
  }

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const t = dictionary.report

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Back link */}
      <Link
        href={`/${lang}/reports`}
        className="inline-flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-70"
        style={{ color: 'var(--color-amethyst)' }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        {t.backToAll}
      </Link>

      {/* Header */}
      <header className="mb-10">
        <h1
          className="mb-3"
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--color-charcoal)'
          }}
        >
          {report.title}
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{formatDate(date)}</p>
      </header>

      {/* Report content */}
      <article className="card mb-8" style={{ padding: '2.5rem' }}>
        <div className="report-content" />
        <div dangerouslySetInnerHTML={{ __html: report.html }} />
      </article>

      {/* Disclaimer — lavender tinted, not amber */}
      <div
        className="mb-8"
        style={{
          background: 'rgba(203, 183, 251, 0.08)',
          border: '1px solid rgba(203, 183, 251, 0.20)',
          borderRadius: '12px',
          padding: '1.375rem'
        }}
      >
        <h4
          className="font-medium mb-2 flex items-center gap-2"
          style={{ color: 'var(--color-amethyst)', fontSize: '0.9375rem' }}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          {dictionary.disclaimer.title}
        </h4>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {dictionary.disclaimer.text}
        </p>
      </div>

      {/* Navigation */}
      <div
        className="flex items-center justify-between pt-6"
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
  )
}
