import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import octStandPhoto from '../assets/oct_stand/photo_1.jpeg';
import cutBoardHero from '../assets/cut_board/cut_1.png';
import makerHero from '../assets/murukku_maker/maker_2.png';
import handyHero from '../assets/handy_chopper/handy_1.png';
import latestBrochure from '../assets/latest_brochure.pdf';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomePageProps {
  onProductClick?: (productId: number) => void;
}

export default function HomePage({ onProductClick }: HomePageProps) {
  const navigate = useNavigate();

  const featuredProduct = {
    name: 'Octopus Cloth Drying Stand',
    tagline: 'Compact design meets utility',
    description: 'A space-saving octopus drying stand with 16 stainless-steel arms, 20 rust-proof clips, 360° rotation, and a stable wheeled base.',
    image: octStandPhoto,
    specs: ['Compact design', '360° rotation', 'ABS Grade plastic']
  };

  const recentProducts = [
    {
      id: 6,
      name: '1.5mm Stainless Steel Cutting Board (32.5x25 cm)',
      image: cutBoardHero,
      description: 'A professional-grade stainless-steel cutting board with a reversible double-sided design, integrated scale, and riveted anti-slip grips for durability.'
    },
    {
      id: 5,
      name: 'Murukku Maker',
      image: makerHero,
      description: 'A heavy-duty stainless-steel murukku or kitchen press with 15 snack discs and 6 icing nozzles for savory snacks and dessert decoration.'
    },
    {
      id: 9,
      name: '500 ml Handy Chopper',
      image: handyHero,
      description: 'A compact 500 ml handy chopper with three stainless-steel blades and a durable pull-cord for quick chopping in seconds.'
    }
  ];

  const handleViewAllProducts = () => {
    navigate('/catalog');
  };

  const handleDownloadBrochure = () => {
    const link = document.createElement('a');
    link.href = latestBrochure;
    link.download = 'Uttam-brochure.pdf';
    link.target = '_blank';
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFeaturedProductClick = () => {
    onProductClick ? onProductClick(1) : navigate('/catalog');
  };

  const handleRecentProductClick = (productId: number) => {
    onProductClick ? onProductClick(productId) : navigate('/catalog');
  };

  return (
    <div>
      {/* Hero Section - Featured Product */}
      <section className="relative hero-section bg-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-28">
          <div className="hero-content text-center mb-12">
            <h1 className="mb-4 text-white text-4xl md:text-6xl">{featuredProduct.name}</h1>
            <p className="text-3xl md:text-5xl text-gray-400 mb-6">{featuredProduct.tagline}</p>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              {featuredProduct.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {featuredProduct.specs.map((spec, index) => (
                <span key={index} className="px-4 py-2 bg-white/10 rounded-full">
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-media group relative max-w-2xl mx-auto rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={handleFeaturedProductClick}
              className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-black"
            >
              <ImageWithFallback
                src={featuredProduct.image}
                alt={featuredProduct.name}
                className="w-full h-auto max-h-[200px] object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          </div>
        </div>
        <div className="hero-floor-fade" aria-hidden="true" />
      </section>

      {/* Recent Releases */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl md:text-4xl font-semibold mb-4">Best Sellers</h2>
          <p className="text-center text-gray-600 mb-12">
            Discover our best selling professional-grade tools
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleRecentProductClick(product.id)}
                className="w-full text-left bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-50"
              >
                <div className="aspect-square overflow-hidden">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className={`h-full hover:scale-105 transition-transform duration-500 ${
                      product.id === 9
                        ? 'w-5/6 mx-auto object-contain'
                        : 'w-full object-cover'
                    }`}
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <span className="text-blue-600 hover:text-blue-700 transition-colors">
                    Learn more
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="mb-4">Built for Professionals</h2>
          <p className="text-xl text-gray-600 mb-8">
            Experience the difference that precision engineering makes. Our tools are designed to exceed expectations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleViewAllProducts}
              className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              View All Products
            </button>
            <button
              onClick={handleDownloadBrochure}
              className="px-8 py-3 border border-gray-300 rounded-full hover:border-gray-400 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Brochure
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
