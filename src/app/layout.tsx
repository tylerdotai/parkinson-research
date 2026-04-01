import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Parkinson Research Daily',
}

// Root layout - locale routing handled by proxy.ts
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
