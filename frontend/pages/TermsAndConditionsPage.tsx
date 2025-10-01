import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, DocumentIcon } from '../components/Icons';

const TermsAndConditionsPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors group mb-6"
                >
                    <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back</span>
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-4 rounded-2xl">
                            <DocumentIcon className="w-12 h-12" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Please read our terms and conditions carefully
                    </p>
                    <div className="w-24 h-1 bg-primary mx-auto mt-8 rounded-full"></div>
                </div>
                
                <div className="space-y-8">
                    <div className="mb-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center space-x-3">
                            <span className="bg-primary/10 text-primary rounded-lg p-2 text-lg font-bold">1</span>
                            <span>Introduction</span>
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-lg">Welcome to Utsav Decor and Event. These terms outline our service agreement.</p>
                    </div>
                    
                    <div className="mb-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center space-x-3">
                            <span className="bg-primary/10 text-primary rounded-lg p-2 text-lg font-bold">2</span>
                            <span>Our Services</span>
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-lg">We provide premium event decoration and catering services in Indore.</p>
                    </div>

                    <div className="mb-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center space-x-3">
                            <span className="bg-primary/10 text-primary rounded-lg p-2 text-lg font-bold">3</span>
                            <span>Contact</span>
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-lg">Contact us at <a href="tel:+919752844488" className="text-primary hover:underline font-semibold">+91 97528 44488</a>.</p>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-8 rounded-3xl shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4">Ready to Plan Your Event?</h3>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href="tel:+919752844488" 
                                className="bg-white text-primary px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors"
                            >
                                ��� Call Now
                            </a>
                            <a 
                                href="https://wa.me/919752844488" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-green-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-600 transition-colors"
                            >
                                ��� WhatsApp Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditionsPage;
