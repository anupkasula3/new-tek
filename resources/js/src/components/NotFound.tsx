import React from 'react';
import { Compass } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface NotFoundProps {
    message?: string;
    onBack?: () => void;
}

export default function NotFound({
    message = 'Content Not Found',
    onBack = () => window.history.back(),
}: NotFoundProps) {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar forceWhite={true} hideBreadcrumb={true} />
            <div className="flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-16">
                <div className="text-center max-w-md my-auto">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center">
                            <Compass className="w-10 h-10 text-stone-400 animate-bounce" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{message}</h2>
                    <p className="text-stone-500 text-sm mb-8">
                        The page you're looking for might have been moved, deleted, or doesn't exist.
                    </p>
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 bg-[#0066FF] text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md shadow-blue-200"
                    >
                        ← Go Back
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
