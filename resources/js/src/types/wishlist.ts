// ─────────────────────────────────────────────────────────
// Wishlist Types
// Client-side only — data is stored in localStorage
// ─────────────────────────────────────────────────────────

export interface WishlistItem {
    /** Unique product identifier */
    id: number;
    /** Package title */
    title: string;
    /** URL slug for linking to the product page */
    slug: string;
    /** Price as returned by the API (may be string or number) */
    price: string | number;
    /** Banner/featured image path (relative, appended to BASE_URL) */
    banner_image?: string;
    /** Country or region name */
    country?: string;
    /** Trek difficulty level */
    difficulty?: string;
    /** Duration string e.g. "14 Days" */
    duration_days?: string;
    /** ISO timestamp when the item was added */
    addedAt: number;
}
