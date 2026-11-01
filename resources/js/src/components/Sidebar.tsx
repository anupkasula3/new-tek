import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    Image, 
    Compass, 
    BookOpen, 
    Globe, 
    FileText, 
    Layers, 
    Settings, 
    ChevronDown, 
    ChevronRight,
    Menu
} from 'lucide-react';

// Menu item types
interface MenuItem {
    title: string;
    path?: string;
    icon?: React.ComponentType<any>;
    children?: MenuItem[];
}

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const toggleButtons = document.querySelectorAll('.fi-topbar-close-collapse-sidebar-btn, .fi-topbar-open-sidebar-btn');
        const handleToggle = () => {
            setCollapsed(prev => !prev);
        };
        toggleButtons.forEach(btn => btn.addEventListener('click', handleToggle));
        return () => {
            toggleButtons.forEach(btn => btn.removeEventListener('click', handleToggle));
        };
    }, []);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        'Bookings & Messages': true,
        'Tours & Destinations': false,
        'Content': false,
        'Components': false,
    });
    
    // To handle inner nested collapses (e.g., Destinations, Guides, Blog)
    const [openSubGroups, setOpenSubGroups] = useState<Record<string, boolean>>({
        'Destinations': false,
        'Guides': false,
        'Blog': false,
    });

    const toggleGroup = (title: string) => {
        setOpenGroups(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    const toggleSubGroup = (title: string) => {
        setOpenSubGroups(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    const menuStructure: MenuItem[] = [
        {
            title: 'Dashboard',
            path: '/admin/dashboard',
            icon: LayoutDashboard
        },
        {
            title: 'Media Library',
            path: '/admin/media',
            icon: Image
        },
        {
            title: 'Navigation',
            path: '/admin/navigation',
            icon: Compass
        },
        {
            title: 'Bookings & Messages',
            icon: BookOpen,
            children: [
                { title: 'Regular Bookings', path: '/admin/bookings/regular' },
                { title: 'Fixed Departure Bookings', path: '/admin/bookings/departure' },
                { title: 'Payment Logs', path: '/admin/bookings/payments' },
                { title: 'Contact Messages', path: '/admin/bookings/messages' },
                { title: 'Newsletter Subscribers', path: '/admin/bookings/subscribers' },
                { title: 'Trip Plans', path: '/admin/bookings/plans' }
            ]
        },
        {
            title: 'Tours & Destinations',
            icon: Globe,
            children: [
                {
                    title: 'Destinations',
                    children: [
                        { title: 'Major Activities', path: '/admin/tours/destinations/sub' }
                    ]
                },
                { title: 'Trekking', path: '/admin/tours/trekking' },
                { title: 'Luxury', path: '/admin/tours/luxury' },
                { title: 'Products', path: '/admin/tours/products' },
                { title: 'Fixed Departures', path: '/admin/tours/departures' }
            ]
        },
        {
            title: 'Content',
            icon: FileText,
            children: [
                { title: 'Pages', path: '/admin/content/pages' },
                {
                    title: 'Guides',
                    children: [
                        { title: 'Related Guides', path: '/admin/content/guides/related' }
                    ]
                },
                { title: 'Place Explores', path: '/admin/components/place-explores' },
                {
                    title: 'Blog',
                    children: [
                        { title: 'Posts', path: '/admin/content/blog/posts' },
                        { title: 'Categories', path: '/admin/content/blog/categories' },
                        { title: 'Tags', path: '/admin/content/blog/tags' }
                    ]
                }
            ]
        },
        {
            title: 'Components',
            icon: Layers,
            children: [
                { title: 'Stats', path: '/admin/components/stats' },
                { title: 'Teams', path: '/admin/components/teams' },
                { title: 'Advantages', path: '/admin/components/advantages' },
                { title: 'Reviews', path: '/admin/components/reviews' },
                { title: 'Credentials', path: '/admin/components/credentials' },
                { title: 'Why Choose Us', path: '/admin/components/why-choose-us' },
                { title: 'Place Explores', path: '/admin/components/place-explores' },
                { title: 'Legal Documents', path: '/admin/components/legal-documents' }
            ]
        },
        {
            title: 'Site Settings',
            path: '/admin/settings',
            icon: Settings
        }
    ];

    return (
        <aside 
            className={`min-h-screen bg-white dark:bg-[#18181b] text-slate-800 dark:text-slate-100 flex flex-col transition-all duration-300 border-r border-slate-200 dark:border-slate-800 shadow-2xl select-none
                ${collapsed ? 'w-20' : 'w-72'}`}
        >
           

            {/* Scrollable Navigation Items */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {menuStructure.map((item, index) => {
                    const Icon = item.icon;
                    const hasChildren = item.children && item.children.length > 0;
                    const isOpen = openGroups[item.title];

                    if (!hasChildren) {
                        return (
                            <a
                                key={index}
                                href={item.path}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:dark:text-white transition-all duration-200 group"
                            >
                                {Icon && <Icon size={20} className="text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors shrink-0" />}
                                {!collapsed && <span className="text-sm font-medium tracking-wide">{item.title}</span>}
                            </a>
                        );
                    }

                    return (
                        <div key={index} className="space-y-1">
                            {/* Parent Collapsible Label */}
                            <button
                                onClick={() => !collapsed && toggleGroup(item.title)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-100/60 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:dark:text-white transition-all duration-200 group
                                    ${collapsed ? 'pointer-events-none' : ''}`}
                            >
                                <div className="flex items-center gap-3">
                                    {Icon && <Icon size={20} className="text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors shrink-0" />}
                                    {!collapsed && <span className="text-sm font-medium tracking-wide">{item.title}</span>}
                                </div>
                                {!collapsed && (
                                    <ChevronDown 
                                        size={16} 
                                        className={`text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-200
                                            ${isOpen ? 'rotate-180' : ''}`} 
                                    />
                                )}
                            </button>

                            {/* Nested Level 1 Children (Collapsible Container) */}
                            {!collapsed && isOpen && (
                                <div className="pl-9 space-y-1 border-l border-slate-200 dark:border-slate-800 ml-6 mt-1 transition-all duration-300">
                                    {item.children?.map((child, cIndex) => {
                                        const hasSubChildren = child.children && child.children.length > 0;
                                        const isSubOpen = openSubGroups[child.title];

                                        if (!hasSubChildren) {
                                            return (
                                                <a
                                                    key={cIndex}
                                                    href={child.path}
                                                    className="block py-2 px-3 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100/40 dark:hover:bg-slate-800/40 transition-all duration-200"
                                                >
                                                    {child.title}
                                                </a>
                                            );
                                        }

                                        return (
                                            <div key={cIndex} className="space-y-1">
                                                {/* Sub-parent Collapsible Label */}
                                                <button
                                                    onClick={() => toggleSubGroup(child.title)}
                                                    className="w-full flex items-center justify-between py-2 px-3 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100/40 dark:hover:bg-slate-800/40 transition-all duration-200"
                                                >
                                                    <span>{child.title}</span>
                                                    <ChevronRight 
                                                        size={12} 
                                                        className={`text-slate-400 dark:text-slate-500 transition-transform duration-200
                                                            ${isSubOpen ? 'rotate-90' : ''}`} 
                                                    />
                                                </button>

                                                {/* Nested Level 2 Children */}
                                                {isSubOpen && (
                                                    <div className="pl-4 space-y-1 border-l border-slate-200 dark:border-slate-800/80 ml-2 mt-1">
                                                        {child.children?.map((subChild, scIndex) => (
                                                            <a
                                                                key={scIndex}
                                                                href={subChild.path}
                                                                className="block py-1.5 px-3 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100/30 dark:hover:bg-slate-800/30 transition-all duration-200"
                                                            >
                                                                {subChild.title}
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
            </div>

        </aside>
    );
}
