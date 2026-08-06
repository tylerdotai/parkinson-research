import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { isLocale, type Locale } from '@/lib/i18n/config'

type Props = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

const VALID_LOCALES: Locale[] = ['en', 'es']
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiagainstparkinson.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const spanish = lang === 'es'
  const url = `${BASE_URL}/${lang}`
  return {
    title: spanish ? 'IA Contra el Parkinson — Investigación diaria' : "AI Against Parkinson's — Daily Parkinson's Research",
    description: spanish
      ? 'Investigación diaria sobre Parkinson para familias y cuidadores, resumida en un lenguaje claro y revisada por humanos.'
      : "Daily Parkinson's research for families and caregivers, summarized in clear language and reviewed by humans.",
    alternates: {
      canonical: url,
      languages: { en: `${BASE_URL}/en`, es: `${BASE_URL}/es`, 'x-default': `${BASE_URL}/en` },
    },
    openGraph: {
      type: 'website',
      url,
      locale: spanish ? 'es_ES' : 'en_US',
      siteName: "AI Against Parkinson's",
      title: spanish ? 'IA Contra el Parkinson — Investigación diaria' : "AI Against Parkinson's — Daily Parkinson's Research",
      description: spanish
        ? 'Investigación diaria sobre Parkinson para familias y cuidadores, resumida en un lenguaje claro y revisada por humanos.'
        : "Daily Parkinson's research for families and caregivers, summarized in clear language and reviewed by humans.",
      images: [{ url: '/parkinson-og.jpg', width: 1200, height: 630, alt: "AI Against Parkinson's" }],
    },
    twitter: { card: 'summary_large_image', images: ['/parkinson-og.jpg'] },
  }
}

export async function generateStaticParams() {
  return VALID_LOCALES.map((lang) => ({ lang }))
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params

  if (!isLocale(lang)) {
    notFound()
  }

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}