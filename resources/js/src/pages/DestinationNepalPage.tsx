import {
    ArrowRight,
    Calendar,
    Check,
    Globe,
    MapPin,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";

import BASE_URL from "../../src/global";
import { Button } from "../components/ui/Button";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import React from "react";
import { SectionHeading } from "../components/ui/SectionHeading";
import { div } from "framer-motion/client";
import { fetchData } from "../axiosHook";
import { motion } from "framer-motion";

const popularTreks = [
    {
        title: "Everest Base Camp",
        duration: "14 Days",
        difficulty: "Challenging",
        price: "$1,450",
        image: "https://images.unsplash.com/photo-1533130061792-649d45df8c2d?q=80&w=1978&auto=format&fit=crop",
        link: "https://project-everest-base-camp-trek-detail-page-148.magicpatterns.app/",
    },
    {
        title: "Annapurna Circuit",
        duration: "16 Days",
        difficulty: "Moderate",
        price: "$1,250",
        image: "https://images.unsplash.com/photo-1548588627-f978862b85e1?q=80&w=2072&auto=format&fit=crop",
        link: "#",
    },
    {
        title: "Langtang Valley",
        duration: "9 Days",
        difficulty: "Moderate",
        price: "$950",
        image: "https://images.unsplash.com/photo-1623492701902-47d3be136e96?q=80&w=2070&auto=format&fit=crop",
        link: "#",
    },
];

export function DestinationNepalPage() {
    const [destination, setDestination] = useState();
    const fetchDestination = async () => {
        try {
            const res = await fetchData("/destination/destination-1");
            setDestination(res);
        } catch (err) {
            console.error(err);
        }
    };
    const iconColors = [
        {
            bg: "bg-blue-100",
            text: "text-blue-600",
        },
        {
            bg: "bg-green-100",
            text: "text-green-600",
        },
        {
            bg: "bg-purple-100",
            text: "text-purple-600",
        },
        {
            bg: "bg-orange-100",
            text: "text-orange-600",
        },
    ];

    useEffect(() => {
        fetchDestination();
    }, []);

    return (
        <div className="min-h-screen font-sans text-gray-900 bg-white">
            <Navbar />
            {destination && (
                <div>
                    <div className="relative h-[70vh] min-h-[600px] flex items-end overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            {destination.banner_image && (
                                <img
                                    src={`${BASE_URL}/${destination.banner_image}`}
                                    alt="Banner"
                                    className="object-cover w-full h-full"
                                />
                            )}
                        </div>

                        <div className="relative z-20 w-full px-4 pb-16 mt-16">
                            <div className="mx-auto max-w-7xl">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <MapPin
                                            className="text-[#06B6D4]"
                                            size={24}
                                        />
                                        {destination.region && (
                                            <span className="text-lg font-medium text-white/90">
                                                {destination.region}
                                            </span>
                                        )}
                                    </div>
                                    {destination.country && (
                                        <h1 className="mb-6 text-5xl font-bold text-white md:text-7xl">
                                            {destination.country}
                                        </h1>
                                    )}
                                    {destination.description && (
                                        <div className="max-w-3xl mb-8 text-2xl leading-relaxed text-gray-200">
                                            <p dangerouslySetInnerHTML={{ __html: destination.description }} />
                                        </div>
                                    )}
                                    {destination.banner_accordion_tags &&
                                        destination.banner_accordion_tags
                                            .length > 0 && (
                                            <div className="flex flex-wrap gap-6 text-white">
                                                {destination.banner_accordion_tags.map(
                                                    (tag, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
                                                        >
                                                            {tag.icon && (
                                                                <img
                                                                    src={`${BASE_URL}/${tag.icon}`}
                                                                    alt="Banner"
                                                                    className="object-cover w-10 h-10"
                                                                />
                                                            )}
                                                            <div>
                                                                <p className="text-xs text-gray-300">
                                                                    {tag.title}
                                                                </p>
                                                                <p className="font-bold">
                                                                    {
                                                                        tag.content
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                </motion.div>
                            </div>
                        </div>
                    </div>

                    <main className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {destination.destination_details &&
                            destination.destination_details.length > 0 && (
                                <section className="mb-20">
                                    <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
                                        <motion.div
                                            initial={{ opacity: 0, x: -30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            <h2 className="mb-6 text-4xl font-bold text-gray-900">
                                                {
                                                    destination
                                                        .destination_details[0]
                                                        .title
                                                }
                                            </h2>
                                            <div className="space-y-4 prose prose-lg text-gray-700">
                                                {destination.destination_details[0].contents?.map(
                                                    (contentItem, index) => (
                                                        <p key={index}>
                                                            {
                                                                contentItem.content
                                                            }
                                                        </p>
                                                    ),
                                                )}
                                            </div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: 30 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6 }}
                                            className="relative"
                                        >
                                            {destination.destination_details[0]
                                                .image && (
                                                <img
                                                    src={`${BASE_URL}/${destination.destination_details[0].image}`}
                                                    alt={
                                                        treks
                                                            .destination_details[0]
                                                            .title
                                                    }
                                                    className="relative object-cover w-full h-auto shadow-2xl rounded-2xl"
                                                />
                                            )}
                                        </motion.div>
                                    </div>
                                </section>
                            )}

                        {destination.best_season_title &&
                            destination.best_season_accordions && (
                                <section className="p-8 mb-20 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl md:p-12">
                                    <SectionHeading
                                        title="Best Time to Visit"
                                        subtitle={destination.best_season_title}
                                        centered={false}
                                    />

                                    <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2">
                                        {destination.best_season_accordions.map(
                                            (season, index) => {
                                                const color =
                                                    iconColors[
                                                        index %
                                                            iconColors.length
                                                    ];

                                                return (
                                                    <div
                                                        key={index}
                                                        className="p-6 bg-white shadow-md rounded-xl"
                                                    >
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <div
                                                                className={`flex items-center justify-center w-12 h-12 rounded-full ${color.bg} ${color.text}`}
                                                            >
                                                                {season.icon ? (
                                                                    <img
                                                                        src={`${BASE_URL}/${season.icon}`}
                                                                        alt={
                                                                            season.season
                                                                        }
                                                                        className="object-cover w-6 h-6"
                                                                    />
                                                                ) : (
                                                                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                                                                        <Calendar
                                                                            size={
                                                                                24
                                                                            }
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <h3 className="text-xl font-bold text-gray-900">
                                                                    {
                                                                        season.season
                                                                    }{" "}
                                                                    (
                                                                    {
                                                                        season.date
                                                                    }
                                                                    )
                                                                </h3>
                                                                <p className="text-sm text-gray-600">
                                                                    {
                                                                        season.title
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <p className="leading-relaxed text-gray-700">
                                                            {season.content}
                                                        </p>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                </section>
                            )}

                        {destination.must_visit_title &&
                            destination.must_visit_accordions && (
                                <section className="mb-20">
                                    <SectionHeading
                                        title="Must-Visit Attractions"
                                        subtitle={destination.must_visit_title}
                                    />
                                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                        {destination.must_visit_accordions.map(
                                            (attraction, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 30,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        delay: index * 0.1,
                                                    }}
                                                    className="relative overflow-hidden transition-shadow shadow-lg group rounded-2xl hover:shadow-2xl"
                                                >
                                                    <div className="relative overflow-hidden h-80">
                                                        <img
                                                            src={`${BASE_URL}/${attraction.image}`}
                                                            alt={
                                                                attraction.title
                                                            }
                                                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                                        <div className="absolute bottom-0 left-0 w-full p-6">
                                                            <h3 className="mb-2 text-2xl font-bold text-white">
                                                                {
                                                                    attraction.title
                                                                }
                                                            </h3>
                                                             <div className="text-gray-200">
                                                                                                                       <p dangerouslySetInnerHTML={{ __html: attraction.content }} />
                                                                                                                   </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ),
                                        )}
                                    </div>
                                </section>
                            )}

                        {destination.destination_details &&
                            destination.destination_details.length > 1 && (
                                <section className="mb-20">
                                    {destination.destination_details
                                        .slice(1)
                                        .map((detail, index) => (
                                            <div
                                                key={index}
                                                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                                                    index % 2 !== 0
                                                        ? "lg:flex-row-reverse"
                                                        : ""
                                                }`}
                                            >
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        x: -30,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        duration: 0.6,
                                                    }}
                                                >
                                                    <h2 className="mb-6 text-4xl font-bold text-gray-900">
                                                        {detail.title}
                                                    </h2>
                                                    <div className="space-y-4 prose prose-lg text-gray-700">
                                                        {detail.contents?.map(
                                                            (
                                                                contentItem,
                                                                idx,
                                                            ) => (
                                                                <p key={idx}>
                                                                    {
                                                                        contentItem.content
                                                                    }
                                                                </p>
                                                            ),
                                                        )}
                                                    </div>
                                                </motion.div>

                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        x: 30,
                                                    }}
                                                    whileInView={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        duration: 0.6,
                                                    }}
                                                    className="relative"
                                                >
                                                    {detail.image && (
                                                        <img
                                                            src={`${BASE_URL}/${detail.image}`}
                                                            alt={detail.title}
                                                            className="relative object-cover w-full h-auto shadow-2xl rounded-2xl"
                                                        />
                                                    )}
                                                </motion.div>
                                            </div>
                                        ))}
                                </section>
                            )}

                        <section className="p-8 mb-20 bg-gray-50 rounded-2xl md:p-12">
                            <SectionHeading
                                title="Practical Information"
                                subtitle={
                                    destination.practical_information_title
                                }
                                centered={false}
                            />
                            <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-4">
                                {destination.practical_information_accordions.map(
                                    (info, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="p-6 bg-white shadow-md rounded-xl"
                                        >
                                            <div className="w-12 h-12 bg-blue-100 text-[#0066FF] rounded-lg flex items-center justify-center mb-4">
                                                <img
                                                    src={`${BASE_URL}/${info.icon}`}
                                                    alt={info.title}
                                                    className="w-6 h-6"
                                                />
                                            </div>
                                            <h4 className="mb-2 font-bold text-gray-900">
                                                {info.title}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {info.content}
                                            </p>
                                        </motion.div>
                                    ),
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
                                <div className="p-6 bg-white rounded-xl">
                                    <h4 className="flex items-center gap-2 mb-4 font-bold text-gray-900">
                                        <Check
                                            className="text-green-600"
                                            size={20}
                                        />{" "}
                                        Essential Tips
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        {destination.essential_tips.map(
                                            (tip, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-start gap-2"
                                                >
                                                    <Check
                                                        size={16}
                                                        className="text-green-600 shrink-0 mt-0.5"
                                                    />
                                                    <span>{tip.tip}</span>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>

                                <div className="p-6 bg-white rounded-xl">
                                    <h4 className="flex items-center gap-2 mb-4 font-bold text-gray-900">
                                        <Check
                                            className="text-green-600"
                                            size={20}
                                        />{" "}
                                        Cultural Etiquette
                                    </h4>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        {destination.cultural_etiquette.map(
                                            (rule, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-start gap-2"
                                                >
                                                    <Check
                                                        size={16}
                                                        className="text-green-600 shrink-0 mt-0.5"
                                                    />
                                                    <span>{rule.rule}</span>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="mb-20">
                            <SectionHeading
                                title="Popular Trips in Nepal"
                                subtitle="Explore the best trekking routes this destination has to offer."
                            />
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                                {populardestination.map((trek, index) => (
                                    <motion.a
                                        key={index}
                                        href={trek.link}
                                        target={
                                            trek.link.startsWith("http")
                                                ? "_blank"
                                                : "_self"
                                        }
                                        rel={
                                            trek.link.startsWith("http")
                                                ? "noopener noreferrer"
                                                : undefined
                                        }
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="overflow-hidden transition-all bg-white shadow-md group rounded-2xl hover:shadow-xl"
                                    >
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={trek.image}
                                                alt={trek.title}
                                                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="mb-3 text-xl font-bold text-gray-900">
                                                {trek.title}
                                            </h3>
                                            <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                                                <span>{trek.duration}</span>
                                                <span className="font-semibold text-orange-600">
                                                    {trek.difficulty}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-bold text-[#0066FF]">
                                                    {trek.price}
                                                </span>
                                                <span className="text-[#0066FF] font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                                                    View Trek{" "}
                                                    <ArrowRight size={16} />
                                                </span>
                                            </div>
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </section>

                        <section className="bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-2xl p-12 text-center text-white">
                            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                                Ready to Explore Nepal?
                            </h2>
                            <p className="max-w-2xl mx-auto mb-8 text-lg text-blue-100">
                                Let us help you plan the perfect Nepalese
                                adventure. From trekking to cultural tours,
                                we'll create an unforgettable experience.
                            </p>
                            <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="bg-white text-[#0066FF] hover:bg-gray-100 border-none"
                                >
                                    View All Nepal Treks
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-[#0066FF]"
                                >
                                    Contact Us
                                </Button>
                            </div>
                        </section>
                    </main>
                </div>
            )}
            <Footer />
        </div>
    );
}
