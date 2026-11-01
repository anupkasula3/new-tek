import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import axios from 'axios';

interface FormState {
    fullName: string;
    nationality: string;
    email: string;
    telephone: string;
    message: string;
}

interface ApiErrors {
    [key: string]: string[];
}

const initialForm: FormState = {
    fullName: '',
    nationality: '',
    email: '',
    telephone: '',
    message: '',
};

export function ContactForm() {
    const [formState, setFormState] = useState<FormState>(initialForm);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [apiErrors, setApiErrors] = useState<ApiErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
        // Clear field error on change
        if (apiErrors[e.target.name]) {
            setApiErrors(prev => {
                const next = { ...prev };
                delete next[e.target.name];
                return next;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setApiErrors({});
        setServerError(null);

        try {
            await axios.post('/api/contact', {
                full_name:   formState.fullName,
                nationality: formState.nationality,
                email:       formState.email,
                telephone:   formState.telephone,
                message:     formState.message,
            });

            setStatus('success');
            setFormState(initialForm);
            
            // Redirect to success page
            window.location.href = '/contact/success';
        } catch (err: any) {
            if (err.response?.status === 422) {
                // Validation errors from Laravel
                setApiErrors(err.response.data?.errors ?? {});
                setStatus('idle');
            } else if (err.response?.status === 429) {
                setServerError('Too many messages sent. Please wait a minute before trying again.');
                setStatus('error');
            } else {
                setServerError('Something went wrong. Please try again later or email us directly.');
                setStatus('error');
            }
        }
    };

    const fieldError = (field: string) => {
        const key = field === 'fullName' ? 'full_name' : field;
        return apiErrors[key]?.[0] ?? null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-10"
        >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

            {/* Success message */}
            {status === 'success' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3"
                >
                    <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                    <p className="text-green-800 font-medium">
                        Message sent successfully! We'll get back to you within 24 hours.
                    </p>
                </motion.div>
            )}

            {/* Server error message */}
            {status === 'error' && serverError && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"
                >
                    <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                    <p className="text-red-800 font-medium">{serverError}</p>
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-1">
                    <label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        value={formState.fullName}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${fieldError('fullName') ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none transition-all`}
                        placeholder="Enter your full name"
                    />
                    {fieldError('fullName') && (
                        <p className="text-sm text-red-600">{fieldError('fullName')}</p>
                    )}
                </div>

                {/* Nationality */}
                <div className="space-y-1">
                    <label htmlFor="nationality" className="text-sm font-semibold text-gray-700">
                        Nationality <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="nationality"
                        name="nationality"
                        required
                        value={formState.nationality}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${fieldError('nationality') ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none transition-all`}
                        placeholder="Enter your nationality"
                    />
                    {fieldError('nationality') && (
                        <p className="text-sm text-red-600">{fieldError('nationality')}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${fieldError('email') ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none transition-all`}
                        placeholder="your.email@example.com"
                    />
                    {fieldError('email') && (
                        <p className="text-sm text-red-600">{fieldError('email')}</p>
                    )}
                </div>

                {/* Telephone */}
                <div className="space-y-1">
                    <label htmlFor="telephone" className="text-sm font-semibold text-gray-700">
                        Telephone
                    </label>
                    <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={formState.telephone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none transition-all"
                        placeholder="+1 (555) 000-0000"
                    />
                </div>

                {/* Message */}
                <div className="space-y-1">
                    <label htmlFor="message" className="text-sm font-semibold text-gray-700">
                        Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formState.message}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-lg border ${fieldError('message') ? 'border-red-400 bg-red-50' : 'border-gray-300'} focus:ring-2 focus:ring-[#0066FF] focus:border-transparent outline-none transition-all resize-none`}
                        placeholder="Tell us about your inquiry..."
                    />
                    {fieldError('message') && (
                        <p className="text-sm text-red-600">{fieldError('message')}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full justify-center py-4 text-lg"
                    disabled={status === 'submitting'}
                >
                    {status === 'submitting' ? (
                        <span className="flex items-center gap-2">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Sending...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Submit <Send size={18} />
                        </span>
                    )}
                </Button>
            </form>
        </motion.div>
    );
}