'use client'

import { motion } from 'framer-motion'
import { Award, Clock, Heart, Shield, Star, Users } from 'lucide-react'
import { useEffect, useRef } from 'react'

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
              'event': 'section_view',
              'section_name': 'why_choose_us'
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

  const features = [
    {
      icon: Heart,
      title: "Čerstvé suroviny",
      description: "Pracujeme pouze s čerstvými a sezónními surovinami od osvědčených dodavatelů. Kvalita je pro nás prioritou."
    },
    {
      icon: Users,
      title: "Individuální přístup",
      description: "Každý klient je pro nás jedinečný. Připravíme menu přesně podle vašich požadavků a preferencí."
    },
    {
      icon: Clock,
      title: "Rychlé doručení",
      description: "Garantujeme včasné doručení až k vám. Víme, jak důležitý je čas při organizaci akcí."
    },
    {
      icon: Award,
      title: "Profesionální servis",
      description: "Náš tým má bohaté zkušenosti s cateringem. Postaráme se o bezchybný průběh vaší akce."
    },
    {
      icon: Shield,
      title: "Spolehlivost",
      description: "Již několik let poskytujeme cateringové služby. Naši klienti se na nás mohou vždy spolehnout."
    },
    {
      icon: Star,
      title: "Estetické zpracování",
      description: "Dbáme na detaily od chutí a vůní až po vizuální prezentaci. Jídlo musí vypadat stejně dobře, jako chutná."
    }
  ];

  const stats = [
    { number: "500+", label: "Spokojených klientů" },
    { number: "1000+", label: "Úspěšných akcí" },
    { number: "5+", label: "Let zkušeností" },
    { number: "100%", label: "Spokojenost" }
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
            Proč si vybrat nás?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Jsme profesionální cateringová společnost s vášní pro kvalitní gastronomii 
            a osobní přístup ke každému klientovi.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6 group-hover:bg-orange-500 transition-colors duration-300">
                <feature.icon className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 md:p-12 text-white"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Naše úspěchy v číslech
            </h3>
            <p className="text-lg opacity-90">
              Důvěra našich klientů je naším největším úspěchem
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base opacity-90">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="text-4xl text-orange-500 mb-4">"</div>
            <blockquote className="text-xl text-gray-700 italic mb-6 leading-relaxed">
              Zakládáme si na individuálním přístupu ke každému klientovi. Připravíme pro vás 
              návrh menu podle vašeho přání, zajistíme profesionální obsluhu, inventář i kompletní logistiku. 
              Ať už plánujete malou rodinnou oslavu nebo velkou firemní konferenci, postaráme se o to, 
              aby vše proběhlo hladce a stylově.
            </blockquote>
            <div className="text-gray-600">
              <div className="font-semibold">Náš přístup</div>
              <div className="text-sm">Catering v krabici</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
