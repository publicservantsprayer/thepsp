'use client'

import MuiDefaultPropsProvider from '@mui/material/DefaultPropsProvider'

export function DefaultPropsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MuiDefaultPropsProvider
      value={{
        MuiPaper: {
          elevation: 6,
        },
        MuiLink: {
          underline: 'always',
        },
      }}
    >
      {children}
    </MuiDefaultPropsProvider>
  )
}
