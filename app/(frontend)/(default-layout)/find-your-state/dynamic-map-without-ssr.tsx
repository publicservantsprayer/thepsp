'use client'

import dynamic from 'next/dynamic'

// Dynamically import the map component to prevent it from being rendered on the server.
// Some libraries it uses are failing with the window object not being available.
export const DynamicMapWithoutSSR = dynamic(() => import('./map'), {
  ssr: false,
})
