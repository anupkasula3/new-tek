import React, { memo, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { TripsGrid } from "../components/TripsGrid";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import {
    MapPin,
    Calendar,
    ThermometerSun,
} from "lucide-react";
import { fetchData } from "../axiosHook";
import { useParams, Link } from "react-router-dom";
import BASE_URL from "../global";
import { RelatedTripsGrid } from "../components/RelatedTripsGrid";
import Loading from "../components/Loading";
import { Seo } from "../components/Seo";
import PlaceExploresSection from "../components/PlaceExploresSection";
import NotFound from "../components/NotFound";

function ExperienceSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                {/* Hero Skeleton */}
                <div className="dc-skeleton h-[60vh] min-h-[500px]" />
                
                {/* Content Skeleton */}
                <section className="py-20 max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2">
                            <div className="dc-skeleton dc-skeleton-title w-3/4 mb-8" />
                            <div className="space-y-4">
                                <div className="dc-skeleton dc-skeleton-row" />
                                <div className="dc-skeleton dc-skeleton-row" />
                                <div className="dc-skeleton dc-skeleton-row w-5/6" />
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="dc-skeleton h-64 rounded-2xl" />
                        </div>
                    </div>
                </section>

                {/* Related Trips Skeleton */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="dc-skeleton dc-skeleton-title w-64 mb-12 mx-auto" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="dc-skeleton h-[450px] rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export function ExperiencePage() {
    const { slug } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchHomepageData = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetchData("/luxury/" + slug);
            if (res) {
                setData(res);
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
        fetchHomepageData();
    }, [slug]);

    if (loading) return <ExperienceSkeleton />;

    if (error || !data) {
        return <NotFound message="Experience Not Found" />;
    }

    return (
        <div className="min-h-screen bg-white font-sans text-stone-800">
            <Seo
                seoMeta={data?.seo_meta}
                fallbackTitle={data?.title}
                fallbackDescription={data?.description ? String(data.description).replace(/<[^>]*>/g, '').slice(0, 160) : undefined}
                fallbackImage={data?.image}
                canonicalPath={`/luxury/${slug}`}
                type="ExperienceEvent"
            />
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{
                        backgroundImage: data?.image ? `url("${BASE_URL}/${data.image}")` : "none",
                        backgroundColor: data?.image ? "transparent" : "#1e40af",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-blue-900/40 to-blue-900/70" />
                </div>
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                    {data?.icon && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <img
                                    src={`${BASE_URL}/${data.icon}`}
                                    alt={data?.title || "Icon"}
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                        </motion.div>
                    )}
                    
                    {data?.title && (
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-6xl font-bold mb-6 tracking-tight"
                        >
                            {data.title}
                        </motion.h1>
                    )}
                    
                    {data?.description && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed text-center mx-auto"
                            dangerouslySetInnerHTML={{ __html: data.description }}
                        />
                    )}
                </div>
            </div>
            {/* Overview Section */}
          {data?.details && data.details.length > 0 &&  
          (<div className="py-20 ">
            {data.details.map((detail: any, index: number) => (
                    <section
                        className="px-4 md:px-8 max-w-7xl mx-auto"
                        key={index}
                    >
                        <div className="grid md:grid-cols-12 gap-12 items-start">
                           
                            <motion.div
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className={`${index % 2 !== 0 ? 'order-1 md:order-2' : ''} ${detail.image ? 'md:col-span-7' : 'md:col-span-12'}`}
                            >
                                <SectionHeading
                                    title={detail?.title}
                                    subtitle={detail?.overview}
                                    centered={false}
                                />
                                <div 
                                    className="mt-6 space-y-4 text-lg text-stone-600 leading-relaxed prose prose-lg max-w-none break-words"
                                    dangerouslySetInnerHTML={{ __html: detail?.content || "" }}
                                />
                            </motion.div>
                            {detail.image && (
                            <motion.div
                                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className={`sticky top-20 ${index % 2 !== 0 ? 'order-2 md:order-1' : ''} md:col-span-5`}
                            >
                                {detail.image && (
                                    <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative">
                                        <img
                                            src={`${BASE_URL}/${detail.image}`}
                                            alt={detail?.title || "Detail Image"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                
                                {detail.notes && (
                                    <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-[#0066FF] to-[#06B6D4] p-6 rounded-xl shadow-lg max-w-xs text-white">
                                        <div
                                            className="prose prose-invert max-w-none text-sm leading-snug"
                                            dangerouslySetInnerHTML={{ __html: detail.notes }}
                                        />
                                    </div>
                                )}
                            </motion.div>
                            )}
                        </div>
                    </section>
            ))}
</div>
)}
            {/* Popular Packages / Trips Grid */}
            {data?.packages && data.packages.length > 0 && (
                <div className="bg-stone-50 py-10">
                    <RelatedTripsGrid relatedTreks={data.packages} />
                </div>
            )}

            {/* Places Covered */}
            {(data?.place_explores || data?.placeExplores || data?.places_explore) && (
                <PlaceExploresSection places={data.place_explores || data.placeExplores || data.places_explore} />
            )}

            {/* Best Time to Visit */}
            {data?.best_time && data.best_time.length > 0 && (
                <section className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <SectionHeading
                            title="Best Time to Visit"
                            subtitle="Plan your holiday for the perfect weather"
                            centered={true}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                            {data.best_time.map((season: any, index: number) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative bg-white rounded-2xl p-8 hover:-translate-y-1 transition-transform ${
                                        season.recommended 
                                            ? "border-2 border-[#0066FF] shadow-xl shadow-blue-500/10" 
                                            : "border border-stone-200 shadow-md"
                                    }`}
                                >
                                    {season.recommended && (
                                        <div className="absolute -top-3 right-6 bg-gradient-to-r from-[#0066FF] to-[#06B6D4] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                            Recommended
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center gap-4 mb-6">
                                        <div
                                            className={`p-3 rounded-xl flex-shrink-0 ${
                                                season.recommended 
                                                    ? "bg-blue-50 text-[#0066FF]" 
                                                    : "bg-stone-100 text-stone-600"
                                            }`}
                                        >
                                            <Calendar size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-stone-900 leading-tight">
                                                {season.best_time}
                                            </h3>
                                            {season.temperature && (
                                                <div className="flex items-center gap-2 text-stone-500 text-sm mt-1">
                                                    <ThermometerSun size={14} className="text-[#0066FF]" />
                                                    <span className="font-medium">{season.temperature}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {season.best_time_description && (
                                        <div 
                                            className="text-stone-600 leading-relaxed text-sm prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: season.best_time_description }}
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Advantages Section */}
            {data?.advantages && data.advantages.length > 0 && data.advantages.map((advantage: any, index: number) => {
                // if (!advantage?.advantages_title) return null;
                return (
                <section
                    key={`adv-${index}`}
                    className="relative py-28 px-4 overflow-hidden"
                >
                    {advantage.background_image ? (
                        <div 
                            className="absolute inset-0 bg-cover bg-fixed bg-center z-0"
                            style={{ backgroundImage: `url("${BASE_URL}/${advantage.background_image}")` }}
                        ></div>
                    ) : (
                        <div className="absolute inset-0 bg-[#0f172a] z-0"></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-slate-900/85 to-[#0066FF]/75 mix-blend-multiply z-0"></div>
                    
                    <div className="max-w-6xl mx-auto relative z-10">
                        {/* Header */}
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight"
                            >
                                {advantage.advantages_title}
                            </motion.h2>
                            {advantage.advantages_content && (
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 }}
                                    className="text-lg md:text-xl text-blue-100/95 leading-relaxed font-light"
                                >
                                    {advantage.advantages_content}
                                </motion.p>
                            )}
                        </div>

                        {/* List Items */}
                        {advantage.advantages_list && advantage.advantages_list.length > 0 && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {advantage.advantages_list.map((item: any, iIndex: number) => (
                                    <motion.div
                                        key={`item-${iIndex}`}
                                        initial={{ opacity: 0, y: 25 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: iIndex * 0.08 }}
                                        className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/15 hover:border-white/25 hover:bg-white/15 transition-all duration-300 shadow-xl group"
                                    >
                                        {item.icon && (
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                                                <img 
                                                    src={`${BASE_URL}/${item.icon}`} 
                                                    alt={item.title} 
                                                    className="w-8 h-8 object-contain" 
                                                />
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                                            {item.title}
                                        </h3>
                                        <div 
                                            className="text-blue-100/90 leading-relaxed font-light prose prose-invert max-w-none text-white"
                                            dangerouslySetInnerHTML={{ __html: item.content }}
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-center mt-20"
                            >
                                {advantage.advantages_cta && (
                                    <p className="text-xl font-medium text-white mb-8">
                                        {advantage.advantages_cta}
                                    </p>
                                )}
                                
                                <div className="flex flex-wrap justify-center gap-4">
                                    {advantage.advantages_cta_links && advantage.advantages_cta_links.map((cta_link: any, lIndex: number) => (
                                        <a 
                                            key={`l-${lIndex}`} 
                                            href={cta_link.url}
                                            target={cta_link.target || "_self"}
                                        >
                                            <Button 
                                                className={`px-8 py-6 rounded-full text-base font-semibold transition-all duration-300 shadow-lg ${
                                                    cta_link.style === "secondary" 
                                                        ? "border-2 border-white text-white hover:bg-white/10 hover:text-white" 
                                                        : "bg-white text-[#0066FF] hover:bg-blue-50 hover:text-[#0066FF] border-white"
                                                }`}
                                            >
                                                {cta_link.title}
                                            </Button>
                                        </a>
                                    ))}
                                </div>
                            </motion.div> */}
                            
                    </div>
                </section>
                );
            })} 

            {/* General CTA Section */}
            {data?.cta && data.cta.length > 0 && data.cta.map((cta: any, index: number) => {
                if (!cta?.cta_title) return null;
                return (
                <section className=" py-24 px-4" key={`cta-${index}`}>
                    <div className="max-w-4xl mx-auto text-center">
                      
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-3xl p-12 text-center text-white relative overflow-hidden"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold  mb-6 tracking-tight text-white">
                                {cta.cta_title}
                            </h2>
                            <div 
                                className="text-xl  mb-10 prose prose-lg mx-auto"
                                dangerouslySetInnerHTML={{ __html: cta.cta_details }}
                            />
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {cta.cta_links?.map((cta_link: any, idx: number) => (
                                    <a key={idx} href={cta_link.link || "#"} className="inline-block">
                                        <Button 
                                            variant={cta_link.type === 'primary' ? 'primary' : 'outline'} 
                                            size="lg" 
                                            className={`w-full sm:w-auto min-w-[200px] ${
                                                cta_link.type === "primary"
                                                    ? "bg-gradient-to-r from-[#0066FF] to-[#06B6D4] text-white hover:shadow-lg shadow-blue-500/30"
                                                    : "border-2 border-stone-200 text-stone-700 hover:bg-stone-50"
                                            }`}
                                        >
                                            {cta_link.title}
                                        </Button>
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>
            );
            })}

            <Footer />
        </div>
    );
}
