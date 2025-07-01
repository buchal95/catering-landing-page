'use client'

import { motion } from 'framer-motion'
import { CheckCircle, MessageCircle, Phone, Truck } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
              'event': 'section_view',
              'section_name': 'process'
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

  const steps = [
    {
      icon: MessageCircle,
      title: "1. Kontakt",
      description: "Vyplňte formulář nebo nás kontaktujte telefonicky. Sdělte nám detaily o vaší akci.",
      details: ["Typ akce", "Počet hostů", "Datum a čas", "Speciální požadavky"]
    },
    {
      icon: Phone,
      title: "2. Konzultace",
      description: "Probereme s vámi všechny detaily a připravíme návrh menu přesně na míru.",
      details: ["Individuální menu", "Cenová nabídka", "Logistické detaily", "Termín potvrzení"]
    },
    {
      icon: CheckCircle,
      title: "3. Potvrzení",
      description: "Po odsouhlasení všech detailů potvrdíte objednávku a my začneme s přípravou.",
      details: ["Finální menu", "Čas doručení", "Platební podmínky", "Kontaktní osoba"]
    },
    {
      icon: Truck,
      title: "4. Doručení",
      description: "Doručíme čerstvě připravené jídlo včas na místo konání vaší akce.",
      details: ["Včasné doručení", "Profesionální prezentace", "Kompletní servis", "Úklid po akci"]
    }
  ];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-white">
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
            Jak to funguje?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Objednání cateringu je u nás jednoduché a rychlé. Stačí čtyři kroky 
            a můžete se těšit na skvělé jídlo pro vaši akci.
          </p>
        </motion.div>

        {/* Process Steps */}
        <div className="max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row items-center gap-8 mb-16 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-6 lg:mb-4">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {step.description}
                </p>

                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual Element */}
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
                    <div className="w-48 h-48 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <step.icon className="w-16 h-16 text-orange-500" />
                    </div>
                  </div>
                  
                  {/* Step Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                </div>
              </div>

              {/* Connector Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-px h-16 bg-gray-300 mt-80"></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Připraveni začít?
            </h3>
            <p className="text-gray-600 mb-8">
              Kontaktujte nás ještě dnes a získejte nezávaznou cenovou nabídku pro vaši akci.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.dataLayer) {
                    window.dataLayer.push({
                      'event': 'cta_click',
                      'cta_location': 'process_section',
                      'cta_text': 'Vyplnit formulář'
                    });
                  }
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Vyplnit formulář
              </button>
              
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && window.dataLayer) {
                    window.dataLayer.push({
                      'event': 'cta_click',
                      'cta_location': 'process_section',
                      'cta_text': 'Zavolat nyní'
                    });
                  }
                  window.location.href = 'tel:+420771137288';
                }}
                className="flex items-center gap-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                771 137 288
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
