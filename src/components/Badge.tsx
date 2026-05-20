type BadgeVariant = 'purple' | 'lavender' | 'outline'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  purple: 'bg-pap-purple text-white',
  lavender: 'bg-pap-lavender text-pap-text',
  outline: 'border border-pap-border text-pap-muted bg-white/90 backdrop-blur-sm shadow-sm',
}

export function Badge({ label, variant = 'purple' }: BadgeProps) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${variantClasses[variant]}`}>
      {label}
    </span>
  )
}