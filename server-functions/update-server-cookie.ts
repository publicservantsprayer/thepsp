'use server'

import { cookies } from 'next/headers'

export async function updateServerCookie(name: string, value: string) {
  const cookieStore = await cookies()
  cookieStore.set(name, value, {
    maxAge: 365 * 24 * 60 * 60, // 1 year in seconds
    path: '/',
  })
}
