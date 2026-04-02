import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return {
    title: dictionary.about.title,
    description: dictionary.metadata.description,
  }
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  const t = dictionary.about

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
            marginBottom: '0.5rem'
          }}
        >
          {t.title}
        </h1>
      </header>

      <div className="space-y-6">
        {/* Research Agent */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-5 flex items-center gap-3"
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
            {t.researchAgent}
          </h2>
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-text-secondary)' }}>
            {t.researchAgentDesc}
          </p>
          <ul className="space-y-2">
            {t.searchTargets.map((target, i) => (
              <li
                key={i}
                className="text-sm flex items-start gap-2"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <span style={{ color: 'var(--color-amethyst)' }}>—</span>
                {target}
              </li>
            ))}
          </ul>
        </section>

        {/* What's Tracked */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-5 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
            </span>
            {t.whatsTracked}
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div
              className="rounded-xl p-4"
              style={{ background: 'var(--color-surface-muted)' }}
            >
              <h3 className="font-medium text-sm mb-1.5" style={{ color: 'var(--color-charcoal)' }}>
                {t.clinicalTrials.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {t.clinicalTrials.desc}
              </p>
            </div>
            <div
              className="rounded-xl p-4"
              style={{ background: 'var(--color-surface-muted)' }}
            >
              <h3 className="font-medium text-sm mb-1.5" style={{ color: 'var(--color-charcoal)' }}>
                {t.breakthroughs.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {t.breakthroughs.desc}
              </p>
            </div>
            <div
              className="rounded-xl p-4"
              style={{ background: 'var(--color-surface-muted)' }}
            >
              <h3 className="font-medium text-sm mb-1.5" style={{ color: 'var(--color-charcoal)' }}>
                {t.lifestyle.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {t.lifestyle.desc}
              </p>
            </div>
            <div
              className="rounded-xl p-4"
              style={{ background: 'var(--color-surface-muted)' }}
            >
              <h3 className="font-medium text-sm mb-1.5" style={{ color: 'var(--color-charcoal)' }}>
                {t.emerging.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {t.emerging.desc}
              </p>
            </div>
          </div>
        </section>

        {/* Privacy & Safety */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-5 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </span>
            {t.privacy}
          </h2>
          <ul className="space-y-2.5">
            {t.privacyItems.map((item, i) => (
              <li
                key={i}
                className="text-sm flex items-start gap-2.5"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <span style={{ color: 'var(--color-amethyst)' }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* API Access */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-5 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
            </span>
            {t.apiAccess}
          </h2>
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-text-secondary)' }}>
            {t.apiAccessDesc}
          </p>
          <div
            className="rounded-xl p-5 font-mono text-sm"
            style={{ background: 'var(--color-mysteria)' }}
          >
            <code style={{ color: 'rgba(255,255,255,0.75)' }}>
              GET <span style={{ color: '#86efac' }}>/{lang}/api/reports</span>
              <br />
              GET <span style={{ color: '#86efac' }}>/{lang}/api/reports/[date]</span>
            </code>
          </div>
        </section>

        {/* The Founder */}
        <section
          className="card"
          style={{
            padding: '2rem',
            background: 'linear-gradient(135deg, #1b1938 0%, #2d2252 100%)',
            border: '1px solid rgba(203, 183, 251, 0.15)'
          }}
        >
          <h2
            className="text-base font-semibold mb-5 flex items-center gap-3"
            style={{ color: 'rgba(255,255,255,0.95)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.12)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-lavender)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </span>
            The Founder
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
            I built this for my dad after he was diagnosed with Parkinson's. After spending hours searching clinical trials, treatment research, and care resources — I realized there wasn't a single place that aggregated all of it, updated daily, and was written for patients instead of researchers.
          </p>
          <p className="text-sm leading-relaxed mt-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
            So I built one. Every morning, AI research agents search clinical trials, medical journals, and emerging science — so you don't have to.
          </p>
          <p className="text-xs mt-5" style={{ color: 'rgba(255,255,255,0.40)' }}>
            — Tyler Delano, Creator
          </p>
        </section>

        {/* Disclaimer */}
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
            {t.disclaimer}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {t.disclaimerText}
          </p>
          <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--color-text-secondary)' }}>
            {t.disclaimerText2}
          </p>
        </section>
      </div>
    </div>
  )
}
