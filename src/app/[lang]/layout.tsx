import { notFound } from 'next/navigation'
import { Nav } from '@/components/nav'
import { Footer } from '@/components/footer'
import { isLocale, type Locale } from '@/lib/i18n/config'

type Props = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

const VALID_LOCALES: Locale[] = ['en', 'es']

export async function generateStaticParams() {
  return VALID_LOCALES.map((lang) => ({ lang }))
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params

  if (!isLocale(lang)) {
    notFound()
  }

  return (
    <>
      <Nav />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  )
}