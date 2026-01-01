import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShoppingCart, Download, ArrowLeft, ChevronDown, Play } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import B2BInquiryModal from './B2BInquiryModal';
import { getProductById } from '../data/products';

interface ProductPageProps {
  productId?: number;
  onBack?: () => void;
}

type MobileSection = 'highlights' | 'assembly' | 'specifications' | 'certifications';

export default function ProductPage({ productId, onBack }: ProductPageProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('highlights');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [mobileSections, setMobileSections] = useState<Record<MobileSection, boolean>>({
    highlights: true,
    assembly: false,
    specifications: false,
    certifications: false,
  });

  const { productId: productIdParam } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const resolvedProductId = productId ?? (productIdParam ? Number(productIdParam) : NaN);
  const product = Number.isFinite(resolvedProductId) ? getProductById(resolvedProductId) : null;

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/catalog');
    }
  };

  useEffect(() => {
    setSelectedImage(0);
    setActiveTab('highlights');
    setIsDescriptionExpanded(false);
    setMobileSections({
      highlights: true,
      assembly: false,
      specifications: false,
      certifications: false,
    });
  }, [resolvedProductId]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-700 mb-4">We couldn&apos;t find this product.</p>
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'highlights', label: 'Highlights & Use Cases' },
    { id: 'assembly', label: 'Assembly Instructions' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'certifications', label: 'Compliance & Certifications' }
  ];

  const handleDownloadCertificate = (fileUrl?: string, name?: string) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    alert(`Download ${name ?? 'Certificate'} - This will be available when certificates are uploaded to the server.`);
  };

  const toggleMobileSection = (section: MobileSection) => {
    setMobileSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-4">
              <div className="aspect-[3/4] md:aspect-[4/5]">
                <ImageWithFallback
                  src={product.gallery[selectedImage] ?? product.heroImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {product.gallery.map((image, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setSelectedImage(index)}
                  className={`bg-white rounded-lg overflow-hidden cursor-pointer transition-all ${selectedImage === index
                    ? 'ring-2 ring-blue-600 shadow-md'
                    : 'hover:ring-2 hover:ring-gray-300'
                    }`}
                >
                  <div className="aspect-square">
                    <ImageWithFallback
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Product Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="mb-3">Product Description</h3>
              <div className="relative">
                <p className={`text-gray-600 leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-3' : ''}`}>
                  {product.longDescription ?? product.description}
                </p>
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="mt-2 text-blue-600 hover:text-blue-700 transition-colors text-sm"
                >
                  {isDescriptionExpanded ? 'Read Less' : 'Read More'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="mb-2 text-sm text-blue-600">{product.category}</div>
              <h1 className="mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-wrap gap-4">
                  {product.amazonUrl ? (
                    <a
                      href={product.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 brand-red-button bg-[#FF9900] hover:bg-[#ff9900]/90 text-white rounded-lg transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Buy on Amazon
                    </a>
                  ) : (
                    <button
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-600 rounded-lg cursor-not-allowed"
                      disabled
                      title="Amazon link coming soon"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Buy on Amazon
                      </div>
                    </button>
                  )}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 px-6 py-3 b2b-button text-white rounded-lg transition-colors"
                  >
                    B2B Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Product Information */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Desktop Tab Headers - Hidden on Mobile */}
            <div className="hidden md:block border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 whitespace-nowrap transition-colors border-b-2 ${activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Tab Content */}
            <div className="hidden md:block p-8">
              {activeTab === 'highlights' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="mb-4">Product Highlights</h3>
                    <ul className="space-y-3">
                      {product.highlights.map((highlight, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="text-black mt-1">•</span>
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-4">Use Cases</h3>
                    <ul className="space-y-3">
                      {product.useCases.map((useCase, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="text-black mt-1">•</span>
                          <span className="text-gray-700">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'assembly' && (
                <div>
                  <h3 className="mb-6">Assembly Instructions</h3>
                  <div className="space-y-4">
                    {product.assemblyInstructions.map((instruction, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 pt-1">{instruction}</p>
                      </div>
                    ))}
                  </div>
                  {product.assemblyVideoUrl && (
                    <div className="mt-12 ml-20">
                      <button
                        type="button"
                        onClick={() => window.open(product.assemblyVideoUrl, '_blank', 'noopener,noreferrer')}
                        className="flex items-center justify-center gap-2 px-6 py-3 min-w-[240px] rounded-lg brand-red-button text-white hover:shadow-lg transition-all"
                      >
                        <Play className="w-5 h-5" />
                        <span>Tutorial</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-8">
                  {/* Product Dimensions Table */}
                  <div>
                    <h3 className="mb-4">Product Dimensions & Weight</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left border-b border-gray-200">Specification</th>
                            <th className="px-6 py-3 text-left border-b border-gray-200">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.specifications.productDimensions.map((spec, index) => (
                            <tr key={index} className="border-b border-gray-200 last:border-0">
                              <td className="px-6 py-4">{spec.label}</td>
                              <td className="px-6 py-4">{spec.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Packaging Dimensions Table */}
                  <div>
                    <h3 className="mb-4">Packaging Dimensions & Weight</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left border-b border-gray-200">Specification</th>
                            <th className="px-6 py-3 text-left border-b border-gray-200">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.specifications.packagingDimensions.map((spec, index) => (
                            <tr key={index} className="border-b border-gray-200 last:border-0">
                              <td className="px-6 py-4">{spec.label}</td>
                              <td className="px-6 py-4">{spec.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Technical Specifications */}
                  <div>
                    <h3 className="mb-4">Technical Specifications</h3>
                    <ul className="space-y-3">
                      {product.specifications.technical.map((spec, index) => (
                        <li key={index} className="flex gap-3">
                          <span className="text-blue-600 mt-1">•</span>
                          <span className="text-gray-700">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'certifications' && (
                <div>
                  <h3 className="mb-6">Compliance & Certifications</h3>
                  <p className="text-gray-600 mb-6">
                    Our products meet or exceed all relevant industry standards and regulations.
                    Download our certificates below for detailed compliance information.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-black transition-colors"
                      >
                        <span className="text-gray-700">{cert.name}</span>
                        {cert.fileUrl ? (
                          <a
                            href={cert.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                            title="Download Certificate"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        ) : (
                          <button
                            onClick={() => handleDownloadCertificate(cert.fileUrl, cert.name)}
                            className="p-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                            title="Download Certificate"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Accordion - Visible only on Mobile */}
            <div className="md:hidden">
              {/* Highlights & Use Cases */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleMobileSection('highlights')}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-900">Highlights & Use Cases</span>
                  <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${mobileSections.highlights ? 'rotate-180' : ''}`} />
                </button>
                {mobileSections.highlights && (
                  <div className="px-6 pb-6 space-y-6">
                    <div>
                      <h3 className="mb-3">Product Highlights</h3>
                      <ul className="space-y-3">
                        {product.highlights.map((highlight, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="text-black mt-1">•</span>
                            <span className="text-gray-700">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-3">Use Cases</h3>
                      <ul className="space-y-3">
                        {product.useCases.map((useCase, index) => (
                          <li key={index} className="flex gap-3">
                            <span className="text-black mt-1">•</span>
                            <span className="text-gray-700">{useCase}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Assembly Instructions */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleMobileSection('assembly')}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-900">Assembly Instructions</span>
                  <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${mobileSections.assembly ? 'rotate-180' : ''}`} />
                </button>
                {mobileSections.assembly && (
                  <>
                    <div className="px-6 pb-6">
                      <div className="space-y-4">
                        {product.assemblyInstructions.map((instruction, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
                              {index + 1}
                            </div>
                            <p className="text-gray-700 pt-1">{instruction}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    {product.assemblyVideoUrl && (
                      <div className="px-6 pb-6 ml-12 mt-4">
                        <button
                          type="button"
                          onClick={() => window.open(product.assemblyVideoUrl, '_blank', 'noopener,noreferrer')}
                          className="flex items-center justify-center gap-2 px-6 py-3 min-w-[240px] rounded-lg brand-red-button text-white hover:shadow-lg transition-all"
                        >
                          <Play className="w-5 h-5" />
                          <span>Tutorial</span>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Specifications */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleMobileSection('specifications')}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-900">Specifications</span>
                  <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${mobileSections.specifications ? 'rotate-180' : ''}`} />
                </button>
                {mobileSections.specifications && (
                  <div className="px-6 pb-6 space-y-6">
                    {/* Product Dimensions Table */}
                    <div>
                      <h3 className="mb-3">Product Dimensions & Weight</h3>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-sm border-b border-gray-200">Specification</th>
                              <th className="px-4 py-2 text-left text-sm border-b border-gray-200">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.specifications.productDimensions.map((spec, index) => (
                              <tr key={index} className="border-b border-gray-200 last:border-0">
                                <td className="px-4 py-3 text-sm">{spec.label}</td>
                                <td className="px-4 py-3 text-sm">{spec.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Packaging Dimensions Table */}
                    <div>
                      <h3 className="mb-3">Packaging Dimensions & Weight</h3>
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-sm border-b border-gray-200">Specification</th>
                              <th className="px-4 py-2 text-left text-sm border-b border-gray-200">Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.specifications.packagingDimensions.map((spec, index) => (
                              <tr key={index} className="border-b border-gray-200 last:border-0">
                                <td className="px-4 py-3 text-sm">{spec.label}</td>
                                <td className="px-4 py-3 text-sm">{spec.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Technical Specifications */}
                    <div>
                      <h3 className="mb-3">Technical Specifications</h3>
                      <ul className="space-y-2">
                        {product.specifications.technical.map((spec, index) => (
                          <li key={index} className="flex gap-3 text-sm">
                            <span className="text-blue-600 mt-1">•</span>
                            <span className="text-gray-700">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Compliance & Certifications */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleMobileSection('certifications')}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-gray-900">Compliance & Certifications</span>
                  <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${mobileSections.certifications ? 'rotate-180' : ''}`} />
                </button>
                {mobileSections.certifications && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 mb-4 text-sm">
                      Our products meet or exceed all relevant industry standards and regulations.
                      Download our certificates below for detailed compliance information.
                    </p>
                    <div className="space-y-3">
                      {product.certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-black transition-colors"
                        >
                          <span className="text-gray-700 text-sm">{cert.name}</span>
                          {cert.fileUrl ? (
                            <a
                              href={cert.fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors flex-shrink-0"
                              title="Download Certificate"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          ) : (
                            <button
                              onClick={() => handleDownloadCertificate(cert.fileUrl, cert.name)}
                              className="p-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors flex-shrink-0"
                              title="Download Certificate"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* B2B Inquiry Modal */}
      <B2BInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={product.name}
      />
    </div>
  );
}
