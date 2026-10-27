'use client'

import type { ReportEntry as ReportEntryType } from '@/lib/types'

interface Props {
  entry: ReportEntryType
  lang: 'en' | 'es'
}

export default function ReportEntry({ entry, lang }: Props) {
  if (!entry.title && !entry.snippet) return null

  return (
    <li
      className="report-entry"
      style={{
        paddingLeft: '0',
        paddingTop: '1.25rem',
        paddingBottom: '1.25rem',
        paddingRight: '0',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Bullet marker */}
      <div className="flex items-start gap-3">
        <span
          className="flex-shrink-0 w-2 h-2 rounded-full mt-2.5"
          style={{ background: 'var(--color-amethyst)', opacity: 0.6 }}
        />

        <div className="flex-1 min-w-0">
          {/* Title */}
          {entry.title && (
          <h3
            className="font-display"
            style={{
              fontSize: '1.125rem',
                fontWeight: 400,
                lineHeight: 1.35,
                color: 'var(--color-charcoal)',
                marginBottom: '0.375rem',
              }}
            >
              {entry.title}
            </h3>
          )}

          {/* Body */}
          {entry.snippet && (
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.65,
                color: 'var(--color-text-secondary)',
                marginBottom: '0.5rem',
              }}
            >
              {entry.snippet}
            </p>
          )}

          {(entry.evidenceType || entry.evidenceLevel || entry.studyDesign) && (
            <div className="flex flex-wrap gap-2 mb-2" aria-label={lang === 'es' ? 'Detalles de evidencia' : 'Evidence details'}>
              {entry.evidenceType && <span className="rounded-full bg-pap-purple-soft px-2.5 py-1 text-xs text-pap-purple">{entry.evidenceType}</span>}
              {entry.evidenceLevel && <span className="rounded-full border border-pap-border px-2.5 py-1 text-xs text-pap-muted">{lang === 'es' ? 'Nivel' : 'Level'}: {entry.evidenceLevel}</span>}
              {entry.studyDesign && <span className="rounded-full border border-pap-border px-2.5 py-1 text-xs text-pap-muted">{entry.studyDesign}</span>}
            </div>
          )}

          {entry.whyItMatters && (
            <p className="text-sm leading-relaxed text-pap-muted mb-2">
              <strong className="text-pap-text">{lang === 'es' ? 'Qué significa:' : 'What the study tells us:'}</strong> {entry.whyItMatters}
            </p>
          )}

          {entry.limitations && (
            <p className="text-xs leading-relaxed text-pap-dim mb-2">
              <strong>{lang === 'es' ? 'Límite:' : 'Limit:'}</strong> {entry.limitations}
            </p>
          )}

          {/* Source link */}
          {entry.url && (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{
                color: 'var(--color-amethyst)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                minHeight: '48px',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v8.25m0-11.25H9.75m0 0h6.265M12 3h6.75m0 0v11.25c0 .621.504 1.125 1.125 1.125H2.625A1.125 1.125 0 011.5 14.625V8.25m0-11.25H9m9 0h3.75m-3.75 0l-3.75 3.75m3.75-3.75l-3.75 3.75" />
              </svg>
              {lang === 'es' ? 'Fuente' : 'Source'}: {entry.source || (lang === 'es' ? 'Leer más' : 'Read more')}
            </a>
          )}
        </div>
      </div>
    </li>
  )
}
