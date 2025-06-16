import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, ShoppingCart, X, Edit3 } from 'lucide-react';
import { Product, SelectedProduct, Proposal } from '../../types/product';
import { ProductCard } from './ProductCard';
import { SelectedProductsList } from './SelectedProductsList';
import { ProposalForm } from './ProposalForm';

export const CreateProposal = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Premium Corporate Gift Set',
        description: 'Elegant gift set with branded items including notebook, pen, and mug',
        price: 45.99,
        category: 'Gift Sets',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
        inStock: true,
        sku: 'CGS-001'
      },
      {
        id: '2',
        name: 'Custom Branded Notebook',
        description: 'High-quality leather-bound notebook with custom logo embossing',
        price: 18.50,
        category: 'Stationery',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        inStock: true,
        sku: 'NBK-002'
      },
      {
        id: '3',
        name: 'Wireless Charging Pad',
        description: 'Sleek wireless charging pad with custom branding options',
        price: 32.00,
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
        inStock: true,
        sku: 'WCP-003'
      },
      {
        id: '4',
        name: 'Eco-Friendly Tote Bag',
        description: 'Sustainable cotton tote bag with custom printing',
        price: 12.75,
        category: 'Bags',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        inStock: true,
        sku: 'ETB-004'
      },
      {
        id: '5',
        name: 'Stainless Steel Water Bottle',
        description: 'Insulated water bottle with laser engraving options',
        price: 24.99,
        category: 'Drinkware',
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
        inStock: true,
        sku: 'SWB-005'
      },
      {
        id: '6',
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with custom logo placement',
        price: 55.00,
        category: 'Technology',
        image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
        inStock: false,
        sku: 'BTS-006'
      }
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleProductSelect = (product: Product) => {
    const existingProduct = selectedProducts.find(p => p.id === product.id);
    
    if (existingProduct) {
      setSelectedProducts(prev =>
        prev.map(p =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      );
    } else {
      setSelectedProducts(prev => [
        ...prev,
        { ...product, quantity: 1 }
      ]);
    }
  };

  const handleProductRemove = (productId: string) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleProductRemove(productId);
      return;
    }

    setSelectedProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, quantity }
          : p
      )
    );
  };

  const handleCustomPriceChange = (productId: string, customPrice: number) => {
    setSelectedProducts(prev =>
      prev.map(p =>
        p.id === productId
          ? { ...p, customPrice }
          : p
      )
    );
  };

  const totalAmount = selectedProducts.reduce((sum, product) => {
    const price = product.customPrice || product.price;
    return sum + (price * product.quantity);
  }, 0);

  const handleCreateProposal = (proposalData: Omit<Proposal, 'id' | 'products' | 'totalAmount' | 'createdAt'>) => {
    const newProposal: Proposal = {
      ...proposalData,
      id: Date.now().toString(),
      products: selectedProducts,
      totalAmount,
      createdAt: new Date().toISOString(),
    };

    console.log('Creating proposal:', newProposal);
    // Here you would typically send this to your API
    
    // Reset form
    setSelectedProducts([]);
    setShowProposalForm(false);
    alert('Proposal created successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Proposal</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Select products to include in your proposal
          </p>
        </div>
        
        {selectedProducts.length > 0 && (
          <button
            onClick={() => setShowProposalForm(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Edit3 className="h-5 w-5" />
            Create Proposal ({selectedProducts.length} items)
          </button>
        )}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 dark:bg-gray-700 dark:text-white appearance-none"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={handleProductSelect}
                isSelected={selectedProducts.some(p => p.id === product.id)}
                selectedQuantity={selectedProducts.find(p => p.id === product.id)?.quantity || 0}
              />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Selected Products Sidebar */}
        <div className="lg:col-span-1">
          <SelectedProductsList
            selectedProducts={selectedProducts}
            onQuantityChange={handleQuantityChange}
            onCustomPriceChange={handleCustomPriceChange}
            onRemove={handleProductRemove}
            totalAmount={totalAmount}
          />
        </div>
      </div>

      {/* Proposal Form Modal */}
      {showProposalForm && (
        <ProposalForm
          selectedProducts={selectedProducts}
          totalAmount={totalAmount}
          onSubmit={handleCreateProposal}
          onClose={() => setShowProposalForm(false)}
        />
      )}
    </div>
  );
};