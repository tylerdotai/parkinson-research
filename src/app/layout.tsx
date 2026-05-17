import type { Metadata } from 'next'
import { Playfair_Display, Karla } from 'next/font/google'
import './globals.css'
import { defaultLocale, locales } from '@/lib/i18n/config'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
})

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aiagainstparkinson.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "AI Against Parkinson's — Daily Parkinson's Research",
    template: '%s | AI Against Parkinson\'s',
  },
  description: 'Autonomous AI research agent aggregating Parkinson\'s disease clinical trials, breakthrough treatments, lifestyle interventions, and emerging science. Free daily email.',
  keywords: ['parkinsons', 'parkinson disease', 'clinical trials', 'research', 'treatment', 'caregiver', 'ai against parkinson'],
  openGraph: {
    type: 'website',
    siteName: "AI Against Parkinson's",
    url: BASE_URL,
    title: "AI Against Parkinson's — Daily Parkinson's Research",
    description: 'Autonomous AI research agent aggregating Parkinson\'s disease clinical trials, breakthrough treatments, lifestyle interventions, and emerging science.',
    images: [
      {
        url: '/parkinson-og.jpg',
        width: 1200,
        height: 630,
        alt: "AI Against Parkinson's",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "AI Against Parkinson's — Daily Parkinson's Research",
    description: 'Autonomous AI research agent aggregating Parkinson\'s disease clinical trials, breakthrough treatments, and emerging science.',
    images: ['/parkinson-og.jpg'],
  },
  alternates: {
    canonical: BASE_URL,
    languages: Object.fromEntries(
      locales.map((language) => [
        language,
        `${BASE_URL}/${language}`,
      ])
    ),
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={defaultLocale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%23714cb6' width='100' height='100' rx='12'/><text x='50' y='68' font-size='50' text-anchor='middle' fill='white' font-family='system-ui'>P</text></svg>" />
      </head>
      <body
        className={`${playfair.variable} ${karla.variable} bg-background text-foreground font-sans antialiased`}
        style={{ fontFamily: 'var(--font-sans), system-ui, sans-serif' }}
      >
        {/* Skip to main content — a11y */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-pap-purple focus:text-white focus:font-mono focus:text-sm focus:uppercase focus:tracking-widest"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}