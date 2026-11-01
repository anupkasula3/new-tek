import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import {
    Award,
    ChevronDown,
    FileText,
    Shield,
    ArrowLeft,
    Star,
    Sparkles,
    ExternalLink,
    User,
    Clock,
} from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { fetchData } from "../axiosHook";
import BASE_URL from "../global";

/* ─── Helpers ─────────────────────────────────────────────────────── */
const slugify = (text: string) =>
    text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");

/* ─── Types ───────────────────────────────────────────────────────── */
interface Certificate {
    title: string;
    file: string;
}

interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: string;
    experience: string;
    specialty: string;
    bio: string;
    certificates: Certificate[];
}

/* ─── Single cert accordion item ─────────────────────────────────── */
function CertAccordionItem({
    member,
    cert,
    index,
    isOpen,
    onToggle,
}: {
    member: TeamMember;
    cert: Certificate;
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}) {
    const viewUrl = `/team/${slugify(member.name)}/${slugify(cert.title)}`;
    // BASE_URL already includes trailing slash from global.ts
    const fileUrl = cert.file ? `${BASE_URL}/${cert.file}` : null;
    const imageUrl = member.image ? `${BASE_URL}/${member.image}` : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className={`tmc-acc-item${isOpen ? " tmc-acc-item--open" : ""}`}
        >
            {/* ── Trigger header ── */}
            <button
                className="tmc-acc-header"
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <div className="tmc-acc-left">
                    <div className="tmc-acc-icon">
                        <Award size={18} />
                    </div>
                    <div className="tmc-acc-info">
                        <span className="tmc-acc-label">Certificate</span>
                        <h3 className="tmc-acc-title">{cert.title}</h3>
                    </div>
                </div>
                <div className="tmc-acc-right">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                            <Shield size={11} className="text-[#0066FF]" />
                                            Verified Authentic Credential
                                        </div>
                    <span className="tmc-acc-pill">
                        <Award size={12} />
                        Official
                    </span>
                    <ChevronDown
                        size={20}
                        className={`tmc-acc-chevron${isOpen ? " tmc-acc-chevron--open" : ""}`}
                    />
                </div>
            </button>

            {/* ── Animated body ── */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <div className="tmc-acc-body">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">

                                {/* Interactive PDF viewer - expanded to full-width */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="lg:col-span-12 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col"
                                    style={{ minHeight: "75vh" }}
                                >
                                  
                                    <div className="flex-1 w-full bg-slate-100 relative" style={{ }}>
                                        {fileUrl ? (
                                            fileUrl.toLowerCase().endsWith(".pdf") ? (
                                                <iframe
                                                    src={`${fileUrl}#toolbar=1&view=FitH`}
                                                    className="w-full h-full border-none animate-fadeIn"
                                                    style={{ }}
                                                    title={`${cert.title} – ${member.name}`}
                                                />
                                            ) : (
                                                <div className="w-full h-auto flex items-center justify-center bg-slate-200">
                                                    <img
                                                        src={fileUrl}
                                                        alt={`${cert.title} – ${member.name}`}
                                                        className="max-w-full object-contain rounded-lg shadow-lg border border-slate-300 animate-fadeIn"
                                                    />
                                                </div>
                                            )
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                                No file attached to this certificate.
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

/* ─── Main page ───────────────────────────────────────────────────── */
export function TeamMemberCertificatesPage() {
    const { memberName } = useParams<{ memberName: string }>();
    const [member, setMember] = useState<TeamMember | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [openIndex, setOpenIndex] = useState<number | null>(0);


    useEffect(() => {
        setLoading(true);
        setNotFound(false);
        fetchData<TeamMember[]>("/components/team")
            .then((res) => {
                const all = res ?? [];
                const matched = all.find((m) => slugify(m.name) === memberName);
                if (matched) {
                    setMember(matched);
                    setOpenIndex(matched.certificates?.length > 0 ? 0 : null);
                } else {
                    setNotFound(true);
                }
            })
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [memberName]);

    const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col">
            <Helmet>
                <title>
                    {member ? `${member.name} – Certificates` : "Team Member"} | Himalayan Bespoke
                </title>
                <meta
                    name="description"
                    content={
                        member
                            ? `Official certificates and credentials of ${member.name}, ${member.role} at Himalayan Bespoke.`
                            : "View team member credentials at Himalayan Bespoke."
                    }
                />
            </Helmet>

            <Navbar />

            {/* ── Hero Banner ── */}
            <div style={{ position: "relative", height: "60vh", minHeight: "500px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <img
                    src="/assets/images/banner_bg.jpg"
                    alt="Team Member Certificates"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/default_bg.jpg'; }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.70), rgba(0,0,0,0.50), rgba(0,0,0,0.82))", zIndex: 1 }} />
                <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 16px", maxWidth: "896px", margin: "64px auto 0", width: "100%" }}>
                    
                    <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.75rem)", fontWeight: 700, color: "#fff", marginBottom: "16px", lineHeight: 1.15 }}>
                        {member ? `${member.name}` : "Team Member Certificates"}
                    </h1>
                    <p style={{ fontSize: "1.125rem", color: "#e5e7eb", maxWidth: "42rem", margin: "0 auto" }}>
                        {member ? `${member.role} — Official credentials & verified certificates` : "Official credentials and verified certificates"}
                    </p>
                </div>
            </div>

            <style>{`
                /* ── Accordion items ─────────────────────── */
                .tmc-acc-item {
                    background: rgba(255,255,255,0.75);
                    border: 1px solid rgba(0,102,255,0.15);
                    border-radius: 16px;
                    overflow: hidden;
                    transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
                    box-shadow: 0 4px 20px rgba(15,23,42,0.05);
                    backdrop-filter: blur(8px);
                }
                .tmc-acc-item:hover {
                    border-color: rgba(0,102,255,0.35);
                    background: rgba(255,255,255,0.9);
                }
                .tmc-acc-item--open {
                    border-color: rgba(6,182,212,0.55) !important;
                    box-shadow: 0 8px 30px rgba(15,23,42,0.12);
                }
                .tmc-acc-header {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 22px 28px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: inherit;
                    text-align: left;
                    outline: none !important;
                    gap: 16px;
                }
                .tmc-acc-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    flex: 1;
                    min-width: 0;
                }
                .tmc-acc-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    background: rgba(0,102,255,0.08);
                    border: 1px solid rgba(0,102,255,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #0066FF;
                    flex-shrink: 0;
                }
                .tmc-acc-info {
                    display: flex;
                    flex-direction: column;
                    min-width: 0;
                }
                .tmc-acc-label {
                    font-size: 9px;
                    letter-spacing: 2.5px;
                    text-transform: uppercase;
                    color: #0066FF;
                    font-weight: 700;
                    margin-bottom: 3px;
                }
                .tmc-acc-title {
                    font-size: 18px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .tmc-acc-right {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    flex-shrink: 0;
                }
                .tmc-acc-pill {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    background: rgba(6,182,212,0.08);
                    border: 1px solid rgba(6,182,212,0.2);
                    color: #06B6D4;
                    font-size: 10px;
                    font-weight: 700;
                    padding: 4px 13px;
                    border-radius: 99px;
                    letter-spacing: 0.5px;
                }
                .tmc-acc-chevron {
                    color: #0066FF;
                    transition: transform 0.3s ease;
                    flex-shrink: 0;
                }
                .tmc-acc-chevron--open {
                    transform: rotate(180deg);
                }
                .tmc-acc-body {
                    border-top: 1px solid rgba(0,102,255,0.12);
                    padding: 28px 24px 32px;
                    background: rgba(248,250,252,0.5);
                }

                /* ── Responsive ──────────────────────────── */
                @media (max-width: 640px) {
                    .tmc-acc-header { padding: 16px; }
                    .tmc-acc-title { font-size: 14px; }
                    .tmc-acc-pill { display: none; }
                    .tmc-acc-body { padding: 16px 12px 20px; }
                }
            `}</style>

            <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 flex flex-col gap-10" style={{ position: "relative", zIndex: 1 }}>

                {loading ? (
                    <div className="flex-1 flex flex-col gap-10 animate-pulse">
                        {/* Member Card Skeleton */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl flex items-center gap-6">
                            <div className="w-24 h-24 bg-slate-200 rounded-full shrink-0" />
                            <div className="flex-1 space-y-3">
                                <div className="h-6 bg-slate-200 rounded-md w-1/4" />
                                <div className="h-4 bg-slate-200 rounded-md w-1/6" />
                                <div className="h-4 bg-slate-200 rounded-md w-1/3" />
                            </div>
                        </div>

                        {/* Title Header Skeleton */}
                        <div className="space-y-4">
                            <div className="h-3 bg-slate-200 rounded-md w-24" />
                            <div className="h-8 bg-slate-200 rounded-md w-64" />
                            <div className="h-1.5 bg-[#0066FF]/20 rounded-full w-24" />
                        </div>

                        {/* Accordion Item Skeletons */}
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-slate-200 rounded-md w-1/3" />
                                            <div className="h-3 bg-slate-200 rounded-md w-1/4" />
                                        </div>
                                    </div>
                                    <div className="w-5 h-5 bg-slate-200 rounded-full shrink-0" />
                                </div>
                            ))}
                        </div>
                    </div>

                ) : notFound || !member ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
                        <Award size={48} className="text-[#0066FF] mb-4" />
                        <h2 className="text-2xl font-bold mb-2 text-slate-800">Member Not Found</h2>
                        <p className="text-slate-500 mb-6 max-w-md">
                            The team member you are looking for does not exist or may have been updated.
                        </p>
                        <Link
                            to="/"
                            className="bg-gradient-to-r from-[#0066FF] to-[#06B6D4] text-white px-6 py-2.5 rounded-full font-semibold shadow-md"
                        >
                            Return to Homepage
                        </Link>
                    </div>

                ) : (
                    <>
                  
                        {/* ── Member hero banner ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl relative overflow-hidden flex items-center gap-6"
                        >
                            {/* Top accent line */}
                            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0066FF] to-[#06B6D4]" />

                            {/* Corner ornaments */}
                            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#0066FF]/25" />
                            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#0066FF]/25" />
                            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#0066FF]/25" />
                            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#0066FF]/25" />

                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#0066FF] shadow-lg flex-shrink-0">
                                {member.image ? (
                                    <img
                                        src={`${BASE_URL}/${member.image}`}
                                        alt={member.name}
                                        className="w-full h-full object-cover object-top"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[#0066FF]">
                                        <User size={32} />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] tracking-[3px] text-[#0066FF] uppercase font-bold mb-1">
                                    Team Member
                                </p>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight mb-1">
                                    {member.name}
                                </h1>
                                <p className="text-xs text-[#0066FF] uppercase tracking-wider font-semibold mb-2">
                                    {member.role}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {member.experience && (
                                        <span className="inline-flex items-center gap-1.5 bg-[#0066FF]/8 border border-[#0066FF]/20 text-[#0066FF] text-[11px] font-semibold px-3 py-1 rounded-full">
                                            <Star size={10} />
                                            {member.experience}
                                        </span>
                                    )}
                                    {member.specialty && (
                                        <span className="inline-flex items-center gap-1.5 bg-[#06B6D4]/8 border border-[#06B6D4]/20 text-[#06B6D4] text-[11px] font-semibold px-3 py-1 rounded-full">
                                            <Sparkles size={10} />
                                            {member.specialty}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1.5 bg-[#0066FF]/8 border border-[#0066FF]/20 text-[#0066FF] text-[11px] font-semibold px-3 py-1 rounded-full">
                                        <Award size={10} />
                                        {member.certificates?.length ?? 0} Certificate{(member.certificates?.length ?? 0) !== 1 ? "s" : ""}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* ── Biography Section ── */}
                        {member.bio && (
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl relative overflow-hidden"
                            >
                                <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                                    <FileText size={20} className="text-[#0066FF]" />
                                    Biography
                                </h3>
                                <div 
                                    className="text-slate-600 leading-relaxed text-base prose max-w-none" 
                                    dangerouslySetInnerHTML={{ __html: member.bio }}
                                />
                            </motion.div>
                        )}
                        
                        {/* ── Accordion heading ── */}
                        {member.certificates && member.certificates.length > 0 && (
                        <div className="mb-6">
                            <p className="text-lg max-w-2xl prose text-gray-600 mb-2">
                                Official Credentials
                            </p>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                                Certificates &amp; Licenses
                            </h2>

                            {/* ── Accordion list ── */}
                            
                                <div className="flex flex-col gap-4">
                                    {member.certificates.map((cert, i) => (
                                        <CertAccordionItem
                                            key={i}
                                            member={member}
                                            cert={cert}
                                            index={i}
                                            isOpen={openIndex === i}
                                            onToggle={() => toggle(i)}
                                        />
                                    ))}
                                </div>
                           
                        </div>
                         )}
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}
