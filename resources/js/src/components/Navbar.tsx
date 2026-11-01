import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowRight,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Heart,
    Menu,
    Mountain,
    Search,
    X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "./ui/Button";
import { SearchOverlay } from "./SearchOverlay";
import { Breadcrumb } from "./ui/Breadcrumb";
import { fetchData } from "../axiosHook";
import BASE_URL from "../global";
import { useLocation } from "react-router-dom";
import { useWishlist } from "../hooks/useWishlist";

export function Navbar({ forceWhite = false, hideBreadcrumb = false }: { forceWhite?: boolean; hideBreadcrumb?: boolean }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const scrolled = forceWhite || isScrolled;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeDestTab, setActiveDestTab] = useState(0);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

    const [destinations, setDestinations] = useState<any[]>([]);
    const [siteSettings, setSiteSettings] = useState<any>({});
    const [globalNav, setGlobalNav] = useState<any[]>([]);
    const [faviconUrl, setFaviconUrl] = useState('/favicon.ico');

    const { wishlistCount } = useWishlist();
    const { pathname } = useLocation();
    const isHomePage = pathname === "/";

    const fetchNavbarItems = async () => {
        // Try to load from session storage first for instant loading
        const cachedDestinations = sessionStorage.getItem('nav_destinations');
        const cachedGlobalNav = sessionStorage.getItem('nav_global_nav');
        const cachedSettings = sessionStorage.getItem('nav_site_settings');

        if (cachedDestinations) setDestinations(JSON.parse(cachedDestinations));
        if (cachedGlobalNav) setGlobalNav(JSON.parse(cachedGlobalNav));
        if (cachedSettings) setSiteSettings(JSON.parse(cachedSettings));

        try {
            const res: any = await fetchData("/navbar-items");
            if (res) {
                const destinations = res?.destinations ?? [];
                setDestinations(destinations);
                sessionStorage.setItem('nav_destinations', JSON.stringify(destinations));
            }

            const navRes: any = await fetchData("/global/navigation");
            if (navRes) {
                const header = navRes?.header ?? [];
                setGlobalNav(header);
                sessionStorage.setItem('nav_global_nav', JSON.stringify(header));
            }

            const settingsRes: any = await fetchData("/global/settings");
            if (settingsRes) {
                setSiteSettings(settingsRes);
                sessionStorage.setItem('nav_site_settings', JSON.stringify(settingsRes));
            }
        } catch (err) {
            console.error("Error fetching navbar items:", err);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        fetchNavbarItems();

        const faviconLink = document.querySelector("link[rel*='icon']");
        if (faviconLink) {
            const href = faviconLink.getAttribute('href');
            if (href) {
                setFaviconUrl(href);
            }
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMobileSection = (section: string) => {
        setMobileExpanded(mobileExpanded === section ? null : section);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setMobileExpanded(null);
    };

    return (
        <>
            <nav
                className={`fixed z-9999999 top-0 left-0 right-0 z-50 transition-all duration-300 ${forceWhite
                        ? "bg-white/95 backdrop-blur-md shadow-md py-3"
                        : scrolled
                            ? "bg-white/95 backdrop-blur-md shadow-md py-3"
                            : "bg-transparent py-5"
                    }`}
            >
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <div className="flex items-center nav:flex-1">
                            <a href="/" className="flex items-center gap-2 shrink-0">
                               
                                <img 
                                    src={
                                        scrolled 
                                            ? (siteSettings?.sticky_logo_url || siteSettings?.logo_url || "/assets/images/himalayan-white-logo.png")
                                            : (siteSettings?.logo_url || "/assets/images/himalayan-white-logo.png")
                                    } 
                                    alt="Logo" 
                                    className="h-16 w-auto object-contain" 
                                    width={24} 
                                    height={24} 
                                />
                                <span
                                    className={`text-xl font-bold tracking-tight ${scrolled ? "text-gray-900" : "text-white"
                                        }`}
                                >
                                    {siteSettings?.site_name}
                                </span>
                            </a>
                        </div>

                        {/* Desktop Menu (Center - ≥1200px) */}
                        <div className="hidden nav:flex items-center justify-center gap-6 nav:flex-1">
                            {/* Destination Mega Menu */}
                            <div
                                className="relative"
                                onMouseEnter={() => setActiveDropdown("destination")}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                <button
                                    className={`text-sm font-medium hover:text-[#0066FF] transition-colors flex items-center gap-1 whitespace-nowrap ${scrolled
                                            ? "text-gray-700"
                                            : "text-white/90 hover:text-white"
                                        }`}
                                >
                                    Destination
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${activeDropdown === "destination" ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {activeDropdown === "destination" &&
                                        destinations?.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute left-0 mt-2 overflow-hidden bg-white border border-gray-100 shadow-2xl top-full rounded-xl"
                                                style={{ minWidth: "600px" }}
                                            >
                                                <div className="flex divide-x divide-gray-100" style={{ minWidth: "750px" }}>
                                                    {/* Left Side: Content (Sub-destinations) */}
                                                    <div className="flex-1 p-8 bg-gray-50/30">
                                                        <AnimatePresence mode="wait">
                                                            {destinations[activeDestTab] && (
                                                                <motion.div
                                                                    key={destinations[activeDestTab].slug}
                                                                    initial={{ opacity: 0, x: -15 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    exit={{ opacity: 0, x: 15 }}
                                                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                                                >
                                                                    <div className="flex items-center justify-between mb-6">
                                                                        <div>
                                                                            <h3 className="text-xl font-bold text-gray-900">
                                                                                <a
                                                                                    href={"/destination/" + destinations[activeDestTab].slug}
                                                                                    className=""
                                                                                >
                                                                                    {destinations[activeDestTab].name}
                                                                                </a>
                                                                            </h3>
                                                                        </div>


                                                                    </div>

                                                                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                                                        {destinations[activeDestTab].sub_destinations?.length > 0 ? (
                                                                            destinations[activeDestTab].sub_destinations.map((sub: any) => (
                                                                                <a
                                                                                    key={sub.name}
                                                                                    href={"/" + (sub.destination_slug || destinations[activeDestTab].slug || "nepal") + "/" + sub.slug}
                                                                                    className="block px-2 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0066FF] transition-colors rounded-lg flex items-center gap-2 w-[210px]"
                                                                                ><ChevronRight
                                                                                        size={12}
                                                                                        className="text-gray-300 group-hover:text-[#0066FF] transition-colors"
                                                                                    />
                                                                                    {sub.name}
                                                                                </a>
                                                                            ))
                                                                        ) : (
                                                                            <div className="col-span-2 py-8 text-center text-gray-400 italic text-sm">
                                                                                No major activities available.
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>

                                                    {/* Right Side: Destination Tabs */}
                                                    <div className="w-72 p-4 bg-white">
                                                        <div className="mb-4 px-4 py-2">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                                                Destinations
                                                            </p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            {destinations.map((destination, index) => (
                                                                <button
                                                                    key={destination.slug}
                                                                    onMouseEnter={() => setActiveDestTab(index)}
                                                                    className={`w-full text-left px-4 py-4 rounded-2xl transition-all flex items-center gap-2 group ${activeDestTab === index
                                                                            ? "bg-blue-50 text-[#0066FF] font-bold shadow-sm"
                                                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                                                        }`}
                                                                >
                                                                    <ChevronLeft
                                                                        size={16}
                                                                        className={`transition-all duration-300 ${activeDestTab === index
                                                                                ? "translate-x-0 opacity-100"
                                                                                : "-translate-x-4 opacity-0 group-hover:opacity-50 group-hover:translate-x-0"
                                                                            }`}
                                                                    />
                                                                    <span className="text-sm tracking-tight ">{destination.name}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                </AnimatePresence>
                            </div>

                            {/* Dynamic Backend Navigation Items */}
                            {globalNav?.filter(n => n.label !== 'Destinations').map((navItem) => {
                                const hasChildren = navItem?.children && navItem?.children?.length > 0;

                                if (hasChildren) {
                                    return (
                                        <div
                                            key={navItem.id}
                                            className="relative"
                                            onMouseEnter={() => setActiveDropdown(`nav-${navItem.id}`)}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            <button
                                                className={`text-sm font-medium hover:text-[#0066FF] transition-colors flex items-center gap-1 whitespace-nowrap ${scrolled || forceWhite
                                                        ? "text-gray-700"
                                                        : "text-white/90 hover:text-white"
                                                    }`}
                                            >
                                                {navItem.label}
                                                <ChevronDown
                                                    size={16}
                                                    className={`transition-transform ${activeDropdown === `nav-${navItem.id}` ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </button>

                                            <AnimatePresence>
                                                {activeDropdown === `nav-${navItem.id}` && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className={`absolute left-0 py-2 mt-2 overflow-hidden bg-white border border-gray-100 shadow-xl top-full rounded-xl ${
                                                            navItem.children.length > 6 ? "w-[520px]" : "w-48"
                                                        }`}
                                                    >
                                                        <div className={navItem.children.length > 6 ? "grid grid-cols-2 p-2" : ""}>
                                                            {navItem.children.map((child: any) => (
                                                                <a
                                                                    key={child.id}
                                                                    href={child.url || '#'}
                                                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0066FF] transition-colors rounded-lg"
                                                                >
                                                                    {child.label}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                }

                                return (
                                    <a
                                        key={navItem.id}
                                        href={navItem.url || '#'}
                                        className={`text-sm font-medium hover:text-[#0066FF] transition-colors whitespace-nowrap ${scrolled
                                                ? "text-gray-700"
                                                : "text-white/90 hover:text-white"
                                            }`}
                                    >
                                        {navItem.label}
                                    </a>
                                );
                            })}
                        </div>

                        {/* Desktop Actions + Mobile Menu button (Right) */}
                        <div className="flex items-center justify-end gap-2 nav:gap-6 nav:flex-1">
                            {/* Desktop Actions */}
                            <div className="hidden nav:flex items-center gap-6">
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className={`p-2 rounded-full transition-colors ${scrolled
                                            ? "text-gray-600 hover:bg-gray-100"
                                            : "text-white hover:bg-white/10"
                                        }`}
                                >
                                    <Search size={20} />
                                </button>

                                {/* Wishlist Icon — Desktop */}
                                <a
                                    href="/wishlist"
                                    className={`relative p-2 rounded-full transition-colors ${
                                        scrolled
                                            ? 'text-gray-600 hover:bg-gray-100'
                                            : 'text-white hover:bg-white/10'
                                    }`}
                                    aria-label={`Wishlist (${wishlistCount} items)`}
                                    title="My Wishlist"
                                >
                                    <Heart size={20} />
                                    <AnimatePresence>
                                        {wishlistCount > 0 && (
                                            <motion.span
                                                key={wishlistCount}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                                                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-sm"
                                            >
                                                {wishlistCount > 99 ? '99+' : wishlistCount}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </a>

                                <a href="/plan-trip">
                                    <Button variant="primary" size="sm">
                                        Plan a Trip
                                    </Button>
                                </a>
                            </div>

                            {/* Mobile/Tablet Menu Button (<1200px) */}
                            <div className="flex nav:hidden items-center gap-1">
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className={`p-2 rounded-md ${scrolled ? "text-gray-900" : "text-white"
                                        }`}
                                >
                                    <Search size={20} />
                                </button>

                                {/* Wishlist Icon — Mobile */}
                                <a
                                    href="/wishlist"
                                    className={`relative p-2 rounded-md ${
                                        scrolled ? 'text-gray-900' : 'text-white'
                                    }`}
                                    aria-label={`Wishlist (${wishlistCount} items)`}
                                >
                                    <Heart size={20} />
                                    <AnimatePresence>
                                        {wishlistCount > 0 && (
                                            <motion.span
                                                key={wishlistCount}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                                                className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5 shadow-sm"
                                            >
                                                {wishlistCount > 99 ? '99+' : wishlistCount}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </a>

                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className={`p-2 rounded-md ${scrolled ? "text-gray-900" : "text-white"
                                        }`}
                                    aria-label="Toggle menu"
                                >
                                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Mobile Menu Panel */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white border-t shadow-lg nav:!hidden"
                            style={{ overflow: "hidden" }}
                        >
                            <div className="px-4 pt-2 pb-6 space-y-1 max-h-[80vh] overflow-y-auto">
                                {/* Destinations Section */}
                                <div>
                                    <button
                                        onClick={() => toggleMobileSection("destination")}
                                        className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 rounded-lg"
                                    >
                                        <span className="tracking-wider text-gray-800 uppercase">Destinations</span>
                                        <ChevronDown
                                            size={16}
                                            className={`text-gray-400 transition-transform ${mobileExpanded === "destination" ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {mobileExpanded === "destination" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                style={{ overflow: "hidden" }}
                                            >
                                                <div className="pl-4 space-y-1">
                                                    {destinations.map((destination) => (
                                                        <div key={destination.slug} className="py-2">
                                                            <a
                                                                href={"/destination/" + destination.slug}
                                                                onClick={closeMobileMenu}
                                                                className="block px-3 py-2 text-base font-bold hover:text-[#0066FF]"
                                                            >
                                                                {destination.name}
                                                            </a>
                                                            <div className="pl-4 mt-1 space-y-1">
                                                                {destination.sub_destinations?.map((sub: any) => (
                                                                    <a
                                                                        key={sub.name}
                                                                        href={"/" + (sub.destination_slug || destination.slug || "nepal") + "/" + sub.slug}
                                                                        onClick={closeMobileMenu}
                                                                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0066FF] transition-colors"
                                                                    >
                                                                        {sub.name}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Dynamic Mobile Navigation Items */}
                                {globalNav?.filter(n => n.label !== 'Destinations' && n.label !== 'Destination').map((navItem) => {
                                    const hasChildren = navItem?.children && navItem?.children?.length > 0;

                                    if (hasChildren) {
                                        return (
                                            <div key={navItem.id}>
                                                <button
                                                    onClick={() => toggleMobileSection(`nav-${navItem.id}`)}
                                                    className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 rounded-lg"
                                                >
                                                    <span className="tracking-wider text-gray-800">{navItem.label}</span>
                                                    <ChevronDown
                                                        size={16}
                                                        className={`text-gray-400 transition-transform ${mobileExpanded === `nav-${navItem.id}` ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>
                                                <AnimatePresence>
                                                    {mobileExpanded === `nav-${navItem.id}` && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            style={{ overflow: "hidden" }}
                                                        >
                                                            <div className="pl-2 space-y-1">
                                                                {navItem.children.map((child: any) => (
                                                                    <a
                                                                        key={child.id}
                                                                        href={child.url || '#'}
                                                                        onClick={closeMobileMenu}
                                                                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#0066FF] hover:bg-gray-50 rounded-md"
                                                                    >
                                                                        {child.label}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={navItem.id} className="pt-2">
                                            <a
                                                href={navItem.url || '#'}
                                                onClick={closeMobileMenu}
                                                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-[#0066FF] hover:bg-gray-50 rounded-md"
                                            >
                                                {navItem.label}
                                            </a>
                                        </div>
                                    );
                                })}

                                {/* CTA Button */}
                                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                                    <a href="/plan-trip" onClick={closeMobileMenu}>
                                        <Button variant="primary" className="justify-center w-full">
                                            Plan a Trip
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Global Breadcrumb overlaying top hero banner */}
            {!isHomePage && !hideBreadcrumb && !pathname.startsWith("/book/") && !pathname.startsWith("/invoice/") && (
                <div className="hidden md:block absolute top-[108px] left-1/2 -translate-x-1/2 z-20 w-full max-w-7xl px-4 sm:px-6 lg:px-8 pointer-events-none">
                    <div className="pointer-events-auto w-full pt-4 pb-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                        <Breadcrumb />
                    </div>
                </div>
            )}

            {/* Search Overlay */}
            <SearchOverlay
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
}
