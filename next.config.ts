import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'
import { getURL } from './payload/utilities/getURL'

const url = new URL(getURL())

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
      {
        protocol: url.protocol.replace(':', '') as 'https' | 'http' | undefined,
        hostname: url.hostname,
      },
    ],
  },
}

export default withPayload(nextConfig)
