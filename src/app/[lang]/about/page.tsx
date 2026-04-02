import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return {
    title: dictionary.about.title,
    description: dictionary.metadata.description,
  }
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  const t = dictionary.about

  const techItems = ['OpenClaw', 'Vercel', 'MiniMax', 'Next.js']

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-slate-900 mb-8">{t.title}</h1>

      <div className="space-y-6">
        {/* Mission */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 8.646m-5.5 0l3 3m0 0l2.148 2.148A12.061 12.061 0 008.5 15.354m6.5-6.5l3 3" />
            </svg>
            {t.researchAgent}
          </h2>
          <p className="text-slate-600 mb-4">
            {t.researchAgentDesc}
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            {t.searchTargets.map((target, i) => (
              <li key={i}>{target}</li>
            ))}
          </ul>
        </section>

        {/* Medical Review */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Medical Review
          </h2>
          <p className="text-slate-600 leading-relaxed">
            This content is reviewed by an unaffiliated medical professional for accuracy and appropriateness. However, this is not a substitute for professional medical advice.
          </p>
          <p className="text-sm text-slate-400 mt-3">
            Always consult your neurologist or healthcare provider before making treatment decisions.
          </p>
        </section>

        {/* What's Tracked */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
            {t.whatsTracked}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-2">{t.clinicalTrials.title}</h3>
              <p className="text-sm text-slate-600">{t.clinicalTrials.desc}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-2">{t.breakthroughs.title}</h3>
              <p className="text-sm text-slate-600">{t.breakthroughs.desc}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-2">{t.lifestyle.title}</h3>
              <p className="text-sm text-slate-600">{t.lifestyle.desc}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-2">{t.emerging.title}</h3>
              <p className="text-sm text-slate-600">{t.emerging.desc}</p>
            </div>
          </div>
        </section>

        {/* Privacy & Safety */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            {t.privacy}
          </h2>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            {t.privacyItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        {/* API */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
            {t.apiAccess}
          </h2>
          <p className="text-slate-600 mb-4">
            {t.apiAccessDesc}
          </p>
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <code className="text-slate-300">
              GET <span className="text-green-400">/{lang}/api/reports</span><br />
              GET <span className="text-green-400">/{lang}/api/reports/[date]</span>
            </code>
          </div>
        </section>

        {/* The Founder */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            The Founder
          </h2>
          <p className="text-slate-600 leading-relaxed">
            I built this for my dad after he was diagnosed with Parkinson's. After spending hours searching clinical trials, treatment research, and care resources — I realized there wasn't a single place that aggregated all of it, updated daily, and was written for patients instead of researchers.
          </p>
          <p className="text-slate-600 mt-4 leading-relaxed">
            So I built one. Every morning, AI research agents search clinical trials, medical journals, and emerging science — so you don't have to.
          </p>
          <p className="text-sm text-slate-400 mt-4">
            — Tyler Delano, Creator
          </p>
        </section>

        {/* Disclaimer */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            {t.disclaimer}
          </h2>
          <p className="text-slate-600 text-sm">
            {t.disclaimerText}
          </p>
          <p className="text-slate-600 text-sm mt-4">
            {t.disclaimerText2}
          </p>
        </section>
      </div>
    </div>
  )
}
