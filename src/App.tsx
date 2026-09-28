import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, Footer } from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import WishlistPage from './pages/WishlistPage';
import DrugOrderPage from './pages/DrugOrderPage';
import DrugOrderStatusPage from './pages/DrugOrderStatusPage';
import LoginPage from './pages/LoginPage';
import AccountPage, { AccountOrdersPage, AccountDrugOrdersPage, AccountAddressesPage } from './pages/AccountPages';
import AdminDashboard from './pages/AdminDashboard';

function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Shop Routes */}
        <Route path="/" element={<ShopLayout><HomePage /></ShopLayout>} />
        <Route path="/products" element={<ShopLayout><ProductsPage /></ShopLayout>} />
        <Route path="/products/:slug" element={<ShopLayout><ProductDetailPage /></ShopLayout>} />
        <Route path="/cart" element={<ShopLayout><CartPage /></ShopLayout>} />
        <Route path="/checkout" element={<ShopLayout><CheckoutPage /></ShopLayout>} />
        <Route path="/checkout/confirmation/:orderId" element={<ShopLayout><OrderConfirmationPage /></ShopLayout>} />
        <Route path="/wishlist" element={<ShopLayout><WishlistPage /></ShopLayout>} />
        <Route path="/drug-order" element={<ShopLayout><DrugOrderPage /></ShopLayout>} />
        <Route path="/drug-order/:reference" element={<ShopLayout><DrugOrderStatusPage /></ShopLayout>} />
        <Route path="/login" element={<ShopLayout><LoginPage /></ShopLayout>} />

        {/* Account Routes */}
        <Route path="/account" element={<ShopLayout><AccountPage /></ShopLayout>} />
        <Route path="/account/orders" element={<ShopLayout><AccountOrdersPage /></ShopLayout>} />
        <Route path="/account/drug-orders" element={<ShopLayout><AccountDrugOrdersPage /></ShopLayout>} />
        <Route path="/account/addresses" element={<ShopLayout><AccountAddressesPage /></ShopLayout>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
