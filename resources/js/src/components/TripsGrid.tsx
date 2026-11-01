import React from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight, MapPin, TrendingUp } from "lucide-react";
import { SectionHeading } from "./ui/SectionHeading";
import { WishlistButton } from "./WishlistButton";
// const trips = [{
//   id: 1,
//   title: 'Everest Base Camp',
//   image: 'https://images.unsplash.com/photo-1533130061792-649d45df8c2d?q=80&w=1978&auto=format&fit=crop',
//   duration: '14 Days',
//   nights: 13,
//   days: 14,
//   difficulty: 'Hard',
//   price: '$1,450',
//   location: 'Nepal',
//   link: 'https://project-everest-base-camp-trek-detail-page-148.magicpatterns.app/'
// }, {
//   id: 2,
//   title: 'Annapurna Circuit',
//   image: 'https://images.unsplash.com/photo-1548588627-f978862b85e1?q=80&w=2072&auto=format&fit=crop',
//   duration: '16 Days',
//   nights: 15,
//   days: 16,
//   difficulty: 'Moderate',
//   price: '$1,250',
//   location: 'Nepal',
//   link: '#'
// }, {
//   id: 3,
//   title: 'Langtang Valley',
//   image: 'https://images.unsplash.com/photo-1623492701902-47d3be136e96?q=80&w=2070&auto=format&fit=crop',
//   duration: '9 Days',
//   nights: 8,
//   days: 9,
//   difficulty: 'Moderate',
//   price: '$950',
//   location: 'Nepal',
//   link: '#'
// }, {
//   id: 4,
//   title: 'Lhasa Express',
//   image: 'https://images.unsplash.com/photo-1526716173434-a1b560f2065d?q=80&w=2070&auto=format&fit=crop',
//   duration: '8 Days',
//   nights: 7,
//   days: 8,
//   difficulty: 'Moderate',
//   price: '$1,850',
//   location: 'Tibet',
//   link: '#'
// }, {
//   id: 5,
//   title: 'Manaslu Circuit',
//   image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop',
//   duration: '16 Days',
//   nights: 15,
//   days: 16,
//   difficulty: 'Hard',
//   price: '$1,650',
//   location: 'Nepal',
//   link: '#'
// }, {
//   id: 6,
//   title: 'Gokyo Lakes',
//   image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=1933&auto=format&fit=crop',
//   duration: '13 Days',
//   nights: 12,
//   days: 13,
//   difficulty: 'Hard',
//   price: '$1,390',
//   location: 'Nepal',
//   link: '#'
// }];
const difficultyColors = {
    Moderate: "text-[#0066FF]",
    Hard: "text-purple-500",
    Easy: "text-[#06B6D4]",
};
export function TripsGrid({ trips }: { trips: any[] }) {
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
                            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={trip.image}
                                    alt={trip.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Overlay gradient for better text visibility */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                {/* Wishlist Button */}
                                <div className="absolute top-3 right-3 z-10">
                                    <WishlistButton product={trip} />
                                </div>

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
                                        {trip.trek_duration}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                    <div>
                                        {(() => {
                                            const price = trip.packages?.length
                                                ? Math.min(
                                                      ...trip.packages.map(
                                                          (pkg) => Number(pkg.cost),
                                                      ),
                                                  )
                                                : trip.cost;
                                            return price ? (
                                                <>
                                                    <p className="text-xs text-gray-500 mb-1">
                                                        Starting from
                                                    </p>
                                                    <p className="text-2xl font-bold text-gray-900">
                                                        {price}
                                                    </p>
                                                </>
                                            ) : null;
                                        })()}
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
