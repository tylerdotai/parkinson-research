import { MetadataRoute } from 'next'
import { getAllReportDates } from '@/lib/reports'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiagainstparkinson.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dates = await getAllReportDates()
  const locales = ['en', 'es'] as const

  const entries: MetadataRoute.Sitemap = []

  for (const lang of locales) {
    const reportUrls = dates.map((date) => ({
      url: `${SITE_URL}/${lang}/report/${date}`,
      lastModified: new Date(date),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))

    entries.push(
      {
        url: `${SITE_URL}/${lang}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${SITE_URL}/${lang}/reports`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/${lang}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      ...reportUrls,
    )
  }

  return entries
}
