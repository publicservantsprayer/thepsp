import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/components/footer'
import type { Theme, SxProps } from '@mui/material/styles'

import { Roboto, Frank_Ruhl_Libre } from 'next/font/google'
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

const frank = Frank_Ruhl_Libre({
  // weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-psp',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body id="__next" className={`${roboto.variable} ${frank.variable}`}>
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
