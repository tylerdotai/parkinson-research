interface CTASectionProps {
  headline: string
  subline: string
  buttonLabel: string
  buttonHref: string
  disclaimer?: string
}

export function CTASection({ headline, subline, buttonLabel, buttonHref, disclaimer }: CTASectionProps) {
  return (
    <section className="px-5 md:px-8 py-20" style={{ background: 'var(--pap-surface)' }}>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-pap-text mb-4">{headline}</h2>
        <p className="text-pap-muted mb-8">{subline}</p>
        <a
          href={buttonHref}
          className="inline-flex items-center gap-2 rounded-full bg-pap-purple px-8 py-4 text-base font-medium text-white hover:bg-[#8b5dc7] transition-colors"
        >
          {buttonLabel}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        {disclaimer && <p className="mt-4 text-sm text-pap-dim">{disclaimer}</p>}
      </div>
    </section>
  )
}