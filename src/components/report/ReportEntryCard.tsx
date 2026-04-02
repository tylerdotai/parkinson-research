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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="group"
    >
      <div
        className="rounded-xl p-5 transition-all duration-200"
        style={{
          background: 'var(--color-white)',
          border: '1px solid var(--color-parchment)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {entry.title && (
              <h4
                className="font-medium text-sm leading-snug mb-1"
                style={{ color: 'var(--color-charcoal)' }}
              >
                {entry.title}
              </h4>
            )}
            {entry.date && (
              <span
                className="text-xs font-medium"
                style={{ color: 'var(--color-amethyst)', opacity: 0.8 }}
              >
                {entry.date}
              </span>
            )}
          </div>
          {entry.url && (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-110"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
              aria-label="View source"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                style={{ color: 'var(--color-amethyst)' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v8.25m0-11.25H9.75m0 0h6.265M12 3h6.75m0 0v11.25c0 .621-.504 1.125-1.125 1.125H2.625A1.125 1.125 0 011.5 14.625V8.25m0-11.25H9m9 0h3.75m-3.75 0l-3.75 3.75m3.75-3.75l-3.75 3.75"
                />
              </svg>
            </a>
          )}
        </div>

        {/* Snippet */}
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
              strokeWidth={1.5}
              style={{ color: 'var(--color-text-muted)' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
            <span className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
              {cleanSourceUrl(entry.source)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function cleanSourceUrl(url: string): string {
  // Remove protocol and trailing slash
  return url
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
    .replace(/^www\./, '')
}
