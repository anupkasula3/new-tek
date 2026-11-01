import React, { useEffect, useState } from 'react';
import { fetchData } from '../axiosHook';

function Loading() {
    const [faviconUrl, setFaviconUrl] = useState(() => {
        if (typeof document !== 'undefined') {
            const cachedSettings = sessionStorage.getItem('nav_site_settings');
            if (cachedSettings) {
                try {
                    const parsed = JSON.parse(cachedSettings);
                    if (parsed?.favicon_url) return parsed.favicon_url;
                } catch (e) {}
            }
            const faviconLink = document.querySelector("link[rel*='icon']");
            if (faviconLink) {
                const href = faviconLink.getAttribute('href');
                if (href) return href;
            }
        }
        return '/favicon.ico';
    });

    useEffect(() => {
        fetchData<any>("/global/settings")
            .then((settings) => {
                if (settings && settings.favicon_url) {
                    setFaviconUrl(settings.favicon_url);
                    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
                    if (!link) {
                        link = document.createElement('link');
                        link.rel = 'icon';
                        document.getElementsByTagName('head')[0].appendChild(link);
                    }
                    link.href = settings.favicon_url;
                }
            })
            .catch((err) => console.error("Error fetching settings in Loading:", err));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen fixed inset-0 bg-white/90 backdrop-blur-sm z-[99999]">
            <div className="relative flex items-center justify-center">
                {/* Outer pulsing ring */}
                <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-20" />
                
                {/* Logo container */}
                <div className="relative bg-white p-6 rounded-full shadow-2xl border border-slate-50 animate-pulse flex items-center justify-center">
                    <img 
                        src={faviconUrl} 
                        alt="Loading Logo" 
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </div>
            </div>
            
            <div className="mt-8 flex flex-col items-center gap-2">
                <p className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] animate-pulse">
                    Loading
                </p>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                </div>
            </div>
        </div>
    );
}

export default Loading;
