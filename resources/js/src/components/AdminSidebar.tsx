import React, { useState, useEffect } from 'react';

interface MenuItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
    children?: ChildItem[];
}

interface ChildItem {
    label: string;
    href: string;
    children?: SubChildItem[];
}

interface SubChildItem {
    label: string;
    href: string;
}

// Icons (inline SVG, zero dependency)
const IconDashboard = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
);
const IconMedia = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
    </svg>
);
const IconNavigation = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
);
const IconBookings = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
    </svg>
);
const IconTours = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </svg>
);
const IconContent = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);
const IconComponents = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="6" height="6" rx="1"/><rect x="16" y="3" width="6" height="6" rx="1"/>
        <rect x="9" y="10" width="6" height="6" rx="1"/>
        <rect x="2" y="17" width="6" height="6" rx="1"/><rect x="16" y="17" width="6" height="6" rx="1"/>
    </svg>
);
const IconSettings = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
);
const IconChevron = ({ open }: { open: boolean }) => (
    <svg
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}
    >
        <polyline points="6 9 12 15 18 9"/>
    </svg>
);
const IconChevronRight = ({ open }: { open: boolean }) => (
    <svg
        width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
    >
        <polyline points="9 6 15 12 9 18"/>
    </svg>
);

// Menu Data
const MENU: MenuItem[] = [
    { label: 'Dashboard',     href: '/admin',                icon: <IconDashboard /> },
    { label: 'Media Library', href: '/admin/media-library-page',  icon: <IconMedia /> },
    { label: 'Navigation',    href: '/admin/navigation-items', icon: <IconNavigation /> },
    {
        label: 'Bookings & Messages', icon: <IconBookings />,
        children: [
            { label: 'Regular Bookings',         href: '/admin/bookings' },
            { label: 'Fixed Departure Bookings', href: '/admin/departure-bookings' },
            { label: 'Payment Logs',             href: '/admin/payment-logs' },
            { label: 'Contact Messages',         href: '/admin/contact-messages' },
            { label: 'Newsletter Subscribers',   href: '/admin/newsletter-subscribers' },
            { label: 'Trip Plans',               href: '/admin/trip-plans' },
        ],
    },
    {
        label: 'Tours & Destinations', icon: <IconTours />,
        children: [
            {
                label: 'Destinations', href: '/admin/destinations',
                children: [
                    { label: 'Major Activities', href: '/admin/sub-destinations' },
                ],
            },
            { label: 'Trekking',         href: '/admin/treks' },
            { label: 'Luxury',           href: '/admin/experiences' },
            { label: 'Products',         href: '/admin/packages' },
            { label: 'Fixed Departures', href: '/admin/departures-crud' },
        ],
    },
    {
        label: 'Content', icon: <IconContent />,
        children: [
            { label: 'Pages',  href: '/admin/pages' },
            {
                label: 'Guides', href: '/admin/guides',
                children: [
                    { label: 'Related Guides', href: '/admin/related-guides' },
                ],
            },
            { label: 'Place Explores', href: '/admin/place-explores' },
            { label: 'Additional Info', href: '/admin/additional-infos' },
            {
                label: 'Blog', href: '/admin/posts',
                children: [
                    { label: 'Posts',      href: '/admin/posts' },
                    { label: 'Categories', href: '/admin/categories' },
                    { label: 'Tags',       href: '/admin/tags' },
                    { label: 'Authors',    href: '/admin/users' },
                ],
            },
        ],
    },
    {
        label: 'Components', icon: <IconComponents />,
        children: [
            { label: 'Stats',           href: '/admin/stats' },
            { label: 'Teams',           href: '/admin/teams' },
            { label: 'Advantages',      href: '/admin/advantages' },
            { label: 'Reviews',         href: '/admin/reviews' },
            { label: 'Credentials',     href: '/admin/credentials' },
            { label: 'Credibility',     href: '/admin/credibilities' },
            { label: 'Why Choose Us',   href: '/admin/why-chooses' },
            { label: 'Legal Documents', href: '/admin/legal-documents' },
        ],
    },
    {
        label: 'Site Settings', icon: <IconSettings />,
        children: [
            { label: 'Site Settings', href: '/admin/site-settings' },
            { label: 'Admin Users', href: '/admin/users' },
            { label: 'Redirect Rules', href: '/admin/redirect-rules' },
        ],
    },
];

export default function AdminSidebar() {
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        'Bookings & Messages': false,
        'Tours & Destinations': false,
        'Content': false,
        'Components': false,
        'Site Settings': false,
    });
    const [openSubGroups, setOpenSubGroups] = useState<Record<string, boolean>>({});
    const [collapsed, setCollapsed] = useState(false);
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    const currentPath = window.location.pathname;

    // Detect theme class changes on <html> element
    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });
        return () => observer.disconnect();
    }, []);

    // Auto-open active group
    useEffect(() => {
        MENU.forEach(item => {
            if (item.children) {
                const hasActive = item.children.some(c => {
                    if (currentPath.startsWith(c.href || '')) return true;
                    return c.children?.some(sc => currentPath.startsWith(sc.href));
                });
                if (hasActive) {
                    setOpenGroups(prev => ({ ...prev, [item.label]: true }));
                }
                item.children.forEach(c => {
                    if (c.children) {
                        const subActive = currentPath.startsWith(c.href || '') || c.children.some(sc => currentPath.startsWith(sc.href));
                        if (subActive) setOpenSubGroups(prev => ({ ...prev, [c.label]: true }));
                    }
                });
            }
        });
    }, []);

    useEffect(() => {
        const toggleButtons = document.querySelectorAll('.fi-topbar-close-collapse-sidebar-btn, .fi-topbar-open-sidebar-btn, .fi-topbar-open-collapse-sidebar-btn, .fi-topbar-close-sidebar-btn');
        const handleToggle = () => {
            setCollapsed(prev => !prev);
        };
        toggleButtons.forEach(btn => btn.addEventListener('click', handleToggle));
        return () => {
            toggleButtons.forEach(btn => btn.removeEventListener('click', handleToggle));
        };
    }, []);

    const toggle = (label: string) =>
        setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
    const toggleSub = (label: string) =>
        setOpenSubGroups(prev => ({ ...prev, [label]: !prev[label] }));

    const isActive = (href?: string) => {
        if (!href) return false;
        if (href === '/admin') {
            return currentPath === '/admin' || currentPath === '/admin/';
        }
        return currentPath.startsWith(href);
    };

    // Theme values definition
    const t = {
        bg: isDark ? '#18181b' : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        borderRight: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
        boxShadow: isDark ? '4px 0 24px rgba(0,0,0,0.3)' : '4px 0 24px rgba(0,0,0,0.03)',
        colorActive: isDark ? '#f8fafc' : '#0f172a',
        colorInactive: isDark ? '#94a3b8' : '#475569',
        activeBg: isDark 
            ? 'linear-gradient(90deg, rgba(59,130,246,0.18), rgba(6,182,212,0.08))' 
            : 'linear-gradient(90deg, rgba(59,130,246,0.08), rgba(6,182,212,0.03))',
        hoverBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        hoverColor: isDark ? '#e2e8f0' : '#0f172a',
        iconActive: isDark ? '#60a5fa' : '#3b82f6',
        iconInactive: isDark ? '#64748b' : '#94a3b8',
        groupOpenBg: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
        subGroupBorder: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
        subLinkActiveColor: isDark ? '#93c5fd' : '#1d4ed8',
        subLinkActiveBg: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.06)',
        subGroupLinkColor: isDark ? '#64748b' : '#475569',
        subGroupLinkActiveColor: isDark ? '#94a3b8' : '#3b82f6',
        subGroupLinkActiveBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        chevronColor: isDark ? '#475569' : '#94a3b8',
    };

    return (
        <aside style={{
            width: collapsed ? '64px' : '260px',
            minHeight: '100vh',
            background: t.bg,
            display: 'flex',
            flexDirection: 'column',
            borderRight: t.borderRight,
            boxShadow: t.boxShadow,
            transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
            overflow: 'hidden',
            flexShrink: 0,
            position: 'relative',
            zIndex: 50,
        }}>
            {/* Navigation */}
            <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 10px' }}>
                {MENU.map(item => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isGroupOpen = openGroups[item.label];

                    if (!hasChildren) {
                        const active = item.href ? isActive(item.href) : false;
                        return (
                            <a
                                key={item.label}
                                href={item.href}
                                title={collapsed ? item.label : undefined}
                                style={{
                                    display: 'flex', alignItems: 'center',
                                    gap: collapsed ? 0 : '10px',
                                    padding: collapsed ? '10px 0' : '9px 12px',
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                    borderRadius: '8px', margin: '2px 0', textDecoration: 'none',
                                    color: active ? t.colorActive : t.colorInactive,
                                    background: active ? t.activeBg : 'transparent',
                                    borderLeft: active ? '2px solid #3b82f6' : '2px solid transparent',
                                    transition: 'all 0.15s ease',
                                    fontSize: '13.5px', fontWeight: active ? 600 : 400,
                                }}
                                onMouseEnter={e => {
                                    if (!active) {
                                        (e.currentTarget as HTMLElement).style.background = t.hoverBg;
                                        (e.currentTarget as HTMLElement).style.color = t.hoverColor;
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (!active) {
                                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                                        (e.currentTarget as HTMLElement).style.color = t.colorInactive;
                                    }
                                }}
                            >
                                <span style={{ color: active ? t.iconActive : t.iconInactive, display: 'flex', alignItems: 'center' }}>
                                    {item.icon}
                                </span>
                                {!collapsed && <span>{item.label}</span>}
                            </a>
                        );
                    }

                    return (
                        <div key={item.label} style={{ marginBottom: '4px' }}>
                            <button
                                onClick={() => toggle(item.label)}
                                style={{
                                    width: '100%', display: 'flex', alignItems: 'center',
                                    gap: collapsed ? 0 : '10px',
                                    padding: collapsed ? '10px 0' : '9px 12px',
                                    justifyContent: collapsed ? 'center' : 'space-between',
                                    borderRadius: '8px', border: 'none', cursor: 'pointer',
                                    color: isGroupOpen ? t.hoverColor : t.colorInactive,
                                    background: isGroupOpen ? t.groupOpenBg : 'transparent',
                                    fontSize: '13.5px', fontWeight: 500, textAlign: 'left',
                                    transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.background = t.hoverBg;
                                    (e.currentTarget as HTMLElement).style.color = t.hoverColor;
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.background = isGroupOpen ? t.groupOpenBg : 'transparent';
                                    (e.currentTarget as HTMLElement).style.color = isGroupOpen ? t.hoverColor : t.colorInactive;
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ color: isGroupOpen ? t.iconActive : t.iconInactive, display: 'flex', alignItems: 'center' }}>
                                        {item.icon}
                                    </span>
                                    {!collapsed && <span>{item.label}</span>}
                                </div>
                                {!collapsed && (
                                    <span style={{ color: t.chevronColor, display: 'flex', alignItems: 'center' }}>
                                        <IconChevron open={isGroupOpen} />
                                    </span>
                                )}
                            </button>

                            {!collapsed && isGroupOpen && (
                                <div style={{
                                    marginLeft: '14px', paddingLeft: '16px',
                                    borderLeft: t.subGroupBorder,
                                    marginTop: '2px', marginBottom: '4px',
                                }}>
                                    {item.children!.map(child => {
                                        const hasSub = child.children && child.children.length > 0;
                                        const isSubOpen = openSubGroups[child.label];
                                        const active = isActive(child.href);

                                        if (!hasSub) {
                                            return (
                                                <a
                                                    key={child.label}
                                                    href={child.href}
                                                    style={{
                                                        display: 'block', padding: '7px 10px',
                                                        borderRadius: '6px', textDecoration: 'none',
                                                        fontSize: '13px', fontWeight: active ? 500 : 400,
                                                        color: active ? t.subLinkActiveColor : t.colorInactive,
                                                        background: active ? t.subLinkActiveBg : 'transparent',
                                                        margin: '1px 0',
                                                        transition: 'all 0.15s ease',
                                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                    }}
                                                    onMouseEnter={e => {
                                                        if (!active) {
                                                            (e.currentTarget as HTMLElement).style.color = t.hoverColor;
                                                            (e.currentTarget as HTMLElement).style.background = t.hoverBg;
                                                        }
                                                    }}
                                                    onMouseLeave={e => {
                                                        if (!active) {
                                                            (e.currentTarget as HTMLElement).style.color = t.colorInactive;
                                                            (e.currentTarget as HTMLElement).style.background = 'transparent';
                                                        }
                                                    }}
                                                >
                                                    {child.label}
                                                </a>
                                            );
                                        }

                                        return (
                                            <div key={child.label}>
                                                <button
                                                    onClick={() => toggleSub(child.label)}
                                                    style={{
                                                        width: '100%', display: 'flex', alignItems: 'center',
                                                        justifyContent: 'space-between', padding: '7px 10px',
                                                        borderRadius: '6px', border: 'none', cursor: 'pointer',
                                                        background: 'transparent',
                                                        color: isSubOpen ? t.hoverColor : t.colorInactive,
                                                        fontSize: '13px', fontWeight: 500, textAlign: 'left',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                    onMouseEnter={e => {
                                                        (e.currentTarget as HTMLElement).style.color = t.hoverColor;
                                                        (e.currentTarget as HTMLElement).style.background = t.hoverBg;
                                                    }}
                                                    onMouseLeave={e => {
                                                        (e.currentTarget as HTMLElement).style.color = isSubOpen ? t.hoverColor : t.colorInactive;
                                                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                                                    }}
                                                >
                                                    <span>{child.label}</span>
                                                    <span style={{ color: t.chevronColor }}>
                                                        <IconChevronRight open={isSubOpen} />
                                                    </span>
                                                </button>
                                                {isSubOpen && (
                                                    <div style={{
                                                        marginLeft: '12px', paddingLeft: '12px',
                                                        borderLeft: t.subGroupBorder,
                                                    }}>
                                                        {child.label !== 'Blog' && (
                                                            <a
                                                                href={child.href}
                                                                style={{
                                                                    display: 'block', padding: '6px 8px',
                                                                    borderRadius: '5px', textDecoration: 'none',
                                                                fontSize: '12px', color: t.subGroupLinkColor,
                                                                background: 'transparent', margin: '1px 0',
                                                                transition: 'all 0.15s ease',
                                                            }}
                                                            onMouseEnter={e => {
                                                                (e.currentTarget as HTMLElement).style.color = t.subGroupLinkActiveColor;
                                                                (e.currentTarget as HTMLElement).style.background = t.subGroupLinkActiveBg;
                                                            }}
                                                            onMouseLeave={e => {
                                                                (e.currentTarget as HTMLElement).style.color = t.subGroupLinkColor;
                                                                (e.currentTarget as HTMLElement).style.background = 'transparent';
                                                            }}
                                                        >
                                                            All {child.label}
                                                        </a>
                                                            )}
                                                        {child.children!.map(sub => (
                                                            <a
                                                                key={sub.label}
                                                                href={sub.href}
                                                                style={{
                                                                    display: 'block', padding: '6px 8px',
                                                                    borderRadius: '5px', textDecoration: 'none',
                                                                    fontSize: '12px',
                                                                    color: isActive(sub.href) ? t.subLinkActiveColor : t.subGroupLinkColor,
                                                                    background: isActive(sub.href) ? t.subLinkActiveBg : 'transparent',
                                                                    margin: '1px 0',
                                                                    transition: 'all 0.15s ease',
                                                                }}
                                                                onMouseEnter={e => {
                                                                    if (!isActive(sub.href)) {
                                                                        (e.currentTarget as HTMLElement).style.color = t.subGroupLinkActiveColor;
                                                                        (e.currentTarget as HTMLElement).style.background = t.subGroupLinkActiveBg;
                                                                    }
                                                                }}
                                                                onMouseLeave={e => {
                                                                    if (!isActive(sub.href)) {
                                                                        (e.currentTarget as HTMLElement).style.color = t.subGroupLinkColor;
                                                                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                                                                    }
                                                                }}
                                                            >
                                                                {sub.label}
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
}
