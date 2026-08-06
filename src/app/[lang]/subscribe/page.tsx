import type { Metadata } from 'next'
import { getDictionary } from '@/lib/dictionary'
import { SubscribeClient } from './subscribe-client'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { localizedMetadata } from '@/lib/seo'

type Props = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const dictionary = await getDictionary(lang)
  return {
    ...localizedMetadata(lang, '/subscribe'),
    title: dictionary.subscribe.title,
    description: dictionary.subscribe.subtitle,
  }
}

export default async function SubscribePage({ params }: Props) {
  const { lang } = await params
  const dictionary = await getDictionary(lang)

  return (
    <>
      <Nav />
      <main id="main-content">
        <SubscribeClient
          locale={lang}
          dictionary={dictionary.subscribe}
        />
      </main>
      <Footer />
    </>
  )
}