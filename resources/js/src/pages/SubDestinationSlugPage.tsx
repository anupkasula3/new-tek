import {
    ArrowRight,
    Calendar,
    Clock,
    DollarSign,
    FileText,
    Info,
    Map,
    Mountain,
    Plane,
    ThermometerSun,
    Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import BASE_URL from "../global";
import { Button } from "../components/ui/Button";
import { FAQ } from "../components/FAQ";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { RelatedTripsGrid } from "../components/RelatedTripsGrid";
import { SectionHeading } from "../components/ui/SectionHeading";
import { Tabs } from "../components/Tabs";
import { TripsGrid } from "../components/TripsGrid";
import { fetchData } from "../axiosHook";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { NotFoundPage } from "./NotFoundPage";
import { Seo } from "../components/Seo";
import PlaceExploresSection from "../components/PlaceExploresSection";

function SubDestinationSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main>
                {/* Hero Skeleton */}
                <div className="dc-skeleton h-[60vh] min-h-[500px]" />
                
                {/* Overview Skeleton */}
                <section className="py-20 max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        <div className="space-y-6">
                            <div className="dc-skeleton dc-skeleton-title w-3/4 h-12" />
                            <div className="space-y-4">
                                <div className="dc-skeleton dc-skeleton-row" />
                                <div className="dc-skeleton dc-skeleton-row" />
                                <div className="dc-skeleton dc-skeleton-row w-5/6" />
                            </div>
                        </div>
                        <div className="dc-skeleton h-[500px] rounded-3xl" />
                    </div>
                </section>

                {/* Info Cards Skeleton */}
                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="dc-skeleton h-64 rounded-3xl" />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export function SubDestinationSlugPage({ pageType }: { pageType: string }) {
    const { slug } = useParams();
    const [activeGuide, setActiveGuide] = useState<string | null>(null);
    const [subDestination, setSubDestination] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchDestination = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetchData(`/${pageType}/${slug}`);
            if (res) {
                setSubDestination(res);
            } else {
                setSubDestination(null);
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
        return <SubDestinationSkeleton />;
    }

    const hasGuideContent = (guideId: string) => {
        const info = subDestination?.essential_info;

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

    const faqs = subDestination?.faq;

    if (!subDestination || error) {
        return <NotFoundPage />;
    }

    const guides = [
        { id: "best-time", title: "Best Time to Visit", icon: Calendar },
        { id: "permits", title: "Permits & Fees", icon: FileText },
        { id: "flights", title: "Flights", icon: Plane },
    ];

    const renderGuideContent = (guideId: string) => {
        if (!hasGuideContent(guideId)) return null;

        const best_time_to_visit = subDestination?.essential_info?.best_time_to_visit;
        const permits_and_fees = subDestination?.essential_info?.permits_and_fees;
        const flights = subDestination?.essential_info?.flights;

        switch (guideId) {
            case "best-time":
                return (
                    <div className="grid md:grid-cols-2 gap-8">
                        {best_time_to_visit?.items?.map((item: any, idx: number) => (
                            <div key={idx} className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-amber-100 rounded-lg text-amber-700 mt-1 flex-none">
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
                                            <ThermometerSun size={20} />
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-stone-900 text-lg">
                                            {item.season} {item.time ? `(${item.time})` : ''}
                                        </h4>
                                        <div
                                            className="text-stone-600 mt-1 prose prose-sm"
                                            dangerouslySetInnerHTML={{
                                                __html: item.description || item.content,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {best_time_to_visit?.off_season_considerations && (
                            <div className="md:col-span-2 bg-stone-50 p-6 rounded-xl border border-stone-100 mt-4">
                                <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-2">
                                    <Info size={18} className="text-stone-500" />
                                    Off-Season Considerations
                                </h4>
                                <div 
                                    className="text-stone-600 text-sm prose prose-sm"
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
                    <div className="space-y-6">
                        {permits_and_fees?.title && (
                            <p className="text-stone-600">
                                {permits_and_fees.title}
                            </p>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            {permits_and_fees?.items?.map((item: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm"
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
                                            <FileText className="text-amber-600" size={24} />
                                        )}

                                        <h4 className="font-bold text-stone-900 text-lg">
                                            {item.label}
                                        </h4>
                                    </div>

                                    <div
                                        className="text-stone-600 text-sm mb-4 prose prose-sm"
                                        dangerouslySetInnerHTML={{
                                            __html: item.content,
                                        }}
                                    />

                                    {item.cost && (
                                        <div className="font-semibold text-stone-900">
                                            {item.cost}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {permits_and_fees?.note && (
                            <div 
                                className="text-sm text-stone-500 italic prose prose-sm"
                                dangerouslySetInnerHTML={{
                                    __html: permits_and_fees.note,
                                }}
                            />
                        )}
                    </div>
                );

            case "flights":
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 items-start">
                            <div className="col-span-4">
                                <h3 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                                    {flights?.icon ? (
                                        <img
                                            src={`${BASE_URL}/${flights.icon}`}
                                            alt={flights.label || "Flights"}
                                            className="w-6 h-6 object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <Plane className="text-amber-600" />
                                    )}
                                    {flights?.label || "Flights Information"}
                                </h3>

                                {flights?.contents && (
                                    <div
                                        className="text-stone-600 mb-4 leading-relaxed prose prose-sm"
                                        dangerouslySetInnerHTML={{
                                            __html: flights.contents,
                                        }}
                                    />
                                )}
                            </div>

                            {flights?.tips && (
                                <div className="col-span-2 bg-stone-100 p-6 rounded-xl">
                                    <h4 className="font-bold text-stone-900 mb-4">
                                        Flight Tips
                                    </h4>
                                    <div
                                        className="text-amber-800 text-sm prose prose-sm"
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

    return (
        <div className="min-h-screen bg-white font-sans">
            <Seo
                seoMeta={subDestination?.seo_meta}
                fallbackTitle={subDestination?.banner_accordions?.title || subDestination?.name}
                fallbackDescription={subDestination?.banner_accordions?.sub_title}
                fallbackImage={subDestination?.banner_accordions?.banner_image}
                canonicalPath={`/${pageType === 'trek' ? 'trekking' : pageType}/${subDestination?.slug}`}
                type="TouristAttraction"
                faqs={faqs}
            />
            <Navbar />
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center">
                {subDestination && subDestination.banner_accordions?.banner_image && (
                    <div
                        className="absolute inset-0 bg-cover bg-center z-0"
                        style={{
                            backgroundImage: `url(${BASE_URL}/${subDestination.banner_accordions.banner_image})`,
                        }}
                    >
                        <div className="absolute inset-0 bg-black/40" />
                    </div>
                )}
                {!subDestination?.banner_accordions?.banner_image && (
                    <div className="absolute inset-0 bg-gradient-to-r from-stone-800 to-stone-900 z-0"></div>
                )}

                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto flex flex-col justify-center items-center">
                    {subDestination?.banner_accordions?.banner_icon && (
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6">
                            <img
                                src={BASE_URL + "/" + subDestination.banner_accordions.banner_icon}
                                alt="icon"
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                }}
                            />
                        </div>
                    )}
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                        {subDestination?.banner_accordions?.title || subDestination?.name}
                    </h1>
                    <p className="text-xl md:text-2xl text-stone-100 font-light max-w-2xl mx-auto">
                        {subDestination?.banner_accordions?.sub_title}
                    </p>
                </div>
            </div>

            {/* Overview Section */}
            {subDestination?.overviews?.length > 0 && 
                subDestination.overviews.map((overview: any, index: number) => {
                    const hasText = !!(overview.title || overview.sub_title || overview.content || (overview.additions && overview.additions.length > 0));
                    const hasImage = !!(overview.image || overview.quote_text);

                    return (
                        <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto" key={index}>
                            <div className="grid md:grid-cols-12 gap-12 items-start">
                                {hasText && (
                                    <div className={`${hasImage ? "md:col-span-7" : "md:col-span-12"} space-y-6`}>
                                        <SectionHeading
                                            title={overview.title}
                                            subtitle={overview.sub_title}
                                            className="mb-8"
                                        />
                                        
                                        {overview.content && (
                                            <div
                                                className="text-stone-600 mb-4 leading-relaxed prose prose-lg max-w-none"
                                                dangerouslySetInnerHTML={{
                                                    __html: overview.content,
                                                }}
                                            />
                                        )}

                                        {overview.additions && overview.additions.length > 0 && (
                                            <div className="flex flex-wrap gap-4 pt-4">
                                                {overview.additions.map((data: any, idx: number) => (
                                                    <div key={idx} className="flex items-center gap-2 text-stone-600 bg-stone-100 px-4 py-2 rounded-full text-sm font-medium">
                                                        {data.icon && (
                                                            <img
                                                                className="w-6 h-6 rounded-full object-cover"
                                                                src={`${BASE_URL}/${data.icon}`}
                                                                alt={data.title}
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = "none";
                                                                }}
                                                            />
                                                        )}
                                                        {data.title}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {hasImage && (
                                    <div className={`${hasText ? "md:col-span-5" : "md:col-span-12"} sticky top-24`}>
                                        {overview.image && (
                                            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                                                <img
                                                    src={`${BASE_URL}/${overview.image}`}
                                                    alt={overview.title || "Overview image"}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                                />
                                            </div>
                                        )}
                                        {overview.quote_text && (
                                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg max-w-xs hidden md:block border border-stone-100">
                                                <p className="text-stone-800 font-serif italic text-lg">
                                                    "{overview.quote_text}"
                                                </p>
                                                {overview.quote_title && (
                                                    <p className="text-stone-500 text-sm mt-2" >
                                                        — {overview.quote_title}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </section>
                    );
                })
            }

            {/* Trips Grid */}
            {subDestination?.packages && subDestination.packages.length > 0 && (
                <RelatedTripsGrid relatedTreks={subDestination.packages} />
            )}

            {/* Places Covered */}
            {(subDestination?.place_explores || subDestination?.placeExplores) && (
                <PlaceExploresSection places={subDestination.place_explores || subDestination.placeExplores} />
            )}
            
            {/* Essential Information */}
            {(hasGuideContent("best-time") || hasGuideContent("permits") || hasGuideContent("flights")) && (
                <section className="py-20 px-4 max-w-7xl mx-auto">
                    <SectionHeading
                        title="Essential Information"
                        subtitle="Plan Your Trip"
                        className="mb-10 text-center"
                    />

                    {/* Guide Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-10">
                        {guides.filter(g => hasGuideContent(g.id)).map((guide) => {
                            const available = hasGuideContent(guide.id);
                            
                            // Get the custom database title if set
                            let displayTitle = guide.title;
                            const info = subDestination?.essential_info;
                            if (guide.id === "best-time" && info?.best_time_to_visit?.title) {
                                displayTitle = info.best_time_to_visit.title;
                            } else if (guide.id === "permits" && info?.permits_and_fees?.title) {
                                displayTitle = info.permits_and_fees.title;
                            } else if (guide.id === "flights" && info?.flights?.title) {
                                displayTitle = info.flights.title;
                            }

                            return (
                                <motion.button
                                    key={guide.id}
                                    disabled={!available}
                                    onClick={() => {
                                        if (!available) return;
                                        setActiveGuide(
                                            activeGuide === guide.id ? null : guide.id
                                        );
                                    }}
                                    whileHover={available ? { y: -4 } : undefined}
                                    className={`p-8 rounded-2xl border-2 text-left transition
                                        ${
                                            activeGuide === guide.id
                                              ? "border-amber-500 shadow-lg"
                                              : "border-stone-200 hover:shadow-md"
                                        }`}
                                >
                                    <div className="flex justify-between mb-4">
                                        <guide.icon size={28} className={activeGuide === guide.id ? "text-amber-500" : "text-stone-600"} />
                                        {available && <ArrowRight className={activeGuide === guide.id ? "text-amber-500" : "text-stone-400"} />}
                                    </div>
                                    <h3 className={`text-xl font-bold ${activeGuide === guide.id ? "text-amber-600" : "text-stone-900"}`}>
                                        {displayTitle}
                                    </h3>
                                </motion.button>
                            );
                        })}
                    </div>

                    <div className="detail">
                        {activeGuide && hasGuideContent(activeGuide) && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="border rounded-2xl p-8 shadow-lg bg-white"
                            >
                                {renderGuideContent(activeGuide)}
                            </motion.div>
                        )}
                    </div>
                </section>
            )}

            {/* FAQ Section */}
            {faqs && faqs.length > 0 && (
                <section className="bg-stone-900 py-20 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-stone-400">
                                Everything you need to know before you go.
                            </p>
                        </div>
                        <FAQ items={faqs} />

                        <div className="mt-12 text-center bg-stone-800 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-white mb-2">
                                Still have questions?
                            </h3>
                            <p className="text-stone-400 mb-6">
                                Our team of experts is ready to help you plan your perfect trek.
                            </p>
                            <a href="/contact">
                                <Button
                                    variant="primary"
                                    className="bg-amber-600 hover:bg-amber-700 border-none text-white"
                                >
                                    Contact Us
                                </Button>
                            </a>
                        </div>
                    </div>
                </section>
            )}
            
            <Footer />
        </div>
    );
}
