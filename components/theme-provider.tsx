'use client'
import {
  ThemeProvider as MUIThemeProvider,
  Theme,
  StyledEngineProvider,
} from '@mui/material'
import theme from '@/utilities/theme'

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
}

export type { Theme }
export { StyledEngineProvider }
