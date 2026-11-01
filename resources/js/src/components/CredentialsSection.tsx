import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchData } from "../axiosHook";
import BASE_URL from "../global";
import { Award, CheckCircle, Shield } from "lucide-react";
import { SectionHeading } from "./ui/SectionHeading";

interface Credential {
    id: number;
    title: string;
    description: string;
    icon: string | null;
}

function CertificateCard({
    credential,
    index,
}: {
    credential: Credential;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: index * 0.1 }}
            className="certificate-card"
        >
            {/* Outer decorative border */}
            <div className="cert-outer-border">
                {/* Corner ornaments */}
                <span className="cert-corner cert-corner--tl" />
                <span className="cert-corner cert-corner--tr" />
                <span className="cert-corner cert-corner--bl" />
                <span className="cert-corner cert-corner--br" />

                {/* Top ribbon band */}
                <div className="cert-ribbon" />

                {/* Header */}
                <div className="cert-header">
                    <p className="cert-above-title">Certificate of</p>
                    <h2 className="cert-main-title">Excellence</h2>
                    <div className="cert-divider">
                        <span className="cert-divider-line" />
                        <span className="cert-divider-diamond" />
                        <span className="cert-divider-line" />
                    </div>
                </div>

                {/* Seal / Icon area */}
                <div className="cert-seal-wrap">
                    <div className="cert-seal">
                        {credential.icon ? (
                            <img
                                src={`${BASE_URL}storage/${credential.icon}`}
                                alt={credential.title}
                                className="cert-seal-img"
                            />
                        ) : (
                            <Award size={36} className="cert-seal-icon" />
                        )}
                    </div>
                    <div className="cert-seal-ring" />
                    <div className="cert-seal-ring cert-seal-ring--outer" />
                </div>

                {/* Body */}
                <div className="cert-body">
                    <p className="cert-presented-to">This certifies that</p>
                    <h3 className="cert-title">{credential.title}</h3>
                    <div className="cert-divider cert-divider--sm">
                        <span className="cert-divider-line" />
                        <span className="cert-divider-diamond cert-divider-diamond--sm" />
                        <span className="cert-divider-line" />
                    </div>
                    <div
                        className="cert-description"
                        dangerouslySetInnerHTML={{ __html: credential.description }}
                    />
                </div>

                {/* Footer */}
                <div className="cert-footer">
                    <div className="cert-footer-badge">
                        <CheckCircle size={14} className="cert-footer-badge-icon" />
                        <span>Verified &amp; Authenticated</span>
                    </div>
                    <div className="cert-footer-seal">
                        <Shield size={20} />
                    </div>
                    <div className="cert-footer-badge">
                        <span>Himalayan Bespoke</span>
                    </div>
                </div>

                {/* Bottom ribbon */}
                <div className="cert-ribbon cert-ribbon--bottom" />
            </div>
        </motion.div>
    );
}

function CredentialsSection() {
    const [data, setData] = useState<Credential[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData<Credential[]>("/components/credentials")
            .then((res) => setData(res ?? null))
            .catch(() => setData(null))
            .finally(() => setLoading(false));
    }, []);

    if (loading || !data || data.length === 0) return null;

    return (
        <section className="credentials-section">
            <style>{`
                /* ─── Section wrapper ─────────────────────────────── */
                .credentials-section {
                    padding: 96px 16px;
                    position: relative;
                    overflow: hidden;
                    background: #0f172a;
                }
                .credentials-section::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: url('/assets/images/default_bg.jpg');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    opacity: 0.15;
                    pointer-events: none;
                    z-index: 0;
                }
                .credentials-section::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(160deg, rgba(15,23,42,0.95) 0%, rgba(15,32,66,0.92) 50%, rgba(15,23,42,0.95) 100%);
                    z-index: 1;
                    pointer-events: none;
                }

                .credentials-grid {
                    max-width: 1200px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 40px;
                    padding-top: 20px;
                    position: relative;
                    z-index: 2;
                }

                /* ─── Certificate card ────────────────────────────── */
                .certificate-card {
                    perspective: 1000px;
                }
                .cert-outer-border {
                    position: relative;
                    background: linear-gradient(145deg, #f0f7ff 0%, #ffffff 40%, #f5fbff 100%);
                    border-radius: 4px;
                    padding: 0;
                    box-shadow:
                        0 0 0 1px rgba(0,102,255,0.4),
                        0 0 0 4px rgba(6,182,212,0.15),
                        0 4px 6px -1px rgba(0,0,0,0.3),
                        0 20px 60px -10px rgba(0,0,0,0.5),
                        inset 0 1px 0 rgba(255,255,255,0.9);
                    overflow: hidden;
                    transition: transform 0.35s ease, box-shadow 0.35s ease;
                }
                .certificate-card:hover .cert-outer-border {
                    transform: translateY(-6px) rotateX(1deg);
                    box-shadow:
                        0 0 0 1px rgba(0,102,255,0.6),
                        0 0 0 4px rgba(6,182,212,0.25),
                        0 8px 12px -2px rgba(0,0,0,0.35),
                        0 30px 80px -10px rgba(0,0,0,0.6),
                        inset 0 1px 0 rgba(255,255,255,0.9);
                }

                /* ─── Ribbons ─────────────────────────────────────── */
                .cert-ribbon {
                    height: 10px;
                    background: linear-gradient(90deg, #004ecc, #0066FF, #06B6D4, #0066FF, #004ecc);
                    position: relative;
                }
                .cert-ribbon--bottom {
                    margin-top: 0;
                }

                /* ─── Corner ornaments ────────────────────────────── */
                .cert-corner {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    z-index: 10;
                    pointer-events: none;
                }
                .cert-corner::before,
                .cert-corner::after {
                    content: '';
                    position: absolute;
                    background: linear-gradient(135deg, #0066FF, #06B6D4);
                }
                .cert-corner--tl { top: 10px; left: 0; }
                .cert-corner--tr { top: 10px; right: 0; transform: scaleX(-1); }
                .cert-corner--bl { bottom: 10px; left: 0; transform: scaleY(-1); }
                .cert-corner--br { bottom: 10px; right: 0; transform: scale(-1); }
                .cert-corner::before { width: 2px; height: 100%; top: 0; left: 8px; }
                .cert-corner::after  { height: 2px; width: 100%; left: 0; top: 8px; }

                /* ─── Header ──────────────────────────────────────── */
                .cert-header {
                    text-align: center;
                    padding: 20px 24px 8px;
                    background: linear-gradient(180deg, rgba(0,102,255,0.08) 0%, transparent 100%);
                    border-bottom: 1px solid rgba(0,102,255,0.2);
                }
                .cert-above-title {
                    font-size: 11px;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    color: #0052cc;
                    margin: 0 0 2px;
                }
                .cert-main-title {
                    font-size: 26px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #004ecc, #0066FF, #06B6D4, #0066FF, #004ecc);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin: 0 0 10px;
                    line-height: 1.1;
                }

                /* ─── Divider ─────────────────────────────────────── */
                .cert-divider {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 8px 0;
                }
                .cert-divider--sm { margin: 10px 0; }
                .cert-divider-line {
                    flex: 1;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, #0066FF, transparent);
                }
                .cert-divider-diamond {
                    width: 8px;
                    height: 8px;
                    background: #0066FF;
                    transform: rotate(45deg);
                    flex-shrink: 0;
                }
                .cert-divider-diamond--sm {
                    width: 6px;
                    height: 6px;
                }

                /* ─── Seal ────────────────────────────────────────── */
                .cert-seal-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px 0 8px;
                }
                .cert-seal {
                    position: relative;
                    z-index: 3;
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: linear-gradient(145deg, #0052cc, #0066FF, #06B6D4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow:
                        0 0 0 3px rgba(6,182,212,0.4),
                        0 4px 15px rgba(0,0,0,0.2);
                }
                .cert-seal-img {
                    width: 48px;
                    height: 48px;
                    object-fit: contain;
                    filter: brightness(10) saturate(0);
                }
                .cert-seal-icon {
                    color: white;
                }
                .cert-seal-ring {
                    position: absolute;
                    width: 96px;
                    height: 96px;
                    border-radius: 50%;
                    border: 1.5px dashed rgba(6,182,212,0.6);
                    z-index: 2;
                }
                .cert-seal-ring--outer {
                    width: 112px;
                    height: 112px;
                    border: 1px solid rgba(0,102,255,0.25);
                    border-style: dotted;
                }

                /* ─── Body ────────────────────────────────────────── */
                .cert-body {
                    padding: 4px 32px 20px;
                    text-align: center;
                }
                .cert-presented-to {
                    font-style: italic;
                    font-size: 13px;
                    color: #0052cc;
                    margin: 0 0 6px;
                }
                .cert-title {
                    font-size: 19px;
                    font-weight: 700;
                    color: #001f4d;
                    margin: 0 0 6px;
                    line-height: 1.25;
                }
                .cert-description {
                    font-size: 13px;
                    line-height: 1.65;
                    color: #003380;
                }
                .cert-description p { margin: 0; }
                .cert-description ul {
                    list-style: none;
                    padding: 0;
                    margin: 4px 0 0;
                    text-align: left;
                }
                .cert-description ul li::before {
                    content: '◆ ';
                    color: #06B6D4;
                    font-size: 10px;
                }

                /* ─── Footer ──────────────────────────────────────── */
                .cert-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 20px 14px;
                    border-top: 1px solid rgba(0,102,255,0.25);
                    background: linear-gradient(180deg, transparent, rgba(6,182,212,0.05));
                }
                .cert-footer-badge {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 10px;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    color: #0052cc;
                }
                .cert-footer-badge-icon { color: #0066FF; }
                .cert-footer-seal {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #0066FF, #06B6D4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    box-shadow: 0 2px 8px rgba(6,182,212,0.4);
                }

                /* ─── Section heading override for dark bg ───────── */
                .credentials-section .section-heading-subtitle {
                    color: #06B6D4 !important;
                }
                .credentials-section .section-heading-title {
                    color: #f0f7ff !important;
                }

                @media (max-width: 768px) {
                    .credentials-grid {
                        grid-template-columns: 1fr;
                        gap: 28px;
                    }
                }
            `}</style>

            <div className="max-w-7xl mx-auto" style={{ position: "relative", zIndex: 1 }}>
                {/* Section heading — force light text on dark background */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ textAlign: "center", marginBottom: "56px", position: "relative", zIndex: 2 }}
                >
                    <p
                        style={{
                            fontSize: "12px",
                            letterSpacing: "3px",
                            textTransform: "uppercase",
                            color: "#c9a227",
                            marginBottom: "8px",
                        }}
                    >
                        Our Credentials
                    </p>
                    <h2
                        style={{
                            fontSize: "clamp(28px, 5vw, 44px)",
                            fontWeight: 700,
                            color: "#fdf6e3",
                            lineHeight: 1.15,
                            margin: 0,
                        }}
                    >
                        Certified &amp; Trusted
                    </h2>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            maxWidth: "240px",
                            margin: "16px auto 0",
                        }}
                    >
                        <span style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #c9a227)" }} />
                        <span style={{ width: "8px", height: "8px", background: "#c9a227", transform: "rotate(45deg)", flexShrink: 0 }} />
                        <span style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #c9a227, transparent)" }} />
                    </div>
                </motion.div>

                <div className="credentials-grid">
                    {data.map((credential, index) => (
                        <CertificateCard key={credential.id} credential={credential} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CredentialsSection;
