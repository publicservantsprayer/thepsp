'use client'

import { Button } from '@/components/ui/button'
import { checkLeadersForPhoto } from '@/server-functions/check-leaders-for-photo'
import React from 'react'

export function CheckLeadersForPhotoButton() {
  const handleCheckLeadersForPhoto = async () => {
    await checkLeadersForPhoto()
  }

  return (
    <div>
      <Button onClick={handleCheckLeadersForPhoto} className="rounded-xl">
        Check Leaders for Photo
      </Button>
    </div>
  )
}
