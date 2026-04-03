import Link from 'next/link'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'
import { getLatestReportSummary, getAllReportDates } from '@/lib/reports'
import ScrollReveal from '@/components/ScrollReveal'
import SubscribeForm from '@/components/SubscribeForm'

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
  const dates = await getAllReportDates(lang)
  const latestDate = dates[0]
  const summary = latestDate ? await getLatestReportSummary(lang) : null

  const t = dictionary.home
  const tc = dictionary.categories

  return (
    <div>
      {/* ── Hero — full-bleed deep purple ─────────────────────────────── */}
      <section
        className="hero-gradient relative overflow-hidden"
        style={{ paddingTop: '7rem', paddingBottom: '7rem' }}
      >
        {/* Restraint orbs */}
        <div
          className="gradient-orb"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(203, 183, 251, 0.25) 0%, transparent 70%)',
            top: '-200px',
            left: '-150px',
            animation: 'float-slow 22s ease-in-out infinite',
          }}
        />
        <div
          className="gradient-orb"
          style={{
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(113, 76, 182, 0.25) 0%, transparent 70%)',
            bottom: '-100px',
            right: '0',
            animation: 'float-slow 16s ease-in-out infinite reverse',
          }}
        />

        {/* Content — centered, constrained */}
        <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-6 text-center">
          <ScrollReveal>
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10"
              style={{
                background: 'rgba(203, 183, 251, 0.08)',
                border: '1px solid rgba(203, 183, 251, 0.18)',
              }}
            >
              <span className="data-pulse">
                <span className="data-pulse-dot" />
              </span>
              <span
                className="text-[11px] font-semibold uppercase tracking-widest"
                style={{ color: 'var(--color-lavender)' }}
              >
                {t.badge}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1
              className="mb-8"
              style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                lineHeight: 1.0,
                fontWeight: 400,
                letterSpacing: '-0.035em',
                color: 'rgba(255,255,255,0.97)',
              }}
            >
              {t.headline}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p
              className="text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              {t.whoItFor}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={320}>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.70)' }}
            >
              {t.subtitle}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/${lang}/reports`}
                className="btn-primary"
                style={{ fontSize: '0.9375rem', padding: '0.875rem 2.25rem' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
                Browse Reports
              </Link>
              <Link
                href={`/${lang}/resources`}
                className="text-sm font-medium"
                style={{ color: 'rgba(255,255,255,0.60)', textDecoration: 'underline', textUnderlineOffset: '4px' }}
              >
                Find Resources
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Content — white canvas ────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Subscribe Form */}
        <section className="py-14">
          <ScrollReveal>
            <SubscribeForm lang={lang} dictionary={dictionary.subscribe} />
          </ScrollReveal>
        </section>

        {/* Why Subscribe */}
        <section className="pb-16">
          <ScrollReveal>
            <div
              className="card text-center"
              style={{ padding: '2.5rem 2rem' }}
            >
              <h2
                className="mb-4"
                style={{
                  fontFamily: 'Instrument Serif, serif',
                  fontSize: '1.875rem',
                  fontWeight: 400,
                  color: 'var(--color-charcoal)',
                  letterSpacing: '-0.01em',
                }}
              >
                {t.whySubscribe}
              </h2>
              <p
                className="text-base max-w-xl mx-auto leading-relaxed"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {t.whySubscribeDesc}
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Latest Report */}
        {summary ? (
          <section className="pb-20">
            <ScrollReveal>
              <div className="flex items-center justify-between mb-6">
                <span className="section-label">{t.latestReport}</span>
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {new Date(latestDate!).toLocaleDateString(
                    lang === 'es' ? 'es-ES' : 'en-US',
                    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={80}>
              <div className="bento-grid">
                {/* Main card */}
                <div className="bento-item-large card" style={{ padding: '1.75rem' }}>
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(203, 183, 251, 0.10)' }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        style={{ color: 'var(--color-amethyst)' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <div>
                      <h3
                        className="font-medium text-base"
                        style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--color-charcoal)' }}
                      >
                        {summary.title}
                      </h3>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{latestDate}</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {summary.sections.slice(0, 3).map((section, i) => (
                      <div key={i} className="border-l-2 pl-4" style={{ borderColor: 'rgba(203, 183, 251, 0.35)' }}>
                        <h4 className="text-sm font-medium mb-1" style={{ color: 'var(--color-charcoal)' }}>
                          {section.title}
                        </h4>
                        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                          {section.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="bento-item-tall card flex flex-col justify-between" style={{ padding: '1.5rem' }}>
                  <div>
                    <h3
                      className="text-sm font-medium mb-5"
                      style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--color-charcoal)' }}
                    >
                      {t.quickActions}
                    </h3>
                    <div className="space-y-2.5">
                      <Link
                        href={`/${lang}/report/${latestDate}`}
                        className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                        style={{ background: 'var(--color-surface-muted)' }}
                      >
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          style={{ color: 'var(--color-amethyst)' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                        <span className="text-sm" style={{ color: 'var(--color-charcoal)' }}>{t.readFullReport}</span>
                      </Link>
                      <Link
                        href={`/${lang}/resources`}
                        className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                        style={{ background: 'var(--color-surface-muted)' }}
                      >
                        <svg
                          className="w-4 h-4 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          style={{ color: 'var(--color-amethyst)' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716 6.273M12 21a9.004 9.004 0 01-8.716-6.273m0 0a8.997 8.997 0 01-2.312-.656M3 12a8.997 8.997 0 012.312-.656" />
                        </svg>
                        <span className="text-sm" style={{ color: 'var(--color-charcoal)' }}>{t.findResources}</span>
                      </Link>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2 text-xs mt-5 pt-5"
                    style={{ color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-parchment)' }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{t.dailyAt}</span>
                  </div>
                </div>

                {/* Category cards */}
                <CategoryCard title={tc.clinicalTrials.title} description={tc.clinicalTrials.desc} icon="flask" />
                <CategoryCard title={tc.breakthroughs.title} description={tc.breakthroughs.desc} icon="beaker" />
                <CategoryCard title={tc.lifestyle.title} description={tc.lifestyle.desc} icon="heart" />
                <CategoryCard title={tc.emergingResearch.title} description={tc.emergingResearch.desc} icon="sparkles" />
              </div>
            </ScrollReveal>
          </section>
        ) : (
          <section className="pb-20">
            <div className="card text-center py-16" style={{ padding: '3rem' }}>
              <svg
                className="w-12 h-12 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
                style={{ color: 'var(--color-border)' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <h3 className="text-lg mb-2" style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--color-charcoal)' }}>
                {t.firstReportComing}
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{t.firstReportDesc}</p>
            </div>
          </section>
        )}

        {/* What's Tracked */}
        <section className="pb-16">
          <ScrollReveal>
            <div className="card" style={{ padding: '2rem' }}>
              <h3
                className="text-sm font-medium mb-5"
                style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--color-charcoal)' }}
              >
                {t.whatsTracked}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                <span className="pill-clinical">Clinical Trials</span>
                <span className="pill-breakthrough">Breakthroughs</span>
                <span className="pill-lifestyle">Lifestyle</span>
                <span className="pill-emerging">Emerging Research</span>
                <span className="pill-tech">Tech Tools</span>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Testimonial */}
        <section className="pb-20">
          <ScrollReveal>
            <div
              style={{
                background: 'linear-gradient(160deg, #1b1938 0%, #2d2252 100%)',
                borderRadius: '20px',
                padding: '2.5rem 2.5rem',
              }}
            >
              <p
                className="mb-6"
                style={{
                  fontFamily: 'Instrument Serif, Georgia, serif',
                  fontSize: '1.25rem',
                  lineHeight: 1.55,
                  color: 'rgba(255,255,255,0.90)',
                  fontStyle: 'italic',
                }}
              >
                "{t.testimonial}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(203, 183, 251, 0.15)' }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    style={{ color: 'rgba(203, 183, 251, 0.80)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: 'rgba(255,255,255,0.80)' }}
                  >
                    Tyler Delano
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {t.testimonialLabel}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </div>
  )
}

function CategoryCard({ title, description, icon }: {
  title: string
  description: string
  icon: string
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
    <ScrollReveal className="card group cursor-pointer" style={{ padding: '1.5rem' }}>
      <div className="mb-4" style={{ color: 'var(--color-amethyst)' }}>
        {icons[icon]}
      </div>
      <h3
        className="font-medium mb-2 text-sm"
        style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--color-charcoal)' }}
      >
        {title}
      </h3>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
        {description}
      </p>
    </ScrollReveal>
  )
}
