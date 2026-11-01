import React from 'react';
import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../hooks/useWishlist';

interface WishlistButtonProps {
    /** Full product object — must have at minimum { id, slug, title } */
    product: any;
    /** Size variant */
    size?: 'sm' | 'md';
    /** Extra class names for the button wrapper */
    className?: string;
}

/**
 * WishlistButton
 *
 * A heart-shaped toggle button that adds/removes a product from the wishlist.
 * Designed to be placed as an overlay on product card images.
 * Stops click propagation so it doesn't trigger the parent card link.
 */
export function WishlistButton({ product, size = 'md', className = '' }: WishlistButtonProps) {
    const { isInWishlist, toggleWishlist } = useWishlist();
    const inWishlist = isInWishlist(product.id);

    const iconSize = size === 'sm' ? 14 : 18;
    const btnSize = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    return (
        <motion.button
            onClick={handleClick}
            whileTap={{ scale: 0.8 }}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            className={`
                ${btnSize} rounded-full flex items-center justify-center
                backdrop-blur-md border transition-all duration-200 cursor-pointer
                ${inWishlist
                    ? 'bg-rose-500 border-rose-400 shadow-lg shadow-rose-500/30'
                    : 'bg-white/80 border-white/40 hover:bg-white hover:border-white/60 shadow-md'
                }
                ${className}
            `}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={inWishlist ? 'filled' : 'empty'}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="flex items-center justify-center"
                >
                    <Heart
                        size={iconSize}
                        className={inWishlist ? 'text-white fill-white' : 'text-gray-600'}
                        fill={inWishlist ? 'currentColor' : 'none'}
                    />
                </motion.span>
            </AnimatePresence>
        </motion.button>
    );
}
