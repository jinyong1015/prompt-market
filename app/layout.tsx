import { ClerkProvider } from "@clerk/nextjs"
import { koKR } from "@clerk/localizations/ko-KR"
import { shadcn } from "@clerk/ui/themes"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const gaId = process.env.NEXT_PUBLIC_GA_ID

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Prompt Market — AI Prompt Marketplace",
  description:
    "A marketplace for curated AI prompts. Discover image, illustration, and branding prompts.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6d4aec" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1628" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={`bg-background ${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <ClerkProvider localization={koKR} appearance={{ theme: shadcn }}>
          <Providers>
            <div className="flex min-h-dvh flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
            </div>
            <Toaster position="bottom-right" richColors duration={1800} />
          </Providers>
          {process.env.NODE_ENV === "production" && <Analytics />}
        </ClerkProvider>
      </body>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </html>
  )
}