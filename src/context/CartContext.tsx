import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface CartItem {
  _id: string;
  productId: string;
  name: string;
  description: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  images: string[];
  category: string;
  subcategory: string;
}

interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: string, quantity: number, unitPrice: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number, unitPrice: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const getAuthHeaders = useCallback(() => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }), []);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: getAuthHeaders()
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getAuthHeaders]);

  const addToCart = useCallback(async (productId: string, quantity: number, unitPrice: number) => {
    if (loading) return; // Prevent multiple simultaneous calls
    
    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:5000/api/cart/add',
        { productId, quantity, unitPrice },
        { headers: getAuthHeaders() }
      );
      setCart(response.data);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loading, getAuthHeaders]);

  const updateCartItem = useCallback(async (itemId: string, quantity: number, unitPrice: number) => {
    if (loading) return;
    
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:5000/api/cart/items/${itemId}`,
        { quantity, unitPrice },
        { headers: getAuthHeaders() }
      );
      setCart(response.data);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loading, getAuthHeaders]);

  const removeFromCart = useCallback(async (itemId: string) => {
    if (loading) return;
    
    try {
      setLoading(true);
      const response = await axios.delete(
        `http://localhost:5000/api/cart/items/${itemId}`,
        { headers: getAuthHeaders() }
      );
      setCart(response.data);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loading, getAuthHeaders]);

  const clearCart = useCallback(async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const response = await axios.delete('http://localhost:5000/api/cart/clear', {
        headers: getAuthHeaders()
      });
      setCart(response.data);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loading, getAuthHeaders]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, refreshCart]);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}