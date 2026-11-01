import { Calendar } from "lucide-react";
import React, { useEffect, useState } from "react";

import BASE_URL from "../global";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { fetchData } from "../axiosHook";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { NotFoundPage } from "./NotFoundPage";
import { PopularTripsSection } from "../components/PopularTripsSection";
import { Seo } from "../components/Seo";
import { Button } from "../components/ui/Button";

function RelatedGuideDetailSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <div className="dc-skeleton h-[50vh] min-h-[400px]" />
                <article className="max-w-4xl px-4 py-16 mx-auto">
                    <div className="space-y-6">
                        <div className="dc-skeleton dc-skeleton-title w-3/4 h-12" />
                        <div className="space-y-4 pt-8">
                            <div className="dc-skeleton dc-skeleton-row" />
                            <div className="dc-skeleton dc-skeleton-row" />
                            <div className="dc-skeleton dc-skeleton-row" />
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}

export function RelatedGuideDetailPage() {
    const [guide, setGuide] = useState<any>();
    const { slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchGuide = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetchData("/related-guide/" + slug);
            setGuide(res || null);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuide();
    }, [slug]);

    const transformGuideContent = (html: string) => {
        if (!html) return "";
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        
        const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?/;
        const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;

        const allElements = doc.querySelectorAll('p, div, span, strong, em');
        allElements.forEach(el => {
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

        const images = doc.querySelectorAll("img");
        images.forEach((img) => {
            const existingFigure = img.closest("figure");
            const captionText = img.getAttribute("alt");
            
            if (existingFigure) {
                existingFigure.className = "mb-12 rounded-2xl overflow-hidden shadow-xl";
                img.className = "w-full h-auto";
                
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

        const tables = doc.querySelectorAll("table");
        tables.forEach((table) => {
            if (table.closest(".overflow-x-auto")) return;

            const wrapper = doc.createElement("div");
            wrapper.className = "overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-12";
            
            table.className = "w-full border-collapse bg-white";
            
            const thead = table.querySelector("thead");
            if (thead) {
                thead.className = "bg-gradient-to-r from-[#0066FF] to-[#06B6D4] text-white";
                const headerCells = thead.querySelectorAll("th, td");
                headerCells.forEach(cell => {
                    cell.className = "px-6 py-4 text-left font-semibold text-sm uppercase tracking-wider whitespace-nowrap";
                });
            }

            const tbody = table.querySelector("tbody");
            if (tbody) {
                tbody.className = "divide-y divide-gray-200";
                const rows = tbody.querySelectorAll("tr");
                rows.forEach((tr, index) => {
                    tr.className = index % 2 === 0 ? "bg-white hover:bg-gray-50 transition-colors" : "bg-gray-50 hover:bg-gray-100 transition-colors";
                    const cells = tr.querySelectorAll("td");
                    cells.forEach((cell, cellIndex) => {
                        const baseClass = "px-6 py-4 text-sm leading-relaxed";
                        cell.className = cellIndex === 0 
                            ? `${baseClass} font-medium text-gray-900` 
                            : `${baseClass} text-gray-700`;

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
        return <RelatedGuideDetailSkeleton />;
    }

    if (!guide || error) {
        return <NotFoundPage />;
    }

    return (
        <div className="min-h-screen font-sans text-gray-900 bg-white">
            <Seo
                seoMeta={guide?.seo_meta}
                fallbackTitle={guide?.title}
                fallbackDescription={guide?.excerpt}
                fallbackImage={guide?.featured_image}
                canonicalPath={`/related-guides/${guide?.slug}`}
                type="Article"
            />
            <Navbar />

            <div className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                    {guide?.featured_image && (
                        <img
                            src={`${BASE_URL}/${guide?.featured_image}`}
                            alt={guide?.title || "Featured Image"}
                            className="object-cover w-full h-full"
                        />
                    )}
                </div>

                <div className="relative z-20 w-full px-4 pb-12 mt-16">
                    <div className="max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-5xl">
                                {guide?.title}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-sm text-white/90">
                                <span className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    {new Date(guide?.published_at).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <article className="max-w-4xl px-4 py-16 mx-auto sm:px-6">
                {guide?.overview && (
                    <div 
                        dangerouslySetInnerHTML={{ __html: transformGuideContent(guide.overview) }} 
                        className="prose prose-lg max-w-none prose-img:rounded-2xl prose-img:shadow-xl prose-headings:text-gray-900 prose-a:text-[#0066FF] hover:prose-a:text-[#06B6D4] pb-10" 
                    />
                )}

                {/* Pro Tips Section */}
                {guide?.content?.pro_tips && Array.isArray(guide.content.pro_tips) && guide.content.pro_tips.length > 0 && (
                    <section className="mb-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <span className="w-10 h-10 bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                💡
                            </span>
                            Pro Tips
                        </h2>
                        <ul className="space-y-5">
                            {guide.content.pro_tips.map((item: any, idx: number) => (
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
            </article>

            <PopularTripsSection 
                limit={3} 
                title="Explore Our Packages"
                subtitle="Discover our most popular itineraries and start planning your next Himalayan adventure."
            />

            {/* General CTA Section */}
            {guide?.content?.cta && guide.content.cta.length > 0 && guide.content.cta[0].cta_links.length > 0 && guide.content.cta.map((cta: any, index: number) => (
                <section className="py-24 px-4" key={`cta-${index}`}>
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-3xl p-12 text-center text-white relative overflow-hidden"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white">
                                {cta.cta_title}
                            </h2>
                            <div
                                className="text-xl text-white mb-10 prose prose-lg mx-auto"
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
            ))}

            <Footer />
        </div>
    );
}
