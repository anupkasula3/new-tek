import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mountain, Home, ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  const [faviconUrl, setFaviconUrl] = useState('/favicon.ico');

  useEffect(() => {
    const faviconLink = document.querySelector("link[rel*='icon']");
    if (faviconLink) {
      const href = faviconLink.getAttribute('href');
      if (href) {
        setFaviconUrl(href);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 pt-52 pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Lost in the Clouds?
            </h1>
            <p className="text-gray-300 text-lg">
              The peak you're looking for doesn't seem to exist. Let's get you back to base camp and start a new adventure.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="flex-grow flex items-center justify-center px-4 py-16 bg-gray-50/50">
        <div className="max-w-xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-10 relative inline-block"
          >
            <div className="w-48 h-48 bg-blue-100/50 rounded-full flex items-center justify-center">
              <img 
                src={faviconUrl} 
                alt="Favicon Background" 
                className="w-24 h-24 object-contain opacity-10 absolute" 
              />
              <span className="text-9xl font-black text-[#0066FF] tracking-tighter mix-blend-multiply">404</span>
            </div>
            
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-xl"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <img src={faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0066FF] text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 hover:-translate-y-1"
            >
              <Home size={20} />
              Back to Home
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-full font-bold hover:border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-16 grid grid-cols-3 gap-8 opacity-40 max-w-sm mx-auto"
          >
            <div className="h-1 bg-gray-200 rounded-full" />
            <div className="h-1 bg-[#0066FF] rounded-full" />
            <div className="h-1 bg-gray-200 rounded-full" />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
