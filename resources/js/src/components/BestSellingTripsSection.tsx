import { ArrowRight, Clock, MapPin, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";

import BASE_URL from "../global";
import { SectionHeading } from "./ui/SectionHeading";
import { fetchData } from "../axiosHook";
import { motion } from "framer-motion";
import Loading from "./Loading";
import { WishlistButton } from "./WishlistButton";
// @ts-ignore – types exist at dist/types but package.json exports prevents auto-resolution
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

export function BestSellingTripsSection() {
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const difficultyColors = {
        Moderate: "text-[#0066FF]",
        Hard: "text-purple-500",
        Easy: "text-[#06B6D4]",
    };

    const fetchTrips = async () => {
        try {
            const res = await fetchData("/best-selling-packages");
            if (res && Array.isArray(res)) {
                setTrips(res);
            } else {
                console.warn("Unexpected best-selling packages response format:", res);
                setTrips([]);
            }
        } catch (err) {
            console.error("Error fetching best-selling packages:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (!trips || trips.length === 0) {
        return null; // Don't render section if no best-selling packages
    }

    const renderTripCard = (trip: any, index: number) => (
        <motion.a
            key={index}
            href={"/" + trip.slug}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: Math.min(index, 2) * 0.1 }}
            className="block flex flex-col h-full"
        >
            <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                    <img
                        src={trip.banner_image ? `${BASE_URL}/${trip.banner_image}` : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop'}
                        alt={trip.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop';
                        }}
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Wishlist Button */}
                    <div className="absolute top-3 right-3 z-10">
                        <WishlistButton product={trip} />
                    </div>

                    {/* Location and Difficulty – Bottom */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-white drop-shadow-lg" />
                            <span className="text-white text-sm font-semibold drop-shadow-lg">
                                {trip.country}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp
                                size={18}
                                className={`${difficultyColors[trip.difficulty as keyof typeof difficultyColors]} drop-shadow-lg`}
                            />
                            <span
                                className={`text-sm font-semibold drop-shadow-lg ${difficultyColors[trip.difficulty as keyof typeof difficultyColors]}`}
                            >
                                {trip.difficulty}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                    <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                        {trip.title}
                    </h3>

                    {/* Duration */}
                    <div className="flex items-center gap-2 mb-4">
                        {trip.duration_days && (
                            <Clock size={16} className="text-gray-500" />
                        )}
                        <span className="text-sm text-gray-600 font-medium">
                            {trip.duration_days}
                        </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                            {trip.price && (
                                <>
                                    <p className="text-xs text-gray-500 mb-1">Starting from</p>
                                    <p className="text-2xl font-bold text-gray-900">${trip.price}</p>
                                </>
                            )}
                        </div>
                        <span className="flex items-center gap-2 text-gray-700 group-hover:text-[#0066FF] font-medium transition-colors">
                            Explore
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </span>
                    </div>
                </div>
            </div>
        </motion.a>
    );

    // Use grid when 1–3 items; use Splide slider for smooth experience
    return (
        <section className="py-20 bg-gray-50 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title="Best Selling Trips"
                    subtitle="Our most sought-after trekking experiences, loved by adventurers from around the world."
                />

                {trips.length <= 3 ? (
                    // Simple grid for small counts
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trips.map((trip, index) => renderTripCard(trip, index))}
                    </div>
                ) : (
                    // Splide slider for 4+ items
                    <Splide
                        options={{
                            perPage: 3,
                            perMove: 1,
                            gap: '2rem',
                            pagination: true,
                            arrows: true,
                            autoplay: false,
                            breakpoints: {
                                1024: { perPage: 2, gap: '1.5rem' },
                                640: { perPage: 1, gap: '1rem' },
                            },
                        }}
                        aria-label="Best Selling Trips"
                    >
                        {trips.map((trip, index) => (
                            <SplideSlide key={index}>
                                {renderTripCard(trip, index)}
                            </SplideSlide>
                        ))}
                    </Splide>
                )}
            </div>
        </section>
    );
}
