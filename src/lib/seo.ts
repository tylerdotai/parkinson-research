import type { Metadata } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiagainstparkinson.com'

export function localizedMetadata(lang: string, path: string): Pick<Metadata, 'alternates'> {
  const localizedUrl = `${BASE_URL}/${lang}${path}`
  return {
    alternates: {
      canonical: localizedUrl,
      languages: {
        en: `${BASE_URL}/en${path}`,
        es: `${BASE_URL}/es${path}`,
        'x-default': `${BASE_URL}/en${path}`,
      },
    },
  }
}
