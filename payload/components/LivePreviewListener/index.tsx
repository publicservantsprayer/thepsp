'use client'
import { getURL } from '@/payload/utilities/getURL'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  const serverURL = getURL()
  return <PayloadLivePreview refresh={router.refresh} serverURL={serverURL} />
}
