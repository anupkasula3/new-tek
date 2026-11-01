import { ArrowRight, Calendar, Clock, Globe, MapPin, Tag, TrendingUp, User, Twitter, Facebook, Linkedin, Instagram } from "lucide-react";
import React, { memo, useEffect, useState } from "react";

import BASE_URL from "../global";
import { Button } from "../components/ui/Button";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { fetchData } from "../axiosHook";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { NotFoundPage } from "./NotFoundPage";
import { PopularTripsSection } from "../components/PopularTripsSection";
import { Seo } from "../components/Seo";

const relatedTrips = [
    {
        title: "Everest Base Camp Trek",
        duration: "14 Days",
        price: "$1,450",
        image: "https://images.unsplash.com/photo-1533130061792-649d45df8c2d?q=80&w=1978&auto=format&fit=crop",
        link: "#everest-base-camp",
    },
    {
        title: "Annapurna Circuit",
        duration: "16 Days",
        price: "$1,250",
        image: "https://images.unsplash.com/photo-1548588627-f978862b85e1?q=80&w=2072&auto=format&fit=crop",
        link: "#",
    },
    {
        title: "Langtang Valley",
        duration: "9 Days",
        price: "$950",
        image: "https://images.unsplash.com/photo-1623492701902-47d3be136e96?q=80&w=2070&auto=format&fit=crop",
        link: "#",
    },
];
function BlogPostSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                {/* Hero Skeleton */}
                <div className="dc-skeleton h-[50vh] min-h-[400px]" />
                
                {/* Content Skeleton */}
                <article className="max-w-4xl px-4 py-16 mx-auto">
                    <div className="space-y-6">
                        <div className="dc-skeleton dc-skeleton-title w-3/4 h-12" />
                        <div className="flex gap-4">
                            <div className="dc-skeleton dc-skeleton-tag" />
                            <div className="dc-skeleton dc-skeleton-tag" />
                        </div>
                        <div className="space-y-4 pt-8">
                            <div className="dc-skeleton dc-skeleton-row" />
                            <div className="dc-skeleton dc-skeleton-row" />
                            <div className="dc-skeleton dc-skeleton-row" />
                            <div className="dc-skeleton dc-skeleton-row w-5/6" />
                        </div>
                        <div className="dc-skeleton h-96 rounded-2xl my-12" />
                        <div className="space-y-4">
                            <div className="dc-skeleton dc-skeleton-row" />
                            <div className="dc-skeleton dc-skeleton-row" />
                            <div className="dc-skeleton dc-skeleton-row w-2/3" />
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}

export function BlogSlugPage() {
    const [blog, setBlog] = useState<any>();
    const [treks, setTreks] = useState<any[]>([]);
    const { slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchDestination = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetchData("/blog/" + slug);
            setBlog(res || null);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

    // Fetch Treks independently to ensure they are always available as fallback
    useEffect(() => {
        const fetchTreks = async () => {
            try {
                const res = await fetchData("/treks") as any;
                const allTreks = Array.isArray(res) ? res : (res.data || []);
                setTreks(allTreks);
            } catch (err) {
                console.error("Treks fetch failed:", err);
            }
        };
        fetchTreks();
    }, []);

    // Fetch Selected Products specifically when blog content changes
    useEffect(() => {
        if (!blog) return;
        
        const fetchLinkedProducts = async () => {
            try {
                if (blog?.content?.related_product_ids && Array.isArray(blog.content.related_product_ids) && blog.content.related_product_ids.length > 0) {
                    const res = await fetchData("/all-packages") as any;
                    const allPackages = Array.isArray(res) ? res : (res.data || []);
                    const productIds = blog.content.related_product_ids.map((id: any) => String(id));
                    const linked = allPackages.filter((p: any) => productIds.includes(String(p.id)));
                    setSelectedProducts(linked);
                } else {
                    setSelectedProducts([]);
                }
            } catch (err) {
                console.error("Linked products fetch failed:", err);
                setSelectedProducts([]);
            }
        };

        fetchLinkedProducts();
    }, [blog]);

    useEffect(() => {
        fetchDestination();
    }, [slug]);

    // Function to transform raw HTML content (e.g., wrapping images in figures with captions)
    const transformBlogContent = (html: string) => {
        if (!html) return "";
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        
        const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?/;
        const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;

        // 1. Scan for plain URLs in text (even if wrapped in <p>, <strong>, etc.)
        const allElements = doc.querySelectorAll('p, div, span, strong, em');
        allElements.forEach(el => {
            // Only process if it doesn't contain other complex elements and matches a video URL
            if (el.children.length === 0) {
                const text = el.textContent?.trim() || "";
                const ytMatch = text.match(youtubeRegex);
                const vimeoMatch = text.match(vimeoRegex);

                if (ytMatch || vimeoMatch) {
                    const videoSrc = ytMatch 
                        ? `https://www.youtube.com/embed/${ytMatch[1]}` 
                        : `https://player.vimeo.com/video/${vimeoMatch![1]}`;

                    const container = doc.createElement("div");
                    container.className = "aspect-video w-full mb-12 rounded-2xl overflow-hidden shadow-xl bg-black";
                    container.innerHTML = `<iframe src="${videoSrc}" class="w-full h-full border-0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`;
                    
                    el.parentNode?.replaceChild(container, el);
                }
            }
        });

        // 2. Transform Images
        const images = doc.querySelectorAll("img");
        images.forEach((img) => {
            const existingFigure = img.closest("figure");
            const captionText = img.getAttribute("alt");
            
            if (existingFigure) {
                existingFigure.className = "mb-12 rounded-2xl overflow-hidden shadow-xl";
                img.className = "w-full h-auto";
                
                // If the figure doesn't have a caption but the image has alt text, create one
                let existingCaption = existingFigure.querySelector("figcaption");
                
                if (!existingCaption && captionText && captionText.trim() !== "") {
                    const figcaption = doc.createElement("figcaption");
                    figcaption.className = "bg-gray-50 px-6 py-4 text-sm text-gray-600 italic";
                    figcaption.textContent = captionText;
                    existingFigure.appendChild(figcaption);
                } else if (existingCaption) {
                    existingCaption.className = "bg-gray-50 px-6 py-4 text-sm text-gray-600 italic";
                }
            } else {
                const figure = doc.createElement("figure");
                figure.className = "mb-12 rounded-2xl overflow-hidden shadow-xl";
                
                const newImg = img.cloneNode(true) as HTMLImageElement;
                newImg.className = "w-full h-auto";
                
                figure.appendChild(newImg);

                if (captionText && captionText.trim() !== "") {
                    const figcaption = doc.createElement("figcaption");
                    figcaption.className = "bg-gray-50 px-6 py-4 text-sm text-gray-600 italic";
                    figcaption.textContent = captionText;
                    figure.appendChild(figcaption);
                }
                
                img.parentNode?.replaceChild(figure, img);
            }
        });

        // 3. Transform Iframes (existing ones)
        const iframes = doc.querySelectorAll("iframe");
        iframes.forEach((iframe) => {
            if (iframe.closest(".aspect-video")) return;

            const container = doc.createElement("div");
            container.className = "aspect-video w-full mb-12 rounded-2xl overflow-hidden shadow-xl bg-black";
            
            const newIframe = iframe.cloneNode(true) as HTMLIFrameElement;
            newIframe.className = "w-full h-full border-0";
            newIframe.removeAttribute("width");
            newIframe.removeAttribute("height");
            
            if (!newIframe.getAttribute("allow")) {
                newIframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture");
            }
            newIframe.setAttribute("allowfullscreen", "true");
            
            container.appendChild(newIframe);
            iframe.parentNode?.replaceChild(container, iframe);
        });

        // 4. Transform Tables
        const tables = doc.querySelectorAll("table");
        tables.forEach((table) => {
            if (table.closest(".overflow-x-auto")) return;

            // Create responsive wrapper
            const wrapper = doc.createElement("div");
            wrapper.className = "overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-12";
            
            table.className = "w-full border-collapse bg-white";
            
            // Style Header
            const thead = table.querySelector("thead");
            if (thead) {
                thead.className = "bg-gradient-to-r from-[#0066FF] to-[#06B6D4] text-white";
                const headerCells = thead.querySelectorAll("th, td");
                headerCells.forEach(cell => {
                    cell.className = "px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider whitespace-nowrap";
                });
            }

            // Style Body
            const tbody = table.querySelector("tbody");
            if (tbody) {
                tbody.className = "divide-y divide-gray-200";
                const rows = tbody.querySelectorAll("tr");
                rows.forEach((tr, index) => {
                    tr.className = index % 2 === 0 ? "bg-white hover:bg-gray-50 transition-colors" : "bg-gray-50 hover:bg-gray-100 transition-colors";
                    const cells = tr.querySelectorAll("td");
                    cells.forEach((cell, cellIndex) => {
                        // First cell often has bold text
                        const baseClass = "px-6 py-4 text-sm leading-relaxed";
                        cell.className = cellIndex === 0 
                            ? `${baseClass} font-medium text-gray-900` 
                            : `${baseClass} text-gray-700`;

                        // Handle potential badges inside cells (e.g., Essential, Recommended)
                        const badges = cell.querySelectorAll("span");
                        badges.forEach(badge => {
                            const text = badge.textContent?.toLowerCase() || "";
                            let badgeClass = "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide";
                            
                            if (text.includes("essential")) {
                                badgeClass += " bg-red-100 text-red-800";
                            } else if (text.includes("recommended")) {
                                badgeClass += " bg-orange-100 text-orange-800";
                            } else {
                                badgeClass += " bg-blue-100 text-blue-800";
                            }
                            badge.className = badgeClass;
                        });
                    });
                });
            }

            table.parentNode?.replaceChild(wrapper, table);
            wrapper.appendChild(table);
        });

        return doc.body.innerHTML;
    };

    if (loading) {
        return <BlogPostSkeleton />;
    }

    if (!blog || error) {
        return <NotFoundPage />;
    }
    return (
        <div className="min-h-screen font-sans text-gray-900 bg-white">
            <Seo
                seoMeta={blog?.seo_meta}
                fallbackTitle={blog?.title}
                fallbackDescription={blog?.excerpt}
                fallbackImage={blog?.featured_image}
                canonicalPath={`/blog/${blog?.slug}`}
                type="Article"
            />
            <Navbar />

            <div className="relative min-h-[400px] flex items-end overflow-hidden bg-gray-900 ">
                {/* <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                    {blog?.featured_image && (
                        <img
                            src={`${BASE_URL}/${blog?.featured_image}`}
                            alt={blog?.title || "Featured Image"}
                            className="object-cover w-full h-full"
                        />
                    )}
                </div> */}

                <div className="relative z-20 w-full px-4 pb-12 pt-52">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 30,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                                transition={{
                                duration: 0.8,
                            }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                {blog?.categories && blog?.categories.length > 0 && (
                                    <span className="bg-[#0066FF] text-white px-4 py-1 rounded-full text-sm font-semibold">
                                        {blog?.categories?.[0]?.name}
                                    </span>
                                )}
                                {blog?.reading_time && (
                                    <span className="flex items-center gap-2 text-sm text-white/80">
                                        <Clock size={16} /> {blog?.reading_time} min
                                        read
                                    </span>
                                )}
                            </div>
                            <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-5xl">
                                {blog?.title}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-sm text-white/90">
                                <span className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    {new Date(
                                        blog?.published_at,
                                    ).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>

                                {(blog?.author || blog?.author_id) && (
                                    <span className="flex items-center gap-2">
                                        <User size={16} />
                                        {blog?.author?.slug ? (
                                            <a
                                                href={`/author/${blog.author.slug}`}
                                                className="hover:text-cyan-300 transition-colors"
                                            >
                                                By {blog?.author?.name}
                                            </a>
                                        ) : (
                                            <span>By {typeof blog?.author === 'string' ? blog.author : blog?.author?.name}</span>
                                        )}
                                    </span>
                                )}
                                {blog?.tags && blog?.tags.length > 0 && (
                                    <span className="flex items-center gap-2">
                                        <Tag size={16} />
                                        {blog?.tags?.[0]?.name}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <article className="max-w-4xl px-4 py-16 mx-auto sm:px-6">
                {/* Overview Part 1 */}
                {blog?.overview && (
                    <div 
                        dangerouslySetInnerHTML={{ __html: transformBlogContent(blog.overview) }} 
                        className="prose prose-lg max-w-none prose-img:rounded-2xl prose-img:shadow-xl prose-headings:text-gray-900 prose-a:text-[#0066FF] hover:prose-a:text-[#06B6D4] pb-6" 
                    />
                )}

                {/* Packages / Related Treks Section (In Middle) */}
                {selectedProducts && selectedProducts.length > 0 ? (
                    <section className="p-8 my-10 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="mb-8 text-2xl md:text-3xl font-bold text-gray-900">
                           Explore Our Packages
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {selectedProducts.map((pkg: any, index: number) => (
                                <motion.a
                                    key={index}
                                    href={`/package/${pkg.slug}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="overflow-hidden transition-all bg-white shadow-sm group rounded-2xl hover:shadow-xl border border-gray-100 flex flex-col"
                                >
                                    <div className="relative h-44 overflow-hidden">
                                        <img
                                            src={pkg.banner_image ? `${BASE_URL}/${pkg.banner_image}` : `${BASE_URL}/uploads/default-blog.png`}
                                            alt={pkg.title}
                                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-5 flex flex-col flex-1 justify-between">
                                        <div>
                                            <h3 className="mb-3 text-base font-bold text-gray-900 leading-tight group-hover:text-[#0066FF] transition-colors">
                                                {pkg.title}
                                            </h3>
                                            <div className="flex items-center justify-between mb-4 text-sm">
                                                <span className="text-gray-500 font-medium text-xs">
                                                    {pkg.duration_days ? `${pkg.duration_days}` : 'Special Tour'}
                                                </span>
                                                <span className="font-extrabold text-[#0066FF] text-base">
                                                    {pkg.price ? `$${pkg.price}` : 'View Price'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#0066FF] font-bold text-xs group-hover:gap-3 transition-all uppercase tracking-wider mt-2">
                                            View Package <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </section>
                ) : (
                    <div className="my-10">
                        <PopularTripsSection 
                            limit={3} 
                            title="Explore Our Packages"
                            subtitle="Discover our most popular itineraries and start planning your next Himalayan adventure."
                        />
                    </div>
                )}

                {/* Overview Part 2 */}
                {(blog?.content?.overview_2 || blog?.overview_2) && (
                    <div 
                        dangerouslySetInnerHTML={{ __html: transformBlogContent(blog?.content?.overview_2 || blog?.overview_2) }} 
                        className="prose prose-lg max-w-none prose-img:rounded-2xl prose-img:shadow-xl prose-headings:text-gray-900 prose-a:text-[#0066FF] hover:prose-a:text-[#06B6D4] py-6" 
                    />
                )}

                {/* Pro Tips Section */}
                {blog?.content?.pro_tips && Array.isArray(blog.content.pro_tips) && blog.content.pro_tips.length > 0 && (
                    <section className="mb-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <span className="w-10 h-10 bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                💡
                            </span>
                            Pro Tips
                        </h2>
                        <ul className="space-y-5">
                            {blog.content.pro_tips.map((item: any, idx: number) => (
                                <motion.li 
                                    key={idx}
                                    className="flex items-start gap-4 text-gray-700"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                >
                                    <span className="w-7 h-7 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 shadow-sm">
                                        {idx + 1}
                                    </span>
                                    <p className="leading-relaxed">
                                        {item.tip}
                                    </p>
                                </motion.li>
                            ))}
                        </ul>
                    </section>
                )}

                {blog?.content?.video_embed && (
                    <section className="mb-12">
                        {blog?.content?.video_title && (
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                {blog.content.video_title}
                            </h2>
                        )}
                        <div 
                            dangerouslySetInnerHTML={{ __html: transformBlogContent(blog.content.video_embed) }} 
                            className="w-full"
                        />
                        {blog?.content?.video_description && (
                            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-x border-b border-gray-100">
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {blog.content.video_description}
                                </p>
                            </div>
                        )}
                    </section>
                )}


            </article>

            {/* Author Bio Card */}
            {(blog?.author || blog?.author_id) && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col sm:flex-row gap-6 items-start bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 rounded-2xl p-6 sm:p-8"
                    >
                        {/* Avatar */}
                        {blog?.author?.avatar_url ? (
                            <img
                                src={`${BASE_URL}/${blog.author.avatar_url}`}
                                alt={blog.author.name}
                                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md flex-shrink-0"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                                <User size={36} className="text-white" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[#0066FF] uppercase tracking-wider mb-1">Written by</p>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                {blog?.author?.name || (typeof blog?.author === 'string' ? blog.author : '')}
                            </h3>
                            {blog?.author?.designation && (
                                <p className="text-sm text-cyan-600 font-medium mb-2">{blog.author.designation}</p>
                            )}
                            {blog?.author?.bio && (
                                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{blog.author.bio}</p>
                            )}
                            <div className="flex items-center gap-3 flex-wrap">
                                {blog?.author?.slug && (
                                    <a
                                        href={`/author/${blog.author.slug}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066FF] text-white rounded-lg text-sm font-semibold hover:bg-[#0055dd] transition-colors"
                                    >
                                        View All Articles <ArrowRight size={14} />
                                    </a>
                                )}
                                {blog?.author?.social_links?.twitter && (
                                    <a href={blog.author.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600">
                                        <Twitter size={18} />
                                    </a>
                                )}
                                {blog?.author?.social_links?.linkedin && (
                                    <a href={blog.author.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                                        <Linkedin size={18} />
                                    </a>
                                )}
                                {blog?.author?.social_links?.instagram && (
                                    <a href={blog.author.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-600">
                                        <Instagram size={18} />
                                    </a>
                                )}
                                {blog?.author?.social_links?.website && (
                                    <a href={blog.author.social_links.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
                                        <Globe size={18} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* General CTA Section */}
            {blog?.content?.cta && blog.content.cta.length > 0 && blog.content.cta.map((cta: any, index: number) => {
                const hasTitle = cta.cta_title && cta.cta_title.trim() !== "";
                const validLinks = Array.isArray(cta.cta_links) 
                    ? cta.cta_links.filter((l: any) => l && l.title && l.title.trim() !== "") 
                    : [];
                const hasLinks = validLinks.length > 0;
                
                if (!hasTitle && !hasLinks) return null;

                return (
                    <section className="py-24 px-4 " key={`cta-${index}`}>
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-3xl p-12 text-center text-white relative overflow-hidden"
                            >
                                {hasTitle && (
                                    <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-6 tracking-tight text-white">
                                        {cta.cta_title}
                                    </h2>
                                )}
                                {cta.cta_details && (
                                    <div
                                        className="text-xl text-white mb-10 prose prose-lg mx-auto"
                                        dangerouslySetInnerHTML={{ __html: cta.cta_details }}
                                    />
                                )}

                                {hasLinks && (
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        {validLinks.map((cta_link: any, idx: number) => (
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
                                )}
                            </motion.div>
                        </div>
                    </section>
                );
            })}


            <Footer />
        </div>
    );
}
