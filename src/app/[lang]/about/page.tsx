import type { Metadata } from 'next'
import Image from 'next/image'
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

  return (
    <div className="py-16 md:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <section className="mb-16">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            <div className="flex-shrink-0">
              <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-xl shadow-pap-purple/10">
                <Image
                  src="/images/founder-hockey.png"
                  alt={t.founderPhotoAlt}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <div className="text-center md:text-left">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-pap-purple mb-4">
                {t.founderLabel}
              </p>
              <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-normal leading-[1.1] tracking-tight text-pap-text mb-4">
                Built by a caregiver, for families like mine
              </h1>
              <p className="text-base text-pap-muted max-w-xl">
                {t.whyItMatters}
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12 max-w-3xl">
          <p className="text-lg text-pap-text leading-relaxed">
            {t.whatItsAbout}
          </p>
        </section>

        <section className="mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-pap-purple mb-4">
            {t.whatsTracked}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: t.clinicalTrials.title, desc: t.clinicalTrials.desc },
              { title: t.breakthroughs.title, desc: t.breakthroughs.desc },
              { title: t.lifestyle.title, desc: t.lifestyle.desc },
              { title: t.emerging.title, desc: t.emerging.desc },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl p-4 border border-pap-border"
                style={{ background: 'var(--pap-surface)' }}
              >
                <h3 className="font-medium text-sm mb-1 text-pap-text">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-pap-muted">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl">
          <p className="text-sm text-pap-dim">
            {t.disclaimer}
          </p>
        </section>
      </div>
    </div>
  )
}