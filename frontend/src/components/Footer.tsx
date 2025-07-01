'use client'

import { ChefHat, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (linkType: string, linkText: string) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        'event': 'footer_link_click',
        'link_type': linkType,
        'link_text': linkText
      });
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold">Catering v krabici</h3>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Profesionální cateringová společnost s vášní pro kvalitní gastronomiu 
              a osobní přístup. Již několik let poskytujeme kompletní cateringové služby 
              pro firemní akce, svatby, večírky a konference.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-500" />
                <a 
                  href="tel:+420771137288" 
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                  onClick={() => handleLinkClick('phone', '+420 771 137 288')}
                >
                  +420 771 137 288
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-500" />
                <a 
                  href="mailto:info@cateringvkrabici.cz" 
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                  onClick={() => handleLinkClick('email', 'info@cateringvkrabici.cz')}
                >
                  info@cateringvkrabici.cz
                </a>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
                <div className="text-gray-300">
                  <div>Křižíkova 270</div>
                  <div>Čelákovice, 250 88</div>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Naše služby</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => {
                    handleLinkClick('service', 'Firemní catering');
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-left"
                >
                  Firemní catering
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    handleLinkClick('service', 'Svatby a oslavy');
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-left"
                >
                  Svatby a oslavy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    handleLinkClick('service', 'Venkovní akce');
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-left"
                >
                  Venkovní akce
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    handleLinkClick('service', 'Konference');
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-left"
                >
                  Konference
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    handleLinkClick('service', 'Pronájem inventáře');
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-left"
                >
                  Pronájem inventáře
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Rychlé odkazy</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => {
                    handleLinkClick('navigation', 'O nás');
                    document.querySelector('section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-left"
                >
                  O nás
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    handleLinkClick('navigation', 'Naše služby');
                    document.querySelector('[data-section="services"]')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-left"
                >
                  Naše služby
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    handleLinkClick('navigation', 'Produkty');
                    document.querySelector('[data-section="products"]')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-left"
                >
                  Produkty
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    handleLinkClick('navigation', 'Kontakt');
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-gray-300 hover:text-white transition-colors duration-300 text-left"
                >
                  Kontakt
                </button>
              </li>
              <li>
                <a 
                  href="https://cateringvkrabici.cz/gdpr/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                  onClick={() => handleLinkClick('legal', 'GDPR')}
                >
                  GDPR
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {currentYear} Catering v krabici. Všechna práva vyhrazena.
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div>IČO: 24655619</div>
              <div>DIČ: CZ24655619</div>
            </div>
          </div>
          
          <div className="text-center mt-4 text-xs text-gray-500">
            <p>
              Objednat catering lze na: 
              <a 
                href="tel:+420771137288" 
                className="text-orange-400 hover:text-orange-300 ml-1"
                onClick={() => handleLinkClick('phone', '771 137 288')}
              >
                771 137 288
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
