import { serverSanity, validateSanityConfig } from './sanity';

// Ensure Sanity is properly configured
validateSanityConfig();

// Product operations
export async function createProduct(productData: any) {
  try {
    const result = await serverSanity.create({
      _type: 'product',
      ...productData
    });
    return result;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(productId: string, updates: any) {
  try {
    const result = await serverSanity
      .patch(productId)
      .set(updates)
      .commit();
    return result;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(productId: string) {
  try {
    const result = await serverSanity.delete(productId);
    return result;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Category operations
export async function createCategory(categoryData: any) {
  try {
    const result = await serverSanity.create({
      _type: 'category',
      ...categoryData
    });
    return result;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

// Content operations
export async function updateHomepage(homepageData: any) {
  try {
    // First, try to get existing homepage document
    const existing = await serverSanity.fetch(
      `*[_type == "homepage"][0]`
    );

    if (existing) {
      // Update existing
      const result = await serverSanity
        .patch(existing._id)
        .set(homepageData)
        .commit();
      return result;
    } else {
      // Create new
      const result = await serverSanity.create({
        _type: 'homepage',
        ...homepageData
      });
      return result;
    }
  } catch (error) {
    console.error('Error updating homepage:', error);
    throw error;
  }
}

// Banner operations
export async function createBanner(bannerData: any) {
  try {
    const result = await serverSanity.create({
      _type: 'banner',
      ...bannerData
    });
    return result;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
}

export async function updateBanner(bannerId: string, updates: any) {
  try {
    const result = await serverSanity
      .patch(bannerId)
      .set(updates)
      .commit();
    return result;
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
}

// Generic query function
export async function queryContent(query: string) {
  try {
    const result = await serverSanity.fetch(query);
    return result;
  } catch (error) {
    console.error('Error querying content:', error);
    throw error;
  }
}
