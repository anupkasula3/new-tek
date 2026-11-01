import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight, Calendar, Users, MapPin } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';

export const BookingSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const orderNo = searchParams.get('orderNo');
    const type = searchParams.get('type');
    const isInquiry = type === 'inquiry';

    useEffect(() => {
        // Google Ads conversion tracking — Booking / inquiry form submission
        if (typeof (window as any).gtag === 'function') {
            (window as any).gtag('event', 'conversion', {
                'send_to': 'AW-18352751866/tP_zCIqhg9ccEPqJo69E',
                'value': 1.0,
                'currency': 'USD',
            });
        }
    }, []);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Navbar forceWhite />
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                        {isInquiry ? "Inquiry Sent Successfully!" : "Booking Confirmed!"}
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        {isInquiry 
                            ? "Thank you! Your inquiry has been sent successfully. Our team will review your preferences and get back to you shortly."
                            : "Thank you for choosing Himalayan Bespoke. Your adventure has been successfully booked and we've sent a confirmation email to your inbox."
                        }
                    </p>

                    <div className="bg-gray-50 rounded-3xl p-8 mb-12 border border-gray-100 text-left grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                {isInquiry ? "Inquiry Details" : "Reservation Details"}
                            </h3>
                            <ul className="space-y-4">
                                {!isInquiry && (
                                    <li className="flex items-center gap-3 text-gray-700">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                            <Calendar className="w-4 h-4 text-[#0066FF]" />
                                        </div>
                                        <span>Booking Reference: <strong>#{orderNo || 'N/A'}</strong></span>
                                    </li>
                                )}
                                <li className="flex items-center gap-3 text-gray-700">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                        <CheckCircle className="w-4 h-4 text-[#0066FF]" />
                                    </div>
                                    <span>Status: <span className={`${isInquiry ? 'text-blue-600 bg-blue-50' : 'text-green-600 bg-green-50'} font-bold uppercase text-xs px-2 py-1 rounded-full`}>
                                        {isInquiry ? 'Submitted' : 'Paid'}
                                    </span></span>
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-gray-600 text-sm leading-relaxed italic">
                                "The mountains are calling and I must go." Our team will reach out to you shortly with detailed pre-departure information.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link 
                            to="/" 
                            className="bg-[#0066FF] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-blue-700 transition-all flex items-center gap-2 group shadow-lg"
                        >
                            Return to Home <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        {!isInquiry && (
                            <Link 
                                to={`/invoice/${orderNo}`} 
                                target="_blank"
                                className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-gray-50 transition-all"
                            >
                                Statement
                            </Link>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
