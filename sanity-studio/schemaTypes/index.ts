import {type SchemaTypeDefinition} from 'sanity'

import homepage from './homepage'
import product from './product'
import category from './category'
import blogPost from './blogPost'
import siteSettings from './siteSettings'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [
    homepage,
    product,
    category,
    blogPost,
    siteSettings,
  ],
}
