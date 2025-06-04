const fs = require('fs');
const path = require('path');

// Real INKEY List products data
const inkeyListProducts = [
  {
    id: 'hyaluronic-acid-serum-001',
    handle: 'hyaluronic-acid-serum',
    title: 'Hyaluronic Acid Serum',
    description: 'A lightweight serum that holds up to 1000 times its weight in water, providing instant and long-lasting hydration for all skin types. This powerful humectant helps plump fine lines and leaves skin looking dewy and refreshed.',
    price: 7.99,
    compareAtPrice: 9.99,
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=400&fit=crop'
    ],
    category: 'Serums',
    skinConcerns: ['Hydration', 'Fine Lines', 'Dryness'],
    ingredients: ['Hyaluronic Acid', 'Water', 'Pentylene Glycol'],
    benefits: ['Provides instant hydration', 'Plumps fine lines', 'Suitable for all skin types'],
    howToUse: 'Apply 2-3 drops to clean skin morning and evening. Follow with moisturizer.',
    inStock: true,
    featured: true,
    variants: [
      {
        id: 'ha-serum-30ml',
        name: '30ml',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop'
      }
    ],
    seo: {
      title: 'Hyaluronic Acid Serum - Deep Hydration | The INKEY List',
      description: 'Powerful hydrating serum with hyaluronic acid. Plumps skin and reduces fine lines.',
      keywords: 'hyaluronic acid, serum, hydration, anti-aging'
    },
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'niacinamide-serum-002',
    handle: 'niacinamide',
    title: 'Niacinamide 10%',
    description: 'A 10% niacinamide serum that helps control excess oil production and reduce the appearance of enlarged pores. This powerful ingredient also helps even skin tone and improve overall skin texture.',
    price: 5.99,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop'
    ],
    category: 'Serums',
    skinConcerns: ['Oil Control', 'Large Pores', 'Uneven Texture'],
    ingredients: ['Niacinamide 10%', 'Water', 'Pentylene Glycol', 'Zinc PCA'],
    benefits: ['Controls excess oil', 'Minimizes pore appearance', 'Evens skin tone'],
    howToUse: 'Apply 2-3 drops to clean skin morning and evening. Start with once daily if new to niacinamide.',
    inStock: true,
    featured: true,
    variants: [
      {
        id: 'niacinamide-30ml',
        name: '30ml',
        price: 5.99
      }
    ],
    seo: {
      title: 'Niacinamide 10% Serum - Oil Control | The INKEY List',
      description: '10% niacinamide serum for oil control and pore minimization.',
      keywords: 'niacinamide, oil control, pores, serum'
    },
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'retinol-eye-cream-003',
    handle: 'retinol-eye-cream',
    title: 'Retinol Eye Cream',
    description: 'A gentle retinol formula specifically designed for the delicate eye area. Helps reduce the appearance of fine lines and improve skin texture while being gentle enough for nightly use.',
    price: 9.99,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop'
    ],
    category: 'Eye Care',
    skinConcerns: ['Fine Lines', 'Dark Circles', 'Eye Area Aging'],
    ingredients: ['Retinol', 'Squalane', 'Ceramides', 'Peptides'],
    benefits: ['Reduces fine lines', 'Gentle for eye area', 'Improves skin texture'],
    howToUse: 'Apply a small amount around the eye area before bed. Start 2-3 times per week and build up tolerance.',
    inStock: true,
    featured: false,
    variants: [
      {
        id: 'retinol-eye-15ml',
        name: '15ml',
        price: 9.99
      }
    ],
    seo: {
      title: 'Retinol Eye Cream - Anti-Aging | The INKEY List',
      description: 'Gentle retinol eye cream for fine lines and dark circles.',
      keywords: 'retinol, eye cream, anti-aging, fine lines'
    },
    createdAt: new Date('2024-02-01').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'vitamin-c-serum-004',
    handle: 'vitamin-c-serum',
    title: 'Vitamin C Serum',
    description: 'A potent vitamin C serum with 30% L-Ascorbic Acid that brightens skin and helps reduce dark spots. Enhanced with vitamin E for antioxidant protection and improved stability.',
    price: 9.99,
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop'
    ],
    category: 'Serums',
    skinConcerns: ['Dark Spots', 'Dullness', 'Uneven Skin Tone'],
    ingredients: ['L-Ascorbic Acid 30%', 'Vitamin E', 'Water', 'Propylene Glycol'],
    benefits: ['Brightens complexion', 'Reduces dark spots', 'Antioxidant protection'],
    howToUse: 'Apply 2-3 drops to clean skin in the morning. Always follow with SPF. Start with every other day.',
    inStock: false,
    featured: false,
    variants: [
      {
        id: 'vitamin-c-30ml',
        name: '30ml',
        price: 9.99
      }
    ],
    seo: {
      title: 'Vitamin C Serum - Brightening | The INKEY List',
      description: 'Potent vitamin C serum for brightening and dark spot reduction.',
      keywords: 'vitamin c, brightening, dark spots, antioxidant'
    },
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'caffeine-eye-serum-005',
    handle: 'caffeine-eye-serum',
    title: 'Caffeine Eye Serum',
    description: 'An energizing eye serum with 5% caffeine solution that helps reduce puffiness and the appearance of dark circles. The lightweight formula absorbs quickly for instant refreshment.',
    price: 6.99,
    images: [
      'https://images.unsplash.com/photo-1594824704818-61db69c33bb3?w=400&h=400&fit=crop'
    ],
    category: 'Eye Care',
    skinConcerns: ['Puffiness', 'Dark Circles', 'Tired Eyes'],
    ingredients: ['Caffeine 5%', 'Epigallocatechin Gallatyl Glucoside', 'Water'],
    benefits: ['Reduces puffiness', 'Minimizes dark circles', 'Energizes tired eyes'],
    howToUse: 'Apply 1-2 drops around the eye area morning and evening. Gently pat in with ring finger.',
    inStock: true,
    featured: true,
    variants: [
      {
        id: 'caffeine-eye-15ml',
        name: '15ml',
        price: 6.99
      }
    ],
    seo: {
      title: 'Caffeine Eye Serum - Depuffing | The INKEY List',
      description: 'Caffeine eye serum to reduce puffiness and dark circles.',
      keywords: 'caffeine, eye serum, puffiness, dark circles'
    },
    createdAt: new Date('2024-02-15').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'salicylic-acid-cleanser-006',
    handle: 'salicylic-acid-cleanser',
    title: 'Salicylic Acid Cleanser',
    description: 'A gentle daily cleanser with 2% salicylic acid that helps unclog pores and remove dead skin cells. Perfect for oily and blemish-prone skin without over-drying.',
    price: 8.99,
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
    ],
    category: 'Cleansers',
    skinConcerns: ['Acne', 'Blackheads', 'Clogged Pores'],
    ingredients: ['Salicylic Acid 2%', 'Cocamidopropyl Betaine', 'Water'],
    benefits: ['Unclogs pores', 'Removes dead skin cells', 'Gentle on skin'],
    howToUse: 'Use morning and evening. Apply to damp skin, massage gently, and rinse thoroughly with water.',
    inStock: true,
    featured: false,
    variants: [
      {
        id: 'sa-cleanser-150ml',
        name: '150ml',
        price: 8.99
      }
    ],
    seo: {
      title: 'Salicylic Acid Cleanser - Acne Treatment | The INKEY List',
      description: 'Gentle salicylic acid cleanser for acne-prone skin.',
      keywords: 'salicylic acid, cleanser, acne, pores'
    },
    createdAt: new Date('2024-02-20').toISOString(),
    updatedAt: new Date().toISOString()
  }
];

async function initializeProductsDatabase() {
  console.log('🚀 Initializing admin products database with real INKEY List products...');

  const dataDir = path.join(process.cwd(), 'src', 'data');
  const productsFile = path.join(dataDir, 'products.json');

  try {
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('📁 Created data directory');
    }

    // Write products to JSON file
    fs.writeFileSync(productsFile, JSON.stringify(inkeyListProducts, null, 2));
    console.log(`✅ Initialized products database with ${inkeyListProducts.length} INKEY List products`);
    console.log(`📄 Database file: ${productsFile}`);

    // Log summary
    console.log('\n📊 Products Summary:');
    inkeyListProducts.forEach(product => {
      console.log(`   ${product.title} - £${product.price} (${product.inStock ? 'In Stock' : 'Out of Stock'})`);
    });

    console.log('\n🎯 Featured Products:');
    const featured = inkeyListProducts.filter(p => p.featured);
    featured.forEach(product => {
      console.log(`   ⭐ ${product.title}`);
    });

    console.log('\n📂 Categories:');
    const categories = [...new Set(inkeyListProducts.map(p => p.category))];
    categories.forEach(category => {
      const count = inkeyListProducts.filter(p => p.category === category).length;
      console.log(`   ${category}: ${count} products`);
    });

  } catch (error) {
    console.error('❌ Error initializing products database:', error);
    process.exit(1);
  }
}

initializeProductsDatabase();
