'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCategory, setActiveCategory] = useState('savory');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
              'event': 'section_view',
              'section_name': 'products'
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

  const categories = [
    { id: 'savory', name: 'Slané občerstvení', icon: '🥪' },
    { id: 'premium', name: 'Premium selection', icon: '🍾' },
    { id: 'hot', name: 'Teplá jídla', icon: '🍗' },
    { id: 'special', name: 'Speciální diety', icon: '🌱' }
  ];

  const products = {
    savory: [
      "Bagety mix (uzený losos, mozzarella a rajčata)",
      "Banketní pečivo mix (salám, parmská šunka, šunka/sýr)",
      "Box croissant (3 varianty)",
      "Box tousty",
      "Francouzské bagety krájené",
      "Obložené kaiserky mini",
      "Mini pizzy (šunkové a sýrové)",
      "Mix mini slaných plněných croissantů",
      "Mozzarella a cherry rajče špízy",
      "Mini burgery (s masem i vegetariánské)",
      "Tortilly s kuřecími stripsy"
    ],
    premium: [
      "Bambusová lodička s výběrovými uzeninami a sýry",
      "Fresh plate s parmskou šunkou",
      "Fresh plate s uzeným lososem",
      "Fresh plate s roastbeefem",
      "Fresh plate mix 4 sýrů",
      "Fresh plate mix 4 uzenin",
      "Kanapky s roastbeefem, okurkou a borůvkou",
      "Kanapky s parmskou šunkou a hroznovým vínem",
      "Kanapky s uzeným lososem, koprem a limetkou",
      "Kanapky s hermelínem a hroznovým vínem",
      "Masový box",
      "Sýrový box"
    ],
    hot: [
      "Smažené kuřecí řízečky",
      "Box stripsy v cornflakes",
      "Saláty (8 variant)",
      "Zachlazená jídla",
      "Pečivo čerstvé"
    ],
    special: [
      "Box bezlepkového pečiva",
      "Box pro vegany (pečivo, zelenina, ajvar, humus)",
      "Zeleninový box",
      "Bezlaktózové varianty",
      "Dietní menu na míru"
    ]
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        'event': 'product_category_view',
        'category': categoryId,
        'category_name': categories.find(c => c.id === categoryId)?.name
      });
    }
  };

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
            Co nabízíme
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Široké spektrum menu od tradiční české kuchyně po moderní gastronomii. 
            Vše připravujeme z čerstvých a sezónních surovin.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {products[activeCategory as keyof typeof products].map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-800 font-medium leading-relaxed">{product}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Doplňkové služby
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🍽️</div>
                <h4 className="font-semibold text-gray-900 mb-2">Pronájem inventáře</h4>
                <p className="text-gray-600 text-sm">Kompletní vybavení pro vaši akci</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">👨‍🍳</div>
                <h4 className="font-semibold text-gray-900 mb-2">Profesionální obsluha</h4>
                <p className="text-gray-600 text-sm">Zkušený personál pro bezchybný servis</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🚚</div>
                <h4 className="font-semibold text-gray-900 mb-2">Kompletní logistika</h4>
                <p className="text-gray-600 text-sm">Doručení a úklid po akci</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({
                  'event': 'cta_click',
                  'cta_location': 'products_section',
                  'cta_text': 'Zobrazit kompletní nabídku'
                });
              }
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Zobrazit kompletní nabídku
          </button>
        </motion.div>
      </div>
    </section>
  );
}
