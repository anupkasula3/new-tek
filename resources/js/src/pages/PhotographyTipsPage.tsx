import React, { memo } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { motion } from 'framer-motion';
import { Camera, Sun, Mountain, Smartphone } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../axiosHook';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import NotFound from '../components/NotFound';

export function PhotographyTipsPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchGuideData = async () => {
    try {
      const res: any = await fetchData("/guide/" + slug);
      if (res && res.related_guides && res.related_guides.photography_tips) {
        setData(res.related_guides.photography_tips);
      } else {
        setData(null);
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuideData();
  }, [slug]);

  if (loading) {
    return <Loading />;
  }

  if (error || !data) {
    return <NotFound message="Content Not Found" />;
  }

  return <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{
        backgroundImage: `url(${data.cover_image ? `/${data.cover_image}` : '"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"'})`
      }}>
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-purple-900/50 to-purple-900/80" />
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
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden">
              {data.icon ? (
                 <img src={`/${data.icon}`} alt="" className="w-10 h-10 object-contain" />
              ) : (
                 <Camera className="text-white" size={32} />
              )}
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
            {data.title || 'Photography Tips for Himalayan Treks'}
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
        }} className="text-xl md:text-2xl text-purple-100 font-light max-w-2xl mx-auto">
            {data.subtitle || 'Capture the majesty of the Himalayas with professional techniques'}
          </motion.p>
        </div>
      </div>

      {/* Overview */}
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
          <SectionHeading title={data.heading || "Photographing the Himalayas"} subtitle={data.subheading || "Overview"} />
          <div 
            className="prose prose-lg max-w-none text-stone-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: data.content || '' }}
          />
        </motion.div>
      </section>

      {/* Tips Grid */}
      {data.tips && data.tips.length > 0 && (
        <section className="bg-stone-50 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.tips.map((tip: any, index: number) => <motion.div key={index} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="bg-white rounded-2xl p-8 shadow-md">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
                    {tip.icon ? <img src={`/${tip.icon}`} alt="" className="w-8 h-8 object-contain" /> : <Camera size={28} className="text-stone-700" />}
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3">
                    {tip.title}
                  </h3>
                  <div 
                     className="prose prose-stone max-w-none text-stone-600 leading-relaxed"
                     dangerouslySetInnerHTML={{ __html: tip.description || '' }} 
                  />
                </motion.div>)}
            </div>
          </div>
        </section>
      )}

      {/* Gear Recommendations */}
      {data.recommended_gear && data.recommended_gear.length > 0 && (
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <SectionHeading title="Recommended Gear" subtitle="What to bring" />
          <div className="space-y-6">
            {data.recommended_gear.map((gear: any, index: number) => <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 flex items-start gap-4">
                  <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center shrink-0">
                    <Sun size={24} className="text-stone-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 mb-2">
                      {gear.title}
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {gear.description}
                    </p>
                  </div>
                </div>)}
          </div>
        </section>
      )}

      {/* Best Shots */}
      {data.must_capture_moments && data.must_capture_moments.length > 0 && (
        <section className="bg-stone-50 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <SectionHeading title="Must-Capture Moments" subtitle="Don't miss these shots" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.must_capture_moments.map((shot: any, index: number) => <motion.div key={index} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-stone-900 mb-2">
                    {shot.title}
                  </h3>
                  <p className="text-stone-600 text-sm">{shot.description}</p>
                </motion.div>)}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
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
              Ready to Capture Your Adventure?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join us for a trek designed with photography in mind
            </p>
            <a href="#plan-trip">
              <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-purple-50 transition-colors">
                Plan Your Trek
              </button>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>;
}