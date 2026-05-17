export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'
export const localeCookieName = 'NEXT_LOCALE'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
}

export function isLocale(value: string | undefined | null): value is Locale {
  return locales.includes(value as Locale)
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split('/')[1]
  return isLocale(segment) ? segment : null
}

export function stripLocaleFromPathname(pathname: string): string {
  const locale = getLocaleFromPathname(pathname)
  if (!locale) return pathname || '/'

  const stripped = pathname.replace(`/${locale}`, '') || '/'
  return stripped.startsWith('/') ? stripped : `/${stripped}`
}

export function withLocale(pathname: string, locale: Locale): string {
  const cleanPath = stripLocaleFromPathname(pathname)
  return cleanPath === '/' ? `/${locale}` : `/${locale}${cleanPath}`
}

export function getBestLocaleFromAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale

  const requested = header
    .split(',')
    .map((part) => part.trim().split(';')[0]?.toLowerCase())
    .filter(Boolean)

  for (const tag of requested) {
    const language = tag.split('-')[0]
    if (isLocale(language)) return language
  }

  return defaultLocale
}