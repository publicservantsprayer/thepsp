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
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/v0/b/leader-photo-upload.appspot.com/o/',
      },
      {
        protocol: url.protocol.replace(':', '') as 'https' | 'http' | undefined,
        hostname: url.hostname,
      },
    ],
  },

  transpilePackages: ['react-filerobot-image-editor', 'tippy.js'],
  webpack: (config) => {
    config.externals = [...config.externals, 'canvas', 'jsdom']
    return config
  },
}

export default withPayload(nextConfig)
