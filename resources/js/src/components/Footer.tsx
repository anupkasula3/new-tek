import React, { useEffect, useState } from "react";
import {
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Mail,
    MapPin,
    Phone,
    ArrowRight,
} from "lucide-react";
import { Button } from "./ui/Button";
import { fetchData, postData } from "../axiosHook";
import BASE_URL from "../global";

export function Footer() {
    const [settings, setSettings] = useState<any>({});
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [footerNav, setFooterNav] = useState<any[]>([]);
    const [footerBottomNav, setFooterBottomNav] = useState<any[]>([]);

    useEffect(() => {
        fetchData("/global/settings").then((res) => setSettings(res || {}));
        fetchData("/global/navigation").then((res: any) => {
            if (res) setFooterNav(res?.footer ?? []);
            if (res) setFooterBottomNav(res?.footer_bottom ?? []);
        });
    }, []);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        try {
            await postData("/newsletter/subscribe", { email });
            setSubscribed(true);
            setEmail("");
        } catch (err) {
            console.error("Newsletter error", err);
        }
    };

    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#0066FF] to-[#06B6D4] bg-clip-text text-transparent flex items-center gap-2">
                            {settings?.site_name || "Himalayan Bespoke"}
                        </h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            {settings?.about_text || ""}
                        </p>
                        <div className="flex gap-4">
                            {settings?.facebook_url && (
                                <a
                                    href={settings.facebook_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 bg-gray-800 rounded-full hover:bg-[#0066FF] transition-colors"
                                >
                                    <Facebook size={18} />
                                </a>
                            )}
                            {settings?.instagram_url && (
                                <a
                                    href={settings.instagram_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 bg-gray-800 rounded-full hover:bg-[#0066FF] transition-colors"
                                >
                                    <Instagram size={18} />
                                </a>
                            )}
                            {settings?.twitter_url && (
                                <a
                                    href={settings.twitter_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 bg-gray-800 rounded-full hover:bg-[#0066FF] transition-colors"
                                >
                                    <Twitter size={18} />
                                </a>
                            )}
                            {settings?.youtube_url && (
                                <a
                                    href={settings.youtube_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 bg-gray-800 rounded-full hover:bg-[#0066FF] transition-colors"
                                >
                                    <Youtube size={18} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    {footerNav.map((item, index) => (
                        <div key={index}>
                            <h4 className="text-lg font-semibold mb-6">
                                {item.url ? (
                                    <a href={item.url}>{item.label}</a>
                                ) : (
                                    item.label
                                )}
                            </h4>
                            <ul className="space-y-3 text-gray-400">
                                {item.children.map((child: any) => (
                                    <li key={child.id}>
                                        <a
                                            href={child.url || "#"}
                                            className="hover:text-[#06B6D4] transition-colors flex items-center gap-2"
                                        >
                                            <span className="w-1.5 h-1.5 bg-[#0066FF] rounded-full"></span>
                                            {child.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">
                            Contact Us
                        </h4>
                        <ul className="space-y-4 text-gray-400">
                            {settings?.address && (
                                <li className="flex items-start gap-3">
                                    <MapPin
                                        className="text-[#0066FF] shrink-0 mt-1"
                                        size={20}
                                    />
                                    <span>{settings.address}</span>
                                </li>
                            )}
                            {settings?.primary_phone && (
                                <li className="flex items-center gap-3">
                                    <Phone
                                        className="text-[#0066FF] shrink-0"
                                        size={20}
                                    />
                                    <span>{settings.primary_phone}</span>
                                </li>
                            )}
                            {settings?.primary_email && (
                                <li className="flex items-center gap-3">
                                    <Mail
                                        className="text-[#0066FF] shrink-0"
                                        size={20}
                                    />
                                    <span>{settings.primary_email}</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">
                            Newsletter
                        </h4>
                        <p className="text-gray-400 mb-4">
                            Subscribe for latest updates and exclusive offers.
                        </p>
                        {subscribed ? (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg">
                                Thank you for subscribing!
                            </div>
                        ) : (
                            <form
                                className="space-y-3"
                                onSubmit={handleSubscribe}
                            >
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email address"
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#0066FF] text-white"
                                />
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-full justify-center"
                                >
                                    Subscribe{" "}
                                    <ArrowRight size={16} className="ml-2" />
                                </Button>
                            </form>
                        )}

                        {/* Associated Gallery */}
                        {settings?.footer_gallery_urls?.length > 0 && (
                            <div className="mt-6">
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                                    Associated with
                                </p>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {settings.footer_gallery_urls
                                        .slice(0, 4)
                                        .map((url: string, i: number) => (
                                            <div
                                                key={i}
                                                className="relative block aspect-square overflow-hidden rounded-md group bg-white p-2"
                                            >
                                                <img
                                                    src={url}
                                                    alt={`Associated ${i + 1}`}
                                                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-[#0066FF]/0 group-hover:bg-[#0066FF]/20 transition-colors duration-300 rounded-md" />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
                    <p>
                        &copy; {new Date().getFullYear()}{" "}
                        {settings?.site_name ||
                            "Himalayan Bespoke Trekking and Tours Company"}
                        . All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {footerBottomNav.map((item) => (
                            <a
                                key={item.id}
                                href={item.url || "#"}
                                className="hover:text-[#06B6D4] transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
