import { isLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { HomeClient } from './home-client'

type Props = {
  params: Promise<{ lang: string }>
}

export default async function LocalePage({ params }: Props) {
  const { lang } = await params

  if (!isLocale(lang)) {
    return null
  }

  const dictionary = await getDictionary(lang)

  return <HomeClient locale={lang as Locale} dictionary={dictionary} />
}