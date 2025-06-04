// Shopify Checkout Integration - Handles cart, checkout, and payments

export interface ShopifyCheckoutItem {
  variantId: string;
  quantity: number;
  customAttributes?: Array<{
    key: string;
    value: string;
  }>;
}

export interface ShopifyCheckout {
  id: string;
  webUrl: string;
  subtotalPrice: {
    amount: string;
    currencyCode: string;
  };
  totalTax: {
    amount: string;
    currencyCode: string;
  };
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: ShopifyLineItem[];
  shippingAddress?: ShopifyAddress;
  billingAddress?: ShopifyAddress;
  shippingLine?: {
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
  };
  completedAt?: string;
}

export interface ShopifyLineItem {
  id: string;
  title: string;
  quantity: number;
  variant: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    product: {
      id: string;
      title: string;
      handle: string;
    };
  };
}

export interface ShopifyAddress {
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
  phone?: string;
}

export interface ShopifyShippingRate {
  handle: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
}

class ShopifyCheckoutClient {
  private domain: string;
  private storefrontAccessToken: string;
  private apiVersion = '2024-01';

  constructor() {
    this.domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN || '';
    this.storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
  }

  private async graphqlRequest(query: string, variables?: any) {
    const endpoint = `https://${this.domain}/api/${this.apiVersion}/graphql.json`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': this.storefrontAccessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (result.errors) {
      throw new Error(`GraphQL error: ${result.errors[0].message}`);
    }

    return result.data;
  }

  // Create a new checkout
  async createCheckout(lineItems: ShopifyCheckoutItem[] = []): Promise<ShopifyCheckout> {
    const query = `
      mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
            subtotalPrice {
              amount
              currencyCode
            }
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

    const variables = {
      input: {
        lineItems: lineItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
          customAttributes: item.customAttributes || [],
        })),
      },
    };

    const data = await this.graphqlRequest(query, variables);

    if (data.checkoutCreate.checkoutUserErrors.length > 0) {
      throw new Error(data.checkoutCreate.checkoutUserErrors[0].message);
    }

    return this.formatCheckout(data.checkoutCreate.checkout);
  }

  // Add items to existing checkout
  async addToCheckout(checkoutId: string, lineItems: ShopifyCheckoutItem[]): Promise<ShopifyCheckout> {
    const query = `
      mutation checkoutLineItemsAdd($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
        checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
          checkout {
            id
            webUrl
            subtotalPrice {
              amount
              currencyCode
            }
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

    const variables = {
      checkoutId,
      lineItems: lineItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        customAttributes: item.customAttributes || [],
      })),
    };

    const data = await this.graphqlRequest(query, variables);

    if (data.checkoutLineItemsAdd.checkoutUserErrors.length > 0) {
      throw new Error(data.checkoutLineItemsAdd.checkoutUserErrors[0].message);
    }

    return this.formatCheckout(data.checkoutLineItemsAdd.checkout);
  }

  // Update line item quantities
  async updateCheckoutLineItems(checkoutId: string, lineItems: Array<{
    id: string;
    quantity: number;
  }>): Promise<ShopifyCheckout> {
    const query = `
      mutation checkoutLineItemsUpdate($checkoutId: ID!, $lineItems: [CheckoutLineItemUpdateInput!]!) {
        checkoutLineItemsUpdate(checkoutId: $checkoutId, lineItems: $lineItems) {
          checkout {
            id
            webUrl
            subtotalPrice {
              amount
              currencyCode
            }
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

    const variables = {
      checkoutId,
      lineItems,
    };

    const data = await this.graphqlRequest(query, variables);

    if (data.checkoutLineItemsUpdate.checkoutUserErrors.length > 0) {
      throw new Error(data.checkoutLineItemsUpdate.checkoutUserErrors[0].message);
    }

    return this.formatCheckout(data.checkoutLineItemsUpdate.checkout);
  }

  // Remove items from checkout
  async removeFromCheckout(checkoutId: string, lineItemIds: string[]): Promise<ShopifyCheckout> {
    const query = `
      mutation checkoutLineItemsRemove($checkoutId: ID!, $lineItemIds: [ID!]!) {
        checkoutLineItemsRemove(checkoutId: $checkoutId, lineItemIds: $lineItemIds) {
          checkout {
            id
            webUrl
            subtotalPrice {
              amount
              currencyCode
            }
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

    const variables = {
      checkoutId,
      lineItemIds,
    };

    const data = await this.graphqlRequest(query, variables);

    if (data.checkoutLineItemsRemove.checkoutUserErrors.length > 0) {
      throw new Error(data.checkoutLineItemsRemove.checkoutUserErrors[0].message);
    }

    return this.formatCheckout(data.checkoutLineItemsRemove.checkout);
  }

  // Get checkout by ID
  async getCheckout(checkoutId: string): Promise<ShopifyCheckout> {
    const query = `
      query getCheckout($checkoutId: ID!) {
        node(id: $checkoutId) {
          ... on Checkout {
            id
            webUrl
            subtotalPrice {
              amount
              currencyCode
            }
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
            shippingAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              country
              zip
              phone
            }
            shippingLine {
              title
              price {
                amount
                currencyCode
              }
            }
            completedAt
          }
        }
      }
    `;

    const data = await this.graphqlRequest(query, { checkoutId });

    if (!data.node) {
      throw new Error('Checkout not found');
    }

    return this.formatCheckout(data.node);
  }

  // Update shipping address
  async updateShippingAddress(checkoutId: string, shippingAddress: ShopifyAddress): Promise<ShopifyCheckout> {
    const query = `
      mutation checkoutShippingAddressUpdate($checkoutId: ID!, $shippingAddress: MailingAddressInput!) {
        checkoutShippingAddressUpdateV2(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
          checkout {
            id
            webUrl
            availableShippingRates {
              ready
              shippingRates {
                handle
                title
                price {
                  amount
                  currencyCode
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

    const data = await this.graphqlRequest(query, {
      checkoutId,
      shippingAddress,
    });

    if (data.checkoutShippingAddressUpdateV2.checkoutUserErrors.length > 0) {
      throw new Error(data.checkoutShippingAddressUpdateV2.checkoutUserErrors[0].message);
    }

    return this.formatCheckout(data.checkoutShippingAddressUpdateV2.checkout);
  }

  // Get available shipping rates
  async getShippingRates(checkoutId: string): Promise<ShopifyShippingRate[]> {
    const query = `
      query getShippingRates($checkoutId: ID!) {
        node(id: $checkoutId) {
          ... on Checkout {
            availableShippingRates {
              ready
              shippingRates {
                handle
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;

    const data = await this.graphqlRequest(query, { checkoutId });

    if (!data.node?.availableShippingRates?.ready) {
      throw new Error('Shipping rates not ready. Please add a shipping address first.');
    }

    return data.node.availableShippingRates.shippingRates;
  }

  // Apply shipping rate
  async updateShippingLine(checkoutId: string, shippingRateHandle: string): Promise<ShopifyCheckout> {
    const query = `
      mutation checkoutShippingLineUpdate($checkoutId: ID!, $shippingRateHandle: String!) {
        checkoutShippingLineUpdate(checkoutId: $checkoutId, shippingRateHandle: $shippingRateHandle) {
          checkout {
            id
            webUrl
            subtotalPrice {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            totalPrice {
              amount
              currencyCode
            }
            shippingLine {
              title
              price {
                amount
                currencyCode
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

    const data = await this.graphqlRequest(query, {
      checkoutId,
      shippingRateHandle,
    });

    if (data.checkoutShippingLineUpdate.checkoutUserErrors.length > 0) {
      throw new Error(data.checkoutShippingLineUpdate.checkoutUserErrors[0].message);
    }

    return this.formatCheckout(data.checkoutShippingLineUpdate.checkout);
  }

  // Apply discount code
  async applyDiscountCode(checkoutId: string, discountCode: string): Promise<ShopifyCheckout> {
    const query = `
      mutation checkoutDiscountCodeApplyV2($checkoutId: ID!, $discountCode: String!) {
        checkoutDiscountCodeApplyV2(checkoutId: $checkoutId, discountCode: $discountCode) {
          checkout {
            id
            webUrl
            subtotalPrice {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            totalPrice {
              amount
              currencyCode
            }
            discountApplications(first: 10) {
              edges {
                node {
                  allocationMethod
                  targetSelection
                  targetType
                  value {
                    ... on MoneyV2 {
                      amount
                      currencyCode
                    }
                    ... on PricingPercentageValue {
                      percentage
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

    const data = await this.graphqlRequest(query, {
      checkoutId,
      discountCode,
    });

    if (data.checkoutDiscountCodeApplyV2.checkoutUserErrors.length > 0) {
      throw new Error(data.checkoutDiscountCodeApplyV2.checkoutUserErrors[0].message);
    }

    return this.formatCheckout(data.checkoutDiscountCodeApplyV2.checkout);
  }

  private formatCheckout(rawCheckout: any): ShopifyCheckout {
    return {
      id: rawCheckout.id,
      webUrl: rawCheckout.webUrl,
      subtotalPrice: rawCheckout.subtotalPrice,
      totalTax: rawCheckout.totalTax,
      totalPrice: rawCheckout.totalPrice,
      lineItems: rawCheckout.lineItems?.edges?.map((edge: any) => edge.node) || [],
      shippingAddress: rawCheckout.shippingAddress,
      billingAddress: rawCheckout.billingAddress,
      shippingLine: rawCheckout.shippingLine,
      completedAt: rawCheckout.completedAt,
    };
  }
}

// Singleton instance
export const shopifyCheckout = new ShopifyCheckoutClient();

// Helper functions for React components
export function formatPrice(price: { amount: string; currencyCode: string }): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
  });

  return formatter.format(Number.parseFloat(price.amount));
}

export function calculateLineItemTotal(lineItem: ShopifyLineItem): number {
  return Number.parseFloat(lineItem.variant.price.amount) * lineItem.quantity;
}

export function getCheckoutUrl(checkoutId: string): string {
  return `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/cart/${checkoutId.replace('gid://shopify/Checkout/', '')}`;
}

// Local storage helpers for cart persistence
export function saveCheckoutId(checkoutId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('shopify_checkout_id', checkoutId);
  }
}

export function getCheckoutId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('shopify_checkout_id');
  }
  return null;
}

export function clearCheckoutId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('shopify_checkout_id');
  }
}
