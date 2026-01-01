import { useState, type ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Home, Info, Package, Factory } from 'lucide-react';
import UttamLogo from '../assets/UttamLogo.svg';

interface HeaderProps {
  currentPath: string;
}

export default function Header({ currentPath }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems: { to: string; label: string; icon: ReactNode; match: (path: string) => boolean }[] = [
    { to: '/', label: 'Home', icon: <Home className="w-4 h-4" />, match: (path) => path === '/' },
    { to: '/about', label: 'About Us', icon: <Info className="w-4 h-4" />, match: (path) => path.startsWith('/about') },
    { to: '/catalog', label: 'Catalog', icon: <Package className="w-4 h-4" />, match: (path) => path.startsWith('/catalog') || path.startsWith('/product') },
    { to: '/manufacturing', label: 'Manufacturing', icon: <Factory className="w-4 h-4" />, match: (path) => path.startsWith('/manufacturing') },
  ];

  const isActive = (matchFn: (path: string) => boolean) => matchFn(currentPath);

  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-md border-b border-gray-200/50">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center" aria-label="Go to home">
            <img
              src={UttamLogo}
              alt="Uttam logo"
              className="h-8 w-auto opacity-90 mix-blend-multiply"
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={`flex items-center gap-2 transition-colors ${
                    isActive(item.match) ? 'text-black' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
            <ul className="py-4">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`w-full text-left px-6 py-3 flex items-center gap-2 transition-colors ${
                      isActive(item.match)
                        ? 'bg-gray-100 text-black'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
