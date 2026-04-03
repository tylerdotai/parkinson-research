import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return {
    title: dictionary.terms.pageTitle,
    description: dictionary.terms.metaDesc,
  }
}

export default async function TermsPage({ params }: Props) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  const t = dictionary.terms

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
      <header className="mb-10">
        <h1
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--color-charcoal)',
            marginBottom: '0.5rem',
          }}
        >
          {t.pageTitle}
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {t.lastUpdated}: {new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <div className="space-y-8">
        {/* Introduction */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {t.intro}
          </p>
        </section>

        {/* No Medical Advice */}
        <section
          className="card"
          style={{
            padding: '1.75rem',
            background: 'linear-gradient(135deg, #1b1938 0%, #2d2252 100%)',
            border: '1px solid rgba(203, 183, 251, 0.15)',
          }}
        >
          <h2
            className="text-base font-semibold mb-4 flex items-center gap-3"
            style={{ color: 'rgba(255,255,255,0.95)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.12)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-lavender)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </span>
            {t.noMedicalAdvice}
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {t.noMedicalAdviceText}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {t.noMedicalAdviceText2}
          </p>
        </section>

        {/* Informational Purposes Only */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-4 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </span>
            {t.informationalOnly}
          </h2>
          <ul className="space-y-2.5">
            {t.infoItems.map((item, i) => (
              <li key={i} className="text-sm flex items-start gap-2.5" style={{ color: 'var(--color-text-secondary)' }}>
                <span style={{ color: 'var(--color-amethyst)' }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Service Description */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-4 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 8.646m-5.5 0l3 3m0 0l2.148 2.148A12.061 12.061 0 008.5 15.354m6.5-6.5l3 3" />
              </svg>
            </span>
            {t.serviceDescription}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {t.serviceDescText}
          </p>
        </section>

        {/* Acceptable Use */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-4 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </span>
            {t.acceptableUse}
          </h2>
          <ul className="space-y-2.5">
            {t.useItems.map((item, i) => (
              <li key={i} className="text-sm flex items-start gap-2.5" style={{ color: 'var(--color-text-secondary)' }}>
                <span style={{ color: 'var(--color-amethyst)' }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-4 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716 6.825M12 21a9.004 9.004 0 01-8.716-6.824M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </span>
            {t.intellectualProperty}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {t.ipText}
          </p>
          <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--color-text-secondary)' }}>
            {t.ipText2}
          </p>
        </section>

        {/* No Warranty */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-4 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0h-2.25m0 0v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v4.964m12-4.006v3.384m0 0h.01m-12 0a48.667 48.667 0 012.813-2.55m0 0c1.668-1.35 3.915-1.35 5.583 0m5.583 0a48.655 48.655 0 00-5.583 0" />
              </svg>
            </span>
            {t.noWarranty}
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            {t.noWarrantyText}
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {t.noWarrantyText2}
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-4 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </span>
            {t.limitationLiability}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {t.liabilityText}
          </p>
        </section>

        {/* Third-Party Content */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-4 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </span>
            {t.thirdPartyContent}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {t.thirdPartyText}
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-4 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </span>
            {t.termsChanges}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {t.termsChangesText}
          </p>
        </section>

        {/* Governing Law */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-4 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.825M12 21a9.004 9.004 0 01-8.716-6.825M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </span>
            {t.governingLaw}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {t.governingLawText}
          </p>
        </section>
      </div>
    </div>
  )
}
