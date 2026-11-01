import React, { useEffect, useState } from "react";
import { SectionHeading } from "./ui/SectionHeading";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
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

interface LegalDocument {
    title: string;
    image: string;
    issuer: string;
    license_no: string;
    valid_until: string;
    document_file: string;
}

function LegalDocumentsSection() {
    const [data, setData] = useState<LegalDocument[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchLegalDocuments = async () => {
        try {
            const res = await fetchData<LegalDocument[]>("/components/legal-documents");
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
        fetchLegalDocuments();
    }, []);

    if (loading || !data || data.length === 0) return null;

    return (
        <section className="py-20 px-4 max-w-7xl mx-auto">
            <SectionHeading 
                title="Official Licenses & Certificates" 
                subtitle="Valid and up-to-date documentation" 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.map((doc, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 30 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true }} 
                        transition={{ delay: index * 0.1 }} 
                        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-stone-100"
                    >
                        <div className="relative h-64 overflow-hidden bg-slate-100">
                            {doc.image ? (
                                <img 
                                    src={`${BASE_URL}/${doc.image}`} 
                                    alt={doc.title} 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400">
                                    No Preview Available
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                                    <p className="text-xs text-slate-600 uppercase tracking-wide">
                                        License Preview
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-stone-900 mb-4">
                                {doc.title}
                            </h3>
                            <div className="space-y-2 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-sm text-stone-600">Issued by:</span>
                                    <span className="text-sm font-semibold text-stone-900">
                                        {doc.issuer}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-stone-600">License No:</span>
                                    <span className="text-sm font-semibold text-stone-900">
                                        {doc.license_no}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-stone-600">Valid Until:</span>
                                    <span className="text-sm font-semibold text-green-600">
                                        {doc.valid_until}
                                    </span>
                                </div>
                            </div>
                            {doc.document_file && (
                                <a 
                                    href={`/legal-documents/${slugify(doc.title)}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-lg font-medium transition-colors"
                                >
                                    <Download size={18} />
                                    View Full Document
                                </a>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

export default LegalDocumentsSection;
