import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Uttam Kitchenware</h3>
            <p className="text-gray-600">
              Innovating everyday essentials since 1994. Delivering high-quality kitchenware worldwide.
            </p>
            <div className="mt-4 flex items-center gap-4 text-gray-600">
              <a
                href="https://www.facebook.com/uttamkitchenware"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="hover:text-black transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/uttamkitch/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="hover:text-black transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/109763904/admin/dashboard/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="hover:text-black transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Sales</h3>
            <div className="space-y-3">
              <a
                href="tel:+91 9904230516"
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <Phone className="w-4 h-4" />
                +91 9904230516
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=sales@uttamkitch.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <Mail className="w-4 h-4" />
                sales@uttamkitch.com
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Business Hours</h3>
            <p className="text-gray-600">
              Thursday - Tuesday: 8:00 AM - 5:00 PM<br />
              Wednesday: Closed
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Address</h3>
            <div className="space-y-4">
              <a
                href="https://www.google.com/maps/search/?api=1&query=GANESH+ENTERPRISE,+Unit+No.1+-+Aji+GIDC,+Road+Number-H,+Plot+Number+K-4,+Rajkot-360003+(Gujarat-India)"
                target="_blank"
                rel="noreferrer"
                className="block text-gray-600 hover:text-black transition-colors"
                aria-label="Unit 1 location on Google Maps"
              >
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-black">Unit 1</div>
                    <div>GANESH ENTERPRISE, Unit No.1 - Aji GIDC, Road Number-H, Plot Number K-4, Rajkot-360003 (Gujarat-India)</div>
                  </div>
                </div>
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=GANESH+ENTERPRISE,+Unit+No.2+-+Metoda-Lodhida+GIDC,+Gate+No.3,+Plot+No.G-1101+Rajkot-360021+(Gujarat-India)"
                target="_blank"
                rel="noreferrer"
                className="block text-gray-600 hover:text-black transition-colors"
                aria-label="Unit 2 location on Google Maps"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-black">Unit 2</div>
                    <div>GANESH ENTERPRISE, Unit No.2 - Metoda-Lodhida GIDC, Gate No.3, Plot No.G-1101 Rajkot-360021 (Gujarat-India)</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500">
          <p className="mb-2">&copy; 2025 Ganesh Enterprise. All rights reserved.</p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span>Developed by <span className="font-medium text-gray-700">Parthiv Akbari</span></span>
            <a
              href="https://www.linkedin.com/in/parthiv-akbari-a60210325"
              target="_blank"
              rel="noreferrer"
              className="text-[#0077b5] hover:text-[#006097] transition-colors"
              aria-label="Parthiv Akbari LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
