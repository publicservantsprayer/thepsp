import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from '@/payload/collections/Users'
import { Media } from '@/payload/collections/Media'
import { Pages } from '@/payload/collections/Pages'
import { Posts } from '@/payload/collections/Posts'
import { plugins } from '@/payload/plugins'
import { Categories } from '@/payload/collections/Categories'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      header: [
        {
          path: '@/payload/components/nav-bar#NavBar',
        },
      ],
      // views: {
      //   beforeLogin:
      // },
    },
  },
  collections: [Users, Media, Pages, Posts, Categories],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_DATABASE_URI || '',
    connectOptions: {
      dbName: process.env.MONGODB_DATABASE_NAME || '',
    },
  }),
  sharp,
  plugins: [...plugins],
})
