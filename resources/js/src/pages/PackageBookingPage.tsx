import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { postData } from '../axiosHook';
import { User, Calendar, CreditCard, ArrowRight, ShieldCheck, HelpCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BASE_URL from '../global';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { Breadcrumb } from '../components/ui/Breadcrumb';


function parsePrice(p: unknown): number { return parseFloat(String(p).replace(/,/g, '')) || 0; }

function BookingSkeleton() {
    return (
        <div className="min-h-screen font-sans text-gray-900 bg-[#F8FAFC] pt-20">
            <Navbar forceWhite />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="dc-skeleton dc-skeleton-banner" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="dc-skeleton-card">
                            <div className="dc-skeleton dc-skeleton-title" />
                            <div className="flex gap-4 mb-8">
                                <div className="dc-skeleton dc-skeleton-tag" />
                                <div className="dc-skeleton dc-skeleton-tag" />
                            </div>
                            <div className="space-y-4">
                                <div className="dc-skeleton dc-skeleton-field" />
                                <div className="dc-skeleton dc-skeleton-field" />
                                <div className="dc-skeleton dc-skeleton-field" />
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="dc-skeleton dc-skeleton-card h-96" />
                    </div>
                </div>
            </main>
        </div>
    );
}

export function PackageBookingPage() {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const travelDate = searchParams.get('date') || '';
    const initialPax = parseInt(searchParams.get('pax') || '1');
    const initialTierSlug = searchParams.get('tier') || '';

    const [packageInfo, setPackageInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [inquiryLoading, setInquiryLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [pax, setPax] = useState(initialPax);
    const [date, setDate] = useState(travelDate);
    const [payType, setPayType] = useState<'full' | 'advance'>('full');
    const [travellerNames, setTravellerNames] = useState<string[]>([]);
    const [showPricingTable, setShowPricingTable] = useState(false);
    // Tier state — reactive so price updates when tier changes
    const [selectedTierSlug, setSelectedTierSlug] = useState(initialTierSlug || 'default');

    // Add-on Selections State: { [addonPackageId]: [addonItemId, ...] }
    const [addonSelections, setAddonSelections] = useState<Record<number, number[]>>({});
    const [toast, setToast] = useState('');

    const showToast = (msg: string) => {
        setToast(msg);
        if ((window as any).toastTimeout) clearTimeout((window as any).toastTimeout);
        (window as any).toastTimeout = setTimeout(() => setToast(''), 3000);
    };

    useEffect(() => {
        if (!slug) {
            navigate('/departures');
            return;
        }

        fetch(`${BASE_URL}/api/package/${slug}`)
            .then(res => res.json())
            .then(data => {
                setPackageInfo(data);
                setLoading(false);
                // Pre-fill traveller names if initialPax > 1
                if (initialPax > 1) {
                    setTravellerNames(Array(initialPax - 1).fill(''));
                }
                // Resolve the correct tier slug from loaded data
                const slugify = (n: string) => n.toLowerCase().replace(/\s+/g, '-').trim();
                const realTiers = (data.package_tiers ?? []).filter((t: any) => t.name);
                const hasTiers = realTiers.length > 0;
                if (hasTiers) {
                    // Try to match URL tier param against real tiers
                    const matched = realTiers.find(
                        (t: any) => slugify(t.name) === slugify(initialTierSlug)
                    );
                    // If matched use that slug; otherwise fall back to first tier
                    const resolved = matched
                        ? slugify(matched.name)
                        : slugify(realTiers[0].name);
                    setSelectedTierSlug(resolved);
                } else {
                    // No real tiers — use 'default' to match pax_pricing sentinel
                    setSelectedTierSlug('default');
                }
                // Pre-fill addon selections for required addons (min_qty >= 1)
                if (data && data.active_addon_packages) {
                    const defaults: Record<number, number[]> = {};
                    data.active_addon_packages.forEach((addonPkg: any) => {
                        if (addonPkg.min_qty >= 1) {
                            defaults[addonPkg.id] = [addonPkg.min_qty];
                        }
                    });
                    setAddonSelections(defaults);
                }
            })
            .catch(() => {
                setError('Could not find package details.');
                setLoading(false);
            });
    }, [slug, initialPax, navigate, initialTierSlug]);

    const openImageGallery = (e: React.MouseEvent, images: any[], startIndex: number) => {
        e.stopPropagation();
        e.preventDefault();
        const slides = images
            .filter((img: any) => img && img.url)
            .map((img: any) => ({
                src: `${BASE_URL}/${img.url.replace(/^\//, '')}`,
                type: 'image' as const,
            }));
        if (slides.length > 0) {
            Fancybox.show(slides, { startIndex });
        }
    };

    // Derive the tier object for the selected tier slug
    const getSelectedTierObject = () => {
        if (!packageInfo) return null;
        const slugify = (n: string) => n.toLowerCase().replace(/\s+/g, '-').trim();
        const tiers: any[] = (packageInfo.package_tiers ?? []).filter((t: any) => t.name);
        return tiers.find((t: any) => slugify(t.name) === selectedTierSlug) ?? null;
    };

    const getDynamicPricePerPerson = () => {
        if (!packageInfo) return 0;

        const isDefaultTier = !selectedTierSlug || selectedTierSlug === 'default';
        const tierObj = isDefaultTier ? null : getSelectedTierObject();

        // Filter pax_pricing rows that belong to this tier
        const tierPaxPricing = (packageInfo.pax_pricing ?? []).filter(
            (p: any) => p.pax != null && p.pax !== '' && p.price != null && p.price !== ''
                && (isDefaultTier
                    // Default/base tier: match rows where tier is 'default', empty, or null
                    ? (!p.tier || p.tier === '' || p.tier === 'default')
                    // Named tier: match rows with this tier slug exactly
                    : p.tier === selectedTierSlug
                )
        );

        const basePrice = tierObj?.price != null
            ? parsePrice(tierObj.price)
            : parsePrice(packageInfo.price);

        if (tierPaxPricing.length === 0) return basePrice;

        const sortedPricing = [...tierPaxPricing].sort((a: any, b: any) => Number(a.pax) - Number(b.pax));
        const match = sortedPricing.find((p: any) => pax <= Number(p.pax));

        return match
            ? parsePrice(match.price)
            : parsePrice(sortedPricing[sortedPricing.length - 1]?.price) ?? basePrice;
    };

    const pricePerPerson = getDynamicPricePerPerson();
    const baseTotalPrice = pricePerPerson * pax;

    // Calculate addon total price
    const getAddonTotal = () => {
        if (!packageInfo || !packageInfo.active_addon_packages) return 0;
        let total = 0;
        packageInfo.active_addon_packages.forEach((addonPkg: any) => {
            const currentQty = addonSelections[addonPkg.id]?.[0] || 0;
            total += parsePrice(addonPkg.price) * currentQty;
        });
        return total;
    };

    const addonTotal = getAddonTotal();
    const totalPrice = baseTotalPrice + addonTotal;

    const depositPct = packageInfo?.deposit_percentage ?? 20;
    const allowDeposit = packageInfo?.allow_deposit ?? false;
    const payable = payType === 'advance' ? (totalPrice * depositPct) / 100 : totalPrice;
    const remaining = totalPrice - payable;

    const handlePaxChange = (val: number) => {
        const newPax = Math.max(1, val);
        setPax(newPax);
        setTravellerNames(prev => {
            const next = [...prev];
            const count = Math.max(0, newPax - 1);
            if (count > next.length) {
                while (next.length < count) next.push('');
            } else {
                next.splice(count);
            }
            return next;
        });
    };

    const getFormattedSelections = () => {
        const list: { addon_package_id: number; qty: number; price_at_booking: number }[] = [];
        Object.entries(addonSelections).forEach(([pkgId, values]) => {
            const qty = values?.[0] || 0;
            if (qty > 0) {
                const addonPkg = packageInfo.active_addon_packages.find((p: any) => p.id === parseInt(pkgId));
                if (addonPkg) {
                    list.push({
                        addon_package_id: parseInt(pkgId),
                        qty: qty,
                        price_at_booking: parsePrice(addonPkg.price)
                    });
                }
            }
        });
        return list;
    };

    // Client-side check for required addon packages
    const validateRequiredAddons = () => {
        if (!packageInfo || !packageInfo.active_addon_packages) return true;
        for (const pkg of packageInfo.active_addon_packages) {
            const currentQty = addonSelections[pkg.id]?.[0] || 0;
            if (pkg.min_qty >= 1 && currentQty < pkg.min_qty) {
                setError(`Please select at least ${pkg.min_qty} for required add-on: "${pkg.name}"`);
                return false;
            }
        }
        return true;
    };

    const handleInquiry = async (e: React.MouseEvent) => {
        e.preventDefault();
        
        // Simple client-side validation check
        if (!name || !email || !phone || !date) {
            setError("Please fill in all lead traveller fields before sending inquiry.");
            return;
        }

        if (!validateRequiredAddons()) {
            return;
        }

        setInquiryLoading(true);
        setError(null);

        try {
            const payload = {
                package_id: packageInfo.id,
                name,
                email,
                phone,
                persons: pax,
                preferred_travel_date: date,
                traveller_details: {
                    lead_traveller: { name, email, phone },
                    additional_travellers: travellerNames.filter(n => n.trim() !== '')
                },
                addon_selections: getFormattedSelections()
            };

            await postData("/bookings/inquiry", payload);
            setInquiryLoading(false);
            
            // Reset form fields
            setName('');
            setEmail('');
            setPhone('');
            setPax(1);
            setDate('');
            setTravellerNames([]);
            setAddonSelections({});
            
            navigate('/booking/success?type=inquiry');
        } catch (err: any) {
            const serverMsg = err.response?.data?.errors 
                ? Object.values(err.response.data.errors).flat().join(" ")
                : (err.response?.data?.message || "Failed to send inquiry. Please try again.");
            setError(serverMsg);
            setInquiryLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateRequiredAddons()) {
            return;
        }

        setPaymentLoading(true);
        setError(null);

        try {
            const payload = {
                package_id: packageInfo.id,
                name,
                email,
                phone,
                persons: pax,
                preferred_travel_date: date,
                payment_type: payType,
                traveller_details: {
                    lead_traveller: { name, email, phone },
                    additional_travellers: travellerNames.filter(n => n.trim() !== '')
                },
                addon_selections: getFormattedSelections()
            };

            const data: any = await postData("/bookings", payload);
            if (data?.payment_url) {
                window.location.href = data.payment_url;
            } else {
                navigate('/booking/success');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to submit booking. Please try again.");
            setPaymentLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-20">
            <Navbar forceWhite />

            <AnimatePresence>
                {toast && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-semibold border border-slate-800"
                    >
                        <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="dc-skeleton dc-skeleton-banner" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="dc-skeleton-card">
                                <div className="dc-skeleton dc-skeleton-title" />
                                <div className="flex gap-4 mb-8">
                                    <div className="dc-skeleton dc-skeleton-tag" />
                                    <div className="dc-skeleton dc-skeleton-tag" />
                                </div>
                                <div className="space-y-4">
                                    <div className="dc-skeleton dc-skeleton-field" />
                                    <div className="dc-skeleton dc-skeleton-field" />
                                    <div className="dc-skeleton dc-skeleton-field" />
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <div className="dc-skeleton dc-skeleton-card h-96" />
                        </div>
                    </div>
                </main>
            ) : !packageInfo ? (
                <div className="min-h-screen flex items-center justify-center">Package not found.</div>
            ) : (
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-10">
                {/* Package Banner Section */}
                <div className="dc-pkg-banner">
                    <img 
                        src={ (packageInfo.banner_image || packageInfo.featured_image) 
                            ? `${BASE_URL}/${(packageInfo.banner_image || packageInfo.featured_image).replace(/^\//, '')}`
                            : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920" 
                        }
                        alt={packageInfo.title || 'Adventure'}
                        className="dc-pkg-banner-img"
                    />
                    <div className="dc-pkg-banner-overlay"></div>
                    <div className="dc-pkg-banner-content">
                        <Breadcrumb
                            className="mb-3"
                            items={[
                                { label: packageInfo.title, href: `/${packageInfo.slug}` },
                                { label: 'Book Package' },
                            ]}
                        />
                        <span className="dc-pkg-banner-eyebrow">Package Booking</span>
                        <h2 className="dc-pkg-banner-title">{packageInfo.title}</h2>
                        
                        <div className="dc-pkg-banner-tags">
                            <span className="dc-tag">📍 {packageInfo.region || 'Nepal'}</span>
                            <span className="dc-tag">⏱ {packageInfo.duration_days} Days</span>
                            <span className="dc-tag dc-tag--price">From ${parsePrice(packageInfo.price).toLocaleString()}</span>
                            {packageInfo.allow_deposit && (
                                <span className="dc-tag dc-tag--deposit">💳 {packageInfo.deposit_percentage}% Deposit Available</span>
                            )}
                        </div>
                        
                        <Link to={`/${packageInfo.slug}`} className="dc-pkg-banner-link">
                            View Full Package Details <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
                    {/* Left: Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Lead Traveller Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                            <User size={18} />
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-800">Lead Traveller Information</h2>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                                            <input
                                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all disabled:opacity-75 disabled:bg-slate-100"
                                                placeholder="Enter lead name"
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                required
                                                disabled={inquiryLoading || paymentLoading}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                                            <input
                                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all disabled:opacity-75 disabled:bg-slate-100"
                                                type="email"
                                                placeholder="your@email.com"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                                disabled={inquiryLoading || paymentLoading}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Phone Number</label>
                                            <input
                                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all disabled:opacity-75 disabled:bg-slate-100"
                                                type="tel"
                                                placeholder="+123..."
                                                value={phone}
                                                onChange={e => setPhone(e.target.value)}
                                                required
                                                disabled={inquiryLoading || paymentLoading}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Preferred Date</label>
                                            <div className="relative">
                                                <input
                                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all pr-12 disabled:opacity-75 disabled:bg-slate-100"
                                                    type="date"
                                                    min={new Date().toISOString().split('T')[0]}
                                                    value={date}
                                                    onChange={e => setDate(e.target.value)}
                                                    required
                                                    disabled={inquiryLoading || paymentLoading}
                                                />
                                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pax & Additional Travellers */}
                                <div className="space-y-6 pt-4">
                                    <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                                            <CreditCard size={18} />
                                        </div>
                                        <h2 className="text-lg font-bold text-slate-800">Travellers & Pricing</h2>
                                    </div>

                                  

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Number of Persons</label>
                                            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                                                <button
                                                    type="button"
                                                    onClick={() => handlePaxChange(pax - 1)}
                                                    className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors disabled:opacity-50"
                                                    disabled={pax <= 1 || inquiryLoading || paymentLoading}
                                                >-</button>
                                                <span className="w-8 text-center font-black text-lg">{pax}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handlePaxChange(pax + 1)}
                                                    className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors"
                                                    disabled={inquiryLoading || paymentLoading}
                                                >+</button>
                                            </div>
                                        </div>

                                        {travellerNames.length > 0 && (
                                            <div className="grid md:grid-cols-2 gap-4 mt-6">
                                                {/* Additional Travellers */}
                                                {travellerNames.map((tName, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Traveller {i + 2} Name</label>
                                                        <input
                                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-blue-500 outline-none transition-all text-sm disabled:opacity-75 disabled:bg-slate-100"
                                                            placeholder="Full name"
                                                            value={tName}
                                                            onChange={e => {
                                                                const next = [...travellerNames];
                                                                next[i] = e.target.value;
                                                                setTravellerNames(next);
                                                            }}
                                                            required
                                                            disabled={inquiryLoading || paymentLoading}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                 {/* Add-on Packages Section */}
                                 {packageInfo.active_addon_packages && packageInfo.active_addon_packages.length > 0 && (
                                     <div className="space-y-6 pt-4">
                                         <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                                             <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                 </svg>
                                             </div>
                                             <h2 className="text-lg font-bold text-slate-800">Customize Your Experience (Add-ons)</h2>
                                         </div>

                                         <div className="space-y-4">
                                             {packageInfo.active_addon_packages.map((addonPkg: any) => {
                                                 const currentQty = addonSelections[addonPkg.id]?.[0] || 0;
                                                 const isSelected = currentQty > 0;
                                                 const showQtyControls = addonPkg.max_qty > 1;

                                                 const handleAdd = (e: React.MouseEvent) => {
                                                     e.stopPropagation();
                                                     const qty = addonSelections[addonPkg.id]?.[0] || 0;
                                                     if (qty >= addonPkg.max_qty) {
                                                         const msg = `Maximum quantity of ${addonPkg.max_qty} reached for "${addonPkg.name}".`;
                                                         showToast(msg);
                                                         return;
                                                     }
                                                     setAddonSelections(prev => ({ ...prev, [addonPkg.id]: [qty + 1] }));
                                                 };

                                                 const handleSub = (e: React.MouseEvent) => {
                                                     e.stopPropagation();
                                                     const qty = addonSelections[addonPkg.id]?.[0] || 0;
                                                     const min = addonPkg.min_qty || 0;
                                                     if (qty <= min) {
                                                         const msg = `Minimum quantity of ${min} reached for "${addonPkg.name}".`;
                                                         showToast(msg);
                                                         return;
                                                     }
                                                     setAddonSelections(prev => ({ ...prev, [addonPkg.id]: [qty - 1] }));
                                                 };

                                                 const handleToggleSelect = () => {
                                                      setError(null);
                                                      if (showQtyControls) {
                                                          if (currentQty === 0) {
                                                              setAddonSelections(prev => ({
                                                                  ...prev,
                                                                  [addonPkg.id]: [Math.max(1, addonPkg.min_qty || 0)]
                                                              }));
                                                          } else {
                                                              if (addonPkg.min_qty >= 1) return; // Required; cannot deselect
                                                              setAddonSelections(prev => ({
                                                                  ...prev,
                                                                  [addonPkg.id]: []
                                                              }));
                                                          }
                                                          return;
                                                      }
                                                      setAddonSelections(prev => {
                                                          const qty = prev[addonPkg.id]?.[0] || 0;
                                                          if (qty > 0) {
                                                              if (addonPkg.min_qty >= 1) return prev; // Required; cannot deselect
                                                              return { ...prev, [addonPkg.id]: [] };
                                                          } else {
                                                              return { ...prev, [addonPkg.id]: [1] };
                                                          }
                                                      });
                                                  };

                                                 return (
                                                     <div 
                                                         key={addonPkg.id} 
                                                         onClick={handleToggleSelect}
                                                         className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                                                             showQtyControls && currentQty > 0 && addonPkg.min_qty >= 1 ? 'cursor-default' : 'cursor-pointer'
                                                         } flex gap-4 items-start ${
                                                             isSelected 
                                                                 ? 'bg-blue-50/30 border-blue-500 shadow-sm' 
                                                                 : 'bg-white border-slate-100 hover:border-slate-200'
                                                         }`}
                                                     >
                                                         

                                                         {/* Item info */}
                                                         <div className="flex-grow space-y-1">
                                                             <div className="flex flex-wrap items-baseline gap-2">
                                                                 <span className="font-bold text-slate-800 text-sm">{addonPkg.name}</span>
                                                                 {addonPkg.short_label && (
                                                                     <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-semibold">{addonPkg.short_label}</span>
                                                                 )}
                                                                 {addonPkg.badge && (
                                                                     <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded font-black border border-orange-100 uppercase tracking-wide">{addonPkg.badge}</span>
                                                                 )}
                                                             </div>
                                                             {addonPkg.description && (
                                                                 <p className="text-xs text-slate-500 leading-relaxed">{addonPkg.description}</p>
                                                             )}
                                                             
                                                             {/* Images display */}
                                                             {addonPkg.images && addonPkg.images.length > 0 && (
                                                                 <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1" onClick={e => e.stopPropagation()}>
                                                                     {addonPkg.images.map((img: any, idx: number) => {
                                                                         if (!img || !img.url) return null;
                                                                         const imageUrl = `${BASE_URL}/${img.url.replace(/^\//, '')}`;
                                                                         return (
                                                                             <button
                                                                                 key={idx}
                                                                                 type="button"
                                                                                 onClick={(e) => openImageGallery(e, addonPkg.images, idx)}
                                                                                 className="flex-shrink-0 focus:outline-none"
                                                                             >
                                                                                 <img 
                                                                                     src={imageUrl}
                                                                                     alt={`${addonPkg.name} view`}
                                                                                     className="w-16 h-12 rounded-lg object-cover border border-slate-100 shadow-sm hover:opacity-75 hover:scale-105 transition-all cursor-zoom-in"
                                                                                 />
                                                                             </button>
                                                                         );
                                                                     })}
                                                                 </div>
                                                             )}
                                                         </div>
<div className="flex flex-col items-end gap-4">
      {/* Input indicator or Qty controls */}
                                                         <div className="mt-1 flex-shrink-0">
                                                             {showQtyControls ? (
                                                                 <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200" onClick={e => e.stopPropagation()}>
                                                                     <button
                                                                         type="button"
                                                                         onClick={handleSub}
                                                                         className={`w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 font-bold text-xs ${
                                                                             currentQty <= (addonPkg.min_qty || 0) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                                                                         }`}
                                                                     >-</button>
                                                                     <span className="w-5 text-center font-bold text-xs text-slate-800">{currentQty}</span>
                                                                     <button
                                                                         type="button"
                                                                         onClick={handleAdd}
                                                                         className={`w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 font-bold text-xs ${
                                                                             currentQty >= addonPkg.max_qty ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                                                                         }`}
                                                                     >+</button>
                                                                 </div>
                                                             ) : (
                                                                 <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                                                     isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                                                                 }`}>
                                                                     {isSelected && (
                                                                         <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                         </svg>
                                                                     )}
                                                                 </div>
                                                             )}
                                                         </div>
                                                         {/* Price */}
                                                         <div className="text-right flex-shrink-0">
                                                             <span className="font-black text-slate-900 text-sm">${parsePrice(addonPkg.price).toLocaleString()}</span>
                                                         </div>
                                                        
                                                         </div>
                                                     </div>
                                                 );
                                             })}
                                         </div>
                                     </div>
                                 )}

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
                                        {error}
                                    </div>
                                )}



                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="button"
                                        onClick={handleInquiry}
                                        disabled={inquiryLoading || paymentLoading}
                                        className="w-full sm:w-1/2 py-5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                                    >
                                        {inquiryLoading ? 'Sending...' : 'Send Inquiry'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={inquiryLoading || paymentLoading}
                                        className="w-full sm:w-1/2 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 text-lg group disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                                    >
                                        {paymentLoading ? 'Redirecting...' : 'Proceed to Payment'}
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            <div className="bg-gradient-to-br from-[#0066FF] to-[#0044CC] rounded-3xl p-8 text-white shadow-xl shadow-blue-200/50 border border-blue-400/20">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 opacity-80" />
                                    Booking Summary
                                </h3>

                                <div className="space-y-6">
                                    <div className="pb-6 border-b border-white/10">
                                        <p className="font-bold text-lg leading-tight mb-1">{packageInfo?.title}</p>
                                        <p className="text-sm text-blue-100/70 font-medium">
                                            {packageInfo?.duration_days} · {packageInfo?.region || 'Himalayas'}
                                        </p>
                                        {/* Show selected tier */}
                                        {(() => {
                                            const slugify = (n: string) => n.toLowerCase().replace(/\s+/g, '-').trim();
                                            const realTiers = (packageInfo?.package_tiers ?? []).filter((t: any) => t.name);
                                            const tierObj = realTiers.find((t: any) => slugify(t.name) === selectedTierSlug);
                                            if (!tierObj) return null;
                                            return (
                                                <span className="inline-block mt-1 text-xs bg-white/10 text-blue-100 px-2 py-0.5 rounded-full font-semibold">
                                                    {tierObj.name}
                                                </span>
                                            );
                                        })()}
                                    </div>

                                    <div className="space-y-4">
                                        {(() => {
                                            const isDefaultTier = !selectedTierSlug || selectedTierSlug === 'default';
                                            const tierPaxPricing = (packageInfo.pax_pricing ?? []).filter(
                                                (p: any) => p.pax != null && p.pax !== '' && p.price != null && p.price !== ''
                                                    && (isDefaultTier
                                                        ? (!p.tier || p.tier === '' || p.tier === 'default')
                                                        : p.tier === selectedTierSlug
                                                    )
                                            );
                                            if (tierPaxPricing.length === 0) return null;
                                            const sorted = [...tierPaxPricing].sort((a: any, b: any) => Number(a.pax) - Number(b.pax));

                                            return (
                                            <div>
                                                <div className='flex justify-between'>
                                                    <span className="text-xs text-blue-100/80">Price varies by group size.</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPricingTable(!showPricingTable)}
                                                        className="text-xs font-semibold underline text-blue-100 hover:text-white cursor-pointer transition-colors focus:outline-none"
                                                    >
                                                        {showPricingTable ? 'Hide' : 'See Pricing'}
                                                    </button>
                                                </div>

                                                {showPricingTable && (
                                                    <div className="mt-2 bg-blue-900/30 backdrop-blur-md rounded-xl p-3 border border-white/10 overflow-hidden">
                                                        <table className="w-full text-[10px] text-left text-white">
                                                            <thead>
                                                                <tr className="border-b border-white/10">
                                                                    <th className="pb-1 font-semibold">Group Size</th>
                                                                    <th className="pb-1 text-right font-semibold">Price per Pax</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {sorted.map((paxPrice: any, index: number) => {
                                                                    const currentPax = parseInt(paxPrice.pax);
                                                                    const prevPax = index === 0 ? 0 : parseInt(sorted[index - 1].pax);
                                                                    const rangeText = prevPax + 1 === currentPax
                                                                        ? `${currentPax} ${currentPax === 1 ? 'Person' : 'People'}`
                                                                        : `${prevPax + 1}–${currentPax} People`;
                                                                    const isActive = pax >= (prevPax + 1) && pax <= currentPax;
                                                                    return (
                                                                        <tr key={index} className={`border-b border-white/5 last:border-0 ${isActive ? 'text-yellow-300 font-bold' : ''}`}>
                                                                            <td className="py-1">{rangeText}{isActive ? ' ← you' : ''}</td>
                                                                            <td className="py-1 text-right font-mono">${paxPrice.price}</td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                            );
                                        })()}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-blue-100/80">Price per person</span>
                                            <span className="font-bold">${pricePerPerson.toLocaleString()}</span>
                                        </div>
                                       
                                        <div className="flex justify-between text-sm">
                                            <span className="text-blue-100/80">Travellers</span>
                                            <span className="font-bold">{pax} persons</span>
                                        </div>

                                        <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                                            <span className="text-blue-100/80">Base Package Total</span>
                                            <span className="font-bold">${baseTotalPrice.toLocaleString()}</span>
                                        </div>

                                        {/* Selected Add-ons Listing */}
                                        {packageInfo.active_addon_packages && packageInfo.active_addon_packages.some((pkg: any) => {
                                            const qty = addonSelections[pkg.id]?.[0] || 0;
                                            return qty > 0;
                                        }) && (
                                            <div className="pt-4 border-t border-white/10 space-y-3">
                                                <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] mb-1">Selected Add-ons</p>
                                                {packageInfo.active_addon_packages.map((pkg: any) => {
                                                    const qty = addonSelections[pkg.id]?.[0] || 0;
                                                    if (qty === 0) return null;
                                                    return (
                                                        <div key={pkg.id} className="flex justify-between text-xs text-blue-100/75">
                                                            <span>• {pkg.name} {qty > 1 ? `x ${qty}` : ''}</span>
                                                            <span>${(parsePrice(pkg.price) * qty).toLocaleString()}</span>
                                                        </div>
                                                    );
                                                })}
                                                <div className="flex justify-between text-xs pt-2 border-t border-white/5 text-blue-100/90 font-bold">
                                                    <span>Add-on Total</span>
                                                    <span>${addonTotal.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                            <span className="font-bold text-blue-50">Grand Total</span>
                                            <span className="text-2xl font-black text-white">${totalPrice.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {allowDeposit && (
                                        <div className="pt-6 border-t border-white/10 space-y-4">
                                            <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em]">Payment Method</p>
                                            <div className="grid grid-cols-2 gap-2 p-1.5 bg-blue-900/20 rounded-2xl border border-white/10 backdrop-blur-sm">
                                                <button
                                                    onClick={() => setPayType('full')}
                                                    className={`py-2.5 text-xs font-bold rounded-xl transition-all ${payType === 'full' ? 'bg-white text-blue-600 shadow-lg' : 'text-blue-100 hover:text-white'}`}
                                                >Full Pay</button>
                                                <button
                                                    onClick={() => setPayType('advance')}
                                                    className={`py-2.5 text-xs font-bold rounded-xl transition-all ${payType === 'advance' ? 'bg-white text-blue-600 shadow-lg' : 'text-blue-100 hover:text-white'}`}
                                                >Deposit</button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-6 border-t border-white/10">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <span className="text-sm text-blue-50 font-bold">Payable Now</span>
                                            <span className="text-3xl font-black text-white">
                                                ${payable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
  </div>
                                    {payType === 'advance' && (
                                        <p className="text-[10px] text-slate-400 text-right italic uppercase">
                                            Balance of ${remaining.toFixed(2)} due later
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-4">
                                <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                    <HelpCircle className="w-5 h-5 text-blue-500" />
                                    <span>Need help with booking?</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Our travel experts are available 24/7 to assist you with your booking and any questions you might have.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            )}

            <Footer />
        </div>
    );
}
