import React, { use, useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SectionHeading } from "./ui/SectionHeading";
import { animate, motion } from "framer-motion";
import { Users, Award, Heart, Mountain } from "lucide-react";
import { useParams } from "react-router-dom";
import { fetchData } from "../axiosHook";
import BASE_URL from "../global";
import { da } from "filepond/locale/da-dk";
import { animatedNumber, numberToWords } from "../utils/utils";
const teamMembers = [
    {
        name: "Pemba Sherpa",
        role: "Lead Guide & Operations Director",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
        experience: "15+ years",
        specialty: "Everest Region Expert",
    },
    {
        name: "Sarah Mitchell",
        role: "International Relations Manager",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop",
        experience: "8 years",
        specialty: "Client Experience",
    },
    {
        name: "Ang Dorje Sherpa",
        role: "Senior Trekking Guide",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop",
        experience: "12 years",
        specialty: "Annapurna Circuit",
    },
    {
        name: "Maya Gurung",
        role: "Cultural Experience Coordinator",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
        experience: "6 years",
        specialty: "Cultural Tours",
    },
    {
        name: "Tenzing Norgay",
        role: "High Altitude Specialist",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
        experience: "10 years",
        specialty: "Technical Climbs",
    },
    {
        name: "Lakpa Sherpa",
        role: "Logistics & Safety Manager",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
        experience: "14 years",
        specialty: "Safety Protocols",
    },
];



function StatsSection() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const fetchHomepageData = async () => {
        try {
            const res = await fetchData("/components/stats");

            if (res) {
                // API may return an array directly or wrap it in a key
                const arr = Array.isArray(res)
                    ? res
                    : Array.isArray(res?.data)
                    ? res.data
                    : [];
                setData(arr);
            } else {
                setData([]);
            }
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

  useEffect(() => {
    
        fetchHomepageData();
    
}, []);

    if (loading) return null;
    if (error || !Array.isArray(data) || data.length === 0) return null;

    return (
            <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-cyan-600">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {data &&
                            data.map((stat, index) => (
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
                                        delay: index * 0.1,
                                    }}
                                    className="text-center text-white"
                                >
                                    <div className="flex justify-center mb-4">
                                        {stat.icon && (
                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={
                                                        BASE_URL +
                                                        "/" +
                                                        stat.icon
                                                    }
                                                    alt={stat.title}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-4xl font-bold mb-2">
                                        {stat.number}
                                        {stat.symbol}
                                    </p>
                                    <p className="text-blue-100 text-sm">
                                        {stat.title}
                                    </p>
                                </motion.div>
                            ))}
                    </div>
                </div>
            </section>
    );
}

export default StatsSection;