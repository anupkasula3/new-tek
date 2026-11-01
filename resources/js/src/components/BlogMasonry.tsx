import { Calendar, Tag, User } from "lucide-react";
import React, { useEffect, useState } from "react";

import BASE_URL from "../global";
import { SectionHeading } from "./ui/SectionHeading";
import { fetchData } from "../axiosHook";
import { motion } from "framer-motion";
import Loading from "./Loading";
import { Button } from "./ui/Button";

export function BlogMasonry({ limit = 6 }: { limit?: number }) {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchBlogs = async () => {
        try {
            const res: any = await fetchData("/blogs");
            
            // Laravel pagination returns an object with a 'data' property containing the records
            if (res && res.data) {
                setBlogs(res.data);
            } else if (res && res.posts) {
                setBlogs(res.posts);
            } else {
                setBlogs([]);
            }
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (!blogs || blogs.length === 0 || error) {
        return null;
    }
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title="From Our Blog"
                    subtitle="Explore stories, tips, and expert advice for unforgettable adventures"
                />

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {blogs.slice(0, limit).map((blog, index) => {
                        const heights = ["h-96", "h-64", "h-80", "h-72"];
                        const cardHeight = heights[index % heights.length];

                        return (
                            <motion.a
                                key={blog.id}
                                href={"/blog/" + blog.slug}
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                }}
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
                                                    {blog.categories?.[0]?.name}
                                                </span>
                                            )}
                                            
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />{" "}
                                                {new Date(
                                                    blog?.published_at,
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-[#06B6D4] transition-colors line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        {(blog.author?.name || blog.author) && (
                                            <div className="flex items-center gap-2 mt-2 text-xs text-white/70">
                                                {blog.author?.avatar_url ? (
                                                    <img
                                                        src={`${BASE_URL}/${blog.author.avatar_url}`}
                                                        alt={blog.author.name}
                                                        className="w-4 h-4 rounded-full object-cover border border-white/30"
                                                    />
                                                ) : (
                                                    <User size={12} />
                                                )}
                                                <span>{blog.author?.name || (typeof blog.author === 'string' ? blog.author : '')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.a>
                        );
                    })}
                </div>
                <div className="mt-12 text-center">
                    <a href="/blog">
                        <Button variant="primary" size="lg">
                            See more Blogs
                        </Button>
                    </a>
                </div>
            </div>
        </section>
    );
}
