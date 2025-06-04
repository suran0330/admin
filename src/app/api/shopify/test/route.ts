import { NextResponse } from 'next/server';
import { shopifyAdminClient } from '@/lib/shopify-admin';
import { getShopifyProducts } from '@/lib/shopify-storefront';

export async function GET() {
  try {
    const results = {
      adminAPI: null as any,
      storefrontAPI: null as any,
      overall: 'unknown' as 'success' | 'partial' | 'failed',
      timestamp: new Date().toISOString(),
    };

    // Test Admin API
    try {
      console.log('Testing Shopify Admin API...');
      const shopInfo = await shopifyAdminClient.testConnection();
      results.adminAPI = {
        status: 'success',
        shop: {
          name: shopInfo.shop.name,
          domain: shopInfo.shop.domain,
          currency: shopInfo.shop.currency,
          timezone: shopInfo.shop.timezone,
        },
        message: 'Admin API connection successful'
      };
      console.log('Admin API test successful');
    } catch (adminError) {
      console.error('Admin API test failed:', adminError);
      results.adminAPI = {
        status: 'failed',
        error: adminError instanceof Error ? adminError.message : 'Unknown admin API error',
        message: 'Admin API connection failed'
      };
    }

    // Test Storefront API
    try {
      console.log('Testing Shopify Storefront API...');
      const products = await getShopifyProducts(5);
      results.storefrontAPI = {
        status: 'success',
        productCount: products.length,
        sampleProducts: products.slice(0, 3).map(p => ({
          id: p.id,
          title: p.title,
          handle: p.handle,
          available: p.availableForSale
        })),
        message: `Storefront API connection successful - ${products.length} products found`
      };
      console.log(`Storefront API test successful - ${products.length} products found`);
    } catch (storefrontError) {
      console.error('Storefront API test failed:', storefrontError);
      results.storefrontAPI = {
        status: 'failed',
        error: storefrontError instanceof Error ? storefrontError.message : 'Unknown storefront API error',
        message: 'Storefront API connection failed'
      };
    }

    // Determine overall status
    if (results.adminAPI?.status === 'success' && results.storefrontAPI?.status === 'success') {
      results.overall = 'success';
    } else if (results.adminAPI?.status === 'success' || results.storefrontAPI?.status === 'success') {
      results.overall = 'partial';
    } else {
      results.overall = 'failed';
    }

    const statusCode = results.overall === 'failed' ? 500 : results.overall === 'partial' ? 206 : 200;

    return NextResponse.json({
      success: results.overall !== 'failed',
      status: results.overall,
      message: `Shopify integration test ${results.overall}`,
      results,
      config: {
        shopDomain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN,
        hasAdminToken: !!process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
        hasStorefrontToken: !!process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        apiVersion: process.env.SHOPIFY_API_VERSION,
      }
    }, { status: statusCode });

  } catch (error) {
    console.error('Shopify test error:', error);

    return NextResponse.json({
      success: false,
      status: 'failed',
      message: 'Shopify integration test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Test specific Shopify operations
export async function POST() {
  try {
    const operations = {
      getProducts: null as any,
      getOrders: null as any,
      getLocations: null as any,
      timestamp: new Date().toISOString(),
    };

    // Test getting products
    try {
      const { products } = await shopifyAdminClient.getProducts({ limit: 10 });
      operations.getProducts = {
        status: 'success',
        count: products.length,
        message: `Successfully retrieved ${products.length} products`
      };
    } catch (error) {
      operations.getProducts = {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to retrieve products'
      };
    }

    // Test getting orders
    try {
      const { orders } = await shopifyAdminClient.getOrders({ limit: 5 });
      operations.getOrders = {
        status: 'success',
        count: orders.length,
        message: `Successfully retrieved ${orders.length} orders`
      };
    } catch (error) {
      operations.getOrders = {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to retrieve orders'
      };
    }

    // Test getting locations
    try {
      const { locations } = await shopifyAdminClient.getLocations();
      operations.getLocations = {
        status: 'success',
        count: locations.length,
        primary: locations.find(l => l.primary)?.name || 'None',
        message: `Successfully retrieved ${locations.length} locations`
      };
    } catch (error) {
      operations.getLocations = {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to retrieve locations'
      };
    }

    const successCount = Object.values(operations).filter((op: any) => op?.status === 'success').length;
    const overallSuccess = successCount >= 2; // At least 2 operations should succeed

    return NextResponse.json({
      success: overallSuccess,
      message: `Shopify operations test - ${successCount}/3 operations successful`,
      operations,
    }, { status: overallSuccess ? 200 : 500 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Shopify operations test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
