import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Image as ImageIcon, X, Loader2, Minus } from 'lucide-react';
import axios from 'axios';
import { Toast } from '../../components/ui/Toast';

interface PriceTier {
  minQuantity: number;
  maxQuantity: number;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  priceTiers: PriceTier[];
  quantity: number;
  category: string;
  subcategory: string;
  images: string[];
}

interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
  category: string;
}

interface ValidationErrors {
  basePrice?: string;
  quantity?: string;
  images?: string;
  priceTiers?: string;
}

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: 0,
    priceTiers: [] as PriceTier[],
    quantity: 0,
    category: '',
    subcategory: '',
    images: [] as File[]
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      const [productsRes, categoriesRes, subcategoriesRes] = await Promise.all([
        axios.get('http://143.198.212.38:5000/api/admin/products', { headers }),
        axios.get('http://143.198.212.38:5000/api/admin/categories', { headers }),
        axios.get('http://143.198.212.38:5000/api/admin/subcategories', { headers })
      ]);

      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setSubcategories(subcategoriesRes.data);
    } catch (error) {
      setMessage({
        text: 'Error fetching data',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    let isValid = true;

    // Base price validation
    if (formData.basePrice <= 0) {
      errors.basePrice = 'Base price must be greater than 0';
      isValid = false;
    }

    // Quantity validation
    if (formData.quantity < 0) {
      errors.quantity = 'Quantity cannot be negative';
      isValid = false;
    }
    if (!Number.isInteger(formData.quantity)) {
      errors.quantity = 'Quantity must be a whole number';
      isValid = false;
    }

    // Price tiers validation
    if (formData.priceTiers.length > 0) {
      const sortedTiers = [...formData.priceTiers].sort((a, b) => a.minQuantity - b.minQuantity);

      for (let i = 0; i < sortedTiers.length; i++) {
        const tier = sortedTiers[i];

        // Check if minQuantity is less than maxQuantity
        if (tier.minQuantity >= tier.maxQuantity) {
          errors.priceTiers = 'Min quantity must be less than max quantity for all tiers';
          isValid = false;
          break;
        }

        // Check for overlapping ranges
        if (i > 0) {
          const prevTier = sortedTiers[i - 1];
          if (tier.minQuantity <= prevTier.maxQuantity) {
            errors.priceTiers = 'Price tier ranges cannot overlap';
            isValid = false;
            break;
          }
        }

        // Check if price is valid
        if (tier.price <= 0) {
          errors.priceTiers = 'All tier prices must be greater than 0';
          isValid = false;
          break;
        }
      }
    }

    // Image validation
    if (!selectedProduct && formData.images.length === 0) {
      errors.images = 'At least one image is required';
      isValid = false;
    }

    // Image size validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (formData.images.some(file => file.size > maxSize)) {
      errors.images = 'Each image must be less than 5MB';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      // Validate file types
      const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
      if (invalidFiles.length > 0) {
        setMessage({
          text: 'Only image files are allowed',
          type: 'error'
        });
        return;
      }

      // Validate file sizes
      const maxSize = 5 * 1024 * 1024; // 5MB
      const oversizedFiles = files.filter(file => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        setMessage({
          text: 'Each image must be less than 5MB',
          type: 'error'
        });
        return;
      }

      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));

      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);

      // Clear any existing image validation errors
      setValidationErrors(prev => ({ ...prev, images: undefined }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));

    URL.revokeObjectURL(imagePreviewUrls[index]);
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const addPriceTier = () => {
    setFormData(prev => ({
      ...prev,
      priceTiers: [...prev.priceTiers, { minQuantity: 1, maxQuantity: 10, price: 0 }]
    }));
  };

  const removePriceTier = (index: number) => {
    setFormData(prev => ({
      ...prev,
      priceTiers: prev.priceTiers.filter((_, i) => i !== index)
    }));
  };

  const updatePriceTier = (index: number, field: keyof PriceTier, value: number) => {
    setFormData(prev => ({
      ...prev,
      priceTiers: prev.priceTiers.map((tier, i) =>
        i === index ? { ...tier, [field]: value } : tier
      )
    }));
    // Clear validation errors when user starts typing
    setValidationErrors(prev => ({ ...prev, priceTiers: undefined }));
  };

  const getPriceForQuantity = (quantity: number): number => {
    const sortedTiers = [...formData.priceTiers].sort((a, b) => a.minQuantity - b.minQuantity);

    for (const tier of sortedTiers) {
      if (quantity >= tier.minQuantity && quantity <= tier.maxQuantity) {
        return tier.price;
      }
    }

    return formData.basePrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();

      // Append product data
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('basePrice', formData.basePrice.toString());
      formDataToSend.append('priceTiers', JSON.stringify(formData.priceTiers));
      formDataToSend.append('quantity', formData.quantity.toString());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('subcategory', formData.subcategory);

      // Append images
      formData.images.forEach(file => {
        formDataToSend.append('images', file);
      });

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };

      if (selectedProduct) {
        await axios.put(
          `http://143.198.212.38:5000/api/admin/products/${selectedProduct._id}`,
          formDataToSend,
          { headers }
        );
        setMessage({
          text: 'Product updated successfully',
          type: 'success'
        });
      } else {
        await axios.post('http://localhost:5000/api/admin/products', formDataToSend, { headers });
        setMessage({
          text: 'Product created successfully',
          type: 'success'
        });
      }

      setIsModalOpen(false);
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        basePrice: 0,
        priceTiers: [],
        quantity: 0,
        category: '',
        subcategory: '',
        images: []
      });
      setImagePreviewUrls([]);
      setValidationErrors({});
      fetchData();
    } catch (error) {
      setMessage({
        text: 'Error saving product',
        type: 'error'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://143.198.212.38:5000/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({
        text: 'Product deleted successfully',
        type: 'success'
      });
      fetchData();
    } catch (error) {
      setMessage({
        text: 'Error deleting product',
        type: 'error'
      });
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      basePrice: product.basePrice,
      priceTiers: product.priceTiers || [],
      quantity: product.quantity,
      category: product.category,
      subcategory: product.subcategory,
      images: []
    });
    setImagePreviewUrls(product.images);
    setIsModalOpen(true);
  };

  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {message && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <button
          onClick={() => {
            setSelectedProduct(null);
            setFormData({
              name: '',
              description: '',
              basePrice: 0,
              priceTiers: [],
              quantity: 0,
              category: '',
              subcategory: '',
              images: []
            });
            setImagePreviewUrls([]);
            setIsModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Base Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price Tiers
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {product.images[0] && (
                      <img height="50px;" width="50px;" src={Array.isArray(product?.images) && product.images[0] ? product.images[0] : ''} />

                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.category}</div>
                  <div className="text-sm text-gray-500">{product.subcategory}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">RM {product.basePrice?.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.priceTiers && product.priceTiers.length > 0 ? (
                      <div className="space-y-1">
                        {product.priceTiers.map((tier, index) => (
                          <div key={index} className="text-xs">
                            {tier.minQuantity}-{tier.maxQuantity}: RM {tier.price.toFixed(2)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No tiers</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-amber-600 hover:text-amber-900 mr-4"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-6">
              {selectedProduct ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="smart-catalog">Smart-Catalog</option>
                    <option value="digital-gifting">Digital-Gifting</option>

                  </select>


                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price (RM)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => {
                      setFormData({ ...formData, basePrice: parseFloat(e.target.value) });
                      setValidationErrors({ ...validationErrors, basePrice: undefined });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.basePrice
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-amber-500'
                      }`}
                    required
                  />
                  {validationErrors.basePrice && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.basePrice}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => {
                      setFormData({ ...formData, quantity: parseInt(e.target.value) });
                      setValidationErrors({ ...validationErrors, quantity: undefined });
                    }}
                    className={`w-full px-3 py-2 border rounded-lg ${validationErrors.quantity
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-amber-500'
                      }`}
                    required
                  />
                  {validationErrors.quantity && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.quantity}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                {/* Price Tiers Section */}
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity-Based Price Tiers
                    </label>
                    <button
                      type="button"
                      onClick={addPriceTier}
                      className="flex items-center px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Tier
                    </button>
                  </div>

                  {validationErrors.priceTiers && (
                    <p className="mb-2 text-sm text-red-500">{validationErrors.priceTiers}</p>
                  )}

                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {formData.priceTiers.map((tier, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Min Qty</label>
                          <input
                            type="number"
                            value={tier.minQuantity}
                            onChange={(e) => updatePriceTier(index, 'minQuantity', parseInt(e.target.value))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            min="1"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Max Qty</label>
                          <input
                            type="number"
                            value={tier.maxQuantity}
                            onChange={(e) => updatePriceTier(index, 'maxQuantity', parseInt(e.target.value))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            min="1"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500">Price (RM)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={tier.price}
                            onChange={(e) => updatePriceTier(index, 'price', parseFloat(e.target.value))}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            min="0"
                            required
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePriceTier(index)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {formData.priceTiers.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Price Preview:</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>Qty 1: RM {getPriceForQuantity(1).toFixed(2)}</div>
                        <div>Qty 25: RM {getPriceForQuantity(25).toFixed(2)}</div>
                        <div>Qty 100: RM {getPriceForQuantity(100).toFixed(2)}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-4 ${validationErrors.images
                    ? 'border-red-500'
                    : 'border-gray-300'
                    }`}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                      <span className="mt-2 text-sm text-gray-500">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-xs text-gray-400">
                        PNG, JPG up to 5MB
                      </span>
                    </label>
                  </div>
                  {validationErrors.images && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.images}</p>
                  )}

                  {/* Image previews */}
                  {imagePreviewUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedProduct(null);
                    setImagePreviewUrls([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600"
                >
                  {selectedProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}