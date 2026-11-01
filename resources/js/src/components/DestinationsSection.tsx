import { ArrowRight, MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";

import BASE_URL from "../global";
import { SectionHeading } from "./ui/SectionHeading";
import { fetchData } from "../axiosHook";
import { motion } from "framer-motion";
import Loading from "./Loading";

// const destinations = [
//     {
//         id: 1,
//         name: "Nepal",
//         description: "Home to Everest and ancient temples",
//         image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop",
//         treks: "25+ Treks",
//         link: "#destination-nepal",
//     },
//     {
//         id: 2,
//         name: "Tibet",
//         description: "Roof of the world, spiritual heartland",
//         image: "https://images.unsplash.com/photo-1526716173434-a1b560f2065d?q=80&w=2070&auto=format&fit=crop",
//         treks: "12+ Treks",
//         link: "#",
//     },
//     {
//         id: 3,
//         name: "Bhutan",
//         description: "Land of the Thunder Dragon",
//         image: "https://images.unsplash.com/photo-1578565697042-45e396d36e3c?q=80&w=2070&auto=format&fit=crop",
//         treks: "8+ Treks",
//         link: "#",
//     },
// ];
export function DestinationsSection() {
    const [destinations, setDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchDestination = async () => {
        try {
         const res = await fetchData("/destination");
         
            if (res?.destination) {
                setDestinations(res.destination); // ARRAY
            } else if (Array.isArray(res)) {
                setDestinations(res);
            } else {
                console.warn("Unexpected destinations response format:", res);
                setDestinations([]);
            }
        } catch (err) {
            console.error("Error fetching destinations:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDestination();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (!destinations || destinations.length === 0 || error) {
        return null;
    }
    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title="Explore Destinations"
                    subtitle="Discover the majestic regions we specialize in."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {destinations.slice(0, 3).map((destination, index) => (
                        <motion.a
                            key={destination?.id}
                            href={"/destination/" + destination?.slug}
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
                            className="group relative h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                        >
                            <div className="absolute inset-0">
                                <img
                                    src={destination?.banner_image ? `${BASE_URL}/${destination.banner_image}` : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop'}
                                    alt={destination.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                            </div>

                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <div className="flex items-center gap-2 text-[#06B6D4] mb-2">
                                    <MapPin size={16} />
                                    <span className="text-sm font-medium">
                                        {destination?.region}
                                    </span>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-[#06B6D4] transition-colors">
                                    {destination.name}
                                </h3>
                               
                                <div className="text-gray-200">
                                    <p 
                                        className="max-w-3xl mb-8 text-xl leading-relaxed text-gray-200 line-clamp-3 prose prose-invert prose-lg prose-white"
                                        dangerouslySetInnerHTML={{ __html: destination.description }} 
                                    />
                                </div>
                                <span className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                                    Explore Destination <ArrowRight size={18} />
                                </span>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
