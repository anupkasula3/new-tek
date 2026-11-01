import { ArrowRight, Clock, MapPin, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";

import BASE_URL from "../global";
import { SectionHeading } from "./ui/SectionHeading";
import { fetchData } from "../axiosHook";
import { motion } from "framer-motion";
import Loading from "./Loading";

export function TripsSection() {
    const [trips, setTrips] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const difficultyColors = {
        Moderate: "text-[#0066FF]",
        Hard: "text-purple-500",
        Easy: "text-[#06B6D4]",
    };
    const fetchTrips = async () => {
        try {
            const res = await fetchData("/treks");

            if (res) {
                setTrips(res);
            } else {
                setTrips(null);
            }
        } catch (err) {
            console.error(err);
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

   
    return (
        <section className="py-20 bg-gradient-to-b from-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title="Popular Adventures"
                    subtitle="Handpicked trekking itineraries loved by travelers worldwide."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trips.map((trip, index) => (
                        <motion.a
                            key={index}
                            href={"/" + trip.slug}
                            initial={{
                                opacity: 0,
                                y: 30,
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
                            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 block flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={`${BASE_URL}/${trip.banner_image}`}
                                    alt={trip.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Overlay gradient for better text visibility */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                {/* Location and Difficulty - Bottom */}
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
                                    {/* Location */}
                                    <div className="flex items-center gap-2">
                                        <MapPin
                                            size={18}
                                            className="text-white drop-shadow-lg"
                                        />
                                        <span className="text-white text-sm font-semibold drop-shadow-lg">
                                            {trip.country}
                                        </span>
                                    </div>

                                    {/* Difficulty */}
                                    <div className="flex items-center gap-2">
                                        <TrendingUp
                                            size={18}
                                            className={`${difficultyColors[trip.trek_level as keyof typeof difficultyColors]} drop-shadow-lg`}
                                        />
                                        <span
                                            className={`text-sm font-semibold drop-shadow-lg ${difficultyColors[trip.trek_level as keyof typeof difficultyColors]}`}
                                        >
                                            {trip.trek_level}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col  justify-between">
                                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                                    {trip.name}
                                </h3>

                                {/* Duration */}
                                <div className="flex items-center gap-2 mb-4">
                                    <Clock
                                        size={16}
                                        className="text-gray-500"
                                    />
                                    <span className="text-sm text-gray-600 font-medium">
                                        {trip.trek_duration}{" "}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div>
                                        {trip.packages?.[0]?.cost && (
                                            <>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Starting from
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {trip.packages?.[0]?.cost}
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
