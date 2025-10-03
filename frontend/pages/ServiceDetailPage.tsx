import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { ServiceItem } from '../types';
import { Category } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import { fetchProductById, fetchProductsByCategory } from '../src/utils/apiClient';
import ServiceCard from '../components/ServiceCard';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '../components/Icons';

const AddonCard: React.FC<{addon: {id: string, title: string, description: string, price: number, image: string}}> = ({ addon }) => {
    const [added, setAdded] = useState(false);

    return (
        <div className="border rounded-lg p-3 flex flex-col items-center text-center">
            <img src={addon.image} alt={addon.title} className="w-24 h-24 object-cover rounded-md mb-2"/>
            <h4 className="font-semibold">{addon.title}</h4>
            <p className="text-xs text-gray-500 mb-2">{addon.description}</p>
            <div className="flex justify-between items-center w-full mt-auto">
                <span className="font-bold text-sm">₹{addon.price}</span>
                <button onClick={() => setAdded(!added)} className={`w-16 h-7 rounded-full flex items-center transition-colors duration-200 ${added ? 'bg-green-500 justify-start' : 'bg-gray-300 justify-end'}`}>
                    <span className="h-6 w-6 bg-white rounded-full shadow-md transform"></span>
                </button>
            </div>
        </div>
    );
};

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [similarServices, setSimilarServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    async function loadService() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const product = await fetchProductById(id);
        if (product) {
          // Map the API response to the ServiceItem structure
          const serviceItem: ServiceItem = {
            id: product._id || product.id,
            category: (product.category as Category) || Category.DECOR,
            title: product.title || 'Untitled',
            shortDescription: product.description?.slice(0, 120) || '',
            longDescription: product.description || '',
            price: Number(product.price) || 0,
            images: (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : ['/placeholder.png']),
            inclusions: Array.isArray(product.inclusions) ? product.inclusions : (product.inclusions ? String(product.inclusions).split(',').map((s:string)=>s.trim()).filter(Boolean) : []),
          };
          setService(serviceItem);

          // Fetch similar services
          if (serviceItem.category) {
            const similar = await fetchProductsByCategory(serviceItem.category);
            setSimilarServices(similar
              .filter(p => p.id !== serviceItem.id)
              .slice(0, 4)
              .map(p => ({
                ...p,
                price: Number(p.price) || 0,
                images: p.image ? [p.image] : ['/placeholder.png'],
              })) as ServiceItem[]
            );
          }
        } else {
          setError('Service not found.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load service.');
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [id]);

  if (loading) {
    // Detailed skeleton matching the service detail layout
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
            <div className="xl:col-span-3">
              <div className="animate-pulse">
                <div className="w-full h-40 sm:h-56 md:h-80 lg:h-[500px] bg-gray-200 rounded-2xl mb-4" />
                <div className="flex space-x-3 mt-4 pb-2 overflow-x-auto">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-14 h-14 sm:w-16 sm:h-16 lg:w-24 lg:h-24 bg-gray-200 rounded-xl flex-shrink-0" />
                  ))}
                </div>
              </div>
            </div>

            <div className="xl:col-span-2">
              <div className="animate-pulse bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 rounded-2xl border border-gray-100">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-full mb-3" />
                <div className="h-4 bg-gray-200 rounded w-full mb-6" />
                <div className="h-12 bg-gray-200 rounded w-full mb-4" />
                <div className="flex items-center justify-between">
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-1/4" />
                </div>
                <div className="mt-4 h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-5 gap-12 mt-16">
            <div className="xl:col-span-3 space-y-8">
              <div className="animate-pulse bg-white border border-gray-200 rounded-2xl p-8 shadow-sm h-40" />
              <div className="animate-pulse bg-white border border-gray-200 rounded-2xl p-8 shadow-sm h-40" />
              <div className="animate-pulse bg-white border border-gray-200 rounded-2xl p-8 shadow-sm h-40" />
            </div>

            <div className="xl:col-span-2">
              <div className="animate-pulse bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 h-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{error || 'Service not found'}</h2>
          <Link to="/" className="text-primary hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const handleInquiry = () => {
    const message = encodeURIComponent(`Hi, I'm interested in your service: ${service.title} (ID: ${service.id})`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const nextImage = () => setActiveImageIndex((prev) => (prev + 1) % service.images.length);
  const prevImage = () => setActiveImageIndex((prev) => (prev - 1 + service.images.length) % service.images.length);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero section with back button */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button and Breadcrumbs */}
          <div className="flex items-center space-x-4 mb-4">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors group"
            >
              <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>
            <div className="text-sm text-gray-400">|</div>
            <nav className="text-sm text-gray-500">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link> 
              <span className="mx-2">→</span> 
              <Link to={`/?category=${encodeURIComponent(service.category)}`} className="hover:text-primary transition-colors">{service.category}</Link>
              <span className="mx-2">→</span> 
              <span className="text-gray-900">{service.title}</span>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">        
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-12">
          {/* Image Gallery */}
          <div className="xl:col-span-3">
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
              <img 
                src={service.images[activeImageIndex]} 
                alt={service.title} 
                className="w-full h-auto sm:h-56 md:h-80 lg:h-[500px] object-contain sm:object-cover"
                style={{ maxHeight: 420, objectPosition: 'center' }}
              />
              {service.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage} 
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full hover:bg-white transition-all shadow-lg"
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-700"/>
                  </button>
                  <button 
                    onClick={nextImage} 
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full hover:bg-white transition-all shadow-lg"
                  >
                    <ChevronRightIcon className="w-5 h-5 text-gray-700"/>
                  </button>
                </>
              )}
            </div>
            {service.images.length > 1 && (
              <div className="flex space-x-3 mt-4 overflow-x-auto pb-2">
                {service.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 lg:w-24 lg:h-24 object-cover rounded-xl cursor-pointer border-2 transition-all flex-shrink-0 ${
                      index === activeImageIndex 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Service Details & Inquiry */}
          <div className="xl:col-span-2">
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 xl:sticky xl:top-24">
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900">{service.title}</h1>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{service.shortDescription}</p>
                
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-primary">₹{service.price.toLocaleString()}</span>
                    <span className="text-gray-500 ml-2">starting from</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">📍 Service Area:</span> Available within Indore. 
                    Contact us for delivery timelines and arrangements.
                  </p>
                </div>

                <button 
                  onClick={handleInquiry} 
                  className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-lg flex items-center justify-center space-x-2"
                >
                  <span>INQUIRE ON WHATSAPP</span>
                  <span>💬</span>
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-3">
                  Get instant response • No registration required
                </p>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-12 mt-16">
            <div className="xl:col-span-3 space-y-8">
              {service.recommendedAddons && service.recommendedAddons.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Recommended Add-ons</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {service.recommendedAddons.map(addon => <AddonCard key={addon.id} addon={addon} />)}
                  </div>
                </div>
              )}
                
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">What's Included</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.inclusions.map((item, index) => (
                      <li key={index} className="flex items-center bg-green-50 rounded-lg p-3 border border-green-200">
                        <CheckIcon className="w-6 h-6 text-green-600 mr-4 flex-shrink-0" />
                        <span className="text-gray-800 font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* 'About This Experience' section removed as requested */}
            </div>
            
            {/* Sidebar for desktop */}
            <div className="xl:col-span-2">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Why Choose Us?</h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Professional team with 5+ years experience
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    100% satisfaction guarantee
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    On-time delivery commitment
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                    Customizable to your preferences
                  </li>
                </ul>
              </div>
            </div>
        </div>
      </div>
        
        {/* Similar Products */}
      {similarServices.length > 0 && (
        <div className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">You Might Also Like</h2>
                <p className="text-gray-600 text-lg">Explore similar experiences in {service.category.toLowerCase()}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {similarServices.map((s) => (
                  <ServiceCard key={s.id} service={s} />
                ))}
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailPage;