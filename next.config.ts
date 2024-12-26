import type { NextConfig } from 'next'
import { withPigment, PigmentOptions } from '@pigment-css/nextjs-plugin'
import { theme } from './utilities/theme'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
}

const pigmentConfig: PigmentOptions = {
  transformLibraries: ['@mui/material'],
  theme,
}

export default withPigment(nextConfig, pigmentConfig)
