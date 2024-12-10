import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

export function useMobile() {
  const theme = useTheme()
  return !useMediaQuery(theme.breakpoints.up('sm'))
}
