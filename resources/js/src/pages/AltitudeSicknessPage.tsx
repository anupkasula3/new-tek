import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { motion } from 'framer-motion';
import { Heart, AlertTriangle, TrendingDown, Shield } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../axiosHook';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import NotFound from '../components/NotFound';

export function AltitudeSicknessPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchGuideData = async () => {
    try {
      const res: any = await fetchData("/guide/" + slug);
      if (res && res.related_guides && res.related_guides.altitude_sickness) {
        setData(res.related_guides.altitude_sickness);
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
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/70 via-red-900/50 to-red-900/80" />
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
                 <Heart className="text-white" size={32} />
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
            {data.title || 'Altitude Sickness Prevention'}
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
        }} className="text-xl md:text-2xl text-red-100 font-light max-w-2xl mx-auto">
            {data.subtitle || 'Essential guide to recognizing, preventing, and treating altitude sickness'}
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
          <SectionHeading title={data.heading || "Understanding Altitude Sickness"} subtitle={data.subheading || "What You Need to Know"} />
          <div 
            className="prose prose-lg max-w-none text-stone-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: data.content || '' }}
          />
        </motion.div>
      </section>

      {/* Symptoms */}
      {data.symptoms && data.symptoms.length > 0 && (
        <section className="bg-stone-50 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <SectionHeading title="Recognizing the Symptoms" subtitle="Know the warning signs" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.symptoms.map((level: any, index: number) => <motion.div key={index} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className={`bg-white rounded-2xl p-8 shadow-lg border-t-4 border-red-500`}>
                  <h3 className={`text-xl font-bold mb-6 ${level.color === 'yellow' ? 'text-yellow-700' : level.color === 'orange' ? 'text-orange-700' : 'text-red-700'}`}>
                    {level.title}
                  </h3>
                  <ul className="space-y-3">
                    {(level.items || []).map((sign: any, signIndex: number) => <li key={signIndex} className="flex items-start gap-3">
                        <AlertTriangle className={`shrink-0 mt-0.5 ${level.color === 'yellow' ? 'text-yellow-500' : level.color === 'orange' ? 'text-orange-500' : 'text-red-500'}`} size={18} />
                        <span className="text-stone-700">{sign.title}</span>
                      </li>)}
                  </ul>
                </motion.div>)}
            </div>
          </div>
        </section>
      )}

      {/* Prevention Strategies */}
      {data.prevention_strategies && data.prevention_strategies.length > 0 && (
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <SectionHeading title="Prevention Strategies" subtitle="How to avoid altitude sickness" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.prevention_strategies.map((strategy: any, index: number) => <motion.div key={index} initial={{
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
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
                  {strategy.icon && strategy.icon.includes('.') ? (
                    <img src={`/${strategy.icon}`} alt="" className="w-8 h-8 object-contain" />
                  ) : (
                    <Shield size={28} className="text-white" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">
                  {strategy.title}
                </h3>
                <p className="text-stone-700 leading-relaxed">
                  {strategy.description}
                </p>
              </motion.div>)}
          </div>
        </section>
      )}

      {/* Treatment Protocol */}
      {data.treatment_protocol && data.treatment_protocol.length > 0 && (
        <section className="bg-red-50 py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeading title="What to Do If Symptoms Appear" subtitle="Treatment protocol" />
            
            {data.treatment_protocol.map((protocol: any, index: number) => (
              <div key={index} className="bg-white rounded-2xl p-8 md:p-12 border-l-4 border-red-600 mb-8 last:mb-0">
                <div className="space-y-6">
                  <div 
                    className="prose prose-lg max-w-none text-stone-700 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: protocol.content || '' }}
                  />
                  {protocol.notification_box && (
                    <div className="bg-red-100 rounded-xl p-6">
                      <div 
                        className="text-red-800 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: protocol.notification_box }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Medications */}
      {data.medications && data.medications.length > 0 && (
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <SectionHeading title="Medications" subtitle="Consult your doctor before the trek" />
          <div className="bg-blue-50 rounded-2xl p-8">
            <div className="space-y-6">
              {data.medications.map((med: any, index: number) => (
                <div key={index}>
                  <h3 className="text-lg font-bold text-stone-900 mb-2">
                    {med.title}
                  </h3>
                  <div className="text-stone-700 leading-relaxed prose max-w-none mb-2" dangerouslySetInnerHTML={{ __html: med.description || '' }} />
                  {med.important_note && (
                    <div className="bg-white rounded-xl p-6 border-l-4 border-blue-600 mt-4">
                      <div className="text-stone-700 leading-relaxed prose max-w-none">
                         <span dangerouslySetInnerHTML={{ __html: med.important_note }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
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
              Trek Safely with Expert Guidance
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Our experienced guides are trained in altitude sickness
              recognition and emergency response
            </p>
            <a href="#plan-trip">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors">
                Plan Your Trek
              </button>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>;
}