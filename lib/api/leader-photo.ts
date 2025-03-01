/**
 * Client-side utility function to upload cropped leader photos
 */
export async function uploadCroppedLeaderPhoto({
  formData,
  leaderPermaLink,
  revalidatePath,
}: {
  formData: FormData
  leaderPermaLink: string
  revalidatePath?: string
}) {
  // Add the leader permaLink to the form data
  formData.append('leaderPermaLink', leaderPermaLink)

  // Add revalidate path if provided
  if (revalidatePath) {
    formData.append('revalidatePath', revalidatePath)
  }

  try {
    // Send the form data to the API endpoint
    const response = await fetch('/api/leader-photo/upload', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with the correct boundary for FormData
    })

    // Parse the response
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to upload photo')
    }

    return result
  } catch (error) {
    console.error('Error uploading photo:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload photo',
    }
  }
}

/**
 * Client-side utility function to upload a photo from a URL
 */
export async function uploadLeaderPhotoFromUrl({
  url,
  leaderPermaLink,
  revalidatePath,
}: {
  url: string
  leaderPermaLink: string
  revalidatePath?: string
}) {
  try {
    // Send the request to the API endpoint
    const response = await fetch('/api/leader-photo/upload-from-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        leaderPermaLink,
        revalidatePath,
      }),
    })

    // Parse the response
    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to upload photo from URL')
    }

    return result
  } catch (error) {
    console.error('Error uploading photo from URL:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to upload photo from URL',
    }
  }
}
