'use client'

import { motion } from 'framer-motion'
import type { ReportSection as ReportSectionType } from '@/lib/types'
import ReportEntry from './ReportEntry'

interface Props {
  section: ReportSectionType
  sectionIndex: number
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  clinical: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
  breakthrough: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  lifestyle: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  emerging: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-2.25 1.5l2.25-2.25m2.25 2.25l-2.25 2.25m2.25-4.5l-2.25 2.25m2.25 2.25l2.25 2.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  tech: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5" />
    </svg>
  ),
}

export default function ReportSection({ section, sectionIndex }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: sectionIndex * 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{ marginBottom: '3.5rem' }}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <span
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(203, 183, 251, 0.12)',
            color: 'var(--color-amethyst)',
          }}
        >
          {CATEGORY_ICONS[section.category] || CATEGORY_ICONS.emerging}
        </span>
        <h2
          style={{
            fontFamily: 'Instrument Serif, Georgia, serif',
            fontSize: '1.5rem',
            fontWeight: 400,
            color: 'var(--color-charcoal)',
            letterSpacing: '-0.01em',
          }}
        >
          {section.title}
        </h2>
      </div>

      {/* Entries — bullet list */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {section.entries.map((entry, i) => (
          <ReportEntry key={i} entry={entry} index={i} />
        ))}
      </ul>
    </motion.section>
  )
}
