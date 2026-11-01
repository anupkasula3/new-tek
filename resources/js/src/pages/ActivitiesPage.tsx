import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { TripsGrid } from '../components/TripsGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { Mountain, Heart, Compass, Camera, Waves, Bike, Check, Calendar, ChevronDown } from 'lucide-react';
const activityCategories = [{
  icon: Mountain,
  title: 'Trekking & Hiking',
  desc: 'From gentle day hikes to challenging high-altitude expeditions',
  color: 'bg-blue-100 text-blue-600',
  activities: ['Everest Base Camp', 'Annapurna Circuit', 'Langtang Valley', 'Manaslu Circuit'],
  link: '#'
}, {
  icon: Heart,
  title: 'Cultural Tours',
  desc: 'Immerse yourself in ancient traditions and local communities',
  color: 'bg-purple-100 text-purple-600',
  activities: ['Kathmandu Valley Tour', 'Monastery Visits', 'Village Homestays', 'Festival Tours'],
  link: '#'
}, {
  icon: Compass,
  title: 'Adventure Sports',
  desc: 'Adrenaline-pumping activities for thrill seekers',
  color: 'bg-orange-100 text-orange-600',
  activities: ['Paragliding', 'White Water Rafting', 'Bungee Jumping', 'Rock Climbing'],
  link: '#'
}, {
  icon: Camera,
  title: 'Wildlife Safari',
  desc: 'Encounter rare species in their natural habitat',
  color: 'bg-green-100 text-green-600',
  activities: ['Chitwan Safari', 'Bardia National Park', 'Bird Watching', 'Jungle Walks'],
  link: '#'
}, {
  icon: Waves,
  title: 'Spiritual Journeys',
  desc: 'Find peace and enlightenment in sacred sites',
  color: 'bg-cyan-100 text-cyan-600',
  activities: ['Meditation Retreats', 'Yoga Tours', 'Pilgrimage Circuits', 'Temple Visits'],
  link: '#spiritual-journeys'
}, {
  icon: Bike,
  title: 'Cycling Tours',
  desc: 'Explore valleys and villages on two wheels',
  color: 'bg-red-100 text-red-600',
  activities: ['Kathmandu Valley Ride', 'Pokhara Lakeside', 'Mountain Biking', 'Village Circuits'],
  link: '#'
}];
const difficultyLevels = [{
  level: 'Easy',
  color: 'bg-green-100 text-green-800 border-green-200',
  desc: 'Suitable for beginners, minimal physical demands, low altitude',
  examples: 'Cultural tours, short hikes, wildlife safaris'
}, {
  level: 'Moderate',
  color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  desc: 'Requires good fitness, some altitude gain, 5-7 hours daily activity',
  examples: 'Annapurna Circuit, Langtang Valley, adventure sports'
}, {
  level: 'Challenging',
  color: 'bg-orange-100 text-orange-800 border-orange-200',
  desc: 'High fitness required, high altitude, 6-8 hours daily trekking',
  examples: 'Everest Base Camp, Manaslu Circuit, technical climbs'
}, {
  level: 'Extreme',
  color: 'bg-red-100 text-red-800 border-red-200',
  desc: 'Expert level, extreme altitude, technical skills required',
  examples: 'Peak climbing, advanced mountaineering expeditions'
}];
const whyChooseUs = ['Expert local guides with decades of mountain experience', 'Small group sizes for personalized attention', 'Comprehensive safety protocols and emergency support', 'Sustainable tourism practices supporting local communities', 'Flexible itineraries tailored to your fitness level', 'All permits, logistics, and accommodations handled'];
export function ActivitiesPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  return <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
          <img src="https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070&auto=format&fit=crop" alt="Himalayan Activities" className="w-full h-full object-cover" />
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.h1 initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-4xl md:text-6xl font-bold text-white mb-4">
            Luxury &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#06B6D4]">
              Activities
            </span>
          </motion.h1>
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.2
        }} className="text-xl text-gray-200 max-w-2xl mx-auto">
            From challenging treks to cultural immersions, discover the perfect
            adventure for your Himalayan journey.
          </motion.p>
        </div>
      </div>

      <main>
        {/* Overview Section - Text Only */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
          }} className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Adventure Awaits in the Himalayas
              </h2>
              <div className="prose prose-lg text-gray-700 max-w-none space-y-4">
                <p>
                  The Himalayas offer an unparalleled range of experiences for
                  every type of traveler. Whether you're seeking the thrill of
                  high-altitude trekking, the serenity of ancient monasteries,
                  or the excitement of adventure sports, we have the perfect
                  activity for you.
                </p>
                <p>
                  Our carefully curated experiences are designed to showcase the
                  best of Nepal, Tibet, and Bhutan while ensuring your safety,
                  comfort, and cultural immersion. With expert local guides,
                  sustainable practices, and flexible itineraries, we make your
                  Himalayan dreams a reality.
                </p>
                <p>
                  From beginners taking their first mountain steps to seasoned
                  adventurers tackling technical peaks, we welcome all skill
                  levels and create personalized journeys that match your
                  abilities and aspirations.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Activity Categories */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Activity Categories" subtitle="Choose your adventure style and explore what the Himalayas have to offer." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activityCategories.map((category, index) => <motion.a key={index} href={category.link} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer block">
                  <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <category.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0066FF] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.activities.map((activity, i) => <span key={i} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        {activity}
                      </span>)}
                  </div>
                </motion.a>)}
            </div>
          </div>
        </section>

        {/* Trips Grid */}
        <TripsGrid />

        {/* Collapsible Sections */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Additional Information" subtitle="Everything you need to know to plan your perfect adventure." />

            <div className="space-y-4">
              {/* Why Choose Us - Collapsible */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <button onClick={() => toggleSection('why-choose-us')} className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Why Choose Our Activities?
                    </h3>
                    <p className="text-gray-600">
                      Learn what makes our experiences exceptional
                    </p>
                  </div>
                  <ChevronDown size={24} className={`text-gray-600 transition-transform duration-300 ${expandedSection === 'why-choose-us' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {expandedSection === 'why-choose-us' && <motion.div initial={{
                  height: 0,
                  opacity: 0
                }} animate={{
                  height: 'auto',
                  opacity: 1
                }} exit={{
                  height: 0,
                  opacity: 0
                }} transition={{
                  duration: 0.3
                }} className="overflow-hidden">
                      <div className="px-8 pb-6 pt-2 border-t border-gray-100">
                        <p className="text-gray-700 text-lg mb-6">
                          With over 25 years of experience guiding adventures in
                          the Himalayas, we've perfected the art of creating
                          unforgettable, safe, and meaningful experiences.
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {whyChooseUs.map((reason, index) => <li key={index} className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-[#0066FF] flex items-center justify-center shrink-0 mt-0.5">
                                <Check size={14} className="text-white" />
                              </div>
                              <span className="text-gray-700">{reason}</span>
                            </li>)}
                        </ul>
                      </div>
                    </motion.div>}
                </AnimatePresence>
              </motion.div>

              {/* Difficulty Levels - Collapsible */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.1
            }} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <button onClick={() => toggleSection('difficulty-levels')} className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Understanding Difficulty Levels
                    </h3>
                    <p className="text-gray-600">
                      Choose activities that match your fitness and experience
                    </p>
                  </div>
                  <ChevronDown size={24} className={`text-gray-600 transition-transform duration-300 ${expandedSection === 'difficulty-levels' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {expandedSection === 'difficulty-levels' && <motion.div initial={{
                  height: 0,
                  opacity: 0
                }} animate={{
                  height: 'auto',
                  opacity: 1
                }} exit={{
                  height: 0,
                  opacity: 0
                }} transition={{
                  duration: 0.3
                }} className="overflow-hidden">
                      <div className="px-8 pb-6 pt-2 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {difficultyLevels.map((level, index) => <div key={index} className={`border-2 ${level.color} rounded-xl p-6`}>
                              <h4 className="text-xl font-bold mb-3">
                                {level.level}
                              </h4>
                              <p className="text-gray-700 mb-3">{level.desc}</p>
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">Examples:</span>{' '}
                                {level.examples}
                              </p>
                            </div>)}
                        </div>
                      </div>
                    </motion.div>}
                </AnimatePresence>
              </motion.div>

              {/* Seasonal Activities - Collapsible */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.2
            }} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <button onClick={() => toggleSection('seasonal-activities')} className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Activities by Season
                    </h3>
                    <p className="text-gray-600">
                      Plan your visit around the best time for your chosen
                      activities
                    </p>
                  </div>
                  <ChevronDown size={24} className={`text-gray-600 transition-transform duration-300 ${expandedSection === 'seasonal-activities' ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {expandedSection === 'seasonal-activities' && <motion.div initial={{
                  height: 0,
                  opacity: 0
                }} animate={{
                  height: 'auto',
                  opacity: 1
                }} exit={{
                  height: 0,
                  opacity: 0
                }} transition={{
                  duration: 0.3
                }} className="overflow-hidden">
                      <div className="px-8 pb-6 pt-2 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-100">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center">
                                <Calendar size={24} />
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-gray-900">
                                  Spring & Autumn
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  Peak Season
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-4 font-medium">
                              March-May & September-November
                            </p>
                            <ul className="space-y-2">
                              {['High-altitude trekking (Everest, Annapurna)', 'Mountain biking and cycling tours', 'Paragliding with clear mountain views', 'Cultural festivals and celebrations', 'Wildlife safaris in pleasant weather'].map((activity, i) => <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                  <div className="w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-xs">✓</span>
                                  </div>
                                  <span>{activity}</span>
                                </li>)}
                            </ul>
                          </div>

                          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-100">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center">
                                <Calendar size={24} />
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-gray-900">
                                  Winter & Monsoon
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  Off Season
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-4 font-medium">
                              December-February & June-August
                            </p>
                            <ul className="space-y-2">
                              {['Low-altitude cultural tours', 'Meditation and yoga retreats', 'Upper Mustang (rain shadow area)', 'Chitwan jungle safari (winter)', 'Kathmandu Valley exploration'].map((activity, i) => <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                  <div className="w-4 h-4 bg-orange-500 text-white rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-xs">✓</span>
                                  </div>
                                  <span>{activity}</span>
                                </li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-[#0066FF] to-[#06B6D4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Can't decide which activity is right for you? Our expert team will
              help you create the perfect itinerary based on your interests and
              fitness level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" className="bg-white text-[#0066FF] hover:bg-gray-100 border-none">
                Plan Your Trip
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#0066FF]">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
}