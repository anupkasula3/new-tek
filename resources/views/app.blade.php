<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    @php
        $siteSetting = \App\Models\SiteSetting::first();
        $faviconUrl = $siteSetting && $siteSetting->favicon ? $siteSetting->favicon_url : asset('assets/images/logo.png');
        // $seo is injected by App\Http\Middleware\InjectSeoMeta
        $seo = $seo ?? [];
    @endphp
    <link rel="icon" type="image/x-icon" href="{{ $faviconUrl }}">

    {{-- ═══════════════════════════════════════════════════════════
         SERVER-SIDE SEO TAGS  (visible in view-source)
         These are resolved per-URL by InjectSeoMeta middleware.
         React Helmet will override them after JS loads for SPA nav.
         Tags are only rendered when real data exists — no fallbacks.
    ═══════════════════════════════════════════════════════════ --}}
    @if(!empty($seo['title']))
    <title>{{ $seo['title'] }}</title>
    @endif
    @if(!empty($seo['description']))
    <meta name="description" content="{{ $seo['description'] }}" />
    @endif
    @if(!empty($seo['robots']))
    <meta name="robots" content="{{ $seo['robots'] }}" />
    @endif
    @if(!empty($seo['canonical']))
    <link rel="canonical" href="{{ $seo['canonical'] }}" />
    @endif

    {{-- Open Graph --}}
    @if(!empty($seo['ogTitle']))
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="{{ $seo['siteName'] ?? 'Himalayan Bespoke' }}" />
    <meta property="og:title" content="{{ $seo['ogTitle'] }}" />
    @if(!empty($seo['ogDescription']))
    <meta property="og:description" content="{{ $seo['ogDescription'] }}" />
    @endif
    @if(!empty($seo['canonical']))
    <meta property="og:url" content="{{ $seo['canonical'] }}" />
    @endif
    @if(!empty($seo['ogImage']))
    <meta property="og:image" content="{{ $seo['ogImage'] }}" />
    @endif
    @endif

    {{-- Twitter Card --}}
    @if(!empty($seo['twitterTitle']))
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{{ $seo['twitterTitle'] }}" />
    @if(!empty($seo['twitterDescription']))
    <meta name="twitter:description" content="{{ $seo['twitterDescription'] }}" />
    @endif
    @if(!empty($seo['twitterImage']))
    <meta name="twitter:image" content="{{ $seo['twitterImage'] }}" />
    @endif
    @endif

    <!-- Organization + WebSite JSON-LD Structured Data (homepage, server-rendered) -->
    <script type="application/ld+json">
    {
        "@@context": "https://schema.org",
        "@@graph": [
            {
                "@@type": ["TravelAgency", "Organization"],
                "@@id": "https://himalayantrekking.com/#organization",
                "name": "Himalayan Bespoke",
                "legalName": "Himalayan Bespoke Trekking and Tours Company",
                "alternateName": ["Himalayan Bespoke Trekking", "Himalayan Bespoke Trekking and Tours"],
                "url": "https://himalayantrekking.com/",
                "logo": {
                    "@@type": "ImageObject",
                    "@@id": "https://himalayantrekking.com/#logo",
                    "url": "https://himalayantrekking.com/uploads/himalayan-bespoke-logo.png",
                    "contentUrl": "https://himalayantrekking.com/uploads/himalayan-bespoke-logo.png",
                    "caption": "Himalayan Bespoke"
                },
                "image": { "@@id": "https://himalayantrekking.com/#logo" },
                "description": "Himalayan Bespoke Trekking and Tours Company is a Nepal-based travel company offering trekking, tours, and adventure holidays across Nepal, Tibet, and Bhutan with expert guides and personalized service.",
                "email": "sales@himalayantrekking.com",
                "telephone": "+977-9851032316",
                "address": {
                    "@@type": "PostalAddress",
                    "streetAddress": "Link Road, Nayabazaar-16",
                    "addressLocality": "Kathmandu",
                    "addressRegion": "Bagmati Province",
                    "postalCode": "44600",
                    "addressCountry": "NP"
                },
                "contactPoint": [
                    {
                        "@@type": "ContactPoint",
                        "contactType": "sales",
                        "telephone": "+977-9851032316",
                        "email": "sales@himalayantrekking.com",
                        "areaServed": ["NP", "CN", "BT"],
                        "availableLanguage": ["English", "Nepali"]
                    },
                    {
                        "@@type": "ContactPoint",
                        "contactType": "customer service",
                        "telephone": "+977-1-4260802",
                        "availableLanguage": ["English", "Nepali"]
                    }
                ],
                "openingHoursSpecification": [
                    {
                        "@@type": "OpeningHoursSpecification",
                        "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                        "opens": "09:00",
                        "closes": "18:00"
                    }
                ],
                "areaServed": [
                    { "@@type": "Country", "name": "Nepal" },
                    { "@@type": "Place", "name": "Tibet" },
                    { "@@type": "Country", "name": "Bhutan" }
                ],
                "sameAs": [
                    "https://www.facebook.com/himalayanbespoke",
                    "https://www.instagram.com/himalayanbespoke",
                    "https://x.com/himalayanbspoke",
                    "https://www.youtube.com/@himalayanbespoke",
                    "https://www.tripadvisor.com/Attraction_Review-g293890-d2272067-Reviews-Himalayan_Bespoke_Trekking_and_Tours_Company-Kathmandu_Kathmandu_Valley_Bagmati_Z.html"
                ]
            },
            {
                "@@type": "WebSite",
                "@@id": "https://himalayantrekking.com/#website",
                "url": "https://himalayantrekking.com/",
                "name": "Himalayan Bespoke",
                "alternateName": ["Himalayan Bespoke Trekking", "Himalayan Trekking"],
                "inLanguage": "en",
                "publisher": { "@@id": "https://himalayantrekking.com/#organization" }
            }
        ]
    }
    </script>

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XPGNMJZ9LP"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XPGNMJZ9LP');
        gtag('config', 'AW-18352751866');
    </script>

    @if($siteSetting && !empty($siteSetting->custom_code_scripts))
        @foreach($siteSetting->custom_code_scripts as $script)
            {!! $script['code'] !!}
        @endforeach
    @endif
</head>

<body>

    <div id="app"></div>

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])

</body>
</html>