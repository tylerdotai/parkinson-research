interface SectionCardProps {
  icon?: React.ReactNode
  title: string
  children: React.ReactNode
  variant?: 'default' | 'surface'
}

export function SectionCard({ icon, title, children, variant = 'default' }: SectionCardProps) {
  return (
    <section
      className="border border-pap-border rounded-2xl"
      style={{ padding: '1.75rem', ...(variant === 'surface' ? { background: 'var(--pap-surface)' } : {}) }}
    >
      <h2 className="text-base font-semibold mb-5 flex items-center gap-3 text-pap-text">
        {icon && (
          <span
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--pap-purple-soft)' }}
          >
            <span style={{ color: 'var(--pap-purple)' }}>{icon}</span>
          </span>
        )}
        {title}
      </h2>
      {children}
    </section>
  )
}