import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Seo } from "../components/Seo";
import { fetchData } from "../axiosHook";
import BASE_URL from "../global";

const REVIEWS_PER_PAGE = 20;

function ReviewCard({ review }: { review: any }) {
    const [expanded, setExpanded] = useState(false);
    const cleanText = review.review?.replace(/<[^>]*>/g, "") ?? "";
    const needsTruncation = cleanText.length > 250;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-white p-7 rounded-2xl shadow-sm border border-gray-100 relative flex flex-col h-full"
        >
            <Quote className="absolute top-5 right-5 text-blue-100" size={40} />

            {/* Stars */}
            <div className="flex gap-1 mb-4">
                {[...Array(Math.min(review.rating ?? 5, 5))].map((_, i) => (
                    <Star key={i} size={16} className="fill-[#FFD700] text-[#FFD700]" />
                ))}
            </div>

            {/* Review text */}
            <div className="flex-1">
                {needsTruncation && !expanded ? (
                    <p className="text-gray-700 italic mb-4 leading-relaxed text-sm">
                        {cleanText.slice(0, 250)}{"..."}{" "}
                        <button
                            onClick={() => setExpanded(true)}
                            className="text-blue-600 hover:text-blue-700 underline font-semibold ml-1 cursor-pointer bg-transparent border-none p-0 inline"
                        >
                            see more
                        </button>
                    </p>
                ) : (
                    <p className="text-gray-700 italic mb-4 leading-relaxed text-sm">
                        <span dangerouslySetInnerHTML={{ __html: review.review }} />
                        {needsTruncation && (
                            <button
                                onClick={() => setExpanded(false)}
                                className="text-blue-600 hover:text-blue-700 underline font-semibold ml-2 cursor-pointer bg-transparent border-none p-0 inline"
                            >
                                show less
                            </button>
                        )}
                    </p>
                )}
            </div>

            {/* Author */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066FF] to-[#06B6D4] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {review.name?.charAt(0) ?? "?"}
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                    <p className="text-xs text-gray-500">{review.country}</p>
                </div>
            </div>
        </motion.div>
    );
}

function ReviewsSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="bg-gradient-to-r from-cyan-900 to-blue-900 h-64" />
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                            <div className="dc-skeleton h-4 w-24 mb-4 rounded" />
                            <div className="dc-skeleton h-3 w-full mb-2 rounded" />
                            <div className="dc-skeleton h-3 w-5/6 mb-2 rounded" />
                            <div className="dc-skeleton h-3 w-4/6 mb-6 rounded" />
                            <div className="flex items-center gap-3 mt-auto">
                                <div className="dc-skeleton w-10 h-10 rounded-full" />
                                <div>
                                    <div className="dc-skeleton h-3 w-24 mb-1 rounded" />
                                    <div className="dc-skeleton h-2 w-16 rounded" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function ReviewsPage() {
    const [allReviews, setAllReviews] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const load = async () => {
            try {
                const [reviewsRes, settingsRes] = await Promise.all([
                    fetchData<any[]>("/components/reviews"),
                    fetchData("/global/settings"),
                ]);
                if (reviewsRes) setAllReviews(reviewsRes);
                if (settingsRes) setSettings(settingsRes);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <ReviewsSkeleton />;

    const totalPages = Math.ceil(allReviews.length / REVIEWS_PER_PAGE);
    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    const pageReviews = allReviews.slice(start, start + REVIEWS_PER_PAGE);

    const goToPage = (p: number) => {
        setCurrentPage(p);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Build page number array with ellipsis
    const buildPageNums = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages: (number | string)[] = [1];
        if (currentPage > 3) pages.push("...");
        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(totalPages - 1, currentPage + 1);
            i++
        ) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
        return pages;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Seo
                fallbackTitle="Customer Reviews - Himalayan Bespoke Experiences"
                fallbackDescription="Read genuine reviews from our travelers. Hundreds of trekkers have shared their experiences with Himalayan Bespoke & Expedition."
                fallbackKeywords="trekking reviews, Nepal trekking testimonials, Himalayan Bespoke reviews, customer testimonials"
                canonicalPath="/reviews"
                type="WebPage"
                reviews={allReviews}
            />
            <Navbar />

            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-cyan-900 to-blue-900 text-white pb-24 pt-32 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80')",
                    }}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Stars decoration */}
                        <div className="flex justify-center gap-1 mb-6">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={28} className="fill-[#FFD700] text-[#FFD700]" />
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            What Our Travelers Say
                        </h1>
                        <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
                            Hundreds of adventurers have trusted us to guide their Himalayan journeys. Here are
                            their stories.
                        </p>
                        {allReviews.length > 0 && (
                            <p className="mt-4 text-sm text-cyan-200 font-medium">
                                {allReviews.length} verified reviews
                            </p>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Google / TripAdvisor Links */}
            {(settings?.google_review_url || settings?.tripadvisor_review_url) && (
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap justify-center gap-4">
                        {settings?.google_review_url && (
                            <a
                                href={settings.google_review_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 rounded-xl font-semibold text-gray-800 text-sm shadow-sm"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-5 h-5"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                See Reviews on Google
                            </a>
                        )}
                        {settings?.tripadvisor_review_url && (
                            <a
                                href={settings.tripadvisor_review_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 hover:border-[#34E0A1] hover:shadow-md transition-all duration-200 rounded-xl font-semibold text-gray-800 text-sm shadow-sm"
                            >
                                <img
                                    src={`${BASE_URL}/assets/images/tripadvisor-logo-svgrepo-com.svg`}
                                    alt="Tripadvisor"
                                    className="w-5 h-5"
                                />
                                See Reviews on Tripadvisor
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Reviews Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16">
                {error && (
                    <div className="text-center py-20 text-red-500">
                        An error occurred while loading reviews. Please try again later.
                    </div>
                )}

                {!error && allReviews.length === 0 && (
                    <div className="text-center py-20 text-gray-500">No reviews found yet.</div>
                )}

                {pageReviews.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pageReviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-14 flex-wrap">
                                {/* Prev */}
                                <button
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft size={16} />
                                    Prev
                                </button>

                                {/* Page numbers */}
                                {buildPageNums().map((p, idx) =>
                                    p === "..." ? (
                                        <span
                                            key={"ellipsis-" + idx}
                                            className="px-2 text-gray-400 select-none"
                                        >
                                            {"..."}
                                        </span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => goToPage(p as number)}
                                            className={
                                                "w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-150 " +
                                                (currentPage === p
                                                    ? "bg-blue-600 text-white shadow-md"
                                                    : "bg-white border border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600 shadow-sm")
                                            }
                                            aria-label={"Page " + p}
                                            aria-current={currentPage === p ? "page" : undefined}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}

                                {/* Next */}
                                <button
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium text-sm hover:border-blue-400 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 shadow-sm"
                                    aria-label="Next page"
                                >
                                    Next
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        )}

                        {/* Page info */}
                        {totalPages > 1 && (
                            <p className="text-center text-sm text-gray-400 mt-4">
                                Page {currentPage} of {totalPages} &middot; {allReviews.length} total reviews
                            </p>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </div>
    );
}
