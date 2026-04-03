import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Against Parkinson',
}

// Root layout - locale routing handled by proxy.ts
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
