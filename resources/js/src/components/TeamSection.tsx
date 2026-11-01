import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { SectionHeading } from "./ui/SectionHeading";
import { motion } from "framer-motion";
import { Users, Award, Heart, Mountain } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { fetchData } from "../axiosHook";
import BASE_URL from "../global";

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");
};

function TeamSection() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const fetchHomepageData = async () => {
        try {
            const res = await fetchData("/components/team");

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
          <SectionHeading title="Our Expert Team" subtitle="The people who make it happen" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data?.map((member: any, index: number) => {
              const profileUrl = `/team/${slugify(member.name)}`;
              return (
                <motion.div key={index} initial={{
                opacity: 0,
                y: 30
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: index * 0.1
              }} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <Link to={profileUrl} className="block group">
                      <div className="relative h-80 overflow-hidden">
                        <img 
                          src={`${BASE_URL}/${member.image}`} 
                          alt={member.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/images/default_bg.jpg';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                          <p className="text-blue-200 text-sm">{member.role}</p>
                        </div>
                        </div>
                      
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">
                            Experience
                          </p>
                          <p className="text-stone-900 font-semibold">
                            {member.experience}
                          </p>
                        </div>
                        {member.certificates && member.certificates.length > 0 && (
                        <div className="w-12 h-12 bg-blue-100 hover:bg-blue-200 transition-colors rounded-full flex items-center justify-center text-blue-600">
                          <Award size={24} />
                        </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">
                            Specialty
                          </p>
                          <p className="text-stone-900 font-semibold">
                            {member.specialty}
                          </p>
                        </div>
                        
                      </div>
                    </div>
                        </Link>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>
    );
}

export default TeamSection;