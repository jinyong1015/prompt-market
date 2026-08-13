import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { StoreProvider } from '@/lib/store'
import { SiteHeader } from '@/components/site-header'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Prompt Market — 최신 AI 프롬프트 마켓플레이스',
  description: '검증된 AI 프롬프트를 사고파는 마켓플레이스. 이미지, 일러스트, 브랜딩 프롬프트를 만나보세요.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#6d4aec',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`light bg-background ${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="antialiased font-sans">
        <StoreProvider>
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster position="bottom-right" richColors duration={1800} />
        </StoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
