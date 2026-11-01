<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sitemap | Himalayan Bespoke & Expedition</title>
    @php
        $siteSetting = \App\Models\SiteSetting::first();
        $faviconUrl = $siteSetting && $siteSetting->favicon ? $siteSetting->favicon_url : asset('assets/images/logo.png');
    @endphp
    <link rel="icon" type="image/x-icon" href="{{ $faviconUrl }}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet">

    <style>
        :root {
            --bg-primary: hsl(220, 25%, 10%);
            --bg-secondary: hsl(220, 25%, 15%);
            --bg-card: hsl(220, 25%, 18%);
            --accent: hsl(28, 90%, 55%);
            --accent-hover: hsl(28, 95%, 60%);
            --text-primary: hsl(210, 20%, 95%);
            --text-secondary: hsl(210, 15%, 75%);
            --text-muted: hsl(210, 10%, 55%);
            --border: hsl(220, 20%, 25%);
            --shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
            --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            --font: 'Outfit', sans-serif;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            background-color: var(--bg-primary);
            color: var(--text-primary);
            font-family: var(--font);
            line-height: 1.6;
            padding: 2rem 1.5rem;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
        }

        header {
            text-align: center;
            margin-bottom: 4rem;
            position: relative;
        }

        header::after {
            content: '';
            display: block;
            width: 80px;
            height: 4px;
            background: var(--accent);
            margin: 1.5rem auto 0;
            border-radius: 2px;
            box-shadow: 0 0 15px var(--accent);
        }

        h1 {
            font-size: 3rem;
            font-weight: 800;
            letter-spacing: -0.5px;
            background: linear-gradient(135deg, var(--text-primary) 30%, var(--text-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }

        .subtitle {
            font-size: 1.1rem;
            color: var(--text-secondary);
            font-weight: 400;
            max-width: 600px;
            margin: 0 auto;
        }

        .sitemap-list {
            display: flex;
            flex-direction: column;
            gap: 2.5rem;
            margin-bottom: 4rem;
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }

        .sitemap-section {
            border-bottom: 1px solid var(--border);
            padding-bottom: 1.5rem;
        }

        .sitemap-section:last-of-type {
            border-bottom: none;
        }

        .section-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--accent);
            margin-bottom: 1.25rem;
        }

        .link-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
            padding-left: 0.5rem;
        }

        .link-item a {
            color: var(--text-secondary);
            text-decoration: none;
            transition: var(--transition);
            font-size: 0.95rem;
            display: inline-flex;
            align-items: center;
            position: relative;
            padding-left: 0.8rem;
        }

        .link-item a::before {
            content: '→';
            position: absolute;
            left: 0;
            opacity: 0;
            transform: translateX(-5px);
            transition: var(--transition);
            color: var(--accent);
        }

        .link-item a:hover {
            color: var(--accent);
            padding-left: 1.2rem;
        }

        .link-item a:hover::before {
            opacity: 1;
            transform: translateX(0);
        }

        .link-badge {
            font-size: 0.7rem;
            padding: 0.15rem 0.4rem;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.08);
            color: var(--text-muted);
            margin-left: 0.5rem;
            font-weight: 500;
            text-transform: uppercase;
        }

        .link-item a:hover .link-badge {
            background: rgba(249, 115, 22, 0.15);
            color: var(--accent);
        }

        .footer {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid var(--border);
            color: var(--text-muted);
            font-size: 0.85rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
            max-width: 800px;
            margin: 0 auto;
            width: 100%;
        }

        .xml-btn {
            background-color: var(--bg-card);
            border: 1px solid var(--border);
            color: var(--text-secondary);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            text-decoration: none;
            font-size: 0.8rem;
            font-weight: 500;
            transition: var(--transition);
        }

        .xml-btn:hover {
            background-color: var(--accent);
            color: var(--bg-primary);
            border-color: var(--accent);
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 2.25rem;
            }

            .sitemap-list {
                max-width: 100%;
                padding: 0 1rem;
            }

            .footer {
                flex-direction: column;
                text-align: center;
            }
        }
    </style>
</head>

<body>

    <div class="container">
        <header>
            <h1>Sitemap</h1>
            <p class="subtitle">Complete directory of travel destinations, itineraries, guides, and pages for Himalayan
                Bespoke Trekking & Expedition.</p>
        </header>

        <main class="sitemap-list">
            <!-- Quick Links -->
            <section class="sitemap-section">
                <h2 class="section-title">Main Directories</h2>
                <ul class="link-list">
                    <li class="link-item"><a href="{{ url('/') }}">Home Page <span class="link-badge">home</span></a>
                    </li>
                    <li class="link-item"><a href="{{ url('/about') }}">About Us <span
                                class="link-badge">info</span></a></li>
                    <li class="link-item"><a href="{{ url('/blog') }}">Our Blog <span
                                class="link-badge">updates</span></a></li>
                    <li class="link-item"><a href="{{ url('/departures') }}">Departure Calendar <span
                                class="link-badge">booking</span></a></li>
                    <li class="link-item"><a href="{{ url('/plan-trip') }}">Plan a Trip <span
                                class="link-badge">custom</span></a></li>
                </ul>
            </section>

            <!-- Destinations -->
            <section class="sitemap-section">
                <h2 class="section-title">Destinations</h2>
                <ul class="link-list">
                    @forelse($destinations as $dest)
                        <li class="link-item"><a href="{{ url('/destination/' . $dest->slug) }}">{{ $dest->name }}</a></li>
                    @empty
                        <li class="link-item" style="color: var(--text-muted);">No destinations available.</li>
                    @endforelse
                </ul>
            </section>

            <!-- Major Activities -->
            <section class="sitemap-section">
                <h2 class="section-title">Major Activities</h2>
                <ul class="link-list">
                    @forelse($subDestinations as $sub)
                        <li class="link-item"><a
                                href="{{ url('/' . ($sub->destination_slug ?? 'nepal') . '/' . $sub->slug) }}">{{ $sub->name }}</a>
                        </li>
                    @empty
                        <li class="link-item" style="color: var(--text-muted);">No major activities available.</li>
                    @endforelse
                </ul>
            </section>

            <!-- Treks -->
            <section class="sitemap-section">
                <h2 class="section-title">Trekking Regions</h2>
                <ul class="link-list">
                    @forelse($treks as $trek)
                        <li class="link-item"><a href="{{ url('/trekking/' . $trek->slug) }}">{{ $trek->name }}</a></li>
                    @empty
                        <li class="link-item" style="color: var(--text-muted);">No trekking regions available.</li>
                    @endforelse
                </ul>
            </section>

            <!-- Packages -->
            <section class="sitemap-section">
                <h2 class="section-title">Tours &amp; Packages</h2>
                <ul class="link-list">
                    @forelse($packages as $pkg)
                        <li class="link-item"><a href="{{ url('/' . $pkg->slug) }}">{{ $pkg->title }}</a></li>
                    @empty
                        <li class="link-item" style="color: var(--text-muted);">No packages available.</li>
                    @endforelse
                </ul>
            </section>

            <!-- Experiences -->
            <section class="sitemap-section">
                <h2 class="section-title">Luxury</h2>
                <ul class="link-list">
                    @forelse($experiences as $exp)
                        <li class="link-item"><a href="{{ url('/luxury/' . $exp->slug) }}">{{ $exp->title }}</a></li>
                    @empty
                        <li class="link-item" style="color: var(--text-muted);">No experiences available.</li>
                    @endforelse
                </ul>
            </section>

            <!-- Travel Guides -->
            <section class="sitemap-section">
                <h2 class="section-title">Travel Guides</h2>
                <ul class="link-list">
                    @forelse($guides as $guide)
                        <li class="link-item"><a href="{{ url('/guide/' . $guide->slug) }}">{{ $guide->title }}</a></li>
                    @empty
                        <li class="link-item" style="color: var(--text-muted);">No travel guides available.</li>
                    @endforelse
                </ul>
            </section>

            <!-- Essential Information -->
            <section class="sitemap-section">
                <h2 class="section-title">Essential Information</h2>
                <ul class="link-list">
                    @forelse($additionalInfos as $info)
                        <li class="link-item"><a href="{{ url('/additional-info/' . $info->slug) }}">{{ $info->title }}</a>
                        </li>
                    @empty
                        <li class="link-item" style="color: var(--text-muted);">No extra information available.</li>
                    @endforelse
                </ul>
            </section>

            <!-- Latest Articles -->
            <section class="sitemap-section">
                <h2 class="section-title">Blog Articles</h2>
                <ul class="link-list">
                    @forelse($posts as $post)
                        <li class="link-item"><a href="{{ url('/blog/' . $post->slug) }}">{{ $post->title }}</a></li>
                    @empty
                        <li class="link-item" style="color: var(--text-muted);">No blog posts available.</li>
                    @endforelse
                </ul>
            </section>
        </main>

        <footer class="footer">
            <div>
                &copy; {{ date('Y') }} Himalayan Bespoke &amp; Expedition. All rights reserved.
            </div>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <a href="{{ url('/sitemap.xml') }}" class="xml-btn" target="_blank">XML Sitemap Index</a>
                <a href="{{ url('/sitemap-main.xml') }}" class="xml-btn" target="_blank">XML Main</a>
                <a href="{{ url('/sitemap-images.xml') }}" class="xml-btn" target="_blank">XML Images</a>
                <a href="{{ url('/sitemap-videos.xml') }}" class="xml-btn" target="_blank">XML Videos</a>
                <a href="{{ url('/sitemap-news.xml') }}" class="xml-btn" target="_blank">XML News</a>
            </div>
        </footer>
    </div>

</body>

</html>