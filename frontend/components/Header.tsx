import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SearchIcon, LocationIcon, LogoIcon } from './Icons';
import { Category } from '../types';
import { fetchCategories } from '../src/utils/apiClient';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = (formData.get('search') as string) || '';
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
  };

  const [navItems, setNavItems] = React.useState<{ slug: string; name: string }[] | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cats = await fetchCategories();
        if (!mounted) return;
        const mapped = (cats || []).map((c: any) => ({ slug: c.slug || c.name, name: c.name || c.slug }));
        if (mapped.length > 0) {
          setNavItems(mapped);
          return;
        }
      } catch (err) {
        // fall through to fallback
      }

      // Fallback: derive from Category enum
      const fallback = Object.values(Category).map((name) => ({ slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), name }));
      setNavItems(fallback);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex justify-between items-center py-3 border-b">
          <Link to="/" className="flex items-center space-x-2 text-xl md:text-2xl font-bold text-primary">
            <LogoIcon className="h-6 w-6 md:h-8 md:w-8" />
            <span>Utsav</span>
          </Link>
          
          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                name="search"
                placeholder="What are you celebrating?"
                className="w-full py-2 pl-4 pr-10 text-gray-900 bg-white border-2 border-gray-200 rounded-full placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                aria-label="Search services"
              />
              <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary transition-colors" aria-label="Submit search">
                <SearchIcon className="h-5 w-5" />
              </button>
            </form>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile Search Button */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-primary transition-colors"
              aria-label="Toggle search"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
            
            {/* Location */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <LocationIcon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              <span className="hidden md:inline">Indore</span>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              <div className="space-y-1">
                <div className={`w-5 h-0.5 bg-current transition-transform duration-200 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-current transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-current transition-transform duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden py-3 border-b">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                name="search"
                placeholder="What are you celebrating?"
                className="w-full py-3 pl-4 pr-10 text-gray-900 bg-white border-2 border-gray-200 rounded-full placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                aria-label="Search services"
                autoFocus
              />
              <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-primary transition-colors" aria-label="Submit search">
                <SearchIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-center items-center py-3">
          <ul className="flex items-center space-x-8 lg:space-x-10">
            {navItems && navItems.map((item) => {
                  const isActive = activeCategory === item.slug;
                  return (
                    <li key={item.slug}>
                      <Link
                        to={`/?category=${encodeURIComponent(item.slug)}`}
                        className={`py-2 font-semibold transition-all duration-300 border-b-2 ${
                          isActive
                            ? 'text-primary border-primary'
                            : 'text-gray-700 border-transparent hover:text-primary hover:border-primary/50'
                        }`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
          </ul>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-b">
            <ul className="space-y-4">
              {navItems && navItems.map((item) => {
                const isActive = activeCategory === item.slug;
                return (
                  <li key={item.slug}>
                    <Link
                      to={`/?category=${encodeURIComponent(item.slug)}`}
                      className={`block py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  to="/contact"
                  className="block py-3 px-4 rounded-lg font-semibold text-gray-700 hover:text-primary hover:bg-gray-50 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;