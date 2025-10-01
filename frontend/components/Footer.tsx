import React from 'react';
import { Link } from 'react-router-dom';
import {
  WhatsAppIcon, CallIcon, DocumentIcon, MailIcon,
  FacebookIcon, TwitterIcon, InstagramIcon, PinterestIcon, LinkedinIcon, YoutubeIcon
} from './Icons';
import { WHATSAPP_NUMBER } from '../constants';

const Footer: React.FC = () => {
  const socialLinks = [
    // { Icon: FacebookIcon, href: "#" },
    // { Icon: TwitterIcon, href: "#" },
    { Icon: InstagramIcon, href: "https://www.instagram.com/utsav_decorandevents/" },
    // { Icon: PinterestIcon, href: "#" },
    // { Icon: LinkedinIcon, href: "#" },
    // { Icon: YoutubeIcon, href: "#" },
  ];

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'm interested in your services.")}`;
  const callLink = `tel:+${WHATSAPP_NUMBER}`;

  return (
    <footer className="bg-dark-bg text-light-text pt-12 md:pt-16 pb-6 md:pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Utsav Decor & Event</h3>
            <ul className="space-y-3">
              <li><a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center hover:text-white transition-colors text-sm md:text-base"><WhatsAppIcon className="w-4 h-4 md:w-5 md:h-5 mr-3 flex-shrink-0" />WhatsApp Us</a></li>
              <li><a href={callLink} className="inline-flex items-center hover:text-white transition-colors text-sm md:text-base"><CallIcon className="w-4 h-4 md:w-5 md:h-5 mr-3 flex-shrink-0" />Call Us (+91 97528 44488)</a></li>
              <li><Link to="/contact" className="inline-flex items-center hover:text-white transition-colors text-sm md:text-base"><MailIcon className="w-4 h-4 md:w-5 md:h-5 mr-3 flex-shrink-0" />Contact Us</Link></li>
              <li><Link to="/terms" className="inline-flex items-center hover:text-white transition-colors text-sm md:text-base"><DocumentIcon className="w-4 h-4 md:w-5 md:h-5 mr-3 flex-shrink-0" />Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
             <h3 className="font-bold text-lg mb-4">Spread The Love</h3>
              <p className="text-gray-400 mb-4 text-sm md:text-base">Follow us on social media to stay updated with our latest work and offers.</p>
              <div className="flex flex-wrap gap-4 md:gap-5">
                {socialLinks.map(({ Icon, href }, index) => (
                  <a 
                    key={index} 
                    href={href} 
                    className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"
                    aria-label={`Follow us on social media ${index + 1}`}
                  >
                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                  </a>
                ))}
              </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 md:pt-8 mt-6 md:mt-8 text-center">
          <p className="text-xs md:text-sm text-gray-500">&copy; {new Date().getFullYear()} Utsav Decor and Event. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;