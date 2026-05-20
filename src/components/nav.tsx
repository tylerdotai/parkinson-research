"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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

export function Nav() {
  const pathname = usePathname()
  const locale = getLocaleFromPathname(pathname) ?? defaultLocale
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Reports', href: '/reports' },
    { label: 'Resources', href: '/resources' },
    { label: 'About', href: '/about' },
  ]

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-md border-b border-pap-border'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8 md:py-5">
          {/* Wordmark */}
          <Link
            href={withLocale('/', locale)}
            className="flex items-center gap-2.5 group"
            aria-label="AI Against Parkinson's"
          >
            <Image
              src="/images/logo-cropped.png"
              alt=""
              width={28}
              height={28}
              className="object-contain"
              priority
            />
            <span className="font-display text-xl md:text-[22px] tracking-tight text-pap-text">
              AI Against Parkinson&apos;s
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={withLocale(link.href, locale)}
                className={`px-3 py-2 text-sm transition-colors ${
                  pathname === withLocale(link.href, locale)
                    ? 'text-pap-text font-medium'
                    : 'text-pap-muted hover:text-pap-text'
                }`}
              >
                {link.label}
              </a>
            ))}

            {/* Subscribe CTA */}
            <a
              href={withLocale('/subscribe', locale)}
              className="ml-2 lg:ml-3 inline-flex items-center gap-1.5 rounded-full bg-pap-purple px-5 py-2 text-sm font-medium text-white hover:bg-pap-purple/90 transition-colors"
            >
              Subscribe
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 6h6m0 0L6 3m3 3L6 9"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            {/* Language switcher */}
            <div className="ml-2 flex items-center rounded-full border border-pap-border bg-white/80 p-1" aria-label="Language">
              <span className="px-2 text-pap-dim" aria-hidden="true">◎</span>
              {locales.map((language) => (
                <Link
                  key={language}
                  href={withLocale(pathname, language)}
                  onClick={() => rememberLocale(language)}
                  hrefLang={language}
                  aria-current={language === locale ? 'true' : undefined}
                  className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                    language === locale
                      ? 'bg-pap-purple text-white'
                      : 'text-pap-muted hover:text-pap-text'
                  }`}
                >
                  {localeNames[language]}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden relative z-50 flex flex-col justify-center gap-1.5 p-2 -mr-2"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <motion.span
              animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
              transition={{ duration: 0.2 }}
              className="block h-[1.5px] w-5 bg-pap-text origin-center"
            />
            <motion.span
              animate={{ opacity: open ? 0 : 1 }}
              transition={{ duration: 0.15 }}
              className="block h-[1.5px] w-5 bg-pap-text"
            />
            <motion.span
              animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
              transition={{ duration: 0.2 }}
              className="block h-[1.5px] w-5 bg-pap-text origin-center"
            />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white md:hidden flex flex-col"
            onClick={() => setOpen(false)}
          >
            <div
              className="flex-1 flex flex-col justify-center px-8 pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={withLocale(link.href, locale)}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="font-display text-4xl text-pap-text hover:text-pap-purple transition-colors py-3 border-b border-pap-border last:border-0"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{
                  duration: 0.3,
                  delay: navLinks.length * 0.04 + 0.05,
                }}
                className="mt-10"
              >
                <a
                  href={withLocale('/subscribe', locale)}
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-full bg-pap-purple py-4 text-center text-base font-medium text-white hover:bg-pap-purple/90 transition-colors"
                >
                  Subscribe
                </a>

                <div className="mt-6 flex items-center justify-center gap-2" aria-label="Language">
                  {locales.map((language) => (
                    <Link
                      key={language}
                      href={withLocale(pathname, language)}
                      onClick={() => {
                        rememberLocale(language)
                        setOpen(false)
                      }}
                      hrefLang={language}
                      aria-current={language === locale ? 'true' : undefined}
                      className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                        language === locale
                          ? 'border-pap-purple bg-pap-purple text-white'
                          : 'border-pap-border text-pap-muted hover:text-pap-text'
                      }`}
                    >
                      {localeNames[language]}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}