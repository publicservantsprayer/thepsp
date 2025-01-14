import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'square',
        width: 1024,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1600,
        height: 900,
        position: 'centre',
      },
      {
        name: 'thumbnail2x',
        width: 400 * 2,
        height: 300 * 2,
        position: 'centre',
      },
      {
        name: 'card2x',
        width: 768 * 2,
        height: 1024 * 2,
        position: 'centre',
      },
      {
        name: 'square2x',
        width: 1024 * 2,
        height: 1024 * 2,
        position: 'centre',
      },
      {
        name: 'hero2x',
        width: 1600 * 2,
        height: 900 * 2,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
