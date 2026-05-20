import { isLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/dictionary'
import { HomeClient } from './home-client'
import { getAllReportDates, getReportMetadata } from '@/lib/reports'

type Props = {
  params: Promise<{ lang: string }>
}

export default async function LocalePage({ params }: Props) {
  const { lang } = await params

  if (!isLocale(lang)) {
    return null
  }

  const dictionary = await getDictionary(lang)

  const dates = await getAllReportDates(lang)
  const latestDate = dates[0]
  const latestReport = latestDate ? getReportMetadata(latestDate, lang) : null

  return (
    <HomeClient
      locale={lang as Locale}
      dictionary={dictionary}
      latestReport={latestReport ? { date: latestDate, preview: latestReport.preview } : null}
    />
  )
}