import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight, MessageSquare, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';

export const ContactSuccessPage = () => {
    useEffect(() => {
        // Google Ads conversion tracking — Contact form submission
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
                <div className="max-w-2xl mx-auto text-center">

                    {/* Animated icon */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                            Message Sent!
                        </h1>
                        <p className="text-xl text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
                            Thank you for reaching out. Our team will review your message and get back to you within <strong className="text-gray-800">24 hours</strong>.
                        </p>
                    </motion.div>

                    {/* Info card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gray-50 rounded-3xl p-8 mb-10 border border-gray-100 text-left"
                    >
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
                            What happens next?
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                                    <Mail className="w-4 h-4 text-[#0066FF]" />
                                </div>
                                <span className="text-gray-700 text-sm leading-relaxed">
                                    You'll receive a confirmation email shortly at the address you provided.
                                </span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                                    <MessageSquare className="w-4 h-4 text-[#0066FF]" />
                                </div>
                                <span className="text-gray-700 text-sm leading-relaxed">
                                    Our expert team will personally review your inquiry and reply within 24 hours.
                                </span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                                    <Phone className="w-4 h-4 text-[#0066FF]" />
                                </div>
                                <span className="text-gray-700 text-sm leading-relaxed">
                                    For urgent inquiries, feel free to call us directly — our team is available 7 days a week.
                                </span>
                            </li>
                        </ul>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.45 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <Link
                            to="/"
                            className="bg-[#0066FF] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-blue-700 transition-all flex items-center gap-2 group shadow-lg"
                        >
                            Return to Home
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/contact"
                            className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-gray-50 transition-all"
                        >
                            Back to Contact
                        </Link>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
