'use client'

import { ThemeProvider as MUIThemeProvider } from '@material-ui/core'
import theme from '@/utilities/theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
}
