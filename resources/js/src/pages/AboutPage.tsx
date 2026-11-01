import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/SectionHeading';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Shield, Heart, Users, Leaf, Home, Calendar, Map } from 'lucide-react';
const stats = [{
  label: 'Years Experience',
  value: '25+',
  icon: Calendar
}, {
  label: 'Happy Trekkers',
  value: '12k+',
  icon: Users
}, {
  label: 'Destinations',
  value: '50+',
  icon: Map
}, {
  label: 'Success Rate',
  value: '98%',
  icon: Award
}];
const values = [{
  icon: Home,
  title: 'Local Expertise',
  desc: 'Founded by Sherpas, we know every trail, village, and peak like the back of our hand.'
}, {
  icon: Shield,
  title: 'Safety First',
  desc: 'Your safety is paramount. Our guides are certified in first aid and high-altitude rescue.'
}, {
  icon: Leaf,
  title: 'Sustainable Tourism',
  desc: 'We leave no trace. We are committed to preserving the fragile Himalayan ecosystem.'
}, {
  icon: Heart,
  title: 'Community Impact',
  desc: 'A portion of every trip supports local schools and healthcare in remote villages.'
}];
const adminTeam = [{
  name: 'Sarah Johnson',
  role: 'Operations Manager',
  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
  bio: 'With a background in logistics, Sarah ensures every detail of your trip runs smoothly.'
}, {
  name: 'Maya Gurung',
  role: 'Cultural Liaison',
  image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop',
  bio: 'Maya bridges the gap between travelers and locals, offering deep cultural insights.'
}, {
  name: 'David Chen',
  role: 'Marketing Director',
  image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1974&auto=format&fit=crop',
  bio: 'David shares our adventures with the world, inspiring travelers to explore the Himalayas.'
}, {
  name: 'Anjali Thapa',
  role: 'Finance Manager',
  image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
  bio: 'Anjali manages our finances with precision, ensuring sustainable business practices.'
}];
const leadersTeam = [{
  name: 'Pemba Sherpa',
  role: 'Founder & Lead Guide',
  image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
  bio: 'Summiting Everest 5 times, Pemba founded the company to share authentic Himalayan culture.'
}, {
  name: 'Tenzing Norgay',
  role: 'Senior Trekking Guide',
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
  bio: "A legend on the trails, Tenzing's stories and humor make every trek unforgettable."
}, {
  name: 'Lakpa Sherpa',
  role: 'High Altitude Specialist',
  image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop',
  bio: 'Expert in technical climbing and high-altitude rescue with 15 years of experience.'
}, {
  name: 'Dawa Yangzom',
  role: 'Cultural Trek Leader',
  image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
  bio: 'Specializing in cultural immersion treks, Dawa brings deep knowledge of Buddhist traditions.'
}];
export function AboutPage() {
  const [activeTab, setActiveTab] = useState<'admin' | 'leaders'>('leaders');
  return <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" alt="Himalayan Peaks" className="w-full h-full object-cover" />
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
            Born in the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#06B6D4]">
              Mountains
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
            We are not just guides—we are storytellers, friends, and guardians
            of the peaks we call home.
          </motion.p>
        </div>
      </div>

      <main>
        {/* Our Story Section */}
        <section className="py-20 md:py-28">
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
                <SectionHeading title="25 Years of Adventure" subtitle="A quarter-century of guiding dreams to the roof of the world." centered={false} />
                <div className="prose prose-lg text-gray-600">
                  <p>
                    Himalayan Bespoke was founded in 1999 by a group of Sherpa
                    friends who shared a simple dream: to show the world the
                    true heart of the Himalayas. We grew up on these trails,
                    listening to the wind howl through the passes and the monks
                    chant in the monasteries.
                  </p>
                  <p>
                    We realized that many visitors were seeing the mountains,
                    but missing the magic. They were walking <i>through</i> the
                    landscape, not <i>with</i> it. We wanted to change that. We
                    wanted to create journeys that were immersive, respectful,
                    and deeply personal.
                  </p>
                  <p>
                    Today, after 25 years of leading expeditions, we are proud
                    to be a leading trekking agency in Nepal, Tibet, and Bhutan.
                    But our core mission remains unchanged: to guide you safely
                    to the roof of the world while honoring the culture and
                    environment that make this place so special.
                  </p>
                </div>
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
                <div className="absolute -inset-4 bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-2xl opacity-20 blur-lg transform rotate-2"></div>
                <img src="https://images.unsplash.com/photo-1589553416260-f586c8f1514f?q=80&w=2070&auto=format&fit=crop" alt="Sherpa Guide" className="relative rounded-2xl shadow-2xl w-full h-auto object-cover" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-[#0066FF] via-[#8B5CF6] to-[#06B6D4] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }}>
                  <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <stat.icon size={32} />
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-blue-100 font-medium">{stat.label}</div>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Our Values" subtitle="The principles that guide every step we take." />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-b-4 border-transparent hover:border-[#0066FF] group">
                  <div className="w-12 h-12 bg-blue-50 text-[#0066FF] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#0066FF] group-hover:text-white transition-colors">
                    <value.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {value.desc}
                  </p>
                </motion.div>)}
            </div>
          </div>
        </section>

        {/* Team Section with Tabs */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title="Meet the Team" subtitle="The passionate experts behind your journey." />

            {/* Tabs */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex bg-gray-100 rounded-full p-1">
                <button onClick={() => setActiveTab('leaders')} className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${activeTab === 'leaders' ? 'bg-gradient-to-r from-[#0066FF] to-[#06B6D4] text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}>
                  Leaders
                </button>
                <button onClick={() => setActiveTab('admin')} className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${activeTab === 'admin' ? 'bg-gradient-to-r from-[#0066FF] to-[#06B6D4] text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}>
                  Admin
                </button>
              </div>
            </div>

            {/* Team Grid */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0,
              y: -20
            }} transition={{
              duration: 0.3
            }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {(activeTab === 'leaders' ? leadersTeam : adminTeam).map((member, index) => <motion.div key={member.name} initial={{
                opacity: 0,
                scale: 0.9
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                delay: index * 0.1
              }} className="group relative overflow-hidden rounded-2xl shadow-lg">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-300" />

                      <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-bold mb-1">
                          {member.name}
                        </h3>
                        <p className="text-[#06B6D4] font-medium mb-3">
                          {member.role}
                        </p>
                        <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-3">
                          {member.bio}
                        </p>
                      </div>
                    </motion.div>)}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1533130061792-649d45df8c2d?q=80&w=1978&auto=format&fit=crop" alt="Himalayan Adventure" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply" />
          </div>

          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <motion.h2 initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your Adventure?
            </motion.h2>
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.1
          }} className="text-xl text-blue-100 mb-10">
              Join us for the journey of a lifetime. The mountains are calling.
            </motion.p>
            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.2
          }}>
              <Button variant="primary" size="lg" className="bg-white text-[#0066FF] hover:bg-gray-100 border-none">
                Plan Your Trip
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
}