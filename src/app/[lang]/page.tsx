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
      {/* ── Hero — warm editorial split layout ─────────────────────────── */}
      <section
        className="hero-gradient relative overflow-hidden"
        style={{ paddingTop: '4rem', paddingBottom: '4rem' }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT — Warm lifestyle photo */}
            <ScrollReveal>
              <div className="relative">
                <div
                  className="relative overflow-hidden"
                  style={{
                    borderRadius: '24px',
                    aspectRatio: '4/3',
                    boxShadow: '0 8px 40px rgba(44,40,37,0.16)',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=900&q=80&auto=format&fit=crop"
                    alt="A person reading in warm natural light — representing families staying informed"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  {/* Warm overlay gradient */}
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, rgba(250,248,245,0) 60%, rgba(250,248,245,0.3) 100%)' }}
                  />
                </div>
                {/* Trust badge */}
                <div
                  className="absolute -bottom-4 -right-4 flex items-center gap-2 px-4 py-2.5 rounded-full"
                  style={{
                    background: 'var(--color-white)',
                    boxShadow: '0 4px 16px rgba(44,40,37,0.12)',
                    border: '1px solid var(--color-parchment)',
                  }}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ background: 'var(--color-amber)', animation: 'pulse-amber 2.5s ease-in-out infinite' }}
                  />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-charcoal)' }}>
                    Daily · 7:00 AM CDT
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* RIGHT — Content */}
            <div className="flex flex-col justify-center text-left">
              <ScrollReveal delay={80}>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 mb-6">
                  <span
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: 'rgba(196,127,60,0.12)',
                      color: 'var(--color-amber-dark)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--color-amber)' }}
                    />
                    Daily Research · Parkinson&apos;s
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={160}>
                <h1
                  className="mb-6"
                  style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                    lineHeight: 1.05,
                    fontWeight: 400,
                    letterSpacing: '-0.025em',
                    color: 'var(--color-espresso)',
                  }}
                >
                  {t.headline}
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={240}>
                <p
                  className="mb-4"
                  style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                    lineHeight: 1.4,
                    color: 'var(--color-amber)',
                    fontStyle: 'italic',
                  }}
                >
                  Every morning, I search so you don&apos;t have to.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={320}>
                <p
                  className="mb-10 leading-relaxed"
                  style={{
                    fontSize: '1.0625rem',
                    color: 'var(--color-text-secondary)',
                    maxWidth: '480px',
                  }}
                >
                  Built for families navigating Parkinson&apos;s — by one of them. Daily breakthroughs, trials, and evidence-based guidance, written for people, not researchers.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={400}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {latestDate ? (
                    <Link
                      href={`/${lang}/report/${latestDate}`}
                      className="btn-primary"
                    >
                      See Today&apos;s Report
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  ) : (
                    <Link
                      href={`/${lang}/reports`}
                      className="btn-primary"
                    >
                      Browse Reports
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  )}
                  <Link
                    href={`/${lang}/about`}
                    className="btn-ghost"
                    style={{ fontSize: '0.9375rem' }}
                  >
                    Our Story
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission — 3-column amber band ─────────────────────────────── */}
      <section
        style={{ background: 'var(--color-amber-light)', borderTop: '1px solid rgba(196,127,60,0.15)', borderBottom: '1px solid rgba(196,127,60,0.15)' }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Why */}
            <ScrollReveal className="flex flex-col items-start">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(196,127,60,0.15)' }}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amber)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3
                className="mb-3"
                style={{ fontFamily: 'Instrument Serif, serif', fontSize: '1.375rem', fontWeight: 400, color: 'var(--color-espresso)' }}
              >
                Built for Families
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                When a parent is diagnosed, families become researchers overnight. We turn the chaos of medical information into clarity — every day.
              </p>
            </ScrollReveal>

            {/* How */}
            <ScrollReveal delay={100} className="flex flex-col items-start">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(196,127,60,0.15)' }}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amber)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h3
                className="mb-3"
                style={{ fontFamily: 'Instrument Serif, serif', fontSize: '1.375rem', fontWeight: 400, color: 'var(--color-espresso)' }}
              >
                AI-Powered, Human-Reviewed
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                Every morning, autonomous agents search ClinicalTrials.gov, NEJM, Lancet, and emerging science — then we translate it into plain language.
              </p>
            </ScrollReveal>

            {/* What */}
            <ScrollReveal delay={200} className="flex flex-col items-start">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(196,127,60,0.15)' }}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amber)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3
                className="mb-3"
                style={{ fontFamily: 'Instrument Serif, serif', fontSize: '1.375rem', fontWeight: 400, color: 'var(--color-espresso)' }}
              >
                What Matters Now
              </h3>
              <p className="leading-relaxed" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                Clinical trials recruiting near you. FDA decisions. Lifestyle interventions backed by evidence. Emerging science before it hits the mainstream.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Personal Story — full-width warm band ────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(180deg, #FAF8F5 0%, #F0E9DF 100%)',
          borderTop: '1px solid var(--color-parchment)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Photo — larger, warmer presentation */}
            <ScrollReveal>
              <div
                className="relative overflow-hidden"
                style={{ borderRadius: '20px', aspectRatio: '3/2' }}
              >
                <img
                  src="/images/founder-hockey.png"
                  alt="Tyler and his father, Fort Worth Panthers — a family navigating Parkinson's together"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 20%' }}
                  loading="lazy"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, rgba(196,127,60,0.05) 0%, transparent 60%)' }}
                />
              </div>
            </ScrollReveal>

            {/* Quote */}
            <ScrollReveal delay={120}>
              <div>
                <span
                  className="inline-block mb-6"
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--color-amber)',
                  }}
                >
                  From the Founder
                </span>
                <blockquote
                  className="mb-8"
                  style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)',
                    lineHeight: 1.55,
                    color: 'var(--color-espresso)',
                    fontStyle: 'italic',
                  }}
                >
                  &ldquo;{t.testimonial}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(196,127,60,0.12)' }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amber)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-charcoal)' }}>
                      Tyler Delano
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      Creator, AI Against Parkinson&apos;s
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Latest Report ─────────────────────────────────────────────── */}
      {summary ? (
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                <div>
                  <span className="section-label mb-3 block">Today&apos;s Report</span>
                  <h2
                    style={{
                      fontFamily: 'Instrument Serif, serif',
                      fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                      fontWeight: 400,
                      color: 'var(--color-espresso)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {summary.title}
                  </h2>
                  <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
                    {new Date(latestDate!).toLocaleDateString(
                      lang === 'es' ? 'es-ES' : 'en-US',
                      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </p>
                </div>
                <Link
                  href={`/${lang}/report/${latestDate}`}
                  className="btn-ghost flex-shrink-0"
                >
                  Read full report
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </ScrollReveal>

            {/* Report sections preview */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {summary.sections.map((section, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <div
                    className="card p-6"
                    style={{ borderTop: '3px solid var(--color-amber)' }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="pill-clinical">
                        {section.title}
                      </span>
                    </div>
                    <p className="leading-relaxed" style={{ color: 'var(--color-text)', fontSize: '0.9375rem' }}>
                      {section.summary}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Categories row */}
            <ScrollReveal>
              <div className="flex flex-wrap gap-2.5 items-center">
                <span className="text-xs font-semibold mr-1" style={{ color: 'var(--color-text-muted)' }}>Also tracked:</span>
                <span className="pill-clinical">Clinical Trials</span>
                <span className="pill-breakthrough">Breakthroughs</span>
                <span className="pill-lifestyle">Lifestyle</span>
                <span className="pill-emerging">Emerging Research</span>
                <span className="pill-tech">Tech</span>
              </div>
            </ScrollReveal>
          </div>
        </section>
      ) : (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="card text-center py-16">
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>First report coming soon.</p>
            </div>
          </div>
        </section>
      )}

      {/* ── Subscribe ─────────────────────────────────────────────────── */}
      <section
        className="py-16"
        style={{ background: 'var(--color-cream)', borderTop: '1px solid var(--color-parchment)' }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div
              className="card mx-auto"
              style={{
                maxWidth: '680px',
                borderTop: '4px solid var(--color-amber)',
                borderRadius: '20px',
                padding: '3rem',
                textAlign: 'center',
              }}
            >
              <h2
                className="mb-3"
                style={{
                  fontFamily: 'Instrument Serif, serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 400,
                  color: 'var(--color-espresso)',
                }}
              >
                Stay ahead of Parkinson&apos;s research
              </h2>
              <p
                className="mb-8"
                style={{ color: 'var(--color-text-secondary)', fontSize: '1rem' }}
              >
                Free. Daily. Written for families, not researchers.
              </p>
              <SubscribeForm lang={lang} dictionary={dictionary.subscribe} />
              <p className="mt-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                No spam. Unsubscribe anytime. Powered by daily AI research.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
