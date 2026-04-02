'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Dictionary } from '@/lib/dictionary'
import { useState, useEffect } from 'react'

type Props = {
  dictionary: Dictionary
  lang: string
}

const languageNames: Record<string, string> = {
  en: 'EN',
  es: 'ES',
}

export default function Header({ dictionary, lang }: Props) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Replace the locale segment in the current path
  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    return segments.join('/') || '/'
  }

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-slate-900">Parkinson Research</span>
              <span className="hidden sm:inline text-slate-500 text-sm ml-2">Daily Reports</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link href={`/${lang}/reports`} className={`nav-link ${pathname === `/${lang}/reports` ? 'bg-slate-100 text-slate-900' : ''}`}>
              {dictionary.nav.reports}
            </Link>
            <Link href={`/${lang}/resources`} className={`nav-link ${pathname === `/${lang}/resources` ? 'bg-slate-100 text-slate-900' : ''}`}>
              {dictionary.nav.resources}
            </Link>
            <Link href={`/${lang}/about`} className={`nav-link ${pathname === `/${lang}/about` ? 'bg-slate-100 text-slate-900' : ''}`}>
              {dictionary.nav.about}
            </Link>
            
            {/* Language Switcher */}
            <div className="ml-2 pl-2 border-l border-slate-200">
              <select
                value={lang}
                onChange={(e) => {
                  window.location.href = switchLocale(e.target.value)
                }}
                className="text-sm bg-transparent border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 hover:border-slate-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Language"
              >
                <option value="en">{languageNames.en}</option>
                <option value="es">{languageNames.es}</option>
              </select>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <div className="flex flex-col space-y-1">
              <Link href={`/${lang}/reports`} className={`nav-link ${pathname === `/${lang}/reports` ? 'bg-slate-100 text-slate-900' : ''}`}>
                {dictionary.nav.reports}
              </Link>
              <Link href={`/${lang}/resources`} className={`nav-link ${pathname === `/${lang}/resources` ? 'bg-slate-100 text-slate-900' : ''}`}>
                {dictionary.nav.resources}
              </Link>
              <Link href={`/${lang}/about`} className={`nav-link ${pathname === `/${lang}/about` ? 'bg-slate-100 text-slate-900' : ''}`}>
                {dictionary.nav.about}
              </Link>
            </div>
            
            <div className="flex items-center mt-4 pt-4 border-t border-slate-200">
              <select
                value={lang}
                onChange={(e) => {
                  window.location.href = switchLocale(e.target.value)
                }}
                className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Language"
              >
                <option value="en">{languageNames.en}</option>
                <option value="es">{languageNames.es}</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
