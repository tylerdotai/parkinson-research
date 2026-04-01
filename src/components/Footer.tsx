import Link from 'next/link'
import type { Dictionary } from '@/lib/dictionary'

type Props = {
  dictionary: Dictionary
}

export default function Footer({ dictionary }: Props) {
  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <span className="font-semibold text-slate-900">Parkinson Research</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              {dictionary.footer.tagline}
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Research</h4>
            <ul className="space-y-2">
              <li><Link href="/en/reports" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">All Reports</Link></li>
              <li><Link href="/en/resources" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Resources</Link></li>
              <li><Link href="/en/api/reports" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">API</Link></li>
            </ul>
          </div>
          
          {/* Disclaimer */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Disclaimer</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {dictionary.footer.disclaimer}
            </p>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Built with care for families navigating Parkinson's.
          </p>
          <a 
            href="https://github.com/tylerdotai/parkinson-research" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="View on GitHub"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
