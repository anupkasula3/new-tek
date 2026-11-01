import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useDepartures, usePackagesList, departureApi, useAllDepartures } from '../hooks/useDepartures';
import type { Departure, PackageInfo } from '../types/departure';
import BASE_URL from '../global';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import './DepartureCalendar.css';
import './DepartureCalendarExtras.css';
import { ArrowRight } from 'lucide-react';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];


function statusLabel(d: Departure, threshold: number) {
    if (d.available_seats === 0)        return 'fully_booked';
    if (d.available_seats <= threshold) return 'limited';
    return 'available';
}
function pad(n: number) { return String(n).padStart(2, '0'); }
function parsePrice(p: unknown): number { return parseFloat(String(p).replace(/,/g, '')) || 0; }

// ── Skeleton ────────────────────────────────────────────────────────────────
function SkeletonCell() {
    return <div className="dc-cell dc-cell--skeleton"><div className="dc-skeleton-inner" /></div>;
}

// ── Package Selector ─────────────────────────────────────────────────────────
interface PackageSelectorProps {
    packages?: PackageInfo[];
    selected: string;
    onChange: (slug: string) => void;
    loading: boolean;
}

function PackageSelector({ packages, selected, onChange, loading }: PackageSelectorProps) {
    const [open, setOpen] = useState(false);
    const current = packages?.find(p => p.slug === selected);

    return (
        <div className="dc-pkg-selector">
            <button
                className="dc-pkg-btn"
                onClick={() => setOpen(o => !o)}
                disabled={loading}
                aria-label="Select package"
            >
                <span className="dc-pkg-icon">🏔</span>
                <span className="dc-pkg-label">
                    {loading ? 'Loading…' : current ? current.title : 'All Packages'}
                </span>
                <span className="dc-pkg-caret">{open ? '▲' : '▼'}</span>
            </button>

            {open && (
                <div className="dc-pkg-dropdown">
                    <button
                        className={`dc-pkg-option${!selected ? ' dc-pkg-option--active' : ''}`}
                        onClick={() => { onChange(''); setOpen(false); }}
                    >
                        <span className="dc-pkg-opt-title">All Packages</span>
                        <span className="dc-pkg-opt-sub">Show all departure dates</span>
                    </button>
                    {packages?.map(pkg => (
                        <button
                            key={pkg.slug}
                            className={`dc-pkg-option${selected === pkg.slug ? ' dc-pkg-option--active' : ''}`}
                            onClick={() => { onChange(pkg.slug); setOpen(false); }}
                        >
                            <span className="dc-pkg-opt-title">{pkg.title}</span>
                            <span className="dc-pkg-opt-sub">
                                {pkg.region && `${pkg.region} · `}
                                {pkg.duration_days && `${pkg.duration_days} · `}
                                From ${pkg.price.toLocaleString()}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Package Context Banner ────────────────────────────────────────────────────
function PackageBanner({ pkg }: { pkg: PackageInfo }) {
    return (
        <div className="dc-pkg-banner">
            <img 
                src={ (pkg.banner_image || pkg.featured_image) 
                    ? `${BASE_URL}/${(pkg.banner_image || pkg.featured_image).replace(/^\//, '')}`
                    : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920" 
                }
                alt={pkg.title || 'Adventure'}
                className="dc-pkg-banner-img"
            />
            <div className="dc-pkg-banner-overlay" />
            <div className="dc-pkg-banner-content">
                <span className="dc-pkg-banner-eyebrow">Fixed Group Departure</span>
                <h2 className="dc-pkg-banner-title">{pkg.title}</h2>
                <div className="dc-pkg-banner-tags">
                    {pkg.region && <span className="dc-tag">📍 {pkg.region}</span>}
                    {pkg.duration_days && <span className="dc-tag">⏱ {pkg.duration_days}</span>}
                    <span className="dc-tag dc-tag--price">From ${pkg.price.toLocaleString()}</span>
                    {pkg.allow_deposit && (
                        <span className="dc-tag dc-tag--deposit">
                            💳 {pkg.deposit_percentage}% Advance Available
                        </span>
                    )}
                </div>
                <Link
                    to={`/${pkg.slug}`}
                    className="dc-pkg-banner-link"
                >
                    View Full Package Details <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function DepartureCalendarPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const today = new Date();
    const currentYear  = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay   = today.getDate();

    const YEARS = [currentYear, currentYear + 1, currentYear + 2];

    const [year, setYear]               = useState<number | 'all'>(currentYear);
    const [month, setMonth]             = useState<number | 'all'>(currentMonth);
    const [showOnlyAvail, setShow]      = useState(false);
    const [viewMode, setViewMode]       = useState<'calendar' | 'list'>('calendar');

    const handleYearChange = (y: number) => {
        setYear(y);
        if (y === currentYear && month < currentMonth) {
            setMonth(currentMonth);
        }
    };

    // package slug from URL ?package=slug
    const packageSlug = searchParams.get('package') ?? '';

    const { departures, threshold, packageInfo, loading, error, setDepartures } =
        useDepartures(
            year === 'all' ? 0 : year, 
            month === 'all' ? 0 : month, 
            packageSlug || undefined
        );

    const { allDepartures } = useAllDepartures(packageSlug || undefined);

    const monthCounts = useMemo(() => {
        const counts: Record<number, number> = {};
        const activeYear = year === 'all' ? currentYear : year;
        allDepartures.forEach(d => {
            const depDate = new Date(d.date + 'T00:00:00');
            if (depDate.getFullYear() === activeYear) {
                const m = depDate.getMonth() + 1;
                counts[m] = (counts[m] || 0) + 1;
            }
        });
        return counts;
    }, [allDepartures, year, currentYear]);

    const yearCounts = useMemo(() => {
        const counts: Record<number, number> = {};
        allDepartures.forEach(d => {
            const depDate = new Date(d.date + 'T00:00:00');
            const y = depDate.getFullYear();
            counts[y] = (counts[y] || 0) + 1;
        });
        return counts;
    }, [allDepartures]);

    const futureDepartures = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return departures.filter(d => {
            const depDate = new Date(d.date + 'T00:00:00');
            return depDate >= now;
        });
    }, [departures]);

    const { packages, loading: pkgLoading } = usePackagesList();

    const handlePackageChange = (slug: string) => {
        if (slug) setSearchParams({ package: slug });
        else setSearchParams({});
    };

    // Build calendar grid
    const calendarDays = useMemo(() => {
        const firstDay    = new Date(year, month - 1, 1).getDay();
        const daysInMonth = new Date(year, month, 0).getDate();
        const cells: (number | null)[] = [];
        for (let i = 0; i < firstDay; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(d);
        while (cells.length % 7 !== 0) cells.push(null);
        return cells;
    }, [year, month]);

    const departureMap = useMemo<Record<string, Departure>>(() => {
        const m: Record<string, Departure> = {};
        for (const d of departures) m[d.date] = d;
        return m;
    }, [departures]);

    const cheapestDate = useMemo<string | null>(() => {
        const avail = departures.filter(d => d.available_seats > 0);
        if (!avail.length) return null;
        return avail.reduce((a, b) => a.price <= b.price ? a : b).date;
    }, [departures]);

    const handleDateClick = useCallback((day: number) => {
        const dateStr = `${year}-${pad(month)}-${pad(day)}`;
        const dep = departureMap[dateStr];
        const isPastDay = year === currentYear && month === currentMonth && day < currentDay;
        
        if (!dep || dep.available_seats === 0 || isPastDay) return;
        
        navigate(`/departures/book?departure_id=${dep.id}`);
    }, [year, month, departureMap, navigate, currentYear, currentMonth, currentDay]);

    const handleBooked = useCallback((updated: Departure) => {
        setDepartures(prev => prev.map(d => d.id === updated.id ? updated : d));
    }, [setDepartures]);

    const renderCell = (day: number | null, idx: number) => {
        if (day === null) return <div key={`e-${idx}`} className="dc-cell dc-cell--empty" />;

        const dateStr = `${year}-${pad(month)}-${pad(day)}`;
        const dep     = departureMap[dateStr];
        const isPastDay = year === currentYear && month === currentMonth && day < currentDay;

        if (loading) return <SkeletonCell key={dateStr} />;

        if (!dep) {
            return (
                <div key={dateStr} className={`dc-cell dc-cell--no-data ${isPastDay ? 'dc-cell--dimmed' : ''}`}>
                    <span className="dc-cell-day">{day}</span>
                </div>
            );
        }

        const status   = statusLabel(dep, threshold);
        const isCheap  = dateStr === cheapestDate;
        const isHidden = showOnlyAvail && (status === 'fully_booked' || isPastDay);

        if (isHidden) {
            return (
                <div key={dateStr} className="dc-cell dc-cell--no-data dc-cell--dimmed">
                    <span className="dc-cell-day">{day}</span>
                </div>
            );
        }

        const clickable = status !== 'fully_booked' && !isPastDay;

        return (
            <div
                key={dateStr}
                className={['dc-cell', `dc-cell--${status}`, clickable ? 'dc-cell--clickable' : '', isPastDay ? 'opacity-50 cursor-not-allowed' : ''].join(' ')}
                onClick={() => handleDateClick(day)}
                title={isPastDay ? 'Past date' : `$${dep.price.toLocaleString()} · ${dep.available_seats} seats left`}
                role={clickable ? "button" : undefined} 
                tabIndex={clickable ? 0 : -1}
                onKeyDown={e => e.key === 'Enter' && clickable && handleDateClick(day)}
            >
                {/* {isCheap && <span className="dc-best-price">Best Price</span>} */}
                <span className="dc-cell-day">{day}</span>
                <span className="dc-cell-price">${dep.price.toLocaleString()}</span>
                <span className="dc-cell-seats">
                    {status === 'fully_booked' ? 'Fully booked' : `${dep.available_seats} seat${dep.available_seats !== 1 ? 's' : ''} left`}
                </span>
                <span className={`dc-cell-dot dc-cell-dot--${status}`} />
            </div>
        );
    };

    return (
        <div className="min-h-screen font-sans text-gray-900 bg-white">
            <Navbar />
            <main className="dc-page">
                {/* Hero */}
                <div className="dc-hero">
                <div className="dc-hero-content">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-white text-xs font-bold uppercase tracking-widest">{futureDepartures.length} Guaranteed Departures</span>
                    </div>
                    <h1 className="dc-hero-title">Interested in joining a group?</h1>
                    <p className="dc-hero-subtitle">Select your preferred departure date below and start your adventure</p>
                </div>
            </div>

            <div className="dc-container">
                {/* Stats Summary Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 transition-all hover:shadow-lg group">
                        <div className="text-3xl font-black text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                            {month === 'all' ? allDepartures.length : futureDepartures.length}
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {month === 'all' ? 'Grand Total' : 'This Month'}
                        </div>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 transition-all hover:shadow-lg group">
                        <div className="text-3xl font-black text-emerald-600 mb-1">
                            {(month === 'all' ? allDepartures : futureDepartures).filter(d => statusLabel(d, threshold) === 'available').length}
                        </div>
                        <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Available</div>
                    </div>
                    <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 transition-all hover:shadow-lg group">
                        <div className="text-3xl font-black text-amber-600 mb-1">
                            {(month === 'all' ? allDepartures : futureDepartures).filter(d => statusLabel(d, threshold) === 'limited').length}
                        </div>
                        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">Limited Slots</div>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 transition-all hover:shadow-lg group">
                        <div className="text-3xl font-black text-blue-600 mb-1">{packages?.length || 0}</div>
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Active Treks</div>
                    </div>
                </div>

                {/* Package selector + toggle row */}
                <div className="dc-controls">
                    <PackageSelector
                        packages={packages}
                        selected={packageSlug}
                        onChange={handlePackageChange}
                        loading={pkgLoading}
                    />
                    <div className="flex gap-4">
                        <div className="dc-view-toggles">
                            <button 
                                className={`dc-view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
                                onClick={() => setViewMode('calendar')}
                            >
                                📅 Calendar
                            </button>
                            <button 
                                className={`dc-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                📋 List ({futureDepartures.length})
                            </button>
                        </div>
                        <label className="dc-toggle">
                            <input type="checkbox" checked={showOnlyAvail} onChange={e => setShow(e.target.checked)} />
                            <span className="dc-toggle-track" />
                            <span className="dc-toggle-label">Available only</span>
                        </label>
                    </div>
                </div>

                {/* Package context banner */}
                {packageInfo && <PackageBanner pkg={packageInfo} />}

                {/* Year selector */}
                <div className="dc-year-selector">
                    {YEARS.map(y => {
                        const count = yearCounts[y] || 0;
                        return (
                            <button key={y} className={`dc-year-btn${year === y ? ' dc-year-btn--active' : ''}`} onClick={() => handleYearChange(y)}>
                                {y} {count > 0 && <span className="dc-tab-count">({count})</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Month tabs */}
                <div className="dc-months">
                    <button 
                        className={`dc-month-tab ${month === 'all' ? 'dc-month-tab--active' : ''}`}
                        onClick={() => { setMonth('all'); setYear('all'); setViewMode('list'); }}
                    >
                        All Upcoming ({allDepartures.length})
                    </button>
                    {MONTHS.map((m, i) => {
                        const monthNum = i + 1;
                        const count = monthCounts[monthNum] || 0;
                        const isPastMonth = year === currentYear && monthNum < currentMonth;
                        return (
                            <button 
                                key={m} 
                                className={`dc-month-tab${month === monthNum ? ' dc-month-tab--active' : ''} ${isPastMonth ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                disabled={isPastMonth}
                                onClick={() => { setMonth(monthNum); setYear(year === 'all' ? currentYear : year); setViewMode('calendar'); }}
                            >
                                {m.slice(0, 3)} {count > 0 && <span className="dc-tab-count">({count})</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                {viewMode === 'calendar' ? (
                    <>
                        <div className="dc-legend">
                            <span className="dc-legend-item"><span className="dc-legend-dot dc-legend-dot--available" /> Available</span>
                            <span className="dc-legend-item"><span className="dc-legend-dot dc-legend-dot--limited" /> Limited</span>
                            <span className="dc-legend-item"><span className="dc-legend-dot dc-legend-dot--fully_booked" /> Fully Booked</span>
                        </div>
                        {error ? (
                            <div className="dc-error">{error}</div>
                        ) : (
                            <div className="dc-calendar">
                                {DAYS.map(d => <div key={d} className="dc-day-header">{d}</div>)}
                                {calendarDays.map((day, i) => renderCell(day, i))}
                            </div>
                        )}
                        <p className="dc-calendar-caption">{MONTHS[month - 1]} {year}</p>
                    </>
                ) : (
                    <div className="dc-list-view">
                        {futureDepartures.length === 0 ? (
                            <div className="dc-no-data">No upcoming departures found for this month.</div>
                        ) : (
                            <div className="dc-list-grid">
                                {futureDepartures
                                  .filter(d => !showOnlyAvail || d.available_seats > 0)
                                  .map(d => {
                                    const status = statusLabel(d, threshold);
                                    const canBook = status !== 'fully_booked';

                                    return (
                                        <div key={d.id} className={`dc-list-card ${status}`}>
                                            <div className="dc-card-date">
                                                <span className="dc-card-day-num">{d.date.split('-')[2]}</span>
                                                <span className="dc-card-month-yr">{MONTHS[parseInt(d.date.split('-')[1]) - 1].slice(0,3)} {d.date.split('-')[0]}</span>
                                            </div>
                                            <div className="dc-card-info">
                                                <h4 className="dc-card-pkg">{d.package?.title}</h4>
                                                <div className="dc-card-meta">
                                                    <span className={`dc-card-status dc-card-status--${status}`}>
                                                        {status === 'fully_booked' ? 'Fully Booked' : status === 'limited' ? 'Limited Slots' : 'Available'}
                                                    </span>
                                                    <span className="dc-card-seats">{d.available_seats} seats left</span>
                                                </div>
                                            </div>
                                            <div className="dc-card-pricing">
                                                <div className="dc-card-price">${d.price.toLocaleString()}</div>
                                                <button 
                                                    className="dc-card-btn"
                                                    disabled={!canBook}
                                                    onClick={() => navigate(`/departures/book?departure_id=${d.id}`)}
                                                >
                                                    {canBook ? 'Book Now' : 'Closed'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
            </main>
            <Footer />
        </div>
    );
}
