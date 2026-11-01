// Shared TypeScript types for the Departure Calendar system

export type DepartureStatus = 'available' | 'limited' | 'fully_booked';

export interface Departure {
    id: number;
    package_id: number | null;
    date: string; // YYYY-MM-DD
    price: number;
    total_seats: number;
    available_seats: number;
    status: DepartureStatus;
    package?: { id: number; title: string; slug: string };
}

export interface DepartureBooking {
    id: number;
    departure_id: number;
    name: string;
    email: string;
    phone?: string;
    seats_booked: number;
    payment_type?: 'full' | 'advance';
    created_at: string;
    departure?: Departure;
}

/** Slim package object returned by /api/departure-packages */
export interface PackageInfo {
    id: number;
    title: string;
    slug: string;
    price: number;
    pax_pricing: { pax: number; price: number }[];
    allow_deposit: boolean;
    deposit_percentage: number;
    duration_days?: string;
    region?: string;
    featured_image?: string;
    banner_image?: string;
    includes?: string[];
    excludes?: string[];
}

export interface DeparturesResponse {
    data: Departure[];
    threshold: number;
    package: PackageInfo | null;
}

export interface DepartureSettings {
    limited_threshold: number;
}

export interface BulkDepartureItem {
    date: string;
    price: number;
    total_seats: number;
    available_seats: number;
}
