import { MetadataRoute } from 'next'
import { getAllReportDates } from '@/lib/reports'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dates = await getAllReportDates()
  const locales = ['en', 'es'] as const
  
  const entries: MetadataRoute.Sitemap = []
  
  for (const lang of locales) {
    const reportUrls = dates.map((date) => ({
      url: `https://parkinson-research.vercel.app/${lang}/report/${date}`,
      lastModified: new Date(date),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
    
    entries.push(
      {
        url: `https://parkinson-research.vercel.app/${lang}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `https://parkinson-research.vercel.app/${lang}/reports`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `https://parkinson-research.vercel.app/${lang}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      ...reportUrls,
    )
  }
  
  return entries
}
