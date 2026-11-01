import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { motion } from 'framer-motion';
import { Heart, Droplet, Utensils, Moon } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../axiosHook';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import NotFound from '../components/NotFound';

export function PostTrekRecoveryPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchGuideData = async () => {
    try {
      const res: any = await fetchData("/guide/" + slug);
      if (res && res.related_guides && res.related_guides.post_trek_recovery) {
        setData(res.related_guides.post_trek_recovery);
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
        backgroundImage: `url(${data.cover_image ? `/${data.cover_image}` : '"https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop"'})`
      }}>
          <div className="absolute inset-0 bg-gradient-to-b from-teal-900/70 via-teal-900/50 to-teal-900/80" />
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
            {data.title || 'Post-Trek Recovery & Care'}
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
        }} className="text-xl md:text-2xl text-teal-100 font-light max-w-2xl mx-auto">
            {data.subtitle || 'Take care of your body after the adventure of a lifetime'}
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
          <SectionHeading title={data.heading || "The Importance of Recovery"} subtitle={data.subheading || "Overview"} />
          <div 
            className="prose prose-lg max-w-none text-stone-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: data.content || '' }}
          />
        </motion.div>
      </section>

      {/* Recovery Timeline */}
      {data.timeline && data.timeline.length > 0 && (
        <section className="bg-teal-50 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <SectionHeading title="Recovery Timeline" subtitle="What to expect" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.timeline.map((tip: any, index: number) => <motion.div key={index} initial={{
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
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {tip.icon && tip.icon.includes('.') ? (
                        <img src={`/${tip.icon}`} alt="" className="w-8 h-8 object-contain" />
                      ) : (
                        <Heart size={28} className="text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-900 mb-1">
                        {tip.title}
                      </h3>
                      <span className="text-sm text-teal-600 font-semibold">
                        {tip.duration}
                      </span>
                    </div>
                  </div>
                  <p className="text-stone-700 leading-relaxed">
                    {tip.description}
                  </p>
                </motion.div>)}
            </div>
          </div>
        </section>
      )}

      {/* Common Issues */}
      {data.common_issues && data.common_issues.length > 0 && (
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <SectionHeading title="Common Post-Trek Issues" subtitle="And how to address them" />
          <div className="space-y-6">
            {data.common_issues.map((issue: any, index: number) => {
              const borderColors = ['border-blue-600', 'border-green-600', 'border-amber-600', 'border-purple-600'];
              const textColors = ['text-blue-900', 'text-green-900', 'text-amber-900', 'text-purple-900'];
              const pColors = ['text-blue-800', 'text-green-800', 'text-amber-800', 'text-purple-800'];
              const bgColors = ['bg-blue-50', 'bg-green-50', 'bg-amber-50', 'bg-purple-50'];
              const idx = index % borderColors.length;
              return (
                <div key={index} className={`${bgColors[idx]} rounded-xl p-6 border-l-4 ${borderColors[idx]}`}>
                  <h3 className={`text-lg font-bold ${textColors[idx]} mb-3`}>
                    {issue.title}
                  </h3>
                  <div 
                    className={`${pColors[idx]} leading-relaxed mb-3 prose max-w-none`}
                    dangerouslySetInnerHTML={{ __html: issue.description || '' }}
                  />
                  {issue.solution && (
                     <div 
                       className={`${pColors[idx]} leading-relaxed mb-3 prose max-w-none`}
                       dangerouslySetInnerHTML={{ __html: issue.solution }}
                     />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Nutrition */}
      {data.nutrition && data.nutrition.length > 0 && (
        <section className="bg-stone-50 py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeading title="Post-Trek Nutrition" subtitle="Foods that help recovery" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.nutrition.map((item: any, index: number) => (
                <div key={index} className="bg-white rounded-xl p-6">
                  <h3 className="font-bold text-stone-900 mb-3">
                    {item.title}
                  </h3>
                  <div 
                     className="text-stone-600 mb-3 prose max-w-none"
                     dangerouslySetInnerHTML={{ __html: item.description || '' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* When to See a Doctor */}
      {data.medical_attention && data.medical_attention.length > 0 && (
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <SectionHeading title="When to Seek Medical Attention" subtitle="Warning signs" />
          <div className="bg-red-50 rounded-2xl p-8 border-l-4 border-red-600">
             {data.medical_attention.map((symptom: any, index: number) => <>
            <h3 className="text-xl font-bold text-red-900 mb-4">
             {symptom.title}
            </h3>
            <div className="space-y-3">
             
              <div key={index} className="flex items-start gap-3">
                  <div className="text-red-800">
                     {(symptom.items || []).map((s: any, sIdx: number) => (
                  
                         <div key={sIdx} className="text-sm"><span className="text-red-600 font-bold text-xl me-1">!</span> {s.title}</div>
                     ))}
                  </div>
                </div>
            </div>
            </>
            )}
          </div>
        </section>
      )}

      {/* Mental Recovery */}
      {data.mental_recovery && (
        <section className="bg-teal-50 py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeading title={data.mental_recovery.title || "Mental & Emotional Recovery"} subtitle={data.mental_recovery.subtitle || "The psychological aspect"} />
            <div className="bg-white rounded-2xl p-8">
              <div 
                className="text-stone-700 leading-relaxed mb-4 space-y-4"
                dangerouslySetInnerHTML={{ __html: data.mental_recovery.content || '' }}
              />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
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
              Ready for Your Next Adventure?
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              Once you've recovered, start planning your next Himalayan journey
            </p>
            <a href="#plan-trip">
              <button className="bg-white text-teal-600 px-8 py-4 rounded-full font-semibold hover:bg-teal-50 transition-colors">
                Explore More Treks
              </button>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>;
}