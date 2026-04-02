'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import type { Dictionary } from '@/lib/dictionary'

type Props = {
  dictionary: Dictionary
  lang: string
}

export default function Header({ dictionary, lang }: Props) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b transition-shadow duration-200 ${
        scrolled ? 'border-[var(--color-parchment)] shadow-sm' : 'border-transparent'
      }`}
    >
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #1b1938 0%, #714cb6 100%)' }}
          >
            <svg className="w-4 h-4 text-[var(--color-lavender)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
          </div>
          <span
            className="font-semibold text-sm hidden sm:block"
            style={{ color: 'var(--color-charcoal)' }}
          >
            Parkinson Research
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href={`/${lang}/reports`}
            className={`nav-link nav-link-light ${pathname === `/${lang}/reports` ? 'active' : ''}`}
          >
            {dictionary.nav.reports}
          </Link>
          <Link
            href={`/${lang}/resources`}
            className={`nav-link nav-link-light ${pathname === `/${lang}/resources` ? 'active' : ''}`}
          >
            {dictionary.nav.resources}
          </Link>
          <Link
            href={`/${lang}/about`}
            className={`nav-link nav-link-light ${pathname === `/${lang}/about` ? 'active' : ''}`}
          >
            {dictionary.nav.about}
          </Link>
        </div>

        {/* Language + Mobile menu */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center rounded-lg p-0.5 gap-0.5"
            style={{ background: 'var(--color-surface-muted)' }}
          >
            <Link
              href="/en"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                lang === 'en'
                  ? 'text-[var(--color-charcoal)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
              style={lang === 'en' ? { background: 'var(--color-white)', boxShadow: 'var(--shadow-xs)' } : {}}
            >
              EN
            </Link>
            <Link
              href="/es"
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                lang === 'es'
                  ? 'text-[var(--color-charcoal)]'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
              }`}
              style={lang === 'es' ? { background: 'var(--color-white)', boxShadow: 'var(--shadow-xs)' } : {}}
            >
              ES
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
            aria-label="Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className="md:hidden border-t bg-white"
        style={{ borderColor: 'var(--color-parchment)' }}
      >
        <div className="px-4 py-3 space-y-1">
          <Link
            href={`/${lang}/reports`}
            className={`nav-link nav-link-light block ${pathname === `/${lang}/reports` ? 'active' : ''}`}
          >
            {dictionary.nav.reports}
          </Link>
          <Link
            href={`/${lang}/resources`}
            className={`nav-link nav-link-light block ${pathname === `/${lang}/resources` ? 'active' : ''}`}
          >
            {dictionary.nav.resources}
          </Link>
          <Link
            href={`/${lang}/about`}
            className={`nav-link nav-link-light block ${pathname === `/${lang}/about` ? 'active' : ''}`}
          >
            {dictionary.nav.about}
          </Link>
        </div>
      </div>
    </header>
  )
}
