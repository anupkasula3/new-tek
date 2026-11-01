import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    Trash2,
    ArrowRight,
    Clock,
    MapPin,
    TrendingUp,
    ShoppingBag,
    MountainSnow,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useWishlist } from '../hooks/useWishlist';
import BASE_URL from '../global';
import type { WishlistItem } from '../types/wishlist';
import { Seo } from '../components/Seo';
import { Button } from '../components/ui/Button';

// ─────────────────────────────────────────────
// Difficulty colour mapping (matches existing cards)
// ─────────────────────────────────────────────
const difficultyColors: Record<string, string> = {
    Moderate: 'text-[#0066FF]',
    Hard: 'text-purple-500',
    Easy: 'text-[#06B6D4]',
};

// ─────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────
function EmptyWishlist() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-28 px-6 text-center"
        >
            {/* Animated heart illustration */}
            <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-100 to-pink-50 flex items-center justify-center shadow-inner">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <Heart
                            size={56}
                            className="text-rose-300"
                            strokeWidth={1.5}
                        />
                    </motion.div>
                </div>
                {/* Decorative mountains */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shadow-sm">
                    <MountainSnow size={20} className="text-[#0066FF]" />
                </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Your wishlist is empty
            </h2>
            <p className="text-gray-500 text-lg max-w-md mb-10 leading-relaxed">
                Save your favourite treks and adventures here by clicking the{' '}
                <Heart size={16} className="inline text-rose-400 fill-rose-400" />{' '}
                heart button on any trip card.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <a href="/">
                    <Button variant="primary" size="lg" className="gap-2">
                        <ShoppingBag size={18} />
                        Browse Adventures
                    </Button>
                </a>
                <a href="/plan-trip">
                    <Button variant="ghost" size="lg" className="gap-2">
                        Plan a Custom Trip
                        <ArrowRight size={18} />
                    </Button>
                </a>
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────
// Wishlist Card
// ─────────────────────────────────────────────
function WishlistCard({
    item,
    onRemove,
    index,
}: {
    item: WishlistItem;
    onRemove: (id: number) => void;
    index: number;
}) {
    const imageUrl = item.banner_image
        ? `${BASE_URL}/${item.banner_image.replace(/^\//, '')}`
        : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop';

    const price =
        item.price != null && item.price !== ''
            ? `$${Number(item.price).toLocaleString()}`
            : null;

    const diffClass =
        difficultyColors[item.difficulty ?? ''] ?? 'text-gray-500';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
        >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop';
                    }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Remove button */}
                <button
                    onClick={() => onRemove(item.id)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-200 shadow-md cursor-pointer z-10"
                    aria-label="Remove from wishlist"
                    title="Remove from wishlist"
                >
                    <Trash2 size={16} />
                </button>

                {/* Bottom meta */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2">
                    {item.country && (
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-white drop-shadow" />
                            <span className="text-white text-xs font-semibold drop-shadow">
                                {item.country}
                            </span>
                        </div>
                    )}
                    {item.difficulty && (
                        <div className="flex items-center gap-1.5">
                            <TrendingUp size={14} className={`${diffClass} drop-shadow`} />
                            <span className={`text-xs font-semibold drop-shadow ${diffClass}`}>
                                {item.difficulty}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2 line-clamp-2">
                        {item.title}
                    </h3>
                    {item.duration_days && (
                        <div className="flex items-center gap-1.5 text-gray-500">
                            <Clock size={14} />
                            <span className="text-sm font-medium">{item.duration_days}</span>
                        </div>
                    )}
                </div>

                {/* Price + Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                        {price ? (
                            <>
                                <p className="text-[11px] text-gray-400 mb-0.5">Starting from</p>
                                <p className="text-xl font-bold text-gray-900">{price}</p>
                            </>
                        ) : (
                            <span className="text-sm text-gray-400 italic">Contact for price</span>
                        )}
                    </div>

                    <Link
                        to={`/book/${item.slug}`}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#0066FF] to-[#06B6D4] text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 group/btn"
                    >
                        Book Now
                        <ArrowRight
                            size={14}
                            className="transition-transform group-hover/btn:translate-x-0.5"
                        />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

// ─────────────────────────────────────────────
// Main WishlistPage
// ─────────────────────────────────────────────
export function WishlistPage() {
    const { wishlistItems, wishlistCount, removeFromWishlist, clearWishlist } =
        useWishlist();

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Seo
                fallbackTitle="My Wishlist"
                fallbackDescription="Your saved trekking adventures and packages from Himalayan Trekking."
            />
            <Navbar />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 pt-52 pb-32">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            My Wishlist
                        </h1>
                        <p className="text-gray-300 text-lg">
                            {wishlistCount === 0
                                ? 'No saved adventures yet'
                                : wishlistCount === 1
                                ? '1 adventure saved'
                                : `${wishlistCount} adventures saved`}
                        </p>
                    </motion.div>
                </div>
            </div>

            <main className="py-16">
                {/* ── Actions bar if items exist ── */}
                {wishlistCount > 0 && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex justify-end">
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={clearWishlist}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 text-sm font-semibold transition-colors cursor-pointer"
                        >
                            <Trash2 size={15} />
                            Clear all
                        </motion.button>
                    </div>
                )}

                {/* ── Content ── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {wishlistCount === 0 ? (
                        <EmptyWishlist />
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {wishlistItems.map((item, index) => (
                                    <WishlistCard
                                        key={item.id}
                                        item={item}
                                        onRemove={removeFromWishlist}
                                        index={index}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>

                {/* ── CTA Banner (shown when items exist) ── */}
                {wishlistCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14"
                    >
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0066FF] to-[#06B6D4] p-8 md:p-12 text-white shadow-2xl shadow-blue-500/20">
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 translate-x-20 -translate-y-20 pointer-events-none" />
                            <div className="absolute bottom-0 left-20 w-40 h-40 rounded-full bg-white/5 translate-y-10 pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div>
                                    <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">
                                        Need help choosing?
                                    </p>
                                    <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-1">
                                        Let us plan your perfect trip
                                    </h2>
                                    <p className="text-white/80 max-w-md text-sm leading-relaxed">
                                        Our trekking experts can help you customise any adventure
                                        to fit your schedule, budget, and fitness level.
                                    </p>
                                </div>
                                <a href="/plan-trip" className="shrink-0">
                                    <Button variant="secondary" size="lg" className="gap-2 font-bold shadow-xl">
                                        Plan My Trip
                                        <ArrowRight size={18} />
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>

            <Footer />
        </div>
    );
}
