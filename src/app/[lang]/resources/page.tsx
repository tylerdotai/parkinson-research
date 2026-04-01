import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return {
    title: dictionary.resources?.title || 'Resources',
    description: 'Free resources, hotlines, and support for Parkinson\'s patients and families.',
  }
}

export default async function ResourcesPage({ params }: Props) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  const t = dictionary.resources || defaultResources

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-slate-900 mb-2">{t.title}</h1>
      <p className="text-slate-600 mb-8">{t.subtitle}</p>

      <div className="space-y-8">
        {/* Emergency & Helplines */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a9 9 0 107.218 11.3c.328-.22.613-.51.85-.8M10.5 6a9 9 0 00-9 9c0 1.006.16 1.985.46 2.91M10.5 6v4.5m0-4.5h4.5" />
            </svg>
            {t.emergency?.title || 'Emergency & Helplines'}
          </h2>
          <div className="space-y-4">
            <ResourceItem 
              name="Parkinson's Foundation Helpline"
              phone="1-800-4PD-INFO (473-4636)"
              description={t.emergency?.pfHelpline || 'Nurse educators available Mon-Fri, 9am-7pm ET. Get answers about symptoms, treatments, and local resources.'}
              href="tel:1-800-473-4636"
            />
            <ResourceItem 
              name="National Parkinson Foundation"
              phone="1-800-4PD-INFO"
              description={t.emergency?.npfDesc || 'Free resources, expert care team referrals, and support for patients and families.'}
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

        {/* Clinical & Medical */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            {t.clinical?.title || 'Clinical Trials & Research'}
          </h2>
          <div className="space-y-4">
            <ResourceItem 
              name="ClinicalTrials.gov"
              phone={null}
              description={t.clinical?.clinicalTrialsDesc || 'Search all recruiting Parkinson\'s clinical trials by location, phase, and intervention type.'}
              href="https://clinicaltrials.gov"
              external
            />
            <ResourceItem 
              name="Fox Trial Finder"
              phone={null}
              description={t.clinical?.foxTrialDesc || 'Michael J. Fox Foundation tool to match patients with recruiting trials. Takes 5 minutes to sign up.'}
              href="https://foxtrialfinder.michaeljfox.org"
              external
            />
            <ResourceItem 
              name="Parkinson’s Foundation ResearchMatch"
              phone={null}
              description={t.clinical?.researchMatchDesc || 'Connect with researchers conducting Parkinson\'s studies. Free to join.'}
              href="https://www.parkinson.org/get-involved/researchmatch"
              external
            />
          </div>
        </section>

        {/* Exercise & Rehab */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m-7.5-4.5l4-4.5m-5 9.5l-4-4.5M15 6l4 4.5m-9-4.5l5 4" />
            </svg>
            {t.exercise?.title || 'Exercise & Rehabilitation'}
          </h2>
          <div className="space-y-4">
            <ResourceItem 
              name="Rock Steady Boxing"
              phone="(317) 550-2734"
              description={t.exercise?.rsbDesc || 'Non-contact boxing program specifically for Parkinson\'s. 900+ affiliates worldwide. Scholarships available.'}
              href="https://rocksteadyboxing.org"
              external
            />
            <ResourceItem 
              name="LSVT BIG"
              phone={null}
              description={t.exercise?.lsvtDesc || 'Therapy method using oversized movements to improve movement quality. Find certified therapists at lsvtglobal.com.'}
              href="https://www.lsvtglobal.com"
              external
            />
            <ResourceItem 
              name="PD Warriors"
              phone={null}
              description={t.exercise?.pdWarriorsDesc || 'Circuit-based exercise program for Parkinson\'s. Virtual and in-person options available.'}
              href="https://pdwarriors.com"
              external
            />
            <ResourceItem 
              name="Dance for PD"
              phone={null}
              description={t.exercise?.danceDesc || 'Dance classes designed for people with Parkinson\'s. Free online videos and in-person classes.'}
              href="https://danceforparkinsons.org"
              external
            />
          </div>
        </section>

        {/* Caregiver Support */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            {t.caregiver?.title || 'Caregiver & Family Support'}
          </h2>
          <div className="space-y-4">
            <ResourceItem 
              name="Family Caregiver Alliance"
              phone="1-800-445-8106"
              description={t.caregiver?.fcaDesc || 'Nationwide advocacy and support for family caregivers. Respite care guides, online forums, and care navigation.'}
              href="https://www.caregiver.org"
              external
            />
            <ResourceItem 
              name="CareLinx"
              phone={null}
              description={t.caregiver?.carelinxDesc || 'Find vetted, affordable in-home caregivers. Insurance accepted. Background-checked professionals.'}
              href="https://www.carelinx.com"
              external
            />
            <ResourceItem 
              name="ARCH National Respite Network"
              phone={null}
              description={t.caregiver?.archDesc || 'Emergency and planned respite care services. Helps caregivers take breaks safely.'}
              href="https://www.archrespite.org"
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
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375m.375 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm-12.75 0h.75m12.75 0a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 6v.75C3.75 7.164 3.414 7.5 3 7.5h-.75M3 15v9m18-10.5v.75c0 .414-.336.75-.75.75h-.75m.75 0V6" />
            </svg>
            {t.financial?.title || 'Financial & Insurance Assistance'}
          </h2>
          <div className="space-y-4">
            <ResourceItem 
              name="Medicare"
              phone="1-800-633-4227"
              description={t.financial?.medicareDesc || 'Federal health insurance for 65+. Covers some Parkinson\'s medications, therapy, and equipment.'}
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
              name="Parkinson\'s Foundation Assistance"
              phone="1-800-4PD-INFO"
              description={t.financial?.pfAssistDesc || 'Helps navigate insurance, find co-pay assistance, and access medication assistance programs.'}
              href="https://www.parkinson.org/Resources/Financial-Assistance"
              external
            />
            <ResourceItem 
              name="NeedyMeds"
              phone={null}
              description={t.financial?.needyMedsDesc || 'Find patient assistance programs for free or reduced-cost medications. Search by drug name.'}
              href="https://www.needymeds.org"
              external
            />
          </div>
        </section>

        {/* Mental Health */}
        <section className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            {t.mental?.title || 'Mental Health & Counseling'}
          </h2>
          <div className="space-y-4">
            <ResourceItem 
              name="Crisis Text Line"
              phone="Text HOME to 741741"
              description={t.mental?.crisisTextDesc || 'Free 24/7 crisis counseling via text. Mental health support when you need it most.'}
              href="https://www.crisistextline.org"
              external
            />
            <ResourceItem 
              name="Caregiver Mental Health Support"
              phone={null}
              description={t.mental?.caregiverMentalDesc || 'Caregiver depression is real and common. Seek your own counselor — you cannot care for others from an empty cup.'}
              href={null}
            />
            <ResourceItem 
              name="Parkinson\'s Foundation Mental Health"
              phone="1-800-4PD-INFO"
              description={t.mental?.pfMentalDesc || 'Depression and anxiety are common in Parkinson\'s. Help is available — ask your neurologist for referrals.'}
              href="https://www.parkinson.org/Living-with-Parkinsons/Non-Motor-Symptoms/Mental-Health"
              external
            />
          </div>
        </section>

        {/* AI Agent Setup */}
        <section className="card bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
            AI Agent Integration
          </h2>
          <p className="text-slate-300 text-sm mb-4">
            Other AI agents can automatically pull the latest report using this endpoint:
          </p>
          <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm mb-4">
            <code className="text-green-400">GET /{lang}/api/reports/latest</code>
          </div>
          <p className="text-slate-300 text-sm mb-4">
            Or get a specific date:
          </p>
          <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm mb-4">
            <code className="text-green-400">GET /{lang}/api/reports/2026-03-31</code>
          </div>
          <p className="text-slate-300 text-sm">
            Response includes: date, title, full content, sections parsed as structured JSON, and source attribution.
          </p>
        </section>
      </div>
    </div>
  )
}

function ResourceItem({ 
  name, 
  phone, 
  description, 
  href, 
  external = false 
}: { 
  name: string
  phone: string | null
  description: string
  href: string | null
  external?: boolean
}) {
  const content = (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
      <div className="flex-1">
        <h3 className="font-medium text-slate-900">{name}</h3>
        {phone && (
          <p className="text-blue-600 text-sm font-medium">{phone}</p>
        )}
        <p className="text-slate-600 text-sm mt-1">{description}</p>
      </div>
      {href && (
        <div className="flex-shrink-0">
          {external ? (
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          )}
        </div>
      )}
    </div>
  )

  if (!href) {
    return (
      <div className="py-3 border-b border-slate-100 last:border-0">
        {content}
      </div>
    )
  }

  return (
    <a 
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="block py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 -mx-4 px-4 transition-colors"
    >
      {content}
    </a>
  )
}

const defaultResources = {
  title: 'Resources',
  subtitle: 'Free hotlines, support programs, and assistance for Parkinson\'s patients and families.',
  emergency: {
    title: 'Emergency & Helplines',
    pfHelpline: 'Nurse educators available Mon-Fri, 9am-7pm ET. Get answers about symptoms, treatments, and local resources.',
    npfDesc: 'Free resources, expert care team referrals, and support for patients and families.',
    apdaDesc: 'Information, referrals, support groups, and educational programs nationwide.',
  },
  clinical: {
    title: 'Clinical Trials & Research',
    clinicalTrialsDesc: 'Search all recruiting Parkinson\'s clinical trials by location, phase, and intervention type.',
    foxTrialDesc: 'Michael J. Fox Foundation tool to match patients with recruiting trials. Takes 5 minutes to sign up.',
    researchMatchDesc: 'Connect with researchers conducting Parkinson\'s studies. Free to join.',
  },
  exercise: {
    title: 'Exercise & Rehabilitation',
    rsbDesc: 'Non-contact boxing program specifically for Parkinson\'s. 900+ affiliates worldwide. Scholarships available.',
    lsvtDesc: 'Therapy method using oversized movements to improve movement quality. Find certified therapists.',
    pdWarriorsDesc: 'Circuit-based exercise program for Parkinson\'s. Virtual and in-person options available.',
    danceDesc: 'Dance classes designed for people with Parkinson\'s. Free online videos and in-person classes.',
  },
  caregiver: {
    title: 'Caregiver & Family Support',
    fcaDesc: 'Nationwide advocacy and support for family caregivers. Respite care guides, online forums, and care navigation.',
    carelinxDesc: 'Find vetted, affordable in-home caregivers. Insurance accepted. Background-checked professionals.',
    archDesc: 'Emergency and planned respite care services. Helps caregivers take breaks safely.',
    wellSpouseDesc: 'Support for spouses caring for chronically ill partners. Mentors, support groups, and advocacy.',
  },
  financial: {
    title: 'Financial & Insurance Assistance',
    medicareDesc: 'Federal health insurance for 65+. Covers some Parkinson\'s medications, therapy, and equipment.',
    ssdiDesc: 'Apply early — takes 2-3 years for approval. Provides monthly benefits for eligible disabled individuals.',
    pfAssistDesc: 'Helps navigate insurance, find co-pay assistance, and access medication assistance programs.',
    needyMedsDesc: 'Find patient assistance programs for free or reduced-cost medications. Search by drug name.',
  },
  mental: {
    title: 'Mental Health & Counseling',
    crisisTextDesc: 'Free 24/7 crisis counseling via text. Mental health support when you need it most.',
    caregiverMentalDesc: 'Caregiver depression is common. Seek your own counselor — you cannot pour from an empty cup.',
    pfMentalDesc: 'Depression and anxiety are common in Parkinson\'s. Help is available — ask your neurologist for referrals.',
  },
}
