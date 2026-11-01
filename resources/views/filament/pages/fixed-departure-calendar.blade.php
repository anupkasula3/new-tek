<x-filament-panels::page>
    @viteReactRefresh
    @vite(['resources/js/app.tsx'])

    <div 
        id="departure-admin-mount"
        x-data="{ theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light' }"
        x-init="
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((m) => {
                    if (m.attributeName === 'class') {
                        theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                        window.dispatchEvent(new CustomEvent('filament-theme-changed', { detail: { theme } }));
                    }
                });
            });
            observer.observe(document.documentElement, { attributes: true });
            console.log('Filament Departure Mount Ready');
        "
        style="width: 100%; min-height: calc(100vh - 120px); border-radius: 0.75rem; overflow: hidden;"
    >
        <div style="padding: 40px; text-align: center; color: #6b7280;">
            Loading Departure Calendar...
        </div>
    </div>
</x-filament-panels::page>
