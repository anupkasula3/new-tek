import React from "react";
import { createRoot, Root } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./src/App";
import { DepartureAdminPage } from "./src/pages/DepartureAdminPage";
import SimpleMediaLibrary from "./src/components/SimpleMediaLibrary";
import './src/index.css';

/* ── Main SPA ──────────────────────────────────────────── */
const appContainer = document.getElementById("app");
if (appContainer) {
    createRoot(appContainer).render(
        <React.StrictMode><App /></React.StrictMode>
    );
}

/* ── Departure Admin ───────────────────────────────────── */
let adminRoot: Root | null = null;
let adminEl:   HTMLElement | null = null;

function mountDepartureAdmin() {
    const el = document.getElementById("departure-admin-mount");
    if (!el) return;
    if (el === adminEl && adminRoot) return; // already mounted on this exact node

    // Unmount previous root if DOM was swapped by Livewire
    if (adminRoot) {
        try { adminRoot.unmount(); } catch { /* ignore */ }
        adminRoot = null;
    }

    adminEl   = el;
    adminRoot = createRoot(el);
    adminRoot.render(
        <React.StrictMode>
            <BrowserRouter><DepartureAdminPage /></BrowserRouter>
        </React.StrictMode>
    );
}

// ① Try immediately (direct page load)
mountDepartureAdmin();

// ② MutationObserver — fires whenever Livewire injects #departure-admin-mount into the DOM
const departureObserver = new MutationObserver(() => mountDepartureAdmin());
departureObserver.observe(document.body, { childList: true, subtree: true });

// ③ Livewire navigation event
document.addEventListener('livewire:navigated', () => {
    setTimeout(mountDepartureAdmin, 0);
    setTimeout(mountDepartureAdmin, 100);
    setTimeout(mountDepartureAdmin, 300);
});

// ④ Fallback polling after any navigation
document.addEventListener('livewire:navigating', () => {
    [100, 300, 600, 1000, 2000].forEach(ms => setTimeout(mountDepartureAdmin, ms));
});

/* ── Standalone Media Library ──────────────────────────── */
let mlRoot: Root | null = null;
let mlEl:   HTMLElement | null = null;

function mountMediaLibrary() {
    const el = document.getElementById("media-library-mount");
    if (!el) return;
    if (el === mlEl && mlRoot) return; // already mounted on this exact node

    // Unmount previous root if DOM was swapped by Livewire
    if (mlRoot) {
        try { mlRoot.unmount(); } catch { /* ignore */ }
        mlRoot = null;
    }

    mlEl   = el;
    mlRoot = createRoot(el);
    mlRoot.render(
        <React.StrictMode>
            <SimpleMediaLibrary fieldId="standalone" />
        </React.StrictMode>
    );
}

// ① Try immediately (direct page load)
mountMediaLibrary();

// ② MutationObserver — fires whenever Livewire injects #media-library-mount into the DOM
const observer = new MutationObserver(() => mountMediaLibrary());
observer.observe(document.body, { childList: true, subtree: true });

// ③ Livewire navigation event
document.addEventListener('livewire:navigated', () => {
    // Give Livewire a tick to finish patching the DOM
    setTimeout(mountMediaLibrary, 0);
    setTimeout(mountMediaLibrary, 100);
    setTimeout(mountMediaLibrary, 300);
});

// ④ Fallback polling for the first 5 seconds after any navigation
document.addEventListener('livewire:navigating', () => {
    [100, 300, 600, 1000, 2000].forEach(ms => setTimeout(mountMediaLibrary, ms));
});

/* ── Media Picker (inside Filament form modals) ─────────── */
const pickerRoots: Record<string, Root> = {};

window.addEventListener('open-media-picker', (e: any) => {
    const { fieldId } = e.detail;

    const mount = () => {
        const el = document.getElementById(`media-picker-mount-${fieldId}`);
        if (!el) return false;

        // If we've already mounted on THIS EXACT element, don't do it again
        if (el.getAttribute('data-mounted') === 'true') return true;

        // If a root already exists for this fieldId, unmount it first 
        // (it might be an old DOM node that was swapped by Livewire)
        if (pickerRoots[fieldId]) {
            try {
                pickerRoots[fieldId].unmount();
            } catch (err) {
                // ignore unmount errors on detached nodes
            }
            delete pickerRoots[fieldId];
        }

        const root = createRoot(el);
        pickerRoots[fieldId] = root;
        el.setAttribute('data-mounted', 'true');
        
        root.render(
            <React.StrictMode>
                <SimpleMediaLibrary fieldId={fieldId} />
            </React.StrictMode>
        );
        return true;
    };

    if (!mount()) {
        // Retry a few times with small delays in case Alpine teleportation is still rendering the DOM node
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            if (mount() || attempts >= 10) {
                clearInterval(interval);
                if (attempts >= 10) {
                    console.error('Media picker container not found after retries:', fieldId);
                }
            }
        }, 50);
    }
});
