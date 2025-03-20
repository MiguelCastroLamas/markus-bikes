import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import ProductList from './pages/ProductList';
import ProductConfigurator from './pages/ProductConfigurator';
import Cart from './pages/Cart';
import { CartProvider } from './context/CartContext';

const App: React.FC = () => {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:productId/configure" element={<ProductConfigurator />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<Navigate to="/products" replace />} />
          </Routes>
        </main>
      </div>
    </CartProvider>
  );
};

export default App; 