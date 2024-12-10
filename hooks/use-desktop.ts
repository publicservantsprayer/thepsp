import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export function useDesktop() {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.up('sm'))
}
