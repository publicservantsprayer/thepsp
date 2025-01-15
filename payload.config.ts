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
import { Footer } from '@/payload/globals/Footer/config'
import { Header } from '@/payload/globals/Header/config'
import { getURL } from '@/payload/utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: getURL(),
  admin: {
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      // header: [
      //   {
      //     path: '@/payload/components/nav-bar#NavBar',
      //   },
      // ],
      afterNavLinks: ['@/payload/admin-views/after-nav-links#AfterNavLinks'],
      views: {
        LeadersView: {
          Component: '@/payload/admin-views/leaders#LeadersView',
          path: '/leaders',
        },
      },
    },
  },
  collections: [Users, Media, Pages, Posts, Categories],
  globals: [Header, Footer],
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
