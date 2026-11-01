import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDepartures, useAllDepartures } from '../hooks/useDepartures';
import type { Departure } from '../types/departure';
import '../pages/DepartureCalendar.css';
import '../pages/DepartureCalendarExtras.css';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function statusLabel(d: Departure, threshold: number) {
    if (d.available_seats === 0)        return 'fully_booked';
    if (d.available_seats <= threshold) return 'limited';
    return 'available';
}
function pad(n: number) { return String(n).padStart(2, '0'); }

function SkeletonCell() {
    return <div className="dc-cell dc-cell--skeleton"><div className="dc-skeleton-inner" /></div>;
}

export function ProductDepartureCalendar({ packageSlug }: { packageSlug: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-0 md:px-6">
                <div className="relative z-10">
                    {!isOpen ? (
                        <div className="text-center py-6">
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                Looking to join a group?
                            </h3>
                            <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm md:text-base">
                                Check out our fixed group departure dates. Travel with like-minded adventurers and take advantage of our group rates.
                            </p>
                            <button 
                                onClick={() => setIsOpen(true)}
                                className="inline-flex bg-[#0066FF] text-white py-4 px-8 rounded-xl font-bold uppercase tracking-wider hover:bg-blue-700 transition-all items-center justify-center gap-2 group shadow-lg"
                            >
                                View Departure Dates
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </button>
                        </div>
                    ) : (
                        <ProductDepartureCalendarInner packageSlug={packageSlug} />
                    )}
                </div>
            </div>
        </section>
    );
}

function ProductDepartureCalendarInner({ packageSlug }: { packageSlug: string }) {
    const navigate = useNavigate();

    const today = new Date();
    const currentYear  = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentDay = today.getDate();

    // "after this put year this year + 2 years"
    const YEARS = [currentYear, currentYear + 1, currentYear + 2];

    const [year, setYear] = useState<number | 'all'>(currentYear);
    const [month, setMonth] = useState<number | 'all'>(currentMonth);
    const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>(isMobile() ? 'list' : 'calendar');
    const [isSmallScreen, setIsSmallScreen] = useState(isMobile());

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsSmallScreen(mobile);
            if (mobile) setViewMode('list');
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { departures, threshold, loading, error } = useDepartures(
        year === 'all' ? 0 : year, 
        month === 'all' ? 0 : month, 
        packageSlug
    );

    const { allDepartures } = useAllDepartures(packageSlug);

    const yearCounts = useMemo(() => {
        const counts: Record<number, number> = {};
        allDepartures.forEach(d => {
            const y = new Date(d.date + 'T00:00:00').getFullYear();
            counts[y] = (counts[y] || 0) + 1;
        });
        return counts;
    }, [allDepartures]);

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

    const futureDepartures = useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return departures.filter(d => {
            const depDate = new Date(d.date + 'T00:00:00');
            return depDate >= now;
        });
    }, [departures]);

    const handleYearChange = (y: number) => {
        setYear(y);
        // If changing to current year and selected month is in the past, reset month to current
        if (y === currentYear && typeof month === 'number' && month < currentMonth) {
            setMonth(currentMonth);
        }
    };

    // Build calendar grid
    const calendarDays = useMemo(() => {
        if (year === 'all' || month === 'all') return [];
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

    const handleDateClick = useCallback((day: number) => {
        if (year === 'all' || month === 'all') return;
        const dateStr = `${year}-${pad(month)}-${pad(day)}`;
        const dep = departureMap[dateStr];
        
        // Disable past dates
        const isPastDay = year === currentYear && month === currentMonth && day < currentDay;

        if (!dep || dep.available_seats === 0 || isPastDay) return;
        
        navigate(`/departures/book?departure_id=${dep.id}`);
    }, [year, month, departureMap, navigate, currentYear, currentMonth, currentDay]);

    const renderCell = (day: number | null, idx: number) => {
        if (day === null) return <div key={`e-${idx}`} className="dc-cell dc-cell--empty" />;
        if (year === 'all' || month === 'all') return null;

        const dateStr = `${year}-${pad(month)}-${pad(day)}`;
        const dep     = departureMap[dateStr];

        if (loading) return <SkeletonCell key={dateStr} />;

        const isPastDay = year === currentYear && month === currentMonth && day < currentDay;

        if (!dep || isPastDay) {
            return (
                <div key={dateStr} className={`dc-cell dc-cell--no-data ${isPastDay ? 'dc-cell--dimmed' : ''}`}>
                    <span className="dc-cell-day">{day}</span>
                </div>
            );
        }

        const status   = statusLabel(dep, threshold);
        const clickable = status !== 'fully_booked';

        return (
            <div
                key={dateStr}
                className={['dc-cell', `dc-cell--${status}`, clickable ? 'dc-cell--clickable' : ''].join(' ')}
                onClick={() => handleDateClick(day)}
                title={`$${dep.price.toLocaleString()} · ${dep.available_seats} seats left`}
                role={clickable ? "button" : undefined} 
                tabIndex={clickable ? 0 : -1}
                onKeyDown={e => e.key === 'Enter' && clickable && handleDateClick(day)}
            >
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
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Fixed Group Departures</h2>
                <p className="text-gray-600">Select your preferred departure date below</p>
                
                {!isSmallScreen && (
                <div className="flex justify-center mt-6">
                    <div className="dc-view-toggles dc-view-toggles--dark">
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
                            📋 List View ({futureDepartures.length})
                        </button>
                    </div>
                </div>
            )}
            </div>
            
            <div className="dc-container shadow-sm rounded-2xl overflow-hidden bg-white border border-gray-200 text-left">
                    {/* Year selector */}
                    <div className="dc-year-selector">
                        {YEARS.map(y => (
                            <button key={y} className={`dc-year-btn${year === y ? ' dc-year-btn--active' : ''}`} onClick={() => handleYearChange(y)}>
                                {y} {yearCounts[y] ? `(${yearCounts[y]})` : ''}
                            </button>
                        ))}
                    </div>

                    {/* Month tabs */}
                    <div className="dc-months">
                        <button 
                            className={`dc-month-tab ${month === 'all' ? 'dc-month-tab--active' : ''}`}
                            onClick={() => { setMonth('all'); setYear('all'); setViewMode('list'); }}
                        >
                            All Upcoming {allDepartures.length > 0 ? `(${allDepartures.length})` : ''}
                        </button>
                        {MONTHS.map((m, i) => {
                            const monthNum = i + 1;
                            const count = monthCounts[monthNum];
                            // "after select month do not give past date"
                            const isPastMonth = year === currentYear && monthNum < currentMonth;
                            return (
                                <button 
                                    key={m} 
                                    className={`dc-month-tab${month === monthNum ? ' dc-month-tab--active' : ''} ${isPastMonth ? 'opacity-50 cursor-not-allowed' : ''}`} 
                                    disabled={isPastMonth}
                                    onClick={() => { setMonth(monthNum); setYear(year === 'all' ? currentYear : year); setViewMode('calendar'); }}
                                >
                                    {m.slice(0, 3)} {count ? `(${count})` : ''}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="dc-legend px-6 pb-2">
                        <span className="dc-legend-item"><span className="dc-legend-dot dc-legend-dot--available" /> Available</span>
                        <span className="dc-legend-item"><span className="dc-legend-dot dc-legend-dot--limited" /> Limited</span>
                        <span className="dc-legend-item"><span className="dc-legend-dot dc-legend-dot--fully_booked" /> Fully Booked</span>
                    </div>

                    {/* Content */}
                    {error ? (
                        <div className="dc-error">{error}</div>
                    ) : viewMode === 'calendar' ? (
                        <div className="dc-calendar p-6 bg-gray-50/50">
                            {DAYS.map(d => <div key={d} className="dc-day-header">{d}</div>)}
                            {calendarDays.map((day, i) => renderCell(day, i))}
                        </div>
                    ) : (
                        <div className="p-6 bg-gray-50/50">
                            <div className="dc-list-grid">
                                {futureDepartures.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400 italic">No upcoming departures found for this month.</div>
                                ) : (
                                    futureDepartures.map(d => {
                                        const status = statusLabel(d, threshold);
                                        const canBook = status !== 'fully_booked';
                                        
                                        return (
                                            <div key={d.id} className={`dc-list-card ${status}`}>
                                                <div className="dc-card-date">
                                                    <span className="dc-card-day-num">{d.date.split('-')[2]}</span>
                                                    <span className="dc-card-month-yr">{MONTHS[parseInt(d.date.split('-')[1]) - 1].slice(0,3)} {d.date.split('-')[0]}</span>
                                                </div>
                                                <div className="dc-card-info">
                                                    <h4 className="dc-card-pkg">{packageSlug.replace(/-/g, ' ')}</h4>
                                                    <div className="dc-card-meta">
                                                        <span className={`dc-card-status dc-card-status--${status}`}>
                                                            {status === 'fully_booked' ? 'Fully Booked' : status === 'limited' ? 'Limited' : 'Available'}
                                                        </span>
                                                        <span className="dc-card-seats">{d.available_seats} slots left</span>
                                                    </div>
                                                </div>
                                                <div className="dc-card-pricing">
                                                    <div className="dc-card-price">${d.price.toLocaleString()}</div>
                                                    <button 
                                                        className="dc-card-btn"
                                                        disabled={!canBook}
                                                        onClick={() => navigate(`/departures/book?departure_id=${d.id}`)}
                                                    >
                                                        {canBook ? 'Book' : 'Closed'}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>
        </div>
    );
}
