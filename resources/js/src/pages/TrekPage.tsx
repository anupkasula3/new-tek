import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FAQ } from '../components/FAQ';
import { Seo } from '../components/Seo';
import { TripsGrid } from '../components/TripsGrid';
import { SectionHeading } from '../components/ui/SectionHeading';
import { Button } from '../components/ui/Button';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Calendar, FileText, Plane, Info, Mountain, Map, Users, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchData } from "../axiosHook";
import BASE_URL from '../../src/global';

function TrekSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                <div className="dc-skeleton h-[60vh] min-h-[500px]" />
                <section className="py-24 max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <div className="dc-skeleton dc-skeleton-title w-3/4 h-12" />
                            <div className="space-y-4">
                                <div className="dc-skeleton dc-skeleton-row" />
                                <div className="dc-skeleton dc-skeleton-row" />
                                <div className="dc-skeleton dc-skeleton-row w-5/6" />
                            </div>
                        </div>
                        <div className="dc-skeleton h-[500px] rounded-[48px]" />
                    </div>
                </section>
                <section className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="dc-skeleton h-[450px] rounded-3xl" />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export function TrekPage() {
    const { slug } = useParams();
    const [trek, setTrek] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeGuide, setActiveGuide] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrekData = async () => {
            setLoading(true);
            try {
                const res = await fetchData("/trek/" + slug);
                setTrek(res);
            } catch (err) {
                console.error(err);
                setError("Failed to load region data.");
            } finally {
                setLoading(false);
            }
        };
        fetchTrekData();
    }, [slug]);

    const guides = [
        { id: 'best-time', title: 'Best Time to Visit', icon: Calendar },
        { id: 'permits', title: 'Permits & Fees', icon: FileText },
        { id: 'flights', title: 'Flights Information', icon: Plane }
    ];

    const hasGuideContent = (guideId: string) => {
        const info = trek?.essential_info;

        switch (guideId) {
            case "best-time":
                return Boolean(info?.best_time_to_visit?.title && info?.best_time_to_visit?.items?.length);
            case "permits":
                return Boolean(info?.permits_and_fees?.title && info?.permits_and_fees?.items?.length);
            case "flights":
                return Boolean(info?.flights?.title && (info?.flights?.contents || info?.flights?.tips));
            default:
                return false;
        }
    };

    const renderGuideContent = (guideId: string) => {
        if (!hasGuideContent(guideId)) return null;

        const best_time_to_visit = trek?.essential_info?.best_time_to_visit;
        const permits_and_fees = trek?.essential_info?.permits_and_fees;
        const flights = trek?.essential_info?.flights;

        switch (guideId) {
            case "best-time":
                return (
                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        {best_time_to_visit?.items?.map((item: any, idx: number) => (
                            <div key={idx} className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-[#0066FF] mt-1 shrink-0">
                                        {item.icon ? (
                                            <img
                                                src={`${BASE_URL}/${item.icon}`}
                                                alt={item.season}
                                                className="w-6 h-6 object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <Calendar size={20} />
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">
                                            {item.season}
                                        </h4>
                                        <div
                                            className="text-gray-600 mt-1 prose prose-sm"
                                            dangerouslySetInnerHTML={{
                                                __html: item.description,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {best_time_to_visit?.off_season_considerations && (
                            <div className="md:col-span-2 bg-gray-50 p-6 rounded-xl border border-gray-100 mt-4">
                                <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                    <Info size={18} className="text-gray-500" />
                                    Off-Season Considerations
                                </h4>
                                <div 
                                    className="text-gray-600 text-sm prose prose-sm"
                                    dangerouslySetInnerHTML={{
                                        __html: best_time_to_visit.off_season_considerations,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                );

            case "permits":
                return (
                    <div className="space-y-6 text-left">
                        {permits_and_fees?.title && (
                            <p className="text-gray-600 font-medium">
                                {permits_and_fees.title}
                            </p>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            {permits_and_fees?.items?.map((item: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        {item.icon ? (
                                            <img
                                                src={`${BASE_URL}/${item.icon}`}
                                                alt={item.label}
                                                className="w-6 h-6 object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <FileText className="text-[#0066FF]" size={24} />
                                        )}

                                        <h4 className="font-bold text-gray-900 text-lg">
                                            {item.label}
                                        </h4>
                                    </div>

                                    <div
                                        className="text-gray-600 text-sm mb-4 prose prose-sm"
                                        dangerouslySetInnerHTML={{
                                            __html: item.content,
                                        }}
                                    />

                                    {item.cost && (
                                        <div className="font-semibold text-gray-900">
                                            {item.cost}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {permits_and_fees?.note && (
                            <div 
                                className="text-sm text-gray-500 italic prose prose-sm"
                                dangerouslySetInnerHTML={{
                                    __html: permits_and_fees.note,
                                }}
                            />
                        )}
                    </div>
                );

            case "flights":
                return (
                    <div className="space-y-6 text-left">
                        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 items-start">
                            <div className="col-span-4">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    {flights?.icon ? (
                                        <img
                                            src={`${BASE_URL}/${flights.icon}`}
                                            alt={flights.title || "Flights"}
                                            className="w-6 h-6 object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <Plane className="text-[#0066FF]" />
                                    )}
                                    {flights?.title || "Flights Information"}
                                </h3>

                                {flights?.contents && (
                                    <div
                                        className="text-gray-600 mb-4 leading-relaxed prose prose-sm"
                                        dangerouslySetInnerHTML={{
                                            __html: flights.contents,
                                        }}
                                    />
                                )}
                            </div>

                            {flights?.tips && (
                                <div className="col-span-2 bg-gray-50 border border-gray-100 p-6 rounded-xl">
                                    <h4 className="font-bold text-gray-900 mb-4">
                                        Flight Tips
                                    </h4>
                                    <div
                                        className="text-blue-800 text-sm prose prose-sm"
                                        dangerouslySetInnerHTML={{
                                            __html: flights.tips,
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading) return <TrekSkeleton />;
    if (error || !trek) return <div className="flex items-center justify-center min-h-screen text-red-500"><p>{error || "Region data not available."}</p></div>;

    return (
        <div className="min-h-screen bg-white font-sans">
            <Seo
                seoMeta={trek?.seo_meta}
                fallbackTitle={trek?.name}
                fallbackDescription={trek?.description}
                fallbackImage={trek?.banner_image}
                canonicalPath={`/trekking/${trek?.slug}`}
                type="TouristAttraction"
                faqs={trek?.faq}
            />
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src={trek.banner_image ? `${BASE_URL}/${trek.banner_image}` : "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2070&q=80"} 
                        alt={trek.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase"
                    >
                        {trek.name}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-stone-100 font-medium max-w-2xl mx-auto italic"
                    >
                        Explore the wonders of {trek.region}
                    </motion.p>
                </div>
            </div>

            {/* Overview Section */}
            <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-12 gap-16 items-center">
                    {(trek.description || !trek.banner_image) && (
                        <div className={`${trek.banner_image ? "md:col-span-7" : "md:col-span-12"} space-y-8`}>
                            <div>
                                <span className="text-[#0066FF] font-black text-sm uppercase tracking-[0.2em] mb-4 block">Regional Overview</span>
                                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight">The Gateway to Adventure</h2>
                            </div>
                            {trek.description && (
                                <div 
                                    className="text-lg text-stone-600 leading-relaxed space-y-6 prose prose-stone max-w-none"
                                    dangerouslySetInnerHTML={{ __html: trek.description }}
                                />
                            )}
                            <div className="flex flex-wrap gap-4 pt-6">
                                {/* Tags removed as they are no longer in the Trek model */}
                            </div>
                        </div>
                    )}
                    {trek.banner_image && (
                        <div className={`${trek.description ? "md:col-span-5" : "md:col-span-12"}`}>
                            <div className="relative">
                                <div className="aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl border-8 border-white">
                                    <img src={`${BASE_URL}/${trek.banner_image}`} alt={trek.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-8 -right-8 bg-[#0066FF] p-8 rounded-[32px] shadow-xl max-w-xs text-white">
                                    <p className="font-medium italic text-lg leading-snug">
                                        "Your journey of a lifetime begins in the heart of the mountains."
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Trips Grid */}
            <section className="bg-gray-50 py-24 px-4 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter">Available Packages</h2>
                        <p className="text-gray-500 font-medium">Choose from our hand-picked trekking experiences</p>
                    </div>
                    <TripsGrid trips={trek.packages.map((pkg: any) => ({
                        ...pkg,
                        image: pkg.featured_image ? `${BASE_URL}/${pkg.featured_image}` : "/default-trek.jpg",
                        name: pkg.title,
                        trek_duration: `${pkg.duration_days} Days`,
                        trek_level: pkg.difficulty,
                        cost: `$${pkg.price}`
                    }))} />
                </div>
            </section>

            {/* Essential Information */}
            {(hasGuideContent("best-time") || hasGuideContent("permits") || hasGuideContent("flights")) && (
                <section className="py-24 px-4 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter">Essential Information</h2>
                        <p className="text-gray-500 font-medium">Everything you need to know to plan your visit</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {guides.map((guide, index: number) => {
                            const available = hasGuideContent(guide.id);

                            // Get the custom database title if set
                            let displayTitle = guide.title;
                            const info = trek?.essential_info;
                            if (guide.id === "best-time" && info?.best_time_to_visit?.title) {
                                displayTitle = info.best_time_to_visit.title;
                            } else if (guide.id === "permits" && info?.permits_and_fees?.title) {
                                displayTitle = info.permits_and_fees.title;
                            } else if (guide.id === "flights" && info?.flights?.title) {
                                displayTitle = info.flights.title;
                            }

                            return (
                                <motion.button 
                                    key={index} 
                                    disabled={!available}
                                    onClick={() => {
                                        if (!available) return;
                                        setActiveGuide(activeGuide === guide.id ? null : guide.id);
                                    }}
                                    whileHover={available ? { scale: 1.02 } : undefined}
                                    whileTap={available ? { scale: 0.98 } : undefined}
                                    className={`group relative bg-white border-2 rounded-[32px] p-8 text-left transition-all duration-300 ${
                                        !available
                                            ? 'opacity-40 cursor-not-allowed border-gray-100'
                                            : activeGuide === guide.id
                                                ? 'border-[#0066FF] shadow-xl shadow-blue-500/10'
                                                : 'border-gray-100 hover:border-gray-200 hover:shadow-lg'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`p-4 rounded-2xl transition-colors ${activeGuide === guide.id ? 'bg-blue-50 text-[#0066FF]' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'}`}>
                                            <guide.icon size={32} />
                                        </div>
                                        {available && <ArrowRight size={24} className={`transition-all ${activeGuide === guide.id ? 'text-[#0066FF] translate-x-1' : 'text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1'}`} />}
                                    </div>
                                    <h3 className={`text-2xl font-black ${activeGuide === guide.id ? 'text-[#0066FF]' : 'text-gray-900'} tracking-tight`}>
                                        {displayTitle}
                                    </h3>
                                </motion.button>
                            );
                        })}
                    </div>

                    <AnimatePresence>
                        {activeGuide && hasGuideContent(activeGuide) && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-gray-50 border border-gray-100 rounded-[40px] p-12 mb-12">
                                    {renderGuideContent(activeGuide)}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>
            )}

            <Footer />
        </div>
    );
}
