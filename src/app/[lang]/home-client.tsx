"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Nav } from '@/components/nav'
import { Badge } from '@/components/Badge'
import { type Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/dictionary'

/* ── Scroll animation preset ─────────────────────────────────────────────── */
const ease = [0.25, 0.1, 0.25, 1] as const

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease },
}

function stagger(i: number) {
  return { ...fade, transition: { duration: 0.7, ease, delay: i * 0.08 } }
}

interface HomeClientProps {
  locale: Locale
  dictionary: Dictionary
  latestReport?: { date: string; preview: string } | null
}

export function HomeClient({ locale, dictionary, latestReport }: HomeClientProps) {
  const t = dictionary.home
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <Nav />
      <main id="main-content">
        {/* Hero */}
        <section className="relative min-h-[75vh] flex items-center">
          {/* Background gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #f8f8ff 0%, #f0f0ff 50%, #faf8ff 100%)',
            }}
          />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(#714cb6 1px, transparent 1px), linear-gradient(90deg, #714cb6 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />

          <div className="relative mx-auto max-w-7xl px-5 md:px-8 py-24 lg:py-32">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* LEFT — Text */}
              <div className="lg:col-span-6">
                <motion.p
                  {...fade}
                  className="font-mono text-[11px] uppercase tracking-[0.22em] text-pap-purple mb-6 flex items-center gap-2"
                >
                  <span className="inline-block h-px w-6 bg-pap-purple/60" />
                  {t.heroBadge}
                </motion.p>

                <motion.h1
                  {...stagger(1)}
                  className="font-display text-[44px] sm:text-6xl lg:text-[68px] xl:text-[80px] leading-[0.98] tracking-tight text-pap-text"
                >
                  {t.headline}
                </motion.h1>

                <motion.p
                  {...stagger(2)}
                  className="mt-7 text-base sm:text-lg text-pap-muted leading-relaxed max-w-lg"
                >
                  {t.heroSubtitle}
                </motion.p>

                <motion.div
                  {...stagger(3)}
                  className="mt-8 flex items-center gap-4"
                >
                  <a
                    href={`/${locale}/reports`}
                    className="inline-flex items-center gap-2 rounded-full bg-pap-purple px-6 py-3.5 text-sm font-medium text-white hover:bg-pap-purple/90 transition-colors"
                  >
                    {t.heroCTA}
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                  <a
                    href={`/${locale}/about`}
                    className="inline-flex items-center gap-1.5 text-sm text-pap-muted hover:text-pap-text transition-colors group"
                  >
                    {t.ourStory}
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </a>
                </motion.div>

                <motion.div
                  {...stagger(4)}
                  className="mt-10 flex items-center gap-3 text-sm text-pap-dim"
                >
                  <span className="inline-block h-2 w-2 rounded-full bg-pap-purple" />
                  <span>Daily at 7:00 AM CDT</span>
                </motion.div>
              </div>

              {/* RIGHT — Image */}
              <motion.div
                {...fade}
                transition={{ duration: 1, ease }}
                className="lg:col-span-6 relative"
              >
                {/* Category badges — moved above image */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Clinical Trials', 'Breakthroughs', 'Lifestyle', 'Emerging'].map((cat) => (
                    <Badge key={cat} label={cat} variant="outline" />
                  ))}
                </div>

                <div
                  className="relative overflow-hidden rounded-2xl aspect-[4/3]"
                  style={{
                    boxShadow: '0 8px 40px rgba(113, 76, 182, 0.12)',
                  }}
                >
                  <Image
                    src="/images/founder-hockey.png"
                    alt="A person reading in warm natural light — representing families staying informed"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(248,248,255,0) 60%, rgba(248,248,255,0.4) 100%)',
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Latest Report Preview */}
        {latestReport && (
          <section className="border-t border-pap-border px-5 md:px-8 py-12">
            <div className="mx-auto max-w-6xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-pap-purple">Latest Report</span>
                <span className="h-px flex-1 bg-pap-border max-w-[60px]" />
              </div>
              <Link
                href={`/${locale}/report/${latestReport.date}`}
                className="group flex items-start sm:items-center justify-between gap-6 border border-pap-border rounded-2xl p-6 hover:border-pap-purple/30 hover:shadow-md transition-all duration-200"
                style={{ background: 'var(--pap-surface)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg text-pap-text mb-1">
                    {(() => {
                      const [year, month, day] = latestReport.date.split('-').map(Number)
                      return new Date(year, month - 1, day).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    })()}
                  </p>
                  <p className="text-sm text-pap-muted line-clamp-2">{latestReport.preview}</p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-1.5 text-sm text-pap-purple font-medium group-hover:gap-2.5 transition-all">
                    Read report
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Mission */}
        <section className="border-t border-pap-border px-5 md:px-8 py-20 md:py-28 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  ),
                  title: t.missionBuiltForFamiliesTitle,
                  body: t.missionBuiltForFamiliesDesc,
                  featured: true,
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  ),
                  title: t.missionAIPoweredTitle,
                  body: t.missionAIPoweredDesc,
                  featured: false,
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  ),
                  title: t.missionWhatMattersNowTitle,
                  body: t.missionWhatMattersNowDesc,
                  featured: false,
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  {...stagger(i)}
                  className={`flex flex-col items-start ${item.featured ? 'md:col-span-1 relative' : ''}`}
                >
                  {item.featured && (
                    <span className="absolute -top-1 right-0 font-mono text-[9px] uppercase tracking-widest text-pap-lavender bg-pap-purple/10 px-2 py-0.5 rounded-full">
                      Core mission
                    </span>
                  )}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: 'var(--pap-purple-soft)' }}
                  >
                    <span style={{ color: 'var(--pap-purple)' }}>{item.icon}</span>
                  </div>
                  <h3 className="font-display text-[1.375rem] text-pap-text mb-3">{item.title}</h3>
                  <p className="leading-relaxed text-pap-muted">{item.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-pap-border px-5 md:px-8 py-20 md:py-28 lg:py-32">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12 text-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-pap-purple block mb-3">FAQ</span>
              <h2 className="font-display text-3xl sm:text-4xl text-pap-text">{dictionary.faq.title}</h2>
            </div>
            <div className="divide-y divide-pap-border">
              {dictionary.faq.items.map((item, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                  >
                    <span className="font-display text-base text-pap-text group-hover:text-pap-purple transition-colors">
                      {item.q}
                    </span>
                    <span className="flex-shrink-0 text-pap-purple">
                      {openIndex === i ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </span>
                  </button>
                  {openIndex === i && (
                    <div className="pb-5 text-sm text-pap-muted leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Subscribe CTA — with trust signal */}
        <section
          className="px-5 md:px-8 py-20"
          style={{ background: 'var(--pap-surface)' }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <motion.h2 {...stagger(0)} className="font-display text-3xl sm:text-4xl text-pap-text mb-4">
              {t.stayAhead}
            </motion.h2>
            <motion.p {...stagger(1)} className="text-pap-muted mb-8">
              {t.subscribeTagline}
            </motion.p>
            <motion.div {...stagger(2)}>
              <a
                href={withLocale('/subscribe', locale)}
                className="inline-flex items-center gap-2 rounded-full bg-pap-purple px-8 py-4 text-base font-medium text-white hover:bg-pap-purple/90 transition-colors"
              >
                Subscribe — Free Forever
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </motion.div>
            <motion.p {...stagger(3)} className="mt-4 text-sm text-pap-dim">
              {t.subscribeDisclaimer}
            </motion.p>
            {/* Trust signal — founder attribution */}
            <motion.div {...stagger(4)} className="mt-8 flex items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-pap-purple/10 flex items-center justify-center">
                <span className="text-pap-purple text-xs font-display">T</span>
              </div>
              <p className="text-xs text-pap-muted text-left">
                Built by a caregiver, for families like yours.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  )
}

function withLocale(path: string, locale: string): string {
  return `/${locale}${path.startsWith('/') ? path : '/' + path}`
}