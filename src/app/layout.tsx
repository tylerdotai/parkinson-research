import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Against Parkinson',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
