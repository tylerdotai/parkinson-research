import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Parkinson Research Daily',
}

// Root layout redirects to default locale
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Redirect to default locale
  redirect('/en')
}
