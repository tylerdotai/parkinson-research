import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://parkinson-research.vercel.app'),
  title: {
    default: 'Parkinson Research Daily',
    template: '%s | Parkinson Research Daily',
  },
  description: 'Autonomous daily research agent aggregating Parkinson\'s disease clinical trials, breakthrough treatments, lifestyle interventions, and emerging research.',
  keywords: ['parkinsons', 'parkinson disease', 'clinical trials', 'research', 'treatment', 'caregiver'],
  authors: [{ name: 'Flume SaaS Factory' }],
  creator: 'Flume SaaS Factory',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://parkinson-research.vercel.app',
    siteName: 'Parkinson Research Daily',
    title: 'Parkinson Research Daily',
    description: 'Daily Parkinson\'s research reports delivered to your inbox.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Parkinson Research Daily',
    description: 'Daily Parkinson\'s research reports — clinical trials, breakthroughs, and more.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect fill='%232D5BFF' width='100' height='100' rx='20'/><text x='50' y='68' font-size='50' text-anchor='middle' fill='white' font-family='system-ui'>P</text></svg>" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Parkinson Research Daily',
              url: 'https://parkinson-research.vercel.app',
              description: 'Autonomous daily research agent for Parkinson\'s disease',
              publisher: {
                '@type': 'Organization',
                name: 'Flume SaaS Factory',
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://parkinson-research.vercel.app/reports',
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

function Header() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-slate-900">Parkinson Research</span>
              <span className="hidden sm:inline text-slate-500 text-sm ml-2">Daily Reports</span>
            </div>
          </a>
          
          <nav className="flex items-center gap-1">
            <a href="/reports" className="nav-link px-3 py-2 rounded-lg text-sm">Reports</a>
            <a href="/about" className="nav-link px-3 py-2 rounded-lg text-sm">About</a>
            <a href="/api/reports" className="nav-link px-3 py-2 rounded-lg text-sm" target="_blank" rel="noopener">API</a>
          </nav>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            </svg>
            <span>Built with AI agents. Updated daily.</span>
          </div>
          <p className="text-slate-400 text-xs">
            For informational purposes only. Consult healthcare providers before making treatment decisions.
          </p>
        </div>
      </div>
    </footer>
  )
}
