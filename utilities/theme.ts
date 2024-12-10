'use client'

import { createTheme } from '@mui/material'

export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    contrastThreshold: 3,
    tonalOffset: 0.2,
    primary: {
      main: '#4F6EC0',
    },
    secondary: {
      main: '#ffe082',
    },
    background: {
      // dark: '#212121',
    },
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
    h1: {
      fontSize: '4rem',
    },
    h2: {
      fontSize: '3.5rem',
    },
    h3: {
      fontSize: '3rem',
    },
  },
  components: {
    // Style sheet name
    MuiLink: {
      styleOverrides: {
        // Name of the rule
        root: {
          // CSS
          color: 'white',
        },
      },
    },
  },
})
