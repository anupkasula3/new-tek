import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronRight } from "lucide-react";
import { fetchData } from "../axiosHook";
import BASE_URL from "../global";
import { SectionHeading } from "./ui/SectionHeading";
import { Link } from "react-router-dom";

export default function PlaceExploresSection({ places: propPlaces }: { places?: any[] }) {
    const [places, setPlaces] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (propPlaces) {
            setPlaces(propPlaces);
            setLoading(false);
        } else {
            fetchData("/components/place-explores")
                .then((res: any) => setPlaces(res ?? []))
                .catch(() => setPlaces([]))
                .finally(() => setLoading(false));
        }
    }, [propPlaces]);

    if (loading || !places.length) return null;

    // Helper to strip HTML tags and decode HTML entities from rich-text editor output
    const stripHtml = (html: string): string => {
        if (!html) return "";
        try {
            const doc = new DOMParser().parseFromString(html, "text/html");
            return doc.body.textContent?.trim() ?? "";
        } catch {
            return html.replace(/<[^>]*>?/gm, "");
        }
    };

    return (
        <section className="py-20 px-4 max-w-7xl mx-auto">
            <SectionHeading
                title="Places to Explore"
                subtitle="Discover the top destinations"
                centered={true}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {places.map((place, index) => (
                    <motion.div
                        key={place.id ?? index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col bg-white h-full border border-stone-100"
                    >
                        <Link to={`/places/${place.slug}`} className="flex flex-col h-full">
                            {/* Image Section */}
                            <div className="w-full relative aspect-[4/3] overflow-hidden">
                                {place.featured_image ? (
                                    <img
                                        src={`${BASE_URL}/${place.featured_image}`}
                                        alt={place.title || "Place image"}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src =
                                                "https://placehold.co/600x400?text=Image+Not+Found";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-stone-200" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <div className="flex items-center gap-4 text-xs text-stone-300 mb-2">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />{" "}
                                            {new Date(place.published_at || place.created_at).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </span>
                                        {place.location && (
                                            <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                                                {place.location}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                                        {place.title}
                                    </h3>
                                </div>
                            </div>

                            {/* Text Section */}
                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-stone-600 line-clamp-3 mb-4 text-sm leading-relaxed">
                                    {(() => {
                                        const text = stripHtml(place.overview);
                                        return text.length > 150 ? text.substring(0, 150) + "..." : text;
                                    })()}
                                </p>
                                <span className="inline-flex items-center text-cyan-600 font-semibold group-hover:text-cyan-700 mt-auto text-sm">
                                    Explore Details <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                                </span>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
