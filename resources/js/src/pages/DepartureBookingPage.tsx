import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDepartures, departureApi } from '../hooks/useDepartures';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { postData } from '../axiosHook';
import { ArrowRight, CreditCard, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BASE_URL from '../global';
import './DepartureCalendar.css';
import './DepartureCalendarExtras.css';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

function parsePrice(p: unknown): number { return parseFloat(String(p).replace(/,/g, '')) || 0; }
function pad(n: number) { return String(n).padStart(2, '0'); }

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

export function DepartureBookingPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const dId = searchParams.get('departure_id');
    const dIdInt = dId ? parseInt(dId) : null;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [travellerNames, setTravellerNames] = useState<string[]>([]);
    const [pax, setPax] = useState(1);
    const [payType, setPayType] = useState<'full' | 'advance'>('full');
    const [submitting, setSub] = useState(false);
    const [error, setError] = useState('');
    const [addonSelections, setAddonSelections] = useState<Record<number, number[]>>({});
    const [toast, setToast] = useState('');

    const showToast = (msg: string) => {
        setToast(msg);
        if ((window as any).toastTimeout) clearTimeout((window as any).toastTimeout);
        (window as any).toastTimeout = setTimeout(() => setToast(''), 3000);
    };

    // We need to fetch the specific departure. 
    // Since our hook fetches by month, we'll use it but find our ID.
    const [departure, setDeparture] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (!dIdInt) {
            navigate('/departures');
            return;
        }

        // Fetch single departure details
        fetch(`${BASE_URL}/api/departures/${dIdInt}`)
            .then(res => res.json())
            .then(data => {
                const dep = data.data;
                setDeparture(dep);

                if (dep?.package?.active_addon_packages) {
                    const defaults: Record<number, number[]> = {};
                    dep.package.active_addon_packages.forEach((addonPkg: any) => {
                        if (addonPkg.min_qty >= 1) {
                            defaults[addonPkg.id] = [addonPkg.min_qty];
                        }
                    });
                    setAddonSelections(defaults);
                }
                
                // Secondary fetch if banner_image is missing (resilience for old API versions)
                if (dep?.package && !dep.package.banner_image) {
                    fetch(`${BASE_URL}/api/package/${dep.package.slug}`)
                        .then(res => res.json())
                        .then(pkgData => {
                            setDeparture((prev: any) => {
                                const nextDep = { ...prev, package: { ...prev.package, ...pkgData } };
                                if (pkgData?.active_addon_packages) {
                                    const defaults: Record<number, number[]> = {};
                                    pkgData.active_addon_packages.forEach((addonPkg: any) => {
                                        if (addonPkg.min_qty >= 1) {
                                            defaults[addonPkg.id] = [addonPkg.min_qty];
                                        }
                                    });
                                    setAddonSelections(defaults);
                                }
                                return nextDep;
                            });
                        })
                        .catch(err => console.warn("Failed to fetch full package details:", err));
                }
                
                setLoading(false);
            })
            .catch(() => {
                setError('Could not find departure details.');
                setLoading(false);
            });
    }, [dIdInt, navigate]);

    const packageInfo = departure?.package;

    if (loading) return <BookingSkeleton />;

    const getPaxPrice = (count: number) => {
        if (!departure) return 0;
        // For Fixed Departures, we use the price set specifically for this departure.
        // If it's not set (0), we fall back to the package base price.
        const base = parsePrice(departure.price);
        return base > 0 ? base : parsePrice(packageInfo?.price);
    };

    const pricePerPerson = getPaxPrice(pax);
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

    const getFormattedSelections = () => {
        const list: { addon_package_id: number; qty: number; price_at_booking: number }[] = [];
        Object.entries(addonSelections).forEach(([pkgId, values]) => {
            const qty = values?.[0] || 0;
            if (qty > 0) {
                const addonPkg = packageInfo?.active_addon_packages?.find((p: any) => p.id === parseInt(pkgId));
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
        
        if (!name || !email || !phone) {
            setError("Please fill in all lead traveller fields before sending inquiry.");
            return;
        }

        if (!validateRequiredAddons()) {
            return;
        }

        setSub(true);
        setError('');

        try {
            const payload = {
                departure_id: departure.id,
                name,
                email,
                phone,
                seats_booked: pax,
                traveller_details: {
                    lead_traveller: { name, email, phone },
                    additional_travellers: travellerNames.filter(n => n.trim() !== '')
                },
                addon_selections: getFormattedSelections()
            };

            await postData("/departure-bookings/inquiry", payload);
            setSub(false);
            navigate('/booking/success?type=inquiry');
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to send inquiry.");
            setSub(false);
        }
    };

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateRequiredAddons()) {
            return;
        }

        setSub(true);
        setError('');

        try {
            const payload = {
                departure_id: departure.id,
                name,
                email,
                phone,
                seats_booked: pax,
                payment_type: payType,
                traveller_details: {
                    lead_traveller: { name, email, phone },
                    additional_travellers: travellerNames.filter(n => n.trim() !== '')
                },
                addon_selections: getFormattedSelections()
            };

            const data: any = await postData("/departure-bookings", payload);
            if (data?.payment_url) {
                window.location.href = data.payment_url;
            } else {
                navigate('/booking/success');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to process booking.");
            setSub(false);
        }
    };

    if (!departure) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Departure Not Found</h2>
            <p className="text-slate-500 mb-6">The departure date you are looking for is no longer available or the link is invalid.</p>
            <Link to="/departures" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg">
                Return to Calendar
            </Link>
        </div>
    );

    const dateStr = new Date(departure.date).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div className="min-h-screen font-sans text-gray-900 bg-[#F8FAFC] pt-20">
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Departure Banner Section */}
                <div className="dc-pkg-banner">
                    <img 
                        src={ (packageInfo?.banner_image || packageInfo?.featured_image) 
                            ? `${BASE_URL}/${(packageInfo?.banner_image || packageInfo?.featured_image).replace(/^\//, '')}`
                            : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920" 
                        }
                        alt={packageInfo?.title || 'Adventure'}
                        className="dc-pkg-banner-img"
                    />
                    <div className="dc-pkg-banner-overlay"></div>
                    <div className="dc-pkg-banner-content">
                        <span className="dc-pkg-banner-eyebrow">Fixed Group Departure</span>
                        <h2 className="dc-pkg-banner-title">{packageInfo?.title || 'Adventure Trek'}</h2>
                        
                        <div className="dc-pkg-banner-tags">
                            <span className="dc-tag">📅 {dateStr}</span>
                            <span className="dc-tag">👥 {departure.available_seats} Seats Left</span>
                            <span className="dc-tag dc-tag--price">From ${pricePerPerson.toLocaleString()}</span>
                            {packageInfo?.allow_deposit && (
                                <span className="dc-tag dc-tag--deposit">💳 {packageInfo.deposit_percentage}% Deposit Available</span>
                            )}
                        </div>
                        
                        <Link to={`/${packageInfo?.slug}`} className="dc-pkg-banner-link">
                            View Full Package Details <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                <div className="mb-6 px-2">
                 
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
                    {/* Left: Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold mb-6">Traveller Details</h3>
                            <form onSubmit={handleBook} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Full Name</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-70 disabled:bg-slate-50"
                                        type="text" placeholder="John Doe"
                                        value={name} onChange={e => setName(e.target.value)} required
                                        disabled={submitting}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-70 disabled:bg-slate-50"
                                            type="email" placeholder="you@email.com"
                                            value={email} onChange={e => setEmail(e.target.value)} required
                                            disabled={submitting}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Phone Number</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-70 disabled:bg-slate-50"
                                            type="tel" placeholder="+1 234 567"
                                            value={phone} onChange={e => setPhone(e.target.value)} required
                                            disabled={submitting}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">
                                        Number of Persons
                                        <span className="text-slate-400 font-normal ml-2">(Max {departure.available_seats} available)</span>
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all disabled:opacity-70 disabled:bg-slate-50"
                                        type="number" min={1} max={departure.available_seats}
                                        value={pax}
                                        onChange={e => {
                                            const newPax = Math.max(1, parseInt(e.target.value) || 1);
                                            setPax(newPax);
                                            // Sync traveller names array (pax - 1 because lead is separate)
                                            setTravellerNames(prev => {
                                                const next = [...prev];
                                                if (newPax > 1) {
                                                    while (next.length < newPax - 1) next.push('');
                                                    return next.slice(0, newPax - 1);
                                                }
                                                return [];
                                            });
                                        }}
                                        required
                                        disabled={submitting}
                                    />
                                </div>

                                {pax > 1 && (
                                    <div className="space-y-4 pt-4 border-t border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Additional Travellers</p>
                                        {Array.from({ length: pax - 1 }).map((_, i) => (
                                            <div key={i} className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-500 uppercase">Traveller {i + 2} Full Name</label>
                                                <input
                                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-sm disabled:opacity-70 disabled:bg-slate-50"
                                                    type="text"
                                                    placeholder={`Name of traveller ${i + 2}`}
                                                    value={travellerNames[i] || ''}
                                                    onChange={e => {
                                                        const next = [...travellerNames];
                                                        next[i] = e.target.value;
                                                        setTravellerNames(next);
                                                    }}
                                                    required
                                                    disabled={submitting}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {departure.available_seats <= 5 && departure.available_seats > 0 && (
                                    <div className="p-3 bg-orange-50 border border-orange-100 text-orange-700 rounded-xl text-sm flex items-center gap-2">
                                        🔥 Only {departure.available_seats} seat(s) left!
                                    </div>
                                )}

                                {departure.available_seats > 0 && (
                                    <div className="p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm flex items-center gap-2">
                                        ✅ Guaranteed Departure
                                    </div>
                                )}

                                {/* Add-on Packages Section */}
                                {packageInfo?.active_addon_packages && packageInfo.active_addon_packages.length > 0 && (
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
                                                     setError('');
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
                                                     setError('');
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
                                                     setError('');
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
                                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="button"
                                        onClick={handleInquiry}
                                        disabled={submitting}
                                        className="w-full sm:w-1/2 py-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                                    >
                                        {submitting ? 'Please wait...' : 'Send Inquiry'}
                                    </button>
                                    <button
                                        className="w-full sm:w-1/2 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                                        type="submit"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Redirecting to Payment...' : 'Proceed to Payment'}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-[#0066FF] to-[#0044CC] rounded-3xl p-8 text-white shadow-xl shadow-blue-200/50 border border-blue-400/20 sticky top-8">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 opacity-80" />
                                Booking Summary
                            </h3>

                            <div className="space-y-6">
                                <div className="pb-6 border-b border-white/10">
                                    <p className="font-bold text-lg leading-tight mb-1">{packageInfo?.title}</p>
                                    <p className="text-sm text-blue-100/70 font-medium">
                                        {packageInfo?.duration_days} · {packageInfo?.region}
                                    </p>
                                </div>

                                <div className="space-y-4">
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
                                    {packageInfo?.active_addon_packages && packageInfo.active_addon_packages.some((pkg: any) => {
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
                                        <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em]">Payment Option</p>
                                        <div className="grid grid-cols-2 gap-2 p-1.5 bg-blue-900/20 rounded-2xl border border-white/10 backdrop-blur-sm">
                                            <button
                                                onClick={() => setPayType('full')}
                                                disabled={submitting}
                                                className={`py-2.5 text-xs font-bold rounded-xl transition-all ${payType === 'full' ? 'bg-white text-blue-600 shadow-lg' : 'text-blue-100 hover:text-white'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >Full Pay</button>
                                            <button
                                                onClick={() => setPayType('advance')}
                                                disabled={submitting}
                                                className={`py-2.5 text-xs font-bold rounded-xl transition-all ${payType === 'advance' ? 'bg-white text-blue-600 shadow-lg' : 'text-blue-100 hover:text-white'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >Advance</button>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-6 border-t border-white/10">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <span className="text-sm text-blue-50 font-bold">Payable Now</span>
                                        <span className="text-3xl font-black text-white">${payable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    {payType === 'advance' && (
                                        <p className="text-[10px] text-blue-200 text-right italic uppercase">
                                            Remaining ${remaining.toFixed(2)} due later
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
