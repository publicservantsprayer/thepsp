import { getURL } from '@/payload/utilities/getURL'

/**
 * Moved here from admin-app.ts because of 'server-only' code
 */

// Check if we want to use the development
export const devDatabaseId = process.env.FIREBASE_DEV_DATABASE_ID
export const useDev = devDatabaseId && getURL().includes('localhost')

export const leaderAlgoliaIndex = useDev ? 'dev-leaders' : 'psp-prod'
