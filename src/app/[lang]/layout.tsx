import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/lib/dictionary'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import '../globals.css'

type Props = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

const validLocales = ['en', 'es'] as const

export async function generateStaticParams() {
  return validLocales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  
  return {
    title: {
      default: dictionary.metadata.title,
      template: `%s | ${dictionary.metadata.title}`,
    },
    description: dictionary.metadata.description,
    keywords: dictionary.metadata.keywords,
    authors: [{ name: 'Flume SaaS Factory' }],
    creator: 'Flume SaaS Factory',
    openGraph: {
      type: 'website',
      locale: lang === 'es' ? 'es_ES' : 'en_US',
      alternateLocale: lang === 'es' ? 'en_US' : 'es_ES',
      url: `https://parkinson-research.vercel.app/${lang}`,
      siteName: dictionary.metadata.title,
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.metadata.title,
      description: dictionary.metadata.description,
    },
    alternates: {
      canonical: `https://parkinson-research.vercel.app/${lang}`,
      languages: {
        'en': 'https://parkinson-research.vercel.app/en',
        'es': 'https://parkinson-research.vercel.app/es',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params
  
  // Validate locale
  if (!validLocales.includes(lang as any)) {
    notFound()
  }
  
  const dictionary = await getDictionary(lang)

  return (
    <html lang={lang}>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%232563EB' width='100' height='100' rx='20'/><text x='50' y='68' font-size='50' text-anchor='middle' fill='white' font-family='system-ui'>P</text></svg>" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: dictionary.metadata.title,
              url: `https://parkinson-research.vercel.app/${lang}`,
              description: dictionary.metadata.description,
              publisher: {
                '@type': 'Organization',
                name: 'Flume SaaS Factory',
              },
              inLanguage: lang,
              potentialAction: {
                '@type': 'SearchAction',
                target: `https://parkinson-research.vercel.app/${lang}/reports`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Header dictionary={dictionary} lang={lang} />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer dictionary={dictionary} />
      </body>
    </html>
  )
}
