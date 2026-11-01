import {
    ArrowRight,
    Calendar,
    Check,
    Compass,
    Heart,
    MapPin,
    Shield,
    TrendingUp,
    Users,
    X,
} from "lucide-react";
import React, { memo } from "react";

import { Button } from "../components/ui/Button";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { PricingSection } from "../components/PricingSection";
import { SectionHeading } from "../components/ui/SectionHeading";
import { motion } from "framer-motion";
const itinerary = [
    {
        day: 1,
        title: "Arrival in Kathmandu",
        desc: "Meet and greet at airport, transfer to hotel, trek briefing",
    },
    {
        day: 2,
        title: "Fly to Lukla, Trek to Phakding",
        desc: "Scenic mountain flight, begin trek through pine forests (3-4 hours)",
    },
    {
        day: 3,
        title: "Phakding to Namche Bazaar",
        desc: "Cross suspension bridges, climb to Sherpa capital (5-6 hours)",
    },
    {
        day: 4,
        title: "Acclimatization Day in Namche",
        desc: "Hike to Everest View Hotel, explore local markets",
    },
    {
        day: 5,
        title: "Namche to Tengboche",
        desc: "Visit famous monastery with Everest views (5-6 hours)",
    },
    {
        day: 6,
        title: "Tengboche to Dingboche",
        desc: "Trek through rhododendron forests to alpine zone (5-6 hours)",
    },
    {
        day: 7,
        title: "Acclimatization in Dingboche",
        desc: "Day hike to Nangkartshang Peak for panoramic views",
    },
    {
        day: 8,
        title: "Dingboche to Lobuche",
        desc: "Pass memorials, reach high-altitude settlement (5-6 hours)",
    },
    {
        day: 9,
        title: "Lobuche to Gorak Shep, Visit EBC",
        desc: "Reach Everest Base Camp, return to Gorak Shep (7-8 hours)",
    },
    {
        day: 10,
        title: "Hike Kala Patthar, Descend to Pheriche",
        desc: "Sunrise at 5,545m viewpoint, descend (7-8 hours)",
    },
    {
        day: 11,
        title: "Pheriche to Namche Bazaar",
        desc: "Long descent through familiar villages (6-7 hours)",
    },
    {
        day: 12,
        title: "Namche to Lukla",
        desc: "Final trekking day, celebration dinner (6-7 hours)",
    },
    {
        day: 13,
        title: "Fly back to Kathmandu",
        desc: "Morning flight, free afternoon for shopping",
    },
    {
        day: 14,
        title: "Departure",
        desc: "Transfer to airport for international flight",
    },
];
const highlights = [
    "Stand at the base of the world's highest mountain",
    "Sunrise view from Kala Patthar (5,545m)",
    "Visit Tengboche Monastery",
    "Experience authentic Sherpa culture",
    "Cross thrilling suspension bridges",
    "Witness Himalayan giants: Lhotse, Nuptse, Ama Dablam",
];
export function EverestBaseCampPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-end overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1533130061792-649d45df8c2d?q=80&w=1978&auto=format&fit=crop"
                        alt="Everest Base Camp"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-20 w-full px-4 pb-16 mt-16">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 30,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.8,
                            }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="text-[#06B6D4]" size={20} />
                                <span className="text-white/90 font-medium">
                                    Nepal • Khumbu Regionsasa
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                                Everest Base Camp Trek
                            </h1>
                            <p className="text-xl text-gray-200 max-w-3xl mb-6">
                                Journey to the foot of the world's highest peak.
                                A legendary trek through Sherpa heartland.
                            </p>

                            <div className="flex flex-wrap gap-6 text-white">
                                <div className="flex items-center gap-2">
                                    <Calendar
                                        size={20}
                                        className="text-[#06B6D4]"
                                    />
                                    <span className="font-medium">14 Days</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TrendingUp
                                        size={20}
                                        className="text-[#06B6D4]"
                                    />
                                    <span className="font-medium">
                                        Challenging
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users
                                        size={20}
                                        className="text-[#06B6D4]"
                                    />
                                    <span className="font-medium">
                                        Max 10 People
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={typeof document !== 'undefined' ? (document.querySelector("link[rel*='icon']")?.getAttribute('href') || '/favicon.ico') : '/favicon.ico'}
                                        className="w-5 h-5 object-contain"
                                        alt="Favicon"
                                    />
                                    <span className="font-medium">
                                        Max Altitude: 5,545m
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Overview */}
                <section className="mb-16">
                    <SectionHeading
                        title="Trek Overview"
                        subtitle="The adventure of a lifetime awaits."
                        centered={false}
                    />
                    <div className="prose prose-lg max-w-none text-gray-600">
                        <p>
                            The Everest Base Camp trek is the most iconic
                            trekking route in the world. This 14-day journey
                            takes you through the heart of the Khumbu region,
                            home to the legendary Sherpa people and some of the
                            planet's most spectacular mountain scenery.
                        </p>
                        <p>
                            Starting with a thrilling flight to Lukla, you'll
                            trek through rhododendron forests, cross dramatic
                            suspension bridges, and gradually ascend to the base
                            of Mount Everest at 5,364 meters. Along the way,
                            you'll visit ancient Buddhist monasteries,
                            experience warm Sherpa hospitality, and witness
                            sunrise over the Himalayas from Kala Patthar.
                        </p>
                        <p>
                            This trek requires good physical fitness and proper
                            acclimatization, but no technical climbing skills.
                            Our experienced Sherpa guides ensure your safety and
                            comfort throughout the journey.
                        </p>
                    </div>
                </section>

                {/* Highlights */}
                <section className="mb-16 bg-gray-50 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Trek Highlights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {highlights.map((highlight, index) => (
                            <motion.div
                                key={index}
                                initial={{
                                    opacity: 0,
                                    x: -10,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    delay: index * 0.1,
                                }}
                                className="flex items-start gap-3"
                            >
                                <div className="w-6 h-6 rounded-full bg-[#0066FF] flex items-center justify-center shrink-0 mt-0.5">
                                    <Check size={14} className="text-white" />
                                </div>
                                <p className="text-gray-700">{highlight}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="mb-8">
                    <PricingSection
                        packageName="Standard Package"
                        duration="14 Days • All Inclusive"
                        price="$1,588"
                        description="Best value package including all essential services, permits, and accommodation. No hidden costs."
                    />
                </section>

                {/* Inquiry Message */}
                <section className="mb-16">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 text-center border border-blue-100">
                        <p className="text-gray-700 text-lg mb-4">
                            Looking to customize your trip?
                        </p>
                        <a href="#plan-trip">
                            <Button
                                variant="primary"
                                size="lg"
                                className="inline-flex items-center gap-2"
                            >
                                Enquire Now
                                <ArrowRight size={18} />
                            </Button>
                        </a>
                    </div>
                </section>

                {/* Itinerary */}
                <section className="mb-16">
                    <SectionHeading
                        title="Detailed Itinerary"
                        subtitle="Day-by-day breakdown of your journey."
                        centered={false}
                    />
                    <div className="space-y-4">
                        {itinerary.map((day, index) => (
                            <motion.div
                                key={index}
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    delay: index * 0.05,
                                }}
                                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0066FF] to-[#06B6D4] text-white flex items-center justify-center font-bold shrink-0">
                                        {day.day}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                                            {day.title}
                                        </h4>
                                        <p className="text-gray-600">
                                            {day.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Requirements */}
                <section className="mb-16">
                    <SectionHeading
                        title="Trek Requirements"
                        subtitle="What you need to know before booking."
                        centered={false}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="w-12 h-12 bg-blue-100 text-[#0066FF] rounded-lg flex items-center justify-center mb-4">
                                <Heart size={24} />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">
                                Fitness Level
                            </h4>
                            <p className="text-gray-600 text-sm">
                                Good physical condition required. Ability to
                                walk 5-7 hours daily with a daypack.
                            </p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="w-12 h-12 bg-purple-100 text-[#8B5CF6] rounded-lg flex items-center justify-center mb-4">
                                <Shield size={24} />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">
                                Travel Insurance
                            </h4>
                            <p className="text-gray-600 text-sm">
                                Mandatory coverage for high-altitude trekking
                                and emergency helicopter evacuation.
                            </p>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="w-12 h-12 bg-cyan-100 text-[#06B6D4] rounded-lg flex items-center justify-center mb-4">
                                <Compass size={24} />
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">
                                Best Season
                            </h4>
                            <p className="text-gray-600 text-sm">
                                March-May (spring) and September-November
                                (autumn) offer the best weather and views.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Trek to Everest Base Camp?
                    </h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                        Join us for this once-in-a-lifetime adventure. Our
                        expert Sherpa guides are ready to make your dream a
                        reality.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button variant="primary" size="lg">
                            Book This Trek
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white hover:text-gray-900"
                        >
                            Contact Us
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
