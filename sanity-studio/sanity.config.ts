import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'

import {schema} from './schemaTypes'

export default defineConfig({
  name: 'inkey-list-admin',
  title: 'INKEY List Content Studio',

  projectId: 'zqetc89y',
  dataset: 'production',

  plugins: [deskTool(), visionTool()],

  schema: schema,
})
