import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
    dim?: boolean;
}

interface BreadcrumbProps {
    /** Override auto-generated breadcrumbs with custom items */
    items?: BreadcrumbItem[];
    /** Use dark variant (for light backgrounds). Default: light (for dark hero banners) */
    dark?: boolean;
    className?: string;
}

/**
 * Auto-generates breadcrumbs from the current URL path.
 * Pass `items` to fully override with custom crumbs.
 *
 * Renders:  Home > Segment 1 > Segment 2 > ... > Current Page
 */
export function Breadcrumb({ items, dark = false, className = '' }: BreadcrumbProps) {
    const { pathname } = useLocation();

    const crumbs: BreadcrumbItem[] = items ?? buildCrumbs(pathname);

    const textBase = dark
        ? 'text-gray-500 hover:text-gray-900'
        : 'text-white/60 hover:text-white';
    const textCurrent = dark ? 'text-gray-900 font-semibold' : 'text-white font-semibold';
    const chevronColor = dark ? 'text-gray-400' : 'text-white/40';

    return (
        <nav
            aria-label="Breadcrumb"
            className={`hidden md:flex items-center flex-wrap gap-1 text-sm ${className}`}
        >
            {/* Home */}
            <Link
                to="/"
                className={`flex items-center gap-1 transition-colors duration-200 ${textBase}`}
                aria-label="Home"
            >
                <Home size={14} />
            </Link>

            {crumbs.map((crumb, idx) => {
                const isLast = idx === crumbs.length - 1;
                return (
                    <React.Fragment key={idx}>
                        <ChevronRight size={13} className={chevronColor} aria-hidden />
                        {crumb.dim ? (
                            <span className={dark ? 'text-gray-400 transition-colors duration-200' : 'transition-colors duration-200 text-white/60 hover:text-white'}>
                                {crumb.label}
                            </span>
                        ) : isLast || !crumb.href ? (
                            <span className={textCurrent} aria-current="page">
                                {crumb.label}
                            </span>
                        ) : (
                            <Link
                                to={crumb.href}
                                className={`transition-colors duration-200 ${textBase}`}
                            >
                                {crumb.label}
                            </Link>
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}

// ─────────────────────────────────────────────
// Helper: derive crumbs from URL pathname
// ─────────────────────────────────────────────
function buildCrumbs(pathname: string): BreadcrumbItem[] {
    const segments = pathname.split('/').filter(Boolean);
    const crumbs: BreadcrumbItem[] = [];

    // Segments hidden entirely from breadcrumbs (no real index page)
    const skippedSegments = ['page', 'trek', 'destination'];

    // Segments shown as plain text (visible but not clickable)
    const noLinkSegments = ['guide', 'trekking', 'luxury'];

    segments.forEach((seg, idx) => {
        if (skippedSegments.includes(seg.toLowerCase())) return;

        // Visible but not clickable — push as dim label
        if (noLinkSegments.includes(seg.toLowerCase())) {
            crumbs.push({ label: formatLabel(seg), dim: true });
            return;
        }

        let href: string | undefined = '/' + segments.slice(0, idx + 1).join('/');

        // Special rule for sub-destinations (e.g., /nepal/nepal-tour-packages)
        // Map the parent destination segment link to `/destination/:slug`
        if (segments.length === 2 && idx === 0) {
            const nonDestPrefixes = ['blog', 'places', 'guide', 'additional-info', 'team', 'book', 'legal-documents', 'invoice'];
            if (!nonDestPrefixes.includes(seg.toLowerCase())) {
                href = `/destination/${seg}`;
            }
        }

        // If it's the last segment, it represents the current page (no link)
        if (idx === segments.length - 1) {
            href = undefined;
        }

        const label = formatLabel(seg);
        crumbs.push({ label, href });
    });

    return crumbs;
}

/** Converts URL segment to a readable label */
function formatLabel(seg: string): string {
    return decodeURIComponent(seg)
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
}
