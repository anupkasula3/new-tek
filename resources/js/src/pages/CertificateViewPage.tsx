import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { motion } from "framer-motion";
import { Award, FileText, Shield, Clock, ChevronDown, User, Star, Sparkles } from "lucide-react";
import { fetchData } from "../axiosHook";
import BASE_URL from "../global";

interface Certificate {
    title: string;
    file: string;
}

interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: string;
    experience?: string;
    specialty?: string;
    certificates: Certificate[];
}

interface LegalDocument {
    title: string;
    image: string;
    issuer: string;
    license_no: string;
    valid_until: string;
    document_file: string;
}

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");
};

/* ─── Skeleton primitives ─────────────────────────────────────────── */
const Bone = ({ className = "" }: { className?: string }) => (
    <div
        className={`animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] rounded ${className}`}
        style={{ backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }}
    />
);

export function CertificateViewPage() {
    const { memberName, certificateName, documentTitle } = useParams();
    const [title, setTitle] = useState("Certificate Viewer");
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [member, setMember] = useState<TeamMember | null>(null);
    const [openCertIndex, setOpenCertIndex] = useState<number | null>(0);

    // Metadata for display
    const [metaData, setMetaData] = useState<{
        ownerName?: string;
        ownerRole?: string;
        ownerImage?: string;
        docType: "team" | "legal";
        issuer?: string;
        number?: string;
        validUntil?: string;
    } | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(false);

        if (memberName && certificateName) {
            // Fetch team certificates
            fetchData<TeamMember[]>("/components/team")
                .then((res) => {
                    const members = res ?? [];
                    const matchedMember = members.find(
                        (m) => slugify(m.name) === memberName
                    );

                    if (matchedMember) {
                        const matchedCert = (matchedMember.certificates ?? []).find(
                            (c) => slugify(c.title) === certificateName
                        );

                        if (matchedCert) {
                            setTitle(`${matchedMember.name} - ${matchedCert.title}`);
                            setFileUrl(`${BASE_URL}storage/${matchedCert.file}`);
                            setMember(matchedMember);
                            setBannerImage(matchedMember.image ? `${BASE_URL}/${matchedMember.image}` : null);
                            // Open the matched cert by default
                            const certIdx = (matchedMember.certificates ?? []).findIndex(
                                (c) => slugify(c.title) === certificateName
                            );
                            setOpenCertIndex(certIdx >= 0 ? certIdx : 0);
                            setMetaData({
                                ownerName: matchedMember.name,
                                ownerRole: matchedMember.role,
                                ownerImage: matchedMember.image,
                                docType: "team",
                            });
                        } else {
                            setError(true);
                        }
                    } else {
                        setError(true);
                    }
                })
                .catch(() => setError(true))
                .finally(() => setLoading(false));
        } else if (documentTitle) {
            // Fetch legal documents
            fetchData<LegalDocument[]>("/components/legal-documents")
                .then((res) => {
                    const docs = res ?? [];
                    const matchedDoc = docs.find(
                        (d) => slugify(d.title) === documentTitle
                    );

                    if (matchedDoc && matchedDoc.document_file) {
                        setTitle(matchedDoc.title);
                        setFileUrl(`${BASE_URL}/${matchedDoc.document_file}`);
                        setBannerImage(matchedDoc.image ? `${BASE_URL}/${matchedDoc.image}` : null);
                        setMetaData({
                            docType: "legal",
                            issuer: matchedDoc.issuer,
                            number: matchedDoc.license_no,
                            validUntil: matchedDoc.valid_until,
                        });
                    } else {
                        setError(true);
                    }
                })
                .catch(() => setError(true))
                .finally(() => setLoading(false));
        } else {
            setError(true);
            setLoading(false);
        }
    }, [memberName, certificateName, documentTitle]);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col">
            <style>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                @keyframes skeletonPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .skeleton-bone {
                    background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.6s ease-in-out infinite;
                    border-radius: 8px;
                }
                .tmc-acc-item {
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                    transition: all 0.3s ease;
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
                @media (max-width: 640px) {
                    .tmc-acc-header { padding: 16px; }
                    .tmc-acc-title { font-size: 14px; }
                    .tmc-acc-pill { display: none; }
                    .tmc-acc-body { padding: 16px 12px 20px; }
                }
            `}</style>

            <Helmet>
                <title>{title} | Himalayan Bespoke</title>
                <meta name="description" content={`Official verification of ${title}`} />
            </Helmet>

            <Navbar />

            {/* ── Hero Banner ── */}
            <div style={{ position: "relative", height: "60vh", minHeight: "500px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {loading ? (
                    /* Skeleton banner */
                    <div className="skeleton-bone absolute inset-0" style={{ borderRadius: 0 }} />
                ) : (
                    <>
                        {bannerImage && (
                            <img
                                src={bannerImage}
                                alt="Certificate"
                                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
                            />
                        )}
                    </>
                )}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.70), rgba(0,0,0,0.50), rgba(0,0,0,0.82))", zIndex: 1 }} />
                <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 16px", maxWidth: "896px", margin: "64px auto 0", width: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.10)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 7v14" />
                                <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                            </svg>
                        </div>
                    </div>

                    {loading ? (
                        /* Skeleton text in banner */
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                            <div className="skeleton-bone" style={{ width: "60%", height: 48, opacity: 0.35 }} />
                            <div className="skeleton-bone" style={{ width: "40%", height: 20, opacity: 0.25 }} />
                            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                                {[120, 100, 130].map((w, i) => (
                                    <div key={i} className="skeleton-bone" style={{ width: w, height: 32, borderRadius: 9999, opacity: 0.2 }} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.75rem)", fontWeight: 700, color: "#fff", marginBottom: "16px", lineHeight: 1.15 }}>
                                {title}
                            </h1>
                            <p style={{ fontSize: "1.125rem", color: "#e5e7eb", maxWidth: "42rem", margin: "0 auto" }}>
                                Verified &amp; Authenticated by Himalayan Bespoke
                            </p>
                            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginTop: "24px", color: "#f3f4f6" }}>
                                {metaData?.docType === "legal" && (
                                    <>
                                        {metaData.issuer && (
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.08)", padding: "8px 16px", borderRadius: "9999px", fontSize: "0.875rem", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                                <Award size={16} className="text-[#06B6D4]" />
                                                <span><strong>Issuer:</strong> {metaData.issuer}</span>
                                            </div>
                                        )}
                                        {metaData.number && (
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.08)", padding: "8px 16px", borderRadius: "9999px", fontSize: "0.875rem", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                                <FileText size={16} className="text-[#06B6D4]" />
                                                <span><strong>License No:</strong> {metaData.number}</span>
                                            </div>
                                        )}
                                        {metaData.validUntil && (
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.08)", padding: "8px 16px", borderRadius: "9999px", fontSize: "0.875rem", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                                <Clock size={16} className="text-[#06B6D4]" />
                                                <span><strong>Valid Until:</strong> {metaData.validUntil}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                                {metaData?.docType === "team" && (
                                    <>
                                        {metaData.ownerName && (
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.08)", padding: "8px 16px", borderRadius: "9999px", fontSize: "0.875rem", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                                <span><strong>Member:</strong> {metaData.ownerName}</span>
                                            </div>
                                        )}
                                        {metaData.ownerRole && (
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.08)", padding: "8px 16px", borderRadius: "9999px", fontSize: "0.875rem", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                                <span><strong>Role:</strong> {metaData.ownerRole}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-12 flex flex-col" style={{ position: "relative", zIndex: 1 }}>

                {loading ? (
                    /* ── Skeleton content ── */
                    <div className="flex flex-col gap-6">
                        {/* Member card skeleton */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl relative overflow-hidden flex items-center gap-6">
                            <div className="absolute top-0 left-0 right-0 h-[3px] skeleton-bone" style={{ borderRadius: 0 }} />
                            {/* Avatar skeleton */}
                            <div className="skeleton-bone w-20 h-20 rounded-full flex-shrink-0" />
                            {/* Info skeleton */}
                            <div className="flex-1 flex flex-col gap-3">
                                <div className="skeleton-bone h-3 w-24 rounded-full" />
                                <div className="skeleton-bone h-7 w-56" />
                                <div className="skeleton-bone h-3 w-32" />
                                <div className="flex gap-2 mt-1">
                                    <div className="skeleton-bone h-6 w-24 rounded-full" />
                                    <div className="skeleton-bone h-6 w-28 rounded-full" />
                                    <div className="skeleton-bone h-6 w-20 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Section heading skeleton */}
                        <div className="flex flex-col gap-2 mt-2">
                            <div className="skeleton-bone h-4 w-36" />
                            <div className="skeleton-bone h-9 w-72" />
                        </div>

                        {/* Accordion item skeletons */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                <div className="flex items-center gap-4 p-6">
                                    <div className="skeleton-bone w-11 h-11 rounded-xl flex-shrink-0" />
                                    <div className="flex-1 flex flex-col gap-2">
                                        <div className="skeleton-bone h-3 w-16 rounded-full" />
                                        <div className="skeleton-bone h-5 w-48" />
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0">
                                        <div className="skeleton-bone h-6 w-20 rounded-full" />
                                        <div className="skeleton-bone h-6 w-6 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Document viewer skeleton */}
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl" style={{ }}>
                            <div className="skeleton-bone w-full" style={{  borderRadius: 0 }} />
                        </div>
                    </div>
                ) : error || !fileUrl ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
                        <Award size={48} className="text-[#0066FF] mb-4" />
                        <h2 className="text-2xl font-bold mb-2 text-slate-800">Document Not Found</h2>
                        <p className="text-slate-500 mb-6 max-w-md">
                            The certificate or document you are trying to view does not exist or may have been updated.
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
                        {metaData?.docType === "team" && member ? (
                            <div className="flex flex-col gap-10">
                                {/* ── Member hero card ── */}
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

                                <div className="mb-6">
                                    <p className="text-lg max-w-2xl prose text-gray-600 mb-2">
                                        Official Credentials
                                    </p>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                                        Certificates &amp; Licenses
                                    </h2>

                                    <div className="flex flex-col gap-4">
                                        {(member.certificates ?? []).map((cert, index) => {
                                            const isOpen = openCertIndex === index;
                                            const fileLink = `${BASE_URL}storage/${cert.file}`;
                                            return (
                                                <div
                                                    key={index}
                                                    className={`tmc-acc-item${isOpen ? " tmc-acc-item--open" : ""}`}
                                                >
                                                    <button
                                                        className="tmc-acc-header"
                                                        aria-expanded={isOpen}
                                                        onClick={() => setOpenCertIndex(isOpen ? null : index)}
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

                                                    {isOpen && (
                                                        <div style={{ overflow: "hidden", height: "auto", opacity: 1 }}>
                                                            <div className="tmc-acc-body">
                                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                                                                    <div className="lg:col-span-12 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col" style={{ minHeight: "75vh" }}>
                                                                        <div className="flex-1 w-full bg-slate-100 relative" style={{ }}>
                                                                            {fileLink.toLowerCase().endsWith(".pdf") ? (
                                                                                <iframe
                                                                                    src={`${fileLink}#toolbar=1&view=FitH`}
                                                                                    className="w-full h-full border-none"
                                                                                    title={cert.title}
                                                                                    style={{ }}
                                                                                />
                                                                            ) : (
                                                                                <div className="w-full h-auto flex items-center justify-center bg-slate-200">
                                                                                    <img
                                                                                        src={fileLink}
                                                                                        alt={`${cert.title} – ${member.name}`}
                                                                                        className="max-w-full object-contain rounded-lg shadow-lg border border-slate-300 animate-fadeIn"
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-6">
                                <p className="text-lg max-w-2xl prose text-gray-600 mb-2">
                                    Official Credentials
                                </p>
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                                    Certificates &amp; Licenses
                                </h2>

                                <div className="flex flex-col gap-4">
                                    <div
                                        className="tmc-acc-item tmc-acc-item--open"
                                    >
                                        <button
                                            className="tmc-acc-header"
                                            aria-expanded="true"
                                        >
                                            <div className="tmc-acc-left">
                                                <div className="tmc-acc-icon">
                                                    <Award size={18} />
                                                </div>
                                                <div className="tmc-acc-info">
                                                    <span className="tmc-acc-label">Certificate</span>
                                                    <h3 className="tmc-acc-title">{title}</h3>
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
                                                    className="tmc-acc-chevron tmc-acc-chevron--open"
                                                />
                                            </div>
                                        </button>

                                        <div style={{ overflow: "hidden", height: "auto", opacity: 1 }}>
                                            <div className="tmc-acc-body">
                                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                                                    <div className="lg:col-span-12 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col" style={{ minHeight: "75vh" }}>
                                                        <div className="flex-1 w-full bg-slate-100 relative" style={{ }}>
                                                            {fileUrl && fileUrl.toLowerCase().endsWith(".pdf") ? (
                                                                <iframe
                                                                    src={`${fileUrl}#toolbar=1&view=FitH`}
                                                                    className="w-full h-full border-none"
                                                                    title={title}
                                                                    style={{ }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-auto flex items-center justify-center bg-slate-200">
                                                                    <img
                                                                        src={fileUrl ?? ""}
                                                                        alt={title}
                                                                        className="max-w-full object-contain rounded-lg shadow-lg border border-slate-300 animate-fadeIn"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
