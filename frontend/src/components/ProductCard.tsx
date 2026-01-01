import { ShoppingCart, Building2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    image: string;
    category: string;
    amazonLink: string;
  };
  onB2BInquiry: () => void;
}

export function ProductCard({ product, onB2BInquiry }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Info */}
      <div className="p-6">
        <p className="text-xs text-gray-500 mb-2">{product.category}</p>
        <h3 className="text-gray-900 mb-4">{product.name}</h3>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Amazon Link */}
          <a
            href={product.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#FF9900] text-white rounded-lg hover:bg-[#FF9900]/90 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm">Buy on Amazon</span>
          </a>

          {/* B2B Inquiry */}
          <button
            onClick={onB2BInquiry}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Building2 className="w-5 h-5" />
            <span className="text-sm">Bulk Inquiry</span>
          </button>
        </div>
      </div>
    </div>
  );
}
