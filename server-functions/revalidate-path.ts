'use server'

import { revalidatePath as nextRevalidatePath } from 'next/cache'

// TODO: add mustGetAdminUser
export async function revalidatePath(path: string) {
  nextRevalidatePath(path)
}
