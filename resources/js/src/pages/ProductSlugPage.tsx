import {
    ArrowRight,
    Check,
    MapPin,
    Zap,
    TrendingUp,
    Clock,
    AlertTriangle,
    Mountain,
    ChevronDown,
    ChevronUp,
    X,
    Sun,
    CloudRain,
    Activity,
    Thermometer,
    Wind,
    Briefcase,
    FileText,
    HeartPulse,
    ShieldCheck,
    User,
    Coffee,
    Moon,
    Star,
    Quote,
    MessageSquare,
    Eye,
    List,
    DollarSign,
    CalendarDays,
    MessageCircle,
    HelpCircle,
    Bed,
    Utensils,
    Backpack,
    Heart,
    Share2,
    ClipboardList,
} from "lucide-react";
import React, { memo, useEffect, useState, useRef } from "react";

import BASE_URL from "../global";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { fetchData, postData } from "../axiosHook";
import { useWishlist } from "../hooks/useWishlist";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { Button } from "../components/ui/Button";
import { NotFoundPage } from "./NotFoundPage";
import { ProductDepartureCalendar } from "../components/ProductDepartureCalendar";
import { Seo } from "../components/Seo";

// ─────────────────────────────────────────────
// Helper: strip HTML tags to plain text
// ─────────────────────────────────────────────
const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, "") ?? "";

// ─────────────────────────────────────────────
// SECTION: Hero Banner (already dynamic, refined)
// ─────────────────────────────────────────────
const HeroBanner = ({ data, onToggleWishlist, isFavorite }: { data: any; onToggleWishlist: () => void; isFavorite: boolean }) => {
    const tags = (data.banner_accordion_tags ?? []).filter((tag: any) => tag.title || tag.content || tag.icon);
    const colors = ["#0066FF", "#8B5CF6", "#06B6D4", "#FFD700"];

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: data.title,
                url: window.location.href,
            }).catch(() => {});
        } else {
            navigator.clipboard?.writeText(window.location.href);
        }
    };

    return (
        <section
            id="hero-banner"
            className="relative w-full flex flex-col items-start overflow-hidden pt-40"
            style={{ minHeight: '100vh' }}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={data.banner_image ? `${BASE_URL}/${data.banner_image}` : "https://images.unsplash.com/photo-1585938389612-a552a28d6914?q=80&w=1600&auto=format&fit=crop"}
                    alt={data.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
            </div>

            {/* Spacer — pushes content to bottom like homepage HeroSection */}
            <div className="flex-1" />

             {/* Title */}
            <div className="relative z-10 text-left px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-8 flex flex-col gap-4">
                <div>
                    {data.region && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold tracking-widest uppercase mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />
                        {data.region}
                    </div>
                )}
                <h1 className="text-4xl md:text-5xl  font-extrabold text-white leading-tight">
                    {data.title}
                </h1>
                {data.description && (
                    <p className=" text-white/80 text-lg mr-auto drop-shadow">
                        {data.description}
                    </p>
                )}
                </div>
                
             <div className='flex justify-between items-end w-full flex-wrap gap-4 mt-8 pb-4 '>
                   {tags.length > 0 && (
                    <div className="relative z-20 self-start max-w-full md:max-w-4xl">
                        <div className="flex flex-wrap gap-4 justify-start">
                            {tags.map((tag: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="flex flex-row items-center gap-3 bg-black/40 rounded-2xl shadow-xl border border-white/10 py-2 px-4"
                                >
                                    <div
                                        className="p-2.5  flex items-center justify-center"
                                    >
                                        {tag.icon ? (
                                            <img
                                                src={`${BASE_URL}/${tag.icon}`}
                                                alt={tag.content}
                                                className="w-5 h-5 object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <MapPin
                                                className="w-5 h-5 text-[#0066FF]"
                                            />
                                        )}
                                    </div>
                                    <div className="flex flex-col group cursor-default">
                                        <span className="text-base font-extrabold text-white sm:text-lg">
                                            {tag.title}
                                        </span>
                                        <span className="text-[10px] uppercase tracking-wider text-white font-semibold">
                                            {tag.content}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                 {/* Share & Wishlist — bottom right corner */}
            <div className="relative flex flex-row gap-2">
                <button
                    type="button"
                    onClick={handleShare}
                    title="Share this trip"
                    className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-800 transition-all shadow-lg"
                >
                    <Share2 size={18} />
                </button>
                <button
                    type="button"
                    onClick={onToggleWishlist}
                    title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    className={`w-11 h-11 rounded-full backdrop-blur-md border flex items-center justify-center transition-all shadow-lg ${
                        isFavorite
                            ? 'bg-red-500 border-transparent text-white hover:bg-red-600'
                            : 'bg-black/40 border-white/20 text-white hover:bg-white hover:text-red-500'
                    }`}
                >
                    <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                </button>
            </div>
             </div>
            </div>

           
        </section>
    );
};

// ─────────────────────────────────────────────
// SECTION: Experience / Overview
// ─────────────────────────────────────────────
const ExperienceSection = ({ data }: { data: any }) => {
    if (!data.experience && !data.experience_note && !data.main_content) return null;
    return (
        <section className="bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-left mb-12">
                    <span className="text-[#0066FF] font-bold tracking-widest text-sm uppercase mb-3 block">
                        {data.experience_subtitle ?? "The Experience"}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        {data.experience_title ?? "Journey to the Base of the World"}
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-full" />
                </div>
                {data.experience && (
                    <div
                        className="prose prose-lg prose-gray mx-auto text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: data.experience }}
                    />
                )}
                {data.main_content && (
                    <div
                        className="prose prose-lg prose-gray mx-auto text-gray-600 leading-relaxed mt-8"
                        dangerouslySetInnerHTML={{ __html: data.main_content }}
                    />
                )}
                {data.experience_note && (
                    <div className="flex flex-col gap-4 p-5 bg-blue-50 border-l-4 border-blue-500 rounded-xl mt-8">
                        {data.experience_note_title && <span className="text-blue-600 font-black text-sm uppercase tracking-widest flex-shrink-0 mt-0.5">
                            {data.experience_note_title}
                        </span>}
                        <p className="text-gray-700 text-sm leading-relaxed">{data.experience_note}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

// ─────────────────────────────────────────────
// SECTION: Itinerary
// ─────────────────────────────────────────────
const ItinerarySection = ({ data }: { data: any }) => {
    const itineraries: any[] = (data.itineraries ?? []).filter((it: any) => it.title || it.day || it.description);
    if (itineraries.length === 0) return null;

    const [openDays, setOpenDays] = useState<Record<number, boolean>>({});

    const isAllExpanded = itineraries.length > 0 && itineraries.every((_, idx) => openDays[idx]);

    const toggleAll = () => {
        if (isAllExpanded) {
            setOpenDays({});
        } else {
            const allOpen: Record<number, boolean> = {};
            itineraries.forEach((_, idx) => {
                allOpen[idx] = true;
            });
            setOpenDays(allOpen);
        }
    };

    const toggleDay = (idx: number) => {
        setOpenDays(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 text-left">
                    <div>
                        {data.itinerary_subtitle && (
                            <span className="text-[#0066FF] font-bold tracking-widest text-sm uppercase mb-3 block">
                                {data.itinerary_subtitle}
                            </span>
                        )}
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            {data.itinerary_title ?? "Your Daily Itinerary"}
                        </h2>
                        <p className="text-gray-600 max-w-xl">
                            {data.itinerary_description ?? `A carefully planned ${data.duration_days ?? `${itineraries.length}-day`} journey designed for optimal acclimatization and experience.`}
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={toggleAll}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#0066FF]/20 bg-white hover:bg-blue-50 text-[#0066FF] text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                        >
                            {isAllExpanded ? "Collapse All" : "Expand All"}
                        </button>
                    </div>
                </div>

                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0066FF] via-[#8B5CF6] to-[#06B6D4] opacity-30" />

                    <div className="space-y-6">
                        {itineraries.map((itinerary: any, idx: number) => (
                            <ItineraryItem
                                key={itinerary.id ?? idx}
                                itinerary={itinerary}
                                isOpen={!!openDays[idx]}
                                onToggle={() => toggleDay(idx)}
                            />
                        ))}
                    </div>
                </div>

                {data.itinerary_note && (
                    <div className="flex flex-col gap-4 p-5 bg-blue-50 border-l-4 border-blue-500 rounded-xl mt-8">
                        {data.itinerary_note_title && <span className="text-blue-600 font-black text-sm uppercase tracking-widest flex-shrink-0 mt-0.5">
                            {data.itinerary_note_title}
                        </span>}
                        <p className="text-gray-700 text-sm leading-relaxed">{data.itinerary_note}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

const ItineraryItem = ({ itinerary, isOpen, onToggle }: { itinerary: any; isOpen: boolean; onToggle: () => void }) => {
    return (
        <div className="relative flex gap-6 md:gap-10 group">
            {/* Day Bubble */}
            <div className="flex-shrink-0 z-10 hidden md:block">
                <div className="w-8 h-8 md:w-16 md:h-16 rounded-full bg-[#0066FF] text-white flex items-center justify-center font-bold text-sm md:text-xl shadow-lg border-4 border-white group-hover:scale-110 transition-transform duration-300 p-4 flex-col">
                    <small className="text-xs">Day</small> 
                    <span>{itinerary.day}</span>
                </div>
            </div>

            {/* Card */}
            <div className="flex-grow bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                {/* Header block (Click to Toggle) */}
                <div onClick={onToggle} className={`cursor-pointer select-none  ${isOpen ? "" : "md:flex h-full"}`}>
                    <div className="md:hidden w-16 h-8 gap-1 rounded-full bg-[#0066FF] mx-4  mt-2 relative left-0 top-0 text-white flex items-center justify-center font-bold text-xs border-2 border-white px-4 py-0 flex-row">
                                        <span>Day</span> 
                                        <span>{itinerary.day}</span>
                                    </div>
                        <div className="w-full flex items-center justify-between px-4 pb-2 pt-2 text-left">
                            <span
                                className={`font-bold text-lg pr-8 transition-colors ${isOpen ? "text-[#0066FF]" : "text-gray-900"}`}
                            >
                              <div className="flex-shrink-0 z-10 md:hidden ">
                                  
                                </div>  {itinerary.title}
                            </span>
                            <div
                                className={`p-1 rounded-full transition-colors shrink-0 ${isOpen ? "bg-[#0066FF] text-white" : "bg-gray-100 text-gray-500"}`}
                            >
                                {isOpen ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </div>
                        </div>
                  
                </div>

                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className={`px-6  pt-0  pb-6`}>
                                {itinerary.image && (
                                    <div className="h-72 overflow-hidden relative mb-4 rounded-xl">
                                        <img
                                            src={`${BASE_URL}/${itinerary.image}`}
                                            alt={itinerary.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                )}

                                {/* Description */}
                                <div className="text-gray-600 leading-relaxed mb-6 prose prose-sm max-w-none [&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0">
                                    <div dangerouslySetInnerHTML={{ __html: itinerary.description }} />
                                </div>

                                {/* Accommodation & Meals */}
                                {(itinerary.accommodation || itinerary.meals || itinerary.distance_km || itinerary.walking_hours || itinerary.altitude) && (
                                    <div className="space-y-3 p-4 bg-blue-100 rounded-xl border border-blue-200">
                                        {itinerary.accommodation && (
                                            <div className="flex items-center gap-3 text-sm font-medium">
                                                <img src="/assets/images/hotelstay.svg" className="w-8 h-8 p-1.5 bg-white rounded-lg flex-shrink-0 object-contain" alt="Accommodation" />
                                                <span className="text-gray-600">{itinerary.accommodation}</span>
                                            </div>
                                        )}
                                        {itinerary.meals && (
                                            <div className="flex items-center gap-3 text-sm font-medium">
                                                <img src="/assets/images/food.svg" className="w-8 h-8 p-1.5 bg-white rounded-lg flex-shrink-0 object-contain" alt="Meals" />
                                                <span className="text-gray-600">{itinerary.meals}</span>
                                            </div>
                                        )}
                                        {itinerary.distance_km && (
                                            <div className="flex items-center gap-3 text-sm font-medium">
                                                <img src="/assets/images/distance.svg" className="w-8 h-8 p-1.5 bg-white rounded-lg flex-shrink-0 object-contain" alt="Distance" />
                                                <span className="text-gray-600">{itinerary.distance_km}</span>
                                            </div>
                                        )}
                                        {itinerary.walking_hours && (
                                            <div className="flex items-center gap-3 text-sm font-medium">
                                                <img src="/assets/images/duration.svg" className="w-8 h-8 p-1.5 bg-white rounded-lg flex-shrink-0 object-contain" alt="Walking Hours" />
                                                <span className="text-gray-600">{itinerary.walking_hours}</span>
                                            </div>
                                        )}
                                        {itinerary.altitude && (
                                            <div className="flex items-center gap-3 text-sm font-medium">
                                                <img src="/assets/images/altitude.svg" className="w-8 h-8 p-1.5 bg-white rounded-lg flex-shrink-0 object-contain" alt="Altitude" />
                                                <span className="text-gray-600">{itinerary.altitude}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};


// ─────────────────────────────────────────────
// SECTION: Pricing / Includes & Excludes
// ─────────────────────────────────────────────


const TIER_PALETTES = [
    { bg: "from-[#0066FF] to-[#0055D4]", badge: "bg-[#0066FF]", accent: "#0066FF", light: "bg-blue-50", ring: "ring-[#0066FF]" },
    { bg: "from-[#7C3AED] to-[#6D28D9]", badge: "bg-[#7C3AED]", accent: "#7C3AED", light: "bg-violet-50", ring: "ring-[#7C3AED]" },
    { bg: "from-[#059669] to-[#047857]", badge: "bg-[#059669]", accent: "#059669", light: "bg-emerald-50", ring: "ring-[#059669]" },
    { bg: "from-[#EA580C] to-[#C2410C]", badge: "bg-[#EA580C]", accent: "#EA580C", light: "bg-orange-50", ring: "ring-[#EA580C]" },
];

const TierIncludesExcludes = ({ tierSlug, includes, excludes }: { tierSlug: string; includes: any[]; excludes: any[] }) => {
    const tierIncludes = includes.filter((i: any) => i.tier === tierSlug);
    const tierExcludes = excludes.filter((e: any) => e.tier === tierSlug);
    // Fall back to items with no tier (global)
    const defaultIncludes = includes.filter((i: any) => !i.tier);
    const defaultExcludes = excludes.filter((e: any) => !e.tier);

    const displayIncludes = tierIncludes.length > 0 ? tierIncludes : defaultIncludes;
    const displayExcludes = tierExcludes.length > 0 ? tierExcludes : defaultExcludes;

    const renderItems = (items: any[], icon: React.ReactNode, noItemIcon: React.ReactNode, iconClass: string) => (
        <ul className="space-y-3">
            {items.map((item: any) => {
                const hasList = item.title?.includes('<li');
                const processedTitle = item.title?.replace(/<ul/g, '<ul style="margin: 0 !important; padding: 0 !important; list-style: none !important;"');
                return (
                    <li key={item.id} className="flex items-start gap-2 text-sm text-gray-600">
                        {!hasList && <span className={`mt-0.5 flex-shrink-0 ${iconClass}`}>{icon}</span>}
                        <div className={`prose prose-sm max-w-none ${hasList ? 'prose-includes' : ''}`} dangerouslySetInnerHTML={{ __html: processedTitle }} />
                    </li>
                );
            })}
        </ul>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-md bg-green-100 flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm">What's Included</h4>
                </div>
                {displayIncludes.length > 0
                    ? renderItems(displayIncludes, <Check className="w-3.5 h-3.5 text-green-500" />, null, "")
                    : <p className="text-xs text-gray-400 italic">No details added yet.</p>
                }
            </div>
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-md bg-red-100 flex items-center justify-center">
                        <X className="w-3 h-3 text-red-600" />
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm">What's Not Included</h4>
                </div>
                {displayExcludes.length > 0
                    ? renderItems(displayExcludes, <X className="w-3.5 h-3.5 text-red-400" />, null, "")
                    : <p className="text-xs text-gray-400 italic">No details added yet.</p>
                }
            </div>
        </div>
    );
};

const TierCard = ({ tier, index, data, onBookNow }: { tier: any; index: number; data: any; onBookNow: (persons: number) => void }) => {
    const palette = TIER_PALETTES[index % TIER_PALETTES.length];
    const [expanded, setExpanded] = useState(index === 0);
    const allIncludes: any[] = (data.includes ?? []).filter((i: any) => i.title);
    const allExcludes: any[] = (data.excludes ?? []).filter((e: any) => e.title);
    const tierSlug = tier.slug ?? tier.name?.toLowerCase().replace(/\s+/g, '-');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`bg-white rounded-3xl shadow-sm border-2 overflow-hidden transition-all duration-300 ${expanded ? `ring-2 ${palette.ring} border-transparent shadow-xl` : 'border-gray-100 hover:shadow-md'}`}
        >
            {/* Tier Header */}
            <div className={`bg-gradient-to-r ${palette.bg} p-6 text-white`}>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold tracking-widest uppercase text-white/70 block mb-1">Package Tier</span>
                        <h3 className="text-2xl font-bold">{tier.name}</h3>
                        {tier.description && (
                            <p className="text-white/80 text-sm mt-1 leading-relaxed">{tier.description}</p>
                        )}
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="text-3xl font-extrabold font-sans">
                            ${tier.price ?? data.price ?? '—'}
                        </div>
                        <div className="text-white/70 text-xs mt-0.5">per person</div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-5">
                    <button
                        onClick={() => onBookNow(1)}
                        className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-4 py-2 rounded-full border border-white/30 transition-colors cursor-pointer"
                    >
                        Book This Tier <ArrowRight size={14} />
                    </button>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-semibold transition-colors cursor-pointer ml-auto"
                    >
                        {expanded ? 'Hide Details' : 'View Details'}
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>
            </div>

            {/* Tier Body - Includes/Excludes */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6">
                            <TierIncludesExcludes
                                tierSlug={tierSlug}
                                includes={allIncludes}
                                excludes={allExcludes}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const AddonsBox = ({ addons, prevTierName }: { addons: any[]; prevTierName: string }) => {
    if (addons.length === 0) return null;

    return (
        <div className="mb-6 p-6 bg-[#EEF4FF] border border-[#D0E2FF] rounded-2xl">
            <div className="flex items-center gap-2 mb-4 text-[#0066FF] font-bold text-sm">
                <span className="w-5 h-5 rounded-full bg-[#0066FF] text-white flex items-center justify-center font-bold text-xs select-none">
                    +
                </span>
                <span>Added on top of the {prevTierName} package</span>
            </div>
            <div className="addons-content prose prose-sm max-w-none text-slate-800">
                {addons.map((item: any) => {
                    const processed = item.title?.replace(/<ul/g, '<ul style="margin:0!important;padding:0!important;list-style:none!important;"');
                    return (
                        <div key={item.id} dangerouslySetInnerHTML={{ __html: processed }} />
                    );
                })}
            </div>
        </div>
    );
};

const CostDetailsPanel = ({
    data,
    activeIncludes,
    activeExcludes,
    activeAddons,
    activeName,
    activeDesc,
    prevName,
    hasDetails,
    hasIncExc
}: {
    data: any;
    activeIncludes: any[];
    activeExcludes: any[];
    activeAddons: any[];
    activeName: string;
    activeDesc: string | null;
    prevName: string;
    hasDetails: boolean;
    hasIncExc: boolean;
}) => {
    if (!hasDetails) return null;

    const renderList = (items: any[], iconEl: React.ReactNode, proseCls: string) => (
        <ul className="space-y-4">
            {items.length === 0
                ? <li className="text-xs text-gray-400 italic">No details added yet.</li>
                : items.map((item: any) => {
                    const hasList = item.title?.includes('<li');
                    const processed = item.title?.replace(/<ul/g, '<ul style="margin:0!important;padding:0!important;list-style:none!important;"');
                    return (
                        <li key={item.id} className="flex items-start gap-3 text-[14px] text-gray-600 leading-relaxed">
                            {!hasList && iconEl}
                            <div className={`prose prose-sm max-w-none ${hasList ? proseCls : ''}`} dangerouslySetInnerHTML={{ __html: processed }} />
                        </li>
                    );
                })
            }
        </ul>
    );

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col gap-6 overflow-hidden">
            <style dangerouslySetInnerHTML={{ __html: `
                .prose-includes ul, .prose-excludes ul { margin: 0 !important; padding: 0 !important; list-style: none !important; }
                .prose-includes li, .prose-excludes li { margin: 0 !important; padding: 0 !important; }
                .addons-content ol {
                    list-style: none !important;
                    counter-reset: addon-counter;
                    padding-left: 0 !important;
                    margin: 0 !important;
                }
                .addons-content ol li {
                    counter-increment: addon-counter;
                    display: flex !important;
                    align-items: flex-start !important;
                    gap: 12px !important;
                    margin-bottom: 12px !important;
                    font-size: 14px !important;
                    font-weight: 500 !important;
                    color: #1e3a8a !important;
                }
                .addons-content ol li::before {
                    content: counter(addon-counter);
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    width: 20px !important;
                    height: 20px !important;
                    border-radius: 50% !important;
                    background-color: #0066FF !important;
                    color: white !important;
                    font-size: 11px !important;
                    font-weight: bold !important;
                    flex-shrink: 0 !important;
                    margin-top: 2px !important;
                }
                .addons-content ul {
                    list-style: none !important;
                    counter-reset: addon-counter-ul;
                    padding-left: 0 !important;
                    margin: 0 !important;
                }
                .addons-content ul li {
                    counter-increment: addon-counter-ul;
                    display: flex !important;
                    align-items: flex-start !important;
                    gap: 12px !important;
                    margin-bottom: 12px !important;
                    font-size: 14px !important;
                    font-weight: 500 !important;
                    color: #1e3a8a !important;
                }
                .addons-content ul li::before {
                    content: counter(addon-counter-ul);
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    width: 20px !important;
                    height: 20px !important;
                    border-radius: 50% !important;
                    background-color: #0066FF !important;
                    color: white !important;
                    font-size: 11px !important;
                    font-weight: bold !important;
                    flex-shrink: 0 !important;
                    margin-top: 2px !important;
                }
            `}} />

            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-100">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">{activeName} — what you get</h3>
                    {activeDesc && <p className="text-gray-500 text-sm mt-1">{activeDesc}</p>}
                </div>
                {data.duration_days && (
                    <div className="text-xs uppercase font-bold tracking-widest text-slate-400 mt-2 md:mt-0 md:text-right">
                        {data.duration_days}
                    </div>
                )}
            </div>

            {activeAddons.length > 0 && (
                <AddonsBox addons={activeAddons} prevTierName={prevName} />
            )}

            {hasIncExc && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-5 h-5 rounded-md bg-green-50 flex items-center justify-center text-green-600">
                                <Check className="w-3.5 h-3.5" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">What's Included</h3>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`inc-${activeName}`}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 8 }}
                                transition={{ duration: 0.22 }}
                            >
                                {renderList(
                                    activeIncludes,
                                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />,
                                    'prose-includes'
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-5 h-5 rounded-md bg-red-50 flex items-center justify-center text-red-600">
                                <X className="w-3.5 h-3.5" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900">What's Not Included</h3>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`exc-${activeName}`}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 8 }}
                                transition={{ duration: 0.22 }}
                            >
                                {renderList(
                                    activeExcludes,
                                    <X className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />,
                                    'prose-excludes'
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper: compute price per person for a tier based on pax count and pax_pricing data
function computeDynamicPrice(
    paxPricingAll: any[],
    tierSlug: string,
    baseTierPrice: any,
    basePkgPrice: any,
    persons: number
): number {
    const parseP = (v: unknown) => parseFloat(String(v).replace(/,/g, '')) || 0;
    const base = baseTierPrice != null ? parseP(baseTierPrice) : parseP(basePkgPrice);

    const tierRows = (paxPricingAll ?? []).filter(
        (p: any) =>
            p.pax != null && p.pax !== '' &&
            p.price != null && p.price !== '' &&
            p.tier === tierSlug
    );

    if (tierRows.length === 0) return base;

    const sorted = [...tierRows].sort((a: any, b: any) => Number(a.pax) - Number(b.pax));
    const match = sorted.find((p: any) => persons <= Number(p.pax));
    return match ? parseP(match.price) : parseP(sorted[sorted.length - 1].price);
}

const PriceTierSelectorCard = ({
    data,
    tiers,
    activeTierIdx,
    setActiveTierIdx,
    showPricingTable,
    setShowPricingTable,
    activeTierSlug,
    onBookNow,
    hasTiers
}: {
    data: any;
    tiers: any[];
    activeTierIdx: number;
    setActiveTierIdx: (idx: number) => void;
    showPricingTable: boolean;
    setShowPricingTable: (show: boolean) => void;
    activeTierSlug: string;
    onBookNow: (persons: number, tierSlug?: string) => void;
    hasTiers: boolean;
}) => {
    const [persons, setPersons] = useState(1);
    const { toggleWishlist, isInWishlist } = useWishlist();

    const activeTier = tiers[activeTierIdx] ?? tiers[0];

    const pricePerPerson = computeDynamicPrice(
        data.pax_pricing ?? [],
        activeTierSlug,
        activeTier?.price,
        data.price,
        persons
    );
    const totalPrice = pricePerPerson * persons;

    const hasPaxPricing = (data.pax_pricing ?? []).some(
        (p: any) => p.tier === activeTierSlug && p.pax != null && p.price != null
    );

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col justify-between overflow-hidden">
            <div className="p-6">
                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 mb-4">Choose Your Package</p>
                
                {tiers.length > 0 && (
                    <div className="space-y-3">
                        {tiers.map((tier: any, idx: number) => {
                            const isActive = activeTierIdx === idx;
                            const isPopular = tier.name?.toLowerCase().includes('standard');
                            return (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        setActiveTierIdx(idx);
                                        setShowPricingTable(false);
                                    }}
                                    className={`p-4 rounded-2xl cursor-pointer transition-all border-2 flex flex-col justify-between relative overflow-hidden ${
                                        isActive 
                                            ? 'bg-[#0066FF] border-transparent text-white shadow-lg shadow-blue-500/20' 
                                            : 'bg-blue-50 border-slate-100 hover:border-slate-200 text-slate-800'
                                    }`}
                                >
                                    <div className="flex items-center justify-between w-full gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                                isActive
                                                    ? 'border-white bg-white'
                                                    : 'border-slate-300 bg-transparent'
                                            }`}>
                                                {isActive && (
                                                    <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF]" />
                                                )}
                                            </span>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm tracking-tight">{tier.name}</span>
                                                {tier.description && (
                                                    <span className={`text-[11px] mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                                                        {tier.description}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-black text-sm block">${tier.price ?? '—'}</span>
                                            <span className={`text-[9px] uppercase tracking-wider block font-bold ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>per person</span>
                                        </div>
                                    </div>

                                    {isActive && (
                                        <div className="mt-3 pt-3 border-t border-white/10 w-full space-y-3">
                                     
                                              {(() => {
                                                const tierPaxPricing = (data.pax_pricing ?? []).filter(
                                                    (p: any) => p.tier === activeTierSlug
                                                );
                                                const sorted = [...tierPaxPricing].sort((a: any, b: any) => a.pax - b.pax);
                                                return (
                                                    <>
                                                          <div className="flex justify-between items-center gap-4 flex-wrap">
                                                        {hasPaxPricing && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShowPricingTable(!showPricingTable);
                                                            }}
                                                            className="text-[11px] font-bold underline text-white/80 hover:text-white cursor-pointer focus:outline-none text-left"
                                                        >
                                                            {showPricingTable ? 'Hide group discounts' : 'See group discounts'}
                                                        </button>
                                                        )}
                                                        {isPopular && (
                                                <span className="inline-block bg-amber-400 text-slate-900 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                                                    ★ Most Popular
                                                </span>
                                            )}
                                            </div>
                                            

                                                        {showPricingTable && sorted.length > 0 && (
                                                            <div className="bg-blue-900/30 backdrop-blur-md rounded-xl p-3 border border-white/10 overflow-hidden text-white w-full">
                                                                <table className="w-full text-[10px] text-left">
                                                                    <thead>
                                                                        <tr className="border-b border-white/10">
                                                                            <th className="pb-1 font-semibold">Group Size</th>
                                                                            <th className="pb-1 text-right font-semibold">Price/Pax</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {sorted.map((paxPrice: any, i: number) => {
                                                                            const currentPax = parseInt(paxPrice.pax);
                                                                            const prevPax = i === 0 ? 0 : parseInt(sorted[i - 1].pax);
                                                                            const rangeText = prevPax + 1 === currentPax
                                                                                ? `${currentPax} ${currentPax === 1 ? 'Person' : 'People'}`
                                                                                : `${prevPax + 1}–${currentPax} People`;
                                                                            const isCurrentBracket = persons >= (prevPax + 1) && persons <= currentPax;
                                                                            return (
                                                                                <tr key={i} className={`border-b border-white/5 last:border-0 ${isCurrentBracket ? 'bg-white/10 rounded' : ''}`}>
                                                                                    <td className="py-1">
                                                                                        {rangeText}
                                                                                        {isCurrentBracket && <span className="ml-1 text-amber-300 font-bold">← you</span>}
                                                                                    </td>
                                                                                    <td className="py-1 text-right font-mono">${paxPrice.price}</td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}    

                                            {/* Pax Selector */}
                                            <div
                                                className="flex items-center justify-between bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <span className="text-[11px] font-bold text-white/80 uppercase tracking-wide">Travellers</span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPersons(p => Math.max(1, p - 1))}
                                                        disabled={persons <= 1}
                                                        className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-base leading-none"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="w-6 text-center font-black text-white text-sm">{persons}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPersons(p => p + 1)}
                                                        className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center transition-all cursor-pointer text-base leading-none"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Dynamic Price Display */}
                                            <motion.div
                                                key={`price-${pricePerPerson}-${persons}`}
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex items-end justify-between"
                                            >
                                                <div>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-black">${pricePerPerson.toLocaleString()}</span>
                                                        <span className="text-blue-100 text-xs">/ person</span>
                                                    </div>
                                                    {persons > 1 && (
                                                        <div className="text-[11px] text-blue-200 mt-0.5">
                                                            Total: <span className="font-black text-white">${totalPrice.toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {hasPaxPricing && persons > 1 && pricePerPerson < parseFloat(String(activeTier?.price ?? data.price ?? 0).replace(/,/g, '')) && (
                                                    <span className="text-[9px] bg-amber-400 text-slate-900 font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                        Group rate
                                                    </span>
                                                )}
                                            </motion.div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onBookNow(persons, activeTierSlug ?? undefined);
                                                    }}
                                                    className="flex-grow bg-white text-[#0066FF] py-3 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-blue-50 transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2"
                                                >
                                                    Book Now <ArrowRight size={14} />
                                                </button>
                                            </div>

                                            <Link
                                                to={`/plan-trip?package=${encodeURIComponent(data.title ?? '')}&packageId=${data.id ?? ''}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full flex justify-center items-center py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-white/20 text-white hover:bg-white/30 transition-colors border border-white/30 gap-2"
                                            >
                                                Enquire Now <ArrowRight size={13} />
                                            </Link>

                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* WhatsApp Contact */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <a
                        href={`https://wa.me/9779851032316?text=${encodeURIComponent(`Hi, I'm interested in the "${data.title}" package.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex justify-center items-center py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 transition-colors border border-emerald-200/60 gap-2 cursor-pointer"
                    >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.464L0 24zm6.066-4.75l.345.205c1.647.978 3.548 1.495 5.49 1.497l.006-.001c5.55 0 10.067-4.517 10.07-10.069.002-2.69-1.045-5.22-2.949-7.126C17.079 1.85 14.55 1.802 12.006 1.802c-5.552 0-10.07 4.518-10.073 10.071-.001 1.902.493 3.76 1.429 5.392l.244.427-.971 3.549 3.622-.95z"/>
                        </svg>
                        WhatsApp: +977 9851032316
                    </a>
                </div>
            </div>
        </div>
    );
};

const EnquireCard = ({ packageName, packageId, destinationId }: { packageName?: string, packageId?: number, destinationId?: number }) => {
    const buildPlanTripUrl = () => {
        if (!packageName) return '/plan-trip';
        const params = new URLSearchParams();
        params.set('package', packageName);
        if (packageId != null) params.set('packageId', String(packageId));
        if (destinationId != null) params.set('destId', String(destinationId));
        return `/plan-trip?${params.toString()}`;
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 border border-blue-100 shadow-sm flex flex-col gap-4 text-center">
            <h4 className="text-lg font-bold text-gray-900">Custom/Group Travel?</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
                Customize this trip to match your preferences and budget.
            </p>
            <Link to={buildPlanTripUrl()} className="w-full bg-[#0066FF] hover:bg-[#0055D4] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2">
                Enquire Now
                <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
    );
};

const MobileStickyBottomBar = ({
    data,
    activeTierSlug,
    activeTier,
    onBookNow,
}: {
    data: any;
    activeTierSlug: string;
    activeTier: any;
    onBookNow: (persons: number, tierSlug?: string) => void;
}) => {
    const [persons, setPersons] = useState(1);

    const pricePerPerson = computeDynamicPrice(
        data.pax_pricing ?? [],
        activeTierSlug,
        activeTier?.price,
        data.price,
        persons
    );
    const totalPrice = pricePerPerson * persons;

    return (
        <div className="flex xs:flex fixed bottom-0 left-0 right-0 z-[9999] sm:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl p-3 sm:p-4 items-center justify-between gap-2 sm:gap-4 animate-in fade-in slide-in-from-bottom duration-300">
            {/* Price + pax */}
            <div className="flex flex-col flex-shrink-0 gap-0.5">
                <div className="flex items-baseline gap-0.5">
                    <span className="text-lg sm:text-xl font-black text-slate-900">${pricePerPerson.toLocaleString()}</span>
                    <span className="text-[9px] sm:text-[10px] text-slate-500">/pax</span>
                </div>
                {persons > 1 && (
                    <span className="text-[9px] text-slate-500">Total: <strong className="text-slate-800">${totalPrice.toLocaleString()}</strong></span>
                )}
                {/* Mini pax selector */}
                <div className="flex items-center gap-1 mt-0.5">
                    <button
                        type="button"
                        onClick={() => setPersons(p => Math.max(1, p - 1))}
                        disabled={persons <= 1}
                        className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs disabled:opacity-40 cursor-pointer"
                    >−</button>
                    <span className="text-[10px] font-black text-slate-700 w-5 text-center">{persons}</span>
                    <button
                        type="button"
                        onClick={() => setPersons(p => p + 1)}
                        className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs cursor-pointer"
                    >+</button>
                    <span className="text-[9px] text-slate-400 ml-0.5">pax</span>
                </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-grow justify-end max-w-[55%]">
                <button
                    onClick={() => onBookNow(persons, activeTierSlug ?? undefined)}
                    className="flex-grow bg-[#0066FF] text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-wider hover:bg-[#0055D4] transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5"
                >
                    Book Now <ArrowRight size={12} className="sm:w-[13px] sm:h-[13px]" />
                </button>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// SECTION: Group Departures CTA
// ─────────────────────────────────────────────
const GroupDeparturesCta = ({ packageName, packageSlug }: { packageName?: string, packageSlug?: string }) => {
    if (!packageSlug) return null;
    return <ProductDepartureCalendar packageSlug={packageSlug} />;
};

// ─────────────────────────────────────────────
// SECTION: Enquire CTA
// ─────────────────────────────────────────────
const EnquireCta = ({ packageName, packageId, destinationId }: { packageName?: string, packageId?: number, destinationId?: number }) => {
    const buildPlanTripUrl = () => {
        if (!packageName) return '/plan-trip';
        const params = new URLSearchParams();
        params.set('package', packageName);
        if (packageId != null) params.set('packageId', String(packageId));
        if (destinationId != null) params.set('destId', String(destinationId));
        return `/plan-trip?${params.toString()}`;
    };

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 text-center border border-blue-100">
                    <p className="text-lg md:text-xl text-gray-700 mb-4">
                        Looking to customize your trip?{" "}
                        <Link to={buildPlanTripUrl()} className="text-[#0066FF] font-bold hover:text-[#0055D4] inline-flex items-center gap-2 transition-colors group">
                            Enquire Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </p>
                    <p className="text-sm text-gray-500">
                        Our team will help you design a personalized itinerary that
                        matches your preferences and budget.
                    </p>
                </div>
            </div>
        </section>
    );
};

// ─────────────────────────────────────────────
// SECTION: Trek Grading / Difficulty
// ─────────────────────────────────────────────
const TrekGradingSection = ({ data }: { data: any }) => {
    if (!data.difficulty_title) return null;

    const metrics = [
        {
            label: "Physical Fitness",
            value: data.physical_fitness,
            color: "#0066FF",
        },
        {
            label: "Technical Skill",
            value: data.technical_skill,
            color: "#06B6D4",
        },
        {
            label: "Altitude Factor",
            value: data.altitude_factor,
            color: "#8B5CF6",
        },
        { 
            label: "Endurance", 
            value: data.endurance, 
            color: "#0066FF" 
        },
    ].filter(m => m.value !== null && m.value !== undefined);

    const cards = [
        {
            icon: <Activity className="w-8 h-8 text-[#0066FF] mb-4" />,
            title: data.walking_title ?? "Daily Walking",
            desc: data.walking_subtitle,
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-[#8B5CF6] mb-4" />,
            title: data.altitude_title ?? "Max Altitude",
            desc: data.altitude_subtitle,
        },
        {
            icon: <Clock className="w-8 h-8 text-[#06B6D4] mb-4" />,
            title: data.duration_title ?? "Duration",
            desc: data.duration_subtitle ?? data.duration_days,
        },
        {
            icon: <AlertTriangle className="w-8 h-8 text-orange-500 mb-4" />,
            title: data.terrain_title ?? "Terrain",
            desc: data.terrain_subtitle,
        },
    ].filter(c => c.desc);

    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left: metrics */}
                    <div>
                        <span className="text-[#8B5CF6] font-bold tracking-widest text-sm uppercase mb-2 block">
                            {data.difficulty_subtitle}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            {data.difficulty_title}
                        </h2>
                        <p className="text-gray-600 leading-relaxed mb-8">
                            {data.difficulty_description
                                ? stripHtml(data.difficulty_description)
                                : ""}
                        </p>
                        <div className="space-y-6">
                            {metrics.map((m) => (
                                <div key={m.label}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-bold text-gray-700">
                                            {m.label}
                                        </span>
                                        <span className="text-sm text-gray-500">{Math.min(Number(m.value), 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div
                                            className="h-2.5 rounded-full"
                                            style={{
                                                width: `${Math.min(Number(m.value), 100)}%`,
                                                backgroundColor: m.color,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: info cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {cards.map((card) => (
                            <div
                                key={card.title}
                                className="bg-gray-50 p-6 rounded-2xl border border-gray-100"
                            >
                                {card.icon}
                                <h4 className="font-bold text-gray-900 mb-2">{card.title}</h4>
                                <p className="text-sm text-gray-600">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ─────────────────────────────────────────────
// SECTION: Best Time to Visit / Seasons
// ─────────────────────────────────────────────
const SeasonsSection = ({ data }: { data: any }) => {
    const seasons: any[] = (data.seasons ?? []).filter((s: any) => s.season || s.subtitle || s.description);
    if (seasons.length === 0) return null;

    const seasonIcons: Record<string, React.ReactNode> = {
        "Spring (Mar - May)": <Sun className="w-6 h-6" />,
        "Autumn (Sep - Nov)": <CloudRain className="w-6 h-6" />,
        "Winter (Dec - Feb)": <Wind className="w-6 h-6" />,
        "Summer (Jun - Aug)": <Thermometer className="w-6 h-6" />,
    };

    const seasonColors: Record<string, string> = {
        "Spring (Mar - May)": "green",
        "Autumn (Sep - Nov)": "orange",
        "Winter (Dec - Feb)": "blue",
        "Summer (Jun - Aug)": "red",
    };

    // Month highlight logic
    const monthMap: Record<string, number[]> = {
        "Spring (Mar - May)": [2, 3, 4],
        "Autumn (Sep - Nov)": [8, 9, 10],
        "Winter (Dec - Feb)": [11, 0, 1],
        "Summer (Jun - Aug)": [5, 6, 7],
    };
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const bestMonths = new Set<number>(
        seasons.flatMap((s: any) => monthMap[s.season] ?? [])
    );

    return (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-left mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Best Time to Visit
                    </h2>
                    <p className="text-gray-600 max-w-2xl">
                        Choose the perfect season for your trekking adventure.
                    </p>
                </div>

                {/* Season cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {seasons.map((season: any) => {
                        const color = seasonColors[season.season] ?? "blue";
                        return (
                            <div
                                key={season.id}
                                className={`bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-lg transition-shadow`}
                            >
                                <div
                                    className={`absolute top-0 right-0 w-32 h-32 bg-${color}-100 rounded-full -mr-10 -mt-10 opacity-50`}
                                />
                                <div className="flex items-center gap-4 mb-6">
                                    <div
                                        className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center text-${color}-600`}
                                    >
                                        {seasonIcons[season.season] ?? <Sun className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {season.season}
                                        </h3>
                                        <p className={`text-sm text-${color}-600 font-medium`}>
                                            {season.subtitle}
                                        </p>
                                    </div>
                                </div>
                                <ul className="space-y-3 mb-6">
                                    {season.temperature && (
                                        <li className="flex items-center gap-3 text-sm text-gray-600">
                                            <Thermometer className="w-4 h-4 text-gray-400" />
                                            <span>{season.temperature}</span>
                                        </li>
                                    )}
                                    {season.weather && (
                                        <li className="flex items-center gap-3 text-sm text-gray-600">
                                            <Wind className="w-4 h-4 text-gray-400" />
                                            <span>{season.weather}</span>
                                        </li>
                                    )}
                                </ul>
                                {season.description && (
                                    <p
                                        className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4 prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{ __html: season.description }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Month chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 overflow-x-auto">
                    <div className="flex min-w-[600px] justify-between gap-1">
                        {months.map((m, i) => (
                            <div
                                key={m}
                                className={`flex-1 py-3 px-2 rounded-lg text-center text-xs font-bold ${
                                    bestMonths.has(i)
                                        ? "bg-[#0066FF] text-white"
                                        : "bg-gray-200 text-gray-500"
                                }`}
                            >
                                {m}
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-6 justify-center mt-4 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-[#0066FF]" />
                            Best Time
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-gray-200" />
                            Off Season
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ─────────────────────────────────────────────
// SECTION: Useful Information (Accordion)
// ─────────────────────────────────────────────
const UsefulInfoAccordionItem = ({ info, isOpen, onToggle }: { info: any; isOpen: boolean; onToggle: () => void }) => {
    const iconMap: Record<string, React.ReactNode> = {
        "Packing List Essentials": <Briefcase className="w-5 h-5" />,
        "Permits & Documents": <FileText className="w-5 h-5" />,
        "Health & Altitude Sickness": <HeartPulse className="w-5 h-5" />,
        "Travel Insurance": <ShieldCheck className="w-5 h-5" />,
        "Accommodation & Food": <img src={typeof document !== 'undefined' ? (document.querySelector("link[rel*='icon']")?.getAttribute('href') || '/favicon.ico') : '/favicon.ico'} className="w-5 h-5 object-contain" alt="Favicon" />,
    };

    const icon = iconMap[info.title] ?? <Zap className="w-5 h-5" />;

    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
            >
                <div className="flex items-center gap-4">
                    <div
                        className={`p-2 rounded-lg ${isOpen ? "bg-[#0066FF] text-white" : "bg-gray-100 text-gray-500"} transition-colors`}
                    >
                        {icon}
                    </div>
                    <span className={`font-bold text-lg pr-8 transition-colors ${isOpen ? "text-[#0066FF]" : "text-gray-900"}`}>
                        {info.title}
                    </span>
                </div>
                <div
                    className={`p-1 rounded-full transition-colors shrink-0 ${isOpen ? "bg-[#0066FF] text-white" : "bg-gray-100 text-gray-500"}`}
                >
                    {isOpen ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div
                            className="pb-6 px-6 pt-0 text-gray-600 leading-relaxed prose prose-sm max-w-none [&_p:first-of-type]:mt-0 [&>p:last-child]:mb-0"
                            dangerouslySetInnerHTML={{ __html: info.content }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const UsefulInfoSection = ({ data }: { data: any }) => {
    const infos: any[] = (data.useful_infos ?? []).filter((info: any) => info.title || info.content);
    const [openIndices, setOpenIndices] = useState<Record<number, boolean>>({ 0: true });

    if (infos.length === 0) return null;

    const isAllExpanded = infos.length > 0 && infos.every((_, idx) => openIndices[idx]);

    const toggleAll = () => {
        if (isAllExpanded) {
            setOpenIndices({});
        } else {
            const allOpen: Record<number, boolean> = {};
            infos.forEach((_, idx) => {
                allOpen[idx] = true;
            });
            setOpenIndices(allOpen);
        }
    };

    const toggleItem = (idx: number) => {
        setOpenIndices(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    return (
        <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 text-left">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Useful Information
                        </h2>
                        <p className="text-gray-600">Everything you need to know before you go.</p>
                    </div>
                    <div>
                        <button
                            onClick={toggleAll}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#0066FF]/20 bg-white hover:bg-blue-50 text-[#0066FF] text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                        >
                            {isAllExpanded ? "Collapse All" : "Expand All"}
                        </button>
                    </div>
                </div>
                <div className="space-y-4">
                    {infos.map((info: any, idx: number) => (
                        <UsefulInfoAccordionItem
                            key={info.id ?? idx}
                            info={info}
                            isOpen={!!openIndices[idx]}
                            onToggle={() => toggleItem(idx)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const PackingListAccordionItem = ({ item, isOpen, onToggle }: { item: any; isOpen: boolean; onToggle: () => void }) => (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between px-6 py-4 text-left"
        >
            <div className="flex items-center gap-4 pr-4">
                <div className={`p-2 rounded-lg transition-colors w-10 h-10 flex items-center justify-center flex-shrink-0 ${isOpen ? 'bg-[#0066FF] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {item.icon ? (
                        <img
                            src={`${BASE_URL}/${item.icon}`}
                            alt={item.title}
                            className={`w-6 h-6 object-contain ${isOpen ? 'invert' : ''}`}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    ) : (
                        <Briefcase className="w-5 h-5" />
                    )}
                </div>
                <span className={`font-bold text-lg ${isOpen ? 'text-[#0066FF]' : 'text-gray-900'}`}>
                    {item.title}
                </span>
            </div>
            <div className={`p-1 rounded-full transition-colors shrink-0 ${isOpen ? 'bg-[#0066FF] text-white' : 'bg-gray-100 text-gray-500'}`}>
                {isOpen ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div
                        className="pb-6 px-6 text-gray-600 leading-relaxed pt-0 prose prose-sm max-w-none [&_p:first-of-type]:mt-0"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const PackingListSection = ({ data }: { data: any }) => {

    const list: any[] = (data.packing_list ?? []).filter((item: any) => item.title || item.description);
    const [openIndices, setOpenIndices] = useState<Record<number, boolean>>({ 0: true });

    if (list.length === 0) return null;

    const isAllExpanded = list.length > 0 && list.every((_, idx) => openIndices[idx]);

    const toggleAll = () => {
        if (isAllExpanded) {
            setOpenIndices({});
        } else {
            const allOpen: Record<number, boolean> = {};
            list.forEach((_, idx) => { allOpen[idx] = true; });
            setOpenIndices(allOpen);
        }
    };

    const toggleItem = (idx: number) => {
        setOpenIndices(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    return (
        <section id="section-packing-list" className="py-20 bg-gray-50">
            <div className="max-w-3xl mx-auto px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 text-left">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Packing List
                        </h2>
                        <p className="text-gray-600">
                            Everything you need for {data.title}.
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={toggleAll}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#0066FF]/20 bg-white hover:bg-blue-50 text-[#0066FF] text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                        >
                            {isAllExpanded ? 'Collapse All' : 'Expand All'}
                        </button>
                    </div>
                </div>
                <div className="space-y-4">
                    {list.map((item: any, idx: number) => (
                        <PackingListAccordionItem
                            key={idx}
                            item={item}
                            isOpen={!!openIndices[idx]}
                            onToggle={() => toggleItem(idx)}
                        />
                    ))}
                </div>
                {data.packing_list_note && (
                    <div className="mt-8 p-6 bg-white border border-gray-200 rounded-2xl text-gray-700 leading-relaxed text-sm shadow-sm">
                        <div dangerouslySetInnerHTML={{ __html: data.packing_list_note }} />
                    </div>
                )}
            </div>
        </section>
    );
};

// ─────────────────────────────────────────────
// SECTION: Add-ons
// ─────────────────────────────────────────────
const AddonsSection = ({ data }: { data: any }) => {
    const addons = data.active_addon_packages || data.activeAddonPackages || [];
    if (!addons || addons.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50 border-y border-gray-100">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-left mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Optional Add-ons & Upgrades
                    </h2>
                    <p className="text-gray-600 max-w-2xl text-sm">
                        Customize your journey with these optional addon services and equipment rentals. You can select these options during booking.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {addons.map((addon: any) => {
                        const hasImages = addon.images && addon.images.length > 0;
                        return (
                            <div
                                key={addon.id}
                                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow"
                            >
                                {hasImages && (
                                    <div className="w-full md:w-48 h-36 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 relative">
                                        <img
                                            src={`${BASE_URL}/${addon.images[0].url.replace(/^\//, '')}`}
                                            alt={addon.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                        {addon.badge && (
                                            <span className="absolute top-3 left-3 bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                {addon.badge}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <div className="flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <h3 className="text-lg font-bold text-gray-900">{addon.name}</h3>
                                            {!hasImages && addon.badge && (
                                                <span className="bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                    {addon.badge}
                                                </span>
                                            )}
                                            {addon.short_label && (
                                                <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-semibold">
                                                    {addon.short_label}
                                                </span>
                                            )}
                                        </div>
                                        {addon.description && (
                                            <p className="text-xs text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                                                {addon.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                                        <div>
                                            <span className="text-[10px] text-gray-400 block font-medium">Price</span>
                                            <span className="text-lg font-extrabold text-[#0066FF]">
                                                ${parseFloat(addon.price).toFixed(2)}
                                            </span>
                                        </div>
                                        {addon.active_items && addon.active_items.length > 0 && (
                                            <div className="text-right">
                                                <span className="text-[10px] text-gray-400 block font-medium">Includes</span>
                                                <span className="text-[11px] font-semibold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 inline-block mt-0.5">
                                                    {addon.active_items.length} options available
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

// ─────────────────────────────────────────────
// SECTION: Sticky Tab Navigation
// ─────────────────────────────────────────────
const TABS = [
    { id: "section-overview",    label: "Overview",    icon: Eye },
    { id: "section-itinerary",   label: "Itinerary",   icon: List },
    { id: "section-include-exclude",        label: "Includes/Excludes",        icon: ClipboardList },
    { id: "section-departures",  label: "Availability", icon: CalendarDays },
    { id: "section-map",         label: "Trip Map",    icon: MapPin },
    { id: "section-useful-info", label: "Useful Info", icon: Briefcase },
    { id: "section-packing-list",label: "Packing List",icon: Backpack },
    { id: "section-faq",         label: "FAQs",        icon: HelpCircle },
] as const;

const StickyTabNav = ({ packageSlug, packageData }: { packageSlug: string; packageData: any }) => {
    const visibleTabs = TABS.filter(tab => {
        if (tab.id === "section-overview") {
            return !!packageData?.experience;
        }
        if (tab.id === "section-itinerary") {
            return (packageData?.itineraries ?? []).filter((it: any) => it.title || it.day || it.description).length > 0;
        }
        if (tab.id === "section-include-exclude") {
            return !!packageData?.price || 
                   (packageData?.includes ?? []).some((i: any) => i.title) || 
                   (packageData?.excludes ?? []).some((e: any) => e.title) || 
                   (packageData?.addons ?? []).some((a: any) => a.title) || 
                   (packageData?.package_tiers ?? []).some((t: any) => t.name);
        }
        if (tab.id === "section-departures") {
            return !!packageSlug;
        }
        if (tab.id === "section-map") {
            return !!packageData?.map_image;
        }
        if (tab.id === "section-useful-info") {
            return (packageData?.useful_infos ?? []).some((info: any) => info.title || info.content);
        }
        if (tab.id === "section-packing-list") {
            return (packageData?.packing_list ?? []).filter((item: any) => item.title || item.description).length > 0;
        }
        if (tab.id === "section-faq") {
            return (packageData?.faqs ?? []).some((faq: any) => faq.question || faq.answer);
        }
        return true;
    });

    const [activeId, setActiveId] = useState<string>(visibleTabs[0]?.id ?? TABS[0].id);
    const [isStuck, setIsStuck] = useState(false);
    const [showBookBtn, setShowBookBtn] = useState(false);
    const [hasPassedOverview, setHasPassedOverview] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const scrollerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Don't render nav at all until user scrolls past #section-overview
    useEffect(() => {
        const overviewEl = document.getElementById('section-overview');
        if (!overviewEl) {
            // If no overview section exists, show nav after a short scroll
            const fallbackObs = new IntersectionObserver(
                ([entry]) => { if (!entry.isIntersecting) setHasPassedOverview(true); },
                { threshold: 0, rootMargin: '-90px 0px 0px 0px' }
            );
            if (sentinelRef.current) fallbackObs.observe(sentinelRef.current);
            return () => fallbackObs.disconnect();
        }
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    setHasPassedOverview(true);
                    obs.disconnect(); // fire once, then stop
                }
            },
            { threshold: 0, rootMargin: '0px 0px 0px 0px' }
        );
        obs.observe(overviewEl);
        return () => obs.disconnect();
    }, []);

    // Detect when bar sticks to top (hide when in banner)
    useEffect(() => {
        const handleScroll = () => {
            const heroEl = document.getElementById('hero-banner');
            const heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;
            // Hide the bar when we are back in the banner (scroll position less than banner height minus navbar)
            const scrolledPastHero = window.scrollY > (heroHeight - 90);
            setIsStuck(scrolledPastHero);
            setShowBookBtn(scrolledPastHero);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Highlight active section via IntersectionObserver
    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        const sectionMap = new Map<string, number>();

        visibleTabs.forEach(tab => {
            const el = document.getElementById(tab.id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    sectionMap.set(tab.id, entry.intersectionRatio);
                    // Pick whichever visible section has the highest ratio
                    let bestId = activeId;
                    let bestRatio = -1;
                    sectionMap.forEach((ratio, id) => {
                        if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
                    });
                    if (bestRatio > 0) setActiveId(bestId);
                },
                { threshold: [0, 0.1, 0.25, 0.5], rootMargin: '-90px 0px -30% 0px' }
            );
            obs.observe(el);
            observers.push(obs);
        });
        return () => observers.forEach(o => o.disconnect());
    }, [visibleTabs]);

    // Scroll active tab into view in the tab bar
    useEffect(() => {
        if (!scrollerRef.current) return;
        const activeBtn = scrollerRef.current.querySelector(`[data-tabid="${activeId}"]`) as HTMLElement;
        if (activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [activeId]);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        const navHeight = 90;
        const tabHeight = navRef.current?.offsetHeight ?? 52;
        const y = el.getBoundingClientRect().top + window.scrollY - navHeight - tabHeight - 8;
        window.scrollTo({ top: y, behavior: 'smooth' });
        setActiveId(id);
    };

    return (
        <>
            {/* Sentinel — sits right below the hero banner */}
            <div ref={sentinelRef} style={{ height: 1 }} />

            {/* Nav bar — only rendered after user scrolls past Overview section */}
            {hasPassedOverview && <div
                ref={navRef}
                className={`z-40 w-full transition-all duration-300 fixed top-[84px] left-0 right-0 shadow-xl z-[99999] border-t border-gray-300 ${
                    isStuck
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
                style={{
                    background: 'rgba(239,246,255,0.97)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(0,102,255,0.12)',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2">
                    {/* Scrollable tab list */}
                    <div
                        ref={scrollerRef}
                        className="flex items-center gap-1 overflow-x-auto scrollbar-hide justify-start md:justify-center flex-1 py-2"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {visibleTabs.map(tab => {
                            const Icon = tab.icon;
                            const isActive = activeId === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    data-tabid={tab.id}
                                    onClick={() => scrollToSection(tab.id)}
                                    className={`
                                        relative flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold
                                        transition-all duration-200 whitespace-nowrap cursor-pointer select-none 
                                        ${
                                            isActive
                                                ? 'bg-[#0066FF] text-white shadow-md shadow-blue-200'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }
                                    `}
                                >
                                    <Icon size={13} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                   
                </div>
            </div>}
        </>
    );
};


// ─────────────────────────────────────────────
// SECTION: FAQs (Accordion)
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// SECTION: Reviews
// ─────────────────────────────────────────────
const ReviewCard = ({ review }: { review: any }) => {
    const [expanded, setExpanded] = useState(false);
    const cleanText = review.review?.replace(/<[^>]*>/g, "") ?? "";
    const needsTruncation = cleanText.length > 250;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100 relative flex flex-col h-full"
        >
            <Quote className="absolute top-5 right-5 text-blue-100" size={40} />

            {/* Stars */}
            <div className="flex gap-1 mb-4">
                {[...Array(Math.min(review.rating ?? 5, 5))].map((_, i) => (
                    <Star key={i} size={16} className="fill-[#FFD700] text-[#FFD700]" />
                ))}
            </div>

            {/* Review text */}
            <div className="flex-1">
                {needsTruncation && !expanded ? (
                    <p className="text-gray-700 italic mb-4 leading-relaxed text-sm">
                        {cleanText.slice(0, 250)}{"..."}{" "}
                        <button
                            onClick={() => setExpanded(true)}
                            className="text-blue-600 hover:text-blue-700 underline font-semibold ml-1 cursor-pointer bg-transparent border-none p-0 inline"
                        >
                            see more
                        </button>
                    </p>
                ) : (
                    <p className="text-gray-700 italic mb-4 leading-relaxed text-sm">
                        <span dangerouslySetInnerHTML={{ __html: review.review }} />
                        {needsTruncation && (
                            <button
                                onClick={() => setExpanded(false)}
                                className="text-blue-600 hover:text-blue-700 underline font-semibold ml-2 cursor-pointer bg-transparent border-none p-0 inline"
                            >
                                show less
                            </button>
                        )}
                    </p>
                )}
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {review.name?.charAt(0) ?? "?"}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                    <p className="text-xs text-gray-500">{review.country || review.designation}</p>
                </div>
            </div>
        </motion.div>
    );
};

const ReviewsSection = ({ data }: { data: any }) => {
    const reviews: any[] = (data.reviews ?? []).filter((r: any) => r.name && r.review);
 
    return (
      reviews.length > 0 ? 
        <section id="section-reviews" className="py-12 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-left mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-widest uppercase text-[#0066FF] bg-blue-50 rounded-full mb-5">
                        <MessageSquare size={13} /> Traveler Reviews
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        What Our Clients Say
                    </h2>
                    <p className="text-gray-500 max-w-xl text-sm">
                        Real experiences from adventurers who completed this journey.
                    </p>

                 </div>

                {/* Reviews Grid or Empty State */}
                
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((review: any, idx: number) => (
                            <ReviewCard key={review.id ?? idx} review={review} />
                        ))}
                    </div>
               
            </div>
        </section>
        
        :
        <></>
    );
};

const FaqAccordionItem = ({ faq, isOpen, onToggle }: { faq: any; isOpen: boolean; onToggle: () => void }) => (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between px-6 py-4 text-left"
        >
            <span
                className={`font-bold text-lg pr-8 ${isOpen ? "text-[#0066FF]" : "text-gray-900"}`}
            >
                {faq.question}
            </span>
            <div
                className={`p-1 rounded-full transition-colors shrink-0 ${isOpen ? "bg-[#0066FF] text-white" : "bg-gray-100 text-gray-500"}`}
            >
                {isOpen ? <X className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <div
                        className="pb-6 px-6 text-gray-600 leading-relaxed pt-0 prose prose-sm max-w-none [&_p:first-of-type]:mt-0"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const FaqSection = ({ data }: { data: any }) => {
    const faqs: any[] = (data.faqs ?? []).filter((faq: any) => faq.question || faq.answer);
    const [openIndices, setOpenIndices] = useState<Record<number, boolean>>({ 0: true });

    if (faqs.length === 0) return null;

    const isAllExpanded = faqs.length > 0 && faqs.every((_, idx) => openIndices[idx]);

    const toggleAll = () => {
        if (isAllExpanded) {
            setOpenIndices({});
        } else {
            const allOpen: Record<number, boolean> = {};
            faqs.forEach((_, idx) => {
                allOpen[idx] = true;
            });
            setOpenIndices(allOpen);
        }
    };

    const toggleItem = (idx: number) => {
        setOpenIndices(prev => ({
            ...prev,
            [idx]: !prev[idx]
        }));
    };

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-3xl mx-auto px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 text-left">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-600">
                            Common questions about your trek.
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={toggleAll}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#0066FF]/20 bg-white hover:bg-blue-50 text-[#0066FF] text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
                        >
                            {isAllExpanded ? "Collapse All" : "Expand All"}
                        </button>
                    </div>
                </div>
                <div className="space-y-4">
                    {faqs.map((faq: any, idx: number) => (
                        <FaqAccordionItem
                            key={faq.id ?? idx}
                            faq={faq}
                            isOpen={!!openIndices[idx]}
                            onToggle={() => toggleItem(idx)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

// ─────────────────────────────────────────────
// SECTION: Trek Map
// ─────────────────────────────────────────────
const MapSection = ({ data }: { data: any }) => {
    const [lightbox, setLightbox] = useState(false);
    if (!data.map_image) return null;

    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-left mb-12">
                    <span className="inline-block px-4 py-1 text-xs font-bold tracking-widest uppercase text-[#0066FF] bg-blue-50 rounded-full mb-4">
                        Route Overview
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Route Map
                    </h2>
                    <p className="text-gray-500 max-w-xl">
                        Explore the trail map to understand the terrain, elevation changes, and key waypoints of your trek.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative group rounded-3xl overflow-hidden shadow-2xl border border-gray-100 cursor-zoom-in"
                    onClick={() => setLightbox(true)}
                >
                    <img
                        src={`${BASE_URL}/${data.map_image}`}
                        alt={`${data.title} route map`}
                        className="w-full h-auto max-h-[400px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-[#0066FF]/0 group-hover:bg-[#0066FF]/10 transition-colors duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-bold text-[#0066FF] shadow-lg">
                            Click to enlarge
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999999999] bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setLightbox(false)}
                    >
                        <motion.img
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            src={`${BASE_URL}/${data.map_image}`}
                            alt={`${data.title} route map`}
                            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        />
                        <button
                            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                            onClick={() => setLightbox(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};



// ─────────────────────────────────────────────
function ProductSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <div className="dc-skeleton h-[85vh] w-full" />
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-12">
                            <div className="dc-skeleton dc-skeleton-title w-3/4 h-12" />
                            <div className="flex gap-4">
                                <div className="dc-skeleton dc-skeleton-tag" />
                                <div className="dc-skeleton dc-skeleton-tag" />
                                <div className="dc-skeleton dc-skeleton-tag" />
                            </div>
                            <div className="space-y-6">
                                <div className="dc-skeleton dc-skeleton-row" />
                                <div className="dc-skeleton dc-skeleton-row" />
                                <div className="dc-skeleton dc-skeleton-row w-2/3" />
                            </div>
                            <div className="dc-skeleton h-[500px] rounded-3xl" />
                        </div>
                        <div className="lg:col-span-1 space-y-8">
                            <div className="dc-skeleton h-96 rounded-3xl" />
                            <div className="dc-skeleton h-64 rounded-3xl" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

// ─────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────
export const ProductSlugPage = memo(() => {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const paymentStatus = searchParams.get('payment');

    const navigate = useNavigate();
    const [packageData, setPackageData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [activeTierIdx, setActiveTierIdx] = useState(0);
    const [showPricingTable, setShowPricingTable] = useState(false);
    const { toggleWishlist: togglePageWishlist, isInWishlist } = useWishlist();

    const fetchPackageDetails = async () => {
        setLoading(true);
        try {
            const data = await fetchData("/package/" + slug);
            setPackageData(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load package data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackageDetails();
    }, [slug]);

    useEffect(() => {
        if (packageData) {
            const raw = (packageData.package_tiers ?? []).filter((t: any) => t.name);
            const t = raw.length > 0 ? raw : [{
                name: 'Standard Package',
                price: packageData.price,
                description: 'Best value, fully guided'
            }];
            const stdIdx = t.findIndex((item: any) => item.name?.toLowerCase().includes('standard'));
            setActiveTierIdx(stdIdx !== -1 ? stdIdx : 0);
        }
    }, [packageData]);

    if (loading) {
        return <ProductSkeleton />;
    }

    if (error || !packageData) {
        return <NotFoundPage />;
    }

    const rawTiers: any[] = (packageData?.package_tiers ?? []).filter((t: any) => t.name);
    const hasTiers = rawTiers.length > 0;
    const tiers: any[] = hasTiers ? rawTiers : [{
        name: 'Standard Package',
        price: packageData.price,
        description: 'Best value, fully guided'
    }];

    const activeTier = tiers[activeTierIdx] || tiers[0];
    // When no real tiers, use 'default' as slug to match backend pax_pricing sentinel
    const activeTierSlug = hasTiers
        ? (activeTier?.slug ?? activeTier?.name?.toLowerCase().replace(/\s+/g, '-') ?? '')
        : 'default';
    const activePrice = activeTier?.price ?? packageData.price;
    const activeName = activeTier?.name ?? '';
    const activeDesc = activeTier?.description ?? null;

    const allIncludes = (packageData?.includes ?? []).filter((item: any) => item.title);
    const allExcludes = (packageData?.excludes ?? []).filter((item: any) => item.title);
    const allAddons = (packageData?.addons ?? []).filter((item: any) => item.title);

    const getItemsForTier = (tierSlug: string | null) => {
        if (!tierSlug) {
            return {
                inc: allIncludes.filter((i: any) => !i.tier),
                exc: allExcludes.filter((e: any) => !e.tier),
            };
        }
        const tierInc = allIncludes.filter((i: any) => i.tier === tierSlug);
        const tierExc = allExcludes.filter((e: any) => e.tier === tierSlug);
        return {
            inc: tierInc.length > 0 ? tierInc : allIncludes.filter((i: any) => !i.tier),
            exc: tierExc.length > 0 ? tierExc : allExcludes.filter((e: any) => !e.tier),
        };
    };

    const { inc: activeIncludes, exc: activeExcludes } = getItemsForTier(activeTierSlug);
    const tierAddons = activeTierSlug ? allAddons.filter((a: any) => a.tier === activeTierSlug) : [];
    const activeAddons = tierAddons.length > 0 ? tierAddons : allAddons.filter((a: any) => !a.tier);

    const hasIncExc = activeIncludes.length > 0 || activeExcludes.length > 0;
    const hasDetails = hasIncExc || activeAddons.length > 0;

    const previousTier = activeTierIdx > 0 ? tiers[activeTierIdx - 1] : null;
    const cleanName = (name: string) => name.replace(/\s*package\s*/i, "").trim();
    const prevName = previousTier ? cleanName(previousTier.name) : "";

    const showCostSection = !!(packageData.price || allIncludes.length > 0 || allExcludes.length > 0 || allAddons.length > 0 || rawTiers.length > 0);

    return (
        <div className="min-h-screen font-sans text-gray-900 bg-white">
            <Seo
                seoMeta={packageData?.seo_meta}
                fallbackTitle={packageData?.title}
                fallbackDescription={packageData?.description ? String(packageData.description).replace(/<[^>]*>/g, '').slice(0, 160) : undefined}
                fallbackImage={packageData?.banner_image}
                canonicalPath={`/${packageData?.slug}`}
                type="Product"
                tripData={packageData}
            />
            <Navbar />
            <main
                className="w-full min-h-screen bg-white selection:bg-[#06B6D4] selection:text-white font-sans pb-24 lg:pb-0"
            >
                {paymentStatus && (
                    <div className={`w-full p-4 flex justify-center items-center text-white ${paymentStatus === 'success' ? 'bg-green-600' : paymentStatus === 'failed' ? 'bg-red-600' : 'bg-yellow-600'}`}>
                        {paymentStatus === 'success' && <div className="flex items-center gap-2"><Check className="w-5 h-5" /> <strong>Payment Successful!</strong> Your booking is confirmed.</div>}
                        {paymentStatus === 'failed' && <div className="flex items-center gap-2"><X className="w-5 h-5" /> <strong>Payment Failed!</strong> Your booking could not be completed at this time.</div>}
                        {paymentStatus === 'cancelled' && <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> <strong>Payment Cancelled!</strong> Please try again when you are ready.</div>}
                    </div>
                )}
                <HeroBanner
                    data={packageData}
                    isFavorite={isInWishlist(packageData.id)}
                    onToggleWishlist={() => togglePageWishlist(packageData)}
                />
                
                
                
                <StickyTabNav packageSlug={packageData.slug} packageData={packageData} />
                
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Left Column: All details */}
                        <div className="lg:col-span-2 space-y-12">
                            <div className="space-y-6">
                                {packageData.main_content && (
                                    <div
                                        className="prose prose-lg prose-gray text-gray-600 leading-relaxed max-w-none"
                                        dangerouslySetInnerHTML={{ __html: packageData.main_content }}
                                    />
                                )}
                                {packageData.quick_summary && (
                                    <div className="p-5 bg-[#EEF4FF] rounded-xl shadow-sm">
                                        {packageData.quick_summary_title && <span className="text-[#0066FF] font-black text-sm uppercase tracking-widest flex-shrink-0 mt-0.5 mb-2 block">
                                            {packageData.quick_summary_title}
                                        </span>}
                                        <div className="text-gray-700 text-sm leading-relaxed prose prose-slate max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0" dangerouslySetInnerHTML={{ __html: packageData.quick_summary }} />
                                    </div>
                                )}
                                <div id="section-overview">
                                    <ExperienceSection data={packageData} />
                                </div>
                            </div>
                            <div id="section-itinerary">
                                <ItinerarySection data={packageData} />
                            </div>
                            
                            {showCostSection && (
                                <div id="section-include-exclude">
                                    <CostDetailsPanel
                                        data={packageData}
                                        activeIncludes={activeIncludes}
                                        activeExcludes={activeExcludes}
                                        activeAddons={activeAddons}
                                        activeName={activeName}
                                        activeDesc={activeDesc}
                                        prevName={prevName}
                                        hasDetails={hasDetails}
                                        hasIncExc={hasIncExc}
                                    />
                                </div>
                            )}
                            
                            <div id="section-departures">
                                <GroupDeparturesCta packageName={packageData.title} packageSlug={packageData.slug} />
                            </div>
                            
                            <TrekGradingSection data={packageData} />
                            <SeasonsSection data={packageData} />
                            
                            <div id="section-map">
                                <MapSection data={packageData} />
                            </div>
                            
                            <ReviewsSection data={packageData} />
                            
                            <div id="section-useful-info">
                                <UsefulInfoSection data={packageData} />
                            </div>
                            
                            <div id="section-packing-list">
                                <PackingListSection data={packageData} />
                            </div>
                            
                            <div id="section-faq">
                                <FaqSection data={packageData} />
                            </div>
                        </div>

                        {/* Right Column: Sticky Pricing & Enquire */}
                        <div className="lg:col-span-1 lg:sticky lg:top-[160px] space-y-6 order-first lg:order-last">
                            {showCostSection && (
                                <PriceTierSelectorCard
                                    data={packageData}
                                    tiers={tiers}
                                    activeTierIdx={activeTierIdx}
                                    setActiveTierIdx={setActiveTierIdx}
                                    showPricingTable={showPricingTable}
                                    setShowPricingTable={setShowPricingTable}
                                    activeTierSlug={activeTierSlug}
                                    onBookNow={(p, tierSlug) => {
                                        const params = new URLSearchParams({ pax: String(p) });
                                        if (tierSlug) params.set('tier', tierSlug);
                                        navigate(`/book/${packageData.slug}?${params.toString()}`);
                                    }}
                                    hasTiers={hasTiers}
                                />
                            )}
                            
                            {/* <div id="enquire-section">
                                <EnquireCard
                                    packageName={packageData.title}
                                    packageId={packageData.id}
                                    destinationId={packageData.destination_id}
                                />
                            </div> */}
                        </div>
                    </div>
                </div>
                
                {showCostSection && (
                    <MobileStickyBottomBar
                        data={packageData}
                        activeTierSlug={activeTierSlug}
                        activeTier={activeTier}
                        onBookNow={(p, tierSlug) => {
                            const params = new URLSearchParams({ pax: String(p) });
                            if (tierSlug) params.set('tier', tierSlug);
                            navigate(`/book/${packageData.slug}?${params.toString()}`);
                        }}
                    />
                )}
            </main>
            <Footer />
           
        </div>
    );
});
