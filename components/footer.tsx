'use client'

import React from 'react'
import Typography from '@mui/material/Typography'
import Container from '@mui/material-pigment-css/Container'
import { Link } from '@/components/ui/link'

export default function Footer() {
  return (
    <div sx={{ p: 3, pt: 8, bgcolor: 'common.black' }}>
      <Container maxWidth="sm">
        <div sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <div sx={{ p: 2 }}>
            <Link href="/about">About</Link>
          </div>
          <div sx={{ p: 2 }}>
            <Link href="/privacy-policy">
              <Typography variant="body2" noWrap>
                Privacy Policy
              </Typography>
            </Link>
          </div>
          <div sx={{ p: 2 }}>
            <Link href="/our-partners">
              <Typography variant="body2" noWrap>
                Partners
              </Typography>
            </Link>
          </div>
        </div>
        <div sx={{ display: 'flex', justifyContent: 'center' }}>
          <div sx={{ p: 3 }}>© 2019 Public Servants&apos; Prayer.</div>
        </div>
      </Container>
    </div>
  )
}
