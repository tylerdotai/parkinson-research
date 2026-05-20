import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'
import { getReport, getReportSections, getAllReportDates } from '@/lib/reports'
import ReportSection from '@/components/report/ReportSection'
import ReadingProgress from '@/components/report/ReadingProgress'
import styles from '@/components/report/ReportPage.module.css'

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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiagainstparkinson.com'
  return {
    title: report.title,
    description: report.preview,
    openGraph: {
      title: report.title,
      description: report.preview,
      url: `${siteUrl}/${lang}/report/${date}`,
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
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  const totalEntries = sections.reduce((acc, s) => acc + s.entries.length, 0)

  return (
    <>
      <ReadingProgress />

      <div style={{ background: 'var(--pap-void)', minHeight: '100vh' }}>
        <header
          style={{
            background: '#ffffff',
            borderBottom: '1px solid var(--pap-border)',
            paddingTop: '3.5rem',
            paddingBottom: '3rem',
          }}
        >
          <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 1.5rem' }}>
            <Link
              href={`/${lang}/reports`}
              className={styles['back-link']}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {dictionary.report.allReports}
            </Link>

            <h1
              className="font-display"
              style={{
                fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
                fontWeight: 400,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: 'var(--pap-text)',
                marginBottom: '1rem',
              }}
            >
              {report.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <p style={{ color: 'var(--pap-muted)', fontSize: '1rem' }}>
                {formatDate(date)}
              </p>
              <span style={{ color: 'var(--pap-border)', fontSize: '1rem' }}>•</span>
              <p style={{ color: 'var(--pap-muted)', fontSize: '1rem' }}>
                {sections.length} {sections.length === 1 ? 'section' : 'sections'}
              </p>
              <span style={{ color: 'var(--pap-border)', fontSize: '1rem' }}>•</span>
              <p style={{ color: 'var(--pap-muted)', fontSize: '1rem' }}>
                {totalEntries} {totalEntries === 1 ? 'finding' : 'findings'}
              </p>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem 4rem' }}>
          {sections.length > 0 ? (
            sections.map((section, i) => (
              <div key={section.title} style={{ marginBottom: i < sections.length - 1 ? '3rem' : 0 }}>
                <ReportSection section={section} sectionIndex={i} />
                {i < sections.length - 1 && (
                  <div
                    style={{
                      borderBottom: '1px solid var(--pap-border)',
                      marginTop: '3rem',
                    }}
                  />
                )}
              </div>
            ))
          ) : (
            <div dangerouslySetInnerHTML={{ __html: report.html }} />
          )}

          <div
            style={{
              marginTop: '3rem',
              padding: '1.25rem 1.5rem',
              borderRadius: '8px',
              background: 'var(--pap-surface)',
              border: '1px solid var(--pap-border)',
            }}
          >
            <p
              style={{
                fontSize: '0.875rem',
                lineHeight: 1.6,
                color: 'var(--pap-muted)',
                margin: 0,
              }}
            >
              {dictionary.disclaimer.text}
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--pap-border)',
            }}
          >
            <Link
              href={`/${lang}/reports`}
              className={styles['footer-link']}
            >
              ← {dictionary.report.allReports}
            </Link>
            <span
              style={{
                fontSize: '0.8125rem',
                color: 'var(--pap-dim)',
              }}
            >
              {dictionary.report.freeUpdatedDaily}
            </span>
          </div>
        </main>
      </div>
    </>
  )
}