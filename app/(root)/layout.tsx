import type { Metadata } from 'next'
import './globals.css'
import { Roboto, Frank_Ruhl_Libre, Lato } from 'next/font/google'

import { UsaStateProvider } from '@/hooks/use-usa-state'
import { NextThemeProvider } from '@/components/next-theme-provider'
import { cn } from '@/lib/utils'
import { Providers } from '@/payload/providers'

export const metadata: Metadata = {
  title: "Public Servants' Prayer",
  description: 'Prayer can change the course of history.',
}

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

const frank = Frank_Ruhl_Libre({
  // weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-psp',
})

const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          roboto.variable,
          frank.variable,
          lato.variable,
          'font-roboto',
        )}
      >
        <NextThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <UsaStateProvider>
            <Providers>{children}</Providers>
          </UsaStateProvider>
        </NextThemeProvider>
        <div>K_REVISION_URL: {process.env.K_REVISION_URL}</div>
        <div>K_CONFIGURATION: {process.env.K_CONFIGURATION}</div>
        <div>K_REVISION_NAME: {process.env.K_REVISION_NAME}</div>
        <div>NEXT_PUBLIC_SERVER_URL: {process.env.NEXT_PUBLIC_SERVER_URL}</div>
      </body>
    </html>
  )
}
