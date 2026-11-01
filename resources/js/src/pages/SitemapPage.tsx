import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { fetchData } from '../axiosHook';

interface SitemapItem {
    name?: string;
    title?: string;
    slug: string;
    destination_slug?: string;
}

interface SitemapData {
    destinations: SitemapItem[];
    subDestinations: SitemapItem[];
    experiences: SitemapItem[];
    treks: SitemapItem[];
    packages: SitemapItem[];
    pages: SitemapItem[];
    guides: SitemapItem[];
    additionalInfos: SitemapItem[];
    posts: SitemapItem[];
}

interface SectionConfig {
    title: string;
    items: { label: string; path: string }[];
}

const staticSections: SectionConfig[] = [
    {
        title: 'Main Pages',
        items: [
            { label: 'Home', path: '/' },
            { label: 'Plan a Trip', path: '/plan-trip' },
            { label: 'Departures', path: '/departures' },
            { label: 'Blog', path: '/blog' },
            { label: 'Contact', path: '/contact' },
            { label: 'Legal Documents', path: '/legal-documents' },
            { label: 'Privacy Policy', path: '/privacy-policy' },
            { label: 'Terms of Use', path: '/terms-of-use' },
        ],
    },
];

function buildSections(data: SitemapData): SectionConfig[] {
    const label = (item: SitemapItem) => item.name ?? item.title ?? item.slug;

    return [
        ...staticSections,
        {
            title: 'Destinations',
            items: data.destinations.map(d => ({ label: label(d), path: `/destination/${d.slug}` })),
        },
        {
            title: 'Major Activities',
            items: data.subDestinations.map(d => ({
                label: label(d),
                path: `/${d.destination_slug ?? 'nepal'}/${d.slug}`,
            })),
        },
        {
            title: 'Luxury Experiences',
            items: data.experiences.map(d => ({ label: label(d), path: `/luxury/${d.slug}` })),
        },
        {
            title: 'Trekking',
            items: data.treks.map(d => ({ label: label(d), path: `/trekking/${d.slug}` })),
        },
        {
            title: 'Packages',
            items: data.packages.map(d => ({ label: label(d), path: `/${d.slug}` })),
        },
        {
            title: 'Pages',
            items: data.pages.map(d => ({ label: label(d), path: `/page/${d.slug}` })),
        },
        {
            title: 'Guides',
            items: data.guides.map(d => ({ label: label(d), path: `/guide/${d.slug}` })),
        },
        {
            title: 'Additional Info',
            items: data.additionalInfos.map(d => ({ label: label(d), path: `/additional-info/${d.slug}` })),
        },
        {
            title: 'Blog Posts',
            items: data.posts.map(d => ({ label: label(d), path: `/blog/${d.slug}` })),
        },
    ].filter(s => s.items.length > 0);
}

export function SitemapPage() {
    const [sections, setSections] = useState<SectionConfig[]>(staticSections);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchData<SitemapData>('/sitemap-data')
            .then(data => {
                setSections(buildSections(data));
                setLoading(false);
            })
            .catch(() => {
                setError(true);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
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
                            Sitemap
                        </h1>
                        <p className="text-gray-300 text-lg">
                            Browse all pages and resources on our website
                        </p>
                    </motion.div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {loading && (
                    <div className="text-center text-gray-500 py-20 text-lg">Loading sitemap…</div>
                )}

                {error && !loading && (
                    <div className="text-center text-red-500 py-20 text-lg">
                        Failed to load sitemap data. Please try again later.
                    </div>
                )}

                {!loading && !error && (
                    <div className="max-w-3xl mx-auto divide-y divide-gray-100">
                        {sections.map((section, idx) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.04 }}
                                className="py-6"
                            >
                                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                                    {section.title}
                                </h2>
                                <ul className="space-y-1.5">
                                    {section.items.map(item => (
                                        <li key={item.path}>
                                            <Link
                                                to={item.path}
                                                className="text-gray-800 hover:text-[#0066FF] transition-colors text-sm"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}