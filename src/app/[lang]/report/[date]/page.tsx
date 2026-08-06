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
      type: 'article',
      title: report.title,
      description: report.preview,
      url: `${siteUrl}/${lang}/report/${date}`,
      locale: lang === 'es' ? 'es_ES' : 'en_US',
      images: [{ url: '/parkinson-og.jpg', width: 1200, height: 630, alt: "AI Against Parkinson's" }],
    },
    twitter: { card: 'summary_large_image', images: ['/parkinson-og.jpg'] },
    alternates: {
      canonical: `${siteUrl}/${lang}/report/${date}`,
      languages: {
        en: `${siteUrl}/en/report/${date}`,
        es: `${siteUrl}/es/report/${date}`,
        'x-default': `${siteUrl}/en/report/${date}`,
      },
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

  const formatDate = (d: string) => {
    const [year, month, day] = d.split('-').map(Number)
    return new Date(year, month - 1, day).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const totalEntries = sections.reduce((acc, s) => acc + s.entries.length, 0)
  const familyLens: Record<string, string> = lang === 'es' ? {
    clinical: 'Personas: estudios que todavía prueban seguridad o beneficio; aparecer en un ensayo no significa que un tratamiento funcione.',
    breakthrough: 'Tratamientos: señales que van desde estudios en personas hasta trabajo de laboratorio; la etapa cambia lo que se puede concluir.',
    lifestyle: 'Vida diaria: estudios sobre ejercicio, sueño, nutrición y rehabilitación; los resultados no sustituyen un plan clínico personal.',
    emerging: 'Investigación emergente: pistas sobre causas, biomarcadores y diagnósticos futuros; todavía necesitan validación.',
  } : {
    clinical: 'For people: studies still testing safety or benefit; appearing in a trial does not mean a treatment works.',
    breakthrough: 'Treatments: signals ranging from human studies to lab work; the stage changes what can be concluded.',
    lifestyle: 'Daily life: studies of exercise, sleep, nutrition, and rehabilitation; results do not replace a personal care plan.',
    emerging: 'Emerging research: clues about causes, biomarkers, and future diagnostics; these still need validation.',
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiagainstparkinson.com'
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: report.title,
    description: report.preview,
    datePublished: date,
    dateModified: date,
    inLanguage: lang,
    mainEntityOfPage: `${siteUrl}/${lang}/report/${date}`,
    image: `${siteUrl}/parkinson-og.jpg`,
    author: { '@type': 'Organization', name: "AI Against Parkinson's", url: siteUrl },
    publisher: { '@type': 'Organization', name: "AI Against Parkinson's", logo: { '@type': 'ImageObject', url: `${siteUrl}/images/logo.png` } },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
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
            {report.archiveWarning && (
              <div role="note" style={{ marginTop: '1.5rem', padding: '1rem 1.1rem', borderRadius: '0.75rem', background: '#fff8e8', border: '1px solid #ead8a4', color: '#6d571e', fontSize: '0.9rem', lineHeight: 1.55 }}>
                {lang === 'es' ? 'Nota del archivo: este informe contiene material de redacción antiguo que no se verificó con un registro de investigación actual. Úsalo solo como archivo; no para decisiones médicas.' : report.archiveWarning}
              </div>
            )}
          </div>
        </header>

        <main style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem 4rem' }}>
          {sections.length > 0 && (
            <aside aria-label={lang === 'es' ? 'Cómo leer este informe' : 'How to read this report'} style={{ marginBottom: '2.5rem', padding: '1.25rem 1.5rem', borderRadius: '0.75rem', background: 'var(--pap-surface)', border: '1px solid var(--pap-border)' }}>
              <p style={{ margin: '0 0 0.65rem', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--pap-muted)' }}>{lang === 'es' ? 'Cómo leerlo' : 'How to read it'}</p>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--pap-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {Array.from(new Set(sections.map((section) => section.category))).map((category) => <li key={category}>{familyLens[category]}</li>)}
              </ul>
            </aside>
          )}
          {sections.length > 0 ? (
            sections.map((section, i) => (
              <div key={section.title} style={{ marginBottom: i < sections.length - 1 ? '3rem' : 0 }}>
                <ReportSection key={section.category} section={section} sectionIndex={i} lang={lang as 'en' | 'es'} />
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
          ) : report.archiveWarning ? (
            <div role="status" style={{ padding: '1.5rem', borderRadius: '0.75rem', background: 'var(--pap-surface)', border: '1px solid var(--pap-border)', color: 'var(--pap-muted)', lineHeight: 1.6 }}>
              {lang === 'es' ? 'El contenido de este informe archivado no se muestra porque no contiene un registro de investigación verificable.' : 'The content of this archived report is not shown because it does not contain a verifiable research record.'}
            </div>
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