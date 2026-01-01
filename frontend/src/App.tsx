import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import CatalogPage from './components/CatalogPage';
import ManufacturingPage from './components/ManufacturingPage';
import ProductPage from './components/ProductPage';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Reset scroll position on every route change to avoid retaining previous scroll
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleProductView = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header currentPath={location.pathname} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onProductClick={handleProductView} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/catalog" element={<CatalogPage onProductClick={handleProductView} />} />
          <Route path="/manufacturing" element={<ManufacturingPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="*" element={<HomePage onProductClick={handleProductView} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
