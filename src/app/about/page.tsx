export const metadata = {
  title: 'About',
  description: 'About the Parkinson Research Daily project, methodology, and mission.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-slate-900 mb-8">About This Project</h1>

      <div className="space-y-6">
        {/* Mission */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 8.646m-5.5 0l3 3m0 0l2.148 2.148A12.061 12.061 0 008.5 15.354m6.5-6.5l3 3" />
            </svg>
            The Research Agent
          </h2>
          <p className="text-slate-600 mb-4">
            Every morning at 7:00 AM CDT, an autonomous AI research agent springs to life. 
            It spawns multiple specialized sub-agents that simultaneously search:
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            <li>ClinicalTrials.gov for recruiting clinical trials</li>
            <li>Medical journals (NEJM, Lancet Neurology, JAMA) for breakthrough findings</li>
            <li>Research databases for lifestyle intervention studies</li>
            <li>Preprint servers and conference proceedings for emerging science</li>
          </ul>
        </section>

        {/* What's Tracked */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
            What's Tracked
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-2">Clinical Trials</h3>
              <p className="text-sm text-slate-600">
                Active recruiting trials, Phase 2/3 results, eligibility requirements, 
                intervention types, and locations.
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-2">Breakthrough Treatments</h3>
              <p className="text-sm text-slate-600">
                FDA approvals, drug mechanisms, clinical evidence summaries, 
                and emerging therapeutic targets.
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-2">Lifestyle Interventions</h3>
              <p className="text-sm text-slate-600">
                Exercise protocols, dietary recommendations, sleep optimization, 
                and stress management strategies.
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-2">Emerging Research</h3>
              <p className="text-sm text-slate-600">
                Novel therapeutic targets, biomarker discoveries, diagnostic advances, 
                and preliminary findings from preprint servers.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy & Safety */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Privacy and Safety
          </h2>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            <li><strong>No personal data</strong> — reports contain zero patient or personal information</li>
            <li><strong>Aggregate research only</strong> — we compile public research, not private data</li>
            <li><strong>Medical disclaimers</strong> — every report includes clear disclaimers</li>
            <li><strong>Transparent methodology</strong> — all research sources are cited</li>
          </ul>
        </section>

        {/* API */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
            API Access
          </h2>
          <p className="text-slate-600 mb-4">
            This site provides a JSON API for AI agents and developers to consume research data programmatically.
          </p>
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <code className="text-slate-300">
              GET <span className="text-green-400">/api/reports</span><br />
              GET <span className="text-green-400">/api/reports/[date]</span>
            </code>
          </div>
        </section>

        {/* Built With */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.658-5.658a8.25 8.25 0 117.163-7.216 8.25 8.25 0 01-7.163 7.216zM12 12h.008v.008H12V12z" />
            </svg>
            Built With
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <TechBadge name="OpenClaw" />
            <TechBadge name="Vercel" />
            <TechBadge name="MiniMax" />
            <TechBadge name="Next.js" />
          </div>
        </section>

        {/* Disclaimer */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Disclaimer
          </h2>
          <p className="text-slate-600 text-sm">
            The information provided by Parkinson Research Daily is for general informational 
            purposes only. All information on the site is provided in good faith; however, 
            we make no representation or warranty of any kind, express or implied, regarding 
            the accuracy, adequacy, validity, reliability, availability, or completeness of 
            any information on the site.
          </p>
          <p className="text-slate-600 text-sm mt-4">
            Under no circumstance shall we have any liability to you for any loss or damage 
            of any kind incurred as a result of the use of the site or reliance on any 
            information provided on the site. Your use of the site and your reliance on any 
            information on the site is solely at your own risk.
          </p>
        </section>
      </div>
    </div>
  )
}

function TechBadge({ name }: { name: string }) {
  return (
    <div className="bg-slate-100 rounded-lg p-3 text-center">
      <span className="text-sm font-medium text-slate-700">{name}</span>
    </div>
  )
}
