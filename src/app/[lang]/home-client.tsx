"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Nav } from '@/components/nav'
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
  const reducedMotion = useReducedMotion()
  const animationProps = reducedMotion ? { initial: false } : fade
  const staggerProps = (index: number) => reducedMotion ? { initial: false } : stagger(index)

  return (
    <>
      <Nav />
      <main id="main-content">
        {/* ── Dark anchor strip ──────────────────────────────────────── */}
        <section className="bg-[#0f0f0f] text-white">
          <div className="mx-auto max-w-7xl px-5 md:px-8 py-4">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-pap-purple" />
                <span className="text-white/70">44 reports published</span>
              </div>
              <div className="h-4 w-px bg-white/20 hidden md:block" />
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-pap-lavender" />
                <span className="text-white/70">400+ trials tracked</span>
              </div>
              <div className="h-4 w-px bg-white/20 hidden md:block" />
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-[#22c55e]" />
                <span className="text-white/70">Updated daily at 7:00 AM CDT</span>
              </div>
            </div>
          </div>
        </section>

        {/* Hero */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 lg:py-24">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              {/* LEFT — Text */}
              <div className="lg:col-span-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-pap-purple mb-6 flex items-center gap-2">
                  <span className="inline-block h-px w-6 bg-pap-purple/60" />
                  Daily Parkinson's Research
                </p>

                <h1 className="font-display text-[44px] sm:text-6xl lg:text-[56px] xl:text-[68px] leading-[0.98] tracking-tight text-pap-text">
                  AI Against<br />
                  Parkinson's
                </h1>

                <p className="mt-6 text-base sm:text-lg text-pap-muted leading-relaxed max-w-lg">
                  Every morning, autonomous agents search ClinicalTrials.gov, NEJM, and emerging science — then we translate the findings into plain language for families.
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <a
                    href={`/${locale}/reports`}
                    className="inline-flex items-center gap-2 rounded-full bg-pap-purple px-6 py-3.5 text-sm font-medium text-white hover:bg-pap-purple/90 transition-colors"
                  >
                    See Today's Report
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                  <a
                    href={`/${locale}/about`}
                    className="inline-flex items-center gap-1.5 text-sm text-pap-muted hover:text-pap-text transition-colors group"
                  >
                    About this project
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </a>
                </div>

                {/* Source attribution */}
                <p className="mt-8 text-xs text-pap-dim">
                  Sources: ClinicalTrials.gov · NEJM · Lancet Neurology · Michael J. Fox Foundation
                </p>
              </div>

              {/* RIGHT — Image */}
              <div className="lg:col-span-5">
                <div
                  className="relative overflow-hidden rounded-2xl"
                  style={{
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <Image
                    src="/images/founder-hockey.png"
                    alt="Founder — Tyler Delano"
                    width={600}
                    height={400}
                    priority
                    className="w-full object-cover"
                    style={{ aspectRatio: '3/2' }}
                  />
                </div>
                <p className="mt-3 text-xs text-pap-dim text-right">
                  Tyler Delano · Springtown, TX
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* From Today's Report */}
        {latestReport && (
          <section className="bg-[#f8f8f8] border-t border-pap-border">
            <div className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-pap-purple block mb-1">From Today's Report</span>
                  <h2 className="font-display text-2xl text-pap-text">
                    {(() => {
                      const [year, month, day] = latestReport.date.split('-').map(Number)
                      return new Date(year, month - 1, day).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    })()}
                  </h2>
                </div>
                <Link
                  href={`/${locale}/report/${latestReport.date}`}
                  className="inline-flex items-center gap-2 text-sm text-pap-purple font-medium hover:gap-3 transition-all"
                >
                  Full report
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Finding 1 */}
                <div className="bg-white rounded-2xl p-6 border border-pap-border">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="rounded-full px-3 py-1 text-xs font-medium bg-pap-purple/10 text-pap-purple border border-pap-purple/20">Clinical Trial</span>
                  </div>
                  <h3 className="font-display text-base text-pap-text mb-2 leading-snug">Phase 2 Tests D-Serine for Disease Modification</h3>
                  <p className="text-sm text-pap-muted leading-relaxed">A 100-person trial is testing whether D-serine can change disease severity scores — a brain-signaling approach with early safety data supporting a larger test.</p>
                  <p className="mt-3 text-xs text-pap-dim">Source: ClinicalTrials.gov · NCT07312110</p>
                </div>

                {/* Finding 2 */}
                <div className="bg-white rounded-2xl p-6 border border-pap-border">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="rounded-full px-3 py-1 text-xs font-medium bg-pap-purple/10 text-pap-purple border border-pap-purple/20">Breakthrough</span>
                  </div>
                  <h3 className="font-display text-base text-pap-text mb-2 leading-snug">DBS Shows Long-Term Benefits in 79,845-Patient Study</h3>
                  <p className="text-sm text-pap-muted leading-relaxed">Deep brain stimulation was linked with lower risks of facility placement and mortality over several years — the largest observational study of DBS outcomes to date.</p>
                  <p className="mt-3 text-xs text-pap-dim">Source: NPJ Parkinson's Disease</p>
                </div>

                {/* Finding 3 */}
                <div className="bg-white rounded-2xl p-6 border border-pap-border">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="rounded-full px-3 py-1 text-xs font-medium bg-pap-lavender/30 text-[#714cb6] border border-pap-lavender/40">Lifestyle</span>
                  </div>
                  <h3 className="font-display text-base text-pap-text mb-2 leading-snug">Tai Chi Shows Clear Benefits in 15-Trial Meta-Analysis</h3>
                  <p className="text-sm text-pap-muted leading-relaxed">Traditional Chinese exercise was associated with better cognition, sleep quality, and quality of life. Programs of 180+ minutes per week showed the strongest effects.</p>
                  <p className="mt-3 text-xs text-pap-dim">Source: Frontiers in Psychology</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Why this matters */}
        <section className="border-t border-pap-border">
          <div className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-20">
            <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  ),
                  title: 'Built for Families',
                  body: 'When a parent is diagnosed, families become researchers overnight. We turn the chaos of medical information into clarity — every day.',
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  ),
                  title: 'AI-Powered, Human-Reviewed',
                  body: 'Autonomous agents search ClinicalTrials.gov, NEJM, and emerging science. Every finding is sourced and reviewed before publication.',
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  ),
                  title: 'What Matters Now',
                  body: 'Clinical trials recruiting near you. FDA decisions. Lifestyle interventions backed by evidence. Emerging science before it hits the mainstream.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  {...staggerProps(i)}
                  className="flex flex-col items-start"
                >
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

        {/* From the Founder — human touch */}
        <section className="border-t border-pap-border">
          <div className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Photo */}
              <div>
                <div className="relative overflow-hidden rounded-2xl" style={{ boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)' }}>
                  <Image
                    src="/images/founder-hockey.png"
                    alt="Tyler Delano — AI Against Parkinson's"
                    width={500}
                    height={333}
                    className="w-full object-cover"
                  />
                </div>
              </div>

              {/* Quote & context */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-pap-purple block mb-4">From the founder</span>
                <blockquote className="font-display text-xl md:text-2xl text-pap-text leading-snug mb-6">
                  "When my dad was diagnosed with Parkinson's, I wanted a way to keep up with all the latest breakthroughs without searching through dozens of medical websites. So I built this."
                </blockquote>
                <p className="text-pap-muted leading-relaxed mb-6">
                  Every morning, autonomous agents search ClinicalTrials.gov, NEJM, Lancet Neurology, and emerging science — then I review and translate the findings into plain language. No jargon. No paywall. Just the research that matters, in a format families can actually use.
                </p>
                <a
                  href={`/${locale}/about`}
                  className="inline-flex items-center gap-2 text-sm text-pap-purple font-medium hover:gap-3 transition-all"
                >
                  Read the full story
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function withLocale(path: string, locale: string): string {
  return `/${locale}${path.startsWith('/') ? path : '/' + path}`
}