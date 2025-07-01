import Hero from '@/components/Hero'
import Services from '@/components/Services'
import ProductShowcase from '@/components/ProductShowcase'
import WhyChooseUs from '@/components/WhyChooseUs'
import Process from '@/components/Process'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <ProductShowcase />
      <WhyChooseUs />
      <Process />
      <ContactForm />
      <Footer />
    </main>
  );
}
