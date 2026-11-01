import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    User,
    Calendar,
    Clock,
    Tag,
    Globe,
    Twitter,
    Facebook,
    Linkedin,
    Instagram,
    BookOpen,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { fetchData } from "../axiosHook";
import BASE_URL from "../global";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Seo } from "../components/Seo";
import Loading from "../components/Loading";
import { NotFoundPage } from "./NotFoundPage";

interface AuthorData {
    id: number;
    name: string;
    slug: string;
    designation: string | null;
    bio: string | null;
    avatar_url: string | null;
    social_links: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
        website?: string;
    } | null;
}

interface Post {
    id: number;
    title: string;
    slug: string;
    featured_image: string | null;
    excerpt: string | null;
    published_at: string;
    reading_time: number | null;
    categories: { id: number; name: string; slug: string }[];
}

interface PostsPagination {
    data: Post[];
    current_page: number;
    last_page: number;
    total: number;
}

function AuthorSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <div className="dc-skeleton h-[40vh]" />
            <div className="max-w-5xl mx-auto px-4 py-16">
                <div className="flex flex-col items-center gap-6 mb-12">
                    <div className="dc-skeleton w-36 h-36 rounded-full" />
                    <div className="dc-skeleton dc-skeleton-title w-64" />
                    <div className="dc-skeleton dc-skeleton-row w-48" />
                    <div className="dc-skeleton dc-skeleton-row w-full max-w-lg" />
                    <div className="dc-skeleton dc-skeleton-row w-full max-w-md" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md">
                            <div className="dc-skeleton h-52 w-full" />
                            <div className="p-5">
                                <div className="dc-skeleton dc-skeleton-title w-3/4 mb-3" />
                                <div className="dc-skeleton dc-skeleton-row w-full" />
                                <div className="dc-skeleton dc-skeleton-row w-2/3 mt-2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function SocialLink({
    href,
    icon: Icon,
    label,
    colorClass,
}: {
    href: string;
    icon: React.ElementType;
    label: string;
    colorClass: string;
}) {
    return (
        <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center justify-center w-11 h-11 rounded-full text-white shadow-md transition-shadow hover:shadow-lg ${colorClass}`}
        >
            <Icon size={20} />
        </motion.a>
    );
}

export function AuthorSlugPage() {
    const { slug } = useParams<{ slug: string }>();
    const [author, setAuthor] = useState<AuthorData | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [pagination, setPagination] = useState<PostsPagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(false);
            setPage(1);
            try {
                const res = await fetchData<{ author: AuthorData; posts: PostsPagination }>(
                    `/author/${slug}`
                );
                setAuthor(res.author);
                setPosts(res.posts.data);
                setPagination(res.posts);
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [slug]);

    const loadMore = async () => {
        if (!pagination || page >= pagination.last_page) return;
        const nextPage = page + 1;
        setLoadingMore(true);
        try {
            const res = await fetchData<{ author: AuthorData; posts: PostsPagination }>(
                `/author/${slug}?page=${nextPage}`
            );
            setPosts((prev) => [...prev, ...res.posts.data]);
            setPagination(res.posts);
            setPage(nextPage);
        } catch {
            console.error("Failed to load more posts");
        } finally {
            setLoadingMore(false);
        }
    };

    if (loading) return <AuthorSkeleton />;
    if (error || !author) return <NotFoundPage />;

    const social = author.social_links || {};
    const avatarSrc = author.avatar_url
        ? `${BASE_URL}/${author.avatar_url}`
        : null;

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Seo
                fallbackTitle={`${author.name} — Author Profile`}
                fallbackDescription={author.bio || `Read articles by ${author.name}`}
                fallbackImage={author.avatar_url || undefined}
                canonicalPath={`/author/${author.slug}`}
                type="Person"
            />
            <Navbar />

            {/* Hero Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0d1b3e] via-[#0b2d6b] to-[#0c4a8f]  pb-18 pt-48  px-4">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 20% 50%, rgba(6,182,212,0.5) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(0,102,255,0.4) 0%, transparent 60%)",
                        }}
                    />
                </div>

                <div className="relative z-10 w-full mx-auto flex flex-wrap items-center text-center gap-x-8 justify-center">

                 <div>
                    {/* Avatar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6"
                    >
                        {avatarSrc &&
                            <img
                                src={avatarSrc}
                                alt={author.name}
                                className="w-36 h-36 rounded-full object-cover border-4 border-white/30 shadow-2xl ring-4 ring-cyan-400/40"
                            />
                        }
                        
                    </motion.div>
                    {/* Social Links */}
                    {(social.facebook ||
                        social.twitter ||
                        social.linkedin ||
                        social.instagram ||
                        social.website) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex items-center gap-3"
                        >
                            {social.website && (
                                <SocialLink
                                    href={social.website}
                                    icon={Globe}
                                    label="Website"
                                    colorClass="bg-slate-600 hover:bg-slate-700"
                                />
                            )}
                            {social.twitter && (
                                <SocialLink
                                    href={social.twitter}
                                    icon={Twitter}
                                    label="Twitter"
                                    colorClass="bg-sky-500 hover:bg-sky-600"
                                />
                            )}
                            {social.facebook && (
                                <SocialLink
                                    href={social.facebook}
                                    icon={Facebook}
                                    label="Facebook"
                                    colorClass="bg-blue-700 hover:bg-blue-800"
                                />
                            )}
                            {social.linkedin && (
                                <SocialLink
                                    href={social.linkedin}
                                    icon={Linkedin}
                                    label="LinkedIn"
                                    colorClass="bg-blue-600 hover:bg-blue-700"
                                />
                            )}
                            {social.instagram && (
                                <SocialLink
                                    href={social.instagram}
                                    icon={Instagram}
                                    label="Instagram"
                                    colorClass="bg-gradient-to-br from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500"
                                />
                            )}
                        </motion.div>
                    )}
</div>
<div className="text-left">
                    {/* Name & designation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                            {author.name}
                        </h1>
                        {author.designation && (
                            <p className="text-lg text-cyan-300 font-medium mb-4">
                                {author.designation}
                            </p>
                        )}
                    </motion.div>

                    {/* Bio */}
                    {author.bio && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-white/80 max-w-2xl leading-relaxed mb-6 text-base"
                        >
                            {author.bio}
                        </motion.p>
                    )}

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="flex items-center gap-2 text-cyan-200 mb-6 text-sm"
                    >
                        <BookOpen size={16} />
                        <span>
                            {pagination?.total ?? posts.length}{" "}
                            {(pagination?.total ?? posts.length) === 1 ? "Article" : "Articles"} Published
                        </span>
                    </motion.div>
</div>
                    
                </div>
            </div>

            {/* Articles Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gray-900 mb-10"
                >
                    Articles by{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066FF] to-[#06B6D4]">
                        {author.name}
                    </span>
                </motion.h2>

                {posts.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-40" />
                        <p className="text-lg">No published articles yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post, index) => (
                                <motion.a
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: (index % 3) * 0.08 }}
                                    className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300"
                                >
                                    {/* Image */}
                                    <div className="relative h-52 overflow-hidden bg-gray-100">
                                        {post.featured_image ? (
                                            <img
                                                src={`${BASE_URL}/${post.featured_image}`}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#0066FF]/10 to-[#06B6D4]/10 flex items-center justify-center">
                                                <BookOpen size={40} className="text-gray-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-1">
                                        {/* Meta */}
                                        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                                            {post.categories?.[0] && (
                                                <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">
                                                    <Tag size={11} />
                                                    {post.categories[0].name}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Calendar size={11} />
                                                {new Date(post.published_at).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            {post.reading_time && (
                                                <span className="flex items-center gap-1">
                                                    <Clock size={11} />
                                                    {post.reading_time} min
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors line-clamp-2 mb-3 flex-1">
                                            {post.title}
                                        </h3>

                                        {post.excerpt && (
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-2 text-[#0066FF] font-semibold text-sm group-hover:gap-4 transition-all mt-auto">
                                            Read Article <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>

                        {/* Load More */}
                        {pagination && page < pagination.last_page && (
                            <div className="flex justify-center mt-12">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#0066FF] to-[#06B6D4] text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow disabled:opacity-70"
                                >
                                    {loadingMore ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Loading…
                                        </>
                                    ) : (
                                        <>
                                            Load More Articles
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        )}
                    </>
                )}
            </section>

            <Footer />
        </div>
    );
}
