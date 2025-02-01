import axios from 'axios'

interface DownloadResult {
  buffer: Buffer
  contentType: string
}

export async function downloadImage(
  url: string,
  maxRetries = 3,
): Promise<DownloadResult> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        maxRedirects: 5,
        timeout: 10000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      })

      const contentType = response.headers['content-type']
      if (!contentType?.startsWith('image/')) {
        throw new Error(`Invalid content type: ${contentType}`)
      }

      return {
        buffer: Buffer.from(response.data),
        contentType,
      }
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error('Unknown error occurred')
      console.error(`Attempt ${attempt + 1} failed:`, lastError.message)

      if (attempt === maxRetries - 1) {
        throw new Error(
          `Failed to download image after ${maxRetries} attempts: ${lastError.message}`,
        )
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000),
      )
    }
  }

  throw lastError
}
