import { useEffect, useState } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';

interface B2BInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export default function B2BInquiryModal({ isOpen, onClose, productName }: B2BInquiryModalProps) {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    productName: productName || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData((prev) => ({ ...prev, productName: productName || '' }));
  }, [productName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        description: formData.description,
        product_name: productName || formData.productName || 'General Inquiry',
      };

      const response = await fetch(`${API_BASE_URL}/api/inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to submit inquiry');
      }

      await response.json();
      setIsSuccess(true);
      
      // Reset form after 2 seconds and close modal
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', description: '', productName: '' });
        setIsSuccess(false);
        onClose();
      }, 2000);

    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setError('Failed to submit inquiry. Please try calling us directly at +91 9904230516');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {isSuccess ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="mb-2">Inquiry Sent Successfully!</h3>
              <p className="text-gray-600">
                Our sales team will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <h2 className="mb-2">B2B Bulk Inquiry</h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and our sales team will contact you with a custom quote.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 text-gray-700">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-gray-700">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-2 text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {productName && (
                  <div>
                    <label htmlFor="productName" className="block mb-2 text-gray-700">
                      Product of Interest
                    </label>
                    <input
                      id="productName"
                      type="text"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      readOnly
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="description" className="block mb-2 text-gray-700">
                    Inquiry Description *
                  </label>
                  <textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent min-h-32"
                    placeholder="Please provide details about your bulk order requirements, quantities, and any specific needs..."
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Inquiry'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200 text-center">
                  <p className="text-gray-600">
                    Or call us directly at{' '}
                    <a href="tel:+91 9904230516" className="text-blue-600 hover:underline">
                      +91 9904230516
                    </a>
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
