interface PageHeaderProps {
  title: string
  subtitle?: string
  badge?: string
  icon?: React.ReactNode
}

export function PageHeader({ title, subtitle, badge, icon }: PageHeaderProps) {
  return (
    <header className="max-w-4xl mb-16">
      {badge && (
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-pap-purple mb-4 flex items-center gap-2">
          <span className="inline-block h-px w-6 bg-pap-purple/60" />
          {badge}
        </p>
      )}
      {icon && (
        <div className="mb-6">
          <span
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--pap-purple-soft)' }}
          >
            <span style={{ color: 'var(--pap-purple)' }}>{icon}</span>
          </span>
        </div>
      )}
      <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-normal leading-[1.1] tracking-tight text-pap-text">
        {title}
      </h1>
      {subtitle && <p className="mt-3 text-base text-pap-muted">{subtitle}</p>}
    </header>
  )
}