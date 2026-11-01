import React, { lazy, useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ContactForm } from '../components/ContactForm';
import { ContactInfo } from '../components/ContactInfo';
import { motion } from 'framer-motion';
import { fetchData } from '../axiosHook';

export function ContactPage() {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    fetchData('/global/settings').then(res => setSettings(res || {}));
  }, []);

  return <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Navbar />

      {/* Banner Section */}
      <div className="relative h-[40vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-10" />
          <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop" alt="Contact Us Banner" className="w-full h-full object-cover" />
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
        }} className="text-5xl md:text-6xl font-bold text-white mb-4">
            Contact Us
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
            Have questions about your next adventure? We're here to help you
            plan the perfect Himalayan trek. Get in touch with our expert team
            today.
          </motion.p>
        </div>
      </div>

      {/* Main Contact Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
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
      </main>

      {/* Google Map Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our head office is located in the heart of Thamel, Kathmandu's
              tourist hub. Drop by for a coffee and let's plan your adventure
              together.
            </p>
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
        }} className="w-full h-[500px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
            {settings?.map_embed_url ? (
                <div 
                    dangerouslySetInnerHTML={{ __html: settings.map_embed_url }} 
                    className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                />
            ) : (
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.0234567890123!2d85.31234567890123!3d27.71234567890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQyJzQ0LjQiTiA4NcKwMTgnNDQuNCJF!5e0!3m2!1sen!2snp!4v1234567890123!5m2!1sen!2snp" width="100%" height="100%" style={{
                border: 0
              }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Map Placeholder" />
            )}
            
          </motion.div>

          <motion.div initial={{
          opacity: 0,
          y: 10
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} className="mt-6 text-center">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">Address:</span>{' '}
              {settings?.address || 'Thamel Marg, Kathmandu 44600, Nepal'}
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>;
}