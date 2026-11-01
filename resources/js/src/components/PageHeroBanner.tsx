import React from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumb } from './ui/Breadcrumb';

interface PageHeroBannerProps {
    /** Optional background image URL */
    imageUrl?: string;
    /** Optional custom breadcrumb items */
    breadcrumbItems?: { label: string; href?: string }[];
}

/**
 * Global hero banner with breadcrumb.
 * Fixed just below the navbar on all pages except homepage.
 * z-40 so it sits above page content but below the navbar (z-50).
 */
export function PageHeroBanner({ imageUrl, breadcrumbItems }: PageHeroBannerProps) {
    const { pathname } = useLocation();

    if (pathname === '/') return null;

    return (
        <div
            className="fixed top-[72px] left-0 right-0 z-40 overflow-hidden"
            style={{ height: '52px' }}
        >
            {/* Dark gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 to-transparent" />

            {/* Optional background image */}
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
            )}

            {/* Breadcrumb */}
            <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Breadcrumb items={breadcrumbItems} />
            </div>
        </div>
    );
}
