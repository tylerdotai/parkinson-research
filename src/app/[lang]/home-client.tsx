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

        {/* ── Top stat band ────────────────────────────────────────────── */}
        <div
          className="pt-[72px]" // nav height offset — remove if nav is fixed
        >
          <div className="bg-[#faf8ff] border-b border-pap-border">
            <div className="mx-auto max-w-7xl px-5 md:px-8 py-3">
              <div className="flex flex-wrap items-center justify-center gap-5 md:gap-10 text-xs text-pap-muted">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-pap-purple" />
                  44 reports published
                </span>
                <span className="hidden md:inline text-pap-border">·</span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-pap-lavender" />
                  400+ trials tracked
                </span>
                <span className="hidden md:inline text-pap-border">·</span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                  Updated daily at 7:00 AM CDT
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="bg-[#faf8ff]">
          <div className="mx-auto max-w-7xl px-5 md:px-8 py-14 lg:py-20">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">

              {/* LEFT */}
              <div className="lg:col-span-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-pap-purple mb-5 flex items-center gap-2">
                  <span className="inline-block h-px w-5 bg-pap-purple/50" />
                  Daily Parkinson's Research
                </p>

                <h1 className="font-display text-[42px] sm:text-5xl lg:text-[60px] xl:text-[72px] leading-[0.97] tracking-tight text-pap-text">
                  Every breakthrough,<br />
                  <em className="not-italic text-pap-purple">every morning.</em>
                </h1>

                <p className="mt-6 text-base text-pap-muted leading-relaxed max-w-sm">
                  Autonomous agents search ClinicalTrials.gov, NEJM, and emerging science — then we translate every finding into plain language. Updated every day at 7 AM CDT.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={`/${locale}/reports`}
                    className="inline-flex items-center gap-2 rounded-full bg-pap-purple px-6 py-3.5 text-sm font-medium text-white hover:bg-pap-purple/90 transition-colors"
                  >
                    Read Today's Report
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                  <a
                    href={`/${locale}/about`}
                    className="inline-flex items-center gap-1.5 text-sm text-pap-muted hover:text-pap-text transition-colors"
                  >
                    About this project →
                  </a>
                </div>
              </div>

              {/* RIGHT — report preview */}
              <div className="lg:col-span-6">
                {latestReport && (
                  <div className="rounded-2xl border border-pap-border bg-white overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(113,76,182,0.08)' }}>
                    {/* Card header */}
                    <div className="px-6 py-4 border-b border-pap-border flex items-center justify-between">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-pap-purple">
                        Latest Report
                      </span>
                      <span className="text-xs text-pap-dim">
                        {(() => {
                          const [y, m, d] = latestReport.date.split('-').map(Number)
                          return new Date(y, m - 1, d).toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        })()}
                      </span>
                    </div>
                    {/* Preview content */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {[
                          { label: 'Clinical Trial', color: 'bg-pap-purple/10 text-pap-purple', dot: 'bg-pap-purple', text: 'Phase 2 testing D-serine in 100 participants for disease modification' },
                          { label: 'Breakthrough', color: 'bg-pap-purple/10 text-pap-purple', dot: 'bg-pap-purple', text: 'DBS linked with lower facility placement and mortality in 79,845-patient study' },
                          { label: 'Lifestyle', color: 'bg-pap-lavender/20 text-[#714cb6]', dot: 'bg-pap-lavender', text: 'Tai Chi shows cognition and sleep benefits across 15 randomized trials' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="mt-1.5 flex-shrink-0 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: item.dot.startsWith('bg-pap-purple') ? 'var(--pap-purple)' : 'var(--pap-lavender)' }} />
                            <div>
                              <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium mb-1 ${item.color}`}>{item.label}</span>
                              <p className="text-sm text-pap-text leading-snug">{item.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 pt-4 border-t border-pap-border">
                        <Link
                          href={`/${locale}/report/${latestReport.date}`}
                          className="flex items-center justify-between text-sm text-pap-purple font-medium hover:opacity-80 transition-opacity"
                        >
                          <span>See full report — {latestReport.date}</span>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Source strip */}
                <p className="mt-4 text-[11px] text-pap-dim text-center">
                  Sources: ClinicalTrials.gov · NEJM · NPJ Parkinson's Disease · Frontiers in Psychology
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Category navigation ───────────────────────────────────────── */}
        <section className="bg-white border-y border-pap-border">
          <div className="mx-auto max-w-7xl px-5 md:px-8 py-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-pap-dim font-mono uppercase tracking-widest mr-1">Browse:</span>
              {[
                { label: 'Clinical Trials', href: '/reports?category=clinical' },
                { label: 'Breakthroughs', href: '/reports?category=breakthrough' },
                { label: 'Lifestyle', href: '/reports?category=lifestyle' },
                { label: 'Emerging Science', href: '/reports?category=emerging' },
                { label: 'All Reports', href: '/reports' },
              ].map((cat) => (
                <a
                  key={cat.label}
                  href={`/${locale}${cat.href}`}
                  className="inline-flex items-center rounded-full border border-pap-border bg-white px-4 py-2 text-xs text-pap-muted hover:border-pap-purple/40 hover:text-pap-text transition-colors"
                >
                  {cat.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── What We Cover ────────────────────────────────────────────── */}
        <section className="bg-[#faf8f8]">
          <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-24">
            <div className="mb-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-pap-purple block mb-3">How it works</span>
              <h2 className="font-display text-[28px] md:text-3xl text-pap-text">What we cover every day</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  num: '01',
                  title: 'Clinical Trials',
                  desc: 'Phase I–III trials now recruiting. Trial IDs, eligibility context, and what each phase means for families.',
                  color: 'var(--pap-purple)',
                  bg: 'var(--pap-purple-soft)',
                },
                {
                  num: '02',
                  title: 'Breakthroughs',
                  desc: 'Peer-reviewed findings from NEJM, Lancet, NPJ Parkinson's — translated before the mainstream picks them up.',
                  color: '#16a34a',
                  bg: 'rgba(22,163,74,0.08)',
                },
                {
                  num: '03',
                  title: 'Lifestyle',
                  desc: 'Exercise, diet, sleep, and caregiver support. Only interventions with evidence behind them.',
                  color: '#d97706',
                  bg: 'rgba(217,119,6,0.08)',
                },
                {
                  num: '04',
                  title: 'Emerging',
                  desc: 'Genetics, biomarkers, stem cells, and early science. Filed under "promising but not proven" — always.',
                  color: '#0891b2',
                  bg: 'rgba(8,145,178,0.08)',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.num}
                  {...staggerProps(i)}
                  className="rounded-2xl p-6 border border-pap-border bg-white hover:border-pap-border-hover transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className="font-mono text-[22px] font-bold leading-none"
                      style={{ color: item.color, opacity: 0.25 }}
                    >
                      {item.num}
                    </span>
                  </div>
                  <h3 className="font-display text-lg text-pap-text mb-2">{item.title}</h3>
                  <p className="text-sm text-pap-muted leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Founder section ───────────────────────────────────────────── */}
        <section className="bg-white border-t border-pap-border">
          <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-pap-purple block mb-4">From the founder</span>
                <blockquote className="font-display text-xl md:text-2xl text-pap-text leading-snug mb-6">
                  "When my dad was diagnosed, I wanted one place that tracked every relevant trial, every breakthrough — without the noise."
                </blockquote>
                <p className="text-pap-muted leading-relaxed mb-6">
                  I built AI Against Parkinson's because I was tired of checking ten sites every morning. Now autonomous agents do it for us — and every finding gets reviewed before it goes live.
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
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden rounded-2xl" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                  <Image
                    src="/images/founder-hockey.png"
                    alt="Tyler Delano"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-4 text-sm font-medium text-pap-text">Tyler Delano</p>
                <p className="text-xs text-pap-dim">Springtown, Texas</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="bg-[#faf8f8] border-t border-pap-border">
          <div className="mx-auto max-w-3xl px-5 md:px-8 py-16 md:py-20">
            <div className="mb-10 text-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-pap-purple block mb-3">FAQ</span>
              <h2 className="font-display text-[28px] md:text-3xl text-pap-text">{dictionary.faq.title}</h2>
            </div>
            <div className="divide-y divide-pap-border bg-white rounded-2xl border border-pap-border overflow-hidden">
              {dictionary.faq.items.map((item, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-pap-surface transition-colors"
                  >
                    <span className="font-display text-sm text-pap-text pr-4">{item.q}</span>
                    <span className="flex-shrink-0 text-pap-purple">
                      {openIndex === i ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      )}
                    </span>
                  </button>
                  {openIndex === i && (
                    <div className="px-6 pb-5 text-sm text-pap-muted leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  )
}
