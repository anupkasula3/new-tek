import React, { useEffect, useState } from 'react';
import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';
import { motion } from 'framer-motion';
import { fetchData } from '../axiosHook';

export function ContactSection() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetchData('/global/settings').then(res => setSettings(res || {}));
  }, []);

  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Panel - Company Details */}
          <div>
            <ContactInfo settings={settings} />
          </div>

          {/* Right Panel - Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>

        {/* Google Map Section */}
        {settings?.map_embed_url && (
        <div className="mt-16">
          <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Visit Our Office
            </h2>
          </motion.div>

          <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }} className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            
               
                <iframe src={settings?.map_embed_url} width="100%" height="100%" style={{
                border: 0
              }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map Placeholder" />
           
          </motion.div>
          
        </div>
         )}
      </div>
    </section>
  );
}
