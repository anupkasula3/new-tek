import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { motion } from 'framer-motion';
import { Backpack, CheckCircle, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../axiosHook';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import NotFound from '../components/NotFound';

export function PackingListPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchGuideData = async () => {
    try {
      const res: any = await fetchData("/guide/" + slug);
      if (res && res.related_guides && res.related_guides.complete_packing_list) {
        setData(res.related_guides.complete_packing_list);
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
        backgroundImage: `url(${data.cover_image ? `/${data.cover_image}` : '"https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?q=80&w=2070&auto=format&fit=crop"'})`
      }}>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/50 to-blue-900/80" />
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
                <Backpack className="text-white" size={32} />
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
            {data.title || 'Complete Packing List'}
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
        }} className="text-xl md:text-2xl text-blue-100 font-light max-w-2xl mx-auto">
            {data.subtitle || 'Everything you need to pack for your trek'}
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
          <SectionHeading title={data.heading || "Packing Smart for High Altitude"} subtitle={data.subheading || "Overview"} />
          <div 
            className="prose prose-lg max-w-none text-stone-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: data.content || '' }}
          />
        </motion.div>
      </section>

      {/* Important Notices */}
      {data.important_notices && data.important_notices.length > 0 && (
        <section className="bg-amber-50 py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.important_notices.map((notice: any, idx: number) => (
                <div key={idx} className={`bg-white rounded-xl p-6 border-l-4 ${notice.icon === 'tick' ? 'border-green-500' : 'border-blue-500'}`}>
                  <div className="flex items-start gap-3">
                    {notice.icon === 'tick' ? (
                      <CheckCircle className="text-green-500 shrink-0 mt-1" size={24} />
                    ) : (
                      <AlertCircle className="text-blue-500 shrink-0 mt-1" size={24} />
                    )}
                    <div>
                      <h3 className="font-bold text-stone-900 mb-2">
                        {notice.title}
                      </h3>
                      <p className="text-stone-600 text-sm">
                        {notice.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Packing List Categories */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <SectionHeading title="Detailed Packing List" subtitle="Organized by category" />
        <div className="space-y-8">
          {(data.categories || []).map((category: any, index: number) => <motion.div key={index} initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.05
        }} className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">
                  {category.title}
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {(category.items || []).map((item: any, itemIndex: number) => <div key={itemIndex} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
                      <div className="flex items-center gap-3">
                        {item.icon === 'tick' || item.essential ? <CheckCircle className="text-green-500 shrink-0" size={20} /> : <div className="w-5 h-5 border-2 border-stone-300 rounded shrink-0" />}
                        <span className="text-stone-900 font-medium">
                          {item.title}
                        </span>
                      </div>
                      <span className="text-stone-600 text-sm">
                        {item.quantity}
                      </span>
                    </div>)}
                </div>
              </div>
            </motion.div>)}
        </div>
      </section>

      {/* Tips Section */}
      {data.tips && data.tips.length > 0 && (
        <section className="bg-stone-50 py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeading title="Packing Tips" subtitle="Expert advice" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.tips.map((tip: any, idx: number) => (
                <div key={idx} className="bg-white rounded-xl p-6">
                  <h3 className="font-bold text-stone-900 mb-3">{tip.title}</h3>
                  <p className="text-stone-600 leading-relaxed max-w-none">
                    {tip.description}
                  </p>
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
              Need Help with Gear Selection?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Our team can provide personalized packing advice based on the
              season and your trek
            </p>
            <a href="#contact">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-colors">
                Contact Our Experts
              </button>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>;
}