import type { NextConfig } from 'next'
import { withPigment, PigmentOptions } from '@pigment-css/nextjs-plugin'
import { theme } from './utilities/theme'

const nextConfig: NextConfig = {
  /* config options here */
}

const pigmentConfig: PigmentOptions = {
  transformLibraries: ['@mui/material'],
  theme,
}

export default withPigment(nextConfig, pigmentConfig)
