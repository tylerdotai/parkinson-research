import 'server-only'

type Locale = 'en' | 'es';
const VALID_LOCALES: Locale[] = ['en', 'es'];

const dictionaries = {
  en: () => import('../../dictionaries/en.json').then((module) => module.default),
  es: () => import('../../dictionaries/es.json').then((module) => module.default),
}

export type Dictionary = Awaited<ReturnType<typeof dictionaries.en>>

export async function getDictionary(lang: string): Promise<Dictionary> {
  // Validate locale
  const locale = VALID_LOCALES.includes(lang as Locale) ? lang : 'en';
  
  return dictionaries[locale as keyof typeof dictionaries]()
}

