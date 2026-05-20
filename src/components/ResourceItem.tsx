import Link from 'next/link'

type Props = {
  name: string
  phone?: string | null
  description: string
  href?: string | null
  external?: boolean
}

export default function ResourceItem({ name, phone, description, href, external = false }: Props) {
  const content = (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-pap-text">
          {name}
        </h3>
        {phone && (
          <p className="text-xs font-medium mt-0.5 text-pap-purple">
            {phone}
          </p>
        )}
        <p className="text-xs leading-relaxed mt-1 text-pap-muted">
          {description}
        </p>
      </div>
      {href && (
        <div className="flex-shrink-0 self-center">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            style={{ color: 'var(--pap-purple)' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={external
                ? 'M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25'
                : 'M8.25 4.5l7.5 7.5-7.5 7.5'
              }
            />
          </svg>
        </div>
      )}
    </div>
  )

  if (!href) {
    return (
      <div className="py-4 border-b border-pap-border">
        {content}
      </div>
    )
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block py-4 border-b border-pap-border hover:border-pap-purple/30 transition-colors"
        aria-label={`${name}${phone ? `, ${phone}` : ''}`}
      >
        <div className="px-1">
          {content}
        </div>
      </a>
    )
  }

  return (
    <Link
      href={href}
      className="block py-4 border-b border-pap-border hover:border-pap-purple/30 transition-colors"
      aria-label={`${name}${phone ? `, ${phone}` : ''}`}
    >
      <div className="px-1">
        {content}
      </div>
    </Link>
  )
}