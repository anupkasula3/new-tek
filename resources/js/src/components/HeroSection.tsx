import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/Button";
import { ChevronDown } from "lucide-react";
import BASE_URL from "../global";
import { fetchData } from "../axiosHook";

export function HeroSection({
    data,
    loading,
    error,
}: {
    data: any;
    loading: boolean;
    error: boolean;
}) {
    const [credibilities, setCredibilities] = useState<any[]>([]);

    useEffect(() => {
        fetchData<any[]>("/components/credibilities")
            .then((res) => {
                if (res) {
                    setCredibilities(res);
                }
            })
            .catch((err) => console.error("Error fetching credibilities:", err));
    }, []);

    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    return (
        <div
            ref={ref}
            className="relative w-full overflow-hidden flex flex-col items-center  pb-8"
            style={{ minHeight: '100vh', paddingTop: 'calc(var(--header-height, 80px) + 48px)' }}
        >
            {/* Background Image with Parallax */}
            <motion.div
                style={{
                    y,
                }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/65 z-10" />
                <img
                    src={
                        data?.banner_image
                            ? `${BASE_URL}/${data?.banner_image}`
                            : "https://himalayantrekking.com/storage/uploads/01KFGTVRVC725XK0W16AE29TY6.jpg"
                    }
                    alt="Himalayan Mountains"
                    className="w-full h-full object-cover"
                />
            </motion.div>

            {/* Content */}
            <div className="relative z-20 text-center px-4 max-w-6xl mx-auto w-full flex flex-col justify-center flex-1">
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
                        ease: "easeOut",
                    }}
                    className="flex flex-col items-center"
                >
                    {data?.top_title && (
                        <h2 className="text-lg md:text-xl font-semibold text-[#06B6D4] mb-4 tracking-widest uppercase">
                            {data.top_title}
                        </h2>
                    )}
                    {data?.title && (
                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-md">
                            {data.title} <br />
                            {data?.highlight && (
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] via-[#8B5CF6] to-[#06B6D4]">
                                    {data.highlight}
                                </span>
                            )}
                        </h1>
                    )}
                    {data?.subtitle && (
                        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow">
                            {data.subtitle}
                        </p>
                    )}

                    {data?.links && (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            {data.links.map((link: any, index: number) => (
                                <a href={link.url} key={index}>
                                <Button
                                    variant={link.type}
                                    size="lg"
                                    className="min-w-[180px]"
                                   
                                >
                                    {link.label}
                                </Button>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Credibility Bar */}
                    {credibilities.length > 0 && (
                        <div className="w-fit mt-4 mx-auto">
                            <div className="flex flex-wrap justify-center items-stretch gap-4">
                                {credibilities.map((item) => (
                                    <div key={item.id} className="flex flex-row items-center justify-center gap-4 px-6 py-3 text-left bg-black/40 rounded-2xl shadow-xl border border-white/10">
                                        {item.icon && (
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={`${BASE_URL}/${item.icon}`}
                                                    alt={item.title}
                                                    className="w-10 h-10 object-contain text-blue-400 "
                                                />
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="font-extrabold text-white text-base md:text-lg leading-tight max-w-[150px]">
                                                {item.title}
                                            </span>
                                            <span className="text-xs text-blue-200/80 font-semibold mt-0.5 max-w-[150px]">
                                                {item.detail}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            
        </div>
    );
}
