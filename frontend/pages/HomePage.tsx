
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SERVICES_DATA } from '../constants';
import { fetchProducts, fetchCategories } from '../src/utils/apiClient';
import ServiceCard from '../components/ServiceCard';
import { Category } from '../types';
import { LightbulbIcon, SparkleIcon, WhatsAppIcon, ClockIcon } from '../components/Icons';

const TrustBadge: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; }> = ({ icon, title, subtitle }) => (
  <div className="flex flex-col items-center text-center px-4">
    <div className="w-24 h-24 md:w-32 md:h-32 mb-6 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center text-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {icon}
    </div>
    <h3 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">{title}</h3>
    <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-xs">{subtitle}</p>
  </div>
);


const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') as Category | null;
  const searchQuery = searchParams.get('search');

  const [dynamicServices, setDynamicServices] = React.useState<any[] | null>(null);
  const [catMap, setCatMap] = React.useState<Record<string,string>>({});

  // helpers
  const slugify = (s?: string) => (s || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const titleizeFromSlug = (slug: string) => (slug || '').split('-').filter(Boolean).map(w => w[0]?.toUpperCase() + w.slice(1)).join(' ');

  const resolveCategory = (q?: string | null) => {
    if (!q) return { slug: '', display: '' };
    const raw = q.toString();
    const slug = slugify(raw);
    const display = (catMap && (catMap[raw] || catMap[slug])) || titleizeFromSlug(slug) || raw;
    return { slug, display };
  };

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [rows, cats] = await Promise.all([fetchProducts(), fetchCategories()]);
        if (!mounted) return;

        // Build a map of category slug -> name and persist it so other render logic can use it
        const builtCatMap: Record<string, string> = {};
        (cats || []).forEach((c: any) => {
          const slug = c.slug || (c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          builtCatMap[slug] = c.name || slug;
        });
        setCatMap(builtCatMap);

        // Map API rows to ServiceItem-like objects
        const mapped = rows.map(r => {
          const slug = (r.category || '').toLowerCase();
          return {
            id: r.id || `prod-${Math.random().toString(36).slice(2,9)}`,
            category: slug || Object.values(Category)[0], // store slug string for filtering
            title: r.title || r.name || 'Untitled Product',
            shortDescription: r.description ? (r.description.slice(0,120)) : 'Beautiful product',
            longDescription: r.description || '',
            price: r.price ? Number(r.price) || 0 : 0,
            images: r.image ? [r.image] : ['https://picsum.photos/800/600'],
            inclusions: [],
            _categoryName: builtCatMap[slug] || undefined,
          };
        });
        setDynamicServices(mapped as any[]);
      } catch (err) {
        // If API fails, gracefully fall back to bundled static data so the UI remains usable
        try {
          const mappedStatic = (SERVICES_DATA || []).map(s => ({
            id: s.id,
            category: (s.category || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            title: s.title,
            shortDescription: s.shortDescription,
            longDescription: s.longDescription,
            price: s.price || 0,
            images: s.images || ['https://picsum.photos/800/600'],
            inclusions: s.inclusions || [],
          }));
          setDynamicServices(mappedStatic as any[]);
        } catch (e) {
          setDynamicServices([]);
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredServices = React.useMemo(() => {
    // Prioritize dynamic services from the API. If it's null, it's still loading.
    // If it's an empty array, it means there are no products.
    let services = dynamicServices || [];

    // category query may be either an enum name or a slug. Match by slug first.
    if (category) {
      services = services.filter((service: any) => {
        if (!service.category) return false;
        // Compare slug (service.category stores slug when dynamic) or enum name
        if (typeof service.category === 'string') {
          return service.category === category || (service._categoryName && service._categoryName === category);
        }
        return false;
      });
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      services = services.filter((service: any) =>
        (service.title || '').toLowerCase().includes(lowercasedQuery) ||
        (service.shortDescription || '').toLowerCase().includes(lowercasedQuery)
      );
    }

    return services;
  }, [category, searchQuery, dynamicServices]);
  
  const getHeroContent = () => {
    const { slug } = resolveCategory(category);
    // match by keyword in slug to be tolerant of different slug conventions
    if (slug.includes('decor')) {
      return {
        title: 'Stunning Decor & Flawless Events',
        description: 'Transforming venues and creating memories. Let us design your perfect celebration in Indore.',
        gradient: 'from-pink-500 to-rose-500',
      };
    }
    if (slug.includes('gift')) {
      return {
        title: 'Thoughtfully Curated Gift Hampers',
        description: 'Discover the perfect gift for your loved ones. Unique and beautiful hampers delivered in Indore.',
        gradient: 'from-teal-500 to-cyan-500',
      };
    }
    if (slug.includes('food')) {
      return {
        title: 'Exquisite Gourmet Sweets & Treats',
        description: 'Indulge in our artisanal sweets and chocolates, crafted with love for your special moments in Indore.',
        gradient: 'from-amber-500 to-orange-500',
      };
    }
    return {
      title: 'Unforgettable Celebrations Start Here',
      description: 'Explore our curated collection of decor, gifts, and gourmet sweets for every special occasion in Indore.',
      gradient: 'from-purple-600 to-indigo-700',
    };
  };

  const heroContent = getHeroContent();


  return (
    <div>
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${heroContent.gradient} text-white py-16 md:py-24 px-4 text-center transition-all duration-500`}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">{heroContent.title}</h1>
          <p className="text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed opacity-90">
            {heroContent.description}
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Active category pill (mobile-friendly) */}
      {(() => {
        const q = category;
        if (!q) return null;
        // use resolver that titleizes slug immediately and prefers catMap when available
        const { display } = resolveCategory(q);
        return (
          <div className="bg-white py-3 px-4 border-b md:hidden">
            <div className="max-w-7xl mx-auto flex items-center justify-center">
              <div className="text-sm font-semibold text-gray-700">Showing: <span className="ml-2 inline-block bg-primary/10 text-primary px-3 py-1 rounded-full">{display}</span></div>
            </div>
          </div>
        );
      })()}

      {/* Services Section */}
      <div className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 text-gray-900">All Experiences</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our curated collection of premium services designed to make your celebrations unforgettable
            </p>
          </div>
           {dynamicServices === null ? (
            // Loading skeleton while API requests are in flight
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                    <div className="w-full h-40 sm:h-48 md:h-56 bg-gray-200" />
                    <div className="p-5 md:p-6">
                      <div className="h-3 bg-gray-200 rounded w-1/3 mb-3" />
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-4" />
                      <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-1/4" />
                        <div className="text-right">
                          <div className="h-5 bg-gray-200 rounded w-20 ml-auto" />
                          <div className="h-3 bg-gray-200 rounded w-16 mt-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
           ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
           ) : (
            <div className="text-center text-gray-500 py-16">
                <div className="max-w-md mx-auto">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4">No services found</h3>
                  <p className="text-base md:text-lg mb-8">Try adjusting your search or category filters to discover our amazing services.</p>
                  <Link to="/" className="inline-block bg-primary text-white px-8 py-3 rounded-full hover:bg-primary-dark transition-colors">
                    View All Services
                  </Link>
                </div>
            </div>
           )}
        </div>
      </div>
      
      {/* Trust Section */}
      <div className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-900">Why Choose Utsav?</h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                We bring years of expertise, creativity, and dedication to make every celebration extraordinary
              </p>
              <div className="w-20 md:w-32 h-1 bg-primary mx-auto mt-8 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                <TrustBadge 
                    icon={<LightbulbIcon className="h-12 w-12 md:h-16 md:w-16"/>} 
                    title="Creative Expertise" 
                    subtitle="Innovative designs tailored to your unique vision and style preferences." />
                <TrustBadge 
                    icon={<SparkleIcon className="h-12 w-12 md:h-16 md:w-16"/>} 
                    title="Premium Quality" 
                    subtitle="We use only the finest materials and freshest ingredients for lasting memories." />
        <TrustBadge 
          icon={<WhatsAppIcon className="h-12 w-12 md:h-16 md:w-16"/>} 
          title="Personalized Service" 
          subtitle="Dedicated support and consultation to bring your dream celebration to life." />
                <TrustBadge 
                    icon={<ClockIcon className="h-12 w-12 md:h-16 md:w-16"/>} 
                    title="Timely Execution" 
                    subtitle="Reliable and punctual delivery for a completely stress-free experience." />
            </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
