'use client'

import React from 'react'
import Typography from '@mui/material/Typography'
import Container from '@mui/material-pigment-css/Container'
import Box from '@mui/material-pigment-css/Box'
import Link from 'next/link'

export default function Footer() {
  return (
    <Box p={3} pt={8} bgcolor="common.black">
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="space-around">
          <Box p={2}>
            <Link href="/about">About</Link>
          </Box>
          <Box p={2}>
            <Link href="/privacy-policy">
              <Typography variant="body2" noWrap>
                Privacy Policy
              </Typography>
            </Link>
          </Box>
          <Box p={2}>
            <Link href="/our-partners">
              <Typography variant="body2" noWrap>
                Partners
              </Typography>
            </Link>
          </Box>
        </Box>
        <Box display="flex" justifyContent="center">
          <Box p={3}>© 2019 Public Servants&apos; Prayer.</Box>
        </Box>
      </Container>
    </Box>
  )
}
