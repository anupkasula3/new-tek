import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Mountain } from "lucide-react";
import { fetchData } from "../axiosHook";
import { NotFoundPage } from './NotFoundPage';
function InvoiceSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 p-8 md:p-16 flex flex-col items-center">
            <div className="max-w-4xl w-full bg-white p-12 rounded-xl shadow-sm space-y-12">
                <div className="flex justify-between border-b-2 border-gray-100 pb-8">
                    <div className="dc-skeleton dc-skeleton-title w-48" />
                    <div className="dc-skeleton dc-skeleton-row w-32" />
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="dc-skeleton dc-skeleton-row w-24" />
                        <div className="dc-skeleton dc-skeleton-row" />
                        <div className="dc-skeleton dc-skeleton-row" />
                    </div>
                    <div className="space-y-4 flex flex-col items-end">
                        <div className="dc-skeleton dc-skeleton-row w-24" />
                        <div className="dc-skeleton dc-skeleton-row w-48" />
                        <div className="dc-skeleton dc-skeleton-row w-32" />
                    </div>
                </div>
                <div className="space-y-4 pt-12">
                    <div className="dc-skeleton h-12 w-full rounded-lg" />
                    <div className="dc-skeleton h-12 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
}

export const InvoicePage = () => {
    const { orderNo } = useParams();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [siteSettings, setSiteSettings] = useState<any>({});
    const [isDownloading, setIsDownloading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        if (document.referrer && document.referrer.includes('/booking/success')) {
            setVerified(true);
        }
    }, []);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const settingsRes: any = await fetchData("/global/settings");
                if (settingsRes) setSiteSettings(settingsRes);

                // We'll need a backend endpoint for this or just fetch from search params if passed, 
                // but since it's a separate page, an API call is better.
                const response = await axios.get(`/api/booking/details/${orderNo}`);
                setBooking(response.data);
            } catch (error) {
                console.error("Error fetching booking details", error);
            } finally {
                setLoading(false);
            }
        };

        if (orderNo) {
            fetchBooking();
        }
    }, [orderNo]);

    const downloadStatement = () => {
        window.print();
    };

    if (loading) return <InvoiceSkeleton />;
    if (!booking) return <NotFoundPage />;

    if (!verified) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
                <div className="bg-white p-10 max-w-md w-full shadow-xl rounded-3xl text-center border border-gray-100">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                        <img 
                            src={typeof document !== 'undefined' ? (document.querySelector("link[rel*='icon']")?.getAttribute('href') || '/favicon.ico') : '/favicon.ico'} 
                            alt="Favicon" 
                            className="w-10 h-10 object-contain" 
                        />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Access Statement</h2>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">For security purposes, please enter the email address used for this booking.</p>
                    
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (emailInput.toLowerCase().trim() === booking.email.toLowerCase().trim()) {
                            setVerified(true);
                        } else {
                            setEmailError("Incorrect email address. Please try again.");
                        }
                    }} className="space-y-4">
                        <div>
                            <input 
                                type="email" 
                                required
                                value={emailInput}
                                onChange={(e) => {
                                    setEmailInput(e.target.value);
                                    setEmailError('');
                                }}
                                placeholder="Enter your booking email"
                                className="w-full px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all text-sm"
                            />
                            {emailError && <p className="text-red-500 text-xs font-bold mt-2 text-left px-1">{emailError}</p>}
                        </div>
                        
                        <button type="submit" className="w-full bg-[#0066FF] hover:bg-blue-700 shadow-lg shadow-blue-500/30 text-white font-bold py-4 px-4 rounded-xl uppercase tracking-widest text-xs transition-all hover:-translate-y-0.5">
                            Verify & View
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const date = new Date(booking.created_at).toLocaleDateString();
    const travelDate = new Date(booking.preferred_travel_date).toLocaleDateString();

    return (
        <div className="min-h-screen bg-gray-50 p-8 md:p-16 flex flex-col items-center print:bg-white print:p-0 print:block">
            
            {/* Download Action */}
            <div className="mb-8 w-full max-w-4xl flex justify-end print:hidden">
                <button 
                    onClick={downloadStatement}
                    className="bg-[#0066FF] hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl transition-all"
                >
                    Download Statement
                </button>
            </div>

            {/* Statement Content */}
            <div id="statement-content" className="bg-white p-12 print:p-0 max-w-4xl w-full shadow-sm print:shadow-none rounded-xl">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            {siteSettings?.logo_url ? (
                                <img src={siteSettings.logo_url} alt="Logo" className="h-16 w-auto object-contain" />
                            ) : (
                                <div className="p-1 rounded-lg bg-white flex items-center justify-center w-8 h-8">
                                    <img 
                                        src={typeof document !== 'undefined' ? (document.querySelector("link[rel*='icon']")?.getAttribute('href') || '/favicon.ico') : '/favicon.ico'} 
                                        alt="Logo" 
                                        className="w-6 h-6 object-contain" 
                                    />
                                </div>
                            )}
                            <h1 className="text-3xl font-black text-[#0066FF] tracking-tighter">
                                {siteSettings?.site_name || "Himalayan Bespoke"}
                            </h1>
                        </div>
                        <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Booking Statement</p>
                    </div>
                <div className="text-right">
                    <p className="font-bold text-gray-900">Order #{booking.order_no}</p>
                    <p className="text-gray-500 text-xs">Date: {date}</p>
                </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-8 mb-12 print:mb-6">
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Billed To</h4>
                    <p className="text-lg font-bold text-gray-900">{booking.name}</p>
                    <p className="text-gray-600">{booking.email}</p>
                    <p className="text-gray-600">{booking.phone}</p>
                </div>
                <div className="text-right">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Trek Information</h4>
                    <p className="text-lg font-bold text-gray-900">{booking.package?.name || 'Package Booking'}</p>
                    <p className="text-gray-600">Travel Date: {travelDate}</p>
                    <p className="text-gray-600">{booking.persons} {booking.persons === 1 ? 'Person' : 'Persons'}</p>
                </div>
            </div>

            {/* Table */}
            <table className="w-full mb-12 print:mb-6">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Description</th>
                        <th className="text-right py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-gray-50">
                        <td className="py-6">
                            <p className="font-bold text-gray-900">Package Booking Fee</p>
                            <p className="text-gray-500 text-sm italic capitalize">({booking.payment_type} Payment)</p>
                        </td>
                        <td className="text-right py-6 font-bold text-gray-900">
                            {booking.currency} {Number(booking.amount || 0).toFixed(2)}
                        </td>
                    </tr>
                    {booking.payment_type === 'advance' && (
                        <tr className="border-b border-gray-50">
                            <td className="py-6">
                                <p className="font-bold text-gray-900">Remaining Balance</p>
                                <p className="text-gray-500 text-sm italic">(To be collected later)</p>
                            </td>
                            <td className="text-right py-6 font-bold text-gray-400">
                                {booking.currency} {Number(booking.remaining_balance || 0).toFixed(2)}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Footer Calculation */}
            <div className="flex justify-end mb-20 print:mb-8">
                <div className="w-64">
                    <div className="flex justify-between py-2">
                        <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Total Paid</span>
                        <span className="font-black text-xl text-[#0066FF]">{booking.currency} {Number(booking.amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-gray-100 mt-2">
                        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest italic">Status</span>
                        <span className="text-green-600 font-black uppercase text-xs tracking-widest">Paid</span>
                    </div>
                </div>
            </div>

            {/* Terms */}
            <div className="border-t border-gray-100 pt-8 text-[10px] text-gray-400 leading-relaxed">
                <p className="mb-2 uppercase font-bold tracking-widest text-gray-500">Legal Information</p>
                <p>This is a computer-generated invoice and does not require a physical signature. All bookings are subject to our standard terms and conditions. Please keep this for your records.</p>
                <div className="mt-4 flex flex-col items-center border-t border-gray-50 pt-4">
                    {siteSettings?.logo_url ? (
                        <img src={siteSettings.logo_url} alt="Logo" className="h-8 w-auto object-contain mb-2" />
                    ) : (
                        <div className="p-1 rounded-md bg-white flex items-center justify-center w-6 h-6 mb-2">
                            <img 
                                src={typeof document !== 'undefined' ? (document.querySelector("link[rel*='icon']")?.getAttribute('href') || '/favicon.ico') : '/favicon.ico'} 
                                alt="Logo" 
                                className="w-4 h-4 object-contain" 
                            />
                        </div>
                    )}
                    <p className="font-bold tracking-widest uppercase">
                        {siteSettings?.site_name }
                    </p>
                </div>
            </div>
            </div>
        </div>
    );
};
