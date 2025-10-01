
import React from 'react';
import { WhatsAppIcon } from './Icons';

interface WhatsAppButtonProps {
  phoneNumber: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber }) => {
  const openWhatsApp = () => {
    const message = encodeURIComponent("Hi, I'm interested in your services.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={openWhatsApp}
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-green-500 text-white w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transform hover:scale-110 transition-all duration-300 z-50 active:scale-95"
      aria-label="Contact us on WhatsApp"
    >
      <WhatsAppIcon className="w-6 h-6 md:w-8 md:h-8" />
    </button>
  );
};

export default WhatsAppButton;
