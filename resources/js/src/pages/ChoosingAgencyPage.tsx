import React, { memo } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { motion } from 'framer-motion';
import { Shield, Award, Users, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../axiosHook';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import NotFound from '../components/NotFound';

export function ChoosingAgencyPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchGuideData = async () => {
    try {
      const res: any = await fetchData("/guide/" + slug);
      if (res && res.related_guides && res.related_guides.choosing_agency) {
        setData(res.related_guides.choosing_agency);
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
        backgroundImage: `url(${data.cover_image ? `/${data.cover_image}` : '"https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"'})`
      }}>
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/70 via-indigo-900/50 to-indigo-900/80" />
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
                 <Shield className="text-white" size={32} />
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
            {data.title || 'Choosing the Right Trekking Agency'}
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
        }} className="text-xl md:text-2xl text-indigo-100 font-light max-w-2xl mx-auto">
            {data.subtitle || 'Make an informed decision for a safe and memorable trek'}
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
          <SectionHeading title={data.heading || "Why Your Choice Matters"} subtitle={data.subheading || "Overview"} />
          <div 
            className="prose prose-lg max-w-none text-stone-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: data.content || '' }}
          />
        </motion.div>
      </section>

      {/* Criteria */}
      {data.selection_criteria && data.selection_criteria.length > 0 && (
        <section className="bg-stone-50 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <SectionHeading title="Key Selection Criteria" subtitle="What to look for" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.selection_criteria.map((item: any, index: number) => <motion.div key={index} initial={{
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
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
                    {item.icon && item.icon.includes('.') ? (
                      <img src={`/${item.icon}`} alt="" className="w-8 h-8 object-contain" />
                    ) : (
                      <Shield size={28} className="text-white" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-stone-900 mb-4">
                    {item.title}
                  </h3>
                  <ul className="space-y-3">
                    {(item.items || []).map((point: any, pointIndex: number) => <li key={pointIndex} className="flex items-start gap-3">
                        <span className="text-indigo-500 font-bold">✓</span>
                        <span className="text-stone-700">{point.title}</span>
                      </li>)}
                  </ul>
                </motion.div>)}
            </div>
          </div>
        </section>
      )}

      {/* Questions to Ask */}
      {data.questions_to_ask && data.questions_to_ask.length > 0 && (
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <SectionHeading title="Questions to Ask" subtitle="Before booking" />
          <div className="space-y-4">
            {data.questions_to_ask.map((question: any, index: number) => <motion.div key={index} initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.05
          }} className="bg-indigo-50 rounded-xl p-6 border-l-4 border-indigo-600">
                <p className="text-stone-700 font-medium">{question.title}</p>
              </motion.div>)}
          </div>
        </section>
      )}

      {/* Red Flags */}
      {data.warning_signs && data.warning_signs[0]?.items?.length > 0 && (
        <section className="bg-red-50 py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeading title="Warning Signs to Avoid" subtitle="Red flags" />
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-start gap-4 mb-6">
                <AlertCircle className="text-red-600 shrink-0" size={32} />
                <div>
                  <h3 className="text-xl font-bold text-red-900 mb-2">
                    {data.warning_signs[0]?.title || 'Be Cautious If You See:'}
                  </h3>
                  <p className="text-red-700">
                    {data.warning_signs[0]?.description || 'These warning signs often indicate unprofessional or potentially unsafe operators'}
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                {data.warning_signs[0].items.map((flag: any, index: number) => <li key={index} className="flex items-start gap-3 py-2">
                    <span className="text-red-600 font-bold text-xl">×</span>
                    <span className="text-stone-700">{flag.title}</span>
                  </li>)}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      {data.why_choose_us?.title && (
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <SectionHeading title={data.why_choose_us.title || "Why Himalayan Bespoke?"} subtitle={data.why_choose_us.subtitle || "Our commitment"} />
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12">
            <div className="space-y-6">
              <div 
                  className="prose prose-lg max-w-none text-stone-700 leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: data.why_choose_us.content || '' }}
              />
              <div className="pt-6">
                <a href={data.why_choose_us.link_url || "#why-choose-us"}>
                  <button className="bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-indigo-700 transition-colors">
                    {data.why_choose_us.link_label || 'Learn More About Us'}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
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
              Ready to Trek with Confidence?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Contact us with any questions—we're here to help you make the
              right choice
            </p>
            <a href="#contact">
              <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-indigo-50 transition-colors">
                Get in Touch
              </button>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>;
}