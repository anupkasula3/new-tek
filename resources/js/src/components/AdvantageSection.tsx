import React, { use, useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SectionHeading } from "./ui/SectionHeading";
import { motion } from "framer-motion";
import { Users, Award, Heart, Mountain } from "lucide-react";
import { useParams } from "react-router-dom";
import { fetchData } from "../axiosHook";
import BASE_URL from "../global";
import { numberToWords } from "../utils/utils";

function  AdvantageSection() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const fetchHomepageData = async () => {
        try {
            const res = await fetchData("/components/advantages");

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
    if (error || !data || data.length === 0) return null;

    return (
           <section className="bg-stone-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <SectionHeading title={numberToWords(data.length) + " Reasons to Trek With Us"} subtitle="Our Advantage" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data?.map((reason, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300">
                {reason.icon && (
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                  <img src={BASE_URL +'storage/'+ reason.icon} alt={reason.title} />
                </div>
                )}
                <h3 className="text-xl font-bold text-stone-900 mb-3">
                  {reason.title}
                </h3>
     
                <div dangerouslySetInnerHTML={{ __html: reason.description }} className="text-stone-600 leading-relaxed" />
                
              </motion.div>)}
          </div>
        </div>
      </section>
    );
}

export default AdvantageSection;