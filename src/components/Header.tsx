'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Dictionary } from '@/lib/dictionary'

type Props = {
  dictionary: Dictionary
  lang: string
}

const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Espanol',
}

export default function Header({ dictionary, lang }: Props) {
  const pathname = usePathname()
  
  // Replace the locale segment in the current path
  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    return segments.join('/') || '/'
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-slate-900">
                {lang === 'es' ? 'Investigacion' : 'Parkinson Research'}
              </span>
              <span className="hidden sm:inline text-slate-500 text-sm ml-2">
                {lang === 'es' ? 'Investigacion Diaria' : 'Daily Reports'}
              </span>
            </div>
          </Link>
          
          {/* Navigation + Language Switcher */}
          <div className="flex items-center gap-1">
            <Link href={`/${lang}/reports`} className={`nav-link px-3 py-2 rounded-lg text-sm ${pathname === `/${lang}/reports` ? 'active' : ''}`}>
              {dictionary.nav.reports}
            </Link>
            <Link href={`/${lang}/about`} className={`nav-link px-3 py-2 rounded-lg text-sm ${pathname === `/${lang}/about` ? 'active' : ''}`}>
              {dictionary.nav.about}
            </Link>
            <Link href={`/${lang}/api/reports`} className="nav-link px-3 py-2 rounded-lg text-sm" target="_blank" rel="noopener">
              {dictionary.nav.api}
            </Link>
            
            {/* Language Switcher */}
            <div className="ml-2 pl-2 border-l border-slate-200">
              <select
                value={lang}
                onChange={(e) => {
                  window.location.href = switchLocale(e.target.value)
                }}
                className="text-sm bg-transparent border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 hover:border-slate-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={dictionary.languageSwitcher.label}
              >
                <option value="en">{languageNames.en}</option>
                <option value="es">{languageNames.es}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
