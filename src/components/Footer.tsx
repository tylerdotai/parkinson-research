import Link from 'next/link'
import type { Dictionary } from '@/lib/dictionary'

type Props = {
  dictionary: Dictionary
  lang: string
}

export default function Footer({ dictionary, lang }: Props) {
  const t = dictionary.footer

  return (
    <footer
      className="border-t mt-20"
      style={{ borderColor: 'var(--color-parchment)', background: 'var(--color-white)' }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <img
                src="/images/logo-cropped.png"
                alt="AI Against Parkinson's"
                className="h-9 w-auto rounded-lg"
                style={{ height: '2.25rem', width: 'auto' }}
              />
              <span className="font-semibold text-sm" style={{ color: 'var(--color-charcoal)' }}>
                AI Against Parkinson's
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {t.tagline}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com/tylerdotai/parkinson-research"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
                aria-label="View on GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Open Source
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Navigate
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href={`/${lang}/reports`}
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {t.allReports}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/resources`}
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {t.resources}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/api/reports`}
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {t.api}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/privacy`}
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${lang}/terms`}
                  className="text-sm transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {t.terms}
                </Link>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Disclaimer
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {t.disclaimer}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'var(--color-parchment)' }}
        >
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            © {new Date().getFullYear()} AI Against Parkinson's. Free forever.
          </p>
        </div>
      </div>
    </footer>
  )
}
