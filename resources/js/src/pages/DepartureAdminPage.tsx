import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDepartures, useSettings, departureApi, usePackagesList, useAllDepartures } from '../hooks/useDepartures';
import type { Departure, BulkDepartureItem, PackageInfo } from '../types/departure';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import './DepartureAdminPage.css';

// ─── Constants ──────────────────────────────────────────────────────────────
const MONTHS = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const currentYearGlobal = new Date().getFullYear();
const YEARS = [currentYearGlobal - 1, currentYearGlobal, currentYearGlobal + 1, currentYearGlobal + 2];

function pad(n: number) { return String(n).padStart(2, '0'); }

// ─── DepartureFormModal ──────────────────────────────────────────────────────
interface DepartureFormModalProps {
    date: string;          // YYYY-MM-DD
    existing?: Departure;
    packageId?: number;
    onClose: () => void;
    onSaved: (d: Departure) => void;
}

function DepartureFormModal({ date, existing, packageId, onClose, onSaved }: DepartureFormModalProps) {
    const { packages } = usePackagesList();
    const [localPackageId, setLocalPackageId] = useState<number | undefined>(packageId ?? existing?.package_id);
    const [price, setPrice]         = useState(existing?.price ?? 1390);
    const [total, setTotal]         = useState<number>(existing?.total_seats ?? 20);
    const [avail, setAvail]         = useState<number>(existing?.available_seats ?? 20);
    
    // Recurrence state
    const [isRecurring, setIsRecurring] = useState(false);
    const [freq, setFreq]               = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
    const [endDate, setEndDate]         = useState('');
    const [editDate, setEditDate]       = useState(date);

    const [saving, setSaving]       = useState(false);
    const [error, setError]         = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const dateLabel = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (avail > total) { setError('Available seats cannot exceed total seats.'); return; }
        if (!localPackageId) { setError('Please select a package.'); return; }
        setSaving(true);
        try {
            if (isRecurring && !existing) {
                // Handle recurring generation
                const [sy, sm, sd] = date.split('-').map(Number);
                const [ey, em, ed] = endDate.split('-').map(Number);
                let curr = new Date(sy, sm - 1, sd);
                const end = new Date(ey, em - 1, ed);
                
                if (isNaN(end.getTime()) || end < curr) {
                    throw new Error("Invalid end date for recurrence.");
                }

                const dates: string[] = [];
                const formatLocal = (d: Date) => {
                    const y = d.getFullYear();
                    const m = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    return `${y}-${m}-${day}`;
                };

                let limit = 0;
                while (curr <= end && limit < 500) {
                    dates.push(formatLocal(curr));
                    if (freq === 'daily') curr.setDate(curr.getDate() + 1);
                    else if (freq === 'weekly') curr.setDate(curr.getDate() + 7);
                    else if (freq === 'monthly') curr.setMonth(curr.getMonth() + 1);
                    else if (freq === 'yearly') curr.setFullYear(curr.getFullYear() + 1);
                    limit++;
                }

                const payload = dates.map(d => ({
                    date: d,
                    price,
                    total_seats: total,
                    available_seats: avail
                }));

                const res = await departureApi.bulk(payload, localPackageId);
                onSaved(res.data[0]); // signal update with first one
            } else if (existing) {
                const res = await departureApi.update(existing.id, {
                    date: editDate,
                    price,
                    total_seats: total,
                    available_seats: avail,
                    package_id: localPackageId
                });
                onSaved();
            } else {
                const res = await departureApi.create({
                    package_id: localPackageId!,
                    date,
                    price,
                    total_seats: total,
                    available_seats: avail,
                });
                onSaved(res.data);
            }
            onClose();
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
            const msgs = axiosErr?.response?.data?.errors
                ? Object.values(axiosErr.response.data.errors).flat().join(' ')
                : axiosErr?.response?.data?.message ?? 'Failed to save departure.';
            setError(msgs);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!existing) return;
        setSaving(true);
        try {
            await departureApi.remove(existing.id);
            onSaved({ ...existing, id: -1 }); // signal deletion
            onClose();
        } catch {
            setError('Failed to delete departure.');
        } finally {
            setSaving(false);
        }
    };

    if (showDeleteConfirm && existing) {
        return (
            <div className="da-modal-overlay">
                <div className="da-modal da-modal--sm text-center !p-10">
                    <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-short">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <div className="text-2xl font-black text-gray-900 mb-2">Delete this trip?</div>
                    
                    <div className="mb-6 text-center">
                        <div className="text-sm font-bold text-gray-800">{packages?.find(p => p.id === localPackageId)?.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{dateLabel}</div>
                    </div>

                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                        This departure will be permanently removed. This action <span className="font-bold text-red-600 underline">cannot</span> be undone.
                    </p>
                    <div className="da-modal-actions mt-5">
                        <button 
                            className="da-btn da-btn--ghost flex-1 py-3 rounded-xl font-bold text-gray-600" 
                            onClick={() => setShowDeleteConfirm(false)}
                        >
                            No, Cancel
                        </button>
                        <button 
                            className="da-btn da-btn--danger flex-1 py-3 rounded-xl font-bold shadow-lg shadow-red-100" 
                            onClick={handleDelete}
                        >
                            Yes, Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="da-modal-overlay" onClick={onClose}>
            <div className="da-modal" onClick={e => e.stopPropagation()}>
                <button className="da-modal-close" onClick={onClose} aria-label="Close">×</button>
                <h2 className="da-modal-title">{existing ? 'Edit' : 'Add'} Departure</h2>
                <p className="da-modal-date">{dateLabel}</p>

                <form className="da-form" onSubmit={handleSubmit}>
                    {!packageId && !existing && (
                        <div className="da-form-group mb-4">
                            <label className="da-form-label">Select Package</label>
                            <select 
                                className="da-form-input"
                                value={localPackageId || ''}
                                onChange={e => setLocalPackageId(parseInt(e.target.value))}
                                required
                            >
                                <option value="">-- Choose a Package --</option>
                                {packages?.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {existing && (
                        <div className="da-form-group mb-4">
                            <label className="da-form-label">Shift Date</label>
                            <input 
                                type="date" 
                                className="da-form-input"
                                value={editDate}
                                onChange={e => setEditDate(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="da-form-row">
                        <div className="da-form-group">
                            <label className="da-form-label">Price (USD)</label>
                            <input
                                className="da-form-input"
                                type="number"
                                min={0}
                                step={0.01}
                                value={price}
                                onChange={e => {
                                    const v = e.target.value;
                                    setPrice(v === '' ? 0 : parseFloat(v));
                                }}
                                required
                            />
                        </div>
                        <div className="da-form-group">
                            <label className="da-form-label">Total Seats</label>
                            <input
                                className="da-form-input"
                                type="number"
                                min={1}
                                value={total}
                                onChange={e => {
                                    const v = e.target.value;
                                    setTotal(v === '' ? 1 : parseInt(v));
                                }}
                                required
                            />
                        </div>
                        <div className="da-form-group">
                            <label className="da-form-label">Available Seats</label>
                            <input
                                className="da-form-input"
                                type="number"
                                min={0}
                                max={total}
                                value={avail}
                                onChange={e => {
                                    const v = e.target.value;
                                    setAvail(v === '' ? 0 : parseInt(v));
                                }}
                                required
                            />
                        </div>
                    </div>

                    {!existing && (
                        <div className="da-form-section mt-4">
                            <label className="da-checkbox-label">
                                <input 
                                    type="checkbox" 
                                    checked={isRecurring} 
                                    onChange={e => setIsRecurring(e.target.checked)} 
                                />
                                <span>Make Recurring</span>
                            </label>

                            {isRecurring && (
                                <div className="da-form-grid mt-2">
                                    <div className="da-form-group">
                                        <label className="da-form-label">Frequency</label>
                                        <select 
                                            className="da-form-input"
                                            value={freq}
                                            onChange={e => setFreq(e.target.value as any)}
                                        >
                                            <option value="daily">Every Day</option>
                                            <option value="weekly">Every Week</option>
                                            <option value="monthly">Every Month</option>
                                            <option value="yearly">Every Year</option>
                                        </select>
                                    </div>
                                    <div className="da-form-group">
                                        <label className="da-form-label">Until Date</label>
                                        <input 
                                            type="date" 
                                            className="da-form-input"
                                            value={endDate}
                                            onChange={e => setEndDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {error && <p className="da-form-error">{error}</p>}

                    <div className="da-form-actions">
                        {existing && (
                            <button
                                type="button"
                                className="da-btn da-btn--danger"
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={saving}
                            >
                                Delete
                            </button>
                        )}
                        <button type="button" className="da-btn da-btn--ghost" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="da-btn da-btn--primary" disabled={saving}>
                            {saving ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── BulkModal ───────────────────────────────────────────────────────────────
interface BulkModalProps {
    selectedDates: string[];
    packageId?: number;
    onClose: () => void;
    onApplied: (deps: Departure[]) => void;
}

function BulkModal({ selectedDates, packageId, onClose, onApplied }: BulkModalProps) {
    const { packages } = usePackagesList();
    const [localPackageId, setLocalPackageId] = useState<number | undefined>(packageId);
    
    // Bulk Type: 'manual' (from calendar selection) or 'recurring' (generator)
    const [bulkType] = useState<'manual' | 'recurring'>(selectedDates.length > 0 ? 'manual' : 'recurring');
    
    // Recurring Settings
    const [freq, setFreq]           = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
    
    // Initialize start date to local today
    const [startDate, setStartDate] = useState<string>(() => {
        const d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    });
    const [endDate, setEndDate]     = useState<string>('');
    
    const [price, setPrice]         = useState<string>('');
    const [total, setTotal]         = useState<string>('20');
    const [avail, setAvail]         = useState<string>('20');
    const [saving, setSaving]       = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError]         = useState('');

    const generateRecurringDates = (): string[] => {
        const dates: string[] = [];
        if (!startDate || !endDate) return [];

        const [sy, sm, sd] = startDate.split('-').map(Number);
        const [ey, em, ed] = endDate.split('-').map(Number);
        
        let curr = new Date(sy, sm - 1, sd);
        const end = new Date(ey, em - 1, ed);
        
        if (isNaN(curr.getTime()) || isNaN(end.getTime())) return [];
        if (end < curr) return [];

        const formatLocal = (d: Date) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        };

        let limit = 0;
        while (curr <= end && limit < 500) {
            dates.push(formatLocal(curr));
            
            const next = new Date(curr);
            if (freq === 'daily') next.setDate(next.getDate() + 1);
            else if (freq === 'weekly') next.setDate(next.getDate() + 7);
            else if (freq === 'monthly') next.setMonth(next.getMonth() + 1);
            else if (freq === 'yearly') next.setFullYear(next.getFullYear() + 1);
            
            // Safety break if date doesn't advance
            if (next.getTime() <= curr.getTime()) break;
            curr = next;
            limit++;
        }
        return dates;
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (price === '' || total === '' || avail === '') {
            setError('All fields are required.'); return;
        }
        if (!localPackageId) {
            setError('Please select a package.'); return;
        }

        const targetDates = bulkType === 'manual' ? selectedDates : generateRecurringDates();
        
        if (targetDates.length === 0) {
            setError(bulkType === 'manual' ? 'No dates selected.' : 'Invalid date range or no dates generated.');
            return;
        }

        const numPrice = parseFloat(price);
        const numTotal = parseInt(total);
        const numAvail = parseInt(avail);

        if (numAvail > numTotal) {
            setError('Available seats cannot exceed total seats.'); return;
        }

        setSaving(true);
        const payload: BulkDepartureItem[] = targetDates.map(date => ({
            date,
            price: numPrice,
            total_seats: numTotal,
            available_seats: numAvail,
        }));

        try {
            const res = await departureApi.bulk(payload, localPackageId);
            onApplied(res.data);
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to apply bulk changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedDates.length === 0) return;
        setShowDeleteConfirm(true);
    };

    const confirmBulkDelete = async () => {
        setSaving(true);
        setError('');
        try {
            await departureApi.bulkRemove(selectedDates, localPackageId);
            onApplied([]); // reload list
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete departures.');
            setShowDeleteConfirm(false);
        } finally {
            setSaving(false);
        }
    };

    if (showDeleteConfirm) {
        const targetDesc = localPackageId 
            ? packages?.find(p => p.id === localPackageId)?.title 
            : "ALL Packages";

        return (
            <div className="da-modal-overlay">
                <div className="da-modal da-modal--sm text-center !p-10">
                    <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-short">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <div className="text-2xl font-black text-gray-900 mb-2">Delete {selectedDates.length} Trips?</div>
                    
                    <div className="mb-6 text-center">
                        <div className="text-sm font-bold text-gray-800">{targetDesc}</div>
                        <div className="text-xs text-gray-500 mt-1">{selectedDates.length} dates selected</div>
                    </div>

                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                        These departures will be permanently removed. This action <span className="font-bold text-red-600 underline">cannot</span> be undone.
                    </p>
                    <div className="da-modal-actions mt-5">
                        <button 
                            className="da-btn da-btn--ghost flex-1 py-3 rounded-xl font-bold text-gray-600" 
                            onClick={() => setShowDeleteConfirm(false)}
                        >
                            No, Cancel
                        </button>
                        <button 
                            className="da-btn da-btn--danger flex-1 py-3 rounded-xl font-bold shadow-lg shadow-red-100" 
                            onClick={confirmBulkDelete}
                            disabled={saving}
                        >
                            {saving ? 'Deleting...' : 'Yes, Delete All'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="da-modal-overlay" onClick={onClose}>
            <div className="da-modal da-modal--wide" onClick={e => e.stopPropagation()}>
                <button className="da-modal-close" onClick={onClose}>×</button>
                <h2 className="da-modal-title">Bulk Departure Manager</h2>
                
                <form className="da-form" onSubmit={handleApply}>
                    {bulkType === 'manual' && selectedDates.length > 0 && (
                        <div className="bg-blue-50 text-blue-700 p-3 rounded-xl mb-6 text-xs font-bold border border-blue-100">
                            ✨ You are updating {selectedDates.length} selected dates.
                        </div>
                    )}
                    <div className="da-form-section">
                        <h3 className="da-section-title">Package & Pricing</h3>
                        <div className="da-form-grid">
                            {!packageId && (
                                <div className="da-form-group">
                                    <label className="da-form-label">Select Package</label>
                                    <select 
                                        className="da-form-input"
                                        value={localPackageId || ''}
                                        onChange={e => setLocalPackageId(parseInt(e.target.value))}
                                        required
                                    >
                                        <option value="">-- Choose a Package --</option>
                                        {packages?.map(p => (
                                            <option key={p.id} value={p.id}>{p.title}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="da-form-group">
                                <label className="da-form-label">Price (USD)</label>
                                <input
                                    className="da-form-input"
                                    type="number" min={0} step={0.01}
                                    placeholder="e.g. 1390"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="da-form-group">
                                <label className="da-form-label">Total Seats</label>
                                <input
                                    className="da-form-input"
                                    type="number" min={1}
                                    value={total}
                                    onChange={e => setTotal(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="da-form-group">
                                <label className="da-form-label">Avail. Seats</label>
                                <input
                                    className="da-form-input"
                                    type="number" min={0}
                                    value={avail}
                                    onChange={e => setAvail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {bulkType === 'recurring' && selectedDates.length === 0 && (
                        <div className="da-form-section mt-4">
                            <h3 className="da-section-title">Recurrence Rules</h3>
                            <div className="da-form-grid">
                                <div className="da-form-group">
                                    <label className="da-form-label">Frequency</label>
                                    <select 
                                        className="da-form-input"
                                        value={freq}
                                        onChange={e => setFreq(e.target.value as any)}
                                    >
                                        <option value="daily">Every Day</option>
                                        <option value="weekly">Every Week</option>
                                        <option value="monthly">Every Month</option>
                                        <option value="yearly">Every Year</option>
                                    </select>
                                </div>
                                <div className="da-form-group">
                                    <label className="da-form-label">Start Date</label>
                                    <input 
                                        type="date" 
                                        className="da-form-input"
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="da-form-group">
                                    <label className="da-form-label">End Date</label>
                                    <input 
                                        type="date" 
                                        className="da-form-input"
                                        value={endDate}
                                        onChange={e => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-2">
                                * Generates departures from start to end based on frequency.
                            </p>
                        </div>
                    )}

                    {error && <p className="da-form-error mt-4">{error}</p>}

                    <div className="da-modal-actions">
                        <button type="button" className="da-btn da-btn--ghost flex-1" onClick={onClose}>
                            Cancel
                        </button>
                        {bulkType === 'manual' && (
                            <button 
                                type="button" 
                                className="da-btn da-btn--danger flex-1" 
                                disabled={saving}
                                onClick={handleBulkDelete}
                            >
                                {saving ? 'Deleting…' : `Delete ${selectedDates.length} Dates`}
                            </button>
                        )}
                        <button type="submit" className="da-btn da-btn--primary flex-1" disabled={saving}>
                            {saving ? 'Processing…' : bulkType === 'manual' 
                                ? `Update ${selectedDates.length} Dates` 
                                : 'Generate & Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── SettingsBar ─────────────────────────────────────────────────────────────
function SettingsBar({ packageId, defaultVal }: { packageId?: number; defaultVal: number }) {
    const { settings, loading, saving, updateSettings } = useSettings(packageId);
    const [val, setVal] = useState<number>(defaultVal);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!loading) setVal(settings.limited_threshold ?? defaultVal);
    }, [loading, settings, defaultVal, packageId]);

    const handleSave = async () => {
        const ok = await updateSettings(val);
        if (ok) {
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    return (
        <div className="da-settings-bar">
            <div className="da-settings-inner">
                <div className="da-settings-field">
                    <label className="da-settings-label">
                        ⚙ Limited Seats Threshold {packageId ? '(For Selected Package)' : '(Global)'}
                        <span className="da-settings-hint">
                            (seats ≤ this value → "Limited" status)
                        </span>
                    </label>
                    <div className="da-settings-controls">
                        <input
                            className="da-settings-input"
                            type="number"
                            min={1} max={100}
                            value={val}
                            onChange={e => setVal(parseInt(e.target.value) || 1)}
                            disabled={loading}
                        />
                        <button
                            className={`da-btn da-btn--primary da-btn--sm${saved ? ' da-btn--saved' : ''}`}
                            onClick={handleSave}
                            disabled={saving || loading}
                        >
                            {saved ? '✓ Saved' : saving ? 'Saving…' : 'Update'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export function DepartureAdminPage() {
    const [searchParams] = useSearchParams();
    // It's an admin view if it's either in an iframe with ?iframe=1 OR mounted in the departure-admin-mount div
    const isIframe = searchParams.get('iframe') === '1' || !!document.getElementById('departure-admin-mount');
    
    // Initial theme check
    const initialTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const [theme, setTheme] = useState(searchParams.get('theme') || initialTheme);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === 'filament-theme') {
                setTheme(event.data.theme);
            }
        };
        
        const handleCustomEvent = (event: any) => {
            if (event.detail?.theme) {
                setTheme(event.detail.theme);
            }
        };

        window.addEventListener('message', handleMessage);
        window.addEventListener('filament-theme-changed', handleCustomEvent);
        
        return () => {
            window.removeEventListener('message', handleMessage);
            window.removeEventListener('filament-theme-changed', handleCustomEvent);
        };
    }, []);

    const currentYear  = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [year, setYear]   = useState<number | 'all'>(currentYear);
    const [month, setMonth] = useState<number | 'all'>(currentMonth);

    const { packages } = usePackagesList();
    const [selectedPackageSlug, setSelectedPackageSlug] = useState('');
    const selectedPackage = useMemo(() => packages?.find(p => p.slug === selectedPackageSlug), [packages, selectedPackageSlug]);

    const { departures, threshold, loading, reload } = useDepartures(
        year === 'all' ? 0 : year, 
        month === 'all' ? 0 : month, 
        selectedPackageSlug
    );

    const { allDepartures, reload: reloadAll } = useAllDepartures(selectedPackageSlug);

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

    const [notification, setNotification] = useState<string | null>(null);

    const showNotice = useCallback((msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    }, []);

    // Modal state
    const [modalDate, setModalDate]   = useState<string | null>(null);
    const [selectedDayDepartures, setSelectedDayDepartures] = useState<{ date: string; deps: Departure[] } | null>(null);
    const [editDeparture, setEditDeparture] = useState<Departure | null>(null);
    const [showBulk, setShowBulk]     = useState(false);
    const [selectedDates, setSelected] = useState<Set<string>>(new Set());
    const [bulkMode, setBulkMode]      = useState(false);
    const [viewMode, setViewMode]      = useState<'calendar' | 'list'>('calendar');
    const [listTab, setListTab]        = useState<'upcoming' | 'past'>('upcoming');
    const [deletingId, setDeletingId] = useState<number | null>(null);

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

    // Map date → departures (array to support multiple packages on same day)
    const depMap = useMemo<Record<string, Departure[]>>(() => {
        const m: Record<string, Departure[]> = {};
        for (const d of departures) {
            if (!m[d.date]) m[d.date] = [];
            m[d.date].push(d);
        }
        return m;
    }, [departures]);

    // Handle saved from modal
    const handleSaved = useCallback(() => {
        reload();
        reloadAll();
    }, [reload, reloadAll]);

    // Handle bulk applied
    const handleBulkApplied = useCallback(() => {
        reload();
        reloadAll();
        setSelected(new Set());
        setBulkMode(false);
    }, [reload, reloadAll]);

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await departureApi.remove(deletingId);
            setDeletingId(null);
            reload();
            reloadAll();
            showNotice('Departure deleted successfully.');
        } catch {
            showNotice('Failed to delete departure.');
        }
    };

    const toggleSelectDate = (dateStr: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(dateStr)) next.delete(dateStr);
            else next.add(dateStr);
            return next;
        });
    };

    const handleCellClick = (day: number) => {
        const dateStr = `${year}-${pad(month)}-${pad(day)}`;
        if (bulkMode) {
            toggleSelectDate(dateStr);
        } else {
            if (!selectedPackageSlug) {
                const deps = depMap[dateStr] || [];
                if (deps.length > 0) {
                    setSelectedDayDepartures({ date: dateStr, deps });
                } else {
                    showNotice('Please select a package first to add a departure.');
                }
            } else {
                setModalDate(dateStr);
            }
        }
    };

    const statusColor = (deps: Departure[]) => {
        if (deps.length === 0) return 'da-cell--none';
        // If multiple, use the "worst" status or just a special color?
        // Let's check if any is full
        if (deps.some(d => d.available_seats === 0)) return 'da-cell--red';
        if (deps.some(d => d.available_seats <= threshold)) return 'da-cell--yellow';
        return 'da-cell--green';
    };

    const content = (
        <div className={`da-page theme-${theme}`}>
            {/* Header */}
            <div className="da-header">
                <div className="da-header-inner">
                    {!isIframe ? (
                        <div>
                            <h1 className="da-header-title">
                                📅 Departure Calendar
                            </h1>
                            <p className="da-header-sub">Manage fixed group departure dates</p>
                        </div>
                    ) : (
                        <div style={{ flex: 1 }}></div>
                    )}
                    <div className="da-header-actions">
                        <select 
                            className="da-settings-input" 
                            style={{ width: '200px' }}
                            value={selectedPackageSlug}
                            onChange={(e) => setSelectedPackageSlug(e.target.value)}
                        >
                            <option value="">All Packages (Global)</option>
                            {packages?.map(p => (
                                <option key={p.slug} value={p.slug}>{p.title}</option>
                            ))}
                        </select>
                        <button
                            className="da-btn da-btn--sm da-btn--ghost"
                            onClick={() => setViewMode(viewMode === 'calendar' ? 'list' : 'calendar')}
                        >
                            {viewMode === 'calendar' ? `📊 Total: ${departures.length}` : '📅 Back to Calendar'}
                        </button>
                        <button 
                            className="da-btn da-btn--sm da-btn--ghost"
                            onClick={() => {
                                setSelected(new Set());
                                setBulkMode(false);
                                setShowBulk(true);
                            }}
                        >
                            🔄 Generator
                        </button>
                        <button
                            className={`da-btn da-btn--sm ${bulkMode ? 'da-btn--active' : 'da-btn--ghost'}`}
                            onClick={() => { setBulkMode(!bulkMode); setSelected(new Set()); setViewMode('calendar'); }}
                        >
                            {bulkMode ? '✓ Bulk Mode ON' : 'Bulk Select'}
                        </button>
                        {bulkMode && selectedDates.size > 0 && (
                            <button
                                className="da-btn da-btn--primary da-btn--sm"
                                onClick={() => setShowBulk(true)}
                            >
                                Apply to {selectedDates.size} Dates
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Settings Bar */}
            <SettingsBar packageId={selectedPackage?.id} defaultVal={threshold} />

            <div className="da-container">
                {/* Year + Month controls */}
                <div className="da-controls">
                    <div className="da-year-tabs">
                        {YEARS.map(y => (
                            <button
                                key={y}
                                className={`da-tab${year === y ? ' da-tab--active' : ''}`}
                                onClick={() => { setYear(y); setSelected(new Set()); }}
                            >
                                {y} {yearCounts[y] ? `(${yearCounts[y]})` : ''}
                            </button>
                        ))}
                    </div>
                    <div className="da-month-tabs">
                        <button
                            className={`da-tab${month === 'all' ? ' da-tab--active' : ''}`}
                            onClick={() => { setMonth('all'); setYear('all'); setViewMode('list'); setSelected(new Set()); }}
                        >
                            All Upcoming {allDepartures.length > 0 ? `(${allDepartures.length})` : ''}
                        </button>
                        {MONTHS.map((m, i) => {
                            const mNum = i + 1;
                            const count = monthCounts[mNum];
                            return (
                                <button
                                    key={m}
                                    className={`da-tab${month === mNum ? ' da-tab--active' : ''}`}
                                    onClick={() => { setMonth(mNum); setYear(year === 'all' ? currentYear : year); setViewMode('calendar'); setSelected(new Set()); }}
                                >
                                    {m.slice(0,3)} {count ? `(${count})` : ''}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Stats summary */}
                {!loading && (
                    <div className="da-summary">
                        <div className="da-summary-card">
                            <span className="da-summary-num">{departures.length}</span>
                            <span className="da-summary-label">Total Dates</span>
                        </div>
                        <div className="da-summary-card da-summary-card--green">
                            <span className="da-summary-num">
                                {departures.filter(d => d.available_seats > threshold).length}
                            </span>
                            <span className="da-summary-label">Available</span>
                        </div>
                        <div className="da-summary-card da-summary-card--yellow">
                            <span className="da-summary-num">
                                {departures.filter(d => d.available_seats > 0 && d.available_seats <= threshold).length}
                            </span>
                            <span className="da-summary-label">Limited</span>
                        </div>
                        <div className="da-summary-card da-summary-card--red">
                            <span className="da-summary-num">
                                {departures.filter(d => d.available_seats === 0).length}
                            </span>
                            <span className="da-summary-label">Fully Booked</span>
                        </div>
                    </div>
                )}

                {/* Bulk mode tip */}
                {bulkMode && (
                    <div className="da-bulk-tip">
                        💡 Click dates to select them, then click "Apply to X Dates"
                    </div>
                )}

                {/* Main Content */}
                {viewMode === 'calendar' ? (
                    <div className="da-calendar">
                        {DAYS.map(d => (
                            <div key={d} className="da-day-header">{d}</div>
                        ))}

                        {calendarDays.map((day, idx) => {
                            if (day === null) return <div key={`e${idx}`} className="da-cell da-cell--empty" />;

                            const dateStr = `${year}-${pad(month)}-${pad(day)}`;
                            const deps    = depMap[dateStr] || [];
                            const isSel   = selectedDates.has(dateStr);
                            const isPastDay = new Date(dateStr + 'T23:59:59') < new Date();

                            return (
                                <div
                                    key={dateStr}
                                    className={[
                                        'da-cell',
                                        statusColor(deps),
                                        bulkMode ? 'da-cell--selectable' : 'da-cell--clickable',
                                        isSel ? 'da-cell--selected' : '',
                                        loading ? 'da-cell--skeleton' : '',
                                        isPastDay ? 'da-cell--past opacity-50 cursor-not-allowed' : '',
                                        deps.length > 1 ? 'da-cell--multiple' : '',
                                    ].join(' ')}
                                    onClick={() => {
                                        if (loading) return;
                                        if (isPastDay) {
                                            showNotice("You cannot add or edit departures for past dates.");
                                            return;
                                        }
                                        handleCellClick(day);
                                    }}
                                    role="button"
                                    tabIndex={isPastDay ? -1 : 0}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !loading) {
                                            if (isPastDay) {
                                                showNotice("You cannot add or edit departures for past dates.");
                                                return;
                                            }
                                            handleCellClick(day);
                                        }
                                    }}
                                >
                                    {isSel && <span className="da-sel-check">✓</span>}
                                    <span className="da-cell-day">{day}</span>
                                    
                                    {deps.length > 0 && !loading && (
                                        <div className="da-cell-stack">
                                            {deps.slice(0, 3).map(d => (
                                                <div key={d.id} className="da-stack-item">
                                                    <span className="da-stack-price">${d.price}</span>
                                                    <span className="da-stack-pkg">{d.package?.title.slice(0, 8)}..</span>
                                                </div>
                                            ))}
                                            {deps.length > 3 && <div className="da-stack-more">+{deps.length - 3} more</div>}
                                        </div>
                                    )}

                                    {deps.length === 0 && !loading && (
                                        <span className="da-cell-add">+ Add</span>
                                    )}
                                    {loading && <div className="da-skeleton-bar" />}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="da-list-view">
                        <div className="da-list-toggles">
                            <button 
                                className={`da-btn da-btn--sm ${listTab === 'upcoming' ? 'da-btn--primary' : 'da-btn--ghost'}`}
                                onClick={() => setListTab('upcoming')}
                            >
                                🚀 Upcoming & Today
                            </button>
                            <button 
                                className={`da-btn da-btn--sm ${listTab === 'past' ? 'da-btn--danger' : 'da-btn--ghost'}`}
                                onClick={() => setListTab('past')}
                            >
                                🕒 Past Trips
                            </button>
                        </div>
                        <div className="da-list-container">
                            {(() => {
                                const now = new Date();
                                now.setHours(0, 0, 0, 0);
                                const filtered = departures.filter(d => {
                                    const depDate = new Date(d.date + 'T23:59:59');
                                    return listTab === 'upcoming' ? depDate >= now : depDate < now;
                                });

                                if (filtered.length === 0) {
                                    return <div className="da-no-data">No {listTab} departures found for this selection.</div>;
                                }

                                return (
                                    <table className="da-table">
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Package</th>
                                                <th>Price</th>
                                                <th>Seats</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtered.map(d => {
                                                const isPast = new Date(d.date + 'T23:59:59') < new Date();
                                                return (
                                                    <tr key={d.id} className={isPast ? 'da-row--past' : ''}>
                                                        <td>{new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                                                        <td>
                                                            <div className="font-semibold text-gray-800">{d.package?.title}</div>
                                                            <div className="text-[10px] text-gray-400 uppercase tracking-wider">{d.package?.slug}</div>
                                                        </td>
                                                        <td className="font-mono text-blue-600 font-bold">${d.price}</td>
                                                        <td>
                                                            <div className="flex items-center gap-2">
                                                                {isPast ? (
                                                                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded uppercase">Past Trip</span>
                                                                ) : (
                                                                    <>
                                                                        <span className={`w-2 h-2 rounded-full ${d.available_seats === 0 ? 'bg-red-500' : d.available_seats <= threshold ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                                                        {d.available_seats} / {d.total_seats}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap">
                                                            <div className="da-table-actions">
                                                                <button 
                                                                    className="da-btn da-btn--sm da-btn--primary w-20"
                                                                    onClick={() => setModalDate(d.date)}
                                                                >
                                                                    {isPast ? 'View' : 'Edit'}
                                                                </button>
                                                                <button 
                                                                    className="da-btn da-btn--sm da-btn--danger w-20"
                                                                    onClick={() => setDeletingId(d.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                );
                            })()}
                        </div>
                    </div>
                )}

                <p className="da-calendar-caption">
                    {MONTHS[month - 1]} {year} — {viewMode === 'calendar' ? 'Click a date to add/edit' : 'Showing all active departures'}
                </p>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className="da-notification">
                    {notification}
                </div>
            )}

            {/* Single date modal */}
            {modalDate && (
                <DepartureFormModal
                    date={modalDate}
                    existing={depMap[modalDate]?.find(d => d.package_id === selectedPackage?.id || !selectedPackage)}
                    packageId={selectedPackage?.id}
                    onClose={() => setModalDate(null)}
                    onSaved={() => {
                        setModalDate(null);
                        handleSaved();
                    }}
                />
            )}

            {/* Bulk modal */}
            {showBulk && (
                <BulkModal
                    selectedDates={[...selectedDates]}
                    packageId={selectedPackage?.id}
                    onClose={() => setShowBulk(false)}
                    onApplied={handleBulkApplied}
                />
            )}

            {/* Occupied date departures list modal (Global view) */}
            {selectedDayDepartures && (
                <div className="da-modal-overlay" onClick={() => setSelectedDayDepartures(null)}>
                    <div className="da-modal da-modal--wide" onClick={e => e.stopPropagation()}>
                        <button className="da-modal-close" onClick={() => setSelectedDayDepartures(null)}>×</button>
                        <h2 className="da-modal-title">Departures on {new Date(selectedDayDepartures.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</h2>
                        <div className="mt-6 overflow-x-auto">
                            <table className="da-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Package</th>
                                        <th>Price</th>
                                        <th>Seats</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedDayDepartures.deps.map(d => {
                                        const isPast = new Date(d.date + 'T23:59:59') < new Date();
                                        return (
                                            <tr key={d.id} className={isPast ? 'da-row--past' : ''}>
                                                <td className="whitespace-nowrap">
                                                    {new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                </td>
                                                <td>
                                                    <div className="font-semibold text-gray-800">{d.package?.title}</div>
                                                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">{d.package?.slug}</div>
                                                </td>
                                                <td className="font-mono text-blue-600 font-bold">${d.price}</td>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        {isPast ? (
                                                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded uppercase">Past Trip</span>
                                                        ) : (
                                                            <>
                                                                <span className={`w-2 h-2 rounded-full ${d.available_seats === 0 ? 'bg-red-500' : d.available_seats <= threshold ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                                                {d.available_seats} / {d.total_seats}
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap">
                                                    <div className="da-table-actions">
                                                        <button 
                                                            className="da-btn da-btn--sm da-btn--primary w-20"
                                                            onClick={() => setEditDeparture(d)}
                                                        >
                                                            {isPast ? 'View' : 'Edit'}
                                                        </button>
                                                        <button 
                                                            className="da-btn da-btn--sm da-btn--danger w-20"
                                                            onClick={() => {
                                                                setDeletingId(d.id);
                                                                setSelectedDayDepartures(null);
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit departure modal from the departures popup list */}
            {editDeparture && (
                <DepartureFormModal
                    date={editDeparture.date}
                    existing={editDeparture}
                    packageId={editDeparture.package_id}
                    onClose={() => setEditDeparture(null)}
                    onSaved={() => {
                        setEditDeparture(null);
                        setSelectedDayDepartures(null);
                        handleSaved();
                    }}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deletingId && (() => {
                const dep = departures.find(d => d.id === deletingId);
                return (
                    <div className="da-modal-overlay">
                        <div className="da-modal da-modal--sm text-center !p-10">
                            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-short">
                                <span className="text-4xl">⚠️</span>
                            </div>
                            <div className="text-2xl font-black text-gray-900 mb-2">Delete this trip?</div>
                            
                            {dep && (
                                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                                    <div className="text-sm font-bold text-gray-800">{dep.package?.title}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {new Date(dep.date + 'T00:00:00').toLocaleDateString('en-US', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </div>
                                </div>
                            )}

                            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                                This departure will be permanently removed. This action <span className="font-bold text-red-600 underline">cannot</span> be undone.
                            </p>
                            <div className="da-modal-actions mt-5">
                                <button 
                                    className="da-btn da-btn--ghost flex-1 py-3 rounded-xl font-bold text-gray-600" 
                                    onClick={() => setDeletingId(null)}
                                >
                                    No, Cancel
                                </button>
                                <button 
                                    className="da-btn da-btn--danger flex-1 py-3 rounded-xl font-bold shadow-lg shadow-red-100 hover:scale-105 transition-transform" 
                                    onClick={handleDelete}
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );

    if (isIframe) {
        return content;
    }

    return (
        <div className="min-h-screen font-sans text-gray-900 bg-white">
            <Navbar />
            <main className="w-full min-h-screen bg-white">
                {content}
            </main>
            <Footer />
        </div>
    );
}
