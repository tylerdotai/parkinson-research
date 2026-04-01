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
  const dates = await getAllReportDates()
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-slate-900 mb-2">{t.title}</h1>
        <p className="text-slate-500">{dates.length} {t.count}</p>
      </div>

      {dates.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-xl">
          <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <h3 className="text-lg font-semibold mb-2 text-slate-700">{t.noReports}</h3>
          <p className="text-slate-500">{t.noReportsDesc}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dates.map((date) => {
            const meta = getReportMetadata(date)
            
            return (
              <Link 
                key={date}
                href={`/${lang}/report/${date}`}
                className="card card-hover block"
              >
                <div className="flex items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">{formatDate(date)}</h3>
                    {meta?.preview && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-1">{meta.preview}</p>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* API Section */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <div className="bg-slate-50 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">{t.apiSection}</h3>
              <p className="text-slate-600 text-sm">{t.apiSectionDesc}</p>
            </div>
            <a 
              href={`/${lang}/api/reports`} 
              className="btn btn-secondary text-sm"
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
