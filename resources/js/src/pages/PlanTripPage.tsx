import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { PricingSection } from '../components/PricingSection';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, Clock, Mail, Phone, User, MessageSquare, CheckCircle, Send, AlertCircle, Mountain } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { fetchData, postData } from '../axiosHook';
import { useSearchParams } from 'react-router-dom';

export function PlanTripPage() {
  const [searchParams] = useSearchParams();
  const packageName = searchParams.get('package');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    package_id: '',
    destination_id: '',
    duration: '',
    group_size: '',
    preferred_date: '',
    budget_range: '',
    additional_info: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [packagesList, setPackagesList] = useState<{id: number, title: string}[]>([]);

  const groupSizes = ['Solo', '2-4 People', '5-10 People', '10+ People'];

  React.useEffect(() => {
    const getPackages = async () => {
      try {
        const res = await fetchData<any>("/all-packages");
        if (Array.isArray(res)) {
          setPackagesList(res);
          if (res.length > 0) {
            setFormData(prev => ({ ...prev, package_id: prev.package_id || res[0]?.id?.toString() || '' }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch packages", err);
      }
    };
    getPackages();
  }, []);

  const pId = searchParams.get('packageId');
  const dId = searchParams.get('destId');

  React.useEffect(() => {
    if (pId) {
      setFormData(prev => ({ ...prev, package_id: pId }));
    }
    if (dId) {
      setFormData(prev => ({ ...prev, destination_id: dId }));
    }
  }, [pId, dId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await postData<{success: boolean, message: string}>("/trip-plans", formData);
      if (res.success) {
        window.location.href = '/plan-trip/success';
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };



  return <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 pt-52 pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Plan Your Dream Trip
            </h1>
            <p className="text-gray-300 text-lg">
              Tell us about your ideal adventure and we'll create a personalized
              itinerary just for you
            </p>
          </motion.div>
        </div>
      </div>

      {/* Pricing Section */}
      {/* <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Sample Package Pricing
              </h2>
              <p className="text-gray-600 text-lg">
                Get an idea of what's included in our comprehensive trek packages
              </p>
            </div>
            <PricingSection />
          </motion.div>
        </div>
      </section> */}

      {/* Form Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Customize Your Trip
          </h2>
          {packageName && (
            <div className="inline-flex items-center gap-3 bg-[#0066FF]/5 border border-[#0066FF] px-6 py-3 rounded-2xl mb-4">
              <img 
                src={typeof document !== 'undefined' ? (document.querySelector("link[rel*='icon']")?.getAttribute('href') || '/favicon.ico') : '/favicon.ico'} 
                alt="Favicon" 
                className="w-5 h-5 object-contain" 
              />
              <p className="text-gray-900 font-semibold">
                Enquiring about: <span className="text-[#0066FF]">{packageName}</span>
              </p>
            </div>
          )}
        </motion.div>

        <motion.form initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }} onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <User size={24} className="text-[#0066FF]" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input type="text" required value={formData.full_name} onChange={e => setFormData({
                ...formData,
                full_name: e.target.value
              })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" required value={formData.email} onChange={e => setFormData({
                  ...formData,
                  email: e.target.value
                })} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent" placeholder="john@example.com" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" required value={formData.phone} onChange={e => setFormData({
                  ...formData,
                  phone: e.target.value
                })} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent" placeholder="+1 (555) 123-4567" />
                </div>
              </div>
            </div>
          </div>

          {/* Trip Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin size={24} className="text-[#0066FF]" />
              Trip Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Package *
                </label>
                <select required value={formData.package_id} onChange={e => setFormData({
                ...formData,
                package_id: e.target.value
              })} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent">
                  <option value="">Select package</option>
                  {packagesList.map(pkg => <option key={pkg.id} value={pkg.id}>
                      {pkg.title}
                    </option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Travel Date *
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="date" required min={new Date().toISOString().split('T')[0]} value={formData.preferred_date} onChange={e => setFormData({
                  ...formData,
                  preferred_date: e.target.value
                })} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Group Size *
                </label>
                <div className="relative">
                  <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select required value={formData.group_size} onChange={e => setFormData({
                  ...formData,
                  group_size: e.target.value
                })} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent">
                    <option value="">Select group size</option>
                    {groupSizes.map(size => <option key={size} value={size}>
                        {size}
                      </option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>


          {/* Additional Information */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare size={24} className="text-[#0066FF]" />
              Additional Information
            </h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tell us more about your dream trip
              </label>
              <textarea value={formData.additional_info} onChange={e => setFormData({
              ...formData,
              additional_info: e.target.value
            })} rows={6} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent resize-none" placeholder="Any specific requirements, dietary restrictions, fitness level, or special requests..." />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type="submit" variant="primary" size="lg" className="px-12 flex items-center gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Submit Trip Request
                  <Send size={18} />
                </>
              )}
            </Button>
          </div>
        </motion.form>
      </main>

      <Footer />
    </div>;
}