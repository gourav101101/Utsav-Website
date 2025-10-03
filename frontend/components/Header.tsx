import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SearchIcon, LocationIcon } from './Icons';
import { Category } from '../types';
import { fetchCategories } from '../src/utils/apiClient';
import '../src/styles/scroll-utils.css';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  // show/hide only the mobile category pill bar on scroll
  const [showPills, setShowPills] = React.useState(true);
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

  // hide pill bar on scroll down, show on scroll up (with threshold + cooldown to avoid jitter)
  React.useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    let lastToggle = 0;
    const THRESHOLD = 20; // px before we react
    const COOLDOWN = 150; // ms between toggles

    const onScroll = () => {
      const y = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const now = Date.now();
          const delta = y - lastY;

          // Always show when near the top
          if (y <= 50 && now - lastToggle > COOLDOWN) {
            setShowPills(true);
            lastToggle = now;
          } else if (Math.abs(delta) > THRESHOLD && now - lastToggle > COOLDOWN) {
            if (delta > 0 && y > 100) {
              // user scrolled down
              setShowPills(false);
              lastToggle = now;
            } else if (delta < 0) {
              // user scrolled up
              setShowPills(true);
              lastToggle = now;
            }
          }

          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ref for pill container so we can center active pill
  const pillsRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!pillsRef.current || !activeRef.current) return;
    try {
      const container = pillsRef.current;
      const active = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      const offset = (activeRect.left + activeRect.width / 2) - (containerRect.left + containerRect.width / 2);
      container.scrollBy({ left: offset, behavior: 'smooth' });
    } catch (e) {
      // ignore
    }
  }, [activeCategory, navItems]);

  return (
  <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex justify-between items-center py-3 border-b">
          <Link to="/" className="flex items-center space-x-2 text-xl md:text-2xl font-bold text-primary">
            <img src="/logo.svg" alt="Utsav" className="h-6 w-6 md:h-8 md:w-8 object-contain" />
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

        {/* Mobile category pill bar: scrollable pills so user always sees active category */}
        {navItems && (
          <div className={`md:hidden overflow-hidden bg-white hide-scrollbar transition-all duration-300 ${showPills ? 'border-b max-h-20 opacity-100' : 'max-h-0 border-0 opacity-0 pointer-events-none'}`}>
            <div ref={pillsRef} className="overflow-x-auto pills-scroll">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex space-x-3 py-3">
                  {navItems.map(item => {
                    const isActive = activeCategory === item.slug || activeCategory === item.name;
                    return (
                      <Link 
                        key={item.slug} 
                        to={`/?category=${encodeURIComponent(item.slug)}`} 
                        ref={isActive ? (el) => { activeRef.current = el as HTMLAnchorElement } : undefined}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold ${isActive ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex justify-center items-center py-3">
          <ul className="flex items-center space-x-8 lg:space-x-10">
            {navItems && navItems.map((item) => {
                    // consider both slug and display name as possible active values (query may carry either)
                    const isActive = activeCategory === item.slug || activeCategory === item.name;
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
                const isActive = activeCategory === item.slug || activeCategory === item.name;
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