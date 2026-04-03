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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const toggleMenu = () => setMenuOpen(prev => !prev)

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b transition-shadow duration-200 ${
        scrolled ? 'border-[var(--color-parchment)] shadow-sm' : 'border-transparent'
      }`}
    >
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${lang}`} className="flex items-center gap-2.5 group">
          <img
            src="/images/logo-cropped.png"
            alt="AI Against Parkinson's"
            className="h-12 w-auto rounded-xl transition-transform duration-200 group-hover:scale-105"
            style={{ height: '3rem', width: 'auto' }}
          />
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
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation — conditional */}
      {menuOpen && (
        <div
          className="md:hidden border-t bg-white"
          style={{ borderColor: 'var(--color-parchment)' }}
        >
          <div className="px-4 py-3 space-y-1">
            <Link
              href={`/${lang}/reports`}
              className={`nav-link nav-link-light block ${pathname === `/${lang}/reports` ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {dictionary.nav.reports}
            </Link>
            <Link
              href={`/${lang}/resources`}
              className={`nav-link nav-link-light block ${pathname === `/${lang}/resources` ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {dictionary.nav.resources}
            </Link>
            <Link
              href={`/${lang}/about`}
              className={`nav-link nav-link-light block ${pathname === `/${lang}/about` ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {dictionary.nav.about}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
