import { DocumentReference, Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'

export const zodFirestoreDocumentId = z.string().length(256)

export const zodFirestoreDocumentReference = z.custom<DocumentReference>(
  (val) => {
    return (
      val &&
      typeof val['id'] === 'string' &&
      typeof val['path'] === 'string' &&
      val instanceof DocumentReference
    )
  },
)

// A serializable version of a Firestore document reference
export const zodSimpleDocumentRef = z.object({
  id: zodFirestoreDocumentId,
  path: z.string(),
})

export const zodFirestoreTimestamp = z.custom<Timestamp>((val) => {
  return val && typeof val['toDate'] === 'function'
})

export type ZodFirestoreTimestamp = z.infer<typeof zodFirestoreTimestamp>
