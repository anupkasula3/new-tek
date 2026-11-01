import { useState, useEffect, useCallback } from 'react';
import { fetchData, postData, updateData, deleteData } from '../axiosHook';
import type {
    Departure,
    DeparturesResponse,
    DepartureSettings,
    BulkDepartureItem,
    PackageInfo,
} from '../types/departure';

// ─────────────────────────────────────────────────────────
// Hook: useDepartures
// Fetches departures for a given year/month (optional package_slug filter)
// ─────────────────────────────────────────────────────────
export function useDepartures(year: number, month: number, packageSlug?: string) {
    const [departures, setDepartures] = useState<Departure[]>([]);
    const [threshold, setThreshold]   = useState<number>(5);
    const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (year > 0) params.set('year', String(year));
            if (month > 0) params.set('month', String(month).padStart(2, '0'));
            if (packageSlug) params.set('package_slug', packageSlug);

            const res = await fetchData<DeparturesResponse>(`/departures?${params}`);
            setDepartures(res?.data || []);
            setThreshold(res?.threshold ?? 5);
            
            if (res?.package) {
                if (!res.package.banner_image && res.package.slug) {
                    // Resilience: fetch full package if banner is missing
                    fetchData<PackageInfo>(`/package/${res.package.slug}`)
                        .then(fullPkg => setPackageInfo(prev => ({ ...prev, ...fullPkg } as any)))
                        .catch(() => setPackageInfo(res.package ?? null));
                } else {
                    setPackageInfo(res.package);
                }
            } else {
                setPackageInfo(null);
            }
        } catch {
            setError('Failed to load departures.');
        } finally {
            setLoading(false);
        }
    }, [year, month, packageSlug]);

    useEffect(() => {
        load();
    }, [load]);

    return { departures: departures || [], threshold, packageInfo, loading, error, reload: load, setDepartures };
}

// ─────────────────────────────────────────────────────────
// Hook: useAllDepartures
// Fetches ALL future departures regardless of current month/year view
// ─────────────────────────────────────────────────────────
export function useAllDepartures(packageSlug?: string) {
    const [allDepartures, setAllDepartures] = useState<Departure[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (packageSlug) params.set('package_slug', packageSlug);
            const res = await fetchData<DeparturesResponse>(`/departures?${params}`);
            
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const data = res?.data || [];
            const future = data.filter(d => new Date(d.date + 'T00:00:00') >= now);
            
            setAllDepartures(future);
        } catch {
            setAllDepartures([]);
        } finally {
            setLoading(false);
        }
    }, [packageSlug]);

    useEffect(() => {
        load();
    }, [load]);

    return { allDepartures, loading, reload: load };
}

// ─────────────────────────────────────────────────────────
// Hook: usePackagesList  (for the package selector)
// ─────────────────────────────────────────────────────────
export function usePackagesList() {
    const [packages, setPackages] = useState<PackageInfo[]>([]);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        fetchData<{ data: PackageInfo[] }>('/departure-packages')
            .then(async r => {
                const pkgs = r?.data || [];
                setPackages(pkgs);
                
                // If the first few items are missing banner_image, we might want to fetch details?
                // But fetching details for ALL packages in a list is expensive.
                // For the list, we'll just stick with what we have.
            })
            .catch(() => setPackages([]))
            .finally(() => setLoading(false));
    }, []);

    return { packages: packages || [], loading };
}

// ─────────────────────────────────────────────────────────
// Hook: useSettings
// ─────────────────────────────────────────────────────────
export function useSettings(packageId?: number | null) {
    const [settings, setSettings] = useState<DepartureSettings>({ limited_threshold: 5 });
    const [loading, setLoading]   = useState(true);
    const [saving, setSaving]     = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchData<DepartureSettings>(packageId ? `/departure-settings?package_id=${packageId}` : '/departure-settings')
            .then(setSettings)
            .finally(() => setLoading(false));
    }, [packageId]);

    const updateSettings = async (val: number) => {
        setSaving(true);
        try {
            const res = await updateData<DepartureSettings>('/departure-settings', {
                limited_threshold: val,
                package_id: packageId ?? null,
            });
            setSettings(res);
            return true;
        } catch {
            return false;
        } finally {
            setSaving(false);
        }
    };

    return { settings, loading, saving, updateSettings, setSettings };
}

// ─────────────────────────────────────────────────────────
// Admin helpers (non-hook utilities)
// ─────────────────────────────────────────────────────────
export const departureApi = {
    create: (data: Omit<Departure, 'id' | 'status'>) =>
        postData<{ data: Departure }>('/departures', data),

    update: (id: number, data: Partial<Omit<Departure, 'id'>>) =>
        updateData<{ data: Departure }>(`/departures/${id}`, data),

    remove: (id: number) => deleteData<{ message: string }>(`/departures/${id}`),

    bulk: (dates: BulkDepartureItem[], packageId?: number | null) =>
        postData<{ data: Departure[] }>('/departures/bulk', {
            dates,
            package_id: packageId ?? null,
        }),

    bulkRemove: (dates: string[], packageId?: number | null) =>
        postData<{ message: string }>('/departures/bulk-delete', {
            dates,
            package_id: packageId ?? null,
        }),

    book: (payload: {
        departure_id: number;
        name: string;
        email: string;
        phone?: string;
        seats_booked: number;
        payment_type?: 'full' | 'advance';
    }) =>
        postData<{ message: string; departure: Departure; booking: unknown; success?: boolean; payment_url?: string }>(
            '/departure-bookings',
            payload
        ),
};
