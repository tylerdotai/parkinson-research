'use client'

import { motion } from 'framer-motion'
import type { ReportSection as ReportSectionType } from '@/lib/types'
import ReportEntryCard from './ReportEntryCard'

interface Props {
  section: ReportSectionType
  sectionIndex: number
}

const CATEGORY_CONFIG: Record<string, { border: string; pill: string; icon: React.ReactNode }> = {
  clinical: {
    border: 'rgba(203, 183, 251, 0.40)',
    pill: 'rgba(203, 183, 251, 0.12)',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  breakthrough: {
    border: 'rgba(113, 76, 182, 0.35)',
    pill: 'rgba(113, 76, 182, 0.10)',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  lifestyle: {
    border: 'rgba(16, 185, 129, 0.30)',
    pill: 'rgba(16, 185, 129, 0.08)',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  emerging: {
    border: 'rgba(245, 158, 11, 0.35)',
    pill: 'rgba(245, 158, 11, 0.08)',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
  },
  tech: {
    border: 'rgba(14, 165, 233, 0.30)',
    pill: 'rgba(14, 165, 233, 0.08)',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5" />
      </svg>
    ),
  },
  community: {
    border: 'rgba(236, 72, 153, 0.30)',
    pill: 'rgba(236, 72, 153, 0.08)',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  caregiver: {
    border: 'rgba(249, 115, 22, 0.30)',
    pill: 'rgba(249, 115, 22, 0.08)',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
}

export default function ReportSection({ section, sectionIndex }: Props) {
  const config = CATEGORY_CONFIG[section.category] || CATEGORY_CONFIG.clinical

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: sectionIndex * 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Section header */}
      <div
        className="flex items-center gap-3 mb-5"
        style={{
          borderLeft: `3px solid ${config.border}`,
          paddingLeft: '1rem',
        }}
      >
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: config.pill, color: 'var(--color-amethyst)' }}
        >
          {config.icon}
        </span>
        <h2
          className="text-lg font-medium"
          style={{
            fontFamily: 'Instrument Serif, serif',
            color: 'var(--color-charcoal)',
            fontSize: '1.25rem',
          }}
        >
          {section.title}
        </h2>
      </div>

      {/* Entries grid */}
      <div className="grid gap-3 mb-10">
        {section.entries.map((entry, i) => (
          <ReportEntryCard key={i} entry={entry} index={i} />
        ))}
      </div>
    </motion.section>
  )
}
