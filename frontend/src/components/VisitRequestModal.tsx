import { useState, type CSSProperties } from 'react';
import { X, Loader2, CheckCircle } from 'lucide-react';

interface VisitRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const dayOptions = ['Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday'];
const timeOptions = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM'
];
const selectIconUrl =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 20 20' fill='none'><path d='M6 8l4 4 4-4' stroke='%236B7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>";
const selectIconStyle: CSSProperties = {
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  backgroundImage: `url("${selectIconUrl}")`,
  backgroundPosition: 'right 0.75rem center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '1rem 1rem'
};
const selectTextStyle = {
  ...selectIconStyle,
  paddingLeft: '1.125rem'
};
const inputPaddingStyle = { paddingLeft: '1.125rem' };

export default function VisitRequestModal({ isOpen, onClose }: VisitRequestModalProps) {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    day: '',
    time: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/visit-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          day: formData.day,
          time: formData.time,
          details: formData.details,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to submit visit request');
      }

      await response.json();
      setIsSuccess(true);

      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          day: '',
          time: '',
          details: ''
        });
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error submitting visit request:', err);
      setError('Failed to submit visit request. Please try calling us directly at +91 9904230516.');
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
              <h3 className="mb-2">Visit Request Sent!</h3>
              <p className="text-gray-600">
                Our team will confirm your visit shortly.
              </p>
            </div>
          ) : (
            <>
              <h2 className="mb-2">Schedule a Facility Visit</h2>
              <p className="text-gray-600 mb-8">
                Share your preferred day and time, and we will coordinate your tour.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="visit-name" className="block mb-2 text-gray-700">
                    Full Name *
                  </label>
                  <input
                    id="visit-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="John Doe"
                    style={inputPaddingStyle}
                  />
                </div>

                <div>
                  <label htmlFor="visit-email" className="block mb-2 text-gray-700">
                    Email Address *
                  </label>
                  <input
                    id="visit-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="john@company.com"
                    style={inputPaddingStyle}
                  />
                </div>

                <div>
                  <label htmlFor="visit-phone" className="block mb-2 text-gray-700">
                    Phone Number *
                  </label>
                  <input
                    id="visit-phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                    style={inputPaddingStyle}
                  />
                </div>

                <div>
                  <label htmlFor="visit-day" className="block mb-2 text-gray-700">
                    Day *
                  </label>
                  <select
                    id="visit-day"
                    required
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="w-full appearance-none pr-12 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    style={selectTextStyle}
                  >
                    <option value="" disabled>
                      Select a day
                    </option>
                    {dayOptions.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="visit-time" className="block mb-2 text-gray-700">
                    Time *
                  </label>
                  <select
                    id="visit-time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full appearance-none pr-12 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    style={selectTextStyle}
                  >
                    <option value="" disabled>
                      Select a time
                    </option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="visit-details" className="block mb-2 text-gray-700">
                    Reason & Details *
                  </label>
                  <textarea
                    id="visit-details"
                    required
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent min-h-32"
                    placeholder="Please share the purpose of your visit and any specific areas you would like to see..."
                    style={inputPaddingStyle}
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
                      'Submit Request'
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
