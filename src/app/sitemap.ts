import { MetadataRoute } from 'next'
import { getAllReportDates } from '@/lib/reports'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dates = await getAllReportDates()
  
  const reportUrls = dates.map((date) => ({
    url: `https://parkinson-research.vercel.app/report/${date}`,
    lastModified: new Date(date),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }))
  
  return [
    {
      url: 'https://parkinson-research.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://parkinson-research.vercel.app/reports',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://parkinson-research.vercel.app/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...reportUrls,
  ]
}
