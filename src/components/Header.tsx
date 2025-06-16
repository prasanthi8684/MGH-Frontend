import React from 'react';
import { Sun, Moon, LogOut,ShoppingCart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

import { Link, useNavigate } from 'react-router-dom';
import { SearchBar } from './SearchBar';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
    const { cart } = useCart();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
                              to="/"
                              className="text-3xl text-red-600 hover:text-red-500 font-medium"
                            >
                              MHG
                            </Link>
          </div>
          
          <SearchBar />

          <div className="flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart && cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.totalItems > 99 ? '99+' : cart.totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}