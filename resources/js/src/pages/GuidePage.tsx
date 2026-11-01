import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../axiosHook';
import BASE_URL from '../global';
import { Seo } from '../components/Seo';
import Loading from '../components/Loading';
import NotFound from '../components/NotFound';

export function GuidePage() {
   const { slug } = useParams();
      const [data, setData] = useState<any>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(false);
  
      const fetchHomepageData = async () => {
          try {
              const res = await fetchData("/guide/" + slug);
  
              if (res) {
                  setData(res);
              } else {
                  setData(null);
              }
          } catch (err) {
              setError(true);
          } finally {
              setLoading(false);
          }
      };
  
      useEffect(() => {
          fetchHomepageData();
      }, []);
  if (loading) {
    return <Loading />;
  }

  if (error || !data) {
    return <NotFound message="Guide Not Found" />;
  }

  return <div className="min-h-screen bg-white font-sans text-gray-900">
      <Seo
          seoMeta={data?.seo_meta}
          fallbackTitle={data?.title}
          fallbackDescription={data?.subtitle}
          fallbackImage={data?.cover_image}
          canonicalPath={`/guide/${slug}`}
          type="HowTo"
      />
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10" />
          <img src={data.cover_image ? `${BASE_URL}/${data.cover_image}` : "https://images.unsplash.com/photo-1533130061792-649d45df8c2d?q=80&w=1978&auto=format&fit=crop"} alt={data.title} className="w-full h-full object-cover" />
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-16">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              {data.icon ? (
                 <img src={`${BASE_URL}/${data.icon}`} alt="" className="w-8 h-8 object-contain" />
              ) : (
                 <BookOpen className="text-white" size={32} />
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
        }} className="text-4xl md:text-6xl font-bold text-white mb-4">
            {data.title}
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
        }} className="text-xl text-gray-200 max-w-2xl mx-auto">
            {data.subtitle}
          </motion.p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Facts */}
         {data?.quick_facts?.some((t: any) => t.label) && (
        <section className="mb-20">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Quick Facts
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {(data?.quick_facts || []).map((fact: any, index: number) => <motion.div key={index} initial={{
              opacity: 0,
              scale: 0.9
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="text-center">
                  <p className="text-blue-100 text-sm mb-2">{fact.label}</p>
                  <p className="text-white text-lg font-bold">{fact.fact || fact.value}</p>
                </motion.div>)}
            </div>
          </motion.div>
        </section>
        )}

        {/* Overview */}
        <section className="mb-20">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }}>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center">
                {data.heading || 'Overview'}
              </h2>
              {data.subheading && (
                <p className="text-xl text-gray-600 text-center mb-8">{data.subheading}</p>
              )}
              <div 
                className="prose prose-lg max-w-none text-gray-700 space-y-4"
                dangerouslySetInnerHTML={{ __html: data.description || '' }}
              />
            </motion.div>
          </div>
        </section>

        {/* Related Guides */}
        {((data?.related_guides_list?.length > 0) || (data?.related_guides?.linked_pages?.length > 0)) && (
        <section className="mb-20 bg-gray-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Related Guides &amp; Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Relationship-based related guides */}
            {(data?.related_guides_list || []).map((rg: any, index: number) => (
              <motion.a
                key={`rg-${rg.id}`}
                href={`/related-guides/${rg.slug}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-[#0066FF] hover:shadow-lg transition-all flex items-center justify-between"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-[#0066FF] transition-colors">
                    {rg.title}
                  </h4>
                  {rg.excerpt && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{rg.excerpt}</p>
                  )}
                </div>
                <ArrowRight size={20} className="text-gray-400 group-hover:text-[#0066FF] group-hover:translate-x-1 transition-all shrink-0" />
              </motion.a>
            ))}

            {/* Legacy linked_pages fallback */}
            {data?.related_guides?.linked_pages && data.related_guides.linked_pages.map((linkPage: any, index: number) => {
              if (!linkPage.guide_slug) return null;
              return (
                <motion.a key={`dynamic-${index}`} 
                  href={`/related-guides/${linkPage.guide_slug}`} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: ((data?.related_guides_list?.length || 0) + index) * 0.1 }}
                  className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-[#0066FF] hover:shadow-lg transition-all flex items-center justify-between"
                >
                  <h4 className="text-lg font-semibold text-gray-900 group-hover:text-[#0066FF] transition-colors">
                    {linkPage.title || linkPage.custom_title || 'Related Guide'}
                  </h4>
                  <ArrowRight size={20} className="text-gray-400 group-hover:text-[#0066FF] group-hover:translate-x-1 transition-all" />
                </motion.a>
              );
            })}
          </div>
        </section>
        )}

        {/* Expert Tip */}
        {data?.expert_tips?.some((t: any) => t.title) && (
        <section className="mb-20">
          {data.expert_tips.filter((t: any) => t.title).map((tip: any, index: number) => (
             <motion.div key={index} initial={{
             opacity: 0,
             y: 20
           }} whileInView={{
             opacity: 1,
             y: 0
           }} viewport={{
             once: true
           }} className="bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-[#0066FF] rounded-r-2xl p-8 mb-8">
               <div className="flex items-start gap-4">
                 <div className="w-12 h-12 bg-[#0066FF] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                    {tip.icon ? (
                      <img src={`${BASE_URL}/${tip.icon}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <img 
                        src={typeof document !== 'undefined' ? (document.querySelector("link[rel*='icon']")?.getAttribute('href') || `${BASE_URL}/favicon.ico`) : `${BASE_URL}/favicon.ico`} 
                        alt="Favicon" 
                        className="w-6 h-6 object-contain filter invert brightness-0" 
                      />
                    )}
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-gray-900 mb-3">
                     {tip.title}
                   </h3>
                   <div className="text-gray-700 leading-relaxed mb-4 prose" dangerouslySetInnerHTML={{ __html: tip.content || '' }} />
                   <p className="text-gray-900 font-semibold">
                     {tip.guide}
                   </p>
                 </div>
               </div>
             </motion.div>
          ))}
        </section>
        )}

        {/* CTA */}
        <section className="bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
             Ready to Explore {data?.title || 'the Himalayas'}?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Now that you have the complete guide for {data?.title || 'this destination'}, let our expert team help you
            plan your adventure. We'll handle all the logistics so you can focus
            on the experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" className="bg-white text-[#0066FF] hover:bg-gray-100 border-none">
              Book Your Trek
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#0066FF]">
              Contact Our Team
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
}