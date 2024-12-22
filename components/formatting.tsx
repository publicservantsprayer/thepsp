import React, { ReactNode } from 'react'
import Typography from '@mui/material/Typography'

interface Props {
  children: ReactNode
}

export const H1 = ({ children }: Props) => (
  <Typography variant="h1" component="h1" gutterBottom>
    {children}
  </Typography>
)

export const H2 = ({ children }: Props) => (
  <Typography variant="h2" component="h2" gutterBottom>
    {children}
  </Typography>
)

export const H3 = ({ children }: Props) => (
  <Typography variant="h3" component="h2" gutterBottom>
    {children}
  </Typography>
)

export const H4 = ({ children }: Props) => (
  <Typography variant="h4" component="h2" gutterBottom>
    {children}
  </Typography>
)

export const H5 = ({ children }: Props) => (
  <Typography variant="h5" component="h2" gutterBottom>
    {children}
  </Typography>
)

export const H6 = ({ children }: Props) => (
  <Typography variant="h6" component="h2" gutterBottom>
    {children}
  </Typography>
)

export const P = ({ children }: Props) => (
  <Typography variant="body1" component="p" align="left">
    {children}
  </Typography>
)

export const P2 = ({ children }: Props) => (
  <Typography variant="body2" component="p" align="left">
    {children}
  </Typography>
)
