import { DocumentReference, Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'

export const zodFirestoreDocumentId = z
  .string()
  .length(256)
  .describe('The unique identifier from the database')

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

export const zodFirestoreDocumentReferenceDto = z.object({
  id: zodFirestoreDocumentId,
  path: z.string(),
})

export const zodFirestoreTimestamp = z.custom<Timestamp>((val) => {
  return val && typeof val['toDate'] === 'function'
})

export type ZodFirestoreTimestamp = z.infer<typeof zodFirestoreTimestamp>
