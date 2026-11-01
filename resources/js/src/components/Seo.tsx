import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SeoMeta {
    seo_title?: string | null;
    seo_description?: string | null;
    seo_keywords?: string | null;
    focus_keyword?: string | null;
    slug?: string | null;
    canonical_url?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image?: string | null;
    twitter_title?: string | null;
    twitter_description?: string | null;
    twitter_image?: string | null;
    is_indexable?: boolean | number;
    is_followable?: boolean | number;
    schema_type?: string | null;
}

/** Shape of the raw package/trip API response fields used for schema generation */
export interface TripSchemaData {
    title?: string | null;
    description?: string | null;
    price?: string | number | null;
    pax_pricing?: Array<{ pax: number; price: string | number }> | null;
    duration_days?: string | number | null;
    banner_image?: string | null;
    region?: string | null;
    slug?: string | null;
    itineraries?: Array<{
        day?: string | number;
        title?: string;
        description?: string;
        altitude?: string;
        walking_hours?: string;
        distance_km?: string;
    }> | null;
    faqs?: Array<{ question?: string; answer?: string }> | null;
    reviews?: Array<{
        rating?: number;
        review?: string;
        author?: string;
        name?: string;
        created_at?: string;
    }> | null;
    includes?: Array<{ title?: string }> | null;
    activity_type?: string | null;
    difficulty?: string | null;
}

interface SeoProps {
    seoMeta?: SeoMeta | null;
    fallbackTitle?: string;
    fallbackDescription?: string;
    fallbackImage?: string;
    fallbackKeywords?: string;
    type?: string;
    canonicalPath?: string;
    /** Pass raw trip/package API data to generate a rich TouristTrip + Product schema */
    tripData?: TripSchemaData | null;
    /** Pass FAQ list directly to generate FAQPage schema */
    faqs?: Array<{ question?: string; answer?: string }> | null;
    /** Pass reviews directly to generate AggregateRating / Review schemas */
    reviews?: Array<{ rating?: number; review?: string; author?: string; name?: string; created_at?: string; date?: string; country?: string }> | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const stripHtml = (html?: string | null) =>
    html ? html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : '';

const resolveUrl = (origin: string, path?: string | null): string | null => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `${origin}/${path.replace(/^\//, '')}`;
};

// ─── Trip Schema Builder ──────────────────────────────────────────────────────

function buildTripSchema(
    tripData: TripSchemaData,
    canonical: string,
    origin: string,
    ogImage: string,
    description: string,
    title: string,
): object[] {
    const schemas: object[] = [];

    // ── 1. TouristTrip ────────────────────────────────────────────────────────
    const imageUrl = resolveUrl(origin, tripData.banner_image);

    const touristTrip: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        '@id': `${canonical}#trip`,
        'name': tripData.title || title,
        'description': stripHtml(tripData.description) || description,
        'url': canonical,
        'touristType': tripData.activity_type || 'Adventurer',
        'provider': {
            '@type': 'TouristInformationCenter',
            'name': 'Himalayan Bespoke',
            'url': origin,
        },
    };

    if (imageUrl || ogImage) {
        touristTrip['image'] = imageUrl || ogImage;
    }

    if (tripData.region) {
        touristTrip['location'] = {
            '@type': 'Place',
            'name': tripData.region,
            'address': {
                '@type': 'PostalAddress',
                'addressCountry': 'NP',
                'addressRegion': tripData.region,
            },
        };
    }

    const itineraryItems = (tripData.itineraries ?? []).filter(it => it.title || it.day);
    if (itineraryItems.length > 0) {
        touristTrip['itinerary'] = {
            '@type': 'ItemList',
            'name': `${tripData.title || title} Itinerary`,
            'itemListElement': itineraryItems.map((it, idx) => ({
                '@type': 'ListItem',
                'position': idx + 1,
                'name': it.title || `Day ${it.day}`,
                ...(it.description ? { 'description': stripHtml(it.description) } : {}),
                ...(it.altitude ? {
                    'additionalProperty': {
                        '@type': 'PropertyValue',
                        'name': 'Altitude',
                        'value': it.altitude,
                    },
                } : {}),
            })),
        };
    }

    if (tripData.duration_days) {
        const days = parseInt(String(tripData.duration_days), 10);
        if (!isNaN(days)) {
            touristTrip['duration'] = `P${days}D`;
        }
    }

    schemas.push(touristTrip);

    // ── 2. Product (for price + rating rich results) ───────────────────────────
    const parsePrice = (p?: string | number | null): number | null => {
        if (p == null) return null;
        const n = parseFloat(String(p).replace(/,/g, ''));
        return isNaN(n) ? null : n;
    };

    const basePrice = parsePrice(tripData.price);

    if (basePrice != null) {
        const paxPrices = (tripData.pax_pricing ?? [])
            .map(p => parsePrice(p.price))
            .filter((p): p is number => p !== null);
        const lowestPrice = paxPrices.length > 0 ? Math.min(...paxPrices) : basePrice;

        const reviews = (tripData.reviews ?? []).filter(r => r.rating != null);
        const avgRating = reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviews.length).toFixed(1)
            : null;

        const product: Record<string, unknown> = {
            '@context': 'https://schema.org',
            '@type': 'Product',
            '@id': `${canonical}#product`,
            'name': tripData.title || title,
            'description': stripHtml(tripData.description) || description,
            'url': canonical,
            ...(imageUrl ? { 'image': imageUrl } : {}),
            'brand': { '@type': 'Brand', 'name': 'Himalayan Bespoke' },
            'offers': {
                '@type': 'Offer',
                'priceCurrency': 'USD',
                'price': lowestPrice,
                'url': canonical,
                'availability': 'https://schema.org/InStock',
                'validFrom': new Date().toISOString().split('T')[0],
            },
        };

        if (avgRating && reviews.length > 0) {
            product['aggregateRating'] = {
                '@type': 'AggregateRating',
                'ratingValue': avgRating,
                'reviewCount': reviews.length,
                'bestRating': '5',
                'worstRating': '1',
            };

            product['review'] = reviews.slice(0, 5).map(r => ({
                '@type': 'Review',
                'reviewRating': {
                    '@type': 'Rating',
                    'ratingValue': String(r.rating),
                    'bestRating': '5',
                },
                'author': { '@type': 'Person', 'name': r.name || r.author || 'Traveler' },
                ...(r.review ? { 'reviewBody': stripHtml(r.review) } : {}),
                ...(r.created_at ? { 'datePublished': r.created_at.split('T')[0] } : {}),
            }));
        }

        schemas.push(product);
    }

    // ── 3. FAQPage ────────────────────────────────────────────────────────────
    const faqs = (tripData.faqs ?? []).filter(f => f.question && f.answer);
    if (faqs.length > 0) {
        schemas.push({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': faqs.map(f => ({
                '@type': 'Question',
                'name': stripHtml(f.question),
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': stripHtml(f.answer),
                },
            })),
        });
    }

    return schemas;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const Seo: React.FC<SeoProps> = ({
    seoMeta,
    fallbackTitle,
    fallbackDescription,
    fallbackImage = '/assets/images/logo.png',
    fallbackKeywords = 'trekking, nepal, himalayas, adventure, travel',
    type = 'website',
    canonicalPath,
    tripData,
    faqs,
    reviews,
}) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    // Resolve Canonical URL
    const resolvedCanonicalPath = (() => {
        if (!canonicalPath) return canonicalPath;
        if (seoMeta?.slug) {
            return canonicalPath.replace(/\/[^\/]+$/, `/${seoMeta.slug}`);
        }
        return canonicalPath;
    })();
    const canonical = seoMeta?.canonical_url ||
        (resolvedCanonicalPath ? `${origin}${resolvedCanonicalPath}` : currentUrl);

    // Resolve Titles
    const defaultSiteName = 'Himalayan Bespoke';
    const rawTitle = seoMeta?.seo_title || fallbackTitle;
    const title = rawTitle
        ? `${rawTitle} | ${defaultSiteName}`
        : defaultSiteName;

    // Resolve Descriptions
    const description = seoMeta?.seo_description ||
        fallbackDescription ||
        'Discover the best trekking routes and expedition packages in the majestic Himalayas with Himalayan Bespoke.';

    // Resolve Keywords
    const baseKeywords = seoMeta?.seo_keywords || fallbackKeywords;
    const keywords = seoMeta?.focus_keyword
        ? `${seoMeta.focus_keyword}${baseKeywords ? `, ${baseKeywords}` : ''}`
        : baseKeywords;

    // Resolve Robots
    const isIndex = seoMeta?.is_indexable !== undefined
        ? Boolean(seoMeta.is_indexable)
        : true;
    const isFollow = seoMeta?.is_followable !== undefined
        ? Boolean(seoMeta.is_followable)
        : true;
    const robots = `${isIndex ? 'index' : 'noindex'}, ${isFollow ? 'follow' : 'nofollow'}`;

    // Resolve Social Media Tags
    const ogTitle = seoMeta?.og_title || rawTitle || defaultSiteName;
    const ogDescription = seoMeta?.og_description || description;

    const resolveImageUrl = (path?: string | null) => {
        if (!path) return `${origin}${fallbackImage}`;
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        return `${origin}/${path.replace(/^\//, '')}`;
    };

    const ogImage = resolveImageUrl(seoMeta?.og_image || fallbackImage);
    const twitterTitle = seoMeta?.twitter_title || ogTitle;
    const twitterDescription = seoMeta?.twitter_description || ogDescription;
    const twitterImage = resolveImageUrl(seoMeta?.twitter_image || seoMeta?.og_image || fallbackImage);

    // Schema Type
    const schemaType = seoMeta?.schema_type || 'WebPage';

    // Build structured data blocks
    const structuredDataBlocks: object[] = tripData
        ? buildTripSchema(tripData, canonical, origin, ogImage, description, rawTitle || defaultSiteName)
        : [{
            '@context': 'https://schema.org',
            '@type': schemaType,
            'name': ogTitle,
            'description': description,
            'url': canonical,
            ...(ogImage ? { 'image': ogImage } : {}),
        }];

    // Append FAQPage schema if faqs prop is passed directly and not already present
    if (reviews && reviews.length > 0) {
        const validReviews = reviews.filter(r => r.rating != null && (r.name || r.author));
        if (validReviews.length > 0) {
            const totalRating = validReviews.reduce((sum, r) => sum + (Number(r.rating) ?? 0), 0);
            const avgRating = (totalRating / validReviews.length).toFixed(1);
            
            const orgSchema: Record<string, any> = {
                '@context': 'https://schema.org',
                '@type': 'TravelAgency',
                'name': 'Himalayan Bespoke',
                'url': origin,
                'image': ogImage,
                'priceRange': '$$$',
                'address': {
                    '@type': 'PostalAddress',
                    'addressCountry': 'NP',
                    'addressLocality': 'Kathmandu',
                },
                'aggregateRating': {
                    '@type': 'AggregateRating',
                    'ratingValue': avgRating,
                    'reviewCount': validReviews.length,
                    'bestRating': '5',
                    'worstRating': '1',
                },
                'review': validReviews.slice(0, 10).map(r => ({
                    '@type': 'Review',
                    'reviewRating': {
                        '@type': 'Rating',
                        'ratingValue': String(r.rating),
                        'bestRating': '5',
                    },
                    'author': { '@type': 'Person', 'name': r.name || r.author || 'Traveler' },
                    ...(r.review ? { 'reviewBody': stripHtml(r.review) } : {}),
                })),
            };
            structuredDataBlocks.push(orgSchema);
        }
    }

    // Append FAQPage schema if faqs prop is passed directly and not already present
    if (faqs && faqs.length > 0) {
        const activeFaqs = faqs.filter(f => f.question && f.answer);
        if (activeFaqs.length > 0) {
            const hasFaqSchema = structuredDataBlocks.some(
                (block: any) => block['@type'] === 'FAQPage'
            );
            if (!hasFaqSchema) {
                structuredDataBlocks.push({
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    'mainEntity': activeFaqs.map(f => ({
                        '@type': 'Question',
                        'name': stripHtml(f.question),
                        'acceptedAnswer': {
                            '@type': 'Answer',
                            'text': stripHtml(f.answer),
                        },
                    })),
                });
            }
        }
    }

    return (
        <Helmet>
            {/* Primary HTML Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content={robots} />
            <link rel="canonical" href={canonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={ogTitle} />
            <meta property="og:description" content={ogDescription} />
            <meta property="og:url" content={canonical} />
            {ogImage && <meta property="og:image" content={ogImage} />}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={twitterTitle} />
            <meta name="twitter:description" content={twitterDescription} />
            {twitterImage && <meta name="twitter:image" content={twitterImage} />}

            {/* Structured Schema Data — one <script> block per schema */}
            {structuredDataBlocks.map((schema, i) => (
                <script key={i} type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            ))}
        </Helmet>
    );
};

