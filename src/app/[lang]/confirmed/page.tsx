import { getDictionary } from '@/lib/dictionary'
import Link from 'next/link'

type Props = {
  params: Promise<{ lang: string }>
}

export default async function ConfirmedPage({ params }: Props) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="max-w-md w-full">
        <div className="card text-center" style={{ padding: '3rem 2rem' }}>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(203, 183, 251, 0.10)' }}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              style={{ color: 'var(--color-amethyst)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1
            className="mb-3"
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '1.875rem',
              fontWeight: 400,
              color: 'var(--color-charcoal)'
            }}
          >
            {dictionary.confirmed.title}
          </h1>
          <p
            className="mb-8 leading-relaxed"
            style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}
          >
            {dictionary.confirmed.description}
          </p>
          <div className="space-y-3">
            <Link
              href={`/${lang}/reports`}
              className="btn-primary w-full justify-center"
              style={{ display: 'flex', padding: '0.75rem 1.5rem' }}
            >
              {dictionary.confirmed.viewReport}
            </Link>
            <Link
              href={`/${lang}`}
              className="btn-secondary w-full justify-center"
              style={{ display: 'flex', padding: '0.75rem 1.5rem' }}
            >
              {dictionary.confirmed.backHome}
            </Link>
          </div>
        </div>
        <p
          className="text-center text-xs mt-6"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {dictionary.confirmed.noSpam}
        </p>
      </div>
    </div>
  )
}
