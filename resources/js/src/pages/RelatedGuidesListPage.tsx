import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

import { fetchData } from "../axiosHook";
import BASE_URL from "../global";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Seo } from "../components/Seo";

function RelatedGuideSkeleton() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="dc-skeleton h-[50vh] min-h-[400px]" />
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="dc-skeleton-masonry">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md mb-6">
                            <div className="dc-skeleton h-64 w-full" />
                            <div className="p-6">
                                <div className="dc-skeleton dc-skeleton-title w-3/4 mb-4" />
                                <div className="dc-skeleton dc-skeleton-row" />
                                <div className="dc-skeleton dc-skeleton-row w-5/6" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function RelatedGuidesListPage() {
    const [guides, setGuides] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(false);
    
    const observer = useRef<IntersectionObserver | null>(null);

    const lastGuideElementRef = useCallback((node: HTMLAnchorElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        const loadGuides = async () => {
            setLoading(true);
            try {
                const res: any = await fetchData(`/related-guides?page=${page}`);
                
                if (res && res.data) {
                    setGuides((prev) => {
                        const newGuides = res.data.filter(
                            (newGuide: any) => !prev.some((existing) => existing.id === newGuide.id)
                        );
                        return [...prev, ...newGuides];
                    });
                    
                    if (page >= res.last_page) {
                        setHasMore(false);
                    }
                } else {
                    setHasMore(false);
                }
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        loadGuides();
    }, [page]);

    if (loading && page === 1) return <RelatedGuideSkeleton />;

    return (
        <div className="bg-gray-50 min-h-screen">
            <Seo
                fallbackTitle="Related Guides — Trekking Tips & Travel Advice"
                fallbackDescription="Read our latest travel guides, altitude tips, and adventure insights for your next Himalayan Bespoke expedition."
                fallbackKeywords="trekking guides, Nepal travel, Himalayan adventure, trekking tips, travel guides Nepal"
                canonicalPath="/related-guides"
                type="Blog"
            />
            <Navbar />
            
            {/* Page Header */}
            <div className="bg-gradient-to-r from-cyan-900 to-blue-900 text-white pb-24 pt-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 text-center">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                    >
                        Related Guides
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-cyan-100 max-w-2xl mx-auto"
                    >
                        Guides, tips, and articles to prepare for your next Himalayan adventure.
                    </motion.p>
                </div>
            </div>

            {/* Guides Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {guides.map((guide, index) => {
                        const isLast = index === guides.length - 1;
                        return (
                            <motion.a
                                ref={isLast ? lastGuideElementRef : null}
                                key={guide.id}
                                href={`/related-guides/${guide.slug}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col bg-white h-full"
                            >
                                <div className="w-full relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={`${BASE_URL}/${guide.featured_image}`}
                                        alt={guide.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                                    <div className="absolute bottom-0 left-0 p-6 w-full">
                                        <div className="flex items-center gap-4 text-xs text-gray-300 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />{" "}
                                                {new Date(guide?.published_at).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                                            {guide.title}
                                        </h3>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <p className="text-gray-600 line-clamp-3 mb-4">
                                        {guide.excerpt || guide.overview?.replace(/<[^>]*>?/gm, "").substring(0, 150) + "..."}
                                    </p>
                                    <span className="inline-flex items-center text-cyan-600 font-semibold group-hover:text-cyan-700 mt-auto">
                                        Read More <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </div>
                            </motion.a>
                        );
                    })}
                </div>
                
                {/* Loader State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
                    </div>
                )}
                
                {/* End of results */}
                {!hasMore && guides.length > 0 && (
                    <div className="text-center py-12 text-gray-500">
                        You've reached the end! No more guides to load.
                    </div>
                )}
                
                {/* Empty State */}
                {!loading && guides.length === 0 && !error && (
                    <div className="text-center py-20 text-gray-500">
                        No guides found.
                    </div>
                )}
                
                {/* Error State */}
                {error && (
                    <div className="text-center py-20 text-red-500">
                        An error occurred while fetching the guides.
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
}
