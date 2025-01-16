'use client'

import React from 'react'

import { Button } from '@/components/ui/button'
import { checkLeadersForPhoto } from '@/server-functions/check-leaders-for-photo'
import { stateCodes } from '@/data/states'

export function CheckLeadersForPhotoButton() {
  const [loading, startTransition] = React.useTransition()
  const [results, setResults] = React.useState<string[]>([])
  const [showResults, setShowResults] = React.useState(false)

  const handleCheckLeadersForPhoto = async () => {
    setResults([])
    startTransition(async () => {
      await Promise.all(
        stateCodes.map(async (stateCode) => {
          const stateResults = await checkLeadersForPhoto(stateCode)
          setResults((prev) => [...prev, ...stateResults])
        }),
      )
      setShowResults(true)
    })
  }

  return (
    <div>
      <Button
        onClick={handleCheckLeadersForPhoto}
        loading={loading}
        disabled={loading}
      >
        Check Leaders for Photo
      </Button>
      {showResults && (
        <div className="grid gap-4">
          <div className="text-xs">
            {results.map((result) => (
              <div key={result}>{result}</div>
            ))}
          </div>
          <div>Updated {results.length} leaders.</div>
          {results.length === 0 && (
            <div>
              All leader <code className="text-code">hasPhoto</code> fields are
              correct.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
