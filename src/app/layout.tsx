import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Parkinson Research Daily | Daily Breakthroughs, Trials & Tips',
  description: 'Autonomous daily research agent aggregating Parkinson\'s disease clinical trials, breakthrough treatments, and lifestyle interventions.',
  keywords: ['parkinsons', 'parkinson disease', 'clinical trials', 'research', 'treatment'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-white text-xl">🧠</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">Parkinson Research</h1>
                <p className="text-xs text-gray-500">Daily autonomous research</p>
              </div>
            </div>
            <nav className="flex items-center gap-6">
              <a href="/" className="text-sm text-gray-600 hover:text-primary transition-colors">Home</a>
              <a href="/reports" className="text-sm text-gray-600 hover:text-primary transition-colors">Reports</a>
              <a href="/about" className="text-sm text-gray-600 hover:text-primary transition-colors">About</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-gray-200 mt-20 py-8">
          <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
            <p className="mb-2">Built with AI agents. Updated daily.</p>
            <p className="text-xs">
              <em>This site provides informational content only. Always consult healthcare providers before making medical decisions.</em>
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
