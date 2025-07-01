'use client'

import { motion } from 'framer-motion'
import { Building2, Heart, Sun, Users } from 'lucide-react'
import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
              'event': 'section_view',
              'section_name': 'services'
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: Building2,
      title: "Firemní catering",
      description: "Stylové občerstvení pro porady, školení a firemní setkání. Praktický servis elegantně stylizovaný do krabice.",
      features: ["Rychlé doručení", "Profesionální prezentace", "Flexibilní množství", "Čerstvé suroviny"]
    },
    {
      icon: Heart,
      title: "Svatby a oslavy",
      description: "Nezapomenutelné gastronomické zážitky pro vaše nejdůležitější okamžiky. Od intimních oslav po velké svatby.",
      features: ["Individuální menu", "Kompletní servis", "Profesionální obsluha", "Stylové podání"]
    },
    {
      icon: Sun,
      title: "Venkovní akce",
      description: "Catering pod širým nebem pro pikníky, garden party a venkovní firemní akce. Pohodová atmosféra zaručena.",
      features: ["Mobilní servis", "Odolné balení", "Vhodné pro venkovní prostředí", "Kompletní logistika"]
    },
    {
      icon: Users,
      title: "Konference a semináře",
      description: "Profesionální občerstvení pro konference, semináře a vzdělávací akce. Zaměřeno na komfort účastníků.",
      features: ["Coffee break", "Obědy pro účastníky", "Dietní varianty", "Časově flexibilní"]
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Naše služby
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Poskytujeme kompletní cateringové služby pro všechny typy akcí. 
            Od malých firemních setkání po velké svatby a konference.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                <service.icon className="w-8 h-8 text-orange-500" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Potřebujete catering na míru?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Připravíme pro vás návrh menu podle vašeho přání a zajistíme kompletní logistiku.
            </p>
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.dataLayer) {
                  window.dataLayer.push({
                    'event': 'cta_click',
                    'cta_location': 'services_section',
                    'cta_text': 'Konzultace zdarma'
                  });
                }
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-orange-500 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Konzultace zdarma
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
