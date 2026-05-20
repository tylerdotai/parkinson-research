"use client"

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  defaultLocale,
  getLocaleFromPathname,
  localeCookieName,
  localeNames,
  locales,
  type Locale,
  withLocale,
} from '@/lib/i18n/config'

function rememberLocale(locale: Locale) {
  document.cookie = `${localeCookieName}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
}

export function Footer() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname) ?? defaultLocale

  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-pap-border bg-white">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link
              href={withLocale('/', locale)}
              className="inline-flex items-center gap-2.5"
              aria-label="AI Against Parkinson's"
            >
              <Image
                src="/images/logo-cropped.png"
                alt=""
                width={28}
                height={28}
                className="object-contain"
              />
              <span className="font-display text-xl tracking-tight text-pap-text">
                AI Against Parkinson&apos;s
              </span>
            </Link>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-pap-purple">
              Daily Research for Families
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-pap-purple" />
              <span className="text-[12px] text-pap-dim">Daily at 7:00 AM CDT</span>
            </div>
            <p className="mt-4 text-[14px] sm:text-[15px] text-pap-muted leading-[1.6] max-w-sm">
              Every morning, AI agents search clinical trials, medical journals, and research databases to bring you the latest breakthroughs, trials, and evidence-based tips.
            </p>
          </div>

          {/* Nav columns */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-pap-purple mb-5">
              Navigate
            </p>
            <ul className="space-y-3">
              {[
                { label: 'Reports', href: '/reports' },
                { label: 'Resources', href: '/resources' },
                { label: 'About', href: '/about' },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={withLocale(item.href, locale)}
                    className="text-[14px] text-pap-muted hover:text-pap-text transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-pap-purple mb-5">
              Legal
            </p>
            <ul className="space-y-3">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={withLocale(item.href, locale)}
                    className="text-[14px] text-pap-muted hover:text-pap-text transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-pap-purple mb-5">
              Open Source
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/tylerdotai/parkinson-research"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-pap-muted hover:text-pap-text transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  GitHub
                </a>
              </li>
              <li>
                <span className="text-[14px] text-pap-dim">
                  Free forever. No paywall.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-pap-border">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-pap-dim text-center md:text-left">
            © {currentYear} AI Against Parkinson&apos;s · Free daily research
          </p>
          <div className="flex items-center gap-5 text-[13px]">
            <a
              href={withLocale('/privacy', locale)}
              className="text-pap-dim hover:text-pap-text transition-colors"
            >
              Privacy
            </a>
            <a
              href={withLocale('/terms', locale)}
              className="text-pap-dim hover:text-pap-text transition-colors"
            >
              Terms
            </a>
            <span className="flex items-center gap-2" aria-label="Language">
              {locales.map((language) => (
                <Link
                  key={language}
                  href={withLocale(pathname, language)}
                  onClick={() => rememberLocale(language)}
                  hrefLang={language}
                  aria-current={language === locale ? 'true' : undefined}
                  className={`transition-colors ${
                    language === locale
                      ? 'text-pap-purple'
                      : 'text-pap-dim hover:text-pap-text'
                  }`}
                >
                  {localeNames[language]}
                </Link>
              ))}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}