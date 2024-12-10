import { createTheme } from '@mui/material/styles'

export const darkTheme = createTheme({
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
      dark: '#212121',
    },
  },
  typography: {
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
  overrides: {
    // Style sheet name
    MuiLink: {
      // Name of the rule
      root: {
        // CSS
        color: 'white',
      },
    },
  },
  props: {
    MuiPaper: {
      elevation: 6,
    },
    MuiLink: {
      underline: 'always',
    },
  },
})

export default darkTheme
