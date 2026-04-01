import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'
import { getLatestReport, getAllReportDates } from '@/lib/reports'
import { getLocaleFromParams } from '@/lib/dictionary'

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
  const latestReport = latestDate ? await getLatestReport() : null

  const t = dictionary.home
  const tc = dictionary.categories

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Hero */}
      <section className="py-12 md:py-16 text-center">
        <div className="badge badge-blue mb-6">
          <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
          </svg>
          {t.badge}
        </div>
        
        <h1 className="text-slate-900 mb-4">
          {t.headline}<br />
          <span className="text-blue-600">{t.headlineAccent}</span>
        </h1>
        
        <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-8 px-4">
          {t.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href={`/${lang}/reports`} className="btn btn-primary w-full sm:w-auto">
            {t.browseReports}
          </Link>
          <Link href={`/${lang}/about`} className="btn btn-secondary w-full sm:w-auto">
            {t.learnMore}
          </Link>
        </div>
      </section>

      {/* Latest Report */}
      {latestReport ? (
        <section className="pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-slate-900">{t.latestReport}</h2>
            <span className="text-slate-500 text-sm">
              {new Date(latestDate!).toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          
          <article className="card">
            <div className="report-content text-sm">
              <div dangerouslySetInnerHTML={{ __html: latestReport.html }} />
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Link 
                href={`/${lang}/report/${latestDate}`}
                className="text-blue-600 font-medium text-sm flex items-center gap-1"
              >
                {t.readFullReport}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <div className="text-slate-500 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t.dailyAt}
              </div>
            </div>
          </article>
        </section>
      ) : (
        <section className="pb-12 text-center py-16 bg-slate-50 rounded-xl">
          <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <h3 className="text-lg font-semibold mb-2 text-slate-700">{t.firstReportComing}</h3>
          <p className="text-slate-500">{t.firstReportDesc}</p>
        </section>
      )}

      {/* Categories */}
      <section className="pb-12">
        <h2 className="text-slate-900 mb-6">{t.whatsTracked}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CategoryCard title={tc.clinicalTrials.title} description={tc.clinicalTrials.desc} icon="flask" />
          <CategoryCard title={tc.breakthroughs.title} description={tc.breakthroughs.desc} icon="beaker" />
          <CategoryCard title={tc.lifestyle.title} description={tc.lifestyle.desc} icon="heart" />
          <CategoryCard title={tc.emergingResearch.title} description={tc.emergingResearch.desc} icon="sparkles" />
        </div>
      </section>

      {/* API CTA */}
      <section className="pb-12">
        <div className="bg-blue-50 rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{t.apiAccess}</h3>
              <p className="text-slate-600 text-sm">{t.apiDescription}</p>
            </div>
            <a 
              href={`/${lang}/api/reports`} 
              className="btn btn-primary text-sm"
              target="_blank"
              rel="noopener"
            >
              {t.viewApi}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

function CategoryCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    flask: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 8.625l-5.053 5.053a3.75 3.75 0 000 5.303l.97.97a3.75 3.75 0 005.303 0l5.053-5.053m4.5-4.5a3.75 3.75 0 00-5.303 0l-5.053 5.053m4.5 4.5l-5.053 5.053a3.75 3.75 0 000 5.303l.97.97a3.75 3.75 0 005.303 0l5.053-5.053" />
      </svg>
    ),
    beaker: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    heart: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    sparkles: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  }
  
  return (
    <div className="card card-hover">
      <div className="text-blue-600 mb-3">
        {icons[icon]}
      </div>
      <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  )
}
