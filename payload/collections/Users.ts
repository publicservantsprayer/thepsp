import { getCurrentUser } from '@/lib/firebase/server/auth'
import type { CollectionConfig, User } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    disableLocalStrategy: true,
    strategies: [
      {
        name: 'firebase-strategy',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        authenticate: async ({ payload, headers }) => {
          const currentUser = await getCurrentUser()
          // console.log('currentUser', currentUser)

          if (!currentUser) return { user: null }

          const usersQuery = await payload.find({
            collection: 'users',
            where: {
              email: {
                equals: currentUser.email,
              },
            },
          })
          const userDoc = usersQuery.docs[0]

          // Send null if no user should be authenticated
          if (!userDoc) return { user: null }

          const user: User = {
            id: userDoc.id,
            email: userDoc.email as string,
            createdAt: userDoc.createdAt,
            updatedAt: userDoc.updatedAt,
            // Returned user also needs the collection property
            collection: 'users',
          }

          return {
            // Send the user back to authenticate,
            user,

            // Optionally, you can return headers
            // that you'd like Payload to set here when
            // it returns the response
            // responseHeaders: new Headers({
            //   'some-header': 'my header value',
            // }),
          }
        },
      },
    ],
  },
  fields: [
    // Email added by default (although needed here to be able to query)
    // Add more fields as needed
    {
      name: 'email',
      type: 'email',
    },
  ],
}
