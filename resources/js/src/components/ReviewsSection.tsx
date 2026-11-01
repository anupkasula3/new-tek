import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { fetchData } from '../axiosHook';
import BASE_URL from '../global';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';


export function ReviewsSection() {
  const [data, setData] = useState(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Record<number, boolean>>({});
  const splideRef = useRef<any>(null);
   const fetchHomepageData = async () => {
          try {
              const res = await fetchData("/components/reviews");
 
              if (res) {
                  setData(res);
              } else {
                  setData(null);
              }

              const settingsRes = await fetchData("/global/settings");
              if (settingsRes) {
                  setSettings(settingsRes);
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

  if (loading) return null;
  if (error || !data || data.length === 0) return null;

  const sliderReviews = data.slice(0, 10);

  return (
    <section className="py-20 bg-blue-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeading title="What Our Travelers Say" subtitle="Hundreds of travellers have trusted us to guide their journeys. Read their experiences and discover why they recommend us." />

       

        {/* Reviews Slider */}
        <div className="relative max-w-7xl mx-auto px-12">
          <Splide
            ref={splideRef}
            options={{
              type: 'loop',
              perPage: 3,
              perMove: 1,
              gap: '2rem',
              arrows: false,
              pagination: true,
              breakpoints: {
                1024: {
                  perPage: 2,
                  gap: '1.5rem',
                },
                768: {
                  perPage: 1,
                  gap: '1rem',
                },
              },
            }}
            className="reviews-splide"
          >
            {sliderReviews.map((review) => (
              <SplideSlide key={review.id} className="py-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative text-start h-full flex flex-col justify-between">
                  <div>
                    <Quote className="absolute top-6 right-6 text-blue-100" size={48} />
                    <div className="flex gap-1 mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={18} className="fill-[#FFD700] text-[#FFD700]" />
                      ))}
                    </div>
                    {(() => {
                      const isExpanded = expandedReviews[review.id];
                      const cleanText = review.review.replace(/<[^>]*>/g, ''); // strip HTML tag if any
                      const needsTruncation = cleanText.length > 200;
                      
                      if (needsTruncation && !isExpanded) {
                        const truncated = cleanText.slice(0, 200) + '...';
                        return (
                          <p className="text-gray-700 italic mb-6 leading-relaxed">
                            {truncated}{' '}
                            <button
                              onClick={() => setExpandedReviews(prev => ({ ...prev, [review.id]: true }))}
                              className="text-blue-600 hover:text-blue-700 underline font-semibold ml-1 cursor-pointer bg-transparent border-none p-0 inline"
                            >
                              see more
                            </button>
                          </p>
                        );
                      }

                      return (
                        <p className="text-gray-700 italic mb-6 leading-relaxed">
                          <span dangerouslySetInnerHTML={{ __html: review.review }} />
                          {needsTruncation && (
                            <button
                              onClick={() => setExpandedReviews(prev => ({ ...prev, [review.id]: false }))}
                              className="text-blue-600 hover:text-blue-700 underline font-semibold ml-2 cursor-pointer bg-transparent border-none p-0 inline"
                            >
                              show less
                            </button>
                          )}
                        </p>
                      );
                    })()}
                  </div>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#06B6D4] flex items-center justify-center text-white font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                      <p className="text-xs text-gray-500">{review.country}</p>
                    </div>
                  </div>
                </div>
              </SplideSlide>
            ))}
          </Splide>

          {/* Custom Arrows — outside Splide, wired via ref */}
          {sliderReviews.length > 3 && (
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none flex justify-between z-10">
              <button
                onClick={() => splideRef.current?.splide?.go('<')}
                className="pointer-events-auto w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md hover:bg-gray-50 transition-all text-gray-600 hover:text-blue-600 -ml-5"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => splideRef.current?.splide?.go('>')}
                className="pointer-events-auto w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md hover:bg-gray-50 transition-all text-gray-600 hover:text-blue-600 -mr-5"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>      
         {(settings?.google_review_url || settings?.tripadvisor_review_url) && (
          <div className="flex flex-wrap justify-center items-center gap-4 mt-6 mb-12">
            {settings?.google_review_url && (
              <motion.a
                href={settings?.google_review_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'tween', duration: 0.15 }}
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-white border border-gray-100 hover:border-blue-500 hover:shadow-md transition-[border-color,box-shadow] duration-200 rounded-xl font-bold text-gray-800 text-sm shadow-sm"
              >
                {/* Google "G" icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                See Reviews on Google
              </motion.a>
            )}
            {settings.tripadvisor_review_url && (
              <motion.a
                href={settings.tripadvisor_review_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'tween', duration: 0.15 }}
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-white border border-gray-100 hover:border-[#34E0A1] hover:shadow-md transition-[border-color,box-shadow] duration-200 rounded-xl font-bold text-gray-800 text-sm shadow-sm"
              >
                <img src={`${BASE_URL}/assets/images/tripadvisor-logo-svgrepo-com.svg`} alt="Tripadvisor" className="w-5 h-5" />
                See Reviews on Tripadvisor
              </motion.a>
            )}
          </div>
        )}
        {/* View All Reviews Link */}
        {data.length > 10 && (
          <div className="flex justify-center mt-6 mb-4">
            <a
              href="/reviews"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-200 shadow-md hover:shadow-lg text-sm"
            >
              View All Reviews
              <ChevronRight size={16} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}