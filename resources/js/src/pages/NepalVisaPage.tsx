import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { motion } from 'framer-motion';
import { FileText, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../axiosHook';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';
import NotFound from '../components/NotFound';

export function NepalVisaPage() {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchGuideData = async () => {
    try {
      const res: any = await fetchData("/guide/" + slug);
      if (res && res.related_guides && res.related_guides.nepal_visa) {
        setData(res.related_guides.nepal_visa);
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
        backgroundImage: `url(${data.cover_image ? `/${data.cover_image}` : '"https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=1933&auto=format&fit=crop"'})`
      }}>
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 via-green-900/50 to-green-900/80" />
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
                 <FileText className="text-white" size={32} />
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
            {data.title || 'Nepal Visa & Entry Requirements'}
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
        }} className="text-xl md:text-2xl text-green-100 font-light max-w-2xl mx-auto">
            {data.subtitle || 'Everything you need to know about entering Nepal'}
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
          <SectionHeading title={data.heading || "Tourist Visa for Nepal"} subtitle={data.subheading || "Overview"} />
          <div 
            className="prose prose-lg max-w-none text-stone-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: data.content || '' }}
          />
        </motion.div>
      </section>

      {/* Visa Options */}
      {data.visa_options && data.visa_options.length > 0 && (
        <section className="bg-green-50 py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <SectionHeading title="Visa Options & Fees" subtitle="Choose your duration" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.visa_options.map((option: any, index: number) => <motion.div key={index} initial={{
              opacity: 0,
              y: 30
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock className="text-white" size={32} />
                  </div>
                  <h3 className="text-3xl font-bold text-stone-900 mb-2">
                      {option.duration}
                    </h3>
                    <div className="text-2xl font-bold text-stone-900 mb-2">
                      {option.price}
                    </div>
                    <p className="text-stone-600 text-sm">
                      {option.description}
                    </p>
                </motion.div>)}
            </div>
          </div>
        </section>
      )}

      {/* Requirements */}
      {data.required_documents && data.required_documents.length > 0 && (
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <SectionHeading title="Required Documents" subtitle="What you need to bring" />
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <ul className="space-y-4">
              {data.required_documents.map((doc: any, index: number) => <motion.li key={index} initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="flex items-start gap-4">
                      <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} />
                      <span className="text-stone-700">{doc.title}</span>
                    </motion.li>)}
            </ul>
          </div>
        </section>
      )}

      {/* Application Process */}
      {data.application_process && data.application_process.length > 0 && (
        <section className="bg-stone-50 py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <SectionHeading title="Visa on Arrival Process" subtitle="Step-by-step guide" />
            <div className="space-y-6">
              {data.application_process.map((step: any, index: number) => <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="bg-white rounded-xl p-6 md:p-8 flex gap-6 shadow-sm">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-lg">
                      {step.step_number || index + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900 mb-2">
                      {step.title}
                    </h3>
                    <div className="text-stone-600 leading-relaxed prose max-w-none" dangerouslySetInnerHTML={{ __html: step.description || '' }} />
                  </div>
                </motion.div>)}
            </div>
          </div>
        </section>
      )}

      {/* Important Information */}
      {data.important_notes && data.important_notes.length > 0 && (
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <SectionHeading title="Important Information" subtitle="Things to know" />
          <div className="space-y-6">
            {data.important_notes.map((note: any, index: number) => {
              const borderColors = {
                info: 'border-blue-500',
                warning: 'border-yellow-500',
                danger: 'border-red-500',
                default: 'border-stone-500'
              };
              const bgColors = {
                info: 'bg-blue-50',
                warning: 'bg-yellow-50',
                danger: 'bg-red-50',
                default: 'bg-stone-50'
              };
              const textColors = {
                info: 'text-blue-900',
                warning: 'text-yellow-900',
                danger: 'text-red-900',
                default: 'text-stone-900'
              };
              const pColors = {
                info: 'text-blue-800',
                warning: 'text-yellow-800',
                danger: 'text-red-800',
                default: 'text-stone-800'
              };
              const noteColor = (note.color as keyof typeof borderColors) || 'default';
              return (
                <div key={index} className={`${bgColors[noteColor]} rounded-xl p-6 border-l-4 ${borderColors[noteColor]}`}>
                  <h3 className={`font-bold ${textColors[noteColor]} mb-2`}>{note.title}</h3>
                  <div className={`${pColors[noteColor]} max-w-none prose leading-relaxed`} dangerouslySetInnerHTML={{ __html: note.description || '' }} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
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
              Need Help with Visa & Permits?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              We assist with all documentation and permit arrangements
            </p>
            <a href="#contact">
              <button className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-colors">
                Contact Us
              </button>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>;
}