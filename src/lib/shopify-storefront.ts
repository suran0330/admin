// Shopify Storefront API Client for Product Display
const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || process.env.SHOPIFY_SHOP_DOMAIN!;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  compareAtPriceRange?: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        compareAtPrice?: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        quantityAvailable?: number;
      };
    }>;
  };
  tags: string[];
  productType: string;
  vendor: string;
  availableForSale: boolean;
  seo?: {
    title?: string;
    description?: string;
  };
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: {
    url: string;
    altText?: string;
  };
}

async function shopifyStorefrontFetch(query: string, variables = {}) {
  const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`GraphQL error: ${data.errors[0].message}`);
  }

  return data.data;
}

// Get all products
export async function getShopifyProducts(limit = 50): Promise<ShopifyProduct[]> {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            handle
            title
            description
            featuredImage {
              url
              altText
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  compareAtPrice {
                    amount
                    currencyCode
                  }
                  availableForSale
                  quantityAvailable
                }
              }
            }
            tags
            productType
            vendor
            availableForSale
            seo {
              title
              description
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyStorefrontFetch(query, { first: limit });
    return data.products.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return [];
  }
}

// Get single product by handle
export async function getShopifyProduct(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        handle
        title
        description
        featuredImage {
          url
          altText
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              availableForSale
              quantityAvailable
            }
          }
        }
        tags
        productType
        vendor
        availableForSale
        seo {
          title
          description
        }
      }
    }
  `;

  try {
    const data = await shopifyStorefrontFetch(query, { handle });
    return data.productByHandle;
  } catch (error) {
    console.error('Error fetching Shopify product:', error);
    return null;
  }
}

// Get collections
export async function getShopifyCollections(): Promise<ShopifyCollection[]> {
  const query = `
    query getCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            handle
            title
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyStorefrontFetch(query, { first: 20 });
    return data.collections.edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('Error fetching Shopify collections:', error);
    return [];
  }
}

// Create checkout
export async function createShopifyCheckout(lineItems: Array<{
  variantId: string;
  quantity: number;
}>) {
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          totalTax {
            amount
            currencyCode
          }
          totalPrice {
            amount
            currencyCode
          }
          lineItems(first: 250) {
            edges {
              node {
                id
                title
                quantity
                variant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    id
                    title
                    handle
                  }
                }
              }
            }
          }
        }
        checkoutUserErrors {
          field
          message
        }
      }
    }
  `;

  try {
    const data = await shopifyStorefrontFetch(query, {
      input: { lineItems }
    });

    if (data.checkoutCreate.checkoutUserErrors.length > 0) {
      throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
    }

    return data.checkoutCreate.checkout;
  } catch (error) {
    console.error('Error creating Shopify checkout:', error);
    throw error;
  }
}

// Format price for display
export function formatShopifyPrice(price: { amount: string; currencyCode: string }): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  });

  return formatter.format(Number.parseFloat(price.amount));
}

// Check if product is on sale
export function isProductOnSale(product: ShopifyProduct): boolean {
  return product.variants.edges.some(variant =>
    variant.node.compareAtPrice &&
    Number.parseFloat(variant.node.compareAtPrice.amount) > Number.parseFloat(variant.node.price.amount)
  );
}

// Get product discount percentage
export function getDiscountPercentage(product: ShopifyProduct): number {
  const variant = product.variants.edges[0]?.node;
  if (!variant?.compareAtPrice) return 0;

  const originalPrice = Number.parseFloat(variant.compareAtPrice.amount);
  const salePrice = Number.parseFloat(variant.price.amount);

  return Math.round((1 - salePrice / originalPrice) * 100);
}
