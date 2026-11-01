import { ArrowRight, Calendar, Clock, Quote, Tag, User } from "lucide-react";
import React, { memo } from "react";

import { Button } from "../components/ui/Button";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { motion } from "framer-motion";
const relatedTrips = [
    {
        title: "Everest Base Camp Trek",
        duration: "14 Days",
        price: "$1,450",
        image: "https://images.unsplash.com/photo-1533130061792-649d45df8c2d?q=80&w=1978&auto=format&fit=crop",
        link: "#everest-base-camp",
    },
    {
        title: "Annapurna Circuit",
        duration: "16 Days",
        price: "$1,250",
        image: "https://images.unsplash.com/photo-1548588627-f978862b85e1?q=80&w=2072&auto=format&fit=crop",
        link: "#",
    },
    {
        title: "Langtang Valley",
        duration: "9 Days",
        price: "$950",
        image: "https://images.unsplash.com/photo-1623492701902-47d3be136e96?q=80&w=2070&auto=format&fit=crop",
        link: "#",
    },
];
export function BlogPostPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1548588627-f978862b85e1?q=80&w=2072&auto=format&fit=crop"
                        alt="Trekking Gear"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-20 w-full px-4 pb-12 mt-16">
                    <div className="max-w-4xl mx-auto">
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
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-[#0066FF] text-white px-4 py-1 rounded-full text-sm font-semibold">
                                    Guides
                                </span>
                                <span className="text-white/80 text-sm flex items-center gap-2">
                                    <Clock size={16} /> 12 min read
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                Essential Gear for Everest Base Camp: The
                                Complete Packing Guide
                            </h1>
                            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
                                <span className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    March 15, 2024
                                </span>
                                <span className="flex items-center gap-2">
                                    <User size={16} />
                                    By Pemba Sherpa
                                </span>
                                <span className="flex items-center gap-2">
                                    <Tag size={16} />
                                    Trekking Tips
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
                {/* Introduction */}
                <div className="prose prose-lg max-w-none mb-12">
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Planning a trek to Everest Base Camp is a dream for many
                        adventurers. Standing at 5,364 meters (17,598 feet),
                        reaching the base of the world's highest mountain
                        requires careful preparation, and having the right gear
                        can make the difference between an unforgettable
                        experience and a challenging ordeal.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        After guiding hundreds of trekkers to Everest Base Camp
                        over the past 15 years, I've seen firsthand what works
                        and what doesn't. In this comprehensive guide, I'll
                        share everything you need to know about packing for this
                        iconic trek, from essential clothing layers to
                        often-overlooked items that can significantly improve
                        your comfort and safety.
                    </p>
                </div>

                {/* Featured Image */}
                <motion.figure
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
                    className="mb-12 rounded-2xl overflow-hidden shadow-xl"
                >
                    <img
                        src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop"
                        alt="Trekker with gear in Himalayas"
                        className="w-full h-auto"
                    />
                    <figcaption className="bg-gray-50 px-6 py-4 text-sm text-gray-600 italic">
                        A well-prepared trekker ascending towards Everest Base
                        Camp with proper gear and equipment
                    </figcaption>
                </motion.figure>

                {/* Section 1: Understanding the Climate */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Understanding the Himalayan Climate
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p>
                            The Khumbu region experiences dramatic temperature
                            variations depending on altitude and time of day. At
                            lower elevations like Lukla (2,860m), daytime
                            temperatures can be pleasant, ranging from 15-20°C
                            in spring and autumn. However, as you ascend towards
                            Everest Base Camp, temperatures drop significantly.
                        </p>
                        <p>
                            At Gorak Shep (5,164m), the last settlement before
                            base camp, nighttime temperatures regularly plummet
                            to -10°C to -20°C, even during peak trekking
                            seasons. Early morning starts for Kala Patthar can
                            expose you to temperatures as low as -25°C with wind
                            chill. Understanding these conditions is crucial for
                            selecting appropriate gear.
                        </p>
                        <p>
                            The two main trekking seasons—spring (March to May)
                            and autumn (September to November)—offer the most
                            stable weather, but you must still prepare for all
                            conditions. Sudden weather changes are common in the
                            mountains, and what starts as a sunny morning can
                            quickly turn into a snowstorm by afternoon.
                        </p>
                    </div>
                </section>

                {/* Pull Quote */}
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.95,
                    }}
                    whileInView={{
                        opacity: 1,
                        scale: 1,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="my-12 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-[#0066FF] p-8 rounded-r-xl"
                >
                    <Quote className="text-[#0066FF] mb-4" size={32} />
                    <p className="text-xl text-gray-800 italic font-medium leading-relaxed">
                        "The mountains don't care about your experience or
                        fitness level. They only care about your preparation.
                        Proper gear isn't a luxury—it's your insurance policy
                        against the unpredictable Himalayan weather."
                    </p>
                    <p className="text-gray-600 mt-4 font-semibold">
                        — Pemba Sherpa, Lead Guide
                    </p>
                </motion.div>

                {/* Section 2: The Layering System */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Mastering the Three-Layer System
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p>
                            The key to staying comfortable in the mountains is
                            the three-layer clothing system: base layer,
                            insulation layer, and outer shell. This system
                            allows you to regulate your body temperature by
                            adding or removing layers as conditions change
                            throughout the day.
                        </p>

                        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                            Base Layer: Your Foundation
                        </h3>
                        <p>
                            Your base layer sits directly against your skin and
                            is responsible for moisture management. Never use
                            cotton—it absorbs sweat and stays wet, which can
                            lead to hypothermia. Instead, opt for merino wool or
                            synthetic materials like polyester.
                        </p>
                        <p>
                            I recommend bringing at least three sets of base
                            layers: lightweight for lower elevations and warmer
                            days, midweight for most of the trek, and
                            heavyweight thermal underwear for high-altitude
                            nights and early morning starts. Merino wool is my
                            personal favorite because it naturally resists
                            odors, allowing you to wear it multiple days without
                            washing.
                        </p>

                        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                            Insulation Layer: Trapping Warmth
                        </h3>
                        <p>
                            The insulation layer's job is to trap warm air close
                            to your body. Fleece jackets and down jackets are
                            the most common choices. A mid-weight fleece jacket
                            is perfect for active trekking, while a down jacket
                            (rated for at least -20°C) is essential for evenings
                            and rest stops.
                        </p>
                        <p>
                            Down jackets offer the best warmth-to-weight ratio,
                            but they lose insulating properties when wet.
                            Synthetic insulation performs better in damp
                            conditions but is bulkier. I suggest bringing both:
                            a lightweight down jacket for dry, cold conditions
                            and a synthetic jacket as backup.
                        </p>

                        <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                            Outer Layer: Weather Protection
                        </h3>
                        <p>
                            Your outer shell protects you from wind, rain, and
                            snow. A quality waterproof, breathable jacket with a
                            hood is non-negotiable. Look for jackets with
                            Gore-Tex or similar membranes that keep water out
                            while allowing sweat vapor to escape.
                        </p>
                        <p>
                            The same principle applies to pants. Waterproof
                            trekking pants or rain pants over your regular
                            trekking pants will keep you dry during unexpected
                            weather. Pit zips and leg zips provide ventilation
                            when you're working hard on steep ascents.
                        </p>
                    </div>
                </section>

                {/* Gear Table */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Complete Gear Checklist
                    </h2>
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-[#0066FF] to-[#06B6D4] text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">
                                        Category
                                    </th>
                                    <th className="px-6 py-4 text-left font-semibold">
                                        Item
                                    </th>
                                    <th className="px-6 py-4 text-left font-semibold">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-4 text-left font-semibold">
                                        Priority
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr className="bg-white hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        Clothing
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        Moisture-wicking base layers
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        3 sets
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            Essential
                                        </span>
                                    </td>
                                </tr>
                                <tr className="bg-gray-50 hover:bg-gray-100">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        Clothing
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        Down jacket (-20°C rated)
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        1
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            Essential
                                        </span>
                                    </td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        Clothing
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        Waterproof shell jacket
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        1
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            Essential
                                        </span>
                                    </td>
                                </tr>
                                <tr className="bg-gray-50 hover:bg-gray-100">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        Footwear
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        Waterproof trekking boots
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        1 pair
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            Essential
                                        </span>
                                    </td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        Footwear
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        Warm wool socks
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        4-5 pairs
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            Essential
                                        </span>
                                    </td>
                                </tr>
                                <tr className="bg-gray-50 hover:bg-gray-100">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        Accessories
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        Warm hat & sun hat
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        1 each
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            Essential
                                        </span>
                                    </td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        Accessories
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        Insulated gloves & liner gloves
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        1 pair each
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            Essential
                                        </span>
                                    </td>
                                </tr>
                                <tr className="bg-gray-50 hover:bg-gray-100">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        Equipment
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        Sleeping bag (-20°C rated)
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        1
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            Essential
                                        </span>
                                    </td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        Equipment
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        Trekking poles
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        1 pair
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            Recommended
                                        </span>
                                    </td>
                                </tr>
                                <tr className="bg-gray-50 hover:bg-gray-100">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        Equipment
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        Headlamp with extra batteries
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        1
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            Essential
                                        </span>
                                    </td>
                                </tr>
                                <tr className="bg-white hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        Health
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        Sunscreen (SPF 50+)
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        1 tube
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            Essential
                                        </span>
                                    </td>
                                </tr>
                                <tr className="bg-gray-50 hover:bg-gray-100">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        Health
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        Water purification tablets
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        50 tablets
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                                            Recommended
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Image Section */}
                <motion.figure
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
                    className="mb-12 rounded-2xl overflow-hidden shadow-xl"
                >
                    <img
                        src="https://images.unsplash.com/photo-1589553416260-f586c8f1514f?q=80&w=2070&auto=format&fit=crop"
                        alt="Sherpa guide with trekking equipment"
                        className="w-full h-auto"
                    />
                    <figcaption className="bg-gray-50 px-6 py-4 text-sm text-gray-600 italic">
                        An experienced Sherpa guide demonstrating proper gear
                        organization before a high-altitude trek
                    </figcaption>
                </motion.figure>

                {/* Section 3: Footwear */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Footwear: Your Most Important Investment
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p>
                            Your boots will carry you over 130 kilometers of
                            varied terrain, from river crossings to rocky
                            moraine and potentially snow-covered passes.
                            Investing in quality footwear is not optional—it's
                            the single most important gear decision you'll make.
                        </p>
                        <p>
                            Look for boots with these characteristics:
                            waterproof (Gore-Tex or similar), ankle support,
                            stiff sole for rocky terrain, insulation for cold
                            temperatures, and a proven break-in period. Never
                            attempt this trek in new boots. Wear them for at
                            least 50 kilometers before your trip to ensure
                            they're properly broken in.
                        </p>
                        <p>
                            I've seen countless trekkers suffer from blisters,
                            cold feet, and even frostbite due to inadequate
                            footwear. Your boots should be comfortable with
                            thick socks, have enough room for your toes to move
                            (feet swell at altitude), and provide excellent
                            traction on both wet and dry surfaces.
                        </p>
                        <p>
                            Don't forget about camp shoes. After a long day of
                            trekking, your feet need to breathe. Lightweight
                            down booties or comfortable sandals (with socks in
                            cold weather) give your feet a much-needed break and
                            help prevent fungal infections.
                        </p>
                    </div>
                </section>

                {/* Section 4: Technical Equipment */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Technical Equipment and Accessories
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p>
                            Beyond clothing, several pieces of technical
                            equipment significantly enhance your trekking
                            experience and safety. A quality sleeping bag rated
                            for at least -20°C is essential—teahouse blankets
                            alone won't keep you warm at high altitude.
                        </p>
                        <p>
                            Trekking poles reduce stress on your knees during
                            descents and provide stability on uneven terrain.
                            Studies show they can reduce knee impact by up to
                            25%, which is significant over a two-week trek.
                            Adjustable poles allow you to modify length for
                            ascents and descents.
                        </p>
                        <p>
                            A reliable headlamp is crucial for early morning
                            starts (like the pre-dawn hike to Kala Patthar) and
                            navigating to bathrooms at night. Bring extra
                            batteries—cold temperatures drain battery life
                            quickly. LED headlamps with red light modes help
                            preserve night vision.
                        </p>
                        <p>
                            Water purification is another critical
                            consideration. While teahouses provide boiled water
                            (for a fee), having your own purification
                            method—whether tablets, UV light, or a filter—gives
                            you independence and saves money. Aim to drink 3-4
                            liters daily to combat altitude effects.
                        </p>
                    </div>
                </section>

                {/* Pull Quote 2 */}
                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.95,
                    }}
                    whileInView={{
                        opacity: 1,
                        scale: 1,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="my-12 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-[#8B5CF6] p-8 rounded-r-xl"
                >
                    <Quote className="text-[#8B5CF6] mb-4" size={32} />
                    <p className="text-xl text-gray-800 italic font-medium leading-relaxed">
                        "I've guided over 500 treks to Everest Base Camp. The
                        trekkers who enjoy it most aren't necessarily the
                        fittest—they're the ones who packed smart and stayed
                        comfortable throughout the journey."
                    </p>
                    <p className="text-gray-600 mt-4 font-semibold">
                        — Tenzing Norgay, Senior Guide
                    </p>
                </motion.div>

                {/* Section 5: Health and Safety */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Health, Safety, and Personal Care
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p>
                            The intense UV radiation at high altitude can cause
                            severe sunburn in minutes. Pack high-SPF sunscreen
                            (50+) and apply it liberally, even on cloudy days.
                            Don't forget lip balm with SPF—chapped, sunburned
                            lips are miserable at altitude.
                        </p>
                        <p>
                            Sunglasses are mandatory equipment, not accessories.
                            Choose glasses that block 100% of UV rays and have
                            side shields to prevent snow blindness. Glacier
                            glasses or Category 4 lenses are ideal for
                            high-altitude sections.
                        </p>
                        <p>
                            A comprehensive first aid kit should include:
                            blister treatment (Compeed or moleskin), pain
                            relievers (ibuprofen and acetaminophen), altitude
                            sickness medication (Diamox if prescribed),
                            antibiotics for stomach issues, and personal
                            medications. Our guides carry extensive medical
                            supplies, but having your own basics provides peace
                            of mind.
                        </p>
                        <p>
                            Hand sanitizer and wet wipes become your best
                            friends when water is scarce and cold. Baby wipes
                            are excellent for quick "showers" when you're too
                            tired or it's too cold for a proper wash. Toilet
                            paper and a small trowel are essential—not all
                            teahouses have Western toilets, and you'll need to
                            be self-sufficient on trail.
                        </p>
                    </div>
                </section>

                {/* Section 6: Electronics and Documentation */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Electronics, Documentation, and Extras
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p>
                            In today's connected world, most trekkers want to
                            document their journey and stay in touch with home.
                            A smartphone with a good camera serves multiple
                            purposes, but bring a portable power bank—charging
                            opportunities are limited and expensive at high
                            altitude.
                        </p>
                        <p>
                            Consider a dedicated camera if photography is
                            important to you. The Himalayas offer
                            once-in-a-lifetime shots, and smartphone cameras,
                            while improving, still can't match a good DSLR or
                            mirrorless camera in challenging light conditions.
                            Bring extra memory cards and batteries.
                        </p>
                        <p>
                            Essential documents include your passport (with
                            Nepal visa), travel insurance documents (must cover
                            high-altitude trekking and helicopter evacuation),
                            trekking permits (TIMS card and Sagarmatha National
                            Park permit), and emergency contact information.
                            Keep copies separate from originals.
                        </p>
                        <p>
                            A small daypack (20-30 liters) carries your daily
                            essentials while porters transport your main bag.
                            Pack your daypack with: water bottles, snacks,
                            camera, extra layers, sunscreen, first aid kit, and
                            valuables. Never put essential items in your porter
                            bag—you won't see it until evening.
                        </p>
                    </div>
                </section>

                {/* Video Section */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Watch: Packing Demonstration
                    </h2>
                    <motion.div
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
                        className="rounded-2xl overflow-hidden shadow-xl"
                    >
                        <div className="relative pb-[56.25%] h-0">
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src="https://www.youtube.com/embed/I2I4EySGYEU?si=wccCkVUZv6t4QWtT"
                                title="Everest Base Camp Packing Guide"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                        <div className="bg-gray-50 px-6 py-4">
                            <p className="text-sm text-gray-600">
                                Watch our lead guide Pemba demonstrate how to
                                efficiently pack for Everest Base Camp,
                                including layering techniques and weight
                                distribution tips.
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* Section 7: Final Tips */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Final Packing Tips and Common Mistakes
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p>
                            After years of guiding, I've noticed patterns in
                            what separates comfortable trekkers from struggling
                            ones. Here are the most common packing mistakes and
                            how to avoid them:
                        </p>
                        <p>
                            <strong>
                                Overpacking is the number one error.
                            </strong>{" "}
                            Every extra kilogram makes the trek harder. Be
                            ruthless in your packing—if you're unsure whether
                            you'll need something, you probably won't. Remember,
                            you can buy basic supplies in Namche Bazaar if
                            needed.
                        </p>
                        <p>
                            <strong>
                                Underestimating the cold is dangerous.
                            </strong>{" "}
                            Even experienced mountaineers are surprised by how
                            cold it gets at night. That -20°C sleeping bag isn't
                            overkill—it's necessary. The same goes for your down
                            jacket and warm layers.
                        </p>
                        <p>
                            <strong>
                                Neglecting foot care leads to misery.
                            </strong>{" "}
                            Bring multiple pairs of socks, foot powder, and
                            blister treatment. Start treating hot spots
                            immediately—don't wait for full blisters to develop.
                            Many treks are cut short due to foot problems that
                            could have been prevented.
                        </p>
                        <p>
                            <strong>
                                Forgetting backup plans causes stress.
                            </strong>{" "}
                            Bring backup batteries, an extra pair of glasses if
                            you wear them, and duplicate essential medications.
                            Mountain weather and logistics are
                            unpredictable—redundancy in critical items provides
                            peace of mind.
                        </p>
                    </div>
                </section>

                {/* Conclusion */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Conclusion: Preparation Equals Enjoyment
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                        <p>
                            The Everest Base Camp trek is challenging but
                            achievable with proper preparation. Your gear
                            doesn't need to be the most expensive, but it must
                            be appropriate for the conditions and well-tested
                            before your departure.
                        </p>
                        <p>
                            Start gathering your gear at least two months before
                            your trek. This gives you time to test everything,
                            make adjustments, and replace items that don't work.
                            Break in your boots, practice with your trekking
                            poles, and sleep in your sleeping bag to ensure it's
                            warm enough.
                        </p>
                        <p>
                            Remember, the goal isn't just to reach Everest Base
                            Camp—it's to enjoy the journey. Proper gear allows
                            you to focus on the incredible scenery, rich
                            culture, and personal achievement rather than being
                            distracted by discomfort or cold.
                        </p>
                        <p>
                            If you have questions about specific gear or need
                            recommendations, don't hesitate to contact us. We're
                            here to ensure your trek is safe, comfortable, and
                            unforgettable. The mountains are waiting—are you
                            ready?
                        </p>
                    </div>
                </section>

                {/* Related Trips */}
                <section className="mb-12 bg-gray-50 rounded-2xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Explore Our Packages
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedTrips.map((trip, index) => (
                            <motion.a
                                key={index}
                                href={trip.link}
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
                                    delay: index * 0.1,
                                }}
                                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={trip.image}
                                        alt={trip.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                                        {trip.title}
                                    </h3>
                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                                        <span>{trip.duration}</span>
                                        <span className="font-bold text-[#0066FF]">
                                            {trip.price}
                                        </span>
                                    </div>
                                    <span className="text-[#0066FF] font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                                        View Details <ArrowRight size={16} />
                                    </span>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </section>

                {/* Pro Tips Section */}
                <section className="mb-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="w-10 h-10 bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-full flex items-center justify-center text-white font-bold">
                            💡
                        </span>
                        Pro Tips
                    </h2>
                    <ul className="space-y-4">
                        {[
                            "Start your gear shopping 2-3 months before departure to allow time for testing and returns. Break in your boots with at least 50km of walking before the trek.",
                            "Layer your clothing in your backpack strategically—keep rain gear and warm layers easily accessible at the top, as weather can change rapidly.",
                            "Invest in quality merino wool base layers. They're worth the extra cost—they regulate temperature better, dry faster, and resist odors so you can wear them multiple days.",
                            "Don't skimp on your sleeping bag rating. A -20°C bag might seem excessive, but you'll be grateful at Gorak Shep when temperatures plummet at night.",
                            "Pack a small dry bag for electronics and important documents. Even with waterproof gear, unexpected rain or river crossings can happen.",
                            "Bring duct tape and safety pins—they're lightweight miracle workers for emergency gear repairs, blisters, and countless other situations on the trail.",
                        ].map((tip, index) => (
                            <motion.li
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
                                className="flex items-start gap-4 text-gray-700"
                            >
                                <span className="w-6 h-6 rounded-full bg-[#0066FF] text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                                    {index + 1}
                                </span>
                                <p className="leading-relaxed">{tip}</p>
                            </motion.li>
                        ))}
                    </ul>
                </section>

                {/* CTA */}
                <div className="bg-gradient-to-r from-[#0066FF] to-[#06B6D4] rounded-2xl p-8 md:p-12 text-center text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                        Start Planning Your Adventure
                    </h3>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        Have questions about gear or ready to book your trek?
                        Our team of experienced guides is here to help you
                        prepare for the journey of a lifetime.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="primary"
                            size="lg"
                            className="bg-white text-[#0066FF] hover:bg-gray-100 border-none"
                        >
                            Book Your Trek
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white hover:text-[#0066FF]"
                        >
                            Contact Our Team
                        </Button>
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
}
