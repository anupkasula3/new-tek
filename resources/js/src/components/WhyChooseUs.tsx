import React, { useEffect, useState } from "react";
import { Award, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeading } from "./ui/SectionHeading";
import { fetchData } from "../axiosHook";
import BASE_URL from "../global";
import { da } from 'filepond/locale/da-dk';
const reasons = [
    {
        icon: Award,
        title: "Expert Local Guides",
        description:
            "Our team consists of certified Sherpa guides with decades of experience in high-altitude trekking and deep local knowledge.",
        color: "from-blue-400 to-blue-600",
    },
    {
        icon: Shield,
        title: "Safety First",
        description:
            "Your safety is our priority. We carry comprehensive medical kits, oxygen cylinders, and have 24/7 helicopter rescue protocols.",
        color: "from-purple-400 to-purple-600",
    },
    {
        icon: Users,
        title: "Small Groups",
        description:
            "We keep our groups small (max 10 people) to ensure personalized attention, flexibility, and a more authentic experience.",
        color: "from-cyan-400 to-cyan-600",
    },
];
export function WhyChooseUs() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchHomepageData = async () => {
        try {
            const res = await fetchData("/components/why-choose");
         

            if (res) {
                setData(res);
            } else {
                setData(null);
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
    if (error || !data || !data?.items || data?.items?.length === 0) return null;

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title={data?.title}
                    subtitle={data?.subtitle}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {data?.items?.map((reason, index) => {
        const gradientBg =
            index % 3 === 0
                ? "from-blue-400 to-blue-600"
                : index % 3 === 1
                ? "from-purple-400 to-purple-600"
                : "from-cyan-400 to-cyan-600";

        // ✅ Clean HTML (remove unwanted div wrappers)
        const cleanDescription = (reason?.item_description || "")
            .replace(/<div[^>]*>/g, "")
            .replace(/<\/div>/g, "")
            .replace(/class="[^"]*"/g, "");

        return (
            <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                    duration: 0.5,
                    delay: index * 0.2,
                }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative overflow-hidden group"
            >
                {/* Background gradient */}
                <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientBg} opacity-5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`}
                />

                {/* Icon */}
                <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradientBg} flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                    {reason?.item_icon && (
                        <img
                            src={`${BASE_URL}/${reason.item_icon}`}
                            alt={reason?.item_title || "icon"}
                            className="w-6 h-6 object-contain"
                        />
                    )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {reason?.item_title}
                </h3>

                {/* Description */}
                <div
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{
                        __html: cleanDescription,
                    }}
                />
            </motion.div>
        );
    })}
</div>
            </div>
        </section>
    );
}
