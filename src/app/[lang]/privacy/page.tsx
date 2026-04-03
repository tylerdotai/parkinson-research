import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return {
    title: dictionary.privacy.pageTitle,
    description: dictionary.privacy.metaDesc,
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  const t = dictionary.privacy

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

        {/* What We Collect */}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </span>
            {t.whatWeCollect}
          </h2>
          <ul className="space-y-2.5">
            {t.collectItems.map((item, i) => (
              <li key={i} className="text-sm flex items-start gap-2.5" style={{ color: 'var(--color-text-secondary)' }}>
                <span style={{ color: 'var(--color-amethyst)' }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* How We Use It */}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </span>
            {t.howWeUse}
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

        {/* What We Don't Do */}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </span>
            {t.whatWeDontDo}
          </h2>
          <ul className="space-y-2.5">
            {t.noItems.map((item, i) => (
              <li key={i} className="text-sm flex items-start gap-2.5" style={{ color: 'var(--color-text-secondary)' }}>
                <span style={{ color: 'var(--color-amethyst)' }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Data Storage & Security */}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </span>
            {t.dataStorage}
          </h2>
          <ul className="space-y-2.5">
            {t.storageItems.map((item, i) => (
              <li key={i} className="text-sm flex items-start gap-2.5" style={{ color: 'var(--color-text-secondary)' }}>
                <span style={{ color: 'var(--color-amethyst)' }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Your Rights */}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </span>
            {t.yourRights}
          </h2>
          <ul className="space-y-2.5">
            {t.rightsItems.map((item, i) => (
              <li key={i} className="text-sm flex items-start gap-2.5" style={{ color: 'var(--color-text-secondary)' }}>
                <span style={{ color: 'var(--color-amethyst)' }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Cookies */}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12c0-1.3 1.1-2.4 2.4-2.4h.15c.3 0 .6.06.9.17.37.14.66.38.82.7.17.32.22.68.15 1.03.2.14.32.34.37.56.05.22.02.45-.08.65-.1.2-.27.35-.47.43-.2.08-.43.1-.65.06-.22-.04-.43-.15-.58-.31a.938.938 0 00-.47-.22 1.044 1.044 0 00-.55.03c-.31.1-.58.28-.78.53-.2.25-.35.55-.43.88-.08.33-.06.67.05.99.11.32.32.6.59.82.27.22.61.37.97.43.36.06.73.05 1.08-.03.28-.07.54-.18.78-.33.19-.12.36-.26.52-.42a2.5 2.5 0 01-.33 1.03c-.13.22-.31.4-.52.54-.21.14-.45.23-.7.27-.25.04-.51.02-.75-.06-.24-.08-.46-.22-.64-.41-.18-.19-.31-.43-.37-.69-.06-.26-.04-.53.06-.78.1-.25.27-.46.49-.61.15-.1.32-.16.5-.19a1.2 1.2 0 01.55.03c.18.08.33.21.44.37.11.16.17.35.17.55 0 .2-.06.39-.17.55-.11.16-.26.29-.44.37a1.2 1.2 0 01-.55.03c-.18-.03-.35-.09-.5-.19-.22-.15-.39-.36-.49-.61-.1-.25-.12-.52-.06-.78.06-.26.19-.5.37-.69.18-.19.4-.33.64-.41.24-.08.5-.1.75-.06.25.04.49.13.7.27.21.14.39.32.52.54.13.22.23.46.33 1.03" />
              </svg>
            </span>
            {t.cookies}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {t.cookiesText}
          </p>
        </section>

        {/* Third Parties */}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
              </svg>
            </span>
            {t.thirdParties}
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            {t.thirdPartiesText}
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {t.thirdPartyItems.map((item, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: 'var(--color-surface-muted)' }}>
                <h3 className="font-medium text-sm mb-1" style={{ color: 'var(--color-charcoal)' }}>{item.name}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{item.purpose}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </span>
            {t.contactTitle}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {t.contactText}
          </p>
          <p className="text-sm mt-3" style={{ color: 'var(--color-text-secondary)' }}>
            <strong style={{ color: 'var(--color-charcoal)' }}>GitHub Issues:</strong>{' '}
            <a
              href="https://github.com/tylerdotai/parkinson-research/issues"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-amethyst)' }}
            >
              github.com/tylerdotai/parkinson-research/issues
            </a>
          </p>
        </section>

        {/* Changes to Policy */}
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
            {t.policyChanges}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            {t.policyChangesText}
          </p>
        </section>
      </div>
    </div>
  )
}
