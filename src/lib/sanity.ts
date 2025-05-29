// Sanity CMS Configuration for INKEY List Admin Dashboard
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity project configuration
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'zqetc89y',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Set to false for admin dashboard to get fresh data
  token: process.env.SANITY_API_TOKEN, // For write operations
}

// Create Sanity client
export const sanityClient = createClient(sanityConfig)

// Image URL builder
const builder = imageUrlBuilder(sanityClient)
export function urlFor(source: any) {
  return builder.image(source)
}

// Content fetching functions
export async function getHomepageContent() {
  try {
    const query = `*[_type == "homepage"][0]{
      title,
      heroSection{
        headline,
        subheadline,
        backgroundImage,
        ctaButton
      },
      featuredProducts[]->{
        name,
        slug,
        price,
        images,
        category
      },
      aboutSection,
      contentBlocks[]
    }`

    return await sanityClient.fetch(query)
  } catch (error) {
    console.error('Error fetching homepage content:', error)
    return getDemoHomepageContent()
  }
}

export async function getProducts() {
  try {
    const query = `*[_type == "product"] | order(name asc){
      _id,
      name,
      slug,
      shortDescription,
      description,
      price,
      compareAtPrice,
      images,
      category->{name, slug},
      skinTypes,
      tags,
      featured,
      inStock,
      stockLevel
    }`

    return await sanityClient.fetch(query)
  } catch (error) {
    console.error('Error fetching products:', error)
    return getDemoProducts()
  }
}

export async function getProduct(slug: string) {
  try {
    const query = `*[_type == "product" && slug.current == $slug][0]{
      _id,
      name,
      slug,
      shortDescription,
      description,
      price,
      compareAtPrice,
      images,
      category->{name, slug},
      skinTypes,
      tags,
      featured,
      inStock,
      stockLevel
    }`

    return await sanityClient.fetch(query, { slug })
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function getBlogPosts() {
  try {
    const query = `*[_type == "blogPost"] | order(publishedAt desc){
      _id,
      title,
      slug,
      excerpt,
      featuredImage,
      publishedAt,
      author,
      categories,
      featured
    }`

    return await sanityClient.fetch(query)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

export async function getSiteSettings() {
  try {
    const query = `*[_type == "siteSettings"][0]{
      siteName,
      logo,
      navigation,
      footer,
      socialMedia,
      primaryColor,
      secondaryColor
    }`

    return await sanityClient.fetch(query)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return getDemoSiteSettings()
  }
}

// Update functions (require API token)
export async function updateProduct(id: string, updates: any) {
  try {
    return await sanityClient.patch(id).set(updates).commit()
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export async function createProduct(productData: any) {
  try {
    return await sanityClient.create({
      _type: 'product',
      ...productData,
    })
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export async function deleteProduct(id: string) {
  try {
    return await sanityClient.delete(id)
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

// Upload image to Sanity
export async function uploadImageToSanity(file: File) {
  try {
    const asset = await sanityClient.assets.upload('image', file)
    return asset
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Demo data fallbacks when Sanity is not configured
function getDemoHomepageContent() {
  return {
    title: 'INKEY List - Science-Backed Skincare',
    heroSection: {
      headline: 'Science-Backed Skincare',
      subheadline: 'Effective ingredients. Honest prices. Real results.',
      ctaButton: {
        text: 'Shop Now',
        link: '/products'
      }
    },
    aboutSection: {
      title: 'Why Choose INKEY List?',
      content: 'We believe knowledge is power. Our products are formulated with effective ingredients and transparent pricing.'
    }
  }
}

function getDemoProducts() {
  return [
    {
      _id: 'demo-1',
      name: 'Hyaluronic Acid Serum',
      slug: { current: 'hyaluronic-acid' },
      shortDescription: 'Intensely hydrating serum for all skin types',
      price: 7.99,
      featured: true,
      inStock: true,
      stockLevel: 'in-stock',
      category: { name: 'Serums', slug: { current: 'serums' } }
    },
    {
      _id: 'demo-2',
      name: 'Niacinamide 10% + Zinc 1%',
      slug: { current: 'niacinamide' },
      shortDescription: 'Reduces appearance of blemishes and pores',
      price: 7.99,
      featured: true,
      inStock: true,
      stockLevel: 'in-stock',
      category: { name: 'Serums', slug: { current: 'serums' } }
    }
  ]
}

function getDemoSiteSettings() {
  return {
    siteName: 'INKEY List',
    navigation: [
      { title: 'Products', url: '/products' },
      { title: 'Ingredients', url: '/ingredients' },
      { title: 'About', url: '/about' }
    ],
    socialMedia: {
      instagram: 'https://instagram.com/theinkeylist',
      tiktok: 'https://tiktok.com/@theinkeylist'
    }
  }
}

// Content status checking
export async function checkSanityConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const result = await sanityClient.fetch('*[_type == "homepage"][0]._id')
    return {
      connected: true,
      message: 'Successfully connected to Sanity CMS'
    }
  } catch (error) {
    return {
      connected: false,
      message: 'Not connected to Sanity CMS - using demo data'
    }
  }
}
