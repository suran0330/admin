import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: () => '🏠',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: Rule => Rule.required(),
      initialValue: 'INKEY List - Science-Backed Skincare'
    }),
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'headline',
          title: 'Main Headline',
          type: 'string',
          initialValue: 'Science-Backed Skincare'
        }),
        defineField({
          name: 'subheadline',
          title: 'Subheadline',
          type: 'text',
          rows: 2,
          initialValue: 'Effective ingredients. Honest prices. Real results.'
        }),
        defineField({
          name: 'backgroundImage',
          title: 'Background Image',
          type: 'image',
          options: {
            hotspot: true,
          }
        }),
        defineField({
          name: 'ctaButton',
          title: 'Call to Action Button',
          type: 'object',
          fields: [
            {
              name: 'text',
              title: 'Button Text',
              type: 'string',
              initialValue: 'Shop Now'
            },
            {
              name: 'link',
              title: 'Button Link',
              type: 'url',
              initialValue: '/products'
            }
          ]
        })
      ]
    }),
    defineField({
      name: 'featuredProducts',
      title: 'Featured Products',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'product'}]
        }
      ],
      validation: Rule => Rule.max(6)
    }),
    defineField({
      name: 'aboutSection',
      title: 'About Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          initialValue: 'Why Choose INKEY List?'
        }),
        defineField({
          name: 'content',
          title: 'Content',
          type: 'array',
          of: [{type: 'block'}]
        })
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'heroSection.headline'
    }
  }
})
