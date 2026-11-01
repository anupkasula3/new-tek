import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Shield, Users, Heart, Award, MapPin, Leaf, Clock, Star } from 'lucide-react';
const reasons = [{
  icon: Shield,
  title: 'Safety First',
  description: 'Comprehensive safety protocols, experienced guides trained in high-altitude first aid, and 24/7 emergency support ensure your wellbeing throughout the journey.'
}, {
  icon: Users,
  title: 'Expert Local Guides',
  description: 'Our certified Sherpa guides have decades of combined experience and intimate knowledge of the trails, culture, and mountains.'
}, {
  icon: Heart,
  title: 'Personalized Service',
  description: 'Small group sizes and customizable itineraries mean we can adapt to your pace, preferences, and fitness level for a truly personal experience.'
}, {
  icon: Award,
  title: 'Proven Track Record',
  description: 'Over 15 years of operation with thousands of successful treks and a 100% safety record. Our reputation speaks for itself.'
}, {
  icon: MapPin,
  title: 'Authentic Experiences',
  description: 'We take you beyond tourist trails to genuine cultural encounters, local homestays, and hidden gems known only to locals.'
}, {
  icon: Leaf,
  title: 'Sustainable Tourism',
  description: 'We practice responsible tourism that benefits local communities, minimizes environmental impact, and preserves the Himalayas for future generations.'
}, {
  icon: Clock,
  title: 'Flexible Scheduling',
  description: 'Multiple departure dates throughout the season and the ability to create custom itineraries that fit your timeline and goals.'
}, {
  icon: Star,
  title: 'All-Inclusive Packages',
  description: 'Transparent pricing with no hidden costs. Permits, accommodations, meals, guides, and porters all included for peace of mind.'
}];
const testimonials = [{
  quote: 'The best decision we made was choosing Himalayan Bespoke. Our guide Pemba was incredible—knowledgeable, patient, and genuinely cared about our experience.',
  author: 'Sarah Johnson',
  location: 'USA',
  rating: 5
}, {
  quote: 'From planning to execution, everything was flawless. The attention to safety and comfort while maintaining authenticity was impressive.',
  author: 'James Chen',
  location: 'Singapore',
  rating: 5
}, {
  quote: "This wasn't just a trek—it was a life-changing experience. The team's passion for their culture and mountains was contagious.",
  author: 'Emma Williams',
  location: 'UK',
  rating: 5
}];
export function WhyChooseUsPage() {
  return <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop")'
      }}>
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-stone-900/80" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Star className="text-white" size={32} />
            </div>
          </motion.div>
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Why Choose Us
          </motion.h1>
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.4
        }} className="text-xl md:text-2xl text-stone-100 font-light max-w-2xl mx-auto">
            Experience the difference that passion, expertise, and genuine care
            make
          </motion.p>
        </div>
      </div>

      {/* Overview Section */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }}>
          <SectionHeading title="What Sets Us Apart" subtitle="Our Commitment" />
          <div className="prose prose-lg max-w-none text-stone-700 leading-relaxed space-y-4">
            <p>
              For over 15 years, Himalayan Bespoke has been the trusted choice
              for adventurers seeking authentic, safe, and transformative
              experiences in the Himalayas. We're not just another trekking
              company—we're a family-run business built on values of integrity,
              sustainability, and genuine hospitality.
            </p>
            <p>
              What makes us different is simple: we care deeply about every
              aspect of your journey. From the moment you contact us to the day
              you return home, you'll experience the difference that comes from
              working with people who are truly passionate about what they do.
            </p>
            <p>
              Our team consists of local experts who were born and raised in the
              mountains, combined with international coordinators who understand
              the needs of travelers from around the world. This unique blend
              ensures you get the best of both worlds—authentic local knowledge
              with world-class service standards.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Reasons Grid */}
     

      {/* Testimonials */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <SectionHeading title="What Our Clients Say" subtitle="Real experiences from real travelers" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => <Star key={i} size={20} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-stone-700 leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div>
                <p className="font-bold text-stone-900">{testimonial.author}</p>
                <p className="text-sm text-stone-600">{testimonial.location}</p>
              </div>
            </motion.div>)}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-20 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied travelers who chose Himalayan Bespoke
              for their adventure
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#plan-trip">
                <Button variant="primary" size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-none">
                  Plan Your Trek
                </Button>
              </a>
              <a href="#contact">
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600">
                  Contact Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>;
}