import { useState, useEffect, useCallback } from 'react';
import type { WishlistItem } from '../types/wishlist';

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────
const STORAGE_KEY = 'ht_wishlist';
const WISHLIST_EVENT = 'wishlist-updated';

// ─────────────────────────────────────────────────────────
// Storage helpers (safe read/write with corrupt-data guard)
// ─────────────────────────────────────────────────────────
function readFromStorage(): WishlistItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        
        const threeMonthsAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
        let needsUpdate = false;

        const filtered = parsed.filter(
            (item: any) => {
                const isValid = item &&
                    typeof item.id === 'number' &&
                    typeof item.slug === 'string';
                if (!isValid) return false;

                const addedAt = item.addedAt || Date.now();
                if (!item.addedAt) {
                    item.addedAt = addedAt;
                    needsUpdate = true;
                }

                const isFresh = addedAt > threeMonthsAgo;
                if (!isFresh) {
                    needsUpdate = true;
                }
                return isFresh;
            }
        );

        if (needsUpdate) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
            } catch {}
        }

        return filtered;
    } catch {
        return [];
    }
}

function writeToStorage(items: WishlistItem[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        // Dispatch a custom event so all hook consumers in the same tab update
        window.dispatchEvent(new CustomEvent(WISHLIST_EVENT));
    } catch {
        // localStorage may be unavailable (private browsing in some browsers)
    }
}

// ─────────────────────────────────────────────────────────
// Hook: useWishlist
// ─────────────────────────────────────────────────────────
export function useWishlist() {
    const [items, setItems] = useState<WishlistItem[]>(readFromStorage);

    // Sync state when another component in this tab mutates localStorage
    const syncFromStorage = useCallback(() => {
        setItems(readFromStorage());
    }, []);

    useEffect(() => {
        // Same-tab updates (from other component instances)
        window.addEventListener(WISHLIST_EVENT, syncFromStorage);
        // Cross-tab updates (another browser tab)
        window.addEventListener('storage', syncFromStorage);

        return () => {
            window.removeEventListener(WISHLIST_EVENT, syncFromStorage);
            window.removeEventListener('storage', syncFromStorage);
        };
    }, [syncFromStorage]);

    // ── Mutations ──────────────────────────────────────────

    const addToWishlist = useCallback((product: any) => {
        const current = readFromStorage();
        const alreadyExists = current.some((item) => item.id === product.id);
        if (alreadyExists) return; // Prevent duplicates

        const newItem: WishlistItem = {
            id: product.id,
            title: product.title ?? product.name ?? '',
            slug: product.slug ?? '',
            price: product.price ?? '',
            banner_image: product.banner_image ?? product.featured_image ?? '',
            country: product.country ?? product.region ?? '',
            difficulty: product.difficulty ?? product.trek_level ?? '',
            duration_days: product.duration_days ?? product.trek_duration ?? '',
            addedAt: Date.now(),
        };

        const updated = [...current, newItem];
        writeToStorage(updated);
        setItems(updated);
    }, []);

    const removeFromWishlist = useCallback((productId: number) => {
        const current = readFromStorage();
        const updated = current.filter((item) => item.id !== productId);
        writeToStorage(updated);
        setItems(updated);
    }, []);

    const toggleWishlist = useCallback(
        (product: any) => {
            const current = readFromStorage();
            const exists = current.some((item) => item.id === product.id);
            if (exists) {
                removeFromWishlist(product.id);
            } else {
                addToWishlist(product);
            }
        },
        [addToWishlist, removeFromWishlist],
    );

    const isInWishlist = useCallback(
        (productId: number): boolean => {
            return items.some((item) => item.id === productId);
        },
        [items],
    );

    const clearWishlist = useCallback(() => {
        writeToStorage([]);
        setItems([]);
    }, []);

    return {
        wishlistItems: items,
        wishlistCount: items.length,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
    };
}
