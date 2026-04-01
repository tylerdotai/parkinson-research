import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'
import { getLatestReportSummary, getAllReportDates } from '@/lib/reports'
import ScrollReveal from '@/components/ScrollReveal'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  }
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  const dates = await getAllReportDates()
  const latestDate = dates[0]
  const summary = latestDate ? await getLatestReportSummary() : null

  const t = dictionary.home
  const tc = dictionary.categories

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Hero - Typographic, minimal */}
      <section className="py-16 md:py-24 text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-charcoal-50 border border-charcoal-100 mb-8">
            <span className="data-pulse">
              <span className="data-pulse-dot"></span>
            </span>
            <span className="text-xs font-medium text-charcoal-500 uppercase tracking-wider">
              {t.badge}
            </span>
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={100}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-charcoal-900 mb-6 max-w-3xl mx-auto" style={{ fontFamily: 'Instrument Serif, serif' }}>
            {t.headline}
            <span className="text-accent">.</span>
          </h1>
        </ScrollReveal>
        
        <ScrollReveal delay={200}>
          <p className="text-lg sm:text-xl text-charcoal-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t.subtitle}
          </p>
        </ScrollReveal>
        
        <ScrollReveal delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={`/${lang}/reports`} className="btn btn-primary btn-large w-full sm:w-auto">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Browse Reports
            </Link>
            <Link href={`/${lang}/resources`} className="btn btn-secondary btn-large w-full sm:w-auto">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716 6.273M12 21a9.004 9.004 0 01-8.716-6.273m0 0a8.997 8.997 0 01-2.312-.656M3 12a8.997 8.997 0 012.312-.656m0 0a8.997 8.997 0 012.312.656M12 12a8.997 8.997 0 012.312-.656m0 0a8.997 8.997 0 01-2.312.656" />
              </svg>
              Resources
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Latest Report - Bento Grid */}
      {summary ? (
        <section className="pb-16">
          <ScrollReveal>
            <div className="flex items-center justify-between mb-6">
              <span className="section-label">Latest Report</span>
              <span className="text-sm text-charcoal-400">
                {new Date(latestDate!).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </ScrollReveal>
          
          <div className="bento-grid reveal-stagger">
            {/* Main summary - large card */}
            <div className="bento-item-large bento-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-oxygen-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-oxygen-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-charcoal-800" style={{ fontFamily: 'Instrument Serif, serif' }}>
                    {summary.title}
                  </h3>
                  <p className="text-xs text-charcoal-400">{latestDate}</p>
                </div>
              </div>
              <div className="space-y-4">
                {summary.sections.slice(0, 3).map((section, i) => (
                  <div key={i} className="border-l-2 border-oxygen-200 pl-4">
                    <h4 className="text-sm font-medium text-charcoal-700 mb-1">{section.title}</h4>
                    <p className="text-sm text-charcoal-500 leading-relaxed line-clamp-2">{section.summary}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick actions - tall card */}
            <div className="bento-item-tall bento-card flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-medium text-charcoal-800 mb-4" style={{ fontFamily: 'Instrument Serif, serif' }}>
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link href={`/${lang}/report/${latestDate}`} className="flex items-center gap-3 p-3 rounded-lg bg-charcoal-50 hover:bg-charcoal-100 transition-colors">
                    <svg className="w-4 h-4 text-charcoal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                    <span className="text-sm text-charcoal-700">Read full report</span>
                  </Link>
                  <Link href={`/${lang}/resources`} className="flex items-center gap-3 p-3 rounded-lg bg-charcoal-50 hover:bg-charcoal-100 transition-colors">
                    <svg className="w-4 h-4 text-charcoal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716 6.273M12 21a9.004 9.004 0 01-8.716-6.273m0 0a8.997 8.997 0 01-2.312-.656M3 12a8.997 8.997 0 012.312-.656m0 0a8.997 8.997 0 012.312.656" />
                    </svg>
                    <span className="text-sm text-charcoal-700">Find resources</span>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-charcoal-400 mt-4 pt-4 border-t border-charcoal-100">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Updates daily at 7:00 AM CDT</span>
              </div>
            </div>
            
            {/* Categories - 4 small cards */}
            <CategoryBento 
              title={tc.clinicalTrials.title} 
              description={tc.clinicalTrials.desc}
              icon="flask"
              lang={lang}
            />
            <CategoryBento 
              title={tc.breakthroughs.title} 
              description={tc.breakthroughs.desc}
              icon="beaker"
              lang={lang}
            />
            <CategoryBento 
              title={tc.lifestyle.title} 
              description={tc.lifestyle.desc}
              icon="heart"
              lang={lang}
            />
            <CategoryBento 
              title={tc.emergingResearch.title} 
              description={tc.emergingResearch.desc}
              icon="sparkles"
              lang={lang}
            />
          </div>
        </section>
      ) : (
        <section className="pb-16">
          <div className="bento-card text-center py-16">
            <svg className="w-12 h-12 mx-auto text-charcoal-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <h3 className="text-lg text-charcoal-700 mb-2" style={{ fontFamily: 'Instrument Serif, serif' }}>{t.firstReportComing}</h3>
            <p className="text-sm text-charcoal-400">{t.firstReportDesc}</p>
          </div>
        </section>
      )}

      {/* AI Agent Integration - CTA */}
      <section className="pb-16">
        <ScrollReveal>
          <div className="bento-card bg-gradient-to-br from-charcoal-900 to-charcoal-800 text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-oxygen-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                  <span className="text-xs font-semibold uppercase tracking-wider text-oxygen-400">
                    For Developers
                  </span>
                </div>
                <h3 className="text-xl mb-2" style={{ fontFamily: 'Instrument Serif, serif' }}>
                  AI Agent Integration
                </h3>
                <p className="text-sm text-charcoal-300 max-w-md mb-4">
                  Set up your own AI agent to receive daily reports via cron job or webhook.
                </p>
                <code className="text-xs bg-charcoal-700 px-4 py-2 rounded-lg font-mono text-oxygen-300">
                  GET /{lang}/api/reports/latest
                </code>
              </div>
              <Link 
                href={`/${lang}/resources`} 
                className="btn bg-white text-charcoal-900 hover:bg-charcoal-100 flex-shrink-0"
              >
                Setup Guide
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}

function CategoryBento({ title, description, icon, lang }: { 
  title: string
  description: string
  icon: string
  lang: string
}) {
  const icons: Record<string, React.ReactNode> = {
    flask: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 8.625l-5.053 5.053a3.75 3.75 0 000 5.303l.97.97a3.75 3.75 0 005.303 0l5.053-5.053m4.5-4.5a3.75 3.75 0 00-5.303 0l-5.053 5.053m4.5 4.5l-5.053 5.053a3.75 3.75 0 000 5.303l.97.97a3.75 3.75 0 005.303 0l5.053-5.053" />
      </svg>
    ),
    beaker: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    heart: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    sparkles: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  }
  
  return (
    <ScrollReveal className="bento-card group cursor-pointer">
      <div className="text-accent mb-3 group-hover:scale-110 transition-transform duration-300">
        {icons[icon]}
      </div>
      <h3 className="font-medium text-charcoal-800 mb-1 text-sm" style={{ fontFamily: 'Instrument Serif, serif' }}>
        {title}
      </h3>
      <p className="text-xs text-charcoal-400 leading-relaxed">{description}</p>
    </ScrollReveal>
  )
}
