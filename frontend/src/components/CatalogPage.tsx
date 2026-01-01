import { useEffect, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ShoppingCart, Search, ChevronDown, Loader2 } from 'lucide-react';
import B2BInquiryModal from './B2BInquiryModal';
import { productSummaries } from '../data/products';

interface CatalogPageProps {
  onProductClick?: (productId: number) => void;
}

export default function CatalogPage({ onProductClick }: CatalogPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const pageSize = 12;
  const [visibleCount, setVisibleCount] = useState<number>(pageSize);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const products = productSummaries;

  const categories = [
    'All',
    'Presses & Makers',
    'Choppers & Juicers',
    'Slicers & Graters',
    'Knives & Peelers',
    'Tools & Accessories',
    'Drying Stands',
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [selectedCategory, searchQuery]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleB2BClick = (productName: string) => {
    setSelectedProduct(productName);
    setIsModalOpen(true);
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      setVisibleCount((current) => Math.min(current + pageSize, filteredProducts.length));
      setIsLoadingMore(false);
    }, 600);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative hero-section bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center hero-content">
          <h1 className="mb-6">Product Catalog</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore our complete range of professional-grade products. Available for retail purchase
            or bulk B2B orders.
          </p>
        </div>
        <div className="hero-floor-fade" aria-hidden="true" />
      </section>

      {/* Search and Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full transition-all ${selectedCategory === category
                  ? 'category-pill-active'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {visibleProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
                  <div
                    className="aspect-square overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={() => onProductClick?.(product.id)}
                  >
                    <ImageWithFallback
                      src={product.heroImage}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      className="w-full h-full object-contain p-1.5 bg-white hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <div className="mb-2 text-sm text-blue-600">{product.category}</div>
                    <h3
                      className="mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                      onClick={() => onProductClick?.(product.id)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-6">{product.description}</p>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {/* Amazon Retail Link (optional) */}
                      {product.amazonUrl ? (
                        <a
                          href={product.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 brand-red-button bg-[#FF9900] hover:bg-[#ff9900]/90 text-white rounded-lg transition-colors"
                          title="Buy on Amazon"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Amazon</span>
                        </a>
                      ) : (
                        <button
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-600 rounded-lg cursor-not-allowed"
                          title="Amazon link coming soon"
                          disabled
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Amazon</span>
                        </button>
                      )}

                      {/* B2B Inquiry Button */}
                      <button
                        onClick={() => handleB2BClick(product.name)}
                        className="flex-1 px-4 py-3 b2b-button text-white rounded-lg transition-colors"
                        title="Bulk/B2B Inquiry"
                      >
                        B2B Inquiry
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl">No products found matching your search.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
          {visibleCount < filteredProducts.length && (
            <div style={{ marginTop: '4.5rem' }} className="text-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="load-more-button group relative px-8 py-4 bg-black text-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {/* Gradient shimmer effect */}
                <div className="load-more-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {/* Button content */}
                <span className="relative flex items-center gap-3 font-medium">
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Load more products</span>
                      <ChevronDown className="w-5 h-5 load-more-arrow" />
                    </>
                  )}
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="mb-4">Need Help Choosing?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our sales team is ready to assist you with product selection and custom quotes for bulk orders.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+919904230516"
              className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Call: +91 9904230516
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=sales@uttamkitch.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-gray-300 rounded-full hover:border-gray-400 transition-colors"
            >
              Email Sales Team
            </a>
          </div>
        </div>
      </section>

      {/* B2B Inquiry Modal */}
      <B2BInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={selectedProduct}
      />
    </div>
  );
}
