import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useParams } from "react-router-dom";
import { fetchData } from "../axiosHook";
import BASE_URL from "../global";
import { Award, FileText, ChevronDown, Shield, Star, Calendar, Sparkles } from "lucide-react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");
};

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

/* ─── Individual certificate card ───────────────────────────────── */
function MemberCertCard({
    member,
    cert,
    cardIndex,
}: {
    member: TeamMember;
    cert: Certificate;
    cardIndex: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: cardIndex * 0.08 }}
            className="team-cert-card"
        >
            <div className="tcc-outer">
                {/* Corner ornaments */}
                <span className="tcc-corner tcc-corner--tl" />
                <span className="tcc-corner tcc-corner--tr" />
                <span className="tcc-corner tcc-corner--bl" />
                <span className="tcc-corner tcc-corner--br" />

                {/* Top ribbon */}
                <div className="tcc-ribbon" />

                {/* Header */}
                <div className="tcc-header">
                    <p className="tcc-above">Certificate of Achievement</p>
                    <div className="tcc-divider">
                        <span className="tcc-dline" />
                        <span className="tcc-diamond" />
                        <span className="tcc-dline" />
                    </div>
                </div>

                {/* Body — member info */}
                <div className="tcc-body">
                    <p className="tcc-presented-to">Awarded to</p>
                    <h3 className="tcc-name">{member.name}</h3>
                    <p className="tcc-role">{member.role}</p>

                    <div className="tcc-divider tcc-divider--sm">
                        <span className="tcc-dline" />
                        <span className="tcc-diamond tcc-diamond--sm" />
                        <span className="tcc-dline" />
                    </div>

                    <p className="tcc-cert-label">for completing</p>
                    <h4 className="tcc-cert-title">{cert.title}</h4>
                </div>

                {/* View button */}
                <div className="tcc-view-wrap">
                    <a
                        href={`/team/${slugify(member.name)}/${slugify(cert.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tcc-view-btn"
                        style={{ textDecoration: "none" }}
                    >
                        <FileText size={14} />
                        View Credential
                    </a>
                </div>

                {/* Footer */}
                <div className="tcc-footer">
                    <div className="tcc-footer-left">
                        <Shield size={11} className="tcc-footer-icon" />
                        <span>Verified</span>
                    </div>
                    <div className="tcc-footer-center-seal">
                        <Award size={14} />
                    </div>
                    <div className="tcc-footer-right">
                        <span>Himalayan Bespoke</span>
                    </div>
                </div>

                {/* Bottom ribbon */}
                <div className="tcc-ribbon" />
            </div>
        </motion.div>
    );
}

/* ─── Main page component ────────────────────────────────────────── */
function TeamCertificatesSection() {
    const [data, setData] = useState<TeamMember[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [openMemberId, setOpenMemberId] = useState<number | null>(null);

    const { memberName } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const memberSlug = searchParams.get("member");

    useEffect(() => {
        fetchData<TeamMember[]>("/components/team")
            .then((res) => {
                const filtered = (res ?? []).filter(
                    (m) => m.certificates && m.certificates.length > 0
                );
                setData(filtered.length ? filtered : null);

                const activeSlug = memberName || memberSlug;

                if (activeSlug && filtered.length > 0) {
                    const matched = filtered.find(m => slugify(m.name) === activeSlug);
                    if (matched) {
                        setOpenMemberId(matched.id);
                    } else {
                        setOpenMemberId(filtered[0].id);
                    }
                } else if (filtered.length > 0) {
                    setOpenMemberId(filtered[0].id);
                }
            })
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, [memberName, memberSlug]);

    const toggleMember = (id: number) => {
        setOpenMemberId(openMemberId === id ? null : id);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a0a00] text-[#fdf0e0] flex flex-col justify-between font-sans">
                <Navbar />
                <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-32 flex flex-col gap-10 animate-pulse">
                    {/* Header Banner Placeholder */}
                    <div className="w-full h-[300px] bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4 w-full max-w-lg px-6">
                            <div className="w-16 h-16 bg-white/10 rounded-full" />
                            <div className="h-8 bg-white/10 rounded-md w-3/4" />
                            <div className="h-4 bg-white/10 rounded-md w-1/2" />
                        </div>
                    </div>

                    {/* Content Section Placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-full shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-white/10 rounded-md w-3/4" />
                                        <div className="h-3 bg-white/10 rounded-md w-1/2" />
                                    </div>
                                </div>
                                <div className="h-20 bg-white/10 rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a0a00] text-[#fdf0e0] flex flex-col justify-between font-sans">
            <Navbar />

            {/* ── Hero Banner ── */}
            <div style={{ position: "relative", height: "60vh", minHeight: "500px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {/* Background image */}
                <img
                    src="/assets/images/banner_bg.jpg"
                    alt="Team Certificates"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/assets/images/default_bg.jpg'; }}
                />
                {/* Dark gradient overlay */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.70), rgba(0,0,0,0.50), rgba(0,0,0,0.82))", zIndex: 1 }} />
                {/* Banner content */}
                <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 16px", maxWidth: "896px", margin: "64px auto 0", width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.10)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 7v14" />
                                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                            </svg>
                        </div>
                    </div>
                    <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.75rem)", fontWeight: 700, color: "#fff", marginBottom: "16px", lineHeight: 1.15 }}>Team Achievements &amp; Licenses</h1>
                    <p style={{ fontSize: "1.125rem", color: "#e5e7eb", maxWidth: "42rem", margin: "0 auto" }}>Verified credentials and official certificates of our qualified trekking experts</p>
                </div>
            </div>

            {/* ── Dark content area ── */}
            <div style={{ background: "linear-gradient(to bottom, #1a0a00, #231102, #1a0a00)", flex: 1, position: "relative" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/assets/images/default_bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.08, pointerEvents: "none" }} />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-16" style={{ position: "relative", zIndex: 1 }}>
                <style>{`
                    /* ─── Accordion CSS ───────────────────────────────── */
                    .tcs-accordion {
                        max-width: 1000px;
                        margin: 0 auto;
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                        position: relative;
                        z-index: 2;
                    }
                    .tcs-acc-item {
                        background: rgba(45, 21, 0, 0.45);
                        border: 1px solid rgba(232, 131, 42, 0.18);
                        border-radius: 16px;
                        overflow: hidden;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
                        backdrop-filter: blur(8px);
                    }
                    .tcs-acc-item:hover {
                        border-color: rgba(232, 131, 42, 0.35);
                        background: rgba(45, 21, 0, 0.55);
                    }
                    .tcs-acc-item--open {
                        border-color: rgba(232, 131, 42, 0.55);
                        background: rgba(45, 21, 0, 0.7);
                        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
                    }
                    .tcs-acc-header {
                        width: 100%;
                        padding: 24px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        background: none;
                        border: none;
                        cursor: pointer;
                        text-align: left;
                        color: inherit;
                        outline: none !important;
                    }
                    .tcs-acc-header-left {
                        display: flex;
                        align-items: center;
                        gap: 20px;
                    }
                    .tcs-acc-avatar {
                        width: 68px;
                        height: 68px;
                        border-radius: 50%;
                        overflow: hidden;
                        border: 2px solid #e8832a;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
                        flex-shrink: 0;
                    }
                    .tcs-acc-avatar-img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        object-position: top;
                    }
                    .tcs-acc-avatar-fallback {
                        width: 100%;
                        height: 100%;
                        background: #351400;
                        color: #e8832a;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .tcs-acc-info {
                        display: flex;
                        flex-direction: column;
                    }
                    .tcs-acc-name {
                        font-size: 22px;
                        font-weight: 700;
                        color: #fdf0e0;
                        margin: 0 0 2px;
                    }
                    .tcs-acc-role {
                        font-size: 11px;
                        color: #e8832a;
                        letter-spacing: 1.5px;
                        text-transform: uppercase;
                        font-weight: 700;
                    }
                    .tcs-acc-special {
                        font-size: 12px;
                        color: #cca380;
                        margin-top: 4px;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }
                    .tcs-acc-badge {
                        background: rgba(232, 131, 42, 0.12);
                        border: 1px solid rgba(232, 131, 42, 0.3);
                        color: #e8832a;
                        padding: 6px 14px;
                        border-radius: 99px;
                        font-size: 11px;
                        font-weight: bold;
                        letter-spacing: 0.5px;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                    }
                    .tcs-acc-header-right {
                        display: flex;
                        align-items: center;
                        gap: 20px;
                    }
                    .tcs-acc-chevron {
                        color: #e8832a;
                        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .tcs-acc-item--open .tcs-acc-chevron {
                        transform: rotate(180deg);
                    }
                    .tcs-acc-body {
                        border-top: 1px solid rgba(232, 131, 42, 0.12);
                        padding: 32px 24px;
                        background: rgba(26, 10, 0, 0.35);
                    }
                    .tcs-acc-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                        gap: 28px;
                    }

                    /* ─── Card CSS ────────────────────────────────────── */
                    .team-cert-card {
                        perspective: 1000px;
                    }
                    .tcc-outer {
                        position: relative;
                        background: linear-gradient(145deg, #fffbf0 0%, #fff8e8 50%, #fef5df 100%);
                        border-radius: 6px;
                        overflow: hidden;
                        box-shadow:
                            0 0 0 1px rgba(180,90,10,0.35),
                            0 0 0 4px rgba(180,90,10,0.12),
                            0 4px 6px -1px rgba(0,0,0,0.35),
                            0 15px 40px -10px rgba(0,0,0,0.55),
                            inset 0 1px 0 rgba(255,255,255,0.9);
                        transition: transform 0.35s ease, box-shadow 0.35s ease;
                    }
                    .team-cert-card:hover .tcc-outer {
                        transform: translateY(-6px) rotateX(1deg);
                        box-shadow:
                            0 0 0 1px rgba(180,90,10,0.55),
                            0 0 0 4px rgba(180,90,10,0.22),
                            0 8px 12px rgba(0,0,0,0.4),
                            0 25px 60px -10px rgba(0,0,0,0.65),
                            inset 0 1px 0 rgba(255,255,255,0.9);
                    }
                    .tcc-ribbon {
                        height: 7px;
                        background: linear-gradient(90deg, #6b2d00, #b85c00, #e8832a, #b85c00, #6b2d00);
                    }
                    .tcc-corner {
                        position: absolute;
                        width: 32px;
                        height: 32px;
                        z-index: 10;
                        pointer-events: none;
                    }
                    .tcc-corner::before,
                    .tcc-corner::after {
                        content: '';
                        position: absolute;
                        background: linear-gradient(135deg, #b85c00, #e8832a);
                    }
                    .tcc-corner--tl { top: 7px; left: 0; }
                    .tcc-corner--tr { top: 7px; right: 0; transform: scaleX(-1); }
                    .tcc-corner--bl { bottom: 7px; left: 0; transform: scaleY(-1); }
                    .tcc-corner--br { bottom: 7px; right: 0; transform: scale(-1); }
                    .tcc-corner::before { width: 2.5px; height: 100%; top: 0; left: 6px; }
                    .tcc-corner::after  { height: 2.5px; width: 100%; left: 0; top: 6px; }

                    .tcc-header {
                        text-align: center;
                        padding: 18px 18px 4px;
                    }
                    .tcc-above {
                        font-size: 9px;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                        color: #8b4500;
                        margin: 0 0 6px;
                    }
                    .tcc-divider {
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        margin: 4px 0;
                    }
                    .tcc-divider--sm { margin: 8px 0; }
                    .tcc-dline {
                        flex: 1;
                        height: 1px;
                        background: linear-gradient(90deg, transparent, #b85c00, transparent);
                    }
                    .tcc-diamond {
                        width: 6px;
                        height: 6px;
                        background: #b85c00;
                        transform: rotate(45deg);
                        flex-shrink: 0;
                    }
                    .tcc-diamond--sm { width: 4.5px; height: 4.5px; }

                    .tcc-body {
                        padding: 8px 20px 14px;
                        text-align: center;
                    }
                    .tcc-presented-to {
                        font-style: italic;
                        font-size: 11px;
                        color: #7a4200;
                        margin: 0 0 2px;
                    }
                    .tcc-name {
                        font-size: 16px;
                        font-weight: 700;
                        color: #3a1f00;
                        margin: 0 0 2px;
                        line-height: 1.25;
                    }
                    .tcc-role {
                        font-size: 10px;
                        letter-spacing: 1px;
                        text-transform: uppercase;
                        color: #b85c00;
                        margin: 0 0 2px;
                    }
                    .tcc-cert-label {
                        font-style: italic;
                        font-size: 10px;
                        color: #7a4200;
                        margin: 4px 0 2px;
                    }
                    .tcc-cert-title {
                        font-size: 13px;
                        font-weight: 700;
                        color: #3a1f00;
                        margin: 0 0 8px;
                        line-height: 1.25;
                        background: linear-gradient(135deg, #6b2d00, #b85c00, #e8832a, #b85c00, #6b2d00);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }
                    .tcc-view-wrap {
                        padding: 0 16px 14px;
                        display: flex;
                        justify-content: center;
                    }
                    .tcc-view-btn {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        background: linear-gradient(135deg, #b85c00, #e8832a);
                        color: white;
                        border: none;
                        border-radius: 99px;
                        padding: 6px 16px;
                        font-size: 11px;
                        font-weight: 600;
                        cursor: pointer;
                        box-shadow: 0 3px 10px rgba(184,92,0,0.3);
                        transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
                    }
                    .tcc-view-btn:hover {
                        transform: translateY(-1.5px);
                        box-shadow: 0 5px 15px rgba(184,92,0,0.45);
                        filter: brightness(1.1);
                    }
                    .tcc-footer {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 8px 12px 10px;
                        border-top: 1px solid rgba(184,92,0,0.15);
                        background: linear-gradient(180deg, transparent, rgba(184,92,0,0.03));
                    }
                    .tcc-footer-left,
                    .tcc-footer-right {
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        font-size: 8.5px;
                        letter-spacing: 0.5px;
                        text-transform: uppercase;
                        color: #8b4500;
                    }
                    .tcc-footer-icon { color: #b85c00; }
                    .tcc-footer-center-seal {
                        width: 26px;
                        height: 26px;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #b85c00, #e8832a);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        box-shadow: 0 2px 6px rgba(184,92,0,0.3);
                    }
                `}</style>

                {/* Section sub-header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: "center", marginBottom: "40px", position: "relative", zIndex: 2 }}
                >
                    <p style={{
                        fontSize: "11px",
                        letterSpacing: "3px",
                        textTransform: "uppercase",
                        color: "#e8832a",
                        marginBottom: "8px",
                        fontWeight: "bold",
                    }}>
                        Qualified Experts
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", maxWidth: "240px", margin: "8px auto 0" }}>
                        <span style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #b85c00)" }} />
                        <span style={{ width: "8px", height: "8px", background: "#b85c00", transform: "rotate(45deg)", flexShrink: 0 }} />
                        <span style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #b85c00, transparent)" }} />
                    </div>
                </motion.div>

                {/* Accordion container */}
                <div className="tcs-accordion">
                    {data && data.map((member) => {
                        const isOpen = openMemberId === member.id;
                        return (
                            <div
                                key={member.id}
                                className={`tcs-acc-item ${isOpen ? "tcs-acc-item--open" : ""}`}
                            >
                                <button
                                    className="tcs-acc-header"
                                    onClick={() => toggleMember(member.id)}
                                >
                                    <div className="tcs-acc-header-left">
                                        {/* Circular Avatar */}
                                        <div className="tcs-acc-avatar">
                                            {member.image ? (
                                                <img
                                                    src={`${BASE_URL}/${member.image}`}
                                                    alt={member.name}
                                                    className="tcs-acc-avatar-img"
                                                />
                                            ) : (
                                                <div className="tcs-acc-avatar-fallback">
                                                    <Star size={24} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Member details */}
                                        <div className="tcs-acc-info">
                                            <h3 className="tcs-acc-name">{member.name}</h3>
                                            <span className="tcs-acc-role">{member.role}</span>
                                            {member.specialty && (
                                                <span className="tcs-acc-special">
                                                    <Sparkles size={12} className="text-[#e8832a]" />
                                                    {member.specialty} ({member.experience || "Expert"})
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="tcs-acc-header-right">
                                        {/* Number of Certificates */}
                                        <div className="tcs-acc-badge">
                                            <Award size={13} />
                                            {member.certificates.length} {member.certificates.length === 1 ? "Certificate" : "Certificates"}
                                        </div>
                                        {/* Expand icon */}
                                        <ChevronDown size={20} className="tcs-acc-chevron" />
                                    </div>
                                </button>

                                {/* Accordion body */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            style={{ overflow: "hidden" }}
                                        >
                                            <div className="tcs-acc-body">
                                                <div className="tcs-acc-grid">
                                                    {member.certificates.map((cert, certIndex) => (
                                                        <MemberCertCard
                                                            key={`${member.id}-${certIndex}`}
                                                            member={member}
                                                            cert={cert}
                                                            cardIndex={certIndex}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </main>
            </div>{/* end dark content area */}

            <Footer />
        </div>
    );
}

export default TeamCertificatesSection;
