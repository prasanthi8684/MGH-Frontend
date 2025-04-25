import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { SmartGiftingPage } from '../pages/SmartGiftingPage';
import { SmartCatalogPage } from '../pages/SmartCatalogPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { DigitalGiftingPage } from '../pages/DigitalGiftingPage';
import { SmartProposalPage } from '../pages/SmartProposalPage';
import { CreateProposalPage } from '../pages/CreateProposalPage';
import { QuotationsPage } from '../pages/QuotationsPage';
import { OrdersPage } from '../pages/OrdersPage';
import { ProfilePage } from '../pages/ProfilePage';
import { BrandingPage } from '../pages/BrandingPage';
import { SecurityPage } from '../pages/SecurityPage';
import { AddressBookPage } from '../pages/AddressBookPage';
import { ForgotPassword } from './auth/ForgotPassword';
import { ResetPassword } from './auth/ResetPassword';

export function MainContent() {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/smart-gifting" element={<SmartGiftingPage />} />
          <Route path="/smart-catalog" element={<SmartCatalogPage />} />
          <Route path="/smart-catalog/:id" element={<ProductDetailPage />} />
          <Route path="/digital-gifting/:id" element={<ProductDetailPage />} />
          <Route path="/digital-gifting" element={<DigitalGiftingPage />} />
          <Route path="/smart-proposal" element={<SmartProposalPage />} />
          <Route path="/smart-proposal/create" element={<CreateProposalPage />} />
          <Route path="/quotations" element={<QuotationsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/branding" element={<BrandingPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/address-book" element={<AddressBookPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </main>
  );
}