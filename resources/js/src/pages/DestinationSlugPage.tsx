import {
    ArrowRight,
    Calendar,
    Check,
    ChevronDown,
    ChevronUp,
    Globe,
    MapPin,
    Star,
    Sun,
    Wind,
    X,
} from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import BASE_URL from "../global";
import { Button } from "../components/ui/Button";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { fetchData } from "../axiosHook";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { Seo } from "../components/Seo";
import PlaceExploresSection from "../components/PlaceExploresSection";

// ─────────────────────────────────────────────
// SECTION: Hero Banner
// ─────────────────────────────────────────────
const HeroBanner = ({ data }: { data: any }) => {
    const tags: any[] = data.banner_accordion_tags ?? [];

    return (
        <section className="relative h-[80vh] min-h-[600px] flex items-end overflow-hidden">
            {/* Background */}e5
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                {data.banner_image && (
                    <img
                        src={`${BASE_URL}/${data.banner_image}`}
                        alt={data.name}
                        className="object-cover w-full h-full"
                    />
                )}
            </div>


            {/* Content */}
            <div className="relative z-20 w-full px-4 pb-16 mt-16">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {data.region && (
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="text-[#06B6D4]" size={22} />
                                <span className="text-lg font-medium text-white/90">
                                    {data.region}
                                </span>
                            </div>
                        )}

                        <h1 className="mb-4 text-5xl font-bold text-white md:text-7xl leading-tight">
                            {data.name}
                        </h1>

                        {data.description && (
                            <div
                                className="max-w-3xl mb-8 text-xl leading-relaxed text-gray-200 line-clamp-3"
                                dangerouslySetInnerHTML={{ __html: data.description }}
                            />
                        )}

                        {/* Banner Tags */}
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-4 text-white">
                                {tags.map((tag: any, idx: number) => (  
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
                                    >
                                        {tag.icon && (
                                            <img
                                                src={`${BASE_URL}/${tag.icon}`}
                                                alt={tag.title}
                                                className="w-8 h-8 object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = "none";
                                                }}
                                            />
                                        )}
                                        <div>
                                            <p className="text-xs text-gray-300">{tag.title}</p>
                                            <p className="font-bold text-sm">{tag.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// ─────────────────────────────────────────────
// SECTION: Destination Details (text + image blocks)
// ─────────────────────────────────────────────
const DestinationDetailsSection = ({ data }: { data: any }) => {
    const details: any[] = data.destination_details ?? [];
    if (details.length === 0) return null;

    return (
        <>
            {/* First detail: text left, image right */}
            {details[0] && (
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="text-[#0066FF] font-bold tracking-widest text-sm uppercase mb-3 block">
                                    About {data.name}
                                </span>
                                <h2 className="mb-6 text-4xl font-bold text-gray-900 leading-tight">
                                    {details[0].title}
                                </h2>
                                <div className="w-16 h-1 bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-full mb-6" />
                                <div
                                    className="prose prose-lg text-gray-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: details[0].description }}
                                />
                            </motion.div>
{details[0].image && (
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative"
                            >
                                
                                    <>
                                        <div className="absolute -inset-4 bg-gradient-to-br from-[#0066FF]/10 to-[#06B6D4]/10 rounded-3xl -z-10" />
                                        <img
                                            src={`${BASE_URL}/${details[0].image}`}
                                            alt={details[0].title}
                                            className="object-cover w-full h-auto shadow-2xl rounded-2xl"
                                        />
                                    </>
                            </motion.div>
                                )}
                        </div>
                    </div>
                </section>
            )}

            {/* Remaining details: alternating layout */}
            {details.length > 1 && (
                <section className="py-10 bg-white">
                    <div className="max-w-7xl mx-auto px-6 space-y-24">
                        {details.slice(1).map((detail: any, idx: number) => {
                            const isEven = idx % 2 === 0;
                            return (
                                <div
                                    key={idx}
                                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6 }}
                                        className={isEven ? "lg:order-1" : "lg:order-2"}
                                    >
                                        <h2 className="mb-6 text-3xl font-bold text-gray-900">
                                            {detail.title}
                                        </h2>
                                        <div
                                            className="prose prose-lg text-gray-700 leading-relaxed"
                                            dangerouslySetInnerHTML={{ __html: detail.description }}
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6 }}
                                        className={`relative ${isEven ? "lg:order-2" : "lg:order-1"}`}
                                    >
                                        {detail.image && (
                                            <img
                                                src={`${BASE_URL}/${detail.image}`}
                                                alt={detail.title}
                                                className="object-cover w-full h-auto shadow-2xl rounded-2xl"
                                            />
                                        )}
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </>
    );
};

// ─────────────────────────────────────────────
// SECTION: Best Season
// ─────────────────────────────────────────────
const BestSeasonSection = ({ data }: { data: any }) => {
    const seasons: any[] = data.best_season_accordions ?? [];
    if (seasons.length === 0) return null;

    const seasonColors: Record<string, { bg: string; text: string; border: string }> = {
        Spring: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
        Autumn: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
        Winter: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
        Summer: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
        Monsoon: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    };

    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        {data.best_season_title ?? "Best Time to Visit"}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Choose the perfect season for your adventure.
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#0066FF] to-[#06B6D4] mx-auto rounded-full mt-6" />
                </div>
<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {seasons?.map((season: any, idx: number) => {
        const seasonName = season?.season || "";

        const colorKey = Object.keys(seasonColors).find((k) =>
            seasonName.toLowerCase().includes(k.toLowerCase())
        );

        const style = colorKey
            ? seasonColors[colorKey]
            : {
                  bg: "bg-gray-50",
                  text: "text-gray-700",
                  border: "border-gray-200",
              };

        return (
            <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-8 rounded-2xl border shadow-sm hover:shadow-lg transition-shadow ${style.bg} ${style.border}`}
            >
                <div className="flex items-center gap-4 mb-5">
                    <div className={`w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center ${style.text}`}>
                        {season?.icon ? (
                            <img
                                src={`${BASE_URL}/${season.icon}`}
                                alt={seasonName}
                                className="w-6 h-6 object-contain"
                                onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        ) : (
                            <Sun size={22} />
                        )}
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {season?.title}
                        </h3>
                        <p className={`text-sm font-medium ${style.text}`}>
                            {seasonName}
                        </p>
                    </div>
                </div>

                {season?.content && (
                    <div
                        className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: season.content }}
                    />
                )}
            </motion.div>
        );
    })}
</div>
            </div>
        </section>
    );
};

// ─────────────────────────────────────────────
// SECTION: Must-Visit Attractions
// ─────────────────────────────────────────────
const MustVisitSection = ({ data }: { data: any }) => {
    const attractions: any[] = data.must_visit_accordions ?? [];
    if (attractions.length === 0) return null;

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        {data.must_visit_title ?? "Must-Visit Attractions"}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Iconic places and experiences you shouldn't miss.
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#0066FF] to-[#06B6D4] mx-auto rounded-full mt-6" />
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {attractions.map((attraction: any, idx: number) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative overflow-hidden rounded-2xl shadow-lg group hover:shadow-2xl transition-all duration-300"
                        >
                            <div className="relative overflow-hidden h-72">
                                {attraction.image ? (
                                    <img
                                        src={`${BASE_URL}/${attraction.image}`}
                                        alt={attraction.title}
                                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#0066FF]/20 to-[#06B6D4]/20 flex items-center justify-center">
                                        <MapPin className="w-16 h-16 text-[#0066FF]/40" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 w-full p-6">
                                   
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {attraction.title}
                                    </h3>
                                    {attraction.content && (
                                        <div
                                            className="text-sm text-gray-300 line-clamp-2 prose prose-sm prose-invert"
                                            dangerouslySetInnerHTML={{ __html: attraction.content }}
                                        />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ─────────────────────────────────────────────
// SECTION: Practical Information
// ─────────────────────────────────────────────
const PracticalInfoSection = ({ data }: { data: any }) => {
    const infos: any[] = data.practical_information_accordions ?? [];
    const tips: any[] = data.essential_tips ?? [];
    const etiquette: any[] = data.cultural_etiquette ?? [];

    if (infos.length === 0 && tips.length === 0 && etiquette.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        {data.practical_information_title ?? "Practical Information"}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Essential details to help you plan your trip.
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#0066FF] to-[#06B6D4] mx-auto rounded-full mt-6" />
                </div>

                {/* Info cards */}
                {infos.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-2 lg:grid-cols-4">
                        {infos.map((info: any, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                            >
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                                    {info.icon ? (
                                        <img
                                            src={`${BASE_URL}/${info.icon}`}
                                            alt={info.title}
                                            className="w-6 h-6 object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <Globe className="w-6 h-6 text-[#0066FF]" />
                                    )}
                                </div>
                                <h4 className="font-bold text-gray-900 mb-1">{info.title}</h4>
                                <p className="text-sm text-gray-600">{info.content}</p>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Tips & Etiquette */}
                {(tips.length > 0 || etiquette.length > 0) && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {tips.length > 0 && (
                            <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <h4 className="flex items-center gap-2 mb-6 font-bold text-gray-900 text-lg">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Check className="text-green-600" size={16} />
                                    </div>
                                    Essential Tips
                                </h4>
                                <ul className="space-y-3">
                                    {tips.map((tip: any, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                            <Check
                                                size={16}
                                                className="text-green-500 shrink-0 mt-0.5"
                                            />
                                            <span>{tip.tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {etiquette.length > 0 && (
                            <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <h4 className="flex items-center gap-2 mb-6 font-bold text-gray-900 text-lg">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Globe className="text-[#0066FF]" size={16} />
                                    </div>
                                    Cultural Etiquette
                                </h4>
                                <ul className="space-y-3">
                                    {etiquette.map((item: any, idx: number) => (
                                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                            <Check
                                                size={16}
                                                className="text-[#0066FF] shrink-0 mt-0.5"
                                            />
                                            <span>{item.rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

// ─────────────────────────────────────────────
// SECTION: Popular Packages / Treks
// ─────────────────────────────────────────────
const PackagesSection = ({ data, packages }: { data: any; packages: any[] }) => {
    if (!packages || packages.length === 0) return null;

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Popular Trips in {data.name}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore the best trekking routes this destination has to offer.
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#0066FF] to-[#06B6D4] mx-auto rounded-full mt-6" />
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {packages.map((pkg: any, idx: number) => (
                        <motion.a
                            key={idx}
                            href={`/${pkg.slug}`}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="overflow-hidden bg-white shadow-md group rounded-2xl hover:shadow-xl transition-all duration-300 border border-gray-100"
                        >
                            <div className="relative h-56 overflow-hidden">
                                {pkg.banner_image ? (
                                    <img
                                        src={`${BASE_URL}/${pkg.banner_image}`}
                                        alt={pkg.title}
                                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#0066FF]/20 to-[#06B6D4]/20" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                               
                            </div>
                            <div className="p-6">
                                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors">
                                    {pkg.title}
                                </h3>
                                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                                    {pkg.duration_days && (
                                        <span className="flex items-center gap-1">
                                            <Calendar size={14} className="text-[#06B6D4]" />
                                            {pkg.duration_days}
                                        </span>
                                    )}
                                    {pkg.difficulty && (
                                        <span className="font-semibold text-orange-500">
                                            {pkg.difficulty}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between" data-id="element-1139">
                                    <span className="text-2xl font-bold text-[#0066FF]" data-id="element-1140">${pkg.price}</span>
                                    <span className="text-[#0066FF] font-medium flex items-center gap-2 group-hover:gap-3 transition-all" data-id="element-1141">View Package <ArrowRight size={16} /></span>
                                </div>
                                
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ─────────────────────────────────────────────
// SECTION: CTA Banner
// ─────────────────────────────────────────────
const CtaBanner = ({ data }: { data: any }) => (
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
            <div className="bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-3xl p-12 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-16 -mb-16" />
                <div className="relative z-10">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                        Ready to Explore {data.name}?
                    </h2>
                    <p className="max-w-2xl mx-auto mb-8 text-lg text-blue-100">
                        Let us help you plan the perfect adventure. From trekking to
                        cultural tours, we'll create an unforgettable experience.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <a href="/plan-trip">
                            <Button
                                variant="primary"
                                size="lg"
                                className="bg-white text-[#0066FF] hover:bg-gray-100 border-none shadow-lg"
                            >
                                Plan a Trip
                            </Button>
                        </a>
                        <a href="/contact">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-white hover:text-[#0066FF]"
                            >
                                Contact Us
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// ─────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────
function DestinationSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                {/* Hero Skeleton */}
                <div className="dc-skeleton h-[80vh] min-h-[600px]" />
                
                {/* Content Sections */}
                <section className="py-20 max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                        <div className="space-y-6">
                            <div className="dc-skeleton dc-skeleton-title w-3/4 h-12" />
                            <div className="dc-skeleton dc-skeleton-row" />
                            <div className="dc-skeleton dc-skeleton-row" />
                            <div className="dc-skeleton dc-skeleton-row w-2/3" />
                        </div>
                        <div className="dc-skeleton h-[400px] rounded-3xl" />
                    </div>
                    
                    {/* Packages Grid Skeleton */}
                    <div className="dc-skeleton-grid">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="dc-skeleton h-[500px] rounded-3xl" />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export function DestinationSlugPage() {
    const { slug } = useParams();

    const [destination, setDestination] = useState<any>(null);
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchDestination = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetchData<any>("/destination/" + slug);
            if (res) {
                // API returns data directly (not nested under .destination)
                // But handle both cases for safety
                if (res.destination) {
                    setDestination(res.destination);
                    setPackages(res.packages ?? res.related_treks ?? []);
                } else {
                    setDestination(res);
                    setPackages(res.packages ?? []);
                }
            } else {
                setError(true);
            }
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDestination();
    }, [slug]);

    if (loading) {
        return <DestinationSkeleton />;
    }

    if (!destination || error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg font-medium text-gray-700">
                    No destination found.
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans text-gray-900 bg-white">
            <Seo
                seoMeta={destination?.seo_meta}
                fallbackTitle={destination?.name}
                fallbackDescription={destination?.description ? String(destination.description).replace(/<[^>]*>/g, '').slice(0, 160) : undefined}
                fallbackImage={destination?.banner_image}
                canonicalPath={`/destination/${destination?.slug}`}
                type="TouristDestination"
            />
            <Navbar />
            <HeroBanner data={destination} />
            <DestinationDetailsSection data={destination} />
            <BestSeasonSection data={destination} />
            <MustVisitSection data={destination} />
            {(destination?.place_explores || destination?.placeExplores) && (
                <PlaceExploresSection places={destination.place_explores || destination.placeExplores} />
            )}
            <PracticalInfoSection data={destination} />
            <PackagesSection data={destination} packages={packages} />
            <CtaBanner data={destination} />
            <Footer />
        </div>
    );
}
