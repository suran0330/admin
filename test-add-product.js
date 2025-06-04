const products = [
  {
    name: "Hyaluronic Acid Serum",
    slug: { current: "hyaluronic-acid-serum" },
    description: "A lightweight serum that provides instant and lasting hydration. Hyaluronic acid holds up to 1000 times its weight in water, making it ideal for plumping and smoothing the skin.",
    price: 7.99,
    skinConcerns: ["Hydration", "Dryness", "Fine Lines"],
    ingredients: ["Hyaluronic Acid", "Water", "Pentylene Glycol"],
    benefits: ["Provides instant hydration", "Plumps fine lines", "Suitable for all skin types"],
    howToUse: "Apply 2-3 drops to clean skin morning and evening. Follow with moisturizer.",
    inStock: true,
    featured: true
  },
  {
    name: "Niacinamide 10%",
    slug: { current: "niacinamide" },
    description: "A 10% niacinamide serum that helps control excess oil production and reduce the appearance of enlarged pores.",
    price: 5.99,
    skinConcerns: ["Oil Control", "Large Pores", "Uneven Texture"],
    ingredients: ["Niacinamide 10%", "Water", "Pentylene Glycol", "Zinc PCA"],
    benefits: ["Controls excess oil", "Minimizes pore appearance", "Evens skin tone"],
    howToUse: "Apply 2-3 drops to clean skin morning and evening. Start with once daily if new to niacinamide.",
    inStock: true,
    featured: true
  },
  {
    name: "Retinol Eye Cream",
    slug: { current: "retinol-eye-cream" },
    description: "A gentle retinol formula specifically designed for the delicate eye area.",
    price: 9.99,
    skinConcerns: ["Fine Lines", "Dark Circles", "Eye Area Aging"],
    ingredients: ["Retinol", "Squalane", "Ceramides", "Peptides"],
    benefits: ["Reduces fine lines", "Gentle for eye area", "Improves skin texture"],
    howToUse: "Apply a small amount around the eye area before bed. Start 2-3 times per week.",
    inStock: true,
    featured: false
  }
];

async function testAddProducts() {
  console.log('🧪 Testing product creation via admin API...');

  for (const product of products) {
    try {
      console.log(`\n📦 Creating product: ${product.name}`);

      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`✅ Success: ${result.product?.name || 'Product created'}`);
        console.log(`   ID: ${result.product?._id}`);
        console.log(`   Source: ${result.source}`);
      } else {
        console.log(`❌ Failed: ${result.error}`);
        console.log(`   Details: ${result.details}`);
      }
    } catch (error) {
      console.log(`💥 Error: ${error.message}`);
    }
  }

  // Test GET to see if products are listed
  console.log('\n📋 Testing product listing...');
  try {
    const response = await fetch('http://localhost:3000/api/products');
    const result = await response.json();

    console.log(`📊 Products found: ${result.count || 0}`);
    console.log(`   Source: ${result.source}`);
    console.log(`   Success: ${result.success}`);
  } catch (error) {
    console.log(`💥 Error listing products: ${error.message}`);
  }
}

testAddProducts();
