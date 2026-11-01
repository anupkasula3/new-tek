import React from 'react';
import { XCircle, ArrowRight, RefreshCcw, MessageSquare } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';

export const BookingFailurePage = () => {
    const [searchParams] = useSearchParams();
    const orderNo = searchParams.get('orderNo');
    const errorMessage = searchParams.get('message');

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Navbar forceWhite />
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                        <XCircle className="w-12 h-12 text-red-600" />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Payment Failed</h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        {errorMessage || "We encountered an issue while processing your payment. Don't worry, your spot hasn't been lost—please try again or contact our support team."}
                    </p>

                    <div className="bg-gray-50 rounded-3xl p-8 mb-12 border border-gray-100 text-left">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">What happened?</h3>
                        <p className="text-gray-700 mb-6">
                            Transaction reference: <strong>#{orderNo || 'N/A'}</strong>
                        </p>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                <span>Insufficient funds or card limit reached.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                <span>Incorrect card information or expired card.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                <span>The bank declined the transaction for security reasons.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        <button 
                            onClick={() => window.history.back()}
                            className="bg-[#0066FF] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-blue-700 transition-all flex items-center gap-2 group shadow-lg cursor-pointer"
                        >
                            <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /> 
                            Try Again
                        </button>
                        <Link 
                            to="/contact" 
                            className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-gray-50 transition-all flex items-center gap-2"
                        >
                            <MessageSquare className="w-5 h-5 text-[#0066FF]" /> 
                            Contact Support
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
