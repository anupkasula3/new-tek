import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { TripsGrid } from '../components/TripsGrid';
import { motion } from 'framer-motion';
import { Heart, Sunrise, Sparkles, Flower2, Mountain, MapPin, Check, ArrowRight, Clock, Users } from 'lucide-react';
const spiritualTypes = [{
  icon: Sunrise,
  title: 'Meditation Retreats',
  desc: 'Silent meditation, mindfulness practices, and inner peace in serene mountain settings',
  duration: '3-14 Days',
  color: 'bg-purple-100 text-purple-600'
}, {
  icon: Flower2,
  title: 'Yoga Immersions',
  desc: 'Daily yoga practice, pranayama, and holistic wellness with Himalayan views',
  duration: '7-21 Days',
  color: 'bg-blue-100 text-blue-600'
}, {
  icon: Sparkles,
  title: 'Pilgrimage Circuits',
  desc: 'Sacred site visits, temple ceremonies, and spiritual guidance from monks',
  duration: '5-10 Days',
  color: 'bg-amber-100 text-amber-600'
}, {
  icon: Mountain,
  title: 'Monastery Stays',
  desc: 'Live with monks, learn Buddhist philosophy, and experience monastic life',
  duration: '3-7 Days',
  color: 'bg-cyan-100 text-cyan-600'
}];
const featuredPrograms = [{
  title: 'Kopan Monastery Meditation Course',
  location: 'Kathmandu Valley',
  duration: '7 Days',
  level: 'All Levels',
  price: '$450',
  image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop',
  highlights: ['Guided meditation sessions twice daily', 'Buddhist philosophy teachings', 'Vegetarian meals included', 'Certificate of completion']
}, {
  title: 'Pokhara Yoga & Wellness Retreat',
  location: 'Pokhara Lakeside',
  duration: '10 Days',
  level: 'Beginner to Advanced',
  price: '$850',
  image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=2064&auto=format&fit=crop',
  highlights: ['Morning and evening yoga classes', 'Ayurvedic treatments and consultations', 'Sunrise meditation by Phewa Lake', 'Himalayan mountain views']
}, {
  title: 'Lumbini Pilgrimage Journey',
  location: "Lumbini (Buddha's Birthplace)",
  duration: '5 Days',
  level: 'All Levels',
  price: '$650',
  image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1a65a3e?q=80&w=2070&auto=format&fit=crop',
  highlights: ['Visit Maya Devi Temple', 'Explore international monasteries', 'Meditation under Bodhi Tree', 'Buddhist scholar guidance']
}];
const sacredLocations = [{
  name: 'Kopan Monastery',
  desc: 'Tibetan Buddhist monastery offering meditation courses and teachings',
  image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop'
}, {
  name: 'Swayambhunath (Monkey Temple)',
  desc: 'Ancient hilltop stupa with panoramic valley views and prayer wheels',
  image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop'
}, {
  name: 'Boudhanath Stupa',
  desc: 'One of the largest stupas in the world, center of Tibetan Buddhism in Nepal',
  image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=1933&auto=format&fit=crop'
}, {
  name: 'Lumbini',
  desc: 'UNESCO World Heritage site, birthplace of Lord Buddha',
  image: 'https://images.unsplash.com/photo-1604608672516-f1b9b1a65a3e?q=80&w=2070&auto=format&fit=crop'
}];
const benefits = ['Reduce stress and anxiety through proven meditation techniques', 'Deepen your yoga practice in authentic Himalayan settings', 'Learn from experienced Buddhist monks and yoga masters', 'Disconnect from technology and reconnect with yourself', 'Experience profound inner peace and clarity', 'Join a supportive community of like-minded seekers'];
const included = ['Accommodation in peaceful retreat centers', 'All meditation/yoga sessions and teachings', 'Vegetarian meals (breakfast, lunch, dinner)', 'Experienced spiritual teachers and guides', 'Course materials and certificates', 'Airport transfers and local transportation'];
export function SpiritualJourneysPage() {
  return <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-purple-900/50 to-purple-900/80 z-10" />
          <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1999&auto=format&fit=crop" alt="Spiritual Journey" className="w-full h-full object-cover" />
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16">
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
              <Heart className="text-white" size={32} />
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
        }} className="text-4xl md:text-6xl font-bold text-white mb-4">
            Spiritual Journeys
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
        }} className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
            Find inner peace, deepen your practice, and awaken your spirit in
            the sacred Himalayas.
          </motion.p>
          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.8,
          delay: 0.6
        }}>
            <Button variant="primary" size="lg" className="bg-white text-purple-900 hover:bg-purple-50 border-none">
              Explore Programs
            </Button>
          </motion.div>
        </div>
      </div>

      <main>
        {/* Overview */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }}>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Journey Within
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  The Himalayas have been a spiritual sanctuary for thousands of
                  years. Here, where the earth meets the sky, seekers from
                  around the world come to meditate, practice yoga, and find
                  enlightenment. Our spiritual journeys offer authentic
                  experiences guided by experienced teachers in some of the most
                  sacred places on Earth.
                </p>
              </motion.div>
            </div>

            {/* Types of Spiritual Journeys */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {spiritualTypes.map((type, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
                  <div className={`w-14 h-14 ${type.color} rounded-xl flex items-center justify-center mb-4`}>
                    <type.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {type.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{type.desc}</p>
                  <div className="flex items-center gap-2 text-sm text-purple-700 font-medium">
                    <Clock size={16} />
                    <span>{type.duration}</span>
                  </div>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Trips Grid - All Available Treks */}
        <TripsGrid />

        {/* Featured Spiritual Programs */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Featured Spiritual Programs" subtitle="Carefully curated experiences for your inner journey." />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPrograms.map((program, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                  <div className="relative h-56 overflow-hidden">
                    <img src={program.image} alt={program.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                      {program.level}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin size={16} className="text-purple-600" />
                      <span>{program.location}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                      {program.title}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>Small Groups</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {program.highlights.map((highlight, i) => <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check size={16} className="text-purple-600 shrink-0 mt-0.5" />
                          <span>{highlight}</span>
                        </div>)}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        {program.price && (
                          <>
                            <p className="text-xs text-gray-500">Starting from</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {program.price}
                            </p>
                          </>
                        )}
                      </div>
                      <Button variant="primary" size="sm" className="bg-purple-600 hover:bg-purple-700 border-none">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Sacred Locations */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Sacred Locations" subtitle="Visit the most revered spiritual sites in the Himalayas." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sacredLocations.map((location, index) => <motion.div key={index} initial={{
              opacity: 0,
              scale: 0.95
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="group relative h-64 rounded-xl overflow-hidden shadow-lg">
                  <img src={location.image} alt={location.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 w-full">
                    <h4 className="text-xl font-bold text-white mb-2">
                      {location.name}
                    </h4>
                    <p className="text-gray-200 text-sm">{location.desc}</p>
                  </div>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{
              opacity: 0,
              x: -30
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6
            }}>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Transform Your Life
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Our spiritual journeys offer more than just a vacation—they
                  provide tools and experiences that create lasting positive
                  change in your life.
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => <motion.li key={index} initial={{
                  opacity: 0,
                  x: 20
                }} whileInView={{
                  opacity: 1,
                  x: 0
                }} viewport={{
                  once: true
                }} transition={{
                  delay: index * 0.1
                }} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={14} className="text-white" />
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </motion.li>)}
                </ul>
              </motion.div>

              <motion.div initial={{
              opacity: 0,
              x: 30
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              duration: 0.6
            }} className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl opacity-20 blur-xl"></div>
                <img src="https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=2064&auto=format&fit=crop" alt="Meditation Practice" className="relative rounded-2xl shadow-2xl w-full h-auto object-cover" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              What's Included
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {included.map((item, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="flex items-start gap-3 bg-white p-4 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={14} className="text-white" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8 md:p-12 text-center border border-purple-200">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="text-white" size={32} />
              </div>
              <blockquote className="text-2xl text-gray-800 italic font-medium mb-6 max-w-3xl mx-auto">
                "My meditation retreat at Kopan Monastery changed my life. The
                teachings, the peaceful environment, and the supportive
                community helped me find a clarity I'd been searching for years.
                I left feeling renewed and with tools I use every day."
              </blockquote>
              <p className="text-gray-700 font-semibold">— Sarah Mitchell</p>
              <p className="text-gray-600 text-sm">
                7-Day Meditation Retreat, 2023
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Begin Your Spiritual Journey
            </h2>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Whether you're new to meditation or an experienced practitioner,
              we have the perfect spiritual experience for you. Let us guide you
              on a transformative journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" className="bg-white text-purple-600 hover:bg-purple-50 border-none">
                View All Programs
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
}