import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Calendar, Tag, ChevronRight, Loader2, User } from "lucide-react";
import { motion } from "framer-motion";

import { fetchData } from "../axiosHook";
import BASE_URL from "../global";

import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Seo } from "../components/Seo";

function BlogSkeleton() {
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

export function BlogListPage() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(false);
    
    const observer = useRef<IntersectionObserver | null>(null);

    const lastBlogElementRef = useCallback((node: HTMLAnchorElement | null) => {
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
        const loadBlogs = async () => {
            setLoading(true);
            try {
                const res: any = await fetchData(`/blogs?page=${page}`);
                
                if (res && res.data) {
                    setBlogs((prev) => {
                        // Prevent duplicates if React StrictMode runs twice
                        const newBlogs = res.data.filter(
                            (newBlog: any) => !prev.some((existing) => existing.id === newBlog.id)
                        );
                        return [...prev, ...newBlogs];
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

        loadBlogs();
    }, [page]);

    if (loading && page === 1) return <BlogSkeleton />;

    return (
        <div className="bg-gray-50 min-h-screen">
            <Seo
                fallbackTitle="Travel Blog — Trekking Tips & Stories"
                fallbackDescription="Read our latest travel stories, trekking guides, altitude tips, and adventure insights from the Himalayas."
                fallbackKeywords="trekking blog, Nepal travel, Himalayan adventure, trekking tips, altitude sickness, travel guides Nepal"
                canonicalPath="/blog"
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
                        Our Travel Blog
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-cyan-100 max-w-2xl mx-auto"
                    >
                        Tips, stories, and guides for your next Himalayan adventure.
                    </motion.p>
                </div>
            </div>

            {/* Blog Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-20">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {blogs.map((blog, index) => {
                        const isLast = index === blogs.length - 1;
                        // Determine height dynamically based on index for the masonry effect
                        const heights = ["h-96", "h-64", "h-80", "h-72"];
                        const cardHeight = heights[index % heights.length];

                        return (
                            <motion.a
                                ref={isLast ? lastBlogElementRef : null}
                                key={blog.id}
                                href={`/blog/${blog.slug}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 block mb-6"
                            >
                                <div className={`w-full ${cardHeight} relative`}>
                                    <img
                                        src={`${BASE_URL}/${blog.featured_image}`}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                                    <div className="absolute bottom-0 left-0 p-6 w-full">
                                        <div className="flex items-center gap-4 text-xs text-gray-300 mb-3">
                                            {blog.categories?.[0]?.name && (
                                                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md">
                                                    <Tag size={12} />{" "}
                                                    {blog.categories[0].name}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />{" "}
                                                {new Date(blog?.published_at).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-[#06B6D4] transition-colors line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        {/* Author */}
                                        {(blog.author?.name || blog.author) && (
                                            <a
                                                href={blog.author?.slug ? `/author/${blog.author.slug}` : '#'}
                                                className="flex items-center gap-2 mt-2 text-xs text-white/70 hover:text-white transition-colors w-fit"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {blog.author?.avatar_url ? (
                                                    <img
                                                        src={`${BASE_URL}/${blog.author.avatar_url}`}
                                                        alt={blog.author.name}
                                                        className="w-5 h-5 rounded-full object-cover border border-white/30"
                                                    />
                                                ) : (
                                                    <User size={12} />
                                                )}
                                                {blog.author?.name || (typeof blog.author === 'string' ? blog.author : '')}
                                            </a>
                                        )}
                                    </div>
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
                {!hasMore && blogs.length > 0 && (
                    <div className="text-center py-12 text-gray-500">
                        You've reached the end! No more blogs to load.
                    </div>
                )}
                
                {/* Empty State */}
                {!loading && blogs.length === 0 && !error && (
                    <div className="text-center py-20 text-gray-500">
                        No blogs found.
                    </div>
                )}
                
                {error && (
                    <div className="text-center py-20 text-red-500">
                        An error occurred while fetching the blogs.
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
}
