@php
    $siteSetting = \App\Models\SiteSetting::first();
    $logoUrl = $siteSetting?->sticky_logo_url ?? $siteSetting?->logo_url;
@endphp
<div style="display: flex; align-items: center; gap: 0.75rem;">
    @if($logoUrl)
        <img src="{{ $logoUrl }}"
             alt="{{ $siteSetting?->site_name ?? 'Logo' }}"
             style="height: 2.5rem; width: auto;" />
    @endif
    <span style="font-size: 1.25rem; font-weight: 700; letter-spacing: -0.025em; color: inherit;">
        {{ $siteSetting?->site_name ?? '' }}
    </span>
</div>