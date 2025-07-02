'use client'

import { motion } from 'framer-motion'
import { Calendar, Mail, MapPin, Phone, Send, User, Users } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

const formSchema = z.object({
  name: z.string().min(2, 'Jméno musí mít alespoň 2 znaky'),
  email: z.string().email('Neplatná emailová adresa'),
  phone: z.string().min(9, 'Neplatné telefonní číslo'),
  eventType: z.string().min(1, 'Vyberte typ akce'),
  eventDate: z.string().min(1, 'Vyberte datum akce'),
  guestCount: z.string().min(1, 'Zadejte počet hostů'),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const watchedFields = watch();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
              'event': 'section_view',
              'section_name': 'contact'
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

  useEffect(() => {
    // Track form start when user starts typing
    const hasStarted = Object.values(watchedFields).some(value => value && value.length > 0);
    if (hasStarted && typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        'event': 'form_start',
        'form_name': 'contact_form'
      });
    }
  }, [watchedFields]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Track form submission attempt
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        'event': 'form_submit',
        'form_name': 'contact_form',
        'event_type': data.eventType,
        'guest_count': data.guestCount
      });
    }

    try {
      // Send to Railway backend API
      const response = await fetch('https://catering-landing-page-production.up.railway.app/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitStatus('success');
        reset();

        // Track successful submission
        if (typeof window !== 'undefined' && window.dataLayer) {
          window.dataLayer.push({
            'event': 'form_submit_success',
            'form_name': 'contact_form',
            'lead_id': result.leadId
          });
        }
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');

      // Track form error
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          'event': 'form_submit_error',
          'form_name': 'contact_form',
          'error_message': error instanceof Error ? error.message : 'Unknown error'
        });
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const eventTypes = [
    'Firemní akce',
    'Svatba',
    'Narozeniny',
    'Konference',
    'Seminář',
    'Venkovní akce',
    'Jiné'
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-20 bg-white">
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
            Kontaktujte nás
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vyplňte formulář a my vám připravíme nezávaznou cenovou nabídku 
            přesně na míru vaší akce.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <User className="w-4 h-4" />
                  Jméno a příjmení *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  placeholder="Vaše jméno"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Mail className="w-4 h-4" />
                  Email *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  placeholder="vas@email.cz"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Phone className="w-4 h-4" />
                  Telefon *
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  placeholder="+420 123 456 789"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Event Type */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <Calendar className="w-4 h-4" />
                  Typ akce *
                </label>
                <select
                  {...register('eventType')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="">Vyberte typ akce</option>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.eventType && (
                  <p className="text-red-500 text-sm mt-1">{errors.eventType.message}</p>
                )}
              </div>

              {/* Event Date & Guest Count */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Calendar className="w-4 h-4" />
                    Datum akce *
                  </label>
                  <input
                    {...register('eventDate')}
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  />
                  {errors.eventDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.eventDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <Users className="w-4 h-4" />
                    Počet hostů *
                  </label>
                  <input
                    {...register('guestCount')}
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="50"
                  />
                  {errors.guestCount && (
                    <p className="text-red-500 text-sm mt-1">{errors.guestCount.message}</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="text-gray-700 font-medium mb-2 block">
                  Zpráva (volitelné)
                </label>
                <textarea
                  {...register('message')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-vertical"
                  placeholder="Další informace o vaší akci, speciální požadavky..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Odesílám...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Odeslat poptávku
                  </>
                )}
              </button>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                  Děkujeme! Vaše poptávka byla odeslána. Ozveme se vám do 24 hodin.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  Omlouváme se, došlo k chybě. Zkuste to prosím znovu nebo nás kontaktujte telefonicky.
                </div>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Kontaktní informace
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Telefon</div>
                    <a href="tel:+420771137288" className="text-orange-500 hover:text-orange-600">
                      +420 771 137 288
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Adresa</div>
                    <div className="text-gray-600">
                      Křižíkova 270<br />
                      Čelákovice, 250 88
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600">info@cateringvkrabici.cz</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-3">Rychlá odpověď</h4>
              <p className="text-gray-600 mb-4">
                Potřebujete rychlou odpověď? Zavolejte nám přímo!
              </p>
              <a
                href="tel:+420771137288"
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300"
              >
                <Phone className="w-4 h-4" />
                Zavolat nyní
              </a>
            </div>

            <div className="text-sm text-gray-500">
              <p className="mb-2">
                <strong>Objednat catering lze na:</strong> 771 137 288
              </p>
              <p>
                <strong>IČO:</strong> 24655619 | <strong>DIČ:</strong> CZ24655619
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
