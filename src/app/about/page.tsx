export const metadata = {
  title: 'About | Parkinson Research Daily',
  description: 'About the Parkinson Research Daily project, methodology, and mission.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-8">About This Project</h1>

      <div className="space-y-8">
        <section className="report-card">
          <h2 className="section-header text-xl mb-4">🤖 The Research Agent</h2>
          <p className="text-gray-600 mb-4">
            Every morning at 7:00 AM CDT, an autonomous AI research agent springs to life. 
            It spawns multiple specialized sub-agents that simultaneously search:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>ClinicalTrials.gov for recruiting clinical trials</li>
            <li>Medical journals (NEJM, Lancet Neurology, JAMA) for breakthrough findings</li>
            <li>Research databases for lifestyle intervention studies</li>
            <li>Preprint servers and conference proceedings for emerging science</li>
          </ul>
        </section>

        <section className="report-card">
          <h2 className="section-header text-xl mb-4">📊 What's Tracked</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">🧪 Clinical Trials</h3>
              <p className="text-sm text-gray-600">
                Active recruiting trials, Phase 2/3 results, eligibility requirements, 
                intervention types, and locations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">💊 Breakthrough Treatments</h3>
              <p className="text-sm text-gray-600">
                FDA approvals, drug mechanisms, clinical evidence summaries, 
                and emerging therapeutic targets.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🏃 Lifestyle Interventions</h3>
              <p className="text-sm text-gray-600">
                Exercise protocols, dietary recommendations, sleep optimization, 
                and stress management strategies.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">🔬 Emerging Research</h3>
              <p className="text-sm text-gray-600">
                Novel therapeutic targets, biomarker discoveries, diagnostic advances, 
                and preliminary findings from preprint servers.
              </p>
            </div>
          </div>
        </section>

        <section className="report-card">
          <h2 className="section-header text-xl mb-4">🔒 Privacy & Safety</h2>
          <p className="text-gray-600 mb-4">
            This project is built with privacy and safety as core principles:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>No personal data</strong> — reports contain zero patient or personal information</li>
            <li><strong>Aggregate research only</strong> — we compile public research, not private data</li>
            <li><strong>Medical disclaimers</strong> — every report includes clear disclaimers</li>
            <li><strong>Transparent methodology</strong> — all research sources are cited</li>
          </ul>
        </section>

        <section id="subscribe" className="report-card">
          <h2 className="section-header text-xl mb-4">📧 Get Daily Reports</h2>
          <p className="text-gray-600 mb-4">
            Want reports delivered to your inbox? Subscribe to get daily updates 
            when new research is published.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-500">
              Email subscription coming soon. For now, bookmark this site or check back daily.
            </p>
          </div>
        </section>

        <section className="report-card">
          <h2 className="section-header text-xl mb-4">🛠️ Built With</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-sm font-medium">OpenClaw</p>
              <p className="text-xs text-gray-500">AI agent orchestration</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-2">▲</div>
              <p className="text-sm font-medium">Vercel</p>
              <p className="text-xs text-gray-500">Deployment</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-2">🧠</div>
              <p className="text-sm font-medium">MiniMax M2.7</p>
              <p className="text-xs text-gray-500">AI research</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl mb-2">📦</div>
              <p className="text-sm font-medium">Next.js</p>
              <p className="text-xs text-gray-500">Website</p>
            </div>
          </div>
        </section>

        <section className="report-card">
          <h2 className="section-header text-xl mb-4">📝 Disclaimer</h2>
          <p className="text-gray-600 text-sm">
            The information provided by Parkinson Research Daily is for general informational 
            purposes only. All information on the site is provided in good faith; however, 
            we make no representation or warranty of any kind, express or implied, regarding 
            the accuracy, adequacy, validity, reliability, availability, or completeness of 
            any information on the site.
          </p>
          <p className="text-gray-600 text-sm mt-4">
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
