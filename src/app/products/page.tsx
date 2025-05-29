"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

interface Product {
  id: string;
  name: string;
  shortDescription?: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  images: string[];
  category: string;
  skinTypes?: string[];
  concerns?: string[];
  inStock: boolean;
  featured?: boolean;
  sizes?: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock products data
  const mockProducts: Product[] = [
    {
      id: "hyaluronic-acid-serum",
      name: "Hyaluronic Acid Serum",
      shortDescription: "Plumps & hydrates for smoother skin",
      description: "A lightweight serum that holds up to 1000 times its weight in water, providing instant and long-lasting hydration.",
      price: "£7.99",
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=400&fit=crop"
      ],
      category: "Serums",
      skinTypes: ["Dry", "Normal", "Combination", "Oily"],
      concerns: ["Hydration", "Fine Lines", "Dryness"],
      inStock: true,
      featured: true,
      sizes: ["30ml"]
    },
    {
      id: "retinol-eye-cream",
      name: "Retinol Eye Cream",
      shortDescription: "Smooths fine lines around delicate eye area",
      description: "A gentle retinol formula specifically designed for the delicate eye area.",
      price: "£9.99",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
      ],
      category: "Eye Care",
      skinTypes: ["Normal", "Combination", "Dry"],
      concerns: ["Fine Lines", "Dark Circles", "Anti-Aging"],
      inStock: true,
      featured: true,
      sizes: ["15ml"]
    },
    {
      id: "niacinamide",
      name: "Niacinamide",
      shortDescription: "Controls oil production & minimizes pores",
      description: "A 10% niacinamide serum that helps control excess oil and reduce the appearance of enlarged pores.",
      price: "£5.99",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop"
      ],
      category: "Serums",
      skinTypes: ["Oily", "Combination", "Acne-Prone"],
      concerns: ["Excess Oil", "Large Pores", "Acne"],
      inStock: false,
      featured: false,
      sizes: ["30ml"]
    },
    {
      id: "vitamin-c-serum",
      name: "Vitamin C Serum",
      shortDescription: "Brightens & evens out skin tone",
      description: "A potent vitamin C serum that brightens skin and helps reduce dark spots.",
      price: "£9.99",
      originalPrice: "£12.99",
      image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop"
      ],
      category: "Serums",
      skinTypes: ["All Skin Types"],
      concerns: ["Dark Spots", "Dullness", "Uneven Tone"],
      inStock: true,
      featured: false,
      sizes: ["30ml"]
    }
  ];

  useEffect(() => {
    // Simulate loading products
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Stock filter
    if (stockFilter !== 'all') {
      filtered = filtered.filter(product =>
        stockFilter === 'inStock' ? product.inStock : !product.inStock
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, stockFilter]);

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <Link href="/products/new">
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* Stock Filter */}
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="all">All Stock Status</option>
                <option value="inStock">In Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Products ({filteredProducts.length})</span>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {product.shortDescription || product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{product.price}</TableCell>
                    <TableCell>
                      <Badge
                        variant={product.inStock ? "default" : "destructive"}
                        className={product.inStock ? "bg-green-100 text-green-800" : ""}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.featured && (
                        <Badge variant="outline" className="text-purple-600 border-purple-600">
                          Featured
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a
                              href={`https://inkey-list-clone.netlify.app/products/${product.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View in Store
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Get started by adding your first product'
                  }
                </p>
                <Link href="/products/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
