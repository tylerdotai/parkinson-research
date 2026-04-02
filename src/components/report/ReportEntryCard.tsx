'use client'

import { motion } from 'framer-motion'
import type { ReportEntry } from '@/lib/types'

interface Props {
  entry: ReportEntry
  index: number
}

export default function ReportEntryCard({ entry, index }: Props) {
  if (!entry.title && !entry.snippet) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="mb-7 last:mb-0">
        {/* Title */}
        {entry.title && (
          <h3
            className="font-medium leading-snug mb-2"
            style={{
              color: 'var(--color-charcoal)',
              fontFamily: 'Instrument Serif, serif',
              fontSize: '1.0625rem',
              lineHeight: 1.35,
            }}
          >
            {entry.title}
          </h3>
        )}

        {/* Body */}
        {entry.snippet && (
          <p
            className="text-sm leading-relaxed mb-3"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {entry.snippet}
          </p>
        )}

        {/* Source */}
        {entry.source && (
          <div className="flex items-center gap-1.5">
            <svg
              className="w-3 h-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              style={{ color: 'var(--color-text-muted)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {entry.source}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
