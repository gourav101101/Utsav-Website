import React from 'react';
import { Link } from 'react-router-dom';
import type { ServiceItem } from '../types';
import { LocationIcon } from './Icons';

interface ServiceCardProps {
  service: ServiceItem;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <Link to={`/service/${service.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-gray-100">
          <div className="relative overflow-hidden">
          <img
            src={service.images[0]}
            alt={service.title}
            className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            View Details
          </div>
        </div>
        <div className="p-5 md:p-6">
          <div className="flex items-center text-gray-500 text-xs md:text-sm mb-3">
            <LocationIcon className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0" />
            <span>Available in Indore</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors duration-300 mb-4 leading-tight">
            {service.title}
          </h3>
          <div className="flex justify-between items-center">
            <div className="text-xs md:text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              No Reviews Yet
            </div>
            <div className="text-right">
              <div className="text-lg md:text-xl font-bold text-gray-900">₹{service.price.toLocaleString()}</div>
              <div className="text-xs text-gray-500">starting from</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;