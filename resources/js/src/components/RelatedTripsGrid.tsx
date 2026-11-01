import { ArrowRight, Clock, MapPin, TrendingUp } from "lucide-react";

import BASE_URL from "../global";
import React from "react";
import { SectionHeading } from "./ui/SectionHeading";
import { motion } from "framer-motion";
import { WishlistButton } from "./WishlistButton";

const difficultyColors: Record<string, string> = {
    Moderate: "text-[#0066FF]",
    Hard: "text-purple-500",
    Easy: "text-[#06B6D4]",
};


interface Package {    
    banner_image: string;
    difficulty: string;
    duration_days: string;
    id: number;
    pivot: {
        packageable_type: string;
        packageable_id: number;
        package_id: number;
    };
    price: string;
    slug: string;
    title: string;
    country: string;
}

interface RelatedTripsGridProps {
    relatedTreks: Package[];
}

export function RelatedTripsGrid({ relatedTreks }: RelatedTripsGridProps) {
    return (
        <section className="py-20 bg-gradient-to-b from-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title="Popular Trips"
                    subtitle="Explore our most popular trekking and adventure packages, designed for travelers seeking extraordinary experiences."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {relatedTreks.map((trip, index) => (
                        <motion.a
                            key={trip.slug}
                            href={`/${trip.slug}`} // link can be updated dynamically
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={`${BASE_URL}/${trip?.banner_image}`}
                                    alt={trip.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                {/* Wishlist Button */}
                                <div className="absolute top-3 right-3 z-10">
                                    <WishlistButton product={trip} />
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <MapPin
                                            size={18}
                                            className="text-white drop-shadow-lg"
                                        />
                                        <span className="text-white text-sm font-semibold drop-shadow-lg">
                                            {trip.country}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp
                                            size={18}
                                            className={`${difficultyColors[trip.difficulty]} drop-shadow-lg`}
                                        />
                                        <span
                                            className={`text-sm font-semibold drop-shadow-lg ${difficultyColors[trip.difficulty]}`}
                                        >
                                            {trip.difficulty}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col  justify-between justify-between">
                                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                                    {trip.title}
                                </h3>

                                {/* Duration */}
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock
                                        size={16}
                                        className="text-gray-500"
                                    />
                                    <span className="text-sm text-gray-600 font-medium">
                                        {trip.duration_days} 
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                    <div>
                                        {trip.price && (
                                            <>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Starting from
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    ${trip.price}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                    <span className="flex items-center gap-2 text-gray-700 group-hover:text-[#0066FF] font-medium transition-colors">
                                        Explore
                                        <ArrowRight
                                            size={18}
                                            className="transition-transform group-hover:translate-x-1"
                                        />
                                    </span>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
