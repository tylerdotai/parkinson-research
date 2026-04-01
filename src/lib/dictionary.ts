import 'server-only'

const dictionaries = {
  en: () => import('../../dictionaries/en.json').then((module) => module.default),
  es: () => import('../../dictionaries/es.json').then((module) => module.default),
}

export type Dictionary = Awaited<ReturnType<typeof dictionaries.en>>

export async function getDictionary(lang: string): Promise<Dictionary> {
  // Validate locale
  const validLocales = ['en', 'es'] as const
  const locale = validLocales.includes(lang as any) ? lang : 'en'
  
  return dictionaries[locale as keyof typeof dictionaries]()
}

export function getLocaleFromParams(params: { lang?: string }): string {
  const lang = params.lang
  if (!lang) return 'en'
  const validLocales = ['en', 'es']
  return validLocales.includes(lang) ? lang : 'en'
}
