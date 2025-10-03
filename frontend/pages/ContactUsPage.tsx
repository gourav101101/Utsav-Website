import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MailIcon, CallIcon, LocationIcon, ChevronLeftIcon } from '../components/Icons';

const ContactUsPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors group mb-6"
        >
          <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">Get in Touch</h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We'd love to hear from you! Reach out to us with any questions or inquiries about our services.
            </p>
            <div className="w-24 h-1 bg-primary mx-auto mt-8 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Contact Information */}
            <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-xl border border-gray-100">
              <div className="space-y-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Let's Connect</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Feel free to call or email us. We are available to help you plan your perfect event.
                  </p>
                </div>
                
                <div className="space-y-8">
                  <div className="flex items-start space-x-6 group">
                    <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-4 rounded-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <CallIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-gray-900">Phone</h3>
                      <a 
                        href="tel:+91981666060" 
                        className="text-primary hover:text-primary-dark text-lg font-semibold hover:underline transition-colors"
                      >
                        +91 99816 66060
                      </a>
                      <p className="text-gray-600 mt-1">Available 9 AM - 8 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-6 group">
                    <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-4 rounded-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <MailIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-gray-900">Email</h3>
                      <a 
                        href="mailto:contact@utsavdecor.com" 
                        className="text-primary hover:text-primary-dark text-lg font-semibold hover:underline transition-colors"
                      >
                        contact@utsavdecor.com
                      </a>
                      <p className="text-gray-600 mt-1">We'll respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-6 group">
                    <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-4 rounded-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <LocationIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-gray-900">Service Area</h3>
                      <p className="text-lg text-gray-700 font-medium">Indore, Madhya Pradesh, India</p>
                      <p className="text-gray-600 mt-1">Serving all areas within the city</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information Card */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 lg:p-10 rounded-3xl border border-primary/20">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Why Choose Us?</h3>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-lg text-gray-700">5+ Years of Experience</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-lg text-gray-700">100+ Happy Customers</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-lg text-gray-700">Premium Quality Guarantee</span>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-lg text-gray-700">On-Time Delivery Promise</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-xl border border-gray-100">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Business Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Monday - Saturday</span>
                    <span className="text-gray-900 font-bold">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Sunday</span>
                    <span className="text-gray-900 font-bold">10:00 AM - 6:00 PM</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4 italic">
                  For urgent inquiries, WhatsApp us anytime!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;