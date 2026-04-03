import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'
import ResourceItem from '@/components/ResourceItem'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return {
    title: dictionary.resources?.title || 'Resources',
    description: "Free resources, hotlines, and support for Parkinson's patients and families.",
  }
}

export default async function ResourcesPage({ params }: Props) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  const t = dictionary.resources || defaultResources

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
      <header className="mb-10">
        <h1
          className="mb-3"
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--color-charcoal)'
          }}
        >
          {t.title}
        </h1>
        <p className="text-base" style={{ color: 'var(--color-text-secondary)' }}>
          {t.subtitle}
        </p>
      </header>

      <div className="space-y-6">
        {/* Visual Infographics */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-5 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </span>
            Understanding Parkinson&apos;s
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="https://www.michaeljfox.org/parkinsons-101"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
              style={{ boxShadow: 'var(--shadow-sm)', height: '320px' }}
            >
              <img
                src="/images/what-is-parkinson.png"
                alt="What is Parkinson's? Infographic from Michael J. Fox Foundation"
                className="w-full h-full object-contain"
                loading="lazy"
                style={{ background: '#f5f4f2' }}
              />
            </a>
            <a
              href="https://www.michaeljfox.org/symptoms"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
              style={{ boxShadow: 'var(--shadow-sm)', height: '320px' }}
            >
              <img
                src="/images/parkinsons-symptoms.jpg"
                alt="Parkinson's Disease Main Symptoms infographic"
                className="w-full h-full object-contain"
                loading="lazy"
                style={{ background: '#f5f4f2' }}
              />
            </a>
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--color-text-muted)' }}>
            Infographics courtesy of the Michael J. Fox Foundation for Parkinson&apos;s Research.{' '}
            <a
              href="https://www.michaeljfox.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-amethyst)' }}
            >
              {t.learnMore}
            </a>
          </p>
        </section>

        {/* Emergency & Helplines */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-5 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375m.375 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm-12.75 0h.75m12.75 0a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" />
              </svg>
            </span>
            {t.emergency?.title || 'Emergency & Helplines'}
          </h2>
          <div className="space-y-1">
            <ResourceItem
              name="Parkinson's Foundation Helpline"
              phone="1-800-4PD-INFO (473-4636)"
              description={t.emergency?.pfHelpline || 'Nurse educators available Mon-Fri, 9am-7pm ET. Get answers about symptoms, treatments, and local resources.'}
              href="tel:1-800-473-4636"
            />
            <ResourceItem
              name="American Parkinson Disease Association"
              phone="1-800-223-2732"
              description={t.emergency?.apdaDesc || 'Information, referrals, support groups, and educational programs nationwide.'}
              href="tel:1-800-223-2732"
            />
          </div>
        </section>

        {/* Clinical Trials & Research */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-5 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </span>
            {t.clinical?.title || 'Clinical Trials & Research'}
          </h2>
          <div className="space-y-1">
            <ResourceItem
              name="ClinicalTrials.gov"
              description={t.clinical?.clinicalTrialsDesc || "Search all recruiting Parkinson's clinical trials by location, phase, and intervention type."}
              href="https://clinicaltrials.gov"
              external
            />
            <ResourceItem
              name="Fox Trial Finder"
              description={t.clinical?.foxTrialDesc || "Michael J. Fox Foundation tool to match patients with recruiting trials. Takes 5 minutes to sign up."}
              href="https://foxtrialfinder.michaeljfox.org"
              external
            />
          </div>
        </section>

        {/* Exercise & Rehabilitation */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-5 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m-7.5-4.5l4-4.5m-5 9.5l-4-4.5M15 6l4 4.5m-9-4.5l5 4" />
              </svg>
            </span>
            {t.exercise?.title || 'Exercise & Rehabilitation'}
          </h2>
          <div className="space-y-1">
            <ResourceItem
              name="Rock Steady Boxing"
              phone="(317) 550-2734"
              description={t.exercise?.rsbDesc || "Non-contact boxing program specifically for Parkinson's. 900+ affiliates worldwide. Scholarships available."}
              href="https://rocksteadyboxing.org"
              external
            />
            <ResourceItem
              name="LSVT BIG"
              description={t.exercise?.lsvtDesc || 'Therapy method using oversized movements to improve movement quality. Find certified therapists.'}
              href="https://www.lsvtglobal.com"
              external
            />
            <ResourceItem
              name="Dance for PD"
              description={t.exercise?.danceDesc || "Dance classes designed for people with Parkinson's. Free online videos and in-person classes."}
              href="https://danceforparkinsons.org"
              external
            />
          </div>
        </section>

        {/* Caregiver & Family Support */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-5 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </span>
            {t.caregiver?.title || 'Caregiver & Family Support'}
          </h2>
          <div className="space-y-1">
            <ResourceItem
              name="Family Caregiver Alliance"
              phone="1-800-445-8106"
              description={t.caregiver?.fcaDesc || 'Nationwide advocacy and support for family caregivers. Respite care guides, online forums, and care navigation.'}
              href="https://www.caregiver.org"
              external
            />
            <ResourceItem
              name="Well Spouse Association"
              phone="1-800-838-0879"
              description={t.caregiver?.wellSpouseDesc || 'Support for spouses caring for chronically ill partners. Mentors, support groups, and advocacy.'}
              href="https://www.wellspouse.org"
              external
            />
          </div>
        </section>

        {/* Financial & Insurance */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-5 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375m.375 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm-12.75 0h.75m12.75 0a.75.75 0 111.5 0 .75.75 0 01-1.5 0z" />
              </svg>
            </span>
            {t.financial?.title || 'Financial & Insurance Assistance'}
          </h2>
          <div className="space-y-1">
            <ResourceItem
              name="Medicare"
              phone="1-800-633-4227"
              description={t.financial?.medicareDesc || "Federal health insurance for 65+. Covers some Parkinson's medications, therapy, and equipment."}
              href="https://www.medicare.gov"
              external
            />
            <ResourceItem
              name="Social Security Disability (SSDI)"
              phone="1-800-772-1213"
              description={t.financial?.ssdiDesc || 'Apply early — takes 2-3 years for approval. Provides monthly benefits for eligible disabled individuals.'}
              href="https://www.ssa.gov/disability"
              external
            />
            <ResourceItem
              name="Parkinson's Foundation — Legal & Financial"
              phone="1-800-4PD-INFO"
              description={t.financial?.pfAssistDesc || 'Helps navigate insurance, find co-pay assistance, and access medication assistance programs.'}
              href="https://www.parkinson.org/living-with-parkinsons/legal-financial"
              external
            />
          </div>
        </section>

        {/* Tech Tools */}
        <section className="card" style={{ padding: '1.75rem' }}>
          <h2
            className="text-base font-semibold mb-5 flex items-center gap-3"
            style={{ color: 'var(--color-charcoal)' }}
          >
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(203, 183, 251, 0.10)' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-amethyst)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </span>
            {t.tech?.title || 'Tech Tools & Assistive Technology'}
          </h2>
          <div className="space-y-1">
            <ResourceItem
              name={`Parkinson's Foundation Tech Tools Guide`}
              description={`Curated list of apps, devices, and tools recommended for daily living with Parkinson's — tremor aids, voice apps, medication reminders, and more.`}
              href="https://www.parkinson.org/living-with-parkinsons/management/tech-tools"
              external
            />
            <ResourceItem
              name="Voiceitt"
              description={t.tech?.voiceittDesc || 'Speech recognition app that adapts to atypical speech patterns. Works with standard voice assistants.'}
              href="https://voiceitt.com"
              external
            />
            <ResourceItem
              name={`PD Avengers — Tech Resources`}
              description={`Global community of people with Parkinson's sharing practical tech solutions, app reviews, and daily living tools.`}
              href="https://pdavengers.com"
              external
            />
          </div>
        </section>

        {/* AI Agent Integration */}
        <section
          className="card"
          style={{
            padding: '1.75rem',
            background: 'linear-gradient(135deg, #1b1938 0%, #2d2252 100%)',
            border: '1px solid rgba(203, 183, 251, 0.15)'
          }}
        >
          <h2
            className="text-base font-semibold mb-4 flex items-center gap-3"
            style={{ color: 'rgba(255,255,255,0.95)' }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-lavender)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
            {t.aiIntegrationTitle}
          </h2>
          <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {t.aiIntegrationDesc}
          </p>
          <div
            className="rounded-xl p-4 mb-4"
            style={{ background: 'rgba(0,0,0,0.25)' }}
          >
            <code className="text-sm" style={{ color: '#86efac' }}>
              GET /{lang}/api/reports/latest
            </code>
          </div>
          <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {t.aiIntegrationResponse}
          </p>
          <div
            className="rounded-xl p-4"
            style={{ background: 'rgba(0,0,0,0.25)' }}
          >
            <code className="text-sm" style={{ color: '#86efac' }}>
              GET /{lang}/api/reports/2026-03-31
            </code>
          </div>
        </section>
      </div>
    </div>
  )
}

const defaultResources = {
  title: 'Resources',
  subtitle: "Free hotlines, support programs, and assistance for Parkinson's patients and families.",
  emergency: {
    title: 'Emergency & Helplines',
  },
  clinical: {
    title: 'Clinical Trials & Research',
  },
  exercise: {
    title: 'Exercise & Rehabilitation',
  },
  caregiver: {
    title: 'Caregiver & Family Support',
  },
  financial: {
    title: 'Financial & Insurance Assistance',
  },
  tech: {
    title: 'Tech Tools & Assistive Technology',
  },
}
