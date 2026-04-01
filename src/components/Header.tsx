'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Dictionary } from '@/lib/dictionary'
import { useEffect } from 'react'

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
  
  // Replace the locale segment in the current path
  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    return segments.join('/') || '/'
  }

  // Handle theme toggle
  const toggleTheme = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    if (isDark) {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    }
  }

  // Handle motion toggle
  const toggleMotion = () => {
    const html = document.documentElement
    const isReduced = html.classList.contains('motion-reduced')
    const toggle = document.querySelector('.motion-toggle')
    
    if (isReduced) {
      html.classList.remove('motion-reduced')
      localStorage.setItem('motion-reduced', 'false')
      toggle?.classList.remove('active')
    } else {
      html.classList.add('motion-reduced')
      localStorage.setItem('motion-reduced', 'true')
      toggle?.classList.add('active')
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal-100 bg-cream-50/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-oxygen-600 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="font-medium text-charcoal-800" style={{ fontFamily: 'Instrument Serif, serif' }}>
                Parkinson Research
              </span>
              <div className="flex items-center gap-2 text-xs text-charcoal-400">
                <span className="data-pulse">
                  <span className="data-pulse-dot"></span>
                </span>
                <span>Live daily</span>
              </div>
            </div>
          </Link>
          
          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Link href={`/${lang}/reports`} className={`nav-link ${pathname === `/${lang}/reports` ? 'bg-charcoal-100 text-charcoal-900' : ''}`}>
              Reports
            </Link>
            <Link href={`/${lang}/resources`} className={`nav-link ${pathname === `/${lang}/resources` ? 'bg-charcoal-100 text-charcoal-900' : ''}`}>
              Resources
            </Link>
            <Link href={`/${lang}/about`} className={`nav-link ${pathname === `/${lang}/about` ? 'bg-charcoal-100 text-charcoal-900' : ''}`}>
              About
            </Link>
            
            {/* Divider */}
            <div className="w-px h-6 bg-charcoal-200 mx-2" />
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="nav-link p-2"
              aria-label="Toggle dark mode"
              title="Research Mode (Dark)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            </button>
            
            {/* Motion Toggle */}
            <button 
              onClick={toggleMotion}
              className="motion-toggle"
              aria-label="Toggle reduced motion"
              title="Reduce motion"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">Motion</span>
            </button>
            
            {/* Language Switcher */}
            <select
              value={lang}
              onChange={(e) => {
                window.location.href = switchLocale(e.target.value)
              }}
              className="ml-2 text-sm bg-transparent border border-charcoal-200 rounded-lg px-2 py-1.5 text-charcoal-600 hover:border-charcoal-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-oxygen-500"
              aria-label="Language"
            >
              <option value="en">{languageNames.en}</option>
              <option value="es">{languageNames.es}</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  )
}
