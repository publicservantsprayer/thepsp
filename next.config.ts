import { withPigment, PigmentOptions } from '@pigment-css/nextjs-plugin'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
}

const pigmentConfig: PigmentOptions = {
  transformLibraries: ['@mui/material'],
}

export default withPigment(nextConfig, pigmentConfig)
