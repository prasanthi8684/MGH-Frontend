import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  // Remove StrictMode in development to prevent double API calls
  // <StrictMode>
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  // </StrictMode>
);