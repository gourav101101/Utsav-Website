import React from 'react';
import { Link } from 'react-router-dom';
import {
  WhatsAppIcon, CallIcon, DocumentIcon, MailIcon,
  FacebookIcon, TwitterIcon, InstagramIcon, PinterestIcon, LinkedinIcon, YoutubeIcon
} from './Icons';
import { WHATSAPP_NUMBER } from '../constants';

const Footer: React.FC = () => {
  const socialLinks = [
    { Icon: InstagramIcon, href: "https://www.instagram.com/utsav_decorandevents/" },

  ];

  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'm interested in your services.")}`;
  const callLink = `tel:+${WHATSAPP_NUMBER}`;

  const [showSticky, setShowSticky] = React.useState(false);
  React.useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // show when user scrolls up, hide when scroll down
          setShowSticky(y < lastY && y > 100); // only after some scroll
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* sticky compact action bar (mobile) */}
      <div aria-hidden={!showSticky} className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${showSticky ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
        <div className="bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-3">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi, I'm interested in your services.")}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-green-600 font-semibold">
            <WhatsAppIcon className="w-5 h-5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <a href={`tel:+${WHATSAPP_NUMBER}`} className="flex items-center space-x-2 text-gray-900 font-semibold">
            <CallIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Call</span>
          </a>
        </div>
      </div>

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
    </>
  );
};

export default Footer;