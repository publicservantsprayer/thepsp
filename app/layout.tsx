import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Footer from '@/components/footer'
import type { Theme, SxProps } from '@mui/material/styles'

import { Roboto } from 'next/font/google'
import { UsaStateProvider } from '@/hooks/use-usa-state'
import { NextThemeProvider } from '@/components/next-theme-provider'

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface HTMLAttributes<T> {
    sx?: SxProps<Theme>
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface SVGProps<T> {
    sx?: SxProps<Theme>
  }
}
declare module '@mui/material-pigment-css' {
  interface ThemeArgs {
    theme: Theme
  }
}

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: "Public Servants' Prayer",
  description: 'what description?',
}

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        id="__next"
        className={`${roboto.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <UsaStateProvider>
            {children}
            <Footer />
          </UsaStateProvider>
        </NextThemeProvider>
      </body>
    </html>
  )
}
