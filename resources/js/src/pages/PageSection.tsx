import React, { use, useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SectionHeading } from '../components/ui/SectionHeading';
import { motion } from 'framer-motion';
import { Users, Award, Heart, Mountain } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../axiosHook';
import BASE_URL from '../global';
import StatsSection from '../components/StatsSection';
import TeamSection from '../components/TeamSection';
import AdvantageSection from '../components/AdvantageSection';
import { ReviewsSection } from '../components/ReviewsSection';
import LegalDocumentsSection from '../components/LegalDocumentsSection';
import CredentialsSection from '../components/CredentialsSection';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { DestinationsSection } from '../components/DestinationsSection';
import { PopularTripsSection } from "../components/PopularTripsSection";
import { PricingSection } from "../components/PricingSection";
import { TripsSection } from "../components/TripsSection";
import { WelcomeSection } from "../components/WelcomeSection";
import { ContactSection } from "../components/ContactSection";
import { NotFoundPage } from './NotFoundPage';
import { Seo } from '../components/Seo';
import PlaceExploresSection from '../components/PlaceExploresSection';

export function PageSection() {
      const { slug } = useParams();
      const [data, setData] = useState<any>(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(false);
  
      const fetchHomepageData = async () => {
          try {
              const res = await fetchData<any>("/page/" + slug);
  
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
      }, [slug]);

      if (!loading && (error || !data)) {
        return <NotFoundPage />;
      }
  
    return <div className="min-h-screen bg-white font-sans">
      <Seo
          seoMeta={{ ...data?.seo_meta, is_indexable: 0, is_followable: 0 }}
          fallbackTitle={data?.top_title}
          fallbackDescription={data?.subtitle}
          fallbackImage={data?.banner_image}
          canonicalPath={`/page/${slug}`}
          type="WebPage"
      />
      <Navbar />

      {/* Hero Section */}
      {data && 
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{
        backgroundImage: `url("${BASE_URL}/${data?.banner_image}")`
      }}>
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-900/50 to-blue-900/80" />
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
         {data?.icon && (
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
              <img src={`${BASE_URL}/${data?.icon}`} alt="Icon" className="w-8 h-8 object-contain" />
            </div>
          </motion.div>
          )}
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
            {data?.top_title}
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
            {data?.subtitle}
          </motion.p>
        </div>
      </div>
      }

      {data?.content_blocks?.map((block: any, index: number) => (
        block?.title && (
          <section key={index} className="py-20 px-4 max-w-4xl mx-auto">
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
              <SectionHeading title={block?.title} subtitle={block?.subtitle} />
              <div className="prose prose-lg max-w-none text-stone-700 leading-relaxed space-y-4">
                <div dangerouslySetInnerHTML={{ __html: block?.content }} />
              </div>
            </motion.div>
          </section>
        )
      ))}

      {/* Place Explores */}
      {(data?.place_explores || data?.placeExplores) && (
          <PlaceExploresSection places={data.place_explores || data.placeExplores} />
      )}
     
      {data && data?.additional_sections?.map((section: string) => {
          switch (section) {
              case "stats":
                  return <StatsSection key="stats" />;
              case "team":
                  return <TeamSection key="team" />;
              case "advantage":
                  return <AdvantageSection key="advantage" />;
              case "why_choose_us":
                  return <WhyChooseUs key="why_choose_us" />;
              case "review":
                  return <ReviewsSection key="review" />;
              case "legal_info":
                  return <LegalDocumentsSection key="legal_info" />;
              case "credential":
                  return <CredentialsSection key="credential" />;
              case "destinations":
                  return <DestinationsSection key="destinations" />;
              case "popular_trips":
                  return <PopularTripsSection key="popular_trips" />;
              case "pricing":
                  return <PricingSection key="pricing" />;
              case "trips":
                  return <TripsSection key="trips" />;
              case "welcome":
                  return <WelcomeSection key="welcome" data={data} loading={loading} error={error} />;
              case "contact":
                  return <ContactSection key="contact" />;
              default:
                  return null;
          }
      })}
      

      {/* Join Our Team CTA */}
      {data && data?.cta && data?.cta?.title && (
      <section className="py-20 px-4 bg-gradient-to-br from-blue-900 to-cyan-900 text-white">
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
            <img src={`${BASE_URL}/${data?.cta?.icon}`} alt="CTA Icon" className="w-12 h-12 object-contain mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {data?.cta?.title}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {data?.cta?.subtitle}
            </p>
            {data?.cta?.primary && data?.cta?.primary?.label &&
            <a href={data?.cta?.primary?.url} rel="noopener noreferrer">
              <button className="mx-1 inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 border-2 border-blue-600 text-white hover:bg-white/10 px-8 py-4 text-lg border-2 border-blue-600 text-white hover:bg-white hover:cursor-pointer ">
                {data?.cta?.primary?.label}
              </button>
            </a>
      }
            {data?.cta?.secondary && data?.cta?.secondary?.label &&
            <a href={data?.cta?.secondary?.url} rel="noopener noreferrer">
              <button className="mx-1 inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:cursor-pointer ">
                {data?.cta?.secondary?.label}
              </button>
            </a>
      }

          </motion.div>
        </div>
      </section>
      )}

      <Footer />
    </div>;
}