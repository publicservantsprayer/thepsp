import NextLink from 'next/link'
import MuiLink from '@mui/material/Link'

export function Link({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <MuiLink component={NextLink} href={href} sx={{ color: 'white' }}>
      {children}
    </MuiLink>
  )
}
