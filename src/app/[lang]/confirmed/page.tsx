import { getDictionary } from '@/lib/dictionary'
import Link from 'next/link'

type Props = {
  params: Promise<{ lang: string }>
}

export default async function ConfirmedPage({ params }: Props) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-md w-full">
        <div className="card text-center py-12 px-8">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-3" style={{ fontFamily: 'Instrument Serif, serif' }}>
            {dictionary.confirmed.title}
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            {dictionary.confirmed.description}
          </p>
          <div className="space-y-3">
            <Link
              href={`/${lang}/reports`}
              className="btn btn-primary w-full justify-center"
            >
              {dictionary.confirmed.viewReport}
            </Link>
            <Link
              href={`/${lang}`}
              className="btn btn-secondary w-full justify-center"
            >
              {dictionary.confirmed.backHome}
            </Link>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">
          {dictionary.confirmed.noSpam}
        </p>
      </div>
    </div>
  )
}
